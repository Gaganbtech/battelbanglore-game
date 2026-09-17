// Bengaluru Traffic Simulation: Auto-Rickshaws, BMTC-style city buses, and civilian cars
import * as THREE from 'three';

export class TrafficSystem {
  constructor(scene) {
    this.scene = scene;
    this.vehicles = [];
    this.group = new THREE.Group();

    this.spawnTrafficFleet();
    this.scene.add(this.group);
  }

  spawnTrafficFleet() {
    // 8 Auto-Rickshaws, 4 City Buses, 8 Civilian Cars
    // Route 1: East-bound along z = -5 (x: -260 to +260)
    // Route 2: West-bound along z = +5 (x: +260 to -260)
    // Route 3: North-bound along x = +5 (z: +260 to -260)
    // Route 4: South-bound along x = -5 (z: -260 to +260)

    for (let i = 0; i < 6; i++) {
      const auto = this.createAutoRickshaw();
      auto.route = 'EW';
      auto.dir = 1;
      auto.speed = 10 + Math.random() * 4;
      auto.mesh.position.set(-240 + i * 85, 0.45, -5.5);
      this.vehicles.push(auto);
      this.group.add(auto.mesh);
    }

    for (let i = 0; i < 4; i++) {
      const bus = this.createBMTCBus();
      bus.route = 'WE';
      bus.dir = -1;
      bus.speed = 8 + Math.random() * 3;
      bus.mesh.position.set(220 - i * 110, 0.5, 5.5);
      bus.mesh.rotation.y = Math.PI;
      this.vehicles.push(bus);
      this.group.add(bus.mesh);
    }

    for (let i = 0; i < 6; i++) {
      const car = this.createCivilianCar();
      car.route = 'NS';
      car.dir = -1;
      car.speed = 12 + Math.random() * 5;
      car.mesh.position.set(5.5, 0.45, 230 - i * 80);
      car.mesh.rotation.y = -Math.PI / 2;
      this.vehicles.push(car);
      this.group.add(car.mesh);
    }
  }

  createAutoRickshaw() {
    // Iconic Bengaluru Auto-Rickshaw (Green lower body, Yellow upper hood, black chassis)
    const autoGroup = new THREE.Group();

    const greenMat = new THREE.MeshStandardMaterial({ color: 0x1b5e20, roughness: 0.5 });
    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfbc02d, roughness: 0.4 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.7 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 });

    // Lower Cabin
    const body = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.1, 1.7), greenMat);
    body.position.y = 0.65;
    body.castShadow = true;
    autoGroup.add(body);

    // Yellow Canopy Hood
    const hood = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 1.65), yellowMat);
    hood.position.set(-0.3, 1.6, 0);
    hood.castShadow = true;
    autoGroup.add(hood);

    // Windshield frame
    const shield = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.85, 1.4), chromeMat);
    shield.position.set(1.0, 1.5, 0);
    autoGroup.add(shield);

    // Front single wheel
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    const frontWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.2, 12), wheelMat);
    frontWheel.rotation.x = Math.PI / 2;
    frontWheel.position.set(1.2, 0.35, 0);
    autoGroup.add(frontWheel);

    // Rear two wheels
    const rearWheelL = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.2, 12), wheelMat);
    rearWheelL.rotation.x = Math.PI / 2;
    rearWheelL.position.set(-1.0, 0.35, 0.85);
    autoGroup.add(rearWheelL);

    const rearWheelR = rearWheelL.clone();
    rearWheelR.position.z = -0.85;
    autoGroup.add(rearWheelR);

    // Headlight
    const headlightMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffea00, emissiveIntensity: 0.3 });
    const headlight = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), headlightMat);
    headlight.position.set(1.65, 0.7, 0);
    autoGroup.add(headlight);

    const beam = new THREE.SpotLight(0xfffaed, 0, 30, Math.PI / 6, 0.4);
    beam.position.set(1.7, 0.7, 0);
    beam.target.position.set(10, 0, 0);
    autoGroup.add(beam);
    autoGroup.add(beam.target);

    return { mesh: autoGroup, type: 'auto', headlight, beam };
  }

  createBMTCBus() {
    // Bengaluru BMTC Transit Bus (Blue / White body, long multi-window coach)
    const busGroup = new THREE.Group();

    const blueMat = new THREE.MeshStandardMaterial({ color: 0x0277bd, roughness: 0.4 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.5 });
    const windowMat = new THREE.MeshStandardMaterial({ color: 0x1a232f, roughness: 0.1 });

    const busLength = 12.0;
    const busHeight = 3.6;
    const busWidth = 2.8;

    // Main Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(busLength, busHeight * 0.55, busWidth), blueMat);
    body.position.y = 1.35;
    body.castShadow = true;
    busGroup.add(body);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(busLength, busHeight * 0.45, busWidth), whiteMat);
    roof.position.y = 2.8;
    roof.castShadow = true;
    busGroup.add(roof);

    // Front Destination LED Board
    const ledMat = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0xffab00, emissiveIntensity: 0.8 });
    const ledBoard = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 2.0), ledMat);
    ledBoard.position.set(busLength / 2 + 0.05, 3.1, 0);
    busGroup.add(ledBoard);

    // Wheels
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    const wPositions = [
      [busLength / 2 - 2.2, 1.4],
      [-busLength / 2 + 2.2, 1.4],
      [busLength / 2 - 2.2, -1.4],
      [-busLength / 2 + 2.2, -1.4]
    ];
    wPositions.forEach(([wx, wz]) => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.4, 12), wheelMat);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(wx, 0.6, wz);
      busGroup.add(wheel);
    });

    // Headlights
    const beam = new THREE.SpotLight(0xfffaed, 0, 45, Math.PI / 5, 0.3);
    beam.position.set(busLength / 2 + 0.2, 1.2, 0);
    beam.target.position.set(20, 0, 0);
    busGroup.add(beam);
    busGroup.add(beam.target);

    return { mesh: busGroup, type: 'bus', beam };
  }

  createCivilianCar() {
    // Sedan / Hatchback
    const carGroup = new THREE.Group();
    const colors = [0xd32f2f, 0xffffff, 0x455a64, 0x7b1fa2, 0xc0ca33];
    const carColor = colors[Math.floor(Math.random() * colors.length)];
    const carMat = new THREE.MeshStandardMaterial({ color: carColor, roughness: 0.3, metalness: 0.4 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x111620, roughness: 0.1 });

    // Lower body
    const body = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.9, 1.9), carMat);
    body.position.y = 0.65;
    body.castShadow = true;
    carGroup.add(body);

    // Cabin roof
    const roof = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.75, 1.7), glassMat);
    roof.position.set(-0.2, 1.35, 0);
    roof.castShadow = true;
    carGroup.add(roof);

    // Wheels
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    const wCoords = [[1.3, 0.95], [-1.3, 0.95], [1.3, -0.95], [-1.3, -0.95]];
    wCoords.forEach(([wx, wz]) => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.22, 12), wheelMat);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(wx, 0.38, wz);
      carGroup.add(wheel);
    });

    const beam = new THREE.SpotLight(0xfffaed, 0, 35, Math.PI / 6, 0.3);
    beam.position.set(2.4, 0.7, 0);
    beam.target.position.set(15, 0, 0);
    carGroup.add(beam);
    carGroup.add(beam.target);

    return { mesh: carGroup, type: 'car', beam };
  }

  update(delta) {
    const bound = 270;

    this.vehicles.forEach(v => {
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
    const intensity = isNight ? 2.2 : 0;
    this.vehicles.forEach(v => {
      if (v.beam) v.beam.intensity = intensity;
      if (v.headlight) v.headlight.material.emissiveIntensity = isNight ? 1.0 : 0.3;
    });
  }
}
