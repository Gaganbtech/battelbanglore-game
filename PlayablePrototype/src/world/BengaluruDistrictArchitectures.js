// Distinct Bengaluru District Architecture Templates (Phase 5 Master Production Overhaul)
// Replaces primitive blockouts with authentic Bengaluru structures:
// 1. MG Road Commercial Arcade (Chajjas, Colonnades, Bilingual Kannada/English Signs, Balconies, AC units)
// 2. Silicon Valley Tech Tower (Glass Curtain Walls, Steel Mullions, Rooftop Helipad & Chillers)
// 3. Peenya Industrial Steel Shed (Corrugated siding, Gabled skylights, Roll-up shutter bays)
// 4. Residency Road Apartments (Recessed balconies, Utility drain pipes, Sintex rooftop water tanks)
import * as THREE from 'three';

export class BengaluruDistrictArchitectures {
  constructor() {
    this.initMaterials();
  }

  initMaterials() {
    // 1. MG Road Materials
    this.mgStuccoMat = new THREE.MeshStandardMaterial({
      color: 0xd6c7b2, // Warm cream Bengaluru colonial/commercial stucco
      roughness: 0.86,
      metalness: 0.04
    });
    this.mgTrimMat = new THREE.MeshStandardMaterial({
      color: 0x475569, // Concrete slate gray trim
      roughness: 0.72,
      metalness: 0.1
    });
    this.acUnitMat = new THREE.MeshStandardMaterial({
      color: 0xcfd8dc,
      roughness: 0.45,
      metalness: 0.35
    });

    // 2. Silicon Tech Materials
    this.techGlassMat = new THREE.MeshStandardMaterial({
      color: 0x0f2838, // Deep blue reflective architectural glass
      roughness: 0.08,
      metalness: 0.94,
      clearcoat: 1.0
    });
    this.techSteelMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.3,
      metalness: 0.88
    });
    this.techAtriumMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.65
    });

    // 3. Peenya Industrial Materials
    this.industrialSheetMat = new THREE.MeshStandardMaterial({
      color: 0x546e7a, // Weathered corrugated steel
      roughness: 0.65,
      metalness: 0.7
    });
    this.hazardStripeMat = new THREE.MeshStandardMaterial({
      color: 0xeab308, // Hazard yellow
      roughness: 0.5,
      metalness: 0.2
    });
    this.shutterMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.55,
      metalness: 0.65
    });

    // 4. Residency Apartment Materials
    this.residencyBrickMat = new THREE.MeshStandardMaterial({
      color: 0xc27ba0, // Dusty pink/brick Bengaluru apartment plaster
      roughness: 0.88,
      metalness: 0.03
    });
    this.balconyRailingMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4,
      metalness: 0.8
    });
    this.sintexTankMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Sintex blue overhead water tank
      roughness: 0.35,
      metalness: 0.08
    });
  }

  createMGRoadArcade(width = 24, depth = 20, height = 28) {
    const group = new THREE.Group();
    group.name = 'MGRoadCommercialArcade';

    // 1. Main Stucco Core
    const coreHeight = height - 4.5;
    const core = new THREE.Mesh(new THREE.BoxGeometry(width, coreHeight, depth), this.mgStuccoMat);
    core.position.y = coreHeight / 2 + 4.5;
    core.castShadow = true;
    core.receiveShadow = true;
    group.add(core);

    // 2. Ground Floor Covered Colonnade / Walkway (Chajja)
    const chajja = new THREE.Mesh(new THREE.BoxGeometry(width + 2.4, 0.4, depth + 2.4), this.mgTrimMat);
    chajja.position.y = 4.5;
    chajja.castShadow = true;
    group.add(chajja);

    // Pillars along front & sides
    const pillarCount = Math.floor(width / 5);
    const pillarSpacing = width / (pillarCount + 1);
    for (let i = 1; i <= pillarCount; i++) {
      const px = -width / 2 + i * pillarSpacing;
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 4.5, 0.8), this.mgTrimMat);
      pillar.position.set(px, 2.25, depth / 2 + 0.8);
      pillar.castShadow = true;
      group.add(pillar);
    }

    // 3. Bilingual Kannada & English Shop Signboard
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 512;
    signCanvas.height = 128;
    const sctx = signCanvas.getContext('2d');
    sctx.fillStyle = '#b91c1c'; // Red background
    sctx.fillRect(0, 0, 512, 128);
    sctx.strokeStyle = '#fef08a';
    sctx.lineWidth = 6;
    sctx.strokeRect(4, 4, 504, 120);

    sctx.fillStyle = '#ffffff';
    sctx.font = 'bold 36px sans-serif';
    sctx.textAlign = 'center';
    sctx.fillText('ಬೆಂಗಳೂರು ಬೇಕರಿ', 256, 48);
    sctx.font = 'bold 26px sans-serif';
    sctx.fillText('BENGALURU IYENGAR BAKERY', 256, 95);

    const signTex = new THREE.CanvasTexture(signCanvas);
    const signMat = new THREE.MeshBasicMaterial({ map: signTex });
    const signMesh = new THREE.Mesh(new THREE.BoxGeometry(width * 0.75, 2.2, 0.15), signMat);
    signMesh.position.set(0, 3.4, depth / 2 + 1.25);
    group.add(signMesh);

    // 4. Balconies with Railings on Upper Floors
    const floors = Math.floor((height - 5) / 4);
    for (let f = 1; f <= floors; f++) {
      const fy = 4.5 + f * 3.8;
      const balconySlab = new THREE.Mesh(new THREE.BoxGeometry(width * 0.8, 0.25, 1.4), this.mgTrimMat);
      balconySlab.position.set(0, fy, depth / 2 + 0.7);
      group.add(balconySlab);

      const railing = new THREE.Mesh(new THREE.BoxGeometry(width * 0.8, 0.9, 0.08), this.balconyRailingMat);
      railing.position.set(0, fy + 0.45, depth / 2 + 1.35);
      group.add(railing);

      // AC Compressor Outdoor Unit
      const acUnit = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.4), this.acUnitMat);
      acUnit.position.set(width * 0.35, fy + 0.35, depth / 2 + 0.3);
      group.add(acUnit);
    }

    // 5. Rooftop Parapet & Sintex Water Tank
    const parapet = new THREE.Mesh(new THREE.BoxGeometry(width + 0.6, 0.8, depth + 0.6), this.mgTrimMat);
    parapet.position.y = height + 0.4;
    group.add(parapet);

    const waterTank = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2.2, 12), this.sintexTankMat);
    waterTank.position.set(width * 0.25, height + 1.1, -depth * 0.25);
    waterTank.castShadow = true;
    group.add(waterTank);

    return group;
  }

  createTechCurtainWallTower(width = 32, depth = 28, height = 65) {
    const group = new THREE.Group();
    group.name = 'SiliconTechCurtainWallTower';

    // 1. High-Gloss Glass Curtain Core
    const glassTower = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), this.techGlassMat);
    glassTower.position.y = height / 2;
    glassTower.castShadow = true;
    glassTower.receiveShadow = true;
    group.add(glassTower);

    // 2. Vertical Structural Steel Mullions
    const mullionSpacing = 4.0;
    const mullionCols = Math.floor(width / mullionSpacing);
    for (let i = 0; i <= mullionCols; i++) {
      const mx = -width / 2 + i * mullionSpacing;
      const mullionFront = new THREE.Mesh(new THREE.BoxGeometry(0.18, height, 0.25), this.techSteelMat);
      mullionFront.position.set(mx, height / 2, depth / 2 + 0.12);
      group.add(mullionFront);

      const mullionBack = new THREE.Mesh(new THREE.BoxGeometry(0.18, height, 0.25), this.techSteelMat);
      mullionBack.position.set(mx, height / 2, -depth / 2 - 0.12);
      group.add(mullionBack);
    }

    // 3. Horizontal Spandrel Louvers / Floor Division Bands
    const floorHeight = 4.2;
    const floorCount = Math.floor(height / floorHeight);
    for (let f = 1; f < floorCount; f++) {
      const fy = f * floorHeight;
      const band = new THREE.Mesh(new THREE.BoxGeometry(width + 0.4, 0.45, depth + 0.4), this.techSteelMat);
      band.position.y = fy;
      group.add(band);
    }

    // 4. Ground Floor Double-Height Glass Atrium
    const atrium = new THREE.Mesh(new THREE.BoxGeometry(width + 1.2, 7.5, depth + 1.2), this.techAtriumMat);
    atrium.position.y = 3.75;
    group.add(atrium);

    // 5. Rooftop Helipad & HVAC Cooling Chiller Units
    const roofBase = new THREE.Mesh(new THREE.BoxGeometry(width + 0.8, 1.2, depth + 0.8), this.techSteelMat);
    roofBase.position.y = height + 0.6;
    group.add(roofBase);

    // Helipad Octagon Platform
    const helipad = new THREE.Mesh(new THREE.CylinderGeometry(7.5, 7.5, 0.35, 8), this.techSteelMat);
    helipad.position.set(0, height + 1.4, 0);
    group.add(helipad);

    // Helipad Yellow Perimeter Ring
    const heliRing = new THREE.Mesh(new THREE.TorusGeometry(6.5, 0.25, 6, 24), this.hazardStripeMat);
    heliRing.rotation.x = Math.PI / 2;
    heliRing.position.set(0, height + 1.6, 0);
    group.add(heliRing);

    // HVAC Chiller units
    for (let c = -1; c <= 1; c += 2) {
      const chiller = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2.5, 2.5), this.industrialSheetMat);
      chiller.position.set(c * (width * 0.32), height + 2.0, -depth * 0.25);
      group.add(chiller);
    }

    return group;
  }

  createPeenyaIndustrialShed(width = 36, depth = 45, height = 16) {
    const group = new THREE.Group();
    group.name = 'PeenyaIndustrialSteelShed';

    // 1. Corrugated Steel Siding Core
    const shed = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), this.industrialSheetMat);
    shed.position.y = height / 2;
    shed.castShadow = true;
    shed.receiveShadow = true;
    group.add(shed);

    // 2. Gabled Triangular Roof Truss
    const roofTrussGeo = new THREE.ConeGeometry(width * 0.65, 5.0, 4);
    roofTrussGeo.rotateY(Math.PI / 4);
    roofTrussGeo.scale(1.0, 1.0, depth / (width * 0.65));
    const roofTruss = new THREE.Mesh(roofTrussGeo, this.industrialSheetMat);
    roofTruss.position.set(0, height + 2.5, 0);
    roofTruss.castShadow = true;
    group.add(roofTruss);

    // 3. Roll-up Shutter Loading Bays (Front Facade)
    const bayWidth = 6.5;
    const bayHeight = 5.2;
    [-11, 0, 11].forEach(bx => {
      // Dark corrugated metal shutter
      const shutter = new THREE.Mesh(new THREE.BoxGeometry(bayWidth, bayHeight, 0.3), this.shutterMat);
      shutter.position.set(bx, bayHeight / 2, depth / 2 + 0.15);
      group.add(shutter);

      // Yellow/Black Hazard Threshold Trim
      const hazardTrim = new THREE.Mesh(new THREE.BoxGeometry(bayWidth + 0.8, 0.4, 0.6), this.hazardStripeMat);
      hazardTrim.position.set(bx, 0.2, depth / 2 + 0.45);
      group.add(hazardTrim);
    });

    // 4. Exposed Exterior I-Beam Steel Columns
    const beamCount = 5;
    const spacing = depth / (beamCount - 1);
    for (let i = 0; i < beamCount; i++) {
      const bz = -depth / 2 + i * spacing;
      [-width / 2 - 0.25, width / 2 + 0.25].forEach(bx => {
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.5, height + 2, 0.5), this.techSteelMat);
        col.position.set(bx, (height + 2) / 2, bz);
        group.add(col);
      });
    }

    return group;
  }

  createResidencyApartment(width = 26, depth = 22, height = 34) {
    const group = new THREE.Group();
    group.name = 'ResidencyApartmentComplex';

    // 1. Textured Terracotta / Pastel Pink Stucco Facade
    const apartment = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), this.residencyBrickMat);
    apartment.position.y = height / 2;
    apartment.castShadow = true;
    apartment.receiveShadow = true;
    group.add(apartment);

    // 2. Individual Staggered Balconies
    const floorH = 3.6;
    const floors = Math.floor(height / floorH);
    for (let f = 1; f < floors; f++) {
      const fy = f * floorH;

      // Front balconies (2 per floor)
      [-width * 0.25, width * 0.25].forEach(bx => {
        const balcSlab = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.25, 1.6), this.mgTrimMat);
        balcSlab.position.set(bx, fy, depth / 2 + 0.8);
        group.add(balcSlab);

        const balcRailing = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.85, 0.08), this.balconyRailingMat);
        balcRailing.position.set(bx, fy + 0.45, depth / 2 + 1.55);
        group.add(balcRailing);
      });
    }

    // 3. Exterior PVC Utility Drain Pipes running down the building corner
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, height + 1, 8), this.mgTrimMat);
    pipe.position.set(width / 2 - 0.6, height / 2, depth / 2 + 0.15);
    group.add(pipe);

    // 4. Rooftop Stairwell Headroom Tower
    const stairwell = new THREE.Mesh(new THREE.BoxGeometry(6.5, 3.2, 5.5), this.residencyBrickMat);
    stairwell.position.set(-width * 0.2, height + 1.6, -depth * 0.2);
    group.add(stairwell);

    // 5. Overhead Sintex Water Tanks on Stilts
    [-2, 2].forEach(tx => {
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 1.8, 10), this.sintexTankMat);
      tank.position.set(width * 0.2 + tx, height + 1.8, -depth * 0.2);
      tank.castShadow = true;
      group.add(tank);
    });

    return group;
  }
}
