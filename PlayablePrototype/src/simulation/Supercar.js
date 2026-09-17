// High-End Realistic Supercar ("Vajra Motors" Hypercars) with Weight Transfer, Suspension & Cockpit
// BENGALURU: LAST CITY - Phase 2 Overhaul
import * as THREE from 'three';

export const SUPERCAR_MODELS = {
  venomGT: {
    id: 'venomGT',
    brand: 'VAJRA MOTORS',
    modelName: 'Vajra Venom GT',
    engine: '6.0L Twin-Turbo V12 • 980 BHP',
    topSpeed: 54.0, // ~195 km/h
    nitroTopSpeed: 78.0, // ~280 km/h
    acceleration: 32.0,
    nitroAccel: 52.0,
    braking: 36.0,
    handling: 2.5,
    downforce: 1.8,
    primaryColor: 0xd50000 // Candy Apple Crimson
  },
  spectreR: {
    id: 'spectreR',
    brand: 'VAJRA MOTORS',
    modelName: 'Vajra Spectre R',
    engine: '4.4L Quad-Cam V8 Biturbo • 850 BHP',
    topSpeed: 52.0,
    nitroTopSpeed: 74.0,
    acceleration: 30.0,
    nitroAccel: 48.0,
    braking: 38.0,
    handling: 2.8,
    downforce: 2.2,
    primaryColor: 0x00e5ff // Electric Cyber Blue
  },
  apexX: {
    id: 'apexX',
    brand: 'VAJRA MOTORS',
    modelName: 'Vajra Apex X',
    engine: 'Hybrid Tri-Motor AWD • 1050 BHP',
    topSpeed: 56.0,
    nitroTopSpeed: 82.0,
    acceleration: 38.0,
    nitroAccel: 58.0,
    braking: 40.0,
    handling: 2.7,
    downforce: 2.4,
    primaryColor: 0xffd600 // Sunset Solar Gold
  }
};

export class Supercar {
  constructor(scene, initialPosition = new THREE.Vector3(-15, 0, 18), modelKey = 'venomGT') {
    this.scene = scene;
    this.position = initialPosition.clone();
    this.yaw = Math.PI / 2; // Facing East along boulevard
    this.speed = 0;
    this.steerAngle = 0;

    this.config = SUPERCAR_MODELS[modelKey] || SUPERCAR_MODELS.venomGT;
    this.friction = 4.8;

    this.isOccupied = false;
    this.isNitroActive = false;
    this.nitroFuel = 100.0;
    this.maxNitroFuel = 100.0;

    // Weight transfer & suspension dynamics
    this.pitchLean = 0; // Front/back squat and dive
    this.rollLean = 0;  // Body roll into corners
    this.suspensionTravel = [0, 0, 0, 0]; // 4 wheels compression

    // Door animation state for entry/exit
    this.doorOpenProgress = 0;
    this.isTransitioningEntry = false;

    // Tire smoke particle system
    this.tireSmoke = [];

    // Build the high-end vehicle geometry & PBR materials
    this.mesh = this.buildSupercarMesh();
    this.mesh.position.copy(this.position);
    this.mesh.rotation.y = this.yaw;
    this.scene.add(this.mesh);
  }

  buildSupercarMesh() {
    const root = new THREE.Group();

    // High-gloss Automotive Clearcoat PBR Material
    this.paintMat = new THREE.MeshStandardMaterial({
      color: this.config.primaryColor,
      metalness: 0.9,
      roughness: 0.12,
      envMapIntensity: 1.5
    });

    const carbonFiberMat = new THREE.MeshStandardMaterial({
      color: 0x111316,
      metalness: 0.4,
      roughness: 0.5
    });

    const darkGlassMat = new THREE.MeshStandardMaterial({
      color: 0x0a1017,
      metalness: 0.95,
      roughness: 0.05,
      transparent: true,
      opacity: 0.75
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.98,
      roughness: 0.1
    });

    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x141517,
      roughness: 0.85,
      metalness: 0.05
    });

    const caliperMat = new THREE.MeshStandardMaterial({
      color: 0xff1744, // Red Brembo caliper
      metalness: 0.7,
      roughness: 0.3
    });

    // ----------------------------------------------------
    // 1. CHASSIS MONOCOQUE & UNDERBODY AERODYNAMICS
    // ----------------------------------------------------
    this.bodyGroup = new THREE.Group();
    root.add(this.bodyGroup);

    // Carbon-fiber floor pan
    const floorPan = new THREE.Mesh(new THREE.BoxGeometry(4.7, 0.12, 2.05), carbonFiberMat);
    floorPan.position.y = 0.22;
    floorPan.castShadow = true;
    this.bodyGroup.add(floorPan);

    // Front Splitter with Aerodynamic Winglets
    const splitter = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 2.16), carbonFiberMat);
    splitter.position.set(2.4, 0.18, 0);
    this.bodyGroup.add(splitter);

    const canardL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.16, 0.05), carbonFiberMat);
    canardL.rotation.y = -Math.PI / 4;
    canardL.position.set(2.4, 0.32, 1.05);
    this.bodyGroup.add(canardL);

    const canardR = canardL.clone();
    canardR.position.z = -1.05;
    canardR.rotation.y = Math.PI / 4;
    this.bodyGroup.add(canardR);

    // Sculpted Front Hood & Wheel Arches
    const hood = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.38, 1.95), this.paintMat);
    hood.position.set(1.2, 0.62, 0);
    hood.castShadow = true;
    this.bodyGroup.add(hood);

    // Hood Air Extractor Vents
    const hoodVent = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.04, 0.8), carbonFiberMat);
    hoodVent.position.set(1.1, 0.82, 0);
    this.bodyGroup.add(hoodVent);

    // ----------------------------------------------------
    // 2. COCKPIT GREENHOUSE & INTERIOR
    // ----------------------------------------------------
    // Cockpit Roof & Panoramic Glass Canopy
    const greenhouse = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.48, 1.5), darkGlassMat);
    greenhouse.position.set(-0.25, 1.08, 0);
    greenhouse.castShadow = true;
    this.bodyGroup.add(greenhouse);

    // Interior Cockpit Tub
    const interiorTub = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.35, 1.3), carbonFiberMat);
    interiorTub.position.set(-0.25, 0.65, 0);
    this.bodyGroup.add(interiorTub);

    // Driver & Passenger Sport Bucket Seats
    const seatGeo = new THREE.BoxGeometry(0.5, 0.55, 0.45);
    const seatL = new THREE.Mesh(seatGeo, carbonFiberMat);
    seatL.position.set(-0.35, 0.78, 0.35);
    this.bodyGroup.add(seatL);

    const seatR = seatL.clone();
    seatR.position.z = -0.35;
    this.bodyGroup.add(seatR);

    // Sports Steering Wheel & Digital Gauge Cluster
    const steerCol = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.25, 8), carbonFiberMat);
    steerCol.rotation.z = Math.PI / 3;
    steerCol.position.set(0.15, 0.85, 0.35);
    this.bodyGroup.add(steerCol);

    const steerWheel = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.02, 8, 16), chromeMat);
    steerWheel.position.set(0.24, 0.95, 0.35);
    this.bodyGroup.add(steerWheel);

    const gaugeMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    const digitalGauge = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.08), gaugeMat);
    digitalGauge.rotation.y = -Math.PI / 2;
    digitalGauge.position.set(0.32, 0.98, 0.35);
    this.bodyGroup.add(digitalGauge);

    // ----------------------------------------------------
    // 3. DIHEDRAL BUTTERFLY DOOR (ANIMATED)
    // ----------------------------------------------------
    this.doorGroup = new THREE.Group();
    this.doorGroup.position.set(0.3, 0.55, 0.85); // Hinge pivot
    const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.55, 0.12), this.paintMat);
    doorPanel.position.set(-0.55, 0.15, 0.06);
    this.doorGroup.add(doorPanel);
    this.bodyGroup.add(this.doorGroup);

    // ----------------------------------------------------
    // 4. REAR ENGINE DECK, GT WING & DIFFUSER
    // ----------------------------------------------------
    const rearDeck = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.44, 1.95), this.paintMat);
    rearDeck.position.set(-1.6, 0.72, 0);
    rearDeck.castShadow = true;
    this.bodyGroup.add(rearDeck);

    // Engine Bay Glass Inspection Window
    const engineGlass = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.05, 0.9), darkGlassMat);
    engineGlass.position.set(-1.45, 0.95, 0);
    this.bodyGroup.add(engineGlass);

    // Rear Aerodynamic Diffuser with Vertical Strakes
    const diffuser = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.22, 2.05), carbonFiberMat);
    diffuser.position.set(-2.4, 0.25, 0);
    this.bodyGroup.add(diffuser);

    // Swan-Neck High Downforce GT Wing
    this.spoilerGroup = new THREE.Group();
    const stanchionGeo = new THREE.BoxGeometry(0.08, 0.52, 0.08);
    const stanchionL = new THREE.Mesh(stanchionGeo, carbonFiberMat);
    stanchionL.position.set(-2.15, 1.15, 0.65);
    this.spoilerGroup.add(stanchionL);

    const stanchionR = stanchionL.clone();
    stanchionR.position.z = -0.65;
    this.spoilerGroup.add(stanchionR);

    const wingBlade = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.06, 2.15), carbonFiberMat);
    wingBlade.position.set(-2.25, 1.42, 0);
    wingBlade.castShadow = true;
    this.spoilerGroup.add(wingBlade);

    this.bodyGroup.add(this.spoilerGroup);

    // ----------------------------------------------------
    // 5. WHEELS, BRAKE DISCS & SUSPENSION
    // ----------------------------------------------------
    const wheelGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.32, 18);
    const rimGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.33, 14);
    const brakeDiscGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.03, 12);
    const caliperGeo = new THREE.BoxGeometry(0.12, 0.16, 0.08);

    this.wheelMeshes = [];
    const wheelPositions = [
      [1.48, 1.06],   // Front Left
      [1.48, -1.06],  // Front Right
      [-1.48, 1.06],  // Rear Left
      [-1.48, -1.06]  // Rear Right
    ];

    wheelPositions.forEach(([wx, wz], idx) => {
      const wGroup = new THREE.Group();
      wGroup.position.set(wx, 0.44, wz);

      const tire = new THREE.Mesh(wheelGeo, tireMat);
      tire.rotation.x = Math.PI / 2;
      tire.castShadow = true;
      wGroup.add(tire);

      const rim = new THREE.Mesh(rimGeo, chromeMat);
      rim.rotation.x = Math.PI / 2;
      wGroup.add(rim);

      const disc = new THREE.Mesh(brakeDiscGeo, chromeMat);
      disc.rotation.x = Math.PI / 2;
      wGroup.add(disc);

      const caliper = new THREE.Mesh(caliperGeo, caliperMat);
      caliper.position.set(0, 0.16, 0);
      wGroup.add(caliper);

      root.add(wGroup);
      this.wheelMeshes.push(wGroup);
    });

    // ----------------------------------------------------
    // 6. LIGHTS & EXHAUST SYSTEM
    // ----------------------------------------------------
    // Projector LED Headlights
    const hlMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00e5ff,
      emissiveIntensity: 1.8
    });
    const hlLeft = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.10, 0.35), hlMat);
    hlLeft.position.set(2.28, 0.65, 0.74);
    this.bodyGroup.add(hlLeft);

    const hlRight = hlLeft.clone();
    hlRight.position.z = -0.74;
    this.bodyGroup.add(hlRight);

    this.headlightBeam = new THREE.SpotLight(0x00e5ff, 0, 60, Math.PI / 5, 0.25);
    this.headlightBeam.position.set(2.4, 0.65, 0);
    this.headlightBeam.target.position.set(30, 0, 0);
    this.bodyGroup.add(this.headlightBeam);
    this.bodyGroup.add(this.headlightBeam.target);

    // Full-Width Dynamic Brake Light Blade
    this.brakeLightMat = new THREE.MeshStandardMaterial({
      color: 0xff1744,
      emissive: 0xff1744,
      emissiveIntensity: 0.4
    });
    const tailBlade = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.85), this.brakeLightMat);
    tailBlade.position.set(-2.42, 0.76, 0);
    this.bodyGroup.add(tailBlade);

    // Dual Center-Exit Titanium Exhaust Pipes
    const exhaustMat = new THREE.MeshStandardMaterial({ color: 0x424242, metalness: 0.95 });
    const pipeL = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.3, 10), exhaustMat);
    pipeL.rotation.z = Math.PI / 2;
    pipeL.position.set(-2.45, 0.46, 0.22);
    this.bodyGroup.add(pipeL);

    const pipeR = pipeL.clone();
    pipeR.position.z = -0.22;
    this.bodyGroup.add(pipeR);

    // Nitro Flame Plumes (Cones)
    this.flameMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0 });
    this.nitroFlameL = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.1, 8), this.flameMat);
    this.nitroFlameL.rotation.z = Math.PI / 2;
    this.nitroFlameL.position.set(-3.05, 0.46, 0.22);
    this.bodyGroup.add(this.nitroFlameL);

    this.nitroFlameR = this.nitroFlameL.clone();
    this.nitroFlameR.position.z = -0.22;
    this.bodyGroup.add(this.nitroFlameR);

    return root;
  }

  setPaintColor(hexColor) {
    if (this.paintMat) {
      this.paintMat.color.setHex(hexColor);
    }
  }

  setSpoilerType(type) {
    if (this.spoilerGroup) {
      this.spoilerGroup.visible = (type !== 'none');
    }
  }

  startEntryTransition() {
    this.isTransitioningEntry = true;
    this.doorOpenProgress = 1.0;
  }

  startExitTransition() {
    this.doorOpenProgress = 1.0;
  }

  update(delta, inputKeys, audioManager) {
    // 1. Door Open / Close Transition
    if (this.doorOpenProgress > 0) {
      this.doorOpenProgress = Math.max(0, this.doorOpenProgress - delta * 1.8);
      // Dihedral butterfly swing: rotates up and outwards
      this.doorGroup.rotation.z = this.doorOpenProgress * 0.9;
      this.doorGroup.rotation.y = this.doorOpenProgress * 0.4;
    }

    if (!this.isOccupied) return;

    // 2. Nitro Boost Mechanics
    const wantsNitro = inputKeys.sprint && this.nitroFuel > 5 && this.speed > 10.0;
    if (wantsNitro) {
      this.isNitroActive = true;
      this.nitroFuel = Math.max(0, this.nitroFuel - 30 * delta);
      this.flameMat.opacity = 0.85 + Math.random() * 0.15;
    } else {
      this.isNitroActive = false;
      this.nitroFuel = Math.min(this.maxNitroFuel, this.nitroFuel + 14 * delta);
      this.flameMat.opacity = 0;
    }

    const currentTopSpeed = this.isNitroActive ? this.config.nitroTopSpeed : this.config.topSpeed;
    const currentAccel = this.isNitroActive ? this.config.nitroAccel : this.config.acceleration;

    // 3. Acceleration, Ceramic Braking & Reverse
    const isForward = inputKeys.forward;
    const isReverse = inputKeys.backward;
    const isHandbrake = inputKeys.jump;

    let targetPitchLean = 0;
    if (isForward) {
      this.speed = Math.min(currentTopSpeed, this.speed + currentAccel * delta);
      this.brakeLightMat.emissiveIntensity = 0.4;
      targetPitchLean = -0.04; // Squat backwards on power
    } else if (isReverse) {
      if (this.speed > 0.5) {
        // High-force braking
        this.speed = Math.max(0, this.speed - this.config.braking * delta);
        this.brakeLightMat.emissiveIntensity = 2.8;
        targetPitchLean = 0.06; // Dive forwards under hard braking
      } else {
        // Reverse
        this.speed = Math.max(-14.0, this.speed - currentAccel * 0.5 * delta);
        this.brakeLightMat.emissiveIntensity = 0.4;
      }
    } else {
      // Natural aerodynamic & road rolling friction
      if (this.speed > 0) this.speed = Math.max(0, this.speed - this.friction * delta);
      else if (this.speed < 0) this.speed = Math.min(0, this.speed + this.friction * delta);
      this.brakeLightMat.emissiveIntensity = 0.4;
    }

    // 4. Handbrake Drift Mechanics & Tire Smoke
    let isDrifting = false;
    if (isHandbrake && Math.abs(this.speed) > 5) {
      isDrifting = true;
      this.speed = THREE.MathUtils.lerp(this.speed, 0, delta * 3.5);
      this.brakeLightMat.emissiveIntensity = 3.0;
      this.spawnTireSmoke(delta);
    }

    // 5. Steering & Weight Transfer Roll
    let steerInput = (inputKeys.left ? 1 : 0) - (inputKeys.right ? 1 : 0);
    let targetRollLean = 0;
    if (Math.abs(this.speed) > 0.3) {
      const speedSign = (this.speed >= 0) ? 1 : -1;
      const driftMultiplier = isDrifting ? 1.6 : 1.0;
      const steerFactor = Math.min(1.0, Math.abs(this.speed) / 12);
      this.yaw += steerInput * this.config.handling * driftMultiplier * delta * speedSign * steerFactor;
      targetRollLean = -steerInput * 0.05 * speedSign; // Body rolls into turn
    }

    // Smooth weight transfer dynamics
    this.pitchLean = THREE.MathUtils.lerp(this.pitchLean, targetPitchLean, delta * 8);
    this.rollLean = THREE.MathUtils.lerp(this.rollLean, targetRollLean, delta * 8);
    this.bodyGroup.rotation.z = this.pitchLean;
    this.bodyGroup.rotation.x = this.rollLean;

    // 6. Wheels Rotation & Steering Angle
    const wheelSpinSpeed = (this.speed / 0.44) * delta;
    this.wheelMeshes.forEach((w, i) => {
      w.children[0].rotation.z += wheelSpinSpeed; // Tire spin
      // Steer front wheels (indices 0 and 1)
      if (i < 2) {
        w.rotation.y = steerInput * 0.32;
      }
    });

    // 7. World Translation
    const forwardX = Math.cos(this.yaw);
    const forwardZ = -Math.sin(this.yaw);
    this.position.x += forwardX * this.speed * delta;
    this.position.z += forwardZ * this.speed * delta;

    // Clamp inside city territory
    const maxBound = 290;
    this.position.x = THREE.MathUtils.clamp(this.position.x, -maxBound, maxBound);
    this.position.z = THREE.MathUtils.clamp(this.position.z, -maxBound, maxBound);

    this.mesh.position.copy(this.position);
    this.mesh.rotation.y = this.yaw;

    // 8. Update Tire Smoke Particles
    for (let i = this.tireSmoke.length - 1; i >= 0; i--) {
      const p = this.tireSmoke[i];
      p.life -= delta;
      p.mesh.position.addScaledVector(p.velocity, delta);
      p.mesh.scale.multiplyScalar(1.05);
      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        this.tireSmoke.splice(i, 1);
      }
    }

    // 9. Multi-Cylinder Engine Sound Pitch
    if (audioManager) {
      const rpmFactor = Math.abs(this.speed) / this.config.topSpeed;
      audioManager.playVehicleEngine(rpmFactor * (this.isNitroActive ? 1.5 : 1.0));
    }
  }

  spawnTireSmoke(delta) {
    const smokeGeo = new THREE.SphereGeometry(0.24, 6, 6);
    const smokeMat = new THREE.MeshBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.45 });

    // Spawn from rear wheel arches
    [-0.9, 0.9].forEach(offsetZ => {
      const smoke = new THREE.Mesh(smokeGeo, smokeMat);
      smoke.position.copy(this.position).add(new THREE.Vector3(-Math.cos(this.yaw) * 1.5, 0.2, offsetZ));
      this.scene.add(smoke);

      this.tireSmoke.push({
        mesh: smoke,
        velocity: new THREE.Vector3((Math.random() - 0.5) * 2, 0.8 + Math.random() * 0.5, (Math.random() - 0.5) * 2),
        life: 0.45
      });
    });
  }

  getInteractionDistance(playerPos) {
    return this.position.distanceTo(playerPos);
  }
}
