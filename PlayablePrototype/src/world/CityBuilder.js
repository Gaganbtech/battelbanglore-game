// High-Fidelity Bengaluru City Architecture, Street Clutter, and Environmental Detail
// BENGALURU: LAST CITY - Phase 2 Overhaul
import * as THREE from 'three';

export class CityBuilder {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.windowMaterials = [];
    this.colliders = [];

    this.buildZoneA_CentralUrban();
    this.buildZoneB_ITTechPark();
    this.buildZoneC_Residential();
    this.buildZoneD_Industrial();
    this.buildZoneG_SuburbanLake();
    this.buildStreetClutterAndInfrastructure();

    this.scene.add(this.group);
  }

  buildZoneA_CentralUrban() {
    // Zone A: Commercial street, multi-story shopping complexes, vibrant local signages
    const buildingGroup = new THREE.Group();

    const commercialColors = [0xd6c7b2, 0xc2b5a1, 0x8a9ba8, 0x5a6572, 0xdfcfbe];
    const shopBoardColors = [0xd32f2f, 0x1565c0, 0x2e7d32, 0xef6c00, 0x6a1b9a];
    const shopNames = [
      "ಬೆಂಗಳೂರು ಬೇಕರಿ • BENGALURU IYENGAR BAKERY",
      "ನಮ್ಮ ಕಾಫಿ • NAMMA FILTER COFFEE",
      "ಕಾವೇರಿ ಸಿಲ್ಕ್ಸ್ • CAUVERY TEXTILE EMPORIUM",
      "ಉಡುಪಿ ಗ್ರಾಂಡ್ • UDUPI DELIGHTS",
      "ಶಾಪ್ & ಸ್ಟಾಪ್ • QUICK MART",
      "ಶ್ರೀ ಬಾಲಾಜಿ ಮೆಡಿಕಲ್ಸ್ • BALAJI PHARMACY",
      "ಕರ್ನಾಟಕ ಕ್ರಾಫ್ಟ್ಸ್ • KARNATAKA HANDICRAFTS"
    ];

    const wallMatPool = commercialColors.map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.82 }));
    const concreteTrimMat = new THREE.MeshStandardMaterial({ color: 0x3e454f, roughness: 0.7 });
    const acMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.4, metalness: 0.3 });
    const shutterMat = new THREE.MeshStandardMaterial({ color: 0x78909c, metalness: 0.7, roughness: 0.4 });
    const tankMat = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.5 }); // Black Sintex tank

    // Glass window material
    const winMat = new THREE.MeshStandardMaterial({
      color: 0x223344,
      roughness: 0.15,
      metalness: 0.85,
      emissive: 0xffd54f,
      emissiveIntensity: 0.12
    });
    this.windowMaterials.push(winMat);

    // Cluster along Central Boulevard (x: -90 to +90, z: 20 to 80)
    for (let i = 0; i < 14; i++) {
      const bx = (i % 7) * 26 - 78;
      const bz = Math.floor(i / 7) * 36 + 28;
      const width = 18 + (i % 3) * 2;
      const depth = 20 + (i % 2) * 4;
      const height = 24 + (i % 4) * 8; // 24m to 48m

      const wallMat = wallMatPool[i % wallMatPool.length];

      // 1. Base Building Core
      const bldg = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), wallMat);
      bldg.position.set(bx, height / 2, bz);
      bldg.castShadow = true;
      bldg.receiveShadow = true;
      buildingGroup.add(bldg);

      // 2. Concrete Base Plinth / Ground Floor Arcade
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(width + 0.6, 4.5, depth + 0.6), concreteTrimMat);
      plinth.position.set(bx, 2.25, bz);
      buildingGroup.add(plinth);

      // Ground Floor Metal Roll-Up Security Shutters
      const shutter = new THREE.Mesh(new THREE.BoxGeometry(width * 0.7, 3.2, 0.2), shutterMat);
      shutter.position.set(bx, 2.0, bz - depth / 2 - 0.35);
      buildingGroup.add(shutter);

      // 3. Ground-Floor Retail Signboard with Bilingual Kannada/English
      const boardMat = new THREE.MeshStandardMaterial({
        color: shopBoardColors[i % shopBoardColors.length],
        roughness: 0.4
      });
      const shopBoard = new THREE.Mesh(new THREE.BoxGeometry(width * 0.85, 1.6, 0.4), boardMat);
      shopBoard.position.set(bx, 4.2, bz - depth / 2 - 0.4);
      buildingGroup.add(shopBoard);

      // Storefront Fabric Awning
      const awningMat = new THREE.MeshStandardMaterial({
        color: (i % 2 === 0) ? 0xc62828 : 0x1565c0,
        roughness: 0.7
      });
      const awning = new THREE.Mesh(new THREE.BoxGeometry(width * 0.75, 0.15, 1.8), awningMat);
      awning.rotation.x = 0.2;
      awning.position.set(bx, 3.4, bz - depth / 2 - 1.0);
      buildingGroup.add(awning);

      // 4. Fenestration: Windows with Architectural Frames & Sills
      for (let floor = 7.5; floor < height - 3; floor += 4.2) {
        // Continuous ribbon windows or paired punched openings
        const winPane = new THREE.Mesh(new THREE.BoxGeometry(width * 0.82, 1.6, 0.15), winMat);
        winPane.position.set(bx, floor, bz - depth / 2 - 0.08);
        buildingGroup.add(winPane);

        // Concrete Window Sunshade Lintel (Chajja - signature Indian architecture)
        const chajja = new THREE.Mesh(new THREE.BoxGeometry(width * 0.86, 0.12, 0.8), concreteTrimMat);
        chajja.position.set(bx, floor + 0.9, bz - depth / 2 - 0.4);
        buildingGroup.add(chajja);

        // Split AC outdoor compressor units
        if (floor % 8 === 0) {
          const acUnit = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.45), acMat);
          acUnit.position.set(bx + (width * 0.35), floor - 0.4, bz - depth / 2 - 0.3);
          buildingGroup.add(acUnit);
        }
      }

      // 5. Rooftop Equipment: Elevator Penthouse, Sintex Water Tanks & Telecom Masts
      const liftPenthouse = new THREE.Mesh(new THREE.BoxGeometry(width * 0.35, 3.8, depth * 0.35), concreteTrimMat);
      liftPenthouse.position.set(bx, height + 1.9, bz);
      buildingGroup.add(liftPenthouse);

      // 2x Black Sintex Water Tanks
      for (let t = -1; t <= 1; t += 2) {
        const tank = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 2.0, 12), tankMat);
        tank.position.set(bx + t * (width * 0.25), height + 1.0, bz + depth * 0.2);
        tank.castShadow = true;
        buildingGroup.add(tank);
      }

      // Communication / Cellular Lattice Mast
      if (i % 3 === 0) {
        const mastMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9, roughness: 0.2 });
        const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.6, 12, 6), mastMat);
        mast.position.set(bx, height + 6.0, bz);
        buildingGroup.add(mast);
      }
    }

    this.group.add(buildingGroup);
  }

  buildZoneB_ITTechPark() {
    // Zone B: Modern Electronic City style glass office towers
    const itGroup = new THREE.Group();

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x142844,
      roughness: 0.08,
      metalness: 0.96,
      emissive: 0x00e5ff,
      emissiveIntensity: 0.15
    });
    this.windowMaterials.push(glassMat);

    const mullionMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.85, roughness: 0.25 });
    const graniteMat = new THREE.MeshStandardMaterial({ color: 0x212529, roughness: 0.6 });

    const towers = [
      { x: 100, z: -80, w: 28, d: 28, h: 76, name: "CYBER HUB ONE" },
      { x: 155, z: -70, w: 34, d: 30, h: 96, name: "VAJRA TECH TOWER" }, // Signature Landmark
      { x: 200, z: -90, w: 26, d: 26, h: 68, name: "INNOVATION LABS" },
      { x: 135, z: -135, w: 32, d: 30, h: 62, name: "GLOBAL IT PARK" },
      { x: 185, z: -145, w: 30, d: 28, h: 72, name: "SILICON NEXUS" }
    ];

    towers.forEach(({ x, z, w, d, h, name }) => {
      // 1. Tower Glass Curtain Core
      const core = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), glassMat);
      core.position.set(x, h / 2, z);
      core.castShadow = true;
      core.receiveShadow = true;
      itGroup.add(core);

      // 2. Vertical Architectural Fins / Sun Louvers
      for (let finX = -w / 2; finX <= w / 2; finX += 4.5) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.3, h + 1.5, 0.8), mullionMat);
        fin.position.set(x + finX, h / 2, z - d / 2 - 0.4);
        itGroup.add(fin);
      }

      // 3. Ground Floor Double-Height Grand Lobby Entrance
      const lobby = new THREE.Mesh(new THREE.BoxGeometry(w + 2, 7.5, d + 2), graniteMat);
      lobby.position.set(x, 3.75, z);
      itGroup.add(lobby);

      // Canopy over lobby
      const lobbyCanopy = new THREE.Mesh(new THREE.BoxGeometry(w * 0.6, 0.3, 5.0), mullionMat);
      lobbyCanopy.position.set(x, 7.2, z - d / 2 - 2.5);
      itGroup.add(lobbyCanopy);

      // 4. Helipad or Spire on Top
      if (h > 80) {
        // Helipad atop tallest tower
        const helipad = new THREE.Mesh(new THREE.CylinderGeometry(8.5, 8.5, 0.6, 24), graniteMat);
        helipad.position.set(x, h + 0.3, z);
        itGroup.add(helipad);

        // Helipad Yellow 'H' Marking
        const hLine1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 8.0), new THREE.MeshBasicMaterial({ color: 0xffeb3b }));
        hLine1.position.set(x - 2.5, h + 0.65, z);
        itGroup.add(hLine1);

        const hLine2 = hLine1.clone();
        hLine2.position.x = x + 2.5;
        itGroup.add(hLine2);

        const hCross = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.05, 1.2), new THREE.MeshBasicMaterial({ color: 0xffeb3b }));
        hCross.position.set(x, h + 0.65, z);
        itGroup.add(hCross);

        // Aviation Safety Red Beacon
        const beacon = new THREE.PointLight(0xff1744, 2.0, 25);
        beacon.position.set(x, h + 4.0, z);
        itGroup.add(beacon);
      }
    });

    this.group.add(itGroup);
  }

  buildZoneC_Residential() {
    // Zone C: Dense Residential Apartments with balconies & water tanks
    const resGroup = new THREE.Group();
    const pastelColors = [0xf5e6d3, 0xe8d0b5, 0xd0e1d4, 0xf0e0d6, 0xd9d2e9];
    const railingMat = new THREE.MeshStandardMaterial({ color: 0x1f242d, metalness: 0.7 });
    const tankMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4 });

    for (let r = 0; r < 10; r++) {
      const rx = -80 - (r % 4) * 32;
      const rz = -60 - Math.floor(r / 4) * 38;
      const rw = 22 + (r % 2) * 4;
      const rd = 22 + (r % 3) * 4;
      const rh = 20 + (r % 4) * 6; // 5 to 8 storeys

      const wallMat = new THREE.MeshStandardMaterial({
        color: pastelColors[r % pastelColors.length],
        roughness: 0.85
      });

      const apt = new THREE.Mesh(new THREE.BoxGeometry(rw, rh, rd), wallMat);
      apt.position.set(rx, rh / 2, rz);
      apt.castShadow = true;
      apt.receiveShadow = true;
      resGroup.add(apt);

      // Multi-tier Balconies with Railings
      for (let f = 4.0; f < rh - 2; f += 3.8) {
        // Balcony slab
        const slab = new THREE.Mesh(new THREE.BoxGeometry(rw * 0.75, 0.25, 2.2), wallMat);
        slab.position.set(rx, f, rz + rd / 2 + 1.1);
        resGroup.add(slab);

        // Balcony metal railing
        const railing = new THREE.Mesh(new THREE.BoxGeometry(rw * 0.75, 0.9, 0.08), railingMat);
        railing.position.set(rx, f + 0.55, rz + rd / 2 + 2.15);
        resGroup.add(railing);
      }

      // Rooftop Sintex Water Tanks
      for (let t = -1; t <= 1; t += 2) {
        const tank = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2.2, 12), tankMat);
        tank.position.set(rx + t * 5, rh + 1.1, rz);
        tank.castShadow = true;
        resGroup.add(tank);
      }
    }

    this.group.add(resGroup);
  }

  buildZoneD_Industrial() {
    // Zone D: Industrial logistics warehouses and container yards
    const indGroup = new THREE.Group();
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x455a64, metalness: 0.7, roughness: 0.4 });
    const containerColors = [0xd32f2f, 0x1976d2, 0x388e3c, 0xfbc02d];

    // Warehouses
    for (let w = 0; w < 4; w++) {
      const wx = 105 + (w % 2) * 55;
      const wz = 90 + Math.floor(w / 2) * 50;

      const whBody = new THREE.Mesh(new THREE.BoxGeometry(44, 13, 34), metalMat);
      whBody.position.set(wx, 6.5, wz);
      whBody.castShadow = true;
      whBody.receiveShadow = true;
      indGroup.add(whBody);
    }

    // Shipping Containers
    for (let c = 0; c < 16; c++) {
      const cx = 175 + (c % 4) * 8;
      const cz = 75 + Math.floor(c / 4) * 16;
      const stack = (c % 3 === 0) ? 2 : 1;

      for (let s = 0; s < stack; s++) {
        const cMat = new THREE.MeshStandardMaterial({
          color: containerColors[(c + s) % containerColors.length],
          roughness: 0.6,
          metalness: 0.5
        });
        const container = new THREE.Mesh(new THREE.BoxGeometry(6.2, 2.6, 12.2), cMat);
        container.position.set(cx, 1.3 + s * 2.6, cz);
        container.castShadow = true;
        indGroup.add(container);
      }
    }

    this.group.add(indGroup);
  }

  buildZoneG_SuburbanLake() {
    const lakeGroup = new THREE.Group();
    const waterGeo = new THREE.PlaneGeometry(100, 90, 16, 16);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0d3b4c,
      roughness: 0.08,
      metalness: 0.9,
      transparent: true,
      opacity: 0.88
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(-130, 0.05, 120);
    water.receiveShadow = true;
    lakeGroup.add(water);

    this.group.add(lakeGroup);
  }

  buildStreetClutterAndInfrastructure() {
    const clutterGroup = new THREE.Group();

    // 1. Concrete Utility Power Poles with Tangled Sagging Overhead Cables
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x616161, roughness: 0.8 });
    const cableMat = new THREE.MeshBasicMaterial({ color: 0x111111 });

    const poleCoords = [
      [-60, 14], [-30, 14], [30, 14], [60, 14],
      [-60, -14], [-30, -14], [30, -14], [60, -14]
    ];

    poleCoords.forEach(([px, pz]) => {
      // Concrete pole
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 9.5, 8), poleMat);
      pole.position.set(px, 4.75, pz);
      pole.castShadow = true;
      clutterGroup.add(pole);

      // Cross-arm crossbar
      const crossarm = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 0.12), poleMat);
      crossarm.position.set(px, 9.0, pz);
      clutterGroup.add(crossarm);

      // Drooping Cable Spans between consecutive poles
      if (px < 60) {
        const nextPx = px + 30;
        const cableGeo = new THREE.CylinderGeometry(0.015, 0.015, 30.2, 4);
        const cable = new THREE.Mesh(cableGeo, cableMat);
        cable.rotation.z = Math.PI / 2;
        cable.position.set(px + 15, 8.8, pz);
        clutterGroup.add(cable);
      }
    });

    // 2. High-Voltage Electrical Distribution Transformer Box
    const transMat = new THREE.MeshStandardMaterial({ color: 0x37474f, metalness: 0.6, roughness: 0.4 });
    const transformer = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.6, 1.6), transMat);
    transformer.position.set(-42, 1.3, 14);
    transformer.castShadow = true;
    clutterGroup.add(transformer);

    // 3. Classic Bengaluru Green & Yellow 3-Wheeler Auto-Rickshaws (Static Props)
    const autoPositions = [
      { x: -22, z: 14, yaw: 0.2 },
      { x: -18, z: 14.5, yaw: -0.1 },
      { x: 45, z: 14, yaw: 0.4 }
    ];

    autoPositions.forEach(pos => {
      const autoMesh = this.createAutoRickshawMesh();
      autoMesh.position.set(pos.x, 0, pos.z);
      autoMesh.rotation.y = pos.yaw;
      clutterGroup.add(autoMesh);
    });

    // 4. Street Trees (Rain Trees & Gulmohar Avenues)
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.9 });
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.8 });

    for (let tx = -120; tx <= 120; tx += 20) {
      if (Math.abs(tx) < 15) continue;
      const tree = new THREE.Group();
      tree.position.set(tx, 0, 16);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 4.5, 8), trunkMat);
      trunk.position.y = 2.25;
      trunk.castShadow = true;
      tree.add(trunk);

      const canopy = new THREE.Mesh(new THREE.SphereGeometry(3.2, 8, 6), canopyMat);
      canopy.scale.set(1.4, 0.9, 1.4); // Umbrella canopy
      canopy.position.y = 5.0;
      canopy.castShadow = true;
      tree.add(canopy);

      clutterGroup.add(tree);
    }

    this.group.add(clutterGroup);
  }

  createAutoRickshawMesh() {
    const group = new THREE.Group();

    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xffc107, roughness: 0.35 });
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.4 });
    const canvasMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.8 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.7 });

    // Lower Green Body
    const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.65, 1.4), greenMat);
    lowerBody.position.y = 0.55;
    lowerBody.castShadow = true;
    group.add(lowerBody);

    // Upper Yellow Cab & Windshield Frame
    const upperCab = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.75, 1.38), yellowMat);
    upperCab.position.set(-0.3, 1.25, 0);
    upperCab.castShadow = true;
    group.add(upperCab);

    // Front Nose Taper
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.7, 0.9, 4), yellowMat);
    nose.rotation.z = -Math.PI / 2;
    nose.position.set(1.2, 0.65, 0);
    group.add(nose);

    // Canvas Soft Canopy Roof
    const roof = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.15, 1.42), canvasMat);
    roof.position.set(-0.1, 1.68, 0);
    group.add(roof);

    // 3 Wheels (1 Front, 2 Rear)
    const wheelGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.16, 12);
    const frontWheel = new THREE.Mesh(wheelGeo, blackMat);
    frontWheel.rotation.x = Math.PI / 2;
    frontWheel.position.set(1.1, 0.24, 0);
    group.add(frontWheel);

    const rearWheelL = new THREE.Mesh(wheelGeo, blackMat);
    rearWheelL.rotation.x = Math.PI / 2;
    rearWheelL.position.set(-0.8, 0.24, 0.7);
    group.add(rearWheelL);

    const rearWheelR = rearWheelL.clone();
    rearWheelR.position.z = -0.7;
    group.add(rearWheelR);

    return group;
  }

  setNightMode(isNight) {
    const intensity = isNight ? 0.75 : 0.12;
    this.windowMaterials.forEach(mat => {
      if (mat && mat.emissiveIntensity !== undefined) {
        mat.emissiveIntensity = intensity;
      }
    });
  }
}
