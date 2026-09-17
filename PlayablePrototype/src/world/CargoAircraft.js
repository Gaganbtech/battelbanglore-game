// Original Tactical Transport Aircraft: "Garuda C-130 Air Titan"
// Transports 100 players across Bengaluru airspace during AircraftDeparture phase
import * as THREE from 'three';

export class CargoAircraft {
  constructor(scene, audioManager) {
    this.scene = scene;
    this.audioManager = audioManager;
    this.group = new THREE.Group();

    this.altitude = 260.0;
    this.flightSpeed = 38.0; // m/s
    this.flightProgress = 0.0;
    this.isFlying = false;
    this.canJump = false;
    this.hasLocalPlayerJumped = false;

    // Flight Path from Southwest to Northeast across entire city
    this.startPoint = new THREE.Vector3(-320, this.altitude, -240);
    this.endPoint = new THREE.Vector3(320, this.altitude, 240);
    this.flightDirection = new THREE.Vector3().subVectors(this.endPoint, this.startPoint).normalize();
    this.totalDistance = this.startPoint.distanceTo(this.endPoint);

    this.mesh = this.buildAircraftMesh();
    this.group.add(this.mesh);
    this.scene.add(this.group);
    this.group.visible = false;
  }

  buildAircraftMesh() {
    const root = new THREE.Group();

    const fuselageMat = new THREE.MeshStandardMaterial({
      color: 0x374151, // Military matte slate gray
      roughness: 0.5,
      metalness: 0.35
    });

    const camoMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937, // Dark tactical accent
      roughness: 0.6,
      metalness: 0.2
    });

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.85
    });

    const wingMat = new THREE.MeshStandardMaterial({ color: 0x4b5563, roughness: 0.45, metalness: 0.3 });
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 });

    // 1. Heavy Fuselage (Length: 32m, Width: 4.8m, Height: 5.2m)
    const fuselage = new THREE.Mesh(new THREE.BoxGeometry(32.0, 5.0, 4.8), fuselageMat);
    fuselage.castShadow = true;
    root.add(fuselage);

    // Aerodynamic Nose Cone
    const nose = new THREE.Mesh(new THREE.ConeGeometry(2.4, 7.0, 16), fuselageMat);
    nose.rotation.z = -Math.PI / 2;
    nose.position.set(16.0 + 3.5, 0, 0);
    root.add(nose);

    // Cockpit Glazing
    const cockpit = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.6, 3.8), glassMat);
    cockpit.position.set(14.0, 1.6, 0);
    root.add(cockpit);

    // 2. High-Mounted Wings (Span: 42m)
    const wing = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.6, 42.0), wingMat);
    wing.position.set(2.0, 2.4, 0);
    wing.castShadow = true;
    root.add(wing);

    // Winglet tips
    [-21.0, 21.0].forEach(wz => {
      const tip = new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.8, 0.3), camoMat);
      tip.position.set(2.0, 3.2, wz);
      root.add(tip);
    });

    // 3. Quad Turboprop Engines & Nacelles
    this.propellers = [];
    const engineZ = [-14.0, -7.0, 7.0, 14.0];
    engineZ.forEach(ez => {
      const nacelle = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 6.5, 12), camoMat);
      nacelle.rotation.z = Math.PI / 2;
      nacelle.position.set(4.2, 1.4, ez);
      root.add(nacelle);

      // Spinning 4-Blade Propeller
      const propHub = new THREE.Group();
      propHub.position.set(7.5, 1.4, ez);
      for (let b = 0; b < 4; b++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.2, 0.3), bladeMat);
        blade.rotation.x = (b * Math.PI) / 2;
        blade.position.y = 1.1 * Math.cos((b * Math.PI) / 2);
        blade.position.z = 1.1 * Math.sin((b * Math.PI) / 2);
        propHub.add(blade);
      }
      root.add(propHub);
      this.propellers.push(propHub);
    });

    // 4. Tail Empennage (Vertical Fin & Horizontal Stabilizer)
    const vertFin = new THREE.Mesh(new THREE.BoxGeometry(7.0, 7.5, 0.6), camoMat);
    vertFin.position.set(-13.0, 5.0, 0);
    root.add(vertFin);

    const horizStab = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.4, 14.0), wingMat);
    horizStab.position.set(-12.5, 3.5, 0);
    root.add(horizStab);

    // 5. Rear Cargo Ramp & Interior Bay Indicator
    const ramp = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.3, 3.6), camoMat);
    ramp.rotation.z = -Math.PI / 8;
    ramp.position.set(-15.5, -1.2, 0);
    root.add(ramp);

    // Interior Warning Beacon
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    beacon.position.set(-13.0, 0.5, 0);
    root.add(beacon);
    this.jumpBeacon = beacon;

    return root;
  }

  startFlight() {
    this.isFlying = true;
    this.flightProgress = 0.0;
    this.canJump = false;
    this.hasLocalPlayerJumped = false;
    this.group.visible = true;
    this.group.position.copy(this.startPoint);

    // Align aircraft heading along flight path
    const yaw = Math.atan2(this.flightDirection.x, this.flightDirection.z);
    this.group.rotation.y = yaw - Math.PI / 2;

    if (this.audioManager) {
      this.audioManager.playVehicleEngine(1.0);
    }
  }

  update(delta, player, playerState = null) {
    if (!this.isFlying) return;

    // Advance position along flight path
    const step = (this.flightSpeed * delta) / this.totalDistance;
    this.flightProgress += step;

    const currentPos = new THREE.Vector3().lerpVectors(this.startPoint, this.endPoint, this.flightProgress);
    this.group.position.copy(currentPos);

    // Animate high-rpm propellers
    this.propellers.forEach(p => {
      p.rotation.x += delta * 35;
    });

    // Jump availability: between 10% and 92% of flight path
    if (this.flightProgress >= 0.08 && this.flightProgress <= 0.92) {
      this.canJump = true;
      if (this.jumpBeacon) this.jumpBeacon.material.color.setHex(0x10b981); // Green Go light
    } else {
      this.canJump = false;
      if (this.jumpBeacon) this.jumpBeacon.material.color.setHex(0xef4444); // Red Hold light
    }

    // Carry player inside aircraft if not yet jumped
    if (!this.hasLocalPlayerJumped && player) {
      player.position.copy(currentPos).add(new THREE.Vector3(0, -1.0, 0));
      player.mesh.position.copy(player.position);
      player.velocity.set(0, 0, 0);

      // Force jump if plane reaches end of flight path
      if (this.flightProgress >= 0.93) {
        this.ejectPlayer(player);
      }
    }

    // End flight when path completed
    if (this.flightProgress >= 1.0) {
      this.isFlying = false;
      this.group.visible = false;
      if (this.audioManager) this.audioManager.stopVehicleEngine();
    }
  }

  ejectPlayer(player) {
    if (this.hasLocalPlayerJumped) return false;
    this.hasLocalPlayerJumped = true;

    // Eject backwards from rear cargo ramp
    const forwardX = Math.cos(this.group.rotation.y);
    const forwardZ = -Math.sin(this.group.rotation.y);

    const ejectPos = this.group.position.clone().add(new THREE.Vector3(-forwardX * 8, -3, -forwardZ * 8));
    player.teleport(ejectPos.x, ejectPos.y, ejectPos.z);
    player.velocity.set(forwardX * 18, -12, forwardZ * 18);

    if (this.audioManager) {
      this.audioManager.playAirBrakeHiss();
      this.audioManager.playUIBeep(880);
    }
    return true;
  }

  getPosition() {
    return this.group.position;
  }

  getProgress() {
    return Math.min(1.0, Math.max(0.0, this.flightProgress));
  }
}
