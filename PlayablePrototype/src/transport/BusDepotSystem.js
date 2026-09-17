// Majestic Central Bus Depot & Maintenance Workshop
// Strategic Battle Royale Drop & Living Transport Depot System
// BENGALURU: LAST CITY - Phase 4
import * as THREE from 'three';

export class BusDepotSystem {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();

    this.depotCenter = new THREE.Vector3(-60, 0, 95);
    this.depotLootCaches = [];

    this.buildDepotGrounds();
    this.buildMaintenanceWorkshop();
    this.buildDispatchControlOffice();
    this.buildParkedFleet();
    this.buildLootSpawners();

    this.scene.add(this.group);
  }

  buildDepotGrounds() {
    const asphaltMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.9 });
    const yellowStripeMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const fenceMat = new THREE.MeshStandardMaterial({ color: 0x52525b, metalness: 0.7, roughness: 0.4 });

    // Main Depot Concrete/Asphalt Apron (60m x 55m)
    const apron = new THREE.Mesh(new THREE.BoxGeometry(65, 0.2, 55), asphaltMat);
    apron.position.set(this.depotCenter.x, 0.1, this.depotCenter.z);
    apron.receiveShadow = true;
    this.group.add(apron);

    // Yellow Angled Parking Stalls for Buses
    for (let p = -22; p <= 18; p += 8) {
      const stripeL = new THREE.Mesh(new THREE.BoxGeometry(14, 0.05, 0.3), yellowStripeMat);
      stripeL.position.set(this.depotCenter.x + p, 0.22, this.depotCenter.z - 12);
      this.group.add(stripeL);
    }

    // Security Perimeter Chain-Link Fence & High-Mast Floodlights
    [-30, 30].forEach(fx => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.5, 8), fenceMat);
      post.position.set(this.depotCenter.x + fx, 1.75, this.depotCenter.z);
      this.group.add(post);

      // High-Mast Floodlight Tower
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 14.0, 8), fenceMat);
      mast.position.set(this.depotCenter.x + fx, 7.0, this.depotCenter.z - 24);
      this.group.add(mast);

      const lightBar = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.4, 0.8), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
      lightBar.position.set(this.depotCenter.x + fx, 14.0, this.depotCenter.z - 24);
      this.group.add(lightBar);
    });
  }

  buildMaintenanceWorkshop() {
    const shedGroup = new THREE.Group();
    shedGroup.position.set(this.depotCenter.x + 12, 0, this.depotCenter.z + 10);

    const steelMat = new THREE.MeshStandardMaterial({ color: 0x3b4252, metalness: 0.8, roughness: 0.3 });
    const roofSheetMat = new THREE.MeshStandardMaterial({ color: 0x4c566a, roughness: 0.6 });
    const cautionMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x71717a, roughness: 0.8 });

    // Open-Bay Industrial Workshop Shed (26m x 18m, Height 8.5m)
    // Steel I-Beam Portal Columns
    [-12, 0, 12].forEach(cx => {
      [-8, 8].forEach(cz => {
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.5, 8.5, 0.5), steelMat);
        col.position.set(cx, 4.25, cz);
        col.castShadow = true;
        shedGroup.add(col);
      });
    });

    // Pitched Corrugated Steel Roof
    const roof = new THREE.Mesh(new THREE.BoxGeometry(28, 0.3, 20), roofSheetMat);
    roof.position.set(0, 8.6, 0);
    roof.castShadow = true;
    shedGroup.add(roof);

    // Maintenance Inspection Pits (Recessed Service Trenches in Floor)
    [-6, 6].forEach(px => {
      const pitBorder = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.15, 12), cautionMat);
      pitBorder.position.set(px, 0.22, 0);
      shedGroup.add(pitBorder);
    });

    // Overhead Heavy-Duty Yellow Hydraulic Crane Gantry
    const craneBeam = new THREE.Mesh(new THREE.BoxGeometry(24, 0.6, 0.8), cautionMat);
    craneBeam.position.set(0, 7.4, 0);
    shedGroup.add(craneBeam);

    const craneHoist = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 1.2), steelMat);
    craneHoist.position.set(2, 6.4, 0);
    shedGroup.add(craneHoist);

    // Workshop Clutter: Stacked Commercial Tires & Oil Drum Pallets
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    for (let t = 0; t < 5; t++) {
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.38, 14), tireMat);
      tire.position.set(-10, 0.2 + t * 0.38, 6.5);
      shedGroup.add(tire);
    }

    // Industrial Tool Chest
    const toolChest = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 0.8), new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
    toolChest.position.set(-11, 0.8, -6.5);
    shedGroup.add(toolChest);

    this.group.add(shedGroup);
  }

  buildDispatchControlOffice() {
    const officeGroup = new THREE.Group();
    officeGroup.position.set(this.depotCenter.x - 20, 0, this.depotCenter.z + 12);

    const wallMat = new THREE.MeshStandardMaterial({ color: 0x52525b, roughness: 0.7 });
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.4 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, transparent: true, opacity: 0.6 });

    // 2-Story Depot Office Building (12m x 9m x 7.5m)
    const building = new THREE.Mesh(new THREE.BoxGeometry(12, 7.5, 9), wallMat);
    building.position.y = 3.75;
    building.castShadow = true;
    officeGroup.add(building);

    // BMTC Depot Signboard
    const sign = new THREE.Mesh(new THREE.BoxGeometry(9.5, 1.1, 0.2), blueMat);
    sign.position.set(0, 7.2, 4.6);
    officeGroup.add(sign);

    // Large Dispatch Windows
    const win = new THREE.Mesh(new THREE.BoxGeometry(8, 1.8, 0.1), glassMat);
    win.position.set(0, 4.8, 4.55);
    officeGroup.add(win);

    // Rooftop Communications Antenna Mast
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 6.0, 8), wallMat);
    mast.position.set(4, 10.5, 0);
    officeGroup.add(mast);

    const redBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    redBeacon.position.set(4, 13.6, 0);
    officeGroup.add(redBeacon);

    this.group.add(officeGroup);
  }

  buildParkedFleet() {
    const busMatSuvarna = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.4 }); // Green BMTC Suvarna
    const busMatVajra = new THREE.MeshStandardMaterial({ color: 0x1e40af, roughness: 0.3 });   // Blue BMTC Volvo Vajra
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1 });

    // 3 Static Parked BMTC Buses in the yard bays
    const parkedPositions = [
      { x: this.depotCenter.x - 14, z: this.depotCenter.z - 12, rot: 0, mat: busMatSuvarna },
      { x: this.depotCenter.x - 6,  z: this.depotCenter.z - 12, rot: 0, mat: busMatVajra },
      { x: this.depotCenter.x + 2,  z: this.depotCenter.z - 12, rot: 0, mat: busMatSuvarna }
    ];

    parkedPositions.forEach(b => {
      const busGroup = new THREE.Group();
      busGroup.position.set(b.x, 0, b.z);
      busGroup.rotation.y = b.rot;

      const body = new THREE.Mesh(new THREE.BoxGeometry(11.5, 3.2, 2.7), b.mat);
      body.position.y = 1.9;
      body.castShadow = true;
      busGroup.add(body);

      const win = new THREE.Mesh(new THREE.BoxGeometry(11.0, 1.2, 2.75), glassMat);
      win.position.y = 2.4;
      busGroup.add(win);

      // Wheels
      [-3.5, 3.5].forEach(wx => {
        const wL = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.3, 12), tireMat);
        wL.rotation.x = Math.PI / 2;
        wL.position.set(wx, 0.5, 1.35);
        busGroup.add(wL);

        const wR = wL.clone();
        wR.position.z = -1.35;
        busGroup.add(wR);
      });

      this.group.add(busGroup);
    });
  }

  buildLootSpawners() {
    // Strategic High-Tier Military Weapon Crate in the Maintenance Pit
    const crateMat = new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.5, roughness: 0.4 });
    const crate = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.8, 0.9), crateMat);
    crate.position.set(this.depotCenter.x + 12, 0.6, this.depotCenter.z + 10);
    this.group.add(crate);

    this.depotLootCaches.push({
      position: crate.position.clone(),
      isLooted: false,
      mesh: crate
    });
  }
}
