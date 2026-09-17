// Zero-Emission BMTC Electric City Bus (Vajra EV Series) & Fast Charging Infrastructure
// BENGALURU: LAST CITY - Phase 4 Living City
import * as THREE from 'three';

export class ElectricBusSystem {
  constructor(scene, audioManager) {
    this.scene = scene;
    this.audioManager = audioManager;
    this.group = new THREE.Group();

    // Electric bus state
    this.position = new THREE.Vector3(-40, 0, 75);
    this.rotationY = 0;
    this.speed = 0;
    this.batterySOC = 94.5; // State of Charge in percentage %
    this.isCharging = false;
    this.chargeRate = 4.5; // % per second when plugged in
    this.drainRate = 0.35; // % per 10m traveled

    this.busMesh = this.buildElectricBusMesh();
    this.busMesh.position.copy(this.position);
    this.group.add(this.busMesh);

    // Build Depot Fast-Chargers
    this.chargers = [];
    this.buildChargingStation(new THREE.Vector3(-52, 0, 78));
    this.buildChargingStation(new THREE.Vector3(-52, 0, 86));

    this.scene.add(this.group);
  }

  buildElectricBusMesh() {
    const bus = new THREE.Group();

    const evGreenMat = new THREE.MeshStandardMaterial({
      color: 0x15803d, // Vibrant eco electric green
      roughness: 0.35,
      metalness: 0.2
    });

    const silverBodyMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.3,
      metalness: 0.4
    });

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.85
    });

    const blackTrimMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.6
    });

    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 0.85
    });

    const ledSignMat = new THREE.MeshBasicMaterial({ color: 0x22c55e }); // Electric green destination display

    const length = 12.2;
    const width = 2.75;
    const height = 3.3;

    // 1. Lower Chassis & Wheels
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(length, 0.4, width), blackTrimMat);
    chassis.position.y = 0.55;
    chassis.castShadow = true;
    bus.add(chassis);

    // 4 Heavy-Duty Wheel Hubs
    const wheelGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.34, 16);
    [-length * 0.32, length * 0.32].forEach(wx => {
      const wheelL = new THREE.Mesh(wheelGeo, tireMat);
      wheelL.rotation.x = Math.PI / 2;
      wheelL.position.set(wx, 0.52, width / 2);
      bus.add(wheelL);

      const wheelR = wheelL.clone();
      wheelR.position.z = -width / 2;
      bus.add(wheelR);
    });

    // 2. Main Bus Body Shell (Silver with Eco-Green Accent Band)
    const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(length, 1.2, width), evGreenMat);
    lowerBody.position.y = 1.35;
    lowerBody.castShadow = true;
    bus.add(lowerBody);

    const upperBody = new THREE.Mesh(new THREE.BoxGeometry(length, 1.4, width), silverBodyMat);
    upperBody.position.y = 2.65;
    bus.add(upperBody);

    // 3. Panoramic Windows
    for (let wx = -length / 2 + 1.8; wx <= length / 2 - 2.0; wx += 2.4) {
      const winL = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.1, 0.05), glassMat);
      winL.position.set(wx, 2.3, width / 2 + 0.02);
      bus.add(winL);

      const winR = winL.clone();
      winR.position.z = -width / 2 - 0.02;
      bus.add(winR);
    }

    // Windshield (Front at +X)
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.6, width * 0.92), glassMat);
    windshield.rotation.z = -0.15;
    windshield.position.set(length / 2 + 0.05, 2.2, 0);
    bus.add(windshield);

    // 4. Rooftop Battery Enclosure Pack (High-Voltage Energy Storage)
    const batteryPack = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.45, 2.2), blackTrimMat);
    batteryPack.position.set(-0.8, height + 0.22, 0);
    batteryPack.castShadow = true;
    bus.add(batteryPack);

    // Battery Pack Warning Stencil & Cooling Vents
    const ventMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const ventL = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.15, 0.05), ventMat);
    ventL.position.set(-0.8, height + 0.22, 1.12);
    bus.add(ventL);

    // Rooftop Pantograph Charging Cradle
    const cradle = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.2, 1.6), blackTrimMat);
    cradle.position.set(3.2, height + 0.15, 0);
    bus.add(cradle);

    // 5. Electronic LED Destination Display
    const destDisplay = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 1.8), ledSignMat);
    destDisplay.position.set(length / 2 + 0.08, 3.1, 0);
    bus.add(destDisplay);

    // Headlights
    const hlMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const hlL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.25, 0.35), hlMat);
    hlL.position.set(length / 2 + 0.08, 1.2, width / 2 - 0.35);
    bus.add(hlL);

    const hlR = hlL.clone();
    hlR.position.z = -width / 2 + 0.35;
    bus.add(hlR);

    // Tail Brake Lights
    const tlMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
    const tlL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.25, 0.3), tlMat);
    tlL.position.set(-length / 2 - 0.05, 1.2, width / 2 - 0.35);
    bus.add(tlL);

    const tlR = tlL.clone();
    tlR.position.z = -width / 2 + 0.35;
    bus.add(tlR);

    return bus;
  }

  buildChargingStation(pos) {
    const chargerGroup = new THREE.Group();
    chargerGroup.position.copy(pos);

    const metalMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.4 });
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });

    // CCS2 Dual High-Power Charger Pillar
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.8, 1.0), metalMat);
    pillar.position.y = 1.4;
    pillar.castShadow = true;
    chargerGroup.add(pillar);

    // Green Accent Trim
    const trim = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.15, 1.04), greenMat);
    trim.position.y = 2.6;
    chargerGroup.add(trim);

    // Interactive Touchscreen Display
    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.7, 0.55), screenMat);
    screen.position.set(0.62, 1.8, 0);
    chargerGroup.add(screen);

    // Heavy-Duty Flexible Cable & Connector Holster
    const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.8, 8), metalMat);
    cable.position.set(0.65, 0.9, 0.3);
    chargerGroup.add(cable);

    // Overhead High-Speed Pantograph Charging Gantry
    const gantryArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 3.8), metalMat);
    gantryArm.position.set(0, 4.4, 1.9);
    chargerGroup.add(gantryArm);

    const gantryPost = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 4.4, 8), metalMat);
    gantryPost.position.set(0, 2.2, 0);
    chargerGroup.add(gantryPost);

    this.group.add(chargerGroup);
    this.chargers.push({ position: pos, mesh: chargerGroup });
  }

  update(delta, player, keys) {
    // Check charging proximity
    let nearCharger = false;
    for (const ch of this.chargers) {
      const dist = this.busMesh.position.distanceTo(ch.position);
      if (dist < 6.0) {
        nearCharger = true;
        break;
      }
    }

    if (nearCharger && this.speed < 0.1) {
      this.isCharging = true;
      this.batterySOC = Math.min(100.0, this.batterySOC + this.chargeRate * delta);
    } else {
      this.isCharging = false;
    }

    // Inverter motor sound or recharge beep
    if (this.isCharging && Math.random() < 0.02 && this.audioManager) {
      this.audioManager.playUIBeep(920);
    }
  }

  getInteractionDistance(pos) {
    return this.busMesh.position.distanceTo(pos);
  }
}
