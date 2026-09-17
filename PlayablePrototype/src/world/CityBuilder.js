// Bengaluru 7-Zone City Architecture Generator
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

    this.scene.add(this.group);
  }

  buildZoneA_CentralUrban() {
    // Zone A: Commercial street, multi-story shopping complexes, vibrant local signages
    const buildingGroup = new THREE.Group();

    const commercialColors = [0xdfcfbe, 0xc4b7a6, 0x8a9ba8, 0x4f5d68];
    const shopBoardColors = [0xd32f2f, 0x1976d2, 0x388e3c, 0xf57c00]; // Indian retail signboards

    // Cluster along Central Boulevard (x: -90 to +90, z: 20 to 80)
    for (let i = 0; i < 14; i++) {
      const bx = (i % 7) * 26 - 78;
      const bz = Math.floor(i / 7) * 36 + 28;
      const width = 18 + Math.random() * 4;
      const depth = 20 + Math.random() * 6;
      const height = 22 + Math.random() * 26;

      const wallColor = commercialColors[i % commercialColors.length];
      const wallMat = new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.8 });

      const bldg = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), wallMat);
      bldg.position.set(bx, height / 2, bz);
      bldg.castShadow = true;
      bldg.receiveShadow = true;
      buildingGroup.add(bldg);

      // Windows with emissive lighting for night
      const winMat = new THREE.MeshStandardMaterial({
        color: 0x334455,
        roughness: 0.2,
        metalness: 0.8,
        emissive: 0xffd54f,
        emissiveIntensity: 0.1
      });
      this.windowMaterials.push(winMat);

      for (let floor = 4; floor < height - 2; floor += 4) {
        const stripN = new THREE.Mesh(new THREE.BoxGeometry(width * 0.85, 1.4, 0.2), winMat);
        stripN.position.set(bx, floor, bz - depth / 2 - 0.1);
        buildingGroup.add(stripN);
      }

      // Ground-Floor Local Shopfront Boards (e.g. "Bengaluru Cafe", "Sri Balaji Traders")
      const boardMat = new THREE.MeshStandardMaterial({
        color: shopBoardColors[i % shopBoardColors.length],
        roughness: 0.4
      });
      const shopBoard = new THREE.Mesh(new THREE.BoxGeometry(width * 0.75, 1.8, 0.4), boardMat);
      shopBoard.position.set(bx, 2.5, bz - depth / 2 - 0.25);
      buildingGroup.add(shopBoard);

      // Rooftop utility box / lift room
      const roofBox = new THREE.Mesh(new THREE.BoxGeometry(width * 0.4, 3.5, depth * 0.4), wallMat);
      roofBox.position.set(bx, height + 1.75, bz);
      buildingGroup.add(roofBox);
    }

    this.group.add(buildingGroup);
  }

  buildZoneB_ITTechPark() {
    // Zone B: Modern glass and steel office towers (x: 80 to 220, z: -160 to -40)
    const itGroup = new THREE.Group();

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a5f,
      roughness: 0.1,
      metalness: 0.95,
      emissive: 0x00e5ff,
      emissiveIntensity: 0.12
    });
    this.windowMaterials.push(glassMat);

    const frameMat = new THREE.MeshStandardMaterial({ color: 0xd0d7de, metalness: 0.8, roughness: 0.3 });

    const towerConfigs = [
      { x: 100, z: -80, w: 28, d: 28, h: 72 },
      { x: 150, z: -70, w: 32, d: 26, h: 90 }, // Signature Tech Landmark Tower
      { x: 195, z: -90, w: 26, d: 26, h: 64 },
      { x: 130, z: -130, w: 34, d: 30, h: 58 },
      { x: 180, z: -140, w: 30, d: 30, h: 68 }
    ];

    towerConfigs.forEach(({ x, z, w, d, h }) => {
      // Glass curtain core
      const tower = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), glassMat);
      tower.position.set(x, h / 2, z);
      tower.castShadow = true;
      tower.receiveShadow = true;
      itGroup.add(tower);

      // Architectural facade spines / louvers
      const spineL = new THREE.Mesh(new THREE.BoxGeometry(0.8, h + 2, d + 1), frameMat);
      spineL.position.set(x - w / 2, h / 2, z);
      itGroup.add(spineL);

      const spineR = new THREE.Mesh(new THREE.BoxGeometry(0.8, h + 2, d + 1), frameMat);
      spineR.position.set(x + w / 2, h / 2, z);
      itGroup.add(spineR);

      // Corporate Spire atop tallest tower
      if (h > 80) {
        const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 1.2, 18, 8), frameMat);
        spire.position.set(x, h + 9, z);
        itGroup.add(spire);

        // Aviation warning red beacon
        const beacon = new THREE.PointLight(0xff1744, 1.0, 15);
        beacon.position.set(x, h + 18, z);
        itGroup.add(beacon);
      }
    });

    // Manicured Tech Campus Plaza ground
    const plazaMat = new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.5 });
    const plaza = new THREE.Mesh(new THREE.BoxGeometry(140, 0.4, 120), plazaMat);
    plaza.position.set(150, 0.2, -100);
    plaza.receiveShadow = true;
    itGroup.add(plaza);

    this.group.add(itGroup);
  }

  buildZoneC_Residential() {
    // Zone C: Dense Residential Apartments with balconies and iconic black rooftop Sintex water tanks
    // (x: -180 to -60, z: -150 to -40)
    const resGroup = new THREE.Group();

    const pastelColors = [0xf5e6d3, 0xe8d0b5, 0xd0e1d4, 0xf0e0d6, 0xd9d2e9];
    const tankMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4 }); // Black PVC water tank
    const balconyMat = new THREE.MeshStandardMaterial({ color: 0x3f4854, roughness: 0.6 });

    for (let r = 0; r < 10; r++) {
      const rx = -80 - (r % 4) * 32;
      const rz = -60 - Math.floor(r / 4) * 38;
      const rw = 20 + Math.random() * 4;
      const rd = 22 + Math.random() * 4;
      const rh = 18 + Math.random() * 12; // 4 to 6 storeys

      const wallMat = new THREE.MeshStandardMaterial({
        color: pastelColors[r % pastelColors.length],
        roughness: 0.85
      });

      const apt = new THREE.Mesh(new THREE.BoxGeometry(rw, rh, rd), wallMat);
      apt.position.set(rx, rh / 2, rz);
      apt.castShadow = true;
      apt.receiveShadow = true;
      resGroup.add(apt);

      // Balconies on front facade
      for (let f = 3.5; f < rh - 2; f += 3.5) {
        const balcony = new THREE.Mesh(new THREE.BoxGeometry(rw * 0.7, 1.0, 1.6), balconyMat);
        balcony.position.set(rx, f, rz + rd / 2 + 0.8);
        resGroup.add(balcony);
      }

      // Rooftop Sintex Water Tanks (Signature Indian city skyline silhouette)
      for (let t = -1; t <= 1; t += 2) {
        const tank = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2.2, 12), tankMat);
        tank.position.set(rx + t * 4, rh + 1.1, rz);
        tank.castShadow = true;
        resGroup.add(tank);
      }
    }

    this.group.add(resGroup);
  }

  buildZoneD_Industrial() {
    // Zone D: Industrial logistics warehouses, shipping containers, corrugated roofs
    // (x: 70 to 200, z: 50 to 180)
    const indGroup = new THREE.Group();

    const metalMat = new THREE.MeshStandardMaterial({ color: 0x546e7a, metalness: 0.6, roughness: 0.5 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.7 });
    const containerColors = [0xd32f2f, 0x1976d2, 0x388e3c, 0xfbc02d];

    // Warehouses
    for (let w = 0; w < 4; w++) {
      const wx = 100 + (w % 2) * 55;
      const wz = 90 + Math.floor(w / 2) * 50;

      const whBody = new THREE.Mesh(new THREE.BoxGeometry(42, 12, 32), metalMat);
      whBody.position.set(wx, 6, wz);
      whBody.castShadow = true;
      whBody.receiveShadow = true;
      indGroup.add(whBody);

      // Sloped warehouse gable roof
      const roof = new THREE.Mesh(new THREE.ConeGeometry(24, 5, 4), roofMat);
      roof.position.set(wx, 14.5, wz);
      roof.rotation.y = Math.PI / 4;
      indGroup.add(roof);
    }

    // Shipping Container Yard
    for (let c = 0; c < 16; c++) {
      const cx = 175 + (c % 4) * 8;
      const cz = 75 + Math.floor(c / 4) * 16;
      const stack = (c % 3 === 0) ? 2 : 1;

      for (let s = 0; s < stack; s++) {
        const cMat = new THREE.MeshStandardMaterial({
          color: containerColors[(c + s) % containerColors.length],
          roughness: 0.6,
          metalness: 0.4
        });
        const container = new THREE.Mesh(new THREE.BoxGeometry(6, 2.6, 12), cMat);
        container.position.set(cx, 1.3 + s * 2.6, cz);
        container.castShadow = true;
        indGroup.add(container);
      }
    }

    this.group.add(indGroup);
  }

  buildZoneG_SuburbanLake() {
    // Zone G: Bellandur-style Urban Lake water feature with reflections and lush greenery
    // (x: -180 to -60, z: 60 to 180)
    const lakeGroup = new THREE.Group();

    // Water Surface
    const waterGeo = new THREE.PlaneGeometry(90, 80, 24, 24);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0f4d5c,
      roughness: 0.1,
      metalness: 0.85,
      transparent: true,
      opacity: 0.88
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(-120, 0.05, 110);
    lakeGroup.add(water);

    // Lake Boundary Promenade
    const promMat = new THREE.MeshStandardMaterial({ color: 0x78909c, roughness: 0.8 });
    const promN = new THREE.Mesh(new THREE.BoxGeometry(94, 0.3, 3), promMat);
    promN.position.set(-120, 0.15, 70);
    lakeGroup.add(promN);

    const promS = new THREE.Mesh(new THREE.BoxGeometry(94, 0.3, 3), promMat);
    promS.position.set(-120, 0.15, 150);
    lakeGroup.add(promS);

    // Tropical Foliage / Banyan & Palm Trees around the lake perimeter
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.9 });
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.7 });

    for (let t = 0; t < 22; t++) {
      const angle = (t / 22) * Math.PI * 2;
      const tx = -120 + Math.cos(angle) * (48 + Math.random() * 8);
      const tz = 110 + Math.sin(angle) * (42 + Math.random() * 8);

      const tree = new THREE.Group();
      tree.position.set(tx, 0, tz);

      // Trunk
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 5, 8), trunkMat);
      trunk.position.y = 2.5;
      trunk.castShadow = true;
      tree.add(trunk);

      // Canopy
      const canopy = new THREE.Mesh(new THREE.SphereGeometry(2.8 + Math.random() * 1.2, 8, 8), foliageMat);
      canopy.position.y = 6.0;
      canopy.castShadow = true;
      tree.add(canopy);

      lakeGroup.add(tree);
    }

    this.group.add(lakeGroup);
  }

  setNightMode(isNight) {
    const intensity = isNight ? 1.4 : 0.1;
    this.windowMaterials.forEach(mat => {
      mat.emissiveIntensity = intensity;
    });
  }
}
