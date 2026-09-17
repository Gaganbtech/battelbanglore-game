// Advanced Living Namma Metro System (Phase 4)
// Multi-station viaduct network, realistic 3-coach walk-in interior, dynamic sliding doors,
// Kannada/English announcements, and synchronized player carriage physics.
import * as THREE from 'three';

export class AdvancedMetroSystem {
  constructor(scene, audioManager) {
    this.scene = scene;
    this.audioManager = audioManager;
    this.group = new THREE.Group();

    this.trackElevation = 14.0;
    this.corridorZ = -20; // Elevated rail corridor runs along Z = -20

    // Metro Stations along Purple Corridor
    this.stations = [
      {
        id: 'west_gate',
        name: 'ವೆಸ್ಟ್ ಗೇಟ್ ಟರ್ಮಿನಲ್ • WEST GATE TERMINAL',
        shortName: 'West Gate',
        x: -220,
        z: this.corridorZ,
        district: 'Kengeri Western District'
      },
      {
        id: 'mg_road',
        name: 'ಎಂ.ಜಿ. ರಸ್ತೆ ಸೆಂಟ್ರಲ್ • MG ROAD CENTRAL INTERCHANGE',
        shortName: 'MG Road Central',
        x: 0,
        z: this.corridorZ,
        district: 'Central Commercial'
      },
      {
        id: 'east_tech',
        name: 'ಸಿಲಿಕಾನ್ ವ್ಯಾಲಿ ಪಾರ್ಕ್ • SILICON VALLEY / EAST TECH TERMINAL',
        shortName: 'Silicon Valley Park',
        x: 220,
        z: this.corridorZ,
        district: 'Tech Corridor'
      }
    ];

    // Train state
    this.trainPosition = new THREE.Vector3(-220, 14.2, this.corridorZ);
    this.trainSpeed = 0;
    this.targetSpeed = 22.0;
    this.currentStationIndex = 0;
    this.direction = 1; // 1 = Eastbound, -1 = Westbound
    this.trainState = 'docked'; // 'docked', 'departing', 'cruising', 'stopping'
    this.dockTimer = 6.0; // Initial dwell time at start
    this.doorsOpen = true;
    this.doorSlideOffset = 0.9; // 0 = closed, 0.9 = open

    // Interactive Loot Cache Points inside stations
    this.stationLootCaches = [];

    // Build Stations & Infrastructure
    this.buildViaductGuideway();
    this.stations.forEach(station => this.buildStation(station));
    this.trainMesh = this.buildAdvancedTrainMesh();
    this.trainMesh.position.copy(this.trainPosition);
    this.group.add(this.trainMesh);

    this.scene.add(this.group);
  }

  buildViaductGuideway() {
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x545d68, roughness: 0.8, metalness: 0.1 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x78909c, metalness: 0.85, roughness: 0.25 });
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x37474f, metalness: 0.8, roughness: 0.3 });

    const trackLength = 580;

    // Guideway U-Beam Deck
    const deckGeo = new THREE.BoxGeometry(trackLength, 1.6, 9.8);
    const deck = new THREE.Mesh(deckGeo, concreteMat);
    deck.position.set(0, this.trackElevation - 0.8, this.corridorZ);
    deck.receiveShadow = true;
    this.group.add(deck);

    // Parapets
    const parapetN = new THREE.Mesh(new THREE.BoxGeometry(trackLength, 1.2, 0.35), concreteMat);
    parapetN.position.set(0, this.trackElevation + 0.6, this.corridorZ + 4.8);
    this.group.add(parapetN);

    const parapetS = new THREE.Mesh(new THREE.BoxGeometry(trackLength, 1.2, 0.35), concreteMat);
    parapetS.position.set(0, this.trackElevation + 0.6, this.corridorZ - 4.8);
    this.group.add(parapetS);

    // Continuous Dual Running Rails
    const railGeo = new THREE.BoxGeometry(trackLength, 0.2, 0.12);
    [-2.2, -0.8, 0.8, 2.2].forEach(offZ => {
      const rail = new THREE.Mesh(railGeo, steelMat);
      rail.position.set(0, this.trackElevation + 0.1, this.corridorZ + offZ);
      this.group.add(rail);
    });

    // Piers along viaduct
    for (let x = -270; x <= 270; x += 30) {
      const nearStation = this.stations.some(s => Math.abs(x - s.x) < 36);
      if (nearStation) continue;

      const pier = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.8, this.trackElevation, 16), concreteMat);
      pier.position.set(x, this.trackElevation / 2, this.corridorZ);
      pier.castShadow = true;
      this.group.add(pier);

      const crosshead = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.8, 9.4), concreteMat);
      crosshead.position.set(x, this.trackElevation - 0.9, this.corridorZ);
      this.group.add(crosshead);

      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 5.5, 8), mastMat);
      mast.position.set(x, this.trackElevation + 2.75, this.corridorZ);
      this.group.add(mast);

      const crossArm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 8.0), mastMat);
      crossArm.position.set(x, this.trackElevation + 5.0, this.corridorZ);
      this.group.add(crossArm);
    }
  }

  buildStation(stationData) {
    const stationGroup = new THREE.Group();
    stationGroup.position.set(stationData.x, 0, stationData.z);

    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.75 });
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5 });
    const purpleMat = new THREE.MeshStandardMaterial({ color: 0x6b21a8, roughness: 0.4 }); // Namma Metro Purple Line
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5,
      roughness: 0.1,
      metalness: 0.9
    });
    const yellowMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });

    const stationLength = 72;
    const stationWidth = 22;

    // 1. Street Level Entry Portals (X: -25 and +25)
    [-25, 25].forEach(sx => {
      const entryPort = new THREE.Mesh(new THREE.BoxGeometry(6, 4.2, 5), concreteMat);
      entryPort.position.set(sx, 2.1, stationWidth / 2 + 3);
      stationGroup.add(entryPort);

      // Station Name Plaque (Bilingual)
      const signMesh = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.9, 0.2), purpleMat);
      signMesh.position.set(sx, 4.5, stationWidth / 2 + 5.6);
      stationGroup.add(signMesh);
    });

    // 2. Concourse Deck (Ticketing & Fare Control at Y = 7.0m)
    const concourseDeck = new THREE.Mesh(new THREE.BoxGeometry(stationLength, 1.2, stationWidth), floorMat);
    concourseDeck.position.y = 7.0;
    concourseDeck.receiveShadow = true;
    stationGroup.add(concourseDeck);

    // Concourse Glass Perimeter Curtain Walls
    const concourseWallN = new THREE.Mesh(new THREE.BoxGeometry(stationLength, 4.5, 0.2), glassMat);
    concourseWallN.position.set(0, 9.5, stationWidth / 2);
    stationGroup.add(concourseWallN);

    const concourseWallS = new THREE.Mesh(new THREE.BoxGeometry(stationLength, 4.5, 0.2), glassMat);
    concourseWallS.position.set(0, 9.5, -stationWidth / 2);
    stationGroup.add(concourseWallS);

    // AFC Turnstile Fare Gates (Array of 6 ticket barriers with glowing green LED indicators)
    for (let g = -5; g <= 5; g += 2) {
      const turnstile = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.1, 1.8), steelMat);
      turnstile.position.set(g, 7.6 + 0.55, 0);
      stationGroup.add(turnstile);

      const greenLED = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.08, 0.15), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
      greenLED.position.set(g, 8.75, 0.85);
      stationGroup.add(greenLED);
    }

    // Customer Service Counter & Ticket Vending Machines (TVMs)
    const tvmRow = new THREE.Mesh(new THREE.BoxGeometry(7, 2.2, 0.8), steelMat);
    tvmRow.position.set(-18, 8.1, -stationWidth / 2 + 2);
    stationGroup.add(tvmRow);

    // 3. Platform Deck (Passenger Boarding at Y = 14.0m)
    const platformNorth = new THREE.Mesh(new THREE.BoxGeometry(stationLength, 0.8, 4.2), floorMat);
    platformNorth.position.set(0, this.trackElevation - 0.4, 4.8);
    platformNorth.receiveShadow = true;
    stationGroup.add(platformNorth);

    const platformSouth = new THREE.Mesh(new THREE.BoxGeometry(stationLength, 0.8, 4.2), floorMat);
    platformSouth.position.set(0, this.trackElevation - 0.4, -4.8);
    platformSouth.receiveShadow = true;
    stationGroup.add(platformSouth);

    // Tactile Yellow Safety Warning Pavers along platform track edge
    const tactileN = new THREE.Mesh(new THREE.BoxGeometry(stationLength, 0.05, 0.4), yellowMat);
    tactileN.position.set(0, this.trackElevation + 0.03, 2.85);
    stationGroup.add(tactileN);

    const tactileS = new THREE.Mesh(new THREE.BoxGeometry(stationLength, 0.05, 0.4), yellowMat);
    tactileS.position.set(0, this.trackElevation + 0.03, -2.85);
    stationGroup.add(tactileS);

    // 4. Passenger Information Display System (PIDS LED Screens)
    [-15, 15].forEach(px => {
      const pidsN = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.7, 0.3), new THREE.MeshBasicMaterial({ color: 0x0f172a }));
      pidsN.position.set(px, this.trackElevation + 3.2, 4.5);
      stationGroup.add(pidsN);

      const pidsLED = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.5, 0.05), new THREE.MeshBasicMaterial({ color: 0xf97316 })); // Orange dot matrix
      pidsLED.position.set(px, this.trackElevation + 3.2, 4.34);
      stationGroup.add(pidsLED);
    });

    // 5. Overhead Canopy Roof & Cantilever Trusses
    const roofCanopy = new THREE.Mesh(new THREE.BoxGeometry(stationLength + 4, 0.4, stationWidth + 2), steelMat);
    roofCanopy.position.set(0, this.trackElevation + 5.5, 0);
    roofCanopy.castShadow = true;
    stationGroup.add(roofCanopy);

    // Station Support Columns
    [-28, 0, 28].forEach(cx => {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.0, this.trackElevation + 5.5, 16), concreteMat);
      col.position.set(cx, (this.trackElevation + 5.5) / 2, 0);
      col.castShadow = true;
      stationGroup.add(col);
    });

    // Stairs connecting Concourse (7.0m) to Platform (14.0m)
    [-20, 20].forEach(sx => {
      const stairW = new THREE.Mesh(new THREE.BoxGeometry(3.5, 7.0, 8.0), concreteMat);
      stairW.rotation.x = Math.PI / 6;
      stairW.position.set(sx, 10.5, 0);
      stationGroup.add(stairW);
    });

    // Tactical Station Loot Spawner Cache
    const cacheBox = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 1.4), new THREE.MeshStandardMaterial({
      color: 0x9333ea,
      metalness: 0.6,
      roughness: 0.3
    }));
    cacheBox.position.set(22, this.trackElevation + 0.4, 5.2);
    stationGroup.add(cacheBox);
    this.stationLootCaches.push({
      stationId: stationData.id,
      position: new THREE.Vector3(stationData.x + 22, this.trackElevation + 0.4, stationData.z + 5.2),
      isLooted: false,
      mesh: cacheBox
    });

    this.group.add(stationGroup);
  }

  buildAdvancedTrainMesh() {
    const trainGroup = new THREE.Group();

    const stainlessMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.88,
      roughness: 0.2
    });

    const purpleLiveryMat = new THREE.MeshStandardMaterial({
      color: 0x7e22ce,
      roughness: 0.35,
      metalness: 0.15
    });

    const interiorFloorMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.7
    });

    const seatMat = new THREE.MeshStandardMaterial({
      color: 0x6b21a8, // Vibrant purple molded ergonomic seats
      roughness: 0.4
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.1
    });

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.08,
      metalness: 0.92
    });

    const doorMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.8,
      roughness: 0.25
    });

    const coachLength = 22.0;
    const coachWidth = 3.6;
    const coachHeight = 3.5;

    this.doorsList = [];

    // 3-Coach Modern Metro Train Formation (Lead Coach, Center Trailer, Rear Coach)
    for (let c = 0; c < 3; c++) {
      const coach = new THREE.Group();
      coach.position.x = (c - 1) * (coachLength + 0.7);

      // 1. Walk-In Floor & Bogies
      const floor = new THREE.Mesh(new THREE.BoxGeometry(coachLength, 0.35, coachWidth), interiorFloorMat);
      floor.position.y = 0.18;
      floor.receiveShadow = true;
      coach.add(floor);

      // Bogie Wheelsets
      const bogieMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.3 });
      [-coachLength * 0.35, coachLength * 0.35].forEach(bx => {
        const bogieL = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.26, 14), bogieMat);
        bogieL.rotation.x = Math.PI / 2;
        bogieL.position.set(bx, -0.25, coachWidth * 0.4);
        coach.add(bogieL);

        const bogieR = bogieL.clone();
        bogieR.position.z = -coachWidth * 0.4;
        coach.add(bogieR);
      });

      // 2. Stainless Steel Walls & Roof
      const roof = new THREE.Mesh(new THREE.BoxGeometry(coachLength, 0.25, coachWidth), stainlessMat);
      roof.position.y = coachHeight + 0.12;
      coach.add(roof);

      // Roof HVAC Unit
      const hvac = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.4, 2.2), bogieMat);
      hvac.position.set(0, coachHeight + 0.35, 0);
      coach.add(hvac);

      // Middle Coach Rooftop Pantograph
      if (c === 1) {
        const pantoFrame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 1.8), bogieMat);
        pantoFrame.position.set(0, coachHeight + 0.4, 0);
        coach.add(pantoFrame);

        const pantoDiamond = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.8, 6), bogieMat);
        pantoDiamond.rotation.z = Math.PI / 4;
        pantoDiamond.position.set(0, coachHeight + 1.1, 0);
        coach.add(pantoDiamond);
      }

      // 3. Waistline Purple Line Stripe
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(coachLength + 0.05, 0.55, coachWidth + 0.05), purpleLiveryMat);
      stripe.position.y = 1.6;
      coach.add(stripe);

      // 4. Detailed Interior: Longitudinal Seating Rows (Left & Right)
      for (let s = -coachLength / 2 + 3.0; s <= coachLength / 2 - 3.0; s += 2.2) {
        if (Math.abs(s) < 2.0) continue; // Door entry space

        // North Bench
        const benchN = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.45, 0.65), seatMat);
        benchN.position.set(s, 0.55, coachWidth / 2 - 0.45);
        coach.add(benchN);

        // South Bench
        const benchS = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.45, 0.65), seatMat);
        benchS.position.set(s, 0.55, -coachWidth / 2 + 0.45);
        coach.add(benchS);
      }

      // 5. Stainless Grab Poles (Stanchions) & Ceiling Overhead Grab Rails
      for (let p = -coachLength / 2 + 3.5; p <= coachLength / 2 - 3.5; p += 3.5) {
        // Center-aisle vertical grab pole
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, coachHeight - 0.35, 8), chromeMat);
        pole.position.set(p, coachHeight / 2, 0);
        coach.add(pole);
      }

      // Overhead Ceiling Grab Rails (Dual along aisle)
      [-0.6, 0.6].forEach(rz => {
        const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, coachLength - 4.0, 8), chromeMat);
        rail.rotation.z = Math.PI / 2;
        rail.position.set(0, coachHeight - 0.5, rz);
        coach.add(rail);
      });

      // 6. Dynamic Sliding Passenger Doors (2 door bays per side)
      [-5.5, 5.5].forEach(dx => {
        // North side doors (Platform side)
        const doorL = new THREE.Mesh(new THREE.BoxGeometry(0.85, 2.3, 0.08), doorMat);
        doorL.position.set(dx - 0.45, 1.45, coachWidth / 2 + 0.02);
        coach.add(doorL);

        const doorR = new THREE.Mesh(new THREE.BoxGeometry(0.85, 2.3, 0.08), doorMat);
        doorR.position.set(dx + 0.45, 1.45, coachWidth / 2 + 0.02);
        coach.add(doorR);

        // Door warning red/green LED
        const doorLED = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.08, 0.04), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
        doorLED.position.set(dx, 2.7, coachWidth / 2 + 0.06);
        coach.add(doorLED);

        this.doorsList.push({
          doorL,
          doorR,
          baseLX: dx - 0.45,
          baseRX: dx + 0.45,
          led: doorLED
        });
      });

      // 7. Panoramic Passenger Windows
      for (let w = -coachLength / 2 + 2.5; w < coachLength / 2 - 2.0; w += 3.4) {
        if (Math.abs(w - (-5.5)) < 1.4 || Math.abs(w - 5.5) < 1.4) continue; // Skip door areas

        const winS = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.2, 0.06), glassMat);
        winS.position.set(w, 2.1, -coachWidth / 2 - 0.02);
        coach.add(winS);
      }

      // 8. Aerodynamic Driver Nose Cone (Lead = coach 2, Rear = coach 0)
      if (c === 2) {
        const nose = new THREE.Mesh(new THREE.ConeGeometry(coachWidth * 0.52, 4.2, 4), stainlessMat);
        nose.rotation.z = -Math.PI / 2;
        nose.position.set(coachLength / 2 + 2.1, coachHeight * 0.45, 0);
        coach.add(nose);

        const cabWindshield = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, coachWidth * 0.75), glassMat);
        cabWindshield.rotation.z = -Math.PI / 6;
        cabWindshield.position.set(coachLength / 2 + 1.4, coachHeight * 0.65, 0);
        coach.add(cabWindshield);
      } else if (c === 0) {
        const rearNose = new THREE.Mesh(new THREE.ConeGeometry(coachWidth * 0.52, 4.2, 4), stainlessMat);
        rearNose.rotation.z = Math.PI / 2;
        rearNose.position.set(-coachLength / 2 - 2.1, coachHeight * 0.45, 0);
        coach.add(rearNose);
      }

      trainGroup.add(coach);
    }

    // High-Intensity Dual LED Headlights
    const hlMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const hlL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.25, 0.35), hlMat);
    hlL.position.set(36.0, 1.8, 0.9);
    trainGroup.add(hlL);

    const hlR = hlL.clone();
    hlR.position.z = -0.9;
    trainGroup.add(hlR);

    return trainGroup;
  }

  update(delta, player, hud) {
    const currentTargetStation = this.stations[this.currentStationIndex];
    const distToTarget = Math.abs(this.trainPosition.x - currentTargetStation.x);

    // State Machine
    if (this.trainState === 'docked') {
      // Dwell at platform with doors open
      this.trainSpeed = 0;
      this.doorsOpen = true;
      this.doorSlideOffset = THREE.MathUtils.lerp(this.doorSlideOffset, 0.85, delta * 3.0);
      this.dockTimer -= delta;

      if (this.dockTimer <= 0) {
        // Prepare departure: Close doors and chime
        this.trainState = 'departing';
        this.doorsOpen = false;
        if (this.audioManager) {
          // Play classic 3-tone chime
          this.audioManager.playUIBeep(880);
          setTimeout(() => this.audioManager.playUIBeep(660), 120);
          setTimeout(() => this.audioManager.playUIBeep(440), 240);
        }
        if (hud) {
          hud.triggerKillfeed(`Metro Departing: Next Station ${this.getNextStationName()}`);
        }
      }
    } else if (this.trainState === 'departing') {
      // Doors closing animation
      this.doorSlideOffset = THREE.MathUtils.lerp(this.doorSlideOffset, 0, delta * 4.0);
      this.trainSpeed = THREE.MathUtils.lerp(this.trainSpeed, this.targetSpeed * this.direction, delta * 0.8);
      this.trainPosition.x += this.trainSpeed * delta;

      if (Math.abs(this.trainSpeed) > 5.0) {
        this.trainState = 'cruising';
      }
    } else if (this.trainState === 'cruising') {
      this.trainSpeed = this.targetSpeed * this.direction;
      this.trainPosition.x += this.trainSpeed * delta;

      // Determine next station
      const nextIdx = this.currentStationIndex + this.direction;
      if (nextIdx >= 0 && nextIdx < this.stations.length) {
        const nextStation = this.stations[nextIdx];
        const distToNext = Math.abs(this.trainPosition.x - nextStation.x);

        // Start braking smoothly 45 meters before station
        if (distToNext < 45) {
          this.currentStationIndex = nextIdx;
          this.trainState = 'stopping';
          // Play Kannada & English station arrival announcement
          if (this.audioManager) {
            this.audioManager.playUIBeep(750);
          }
          if (hud) {
            hud.triggerKillfeed(`Approaching: ${nextStation.name}`);
          }
        }
      } else {
        // Reached end of line: Reverse direction
        this.direction *= -1;
      }
    } else if (this.trainState === 'stopping') {
      // Decelerate into station berth
      this.trainSpeed = THREE.MathUtils.lerp(this.trainSpeed, 0, delta * 1.8);
      this.trainPosition.x += this.trainSpeed * delta;

      if (distToTarget < 0.5 || Math.abs(this.trainSpeed) < 0.4) {
        this.trainPosition.x = currentTargetStation.x;
        this.trainSpeed = 0;
        this.trainState = 'docked';
        this.dockTimer = 8.5; // Dwell time
        this.doorsOpen = true;

        if (this.audioManager) {
          this.audioManager.playUIBeep(580);
        }
        if (hud) {
          hud.triggerKillfeed(`Arrived at ${currentTargetStation.shortName} • Doors Opening`);
        }
      }
    }

    // Update Door Slide Animation
    this.doorsList.forEach(door => {
      door.doorL.position.x = door.baseLX - this.doorSlideOffset;
      door.doorR.position.x = door.baseRX + this.doorSlideOffset;
      door.led.material.color.setHex(this.doorsOpen ? 0x22c55e : 0xef4444); // Green when open, Red when closing
    });

    this.trainMesh.position.copy(this.trainPosition);

    // Player Carriage Synchronization:
    // If player is inside the train carriage envelope, translate player smoothly with train movement!
    if (player && player.position.y >= 13.8 && player.position.y <= 18.0) {
      const dx = player.position.x - this.trainPosition.x;
      const dz = player.position.z - this.trainPosition.z;

      // Train length is 3 * 22m = ~68m, width is ~3.8m
      if (Math.abs(dx) < 34.0 && Math.abs(dz) < 2.4) {
        player.position.x += this.trainSpeed * delta;
        player.mesh.position.copy(player.position);
      }
    }
  }

  getNextStationName() {
    const nextIdx = this.currentStationIndex + this.direction;
    if (nextIdx >= 0 && nextIdx < this.stations.length) {
      return this.stations[nextIdx].shortName;
    }
    return this.stations[this.currentStationIndex].shortName;
  }

  getClosestStation(position) {
    let closest = null;
    let minDist = Infinity;
    this.stations.forEach(st => {
      const dist = Math.hypot(position.x - st.x, position.z - st.z);
      if (dist < minDist) {
        minDist = dist;
        closest = st;
      }
    });
    return { station: closest, distance: minDist };
  }

  isPlayerInsideTrain(playerPosition) {
    if (playerPosition.y < 13.8 || playerPosition.y > 18.0) return false;
    const dx = playerPosition.x - this.trainPosition.x;
    const dz = playerPosition.z - this.trainPosition.z;
    return Math.abs(dx) < 34.0 && Math.abs(dz) < 2.4;
  }
}
