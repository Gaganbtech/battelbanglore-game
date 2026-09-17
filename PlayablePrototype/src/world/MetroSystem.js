// Modular elevated Metro system: viaduct, concrete pillars, central station, and train cars
import * as THREE from 'three';

export class MetroSystem {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    
    this.trackElevation = 14.0;
    this.corridorZ = -20; // Runs East-West along z = -20
    
    this.buildElevatedTracks();
    this.buildMetroStation();
    this.buildMetroTrain();

    this.scene.add(this.group);
  }

  buildElevatedTracks() {
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x5a626c, roughness: 0.75 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x828b96, metalness: 0.8, roughness: 0.3 });
    const catenaryMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.2 });

    const trackLength = 540;

    // Viaduct U-beam concrete deck
    const deckGeo = new THREE.BoxGeometry(trackLength, 1.6, 9.5);
    const deck = new THREE.Mesh(deckGeo, concreteMat);
    deck.position.set(0, this.trackElevation - 0.8, this.corridorZ);
    deck.castShadow = true;
    deck.receiveShadow = true;
    this.group.add(deck);

    // Continuous rails (North track and South track)
    const railGeo = new THREE.BoxGeometry(trackLength, 0.25, 0.15);
    const railPositionsZ = [-2.2, -1.0, 1.0, 2.2];
    railPositionsZ.forEach(offsetZ => {
      const rail = new THREE.Mesh(railGeo, steelMat);
      rail.position.set(0, this.trackElevation + 0.15, this.corridorZ + offsetZ);
      this.group.add(rail);
    });

    // Elevated concrete piers placed every 30 meters
    for (let x = -260; x <= 260; x += 30) {
      if (Math.abs(x) < 35) continue; // Station footprint at center

      // Pier column
      const pierGeo = new THREE.CylinderGeometry(1.5, 1.7, this.trackElevation, 12);
      const pier = new THREE.Mesh(pierGeo, concreteMat);
      pier.position.set(x, this.trackElevation / 2, this.corridorZ);
      pier.castShadow = true;
      this.group.add(pier);

      // Pier crosshead hammerhead cradle
      const crossGeo = new THREE.BoxGeometry(2.5, 1.8, 9.2);
      const crosshead = new THREE.Mesh(crossGeo, concreteMat);
      crosshead.position.set(x, this.trackElevation - 1.2, this.corridorZ);
      crosshead.castShadow = true;
      this.group.add(crosshead);

      // Catenary mast for overhead electric power
      const mastGeo = new THREE.CylinderGeometry(0.1, 0.12, 5.5, 8);
      const mast = new THREE.Mesh(mastGeo, catenaryMat);
      mast.position.set(x, this.trackElevation + 2.75, this.corridorZ);
      this.group.add(mast);
    }
  }

  buildMetroStation() {
    // Fictional Namma Metro Station: "MG ROAD CENTRAL"
    const stationGroup = new THREE.Group();
    stationGroup.position.set(0, 0, this.corridorZ);

    const stationMat = new THREE.MeshStandardMaterial({ color: 0x47515c, roughness: 0.7 });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x64b5f6,
      transparent: true,
      opacity: 0.55,
      roughness: 0.1,
      metalness: 0.9
    });
    const purpleTrimMat = new THREE.MeshStandardMaterial({ color: 0x7b1fa2, roughness: 0.4 }); // Bengaluru Purple Line branding
    const yellowSafetyMat = new THREE.MeshBasicMaterial({ color: 0xffd600 });

    const stationLength = 70;
    const stationWidth = 22;

    // Concourse / Ticketing level (Height 7m)
    const concourseDeck = new THREE.Mesh(new THREE.BoxGeometry(stationLength, 1.2, stationWidth), stationMat);
    concourseDeck.position.y = 7.0;
    concourseDeck.castShadow = true;
    stationGroup.add(concourseDeck);

    // Platform level (Height 14m)
    const platformDeck = new THREE.Mesh(new THREE.BoxGeometry(stationLength, 1.4, stationWidth), stationMat);
    platformDeck.position.y = 13.3;
    platformDeck.castShadow = true;
    platformDeck.receiveShadow = true;
    stationGroup.add(platformDeck);

    // Platform tactile yellow safety edge
    const safetyStripN = new THREE.Mesh(new THREE.BoxGeometry(stationLength, 0.05, 0.5), yellowSafetyMat);
    safetyStripN.position.set(0, 14.03, 3.8);
    stationGroup.add(safetyStripN);

    const safetyStripS = new THREE.Mesh(new THREE.BoxGeometry(stationLength, 0.05, 0.5), yellowSafetyMat);
    safetyStripS.position.set(0, 14.03, -3.8);
    stationGroup.add(safetyStripS);

    // Station Canopy Curved Roof (Height 20m)
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0xd9e2ec, metalness: 0.6, roughness: 0.3 });
    const canopyGeo = new THREE.CylinderGeometry(stationWidth * 0.65, stationWidth * 0.65, stationLength, 16, 1, false, 0, Math.PI);
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.rotation.z = Math.PI / 2;
    canopy.rotation.y = Math.PI / 2;
    canopy.position.set(0, 18.5, 0);
    canopy.castShadow = true;
    stationGroup.add(canopy);

    // Station Pillars
    const mainPillars = [-25, 0, 25];
    mainPillars.forEach(px => {
      const pLeft = new THREE.Mesh(new THREE.BoxGeometry(2.4, 14.0, 2.4), stationMat);
      pLeft.position.set(px, 7.0, 8.5);
      pLeft.castShadow = true;
      stationGroup.add(pLeft);

      const pRight = new THREE.Mesh(new THREE.BoxGeometry(2.4, 14.0, 2.4), stationMat);
      pRight.position.set(px, 7.0, -8.5);
      pRight.castShadow = true;
      stationGroup.add(pRight);
    });

    // Glass Facade Windows
    const glassWallN = new THREE.Mesh(new THREE.BoxGeometry(stationLength - 4, 5.0, 0.3), glassMat);
    glassWallN.position.set(0, 10.0, 10.5);
    stationGroup.add(glassWallN);

    const glassWallS = new THREE.Mesh(new THREE.BoxGeometry(stationLength - 4, 5.0, 0.3), glassMat);
    glassWallS.position.set(0, 10.0, -10.5);
    stationGroup.add(glassWallS);

    // Ground-to-Platform Pedestrian Entrance Staircase
    const stairMat = new THREE.MeshStandardMaterial({ color: 0x3e454f, roughness: 0.8 });
    const stairsRamp = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.8, 32), stairMat);
    stairsRamp.rotation.x = -Math.PI / 7.5;
    stairsRamp.position.set(-30, 6.8, 14.5);
    stairsRamp.castShadow = true;
    stationGroup.add(stairsRamp);

    // Station Signboards (Purple Line Namma Metro Inspired)
    const signBox = new THREE.Mesh(new THREE.BoxGeometry(16, 2.2, 0.4), purpleTrimMat);
    signBox.position.set(0, 17.0, 10.8);
    stationGroup.add(signBox);

    // Ticketing automated gate turnstiles at concourse level
    const gateMat = new THREE.MeshStandardMaterial({ color: 0x90a4ae, metalness: 0.8 });
    for (let gx = -10; gx <= 10; gx += 3) {
      const gate = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.1, 1.8), gateMat);
      gate.position.set(gx, 7.6, 2.0);
      stationGroup.add(gate);
    }

    this.group.add(stationGroup);
  }

  buildMetroTrain() {
    // 3-Coach Modern Metro Train parked on the North track at the platform
    const trainGroup = new THREE.Group();
    trainGroup.position.set(-8, this.trackElevation + 1.6, this.corridorZ + 2.0);

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xe0e6ed, metalness: 0.7, roughness: 0.25 });
    const purpleStripeMat = new THREE.MeshStandardMaterial({ color: 0x8e24aa, roughness: 0.4 });
    const windowMat = new THREE.MeshStandardMaterial({ color: 0x11161d, roughness: 0.1 });

    const coachLength = 18;
    const coachWidth = 3.2;
    const coachHeight = 3.4;

    for (let i = 0; i < 3; i++) {
      const coach = new THREE.Group();
      coach.position.x = (i - 1) * (coachLength + 0.6);

      // Main coach body
      const body = new THREE.Mesh(new THREE.BoxGeometry(coachLength, coachHeight, coachWidth), bodyMat);
      body.position.y = coachHeight / 2;
      body.castShadow = true;
      coach.add(body);

      // Signature Purple Line accent stripe
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(coachLength + 0.05, 0.45, coachWidth + 0.05), purpleStripeMat);
      stripe.position.y = 1.2;
      coach.add(stripe);

      // Panoramic passenger windows
      for (let w = -coachLength / 2 + 2.5; w < coachLength / 2 - 1.5; w += 3.2) {
        const winL = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.1, 0.1), windowMat);
        winL.position.set(w, 2.0, coachWidth / 2 + 0.03);
        coach.add(winL);

        const winR = winL.clone();
        winR.position.z = -coachWidth / 2 - 0.03;
        coach.add(winR);
      }

      trainGroup.add(coach);
    }

    this.group.add(trainGroup);
  }
}
