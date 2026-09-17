// Realistic Bengaluru Urban Bus Stops & Transit Shelters
// BENGALURU: LAST CITY - Phase 2.5 Overhaul
import * as THREE from 'three';

export const BUS_STOPS = [
  {
    id: 'BS-01',
    name: 'ಎಂ. ಜಿ. ರಸ್ತೆ • MG ROAD CENTRAL INTERCHANGE',
    routes: '201G, 335E, G4, SBS-1',
    pos: new THREE.Vector3(0, 0, 14.5),
    yaw: 0
  },
  {
    id: 'BS-02',
    name: 'ಕೇಂದ್ರ ಮಾರುಕಟ್ಟೆ • CENTRAL MARKET TERMINAL',
    routes: '201G, D3, 144, 305',
    pos: new THREE.Vector3(80, 0, 14.5),
    yaw: 0
  },
  {
    id: 'BS-03',
    name: 'ಟೆಕ್ ಪಾರ್ಕ್ ಗೇಟ್ • IT TECH PARK GATE 1',
    routes: '335E, 500D, G2',
    pos: new THREE.Vector3(145, 0, -55),
    yaw: Math.PI / 2
  },
  {
    id: 'BS-04',
    name: 'ಮೆಜೆಸ್ಟಿಕ್ ವೆಸ್ಟ್ • MAJESTIC TRANSIT HUB',
    routes: '201G, G4, V-335E',
    pos: new THREE.Vector3(-180, 0, 14.5),
    yaw: 0
  }
];

export class BusStopSystem {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.stops = BUS_STOPS;

    this.buildAllBusStops();
    this.scene.add(this.group);
  }

  buildAllBusStops() {
    this.stops.forEach(stopCfg => {
      const stopMesh = this.createBusStopMesh(stopCfg);
      stopMesh.position.copy(stopCfg.pos);
      stopMesh.rotation.y = stopCfg.yaw;
      this.group.add(stopMesh);
    });
  }

  createBusStopMesh(cfg) {
    const group = new THREE.Group();

    // PBR Materials
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.85, roughness: 0.25 });
    const canopyBlueMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.5, roughness: 0.3 });
    const benchWoodMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.7 });
    const glassAdMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.1 });
    const ledMat = new THREE.MeshBasicMaterial({ color: 0xffb300 });

    const shelterW = 8.5;
    const shelterD = 2.4;
    const shelterH = 3.2;

    // 1. Concrete Paved Bus Bay Waiting Platform
    const platform = new THREE.Mesh(new THREE.BoxGeometry(shelterW + 2, 0.2, shelterD + 1.2), steelMat);
    platform.position.set(0, 0.1, 0);
    platform.receiveShadow = true;
    group.add(platform);

    // Yellow Asphalt Bus Bay Curb Marking
    const curbMat = new THREE.MeshBasicMaterial({ color: 0xffd600 });
    const curb = new THREE.Mesh(new THREE.BoxGeometry(shelterW + 3.0, 0.05, 0.35), curbMat);
    curb.position.set(0, 0.21, -shelterD * 0.5 - 0.4);
    group.add(curb);

    // 2. Cantilevered Steel Support Posts
    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, shelterH, 8);
    [-shelterW * 0.4, shelterW * 0.4].forEach(px => {
      const post = new THREE.Mesh(postGeo, steelMat);
      post.position.set(px, shelterH / 2, shelterD * 0.35);
      post.castShadow = true;
      group.add(post);
    });

    // 3. Signature Curved Canopy Roof
    const canopyGeo = new THREE.CylinderGeometry(shelterD * 0.85, shelterD * 0.85, shelterW, 16, 1, false, 0, Math.PI);
    const canopy = new THREE.Mesh(canopyGeo, canopyBlueMat);
    canopy.rotation.z = Math.PI / 2;
    canopy.position.set(0, shelterH + 0.1, shelterD * 0.1);
    canopy.castShadow = true;
    group.add(canopy);

    // 4. Rear Glass Advertising & Route Map Panel
    const adPanel = new THREE.Mesh(new THREE.BoxGeometry(shelterW * 0.65, 1.8, 0.08), glassAdMat);
    adPanel.position.set(0, 1.4, shelterD * 0.38);
    group.add(adPanel);

    // 5. Stainless Steel Passenger Bench
    const bench = new THREE.Mesh(new THREE.BoxGeometry(shelterW * 0.55, 0.08, 0.45), benchWoodMat);
    bench.position.set(0, 0.55, shelterD * 0.15);
    bench.castShadow = true;
    group.add(bench);

    // 6. Bilingual Station Name & Route Board
    const boardMat = new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.4 });
    const signBoard = new THREE.Mesh(new THREE.BoxGeometry(shelterW * 0.9, 0.65, 0.12), boardMat);
    signBoard.position.set(0, shelterH - 0.15, -shelterD * 0.2);
    group.add(signBoard);

    // Digital ETA LED Matrix Board
    const etaBoard = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.25, 0.06), ledMat);
    etaBoard.position.set(shelterW * 0.3, shelterH - 0.15, -shelterD * 0.25);
    group.add(etaBoard);

    return group;
  }
}
