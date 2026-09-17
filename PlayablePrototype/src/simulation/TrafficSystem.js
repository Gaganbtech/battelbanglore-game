// Optimized Bengaluru Traffic Simulation (Phase 5)
// Features Two-Wheelers, Auto-Rickshaws, BMTC Buses, and Civilian Cars.
// Optimized with shared material pooling, distance LOD, and zero per-car SpotLights.
import * as THREE from 'three';

export class TrafficSystem {
  constructor(scene) {
    this.scene = scene;
    this.vehicles = [];
    this.group = new THREE.Group();

    // Shared Material Pool (Eliminates repeated shader allocations)
    this.materials = {
      autoGreen: new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.5 }),
      autoYellow: new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 }),
      tireBlack: new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.9 }),
      glass: new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.9 }),
      chrome: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8, roughness: 0.2 }),
      scooterRed: new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.4 }),
      scooterBlue: new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 }),
      bikeSilver: new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.6, roughness: 0.3 }),
      busGreen: new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.4 }),
      busBlue: new THREE.MeshStandardMaterial({ color: 0x1e40af, roughness: 0.4 }),
      carWhite: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 }),
      carSilver: new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.4, roughness: 0.3 }),
      headlightOn: new THREE.MeshBasicMaterial({ color: 0xfef08a }),
      taillightOn: new THREE.MeshBasicMaterial({ color: 0xef4444 })
    };

    this.spawnOptimizedTrafficFleet();
    this.scene.add(this.group);
  }

  spawnOptimizedTrafficFleet() {
    // 1. Authentic Two-Wheelers (Bengaluru's signature commuter fleet)
    for (let i = 0; i < 6; i++) {
      const twoWheeler = i % 2 === 0 ? this.createScooter(i) : this.createMotorcycle(i);
      twoWheeler.route = 'EW';
      twoWheeler.dir = 1;
      twoWheeler.speed = 13 + Math.random() * 4;
      twoWheeler.mesh.position.set(-240 + i * 80, 0.2, -7.5);
      this.vehicles.push(twoWheeler);
      this.group.add(twoWheeler.mesh);
    }

    // 2. Auto-Rickshaws
    for (let i = 0; i < 6; i++) {
      const auto = this.createAutoRickshaw();
      auto.route = 'WE';
      auto.dir = -1;
      auto.speed = 10 + Math.random() * 3;
      auto.mesh.position.set(240 - i * 80, 0.4, 7.5);
      auto.mesh.rotation.y = Math.PI;
      this.vehicles.push(auto);
      this.group.add(auto.mesh);
    }

    // 3. BMTC City Buses
    for (let i = 0; i < 4; i++) {
      const bus = this.createBMTCBus(i % 2 === 0);
      bus.route = 'EW';
      bus.dir = 1;
      bus.speed = 8.5 + Math.random() * 2.5;
      bus.mesh.position.set(-200 + i * 110, 0.5, -4.5);
      this.vehicles.push(bus);
      this.group.add(bus.mesh);
    }

    // 4. Civilian Cars (Sedans / Hatchbacks)
    for (let i = 0; i < 6; i++) {
      const car = this.createCivilianCar(i);
      car.route = 'NS';
      car.dir = -1;
      car.speed = 12 + Math.random() * 4;
      car.mesh.position.set(6.5, 0.45, 230 - i * 80);
      car.mesh.rotation.y = -Math.PI / 2;
      this.vehicles.push(car);
      this.group.add(car.mesh);
    }
  }

  createScooter(idx) {
    const scoot = new THREE.Group();
    const colorMat = idx % 2 === 0 ? this.materials.scooterRed : this.materials.scooterBlue;

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.6, 0.55), colorMat);
    body.position.y = 0.5;
    scoot.add(body);

    const apron = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.75, 0.55), colorMat);
    apron.position.set(0.75, 0.75, 0);
    scoot.add(apron);

    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.16, 0.4), this.materials.tireBlack);
    seat.position.set(-0.15, 0.85, 0);
    scoot.add(seat);

    // Wheels
    [-0.6, 0.7].forEach(wx => {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.14, 10), this.materials.tireBlack);
      w.rotation.x = Math.PI / 2;
      w.position.set(wx, 0.26, 0);
      scoot.add(w);
    });

    const headlight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.15, 0.25), this.materials.headlightOn);
    headlight.position.set(0.85, 0.95, 0);
    scoot.add(headlight);

    return { mesh: scoot, type: 'scooter', headlight };
  }

  createMotorcycle(idx) {
    const bike = new THREE.Group();
    const tank = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.4), this.materials.bikeSilver);
    tank.position.set(0.2, 0.8, 0);
    bike.add(tank);

    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.15, 0.35), this.materials.tireBlack);
    seat.position.set(-0.35, 0.8, 0);
    bike.add(seat);

    // Wheels
    [-0.8, 0.8].forEach(wx => {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.12, 10), this.materials.tireBlack);
      w.rotation.x = Math.PI / 2;
      w.position.set(wx, 0.35, 0);
      bike.add(w);
    });

    const headlight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.18, 0.2), this.materials.headlightOn);
    headlight.position.set(0.85, 0.9, 0);
    bike.add(headlight);

    return { mesh: bike, type: 'motorcycle', headlight };
  }

  createAutoRickshaw() {
    const autoGroup = new THREE.Group();

    // Lower Cabin
    const body = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.1, 1.7), this.materials.autoGreen);
    body.position.y = 0.65;
    autoGroup.add(body);

    // Yellow Canopy Hood
    const hood = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 1.65), this.materials.autoYellow);
    hood.position.set(-0.3, 1.6, 0);
    autoGroup.add(hood);

    // Windshield frame
    const shield = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.85, 1.4), this.materials.glass);
    shield.position.set(1.0, 1.5, 0);
    autoGroup.add(shield);

    // Wheels
    const frontWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.2, 10), this.materials.tireBlack);
    frontWheel.rotation.x = Math.PI / 2;
    frontWheel.position.set(1.2, 0.35, 0);
    autoGroup.add(frontWheel);

    [-0.85, 0.85].forEach(wz => {
      const rearWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.2, 10), this.materials.tireBlack);
      rearWheel.rotation.x = Math.PI / 2;
      rearWheel.position.set(-1.0, 0.35, wz);
      autoGroup.add(rearWheel);
    });

    const headlight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.25, 0.35), this.materials.headlightOn);
    headlight.position.set(1.65, 0.7, 0);
    autoGroup.add(headlight);

    return { mesh: autoGroup, type: 'auto', headlight };
  }

  createBMTCBus(isSuvarna = true) {
    const busGroup = new THREE.Group();
    const busMat = isSuvarna ? this.materials.busGreen : this.materials.busBlue;

    const body = new THREE.Mesh(new THREE.BoxGeometry(11.5, 3.2, 2.7), busMat);
    body.position.y = 1.9;
    busGroup.add(body);

    const win = new THREE.Mesh(new THREE.BoxGeometry(11.0, 1.2, 2.75), this.materials.glass);
    win.position.y = 2.4;
    busGroup.add(win);

    // Wheels
    [-3.5, 3.5].forEach(wx => {
      [-1.35, 1.35].forEach(wz => {
        const w = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.3, 10), this.materials.tireBlack);
        w.rotation.x = Math.PI / 2;
        w.position.set(wx, 0.5, wz);
        busGroup.add(w);
      });
    });

    const headlight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.8), this.materials.headlightOn);
    headlight.position.set(5.8, 1.2, 0);
    busGroup.add(headlight);

    return { mesh: busGroup, type: 'bus', headlight };
  }

  createCivilianCar(idx) {
    const carGroup = new THREE.Group();
    const carMat = idx % 2 === 0 ? this.materials.carWhite : this.materials.carSilver;

    const body = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.9, 1.9), carMat);
    body.position.y = 0.65;
    carGroup.add(body);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.75, 1.7), this.materials.glass);
    roof.position.set(-0.2, 1.35, 0);
    carGroup.add(roof);

    // Wheels
    [-1.3, 1.3].forEach(wx => {
      [-0.95, 0.95].forEach(wz => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.22, 10), this.materials.tireBlack);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(wx, 0.38, wz);
        carGroup.add(wheel);
      });
    });

    const headlight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.7), this.materials.headlightOn);
    headlight.position.set(2.35, 0.65, 0);
    carGroup.add(headlight);

    return { mesh: carGroup, type: 'car', headlight };
  }

  update(delta, playerPos) {
    const bound = 270;

    this.vehicles.forEach(v => {
      // Distance-based simulation LOD
      const dist = playerPos ? v.mesh.position.distanceTo(playerPos) : 0;
      if (dist > 180.0) {
        v.mesh.visible = false;
        return;
      }
      v.mesh.visible = true;

      // Translation
      if (v.route === 'EW') {
        v.mesh.position.x += v.speed * delta * v.dir;
        if (v.mesh.position.x > bound) v.mesh.position.x = -bound;
      } else if (v.route === 'WE') {
        v.mesh.position.x += v.speed * delta * v.dir;
        if (v.mesh.position.x < -bound) v.mesh.position.x = bound;
      } else if (v.route === 'NS') {
        v.mesh.position.z += v.speed * delta * v.dir;
        if (v.mesh.position.z < -bound) v.mesh.position.z = bound;
      }
    });
  }

  setNightMode(isNight) {
    const emissiveIntensity = isNight ? 1.0 : 0.2;
    this.materials.headlightOn.color.setHex(isNight ? 0xfef08a : 0xcccccc);
  }
}
