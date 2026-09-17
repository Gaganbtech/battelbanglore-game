// High-Detail Enterable Buildings & Modular Interior System (Phase 4)
// Walk-in structures: Peenya Industrial Warehouse, Silicon Valley Tech Office, and Residency Apartment.
// Features functional interactive doors, stairs, furniture props, and contextual loot.
import * as THREE from 'three';

export class EnterableBuildings {
  constructor(scene, audioManager) {
    this.scene = scene;
    this.audioManager = audioManager;
    this.group = new THREE.Group();

    this.interactiveDoors = [];
    this.interiorLootSpawners = [];

    this.buildWarehouse();
    this.buildTechOffice();
    this.buildApartment();

    this.scene.add(this.group);
  }

  buildWarehouse() {
    const whGroup = new THREE.Group();
    whGroup.position.set(-100, 0, -120); // Peenya Industrial Sector

    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x52525b, roughness: 0.85 });
    const corrugatedMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, roughness: 0.6, metalness: 0.3 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.8, roughness: 0.25 });
    const safetyYellowMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xa16207, roughness: 0.8 });

    const width = 28;
    const depth = 32;
    const height = 11;

    // Floor Slab
    const floor = new THREE.Mesh(new THREE.BoxGeometry(width, 0.4, depth), concreteMat);
    floor.position.y = 0.2;
    floor.receiveShadow = true;
    whGroup.add(floor);

    // North & South Exterior Walls
    const wallN = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.4), corrugatedMat);
    wallN.position.set(0, height / 2, depth / 2);
    whGroup.add(wallN);

    // South Wall with Large Open Cargo Bay Portal
    const wallSLeft = new THREE.Mesh(new THREE.BoxGeometry((width - 8) / 2, height, 0.4), corrugatedMat);
    wallSLeft.position.set(-(width - 8) / 4 - 4, height / 2, -depth / 2);
    whGroup.add(wallSLeft);

    const wallSRight = new THREE.Mesh(new THREE.BoxGeometry((width - 8) / 2, height, 0.4), corrugatedMat);
    wallSRight.position.set((width - 8) / 4 + 4, height / 2, -depth / 2);
    whGroup.add(wallSRight);

    const wallSTop = new THREE.Mesh(new THREE.BoxGeometry(8, height - 5.5, 0.4), corrugatedMat);
    wallSTop.position.set(0, 5.5 + (height - 5.5) / 2, -depth / 2);
    whGroup.add(wallSTop);

    // East & West Walls
    const wallE = new THREE.Mesh(new THREE.BoxGeometry(0.4, height, depth), corrugatedMat);
    wallE.position.set(width / 2, height / 2, 0);
    whGroup.add(wallE);

    const wallW = new THREE.Mesh(new THREE.BoxGeometry(0.4, height, depth), corrugatedMat);
    wallW.position.set(-width / 2, height / 2, 0);
    whGroup.add(wallW);

    // Overhead Steel Roof Trusses & Pitched Roof
    const roof = new THREE.Mesh(new THREE.BoxGeometry(width + 2, 0.4, depth + 2), steelMat);
    roof.position.set(0, height + 0.2, 0);
    whGroup.add(roof);

    // Interior Mezzanine Catwalk / Second Floor Office (Height = 5.0m)
    const mezzFloor = new THREE.Mesh(new THREE.BoxGeometry(width - 4, 0.3, 10), concreteMat);
    mezzFloor.position.set(0, 5.0, depth / 2 - 6);
    whGroup.add(mezzFloor);

    // Mezzanine Safety Railing
    const railing = new THREE.Mesh(new THREE.BoxGeometry(width - 4, 1.1, 0.1), safetyYellowMat);
    railing.position.set(0, 5.65, depth / 2 - 11);
    whGroup.add(railing);

    // Steel Staircase from ground to Mezzanine
    const stairs = new THREE.Mesh(new THREE.BoxGeometry(2.4, 5.0, 7.0), steelMat);
    stairs.rotation.x = Math.PI / 6;
    stairs.position.set(-width / 2 + 3, 2.5, depth / 2 - 12);
    whGroup.add(stairs);

    // Shipping Containers inside Warehouse
    const containerMat = new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.5, metalness: 0.4 });
    const container1 = new THREE.Mesh(new THREE.BoxGeometry(6.2, 2.8, 2.6), containerMat);
    container1.position.set(6, 1.4, -4);
    whGroup.add(container1);

    const container2 = new THREE.Mesh(new THREE.BoxGeometry(6.2, 2.8, 2.6), new THREE.MeshStandardMaterial({ color: 0xb91c1c }));
    container2.position.set(6, 4.2, -4);
    whGroup.add(container2);

    // Forklift Prop
    const forklift = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 1.4), safetyYellowMat);
    forklift.position.set(-6, 0.9, -6);
    whGroup.add(forklift);

    // Wooden Pallets
    for (let p = 0; p < 4; p++) {
      const pallet = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.2, 1.4), woodMat);
      pallet.position.set(-6, 0.1 + p * 0.2, 2);
      whGroup.add(pallet);
    }

    // High-Tier Military Weapon Crate Spawner on the Mezzanine
    const weaponCache = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 0.8), new THREE.MeshStandardMaterial({ color: 0x15803d }));
    weaponCache.position.set(0, 5.4, depth / 2 - 4);
    whGroup.add(weaponCache);

    this.interiorLootSpawners.push({
      name: 'Peenya Classified Arms Cache',
      position: new THREE.Vector3(whGroup.position.x, 5.4, whGroup.position.z + depth / 2 - 4),
      category: 'weapon_heavy',
      isLooted: false,
      mesh: weaponCache
    });

    this.group.add(whGroup);
  }

  buildTechOffice() {
    const officeGroup = new THREE.Group();
    officeGroup.position.set(110, 0, -50); // Silicon Valley Tech Corridor

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
      roughness: 0.1,
      metalness: 0.9
    });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
    const woodDeskMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
    const serverMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.8 });
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });

    const width = 22;
    const depth = 24;
    const height = 9;

    // Floor & Glass Exterior Walls
    const floor = new THREE.Mesh(new THREE.BoxGeometry(width, 0.4, depth), whiteMat);
    floor.position.y = 0.2;
    officeGroup.add(floor);

    const wallFront = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.3), glassMat);
    wallFront.position.set(0, height / 2, -depth / 2);
    officeGroup.add(wallFront);

    const wallBack = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.3), whiteMat);
    wallBack.position.set(0, height / 2, depth / 2);
    officeGroup.add(wallBack);

    // Interactive Entrance Glass Door
    const door = new THREE.Mesh(new THREE.BoxGeometry(2.0, 3.2, 0.1), new THREE.MeshStandardMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.7
    }));
    door.position.set(0, 1.6, -depth / 2);
    officeGroup.add(door);

    this.interactiveDoors.push({
      name: 'Tech Lobby Main Door',
      mesh: door,
      isOpen: false,
      basePos: door.position.clone(),
      worldPos: new THREE.Vector3(officeGroup.position.x, 1.6, officeGroup.position.z - depth / 2)
    });

    // Reception Desk
    const reception = new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.1, 1.2), whiteMat);
    reception.position.set(0, 0.55, -depth / 2 + 5);
    officeGroup.add(reception);

    // Open-Plan Developer Desks (Rows of 4 workstations with monitors)
    for (let r = -6; r <= 6; r += 4) {
      const desk = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.75, 1.2), woodDeskMat);
      desk.position.set(r, 0.38, 2);
      officeGroup.add(desk);

      // Dual Monitors
      [-0.6, 0.6].forEach(mx => {
        const monitor = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.45, 0.05), serverMat);
        monitor.position.set(r + mx, 0.98, 2.3);
        officeGroup.add(monitor);
      });
    }

    // Server Racks in Data Room
    for (let s = -4; s <= 4; s += 2.2) {
      const rack = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.4, 0.9), serverMat);
      rack.position.set(s, 1.2, depth / 2 - 3);
      officeGroup.add(rack);

      const serverLED = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.02), ledMat);
      serverLED.position.set(s, 1.8, depth / 2 - 2.54);
      officeGroup.add(serverLED);
    }

    // Contextual Office Loot (High-End Optics & Assault Ammo)
    const ammoBox = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.35, 0.4), new THREE.MeshStandardMaterial({ color: 0x3b82f6 }));
    ammoBox.position.set(0, 1.1, -depth / 2 + 5);
    officeGroup.add(ammoBox);

    this.interiorLootSpawners.push({
      name: 'Tech Office Ammo Stash',
      position: new THREE.Vector3(officeGroup.position.x, 1.1, officeGroup.position.z - depth / 2 + 5),
      category: 'ammo_rare',
      isLooted: false,
      mesh: ammoBox
    });

    this.group.add(officeGroup);
  }

  buildApartment() {
    const aptGroup = new THREE.Group();
    aptGroup.position.set(45, 0, 55); // Residency Road Residential Layout

    const wallMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.8 });
    const woodFloorMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });
    const couchMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.7 }); // Navy sofa
    const kitchenMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5 });

    const width = 16;
    const depth = 16;
    const height = 4.5;

    // Hardwood Floor
    const floor = new THREE.Mesh(new THREE.BoxGeometry(width, 0.3, depth), woodFloorMat);
    floor.position.y = 0.15;
    aptGroup.add(floor);

    // Walls
    const wallN = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.3), wallMat);
    wallN.position.set(0, height / 2, depth / 2);
    aptGroup.add(wallN);

    const wallW = new THREE.Mesh(new THREE.BoxGeometry(0.3, height, depth), wallMat);
    wallW.position.set(-width / 2, height / 2, 0);
    aptGroup.add(wallW);

    const wallE = new THREE.Mesh(new THREE.BoxGeometry(0.3, height, depth), wallMat);
    wallE.position.set(width / 2, height / 2, 0);
    aptGroup.add(wallE);

    // Front Door
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.8, 0.1), new THREE.MeshStandardMaterial({ color: 0x92400e }));
    door.position.set(0, 1.4, -depth / 2);
    aptGroup.add(door);

    this.interactiveDoors.push({
      name: 'Apartment 4B Door',
      mesh: door,
      isOpen: false,
      basePos: door.position.clone(),
      worldPos: new THREE.Vector3(aptGroup.position.x, 1.4, aptGroup.position.z - depth / 2)
    });

    // Modern Sectional Sofa & Coffee Table
    const sofa = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.8, 1.4), couchMat);
    sofa.position.set(-3.5, 0.4, 2);
    aptGroup.add(sofa);

    const coffeeTable = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 0.9), woodFloorMat);
    coffeeTable.position.set(-3.5, 0.2, 0);
    aptGroup.add(coffeeTable);

    // Wall-Mounted 65" OLED TV
    const tv = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 0.08), new THREE.MeshBasicMaterial({ color: 0x09090b }));
    tv.position.set(-3.5, 2.2, -depth / 2 + 0.35);
    aptGroup.add(tv);

    // Kitchenette Counter
    const counter = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.95, 1.1), kitchenMat);
    counter.position.set(4, 0.48, 2);
    aptGroup.add(counter);

    // Contextual Medical Kit on Kitchen Counter
    const medkit = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.35), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
    medkit.position.set(4, 1.1, 2);
    aptGroup.add(medkit);

    this.interiorLootSpawners.push({
      name: 'Apartment Trauma First Aid',
      position: new THREE.Vector3(aptGroup.position.x + 4, 1.1, aptGroup.position.z + 2),
      category: 'med_kit',
      isLooted: false,
      mesh: medkit
    });

    this.group.add(aptGroup);
  }

  toggleClosestDoor(playerPos) {
    for (const d of this.interactiveDoors) {
      const dist = d.worldPos.distanceTo(playerPos);
      if (dist < 3.2) {
        d.isOpen = !d.isOpen;
        // Slide / swing door open
        d.mesh.position.x = d.basePos.x + (d.isOpen ? 1.6 : 0);
        if (this.audioManager) this.audioManager.playUIBeep(d.isOpen ? 640 : 420);
        return { success: true, name: d.name, isOpen: d.isOpen };
      }
    }
    return { success: false };
  }

  getClosestInteriorLoot(playerPos, radius = 3.0) {
    for (const loot of this.interiorLootSpawners) {
      if (!loot.isLooted && loot.position.distanceTo(playerPos) < radius) {
        return loot;
      }
    }
    return null;
  }
}
