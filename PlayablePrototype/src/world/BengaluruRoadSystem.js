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
}
