// Bangalore City Police (BCP) & Emergency Dispatch System (Phase 4)
// Original fictional emergency services, 5-tier response escalation, and dynamic sirens.
import * as THREE from 'three';

export class PoliceEmergencySystem {
  constructor(scene, audioManager) {
    this.scene = scene;
    this.audioManager = audioManager;
    this.group = new THREE.Group();

    this.responseLevel = 0; // 0 = Normal, 1 = Minor, 2 = Elevated, 3 = Tactical, 4 = Lockdown
    this.vehicles = [];

    this.buildPoliceVehicles();
    this.buildEmergencyServices();

    this.scene.add(this.group);
  }

  buildPoliceVehicles() {
    // 1. Bangalore City Police (BCP) Interceptor Sedan
    const cruiser = this.createPoliceCruiserMesh();
    cruiser.position.set(-18, 0, 32);
    cruiser.rotation.y = Math.PI / 4;
    this.group.add(cruiser);
    this.vehicles.push({ type: 'police_cruiser', mesh: cruiser, speed: 0, sirenActive: false });

    // 2. Tactical Police SUV
    const suv = this.createTacticalSUVMesh();
    suv.position.set(24, 0, -50);
    suv.rotation.y = -Math.PI / 3;
    this.group.add(suv);
    this.vehicles.push({ type: 'police_suv', mesh: suv, speed: 0, sirenActive: false });
  }

  buildEmergencyServices() {
    // 1. 108 Emergency Ambulance
    const ambulance = this.createAmbulanceMesh();
    ambulance.position.set(65, 0, 42);
    this.group.add(ambulance);
    this.vehicles.push({ type: 'ambulance', mesh: ambulance, speed: 0, sirenActive: false });

    // 2. City Fire Tender (Rescue Engine)
    const fireTruck = this.createFireTruckMesh();
    fireTruck.position.set(-82, 0, -35);
    this.group.add(fireTruck);
    this.vehicles.push({ type: 'fire_truck', mesh: fireTruck, speed: 0, sirenActive: false });
  }

  createPoliceCruiserMesh() {
    const cruiser = new THREE.Group();

    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, metalness: 0.2 });
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.4 }); // BCP Navy Blue
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.9 });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    const pushBarMat = new THREE.MeshStandardMaterial({ color: 0x09090b, metalness: 0.8, roughness: 0.3 });

    // Body (4.8m x 1.4m x 1.9m)
    const body = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.9, 1.9), whiteMat);
    body.position.y = 0.75;
    body.castShadow = true;
    cruiser.add(body);

    // BCP Blue Chevron Door Decals
    const doorDecalL = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.4, 0.05), blueMat);
    doorDecalL.position.set(0, 0.75, 0.98);
    cruiser.add(doorDecalL);

    const doorDecalR = doorDecalL.clone();
    doorDecalR.position.z = -0.98;
    cruiser.add(doorDecalR);

    // Cabin Glass
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.65, 1.6), glassMat);
    cabin.position.set(-0.2, 1.45, 0);
    cruiser.add(cabin);

    // Push Bumper / Bull Bar
    const pushBar = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.6, 1.6), pushBarMat);
    pushBar.position.set(2.45, 0.65, 0);
    cruiser.add(pushBar);

    // Rooftop LED Lightbar (Alternating Red & Blue)
    const lightbarBase = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 1.2), pushBarMat);
    lightbarBase.position.set(-0.2, 1.82, 0);
    cruiser.add(lightbarBase);

    const redStrobe = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.5), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    redStrobe.position.set(-0.2, 1.88, 0.32);
    cruiser.add(redStrobe);
    cruiser.redStrobe = redStrobe;

    const blueStrobe = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.5), new THREE.MeshBasicMaterial({ color: 0x3b82f6 }));
    blueStrobe.position.set(-0.2, 1.88, -0.32);
    cruiser.add(blueStrobe);
    cruiser.blueStrobe = blueStrobe;

    // Wheels
    [-1.4, 1.4].forEach(wx => {
      const wL = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.24, 14), tireMat);
      wL.rotation.x = Math.PI / 2;
      wL.position.set(wx, 0.38, 0.92);
      cruiser.add(wL);

      const wR = wL.clone();
      wR.position.z = -0.92;
      cruiser.add(wR);
    });

    return cruiser;
  }

  createTacticalSUVMesh() {
    const suv = new THREE.Group();
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5, metalness: 0.5 });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.9 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.9 });

    // Heavy SUV Frame (5.2m x 1.8m x 2.1m)
    const body = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.3, 2.1), blackMat);
    body.position.y = 1.1;
    body.castShadow = true;
    suv.add(body);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.8, 1.8), glassMat);
    cabin.position.set(-0.3, 2.0, 0);
    suv.add(cabin);

    // Wheels (Raised 4x4)
    [-1.6, 1.6].forEach(wx => {
      const wL = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.32, 14), tireMat);
      wL.rotation.x = Math.PI / 2;
      wL.position.set(wx, 0.5, 1.05);
      suv.add(wL);

      const wR = wL.clone();
      wR.position.z = -1.05;
      suv.add(wR);
    });

    return suv;
  }

  createAmbulanceMesh() {
    const amb = new THREE.Group();
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const orangeMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 }); // 108 Emergency Orange
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1 });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });

    // Ambulance Box Van Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(5.6, 2.2, 2.2), whiteMat);
    body.position.y = 1.5;
    body.castShadow = true;
    amb.add(body);

    // Orange Emergency Stripe
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(5.64, 0.4, 2.24), orangeMat);
    stripe.position.y = 1.3;
    amb.add(stripe);

    // Rooftop Emergency Beacon
    const beacon = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.4), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    beacon.position.set(0.6, 2.7, 0);
    amb.add(beacon);

    // Wheels
    [-1.6, 1.6].forEach(wx => {
      const wL = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.28, 14), tireMat);
      wL.rotation.x = Math.PI / 2;
      wL.position.set(wx, 0.44, 1.1);
      amb.add(wL);

      const wR = wL.clone();
      wR.position.z = -1.1;
      amb.add(wR);
    });

    return amb;
  }

  createFireTruckMesh() {
    const ft = new THREE.Group();
    const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });

    // Heavy Fire Engine Body (8.0m x 2.6m x 2.5m)
    const body = new THREE.Mesh(new THREE.BoxGeometry(8.0, 2.4, 2.5), redMat);
    body.position.y = 1.7;
    body.castShadow = true;
    ft.add(body);

    // Rooftop Telescoping Ladder
    const ladder = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.3, 0.9), chromeMat);
    ladder.position.set(-0.4, 3.1, 0);
    ft.add(ladder);

    // Dual Rear Axles + Front Axle
    [-2.6, -1.4, 2.4].forEach(wx => {
      const wL = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.35, 14), tireMat);
      wL.rotation.x = Math.PI / 2;
      wL.position.set(wx, 0.55, 1.25);
      ft.add(wL);

      const wR = wL.clone();
      wR.position.z = -1.25;
      ft.add(wR);
    });

    return ft;
  }

  update(delta, gameMode, playerPosition) {
    // In Battle Royale mode, emergency systems remain passive to avoid interfering with match fairness
    if (gameMode === 'BATTLE_ROYALE') {
      return;
    }

    // Strobe Light Flashing
    const time = performance.now() * 0.008;
    const isFlashOn = Math.sin(time) > 0;

    this.vehicles.forEach(v => {
      if (v.mesh.redStrobe && v.mesh.blueStrobe) {
        v.mesh.redStrobe.material.color.setHex(isFlashOn ? 0xff0000 : 0x440000);
        v.mesh.blueStrobe.material.color.setHex(!isFlashOn ? 0x0088ff : 0x001144);
      }
    });
  }

  setResponseLevel(level) {
    this.responseLevel = Math.max(0, Math.min(4, level));
  }
}
