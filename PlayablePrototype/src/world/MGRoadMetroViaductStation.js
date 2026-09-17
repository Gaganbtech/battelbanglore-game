// Elevated MG Road Namma Metro Viaduct & Station (Reference Target Model)
// BENGALURU: LAST CITY - Master Production Overhaul
// Curved steel & glass canopy station spanning the boulevard, concrete viaduct piers,
// authentic bilingual signboard: "ಮಹಾತ್ಮಾ ಗಾಂಧಿ ರಸ್ತೆ / Mahatma Gandhi Road" with purple 'M' logo,
// and automated purple Namma Metro train crossing the track.
import * as THREE from 'three';

export class MGRoadMetroViaductStation {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'MGRoadMetroViaductStation';

    this.trainPositionX = -120;
    this.trainSpeed = 22; // m/s (~80 km/h)

    this.buildViaductPiersAndDeck();
    this.buildCurvedStationCanopy();
    this.buildBilingualSignage();
    this.buildNammaMetroTrain();

    this.scene.add(this.group);
  }

  buildViaductPiersAndDeck() {
    // PBR Concrete and Steel materials
    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8, // Light Bengaluru concrete viaduct
      roughness: 0.82,
      metalness: 0.05
    });

    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.35,
      metalness: 0.85
    });

    // 1. Heavy Reinforced Concrete Piers spanning Boulevard (z = -25)
    // Piers placed safely outside traffic lanes
    const pierPositions = [-75, -25, 25, 75];
    pierPositions.forEach(px => {
      // Pier Column
      const pier = new THREE.Mesh(new THREE.BoxGeometry(3.5, 12, 3.5), concreteMat);
      pier.position.set(px, 6, -25);
      pier.castShadow = true;
      pier.receiveShadow = true;
      this.group.add(pier);

      // Pier Capital / T-Hammerhead Beam
      const hammerhead = new THREE.Mesh(new THREE.BoxGeometry(6.5, 2.2, 14), concreteMat);
      hammerhead.position.set(px, 12 + 1.1, -25);
      hammerhead.castShadow = true;
      this.group.add(hammerhead);
    });

    // 2. Elevated Track Viaduct Girders (Spanning from -250 to +250 across world)
    const deckMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.75 });
    const deck = new THREE.Mesh(new THREE.BoxGeometry(500, 1.8, 12.5), deckMat);
    deck.position.set(0, 13.5, -25);
    deck.castShadow = true;
    deck.receiveShadow = true;
    this.group.add(deck);

    // Ballast and Twin Rails
    const railMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9, roughness: 0.2 });
    [-2.8, -1.4, 1.4, 2.8].forEach(rz => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(500, 0.25, 0.15), railMat);
      rail.position.set(0, 14.5, -25 + rz);
      this.group.add(rail);
    });

    // Overhead Catenary Electrification Masts
    for (let cx = -220; cx <= 220; cx += 40) {
      const mast = new THREE.Mesh(new THREE.BoxGeometry(0.3, 6.5, 0.3), steelMat);
      mast.position.set(cx, 17.5, -25 + 5.8);
      this.group.add(mast);

      const crossArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 11.6), steelMat);
      crossArm.position.set(cx, 20.2, -25);
      this.group.add(crossArm);
    }
  }

  buildCurvedStationCanopy() {
    // Modern aerodynamic curved roof canopy directly above the boulevard
    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Dark titanium steel frame
      roughness: 0.3,
      metalness: 0.9
    });

    const glassRoofMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.08,
      metalness: 0.9,
      transparent: true,
      opacity: 0.5,
      clearcoat: 1.0
    });

    // Curved Station Roof Shell (Spanning x: -45 to +45)
    const stationLength = 90;
    const stationWidth = 24;

    // Platform Level Concourse Floor
    const platformFloor = new THREE.Mesh(
      new THREE.BoxGeometry(stationLength, 0.8, stationWidth),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 })
    );
    platformFloor.position.set(0, 14.2, -25);
    platformFloor.receiveShadow = true;
    this.group.add(platformFloor);

    // Glass Windscreen & Balustrade Walls
    const glassWallMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.45
    });

    [-stationWidth / 2 + 0.2, stationWidth / 2 - 0.2].forEach(wz => {
      const glassWall = new THREE.Mesh(new THREE.BoxGeometry(stationLength, 3.8, 0.2), glassWallMat);
      glassWall.position.set(0, 16.2, -25 + wz);
      this.group.add(glassWall);
    });

    // Curved Canopy Arch Ribs
    for (let rx = -stationLength / 2; rx <= stationLength / 2; rx += 10) {
      const archGeo = new THREE.TorusGeometry(13.5, 0.25, 8, 24, Math.PI);
      const arch = new THREE.Mesh(archGeo, canopyMat);
      arch.rotation.z = 0;
      arch.position.set(rx, 14.5, -25);
      this.group.add(arch);
    }

    // Glass Canopy Roof Cover
    const roofGeo = new THREE.CylinderGeometry(13.6, 13.6, stationLength, 24, 1, true, 0, Math.PI);
    roofGeo.rotateZ(Math.PI / 2);
    roofGeo.rotateX(Math.PI / 2);
    const roof = new THREE.Mesh(roofGeo, glassRoofMat);
    roof.position.set(0, 14.5, -25);
    this.group.add(roof);
  }

  buildBilingualSignage() {
    // High-Resolution Bilingual Kannada & English Signage Board
    // Reference: "ಮಹಾತ್ಮಾ ಗಾಂಧಿ ರಸ್ತೆ / Mahatma Gandhi Road" with purple 'M' logo
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Deep Metro Blue/Indigo Banner Background
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(0, 0, 1024, 256);

    // Border trim
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 8;
    ctx.strokeRect(6, 6, 1012, 244);

    // Purple Metro Roundel Logo on Right
    ctx.fillStyle = '#9333ea';
    ctx.beginPath();
    ctx.arc(880, 128, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('M', 880, 125);
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('Metro', 880, 175);

    // Bilingual Station Text
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    // Kannada Script: ಮಹಾತ್ಮಾ ಗಾಂಧಿ ರಸ್ತೆ
    ctx.font = 'bold 64px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('ಮಹಾತ್ಮಾ ಗಾಂಧಿ ರಸ್ತೆ', 60, 95);

    // English Script: Mahatma Gandhi Road
    ctx.font = 'bold 52px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('Mahatma Gandhi Road', 60, 185);

    const texture = new THREE.CanvasTexture(canvas);
    const signMat = new THREE.MeshBasicMaterial({ map: texture });

    // Front Signboard mounted on South Viaduct Girder (facing player)
    const signMesh = new THREE.Mesh(new THREE.BoxGeometry(28, 4.2, 0.4), signMat);
    signMesh.position.set(18, 12.5, -17.5);
    this.group.add(signMesh);

    // Back Signboard mounted on North Viaduct Girder
    const signMeshBack = signMesh.clone();
    signMeshBack.rotation.y = Math.PI;
    signMeshBack.position.set(18, 12.5, -32.5);
    this.group.add(signMeshBack);
  }

  buildNammaMetroTrain() {
    // Automated 6-Coach Purple Line Namma Metro Train
    this.trainGroup = new THREE.Group();
    this.trainGroup.name = 'NammaMetroTrainAutomated';

    const stainlessSteelMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.18
    });

    const purpleStripeMat = new THREE.MeshStandardMaterial({
      color: 0x9333ea, // Namma Metro Purple Line Signature
      roughness: 0.35,
      metalness: 0.4
    });

    const windowGlowMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.75,
      roughness: 0.1
    });

    // 4 Metro Coaches
    const coachLength = 22;
    for (let c = 0; c < 4; c++) {
      const coach = new THREE.Group();
      coach.position.x = c * (coachLength + 0.8);

      // Body
      const body = new THREE.Mesh(new THREE.BoxGeometry(coachLength, 3.4, 3.2), stainlessSteelMat);
      body.position.y = 1.7;
      body.castShadow = true;
      coach.add(body);

      // Signature Purple Ribbon Band
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(coachLength + 0.05, 0.45, 3.25), purpleStripeMat);
      stripe.position.y = 1.65;
      coach.add(stripe);

      // Lit Windows
      [-1.65, 1.65].forEach(wz => {
        for (let w = -coachLength / 2 + 2.5; w <= coachLength / 2 - 2.5; w += 3.8) {
          const win = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.1, 0.08), windowGlowMat);
          win.position.set(w, 2.1, wz);
          coach.add(win);
        }
      });

      this.trainGroup.add(coach);
    }

    this.trainGroup.position.set(this.trainPositionX, 14.5, -25 - 2.1);
    this.group.add(this.trainGroup);
  }

  update(delta) {
    // Move Metro Train continuously along elevated viaduct
    this.trainPositionX += this.trainSpeed * delta;
    if (this.trainPositionX > 220) {
      this.trainPositionX = -260; // Loop back
    }
    if (this.trainGroup) {
      this.trainGroup.position.x = this.trainPositionX;
    }
  }
}
