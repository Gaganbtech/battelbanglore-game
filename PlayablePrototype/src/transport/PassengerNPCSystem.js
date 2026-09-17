// Bengaluru Metropolitan Transport Passenger & Driver NPC Simulation
// BENGALURU: LAST CITY - Phase 2.5
import * as THREE from 'three';

export class PassengerNPCSystem {
  constructor(scene, bmtcBusSystem, busStopSystem) {
    this.scene = scene;
    this.bmtcBusSystem = bmtcBusSystem;
    this.busStopSystem = busStopSystem;
    this.group = new THREE.Group();

    this.civilians = []; // All civilian NPCs (waiting, boarding, seated)
    this.drivers = [];   // Bus drivers

    this.initPassengerArchetypes();
    this.spawnBusStopWaiters();
    this.spawnOnboardPassengers();
    this.spawnBusDrivers();

    this.scene.add(this.group);
  }

  initPassengerArchetypes() {
    // Curated color palettes for realistic Bengaluru commuters
    this.palettes = [
      { shirt: 0x1e3a8a, pants: 0x334155, skin: 0xa06d50, hair: 0x171717, name: 'Tech Engineer' },
      { shirt: 0xd97706, pants: 0x1e293b, skin: 0x8b5a3c, hair: 0x1a1a1a, name: 'Commuter' },
      { shirt: 0x059669, pants: 0x475569, skin: 0xb5805e, hair: 0x262626, name: 'College Student' },
      { shirt: 0xf1f5f9, pants: 0x0f172a, skin: 0x935e40, hair: 0x1c1917, name: 'Executive' },
      { shirt: 0x7c3aed, pants: 0x374151, skin: 0xad7654, hair: 0x292524, name: 'Designer' }
    ];
  }

  createHumanoidCivilian(palette, isSeated = false) {
    const root = new THREE.Group();

    const skinMat = new THREE.MeshStandardMaterial({
      color: palette.skin,
      roughness: 0.72,
      metalness: 0.05
    });
    const shirtMat = new THREE.MeshStandardMaterial({
      color: palette.shirt,
      roughness: 0.65,
      metalness: 0.1
    });
    const pantsMat = new THREE.MeshStandardMaterial({
      color: palette.pants,
      roughness: 0.7,
      metalness: 0.05
    });
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 });
    const hairMat = new THREE.MeshStandardMaterial({ color: palette.hair, roughness: 0.9 });

    // 1. Pelvis & Torso
    const pelvisY = isSeated ? 0.5 : 0.95;
    const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.18, 0.22), pantsMat);
    pelvis.position.y = pelvisY;
    root.add(pelvis);

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.46, 0.24), shirtMat);
    torso.position.y = pelvisY + 0.32;
    torso.castShadow = true;
    root.add(torso);

    // Collar / Tie / Backpack detail
    const collar = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.08), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    collar.position.set(0, pelvisY + 0.54, 0.1);
    root.add(collar);

    // 2. Head & Hair
    const headGroup = new THREE.Group();
    headGroup.position.y = pelvisY + 0.68;

    const cranium = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.23, 0.2), skinMat);
    cranium.castShadow = true;
    headGroup.add(cranium);

    const hair = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.1, 0.22), hairMat);
    hair.position.set(0, 0.1, -0.01);
    headGroup.add(hair);

    // Eyes / Glasses
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1f2937 });
    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.025, 0.02), eyeMat);
    eyeL.position.set(0.05, 0.02, 0.105);
    const eyeR = eyeL.clone();
    eyeR.position.x = -0.05;
    headGroup.add(eyeL);
    headGroup.add(eyeR);

    root.add(headGroup);

    // 3. Limbs (Standing vs Seated)
    const legGeo = new THREE.BoxGeometry(0.14, 0.44, 0.15);
    const armGeo = new THREE.BoxGeometry(0.11, 0.42, 0.12);

    if (isSeated) {
      // Thighs extended forward
      const thighGeo = new THREE.BoxGeometry(0.14, 0.15, 0.4);
      const thighL = new THREE.Mesh(thighGeo, pantsMat);
      thighL.position.set(0.1, pelvisY - 0.04, 0.18);
      const thighR = new THREE.Mesh(thighGeo, pantsMat);
      thighR.position.set(-0.1, pelvisY - 0.04, 0.18);
      root.add(thighL);
      root.add(thighR);

      // Calves hanging down
      const calfGeo = new THREE.BoxGeometry(0.13, 0.4, 0.14);
      const calfL = new THREE.Mesh(calfGeo, pantsMat);
      calfL.position.set(0.1, pelvisY - 0.25, 0.36);
      const calfR = new THREE.Mesh(calfGeo, pantsMat);
      calfR.position.set(-0.1, pelvisY - 0.25, 0.36);
      root.add(calfL);
      root.add(calfR);

      // Resting arms
      const armL = new THREE.Mesh(armGeo, shirtMat);
      armL.rotation.x = Math.PI / 4;
      armL.position.set(0.24, pelvisY + 0.2, 0.15);
      const armR = new THREE.Mesh(armGeo, shirtMat);
      armR.rotation.x = Math.PI / 4;
      armR.position.set(-0.24, pelvisY + 0.2, 0.15);
      root.add(armL);
      root.add(armR);
    } else {
      // Standing upright
      const legL = new THREE.Mesh(legGeo, pantsMat);
      legL.position.set(0.1, 0.48, 0);
      legL.castShadow = true;
      const legR = new THREE.Mesh(legGeo, pantsMat);
      legR.position.set(-0.1, 0.48, 0);
      legR.castShadow = true;
      root.add(legL);
      root.add(legR);

      // Shoes
      const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.22), shoeMat);
      shoeL.position.set(0.1, 0.05, 0.03);
      const shoeR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.22), shoeMat);
      shoeR.position.set(-0.1, 0.05, 0.03);
      root.add(shoeL);
      root.add(shoeR);

      // Standing arms
      const armL = new THREE.Mesh(armGeo, shirtMat);
      armL.position.set(0.24, pelvisY + 0.24, 0);
      armL.castShadow = true;
      const armR = new THREE.Mesh(armGeo, shirtMat);
      armR.position.set(-0.24, pelvisY + 0.24, 0);
      armR.castShadow = true;
      root.add(armL);
      root.add(armR);

      root.userData.armL = armL;
      root.userData.armR = armR;
      root.userData.head = headGroup;
    }

    return root;
  }

  createDriverMesh() {
    const root = new THREE.Group();

    // BMTC Standard Khaki Driver Uniform
    const khakiMat = new THREE.MeshStandardMaterial({ color: 0x92704a, roughness: 0.7 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xa06d50, roughness: 0.7 });
    const capMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5 }); // Navy driver peak cap

    // Seated torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.48, 0.26), khakiMat);
    torso.position.y = 0.55;
    root.add(torso);

    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.22, 0.2), skinMat);
    head.position.y = 0.92;
    root.add(head);

    // Official Peak Cap
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.15, 0.08, 12), capMat);
    cap.position.set(0, 1.05, 0);
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 0.1), new THREE.MeshBasicMaterial({ color: 0x0a0a0a }));
    visor.position.set(0, 1.02, 0.1);
    root.add(cap);
    root.add(visor);

    // Forward Steering Arms
    const armGeo = new THREE.BoxGeometry(0.1, 0.38, 0.1);
    const armL = new THREE.Mesh(armGeo, khakiMat);
    armL.rotation.x = Math.PI / 3;
    armL.rotation.z = -Math.PI / 10;
    armL.position.set(0.22, 0.55, 0.2);

    const armR = new THREE.Mesh(armGeo, khakiMat);
    armR.rotation.x = Math.PI / 3;
    armR.rotation.z = Math.PI / 10;
    armR.position.set(-0.22, 0.55, 0.2);

    root.add(armL);
    root.add(armR);

    root.userData.armL = armL;
    root.userData.armR = armR;

    return root;
  }

  spawnBusStopWaiters() {
    if (!this.busStopSystem || !this.busStopSystem.stops) return;

    this.busStopSystem.stops.forEach((stop, stopIdx) => {
      // Spawn 2-3 passengers waiting under shelter or near curb
      const count = 2 + (stopIdx % 2);
      for (let i = 0; i < count; i++) {
        const palette = this.palettes[(stopIdx * 2 + i) % this.palettes.length];
        const npc = this.createHumanoidCivilian(palette, false);

        // Position on platform near the stop
        const offsetX = (i - 1) * 2.2;
        const offsetZ = 1.6 + (i % 2) * 0.8;
        npc.position.set(stop.pos.x + offsetX, 0, stop.pos.z + offsetZ);
        npc.rotation.y = stop.yaw || 0;

        npc.userData = {
          state: 'waiting',
          stopId: stop.id,
          targetBus: null,
          animOffset: Math.random() * Math.PI * 2,
          homePos: npc.position.clone()
        };

        this.civilians.push(npc);
        this.group.add(npc);
      }
    });
  }

  spawnOnboardPassengers() {
    const dd = this.bmtcBusSystem.doubleDeckerBus;
    if (!dd) return;

    // 1. Lower Deck Passengers (Seated along rows)
    const lowerPositions = [
      { x: -1.8, y: 0.95, z: 0.78, yaw: 0 },
      { x: 0.6, y: 0.95, z: -0.78, yaw: Math.PI },
      { x: 2.2, y: 0.95, z: 0.78, yaw: 0 }
    ];

    lowerPositions.forEach((cfg, idx) => {
      const palette = this.palettes[idx % this.palettes.length];
      const npc = this.createHumanoidCivilian(palette, true);
      npc.position.set(cfg.x, cfg.y, cfg.z);
      npc.rotation.y = cfg.yaw;
      dd.add(npc); // Attached directly to Double-Decker local space!
      this.civilians.push(npc);
    });

    // 2. Upper Deck Front Panoramic VIP Viewers!
    // Front row sitting right at the front viewing window
    const upperPositions = [
      { x: 4.8, y: 2.85, z: 0.65, yaw: Math.PI / 2 },  // Front Left panoramic seat
      { x: 4.8, y: 2.85, z: -0.65, yaw: Math.PI / 2 }, // Front Right panoramic seat
      { x: 1.5, y: 2.85, z: 0.75, yaw: 0 }
    ];

    upperPositions.forEach((cfg, idx) => {
      const palette = this.palettes[(idx + 2) % this.palettes.length];
      const npc = this.createHumanoidCivilian(palette, true);
      npc.position.set(cfg.x, cfg.y, cfg.z);
      npc.rotation.y = cfg.yaw;
      dd.add(npc); // Attached directly to Upper Deck local space!
      this.civilians.push(npc);
    });
  }

  spawnBusDrivers() {
    // 1. Double-Decker Driver
    if (this.bmtcBusSystem.doubleDeckerBus) {
      const dd = this.bmtcBusSystem.doubleDeckerBus;
      const driver = this.createDriverMesh();
      driver.position.set(12.8 * 0.42 - 0.15, 0.92, -2.85 * 0.25);
      driver.rotation.y = Math.PI / 2;
      dd.add(driver);
      this.drivers.push({ mesh: driver, bus: dd });
    }

    // 2. Single Decker Bus Drivers
    if (this.bmtcBusSystem.buses) {
      this.bmtcBusSystem.buses.forEach(bus => {
        if (!bus.userData.isDoubleDecker) {
          const driver = this.createDriverMesh();
          driver.position.set(11.2 * 0.38 - 0.1, 0.8, -2.6 * 0.24);
          driver.rotation.y = Math.PI / 2;
          bus.add(driver);
          this.drivers.push({ mesh: driver, bus: bus });
        }
      });
    }
  }

  update(delta) {
    const time = Date.now() * 0.002;

    // 1. Animate Bus Drivers (Oscillate arms with bus turns)
    this.drivers.forEach(d => {
      const steerFactor = Math.sin(time * 1.5) * 0.25;
      if (d.mesh.userData.armL) {
        d.mesh.userData.armL.rotation.z = -Math.PI / 10 + steerFactor;
        d.mesh.userData.armR.rotation.z = Math.PI / 10 + steerFactor;
      }
    });

    // 2. Animate Waiting Civilians
    this.civilians.forEach(npc => {
      if (!npc.userData || npc.userData.state !== 'waiting') return;

      const offset = npc.userData.animOffset || 0;
      // Subtle idle breathing and head turns looking for bus
      if (npc.userData.head) {
        npc.userData.head.rotation.y = Math.sin(time * 0.8 + offset) * 0.35;
        npc.userData.head.rotation.x = Math.sin(time * 0.4 + offset) * 0.08;
      }

      // Occasional phone checking animation
      if (npc.userData.armR) {
        const checkPhone = Math.sin(time * 0.5 + offset);
        if (checkPhone > 0.6) {
          npc.userData.armR.rotation.x = THREE.MathUtils.lerp(npc.userData.armR.rotation.x, Math.PI / 2.5, delta * 3);
          npc.userData.armR.rotation.z = THREE.MathUtils.lerp(npc.userData.armR.rotation.z, -0.3, delta * 3);
        } else {
          npc.userData.armR.rotation.x = THREE.MathUtils.lerp(npc.userData.armR.rotation.x, 0, delta * 2);
          npc.userData.armR.rotation.z = THREE.MathUtils.lerp(npc.userData.armR.rotation.z, 0, delta * 2);
        }
      }
    });
  }
}
