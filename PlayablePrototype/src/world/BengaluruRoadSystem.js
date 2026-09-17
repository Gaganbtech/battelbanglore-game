// Realistic Bengaluru Road Conditions & Authentic Urban Streetscape (Phase 5)
// Features Arterial Good Roads, Patched Weathered Roads, 3D Potholes with Depth,
// Indian Speed Breakers, Storm Drains, Manholes, Paver-Block Footpaths, and Roadside Stalls.
import * as THREE from 'three';

export class BengaluruRoadSystem {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();

    this.buildArterialGoodRoads();
    this.buildPatchedCityRoads();
    this.buildRealistic3DPotholes();
    this.buildIndianSpeedBreakers();
    this.buildDrainageAndManholes();
    this.buildPaverBlockFootpaths();
    this.buildRoadsideStreetFurniture();
    this.buildReferenceRoadsideFeatures();

    this.scene.add(this.group);
  }

  buildArterialGoodRoads() {
    // Fresh Dark Asphalt on Central Boulevard (X: -120 to +120, Z: -12 to +12)
    const freshAsphaltMat = new THREE.MeshStandardMaterial({
      color: 0x181c22, // Deep charcoal bitumen
      roughness: 0.55,
      metalness: 0.12
    });

    const goodRoad = new THREE.Mesh(new THREE.PlaneGeometry(240, 24), freshAsphaltMat);
    goodRoad.rotation.x = -Math.PI / 2;
    goodRoad.position.set(0, 0.02, 0);
    goodRoad.receiveShadow = true;
    this.group.add(goodRoad);
  }

  buildPatchedCityRoads() {
    // Normal Weathered Asphalt with Bitumen Patchwork (Residential & Commercial Links)
    const weatheredMat = new THREE.MeshStandardMaterial({
      color: 0x272b32, // Faded, sun-baked gray asphalt
      roughness: 0.8,
      metalness: 0.08
    });

    const patchMat = new THREE.MeshStandardMaterial({
      color: 0x111418, // Fresh black tar bitumen patch
      roughness: 0.5,
      metalness: 0.15
    });

    // East Outer Ring Road stretch
    const weatheredEast = new THREE.Mesh(new THREE.PlaneGeometry(340, 24), weatheredMat);
    weatheredEast.rotation.x = -Math.PI / 2;
    weatheredEast.position.set(150, 0.02, 0);
    weatheredEast.receiveShadow = true;
    this.group.add(weatheredEast);

    // West Industrial Approach
    const weatheredWest = new THREE.Mesh(new THREE.PlaneGeometry(340, 24), weatheredMat);
    weatheredWest.rotation.x = -Math.PI / 2;
    weatheredWest.position.set(-150, 0.02, 0);
    weatheredWest.receiveShadow = true;
    this.group.add(weatheredWest);

    // North-South Arterial
    const weatheredNS = new THREE.Mesh(new THREE.PlaneGeometry(24, 580), weatheredMat);
    weatheredNS.rotation.x = -Math.PI / 2;
    weatheredNS.position.set(0, 0.02, 0);
    weatheredNS.receiveShadow = true;
    this.group.add(weatheredNS);

    // Realistic Rectangular Bitumen Repair Patches (Common on Bengaluru roads)
    const patchLocations = [
      { x: 35, z: 3, w: 4.2, d: 2.8 },
      { x: 65, z: -4, w: 5.5, d: 3.2 },
      { x: -45, z: 5, w: 6.0, d: 2.4 },
      { x: -85, z: -2, w: 3.8, d: 4.0 },
      { x: 4, z: 75, w: 3.5, d: 4.5 },
      { x: -5, z: -65, w: 4.8, d: 3.0 }
    ];

    patchLocations.forEach(p => {
      const patch = new THREE.Mesh(new THREE.PlaneGeometry(p.w, p.d), patchMat);
      patch.rotation.x = -Math.PI / 2;
      patch.position.set(p.x, 0.025, p.z);
      patch.receiveShadow = true;
      this.group.add(patch);

      // Dark joint sealant line around the patch perimeter
      const border = new THREE.Mesh(
        new THREE.PlaneGeometry(p.w + 0.15, p.d + 0.15),
        new THREE.MeshBasicMaterial({ color: 0x050505 })
      );
      border.rotation.x = -Math.PI / 2;
      border.position.set(p.x, 0.023, p.z);
      this.group.add(border);
    });
  }

  buildRealistic3DPotholes() {
    // Physically Indented 3D Potholes with Broken Jagged Edges & Muddy Water
    const potholeRimMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.95
    });

    const aggregateGravelMat = new THREE.MeshStandardMaterial({
      color: 0x44403c, // Exposed crushed aggregate gravel sub-base
      roughness: 0.9
    });

    const puddleWaterMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.05,
      metalness: 0.9,
      transparent: true,
      opacity: 0.75
    });

    // Pothole cluster locations (Industrial sector & outer ring road)
    const potholeSpots = [
      { x: -75, z: 4.5, radius: 1.4, depth: 0.12 },
      { x: -92, z: -3.5, radius: 1.8, depth: 0.15 },
      { x: 125, z: 5.0, radius: 1.2, depth: 0.10 },
      { x: -6, z: 120, radius: 1.6, depth: 0.14 }
    ];

    potholeSpots.forEach(pot => {
      const group = new THREE.Group();
      group.position.set(pot.x, 0, pot.z);

      // Jagged Rim Ring
      const rim = new THREE.Mesh(new THREE.RingGeometry(pot.radius * 0.7, pot.radius, 12), potholeRimMat);
      rim.rotation.x = -Math.PI / 2;
      rim.position.y = 0.026;
      group.add(rim);

      // Indented Gravel Bottom
      const base = new THREE.Mesh(new THREE.CircleGeometry(pot.radius * 0.7, 12), aggregateGravelMat);
      base.rotation.x = -Math.PI / 2;
      base.position.y = 0.01;
      group.add(base);

      // Murky Roadside Water Puddle inside Pothole
      const water = new THREE.Mesh(new THREE.CircleGeometry(pot.radius * 0.55, 10), puddleWaterMat);
      water.rotation.x = -Math.PI / 2;
      water.position.y = 0.015;
      group.add(water);

      this.group.add(group);
    });
  }

  buildIndianSpeedBreakers() {
    // Signature Indian Road Speed Breakers (Road Humps with Black/Yellow Chevrons)
    const humpMat = new THREE.MeshStandardMaterial({ color: 0x1f242c, roughness: 0.8 });
    const yellowStripeMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const whiteStripeMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });

    const breakerLocations = [
      { x: -40, z: 0, rotY: 0 },
      { x: 70, z: 0, rotY: 0 },
      { x: 0, z: -55, rotY: Math.PI / 2 },
      { x: 0, z: 65, rotY: Math.PI / 2 }
    ];

    breakerLocations.forEach(b => {
      const breakerGroup = new THREE.Group();
      breakerGroup.position.set(b.x, 0, b.z);
      breakerGroup.rotation.y = b.rotY;

      // Elevated Asphalt Hump (Curved cross-section, height 0.14m, span 3.2m, length 22m)
      const hump = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 22.0, 16, 1, false, 0, Math.PI), humpMat);
      hump.rotation.z = Math.PI / 2;
      hump.scale.set(0.12, 1.0, 1.0);
      hump.position.y = 0.08;
      breakerGroup.add(hump);

      // Yellow/White Warning Chevron Stripes along Hump
      for (let s = -10; s <= 10; s += 2.2) {
        const stripe = new THREE.Mesh(
          new THREE.PlaneGeometry(0.35, 1.8),
          s % 4 === 0 ? yellowStripeMat : whiteStripeMat
        );
        stripe.rotation.x = -Math.PI / 2;
        stripe.position.set(s, 0.15, 0);
        breakerGroup.add(stripe);
      }

      this.group.add(breakerGroup);
    });
  }

  buildDrainageAndManholes() {
    // Concrete Storm Water Drop Inlets & Cast-Iron Municipal Manhole Covers
    const manholeMat = new THREE.MeshStandardMaterial({ color: 0x292524, metalness: 0.85, roughness: 0.4 });
    const drainGrateMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, metalness: 0.9, roughness: 0.3 });

    // Manhole covers along road centers
    const manholePositions = [
      [20, 2], [-25, -2], [80, 2], [-70, -2], [2, 40], [-2, -35]
    ];

    manholePositions.forEach(([mx, mz]) => {
      const cover = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.04, 16), manholeMat);
      cover.position.set(mx, 0.03, mz);
      this.group.add(cover);
    });

    // Storm Drainage Grates along road curbs
    for (let x = -210; x <= 210; x += 35) {
      if (Math.abs(x) < 25) continue;
      const grateN = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.04, 0.6), drainGrateMat);
      grateN.position.set(x, 0.03, 11.5);
      this.group.add(grateN);

      const grateS = grateN.clone();
      grateS.position.z = -11.5;
      this.group.add(grateS);
    }
  }

  buildPaverBlockFootpaths() {
    // Signature Bengaluru Red & Gray Interlocking Concrete Paver Block Sidewalks
    const paverMat = new THREE.MeshStandardMaterial({
      color: 0x991b1b, // Terracotta red concrete paver block
      roughness: 0.85,
      metalness: 0.05
    });
    const stoneSlabMat = new THREE.MeshStandardMaterial({
      color: 0x78716c, // Rough granite drainage stone slab
      roughness: 0.9
    });

    // North Sidewalk (Z: 12 to 17, X: -260 to +260)
    const walkNorth = new THREE.Mesh(new THREE.BoxGeometry(520, 0.25, 4.8), paverMat);
    walkNorth.position.set(0, 0.125, 14.4);
    walkNorth.receiveShadow = true;
    this.group.add(walkNorth);

    // South Sidewalk (Z: -12 to -17, X: -260 to +260)
    const walkSouth = new THREE.Mesh(new THREE.BoxGeometry(520, 0.25, 4.8), paverMat);
    walkSouth.position.set(0, 0.125, -14.4);
    walkSouth.receiveShadow = true;
    this.group.add(walkSouth);

    // Uneven/Broken Slabs over Storm Drains
    [-55, 45, 135].forEach(sx => {
      const slab = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 1.8), stoneSlabMat);
      slab.rotation.y = 0.08;
      slab.position.set(sx, 0.28, 14.2);
      this.group.add(slab);
    });
  }

  buildRoadsideStreetFurniture() {
    // Authentic Bengaluru Street Life: Roadside Chai/Tea Stall & Parked Scooters
    const stallGroup = new THREE.Group();
    stallGroup.position.set(28, 0, 15.5);

    const tinMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.6, roughness: 0.4 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const yellowCanvasMat = new THREE.MeshStandardMaterial({ color: 0xca8a04, roughness: 0.7 });

    // Wooden Table Counter
    const table = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 1.2), woodMat);
    table.position.y = 0.45;
    stallGroup.add(table);

    // Chai Tin Kettle & Glass Tumbler Holder
    const kettle = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 0.45, 10), tinMat);
    kettle.position.set(-0.6, 1.1, 0);
    stallGroup.add(kettle);

    // Overhead Yellow Tarpaulin Canopy
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.1, 2.2), yellowCanvasMat);
    canopy.position.set(0, 2.3, 0);
    canopy.rotation.x = 0.1;
    stallGroup.add(canopy);

    this.group.add(stallGroup);

    // 2 Parked Scooters along the Curb
    [-18, 52].forEach(scootX => {
      const scooter = this.createParkedScooter();
      scooter.position.set(scootX, 0.25, 12.8);
      this.group.add(scooter);
    });
  }

  createParkedScooter() {
    const scoot = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 }); // Sky blue scooter
    const seatMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });

    // Main Chassis
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 0.5), bodyMat);
    body.position.y = 0.45;
    scoot.add(body);

    // Front Apron & Handlebar
    const apron = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.7, 0.5), bodyMat);
    apron.position.set(0.65, 0.7, 0);
    scoot.add(apron);

    // Dual Seat
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.15, 0.35), seatMat);
    seat.position.set(-0.15, 0.75, 0);
    scoot.add(seat);

    // Wheels
    [-0.55, 0.65].forEach(wx => {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.12, 10), tireMat);
      w.rotation.x = Math.PI / 2;
      w.position.set(wx, 0.24, 0);
      scoot.add(w);
    });

    // Side-stand lean
    scoot.rotation.z = 0.08;
    return scoot;
  }

  buildReferenceRoadsideFeatures() {
    // 1. Center Concrete Median with Diagonal Yellow/Black Chevron Hazard Stripes & Lush Planters
    const medianLength = 160;
    const medianMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.75
    });

    // Concrete curb base
    const curb = new THREE.Mesh(new THREE.BoxGeometry(medianLength, 0.45, 1.8), medianMat);
    curb.position.set(0, 0.22, 0);
    curb.receiveShadow = true;
    this.group.add(curb);

    // Diagonal Yellow & Black Chevron Painted Stripes along Median Faces
    const chevronCanvas = document.createElement('canvas');
    chevronCanvas.width = 512;
    chevronCanvas.height = 64;
    const chCtx = chevronCanvas.getContext('2d');
    chCtx.fillStyle = '#0f172a'; // Black stripe
    chCtx.fillRect(0, 0, 512, 64);
    chCtx.fillStyle = '#eab308'; // Amber yellow stripe
    for (let x = -64; x < 512 + 64; x += 64) {
      chCtx.beginPath();
      chCtx.moveTo(x, 0);
      chCtx.lineTo(x + 32, 0);
      chCtx.lineTo(x + 64, 64);
      chCtx.lineTo(x + 32, 64);
      chCtx.closePath();
      chCtx.fill();
    }
    const chevronTex = new THREE.CanvasTexture(chevronCanvas);
    chevronTex.wrapS = THREE.RepeatWrapping;
    chevronTex.repeat.set(12, 1);
    const chevronMat = new THREE.MeshBasicMaterial({ map: chevronTex });

    [-0.92, 0.92].forEach(cz => {
      const stripeMesh = new THREE.Mesh(new THREE.PlaneGeometry(medianLength, 0.42), chevronMat);
      stripeMesh.rotation.y = cz > 0 ? 0 : Math.PI;
      stripeMesh.position.set(0, 0.22, cz);
      this.group.add(stripeMesh);
    });

    // Lush Green Shrubbery / Planters along the Median Top
    const shrubMat = new THREE.MeshStandardMaterial({
      color: 0x166534, // Vibrant evergreen shrub
      roughness: 0.78,
      metalness: 0.05
    });
    for (let mx = -medianLength / 2 + 6; mx <= medianLength / 2 - 6; mx += 14) {
      const shrub = new THREE.Mesh(new THREE.DodecahedronGeometry(0.85, 1), shrubMat);
      shrub.scale.set(1.6, 0.9, 0.9);
      shrub.position.set(mx, 0.8, 0);
      shrub.castShadow = true;
      this.group.add(shrub);
    }

    // 2. Modern Roadside Bus Shelter with Glass Canopy and Digital Ad Display
    const shelterGroup = new THREE.Group();
    shelterGroup.position.set(-6, 0, 14.2);

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45, roughness: 0.1 });

    // Shelter Roof & Columns
    const shelterRoof = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.15, 2.6), frameMat);
    shelterRoof.position.set(0, 3.2, 0);
    shelterGroup.add(shelterRoof);

    [-2.8, 2.8].forEach(cx => {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.15, 3.2, 0.15), frameMat);
      post.position.set(cx, 1.6, 1.1);
      shelterGroup.add(post);
    });

    // Glass Back Wall
    const glassBack = new THREE.Mesh(new THREE.BoxGeometry(5.8, 2.6, 0.08), glassMat);
    glassBack.position.set(0, 1.6, 1.1);
    shelterGroup.add(glassBack);

    // Bench
    const bench = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.1, 0.45), frameMat);
    bench.position.set(0, 0.6, 0.8);
    shelterGroup.add(bench);

    // Digital Advertising Board ("Better Bengaluru")
    const adCanvas = document.createElement('canvas');
    adCanvas.width = 256;
    adCanvas.height = 512;
    const adCtx = adCanvas.getContext('2d');
    adCtx.fillStyle = '#0f172a';
    adCtx.fillRect(0, 0, 256, 512);

    // Ad gradient
    const grad = adCtx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#0284c7');
    grad.addColorStop(1, '#0f172a');
    adCtx.fillStyle = grad;
    adCtx.fillRect(8, 8, 240, 496);

    adCtx.fillStyle = '#ffffff';
    adCtx.font = 'bold 32px sans-serif';
    adCtx.textAlign = 'center';
    adCtx.fillText('Better', 128, 160);
    adCtx.fillStyle = '#38bdf8';
    adCtx.fillText('Bengaluru', 128, 205);
    adCtx.font = '16px sans-serif';
    adCtx.fillStyle = '#cbd5e1';
    adCtx.fillText('Clean • Green • Smart', 128, 260);

    const adTex = new THREE.CanvasTexture(adCanvas);
    const adMat = new THREE.MeshBasicMaterial({ map: adTex });
    const adKiosk = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.4, 0.2), adMat);
    adKiosk.position.set(3.2, 1.5, 0);
    shelterGroup.add(adKiosk);

    this.group.add(shelterGroup);

    // 3. Parked Black Luxury SUV on the Right Foreground (Reference Target)
    const suvGroup = new THREE.Group();
    suvGroup.position.set(3.8, 0, 3.2);
    suvGroup.rotation.y = -0.15;

    const glossBlackMat = new THREE.MeshStandardMaterial({
      color: 0x0a0c10, // Deep obsidian black clearcoat
      roughness: 0.12,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });

    const suvGlassMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.05,
      metalness: 0.95,
      transparent: true,
      opacity: 0.75
    });

    const alloyRimMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.2,
      metalness: 0.95
    });

    const suvTireMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.85
    });

    // SUV Body
    const suvLower = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.75, 4.8), glossBlackMat);
    suvLower.position.y = 0.75;
    suvLower.castShadow = true;
    suvGroup.add(suvLower);

    // SUV Cabin & Roof
    const suvCabin = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.72, 2.8), glossBlackMat);
    suvCabin.position.set(0, 1.45, -0.2);
    suvCabin.castShadow = true;
    suvGroup.add(suvCabin);

    // Front Windshield & Windows
    const suvWindshield = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.65, 0.08), suvGlassMat);
    suvWindshield.rotation.x = 0.45;
    suvWindshield.position.set(0, 1.35, 1.2);
    suvGroup.add(suvWindshield);

    // Detailed Multi-Spoke Alloy Wheels & Brake Calipers
    const tireGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.28, 16);
    tireGeo.rotateZ(Math.PI / 2);
    const rimGeo = new THREE.CylinderGeometry(0.30, 0.30, 0.30, 12);
    rimGeo.rotateZ(Math.PI / 2);

    [-1.0, 1.0].forEach(wx => {
      [-1.45, 1.45].forEach(wz => {
        const tire = new THREE.Mesh(tireGeo, suvTireMat);
        const rim = new THREE.Mesh(rimGeo, alloyRimMat);
        tire.add(rim);
        tire.position.set(wx, 0.44, wz);
        tire.castShadow = true;
        suvGroup.add(tire);
      });
    });

    this.group.add(suvGroup);

    // 4. Large Reflective Water Puddles along the Boulevard Road Surface
    const puddleWaterMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.06,
      metalness: 0.45,
      transparent: true,
      opacity: 0.88,
      depthWrite: false
    });

    const puddlePositions = [
      { x: -1.2, z: 2.5, sx: 4.8, sz: 3.2, rot: 0.2 },
      { x: 2.8, z: 1.2, sx: 5.5, sz: 3.8, rot: -0.15 },
      { x: -8.5, z: 6.5, sx: 6.2, sz: 4.5, rot: 0.4 }
    ];

    puddlePositions.forEach(p => {
      const puddle = new THREE.Mesh(new THREE.CircleGeometry(1.0, 16), puddleWaterMat);
      puddle.rotation.x = -Math.PI / 2;
      puddle.position.set(p.x, 0.035, p.z);
      puddle.scale.set(p.sx, p.sz, 1);
      puddle.rotation.z = p.rot;
      this.group.add(puddle);
    });
  }
}
