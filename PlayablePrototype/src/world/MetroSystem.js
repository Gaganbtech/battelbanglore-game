// Realistic Namma Metro Elevated Viaduct & Multi-Tier MG Road Central Station
// BENGALURU: LAST CITY - Phase 2 Overhaul
import * as THREE from 'three';

export class MetroSystem {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();

    this.trackElevation = 14.0;
    this.corridorZ = -20; // Elevated rail corridor runs East-West along z = -20

    this.buildElevatedViaduct();
    this.buildMGRoadCentralStation();

    this.scene.add(this.group);
  }

  buildElevatedViaduct() {
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x545d68, roughness: 0.8, metalness: 0.1 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x78909c, metalness: 0.85, roughness: 0.25 });
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x37474f, metalness: 0.8, roughness: 0.3 });

    const trackLength = 560;

    // 1. Viaduct U-Beam Concrete Deck (Structural Guideway)
    const deckGeo = new THREE.BoxGeometry(trackLength, 1.8, 10.2);
    const deck = new THREE.Mesh(deckGeo, concreteMat);
    deck.position.set(0, this.trackElevation - 0.9, this.corridorZ);
    deck.castShadow = true;
    deck.receiveShadow = true;
    this.group.add(deck);

    // Parapet sound barrier walls along viaduct edges
    const parapetN = new THREE.Mesh(new THREE.BoxGeometry(trackLength, 1.2, 0.4), concreteMat);
    parapetN.position.set(0, this.trackElevation + 0.6, this.corridorZ + 5.0);
    this.group.add(parapetN);

    const parapetS = new THREE.Mesh(new THREE.BoxGeometry(trackLength, 1.2, 0.4), concreteMat);
    parapetS.position.set(0, this.trackElevation + 0.6, this.corridorZ - 5.0);
    this.group.add(parapetS);

    // 2. Dual Steel Rails (Standard Gauge 1435mm)
    const railGeo = new THREE.BoxGeometry(trackLength, 0.2, 0.12);
    [-3.2, -1.8, 1.8, 3.2].forEach(offsetZ => {
      const rail = new THREE.Mesh(railGeo, steelMat);
      rail.position.set(0, this.trackElevation + 0.1, this.corridorZ + offsetZ);
      this.group.add(rail);
    });

    // 3. Cylindrical Fluted Concrete Piers with Hammerhead Cradles (every 32 meters)
    for (let x = -260; x <= 260; x += 32) {
      if (Math.abs(x) < 38) continue; // Station footprint at center

      // Fluted Pier Column
      const pier = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.9, this.trackElevation, 16), concreteMat);
      pier.position.set(x, this.trackElevation / 2, this.corridorZ);
      pier.castShadow = true;
      this.group.add(pier);

      // Cantilevered Hammerhead Crosshead Beam
      const crosshead = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.2, 9.8), concreteMat);
      crosshead.position.set(x, this.trackElevation - 1.2, this.corridorZ);
      crosshead.castShadow = true;
      this.group.add(crosshead);

      // Overhead Catenary Power Mast & Pantograph Contact Wire
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 6.0, 8), mastMat);
      mast.position.set(x, this.trackElevation + 3.0, this.corridorZ);
      this.group.add(mast);

      const crossArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 8.5), mastMat);
      crossArm.position.set(x, this.trackElevation + 5.5, this.corridorZ);
      this.group.add(crossArm);
    }
  }

  buildMGRoadCentralStation() {
    // Fictional Namma Metro Station: "MG ROAD CENTRAL" (Multi-Tier Transit Hub)
    const stationGroup = new THREE.Group();
    stationGroup.position.set(0, 0, this.corridorZ);

    const stationMat = new THREE.MeshStandardMaterial({ color: 0x455a64, roughness: 0.75 });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x81d4fa,
      transparent: true,
      opacity: 0.6,
      roughness: 0.1,
      metalness: 0.9
    });
    const purpleMat = new THREE.MeshStandardMaterial({ color: 0x6a1b9a, roughness: 0.4 }); // Purple Line branding
    const yellowSafetyMat = new THREE.MeshBasicMaterial({ color: 0xffd600 });
    const steelTrussMat = new THREE.MeshStandardMaterial({ color: 0xd9e2ec, metalness: 0.8, roughness: 0.3 });

    const stationLength = 76;
    const stationWidth = 24;

    // 1. Concourse / Ticketing Level Deck (Height 7.0m)
    const concourseDeck = new THREE.Mesh(new THREE.BoxGeometry(stationLength, 1.4, stationWidth), stationMat);
    concourseDeck.position.y = 7.0;
    concourseDeck.castShadow = true;
    stationGroup.add(concourseDeck);

    // Concourse Turnstile Smart Card Fare Gates
    const gateMat = new THREE.MeshStandardMaterial({ color: 0xb0bec5, metalness: 0.8 });
    for (let gx = -12; gx <= 12; gx += 3) {
      const gate = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.1, 2.0), gateMat);
      gate.position.set(gx, 7.7, 3.0);
      stationGroup.add(gate);
    }

    // Ticket Vending Counters & Passenger Information Displays
    const kioskMat = new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.3 });
    const tvm1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 1.2), kioskMat);
    tvm1.position.set(-20, 8.2, 8.5);
    stationGroup.add(tvm1);

    const tvm2 = tvm1.clone();
    tvm2.position.x = -16;
    stationGroup.add(tvm2);

    // 2. Platform Level Deck (Height 14.0m)
    const platformDeck = new THREE.Mesh(new THREE.BoxGeometry(stationLength, 1.4, stationWidth), stationMat);
    platformDeck.position.y = 13.3;
    platformDeck.castShadow = true;
    platformDeck.receiveShadow = true;
    stationGroup.add(platformDeck);

    // Platform Yellow Tactile Edge Warning Strips
    const safetyStripN = new THREE.Mesh(new THREE.BoxGeometry(stationLength, 0.05, 0.6), yellowSafetyMat);
    safetyStripN.position.set(0, 14.03, 4.2);
    stationGroup.add(safetyStripN);

    const safetyStripS = new THREE.Mesh(new THREE.BoxGeometry(stationLength, 0.05, 0.6), yellowSafetyMat);
    safetyStripS.position.set(0, 14.03, -4.2);
    stationGroup.add(safetyStripS);

    // Platform Screen Railings (Glass & Stainless Steel)
    const railingFrameN = new THREE.Mesh(new THREE.BoxGeometry(stationLength - 6, 1.2, 0.1), glassMat);
    railingFrameN.position.set(0, 14.6, 4.6);
    stationGroup.add(railingFrameN);

    const railingFrameS = railingFrameN.clone();
    railingFrameS.position.z = -4.6;
    stationGroup.add(railingFrameS);

    // 3. Curved Aerodynamic Station Canopy Roof (Height 20.5m)
    const canopyGeo = new THREE.CylinderGeometry(stationWidth * 0.68, stationWidth * 0.68, stationLength, 20, 1, false, 0, Math.PI);
    const canopy = new THREE.Mesh(canopyGeo, steelTrussMat);
    canopy.rotation.z = Math.PI / 2;
    canopy.rotation.y = Math.PI / 2;
    canopy.position.set(0, 19.5, 0);
    canopy.castShadow = true;
    stationGroup.add(canopy);

    // 4. Heavy Station Structural Portal Columns
    [-30, -10, 10, 30].forEach(px => {
      const colL = new THREE.Mesh(new THREE.BoxGeometry(2.2, 14.0, 2.2), stationMat);
      colL.position.set(px, 7.0, 10.5);
      colL.castShadow = true;
      stationGroup.add(colL);

      const colR = colL.clone();
      colR.position.z = -10.5;
      stationGroup.add(colR);
    });

    // 5. Grand Passenger Staircase & Escalator Ramps from Ground to Platform
    const stairMat = new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.8 });
    const stairs = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.8, 34), stairMat);
    stairs.rotation.x = -Math.PI / 7.2;
    stairs.position.set(-32, 6.8, 16.5);
    stairs.castShadow = true;
    stationGroup.add(stairs);

    // 6. Illuminated Bilingual Station Signboards ("ಎಂ. ಜಿ. ರಸ್ತೆ • MG ROAD CENTRAL")
    const signGeo = new THREE.BoxGeometry(18, 2.4, 0.4);
    const signBoardN = new THREE.Mesh(signGeo, purpleMat);
    signBoardN.position.set(0, 17.5, 11.2);
    stationGroup.add(signBoardN);

    const signBoardS = signBoardN.clone();
    signBoardS.position.z = -11.2;
    stationGroup.add(signBoardS);

    this.group.add(stationGroup);
  }
}
