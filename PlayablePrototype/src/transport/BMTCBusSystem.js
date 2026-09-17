// Bengaluru Metropolitan Transport (BMTC-Inspired) System: Double-Decker & City Buses
// BENGALURU: LAST CITY - Phase 2.5 Overhaul
import * as THREE from 'three';

export class BMTCBusSystem {
  constructor(scene, audioManager) {
    this.scene = scene;
    this.audioManager = audioManager;
    this.group = new THREE.Group();

    this.buses = [];
    this.doubleDeckerBus = null;

    this.initDoubleDeckerBus();
    this.initCityBuses();

    this.scene.add(this.group);
  }

  initDoubleDeckerBus() {
    // Flagship Double-Decker Transit Bus ("BMT SkyCruiser Heritage")
    const bus = this.createDoubleDeckerMesh();
    bus.position.set(-80, 0, 8.5); // Starts on main East-West Boulevard
    bus.userData = {
      id: 'DD-01',
      routeId: 'D1',
      routeName: '201G: MAJESTIC ⇄ ELECTRONIC CITY',
      speed: 12.0,
      targetSpeed: 12.0,
      yaw: 0,
      state: 'cruising', // 'cruising', 'stopping', 'docked', 'departing'
      dockTimer: 0,
      doorOpenProgress: 0,
      isDoubleDecker: true,
      passengers: [],
      // Deck levels relative to bus root
      lowerDeckHeight: 0.65,
      upperDeckHeight: 2.55,
      seats: []
    };

    this.doubleDeckerBus = bus;
    this.buses.push(bus);
    this.group.add(bus);
  }

  initCityBuses() {
    // 2 Standard Single-Decker BMTC City Buses (Green Electric & Blue/White)
    const routes = [
      { x: 140, z: -100, yaw: Math.PI / 2, color: 0x1565c0, route: '335E: MG ROAD ⇄ IT TECH PARK' },
      { x: -140, z: 90, yaw: -Math.PI / 2, color: 0x2e7d32, route: 'G4: MAJESTIC ⇄ KENGERI' }
    ];

    routes.forEach((cfg, idx) => {
      const bus = this.createSingleDeckBusMesh(cfg.color, cfg.route);
      bus.position.set(cfg.x, 0, cfg.z);
      bus.rotation.y = cfg.yaw;
      bus.userData = {
        id: `SD-0${idx + 1}`,
        routeId: `D${idx + 2}`,
        routeName: cfg.route,
        speed: 11.0,
        targetSpeed: 11.0,
        yaw: cfg.yaw,
        state: 'cruising',
        dockTimer: 0,
        doorOpenProgress: 0,
        isDoubleDecker: false
      };
      this.buses.push(bus);
      this.group.add(bus);
    });
  }

  createDoubleDeckerMesh() {
    const root = new THREE.Group();

    // High-Resolution Materials
    const bodyBlueMat = new THREE.MeshStandardMaterial({
      color: 0x0d47a1, // BMTC Signature Deep Blue
      roughness: 0.35,
      metalness: 0.25
    });

    const bodyWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc, // Clean White Upper Band
      roughness: 0.3,
      metalness: 0.1
    });

    const darkGlassMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.08,
      metalness: 0.9,
      transparent: true,
      opacity: 0.72
    });

    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7, metalness: 0.4 });
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
    const seatMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.6 }); // Blue moquette fabric
    const handrailMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.2 }); // Yellow safety grab rails
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x141517, roughness: 0.85 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 });

    const length = 12.8;
    const width = 2.85;
    const lowerH = 1.9;
    const upperH = 1.9;
    const totalH = 4.3;

    // ----------------------------------------------------
    // 1. CHASSIS, WHEELS & SUSPENSION
    // ----------------------------------------------------
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(length, 0.4, width), chassisMat);
    chassis.position.y = 0.45;
    chassis.castShadow = true;
    root.add(chassis);

    // Twin Axles (Front Single, Rear Dual)
    const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.35, 18);
    const wheelPositions = [
      [length * 0.36, width * 0.46],  // Front Left
      [length * 0.36, -width * 0.46], // Front Right
      [-length * 0.32, width * 0.46], // Rear Left
      [-length * 0.32, -width * 0.46] // Rear Right
    ];

    wheelPositions.forEach(([wx, wz]) => {
      const wheel = new THREE.Mesh(wheelGeo, tireMat);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(wx, 0.5, wz);
      wheel.castShadow = true;
      root.add(wheel);

      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.36, 12), chromeMat);
      hub.rotation.x = Math.PI / 2;
      hub.position.set(wx, 0.5, wz);
      root.add(hub);
    });

    // ----------------------------------------------------
    // 2. LOWER DECK (FLOOR, SEATS, RAILS & CAB)
    // ----------------------------------------------------
    // Lower Deck Floor
    const lowerFloor = new THREE.Mesh(new THREE.BoxGeometry(length - 0.4, 0.15, width - 0.2), floorMat);
    lowerFloor.position.y = 0.65;
    lowerFloor.receiveShadow = true;
    root.add(lowerFloor);

    // Lower Deck Outer Body Shell
    const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(length, lowerH, width), bodyBlueMat);
    lowerBody.position.y = 0.65 + lowerH / 2;
    lowerBody.castShadow = true;
    root.add(lowerBody);

    // Lower Deck Windows
    for (let wx = -length * 0.38; wx <= length * 0.32; wx += 2.2) {
      [-width / 2 - 0.02, width / 2 + 0.02].forEach(wz => {
        const win = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.9, 0.05), darkGlassMat);
        win.position.set(wx, 1.85, wz);
        root.add(win);
      });
    }

    // Driver Cab (Front-Right in India/Bengaluru)
    const driverCab = new THREE.Group();
    driverCab.position.set(length * 0.42, 0.72, -width * 0.25);
    const steerCol = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7, 8), chassisMat);
    steerCol.rotation.z = Math.PI / 4;
    driverCab.add(steerCol);

    const steerWheel = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.03, 8, 16), chassisMat);
    steerWheel.position.set(0.25, 0.45, 0);
    driverCab.add(steerWheel);

    const driverSeat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.5), seatMat);
    driverSeat.position.set(-0.15, 0.3, 0);
    driverCab.add(driverSeat);
    root.add(driverCab);

    // Lower Deck Passenger Seats (2x2 Rows)
    const seatGeo = new THREE.BoxGeometry(0.48, 0.55, 0.45);
    for (let sx = -length * 0.35; sx <= length * 0.2; sx += 1.3) {
      // Left side pair
      const sL = new THREE.Mesh(seatGeo, seatMat);
      sL.position.set(sx, 1.0, width * 0.28);
      root.add(sL);

      // Right side pair
      const sR = new THREE.Mesh(seatGeo, seatMat);
      sR.position.set(sx, 1.0, -width * 0.28);
      root.add(sR);
    }

    // Vertical Grab Handrails (Safety Yellow)
    const poleGeo = new THREE.CylinderGeometry(0.025, 0.025, lowerH - 0.2, 8);
    for (let px = -length * 0.32; px <= length * 0.25; px += 2.0) {
      const poleL = new THREE.Mesh(poleGeo, handrailMat);
      poleL.position.set(px, 1.6, width * 0.12);
      root.add(poleL);

      const poleR = new THREE.Mesh(poleGeo, handrailMat);
      poleR.position.set(px, 1.6, -width * 0.12);
      root.add(poleR);
    }

    // Bi-fold Passenger Doors (Front & Center-Left)
    this.doors = [];
    [length * 0.34, -0.2].forEach(dx => {
      const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.7, 0.08), bodyWhiteMat);
      doorLeaf.position.set(dx, 1.55, width / 2 + 0.02);
      root.add(doorLeaf);
      this.doors.push(doorLeaf);
    });

    // ----------------------------------------------------
    // 3. INTERIOR STAIRCASE TO UPPER DECK
    // ----------------------------------------------------
    // Spiral/Dog-leg Stairwell at Rear-Left (x = -4.5, z = 0.85)
    const stairwellGroup = new THREE.Group();
    stairwellGroup.position.set(-length * 0.36, 0.65, width * 0.28);

    const stepMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7 });
    const numSteps = 8;
    for (let s = 0; s < numSteps; s++) {
      const stepH = (upperH * 0.95) / numSteps;
      const step = new THREE.Mesh(new THREE.BoxGeometry(0.35, stepH, 0.8), stepMat);
      step.position.set(s * 0.22, (s + 0.5) * stepH, 0);
      stairwellGroup.add(step);
    }
    root.add(stairwellGroup);

    // ----------------------------------------------------
    // 4. UPPER DECK (PANORAMIC GLASS, SEATING & ROOF)
    // ----------------------------------------------------
    // Intermediate Floor / Ceiling Slab
    const midFloor = new THREE.Mesh(new THREE.BoxGeometry(length - 0.3, 0.15, width - 0.1), floorMat);
    midFloor.position.y = 0.65 + lowerH;
    midFloor.receiveShadow = true;
    root.add(midFloor);

    // Upper Deck Outer Body Shell
    const upperBody = new THREE.Mesh(new THREE.BoxGeometry(length, upperH, width), bodyWhiteMat);
    upperBody.position.y = 0.65 + lowerH + upperH / 2;
    upperBody.castShadow = true;
    root.add(upperBody);

    // Front Panoramic Viewing Glass (Curved Windshield providing stunning city vista!)
    const panoWindshield = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, width * 0.88), darkGlassMat);
    panoWindshield.rotation.z = -Math.PI / 8;
    panoWindshield.position.set(length / 2 + 0.05, 0.65 + lowerH + 0.9, 0);
    root.add(panoWindshield);

    // Upper Deck Side Windows
    for (let wx = -length * 0.4; wx <= length * 0.35; wx += 2.1) {
      [-width / 2 - 0.02, width / 2 + 0.02].forEach(wz => {
        const win = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 0.05), darkGlassMat);
        win.position.set(wx, 0.65 + lowerH + 1.0, wz);
        root.add(win);
      });
    }

    // Upper Deck Passenger Seats (Full 2x2 rows, front row looks straight ahead!)
    for (let sx = -length * 0.38; sx <= length * 0.4; sx += 1.2) {
      const sL = new THREE.Mesh(seatGeo, seatMat);
      sL.position.set(sx, 0.65 + lowerH + 0.35, width * 0.28);
      root.add(sL);

      const sR = new THREE.Mesh(seatGeo, seatMat);
      sR.position.set(sx, 0.65 + lowerH + 0.35, -width * 0.28);
      root.add(sR);
    }

    // Bus Roof
    const roof = new THREE.Mesh(new THREE.BoxGeometry(length, 0.25, width), bodyWhiteMat);
    roof.position.y = totalH + 0.35;
    roof.castShadow = true;
    root.add(roof);

    // ----------------------------------------------------
    // 5. DESTINATION LED MATRIX, LIGHTS & DETAILS
    // ----------------------------------------------------
    // Electronic Destination Board (Amber Matrix LED)
    const destGeo = new THREE.BoxGeometry(0.1, 0.35, 2.2);
    const destMat = new THREE.MeshBasicMaterial({ color: 0xffb300 });
    const destBoard = new THREE.Mesh(destGeo, destMat);
    destBoard.position.set(length / 2 + 0.06, totalH + 0.1, 0);
    root.add(destBoard);

    // Side Kannada / English Transit Branding
    const brandMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const brandN = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 0.4), brandMat);
    brandN.position.set(0, 2.5, width / 2 + 0.04);
    root.add(brandN);

    // Headlights
    const hlMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    [-0.8, 0.8].forEach(hz => {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, 0.3), hlMat);
      hl.position.set(length / 2 + 0.02, 1.0, hz);
      root.add(hl);
    });

    // Headlight SpotBeam
    this.headlightBeam = new THREE.SpotLight(0xffffff, 2.8, 70, Math.PI / 5, 0.3);
    this.headlightBeam.position.set(length / 2 + 0.5, 1.2, 0);
    this.headlightBeam.target.position.set(length / 2 + 35, 0, 0);
    root.add(this.headlightBeam);
    root.add(this.headlightBeam.target);

    // Rear Brake Light Bar
    const brakeMat = new THREE.MeshBasicMaterial({ color: 0xff1744 });
    const brakeBar = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.15, 2.2), brakeMat);
    brakeBar.position.set(-length / 2 - 0.02, 1.1, 0);
    root.add(brakeBar);

    return root;
  }

  createSingleDeckBusMesh(primaryColor = 0x1565c0, routeName = '335E') {
    const root = new THREE.Group();

    const bodyMat = new THREE.MeshStandardMaterial({ color: primaryColor, roughness: 0.4 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, transparent: true, opacity: 0.75 });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x141517, roughness: 0.85 });

    const length = 11.5;
    const width = 2.75;
    const height = 3.3;

    // Chassis
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(length, 0.35, width), bodyMat);
    chassis.position.y = 0.45;
    chassis.castShadow = true;
    root.add(chassis);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.32, 16);
    [
      [length * 0.35, width * 0.46],
      [length * 0.35, -width * 0.46],
      [-length * 0.32, width * 0.46],
      [-length * 0.32, -width * 0.46]
    ].forEach(([wx, wz]) => {
      const w = new THREE.Mesh(wheelGeo, tireMat);
      w.rotation.x = Math.PI / 2;
      w.position.set(wx, 0.48, wz);
      root.add(w);
    });

    // Lower Body
    const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(length, height * 0.55, width), bodyMat);
    lowerBody.position.y = 0.5 + (height * 0.55) / 2;
    lowerBody.castShadow = true;
    root.add(lowerBody);

    // Upper Roof Band
    const upperRoof = new THREE.Mesh(new THREE.BoxGeometry(length, height * 0.45, width), whiteMat);
    upperRoof.position.y = 0.5 + height * 0.55 + (height * 0.45) / 2;
    upperRoof.castShadow = true;
    root.add(upperRoof);

    // Windows
    for (let wx = -length * 0.36; wx <= length * 0.32; wx += 2.2) {
      [-width / 2 - 0.02, width / 2 + 0.02].forEach(wz => {
        const win = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 0.05), glassMat);
        win.position.set(wx, 2.0, wz);
        root.add(win);
      });
    }

    // Destination Board
    const dest = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 2.0), new THREE.MeshBasicMaterial({ color: 0xffb300 }));
    dest.position.set(length / 2 + 0.05, height + 0.2, 0);
    root.add(dest);

    return root;
  }

  update(delta, player, busRouteManager = null) {
    this.buses.forEach(bus => {
      const data = bus.userData;
      const prevState = data.state;

      // 1. Bus Route Navigation AI
      if (busRouteManager) {
        busRouteManager.updateBusNavigation(bus, delta);
      } else {
        // Fallback default patrol along boulevard
        if (data.state === 'cruising') {
          bus.position.x += data.speed * delta;
          if (bus.position.x > 260) bus.position.x = -260;
        }
      }

      // Audio cues on state transitions
      if (this.audioManager) {
        if (data.state === 'stopping' && prevState !== 'stopping') {
          this.audioManager.playAirBrakeHiss();
        } else if (data.state === 'docked' && prevState !== 'docked') {
          this.audioManager.playBusDoorChime();
        }
      }

      // 2. Door Open / Close Animation
      if (data.state === 'docked') {
        data.doorOpenProgress = Math.min(1.0, data.doorOpenProgress + delta * 2.5);
      } else {
        data.doorOpenProgress = Math.max(0.0, data.doorOpenProgress - delta * 2.5);
      }

      if (bus.children && bus.children.length > 0) {
        // Animate door leaves sliding/folding
        bus.children.forEach(child => {
          if (child.position.z > 1.3 && Math.abs(child.position.y - 1.55) < 0.2) {
            child.scale.x = 1.0 - data.doorOpenProgress * 0.85;
          }
        });
      }

      // 3. Dynamic Player Boarding & Ride Carrying
      if (player && this.isPlayerAboard(player, bus)) {
        // Carry player with bus movement!
        const forwardX = Math.cos(bus.rotation.y);
        const forwardZ = -Math.sin(bus.rotation.y);
        player.position.x += forwardX * data.speed * delta;
        player.position.z += forwardZ * data.speed * delta;
        player.mesh.position.copy(player.position);
      }
    });
  }

  boardPlayer(player, targetDeck = 'LOWER_DECK') {
    if (!this.doubleDeckerBus || !player) return;
    const bus = this.doubleDeckerBus;
    const cosY = Math.cos(bus.rotation.y);
    const sinY = Math.sin(bus.rotation.y);

    let localX = 0;
    let localY = 0.8;
    let localZ = 0.2;

    if (targetDeck === 'UPPER_DECK') {
      localX = 3.6; // Front panoramic viewing section
      localY = 2.75;
      localZ = 0.0;
    }

    const worldX = bus.position.x + (localX * cosY + localZ * sinY);
    const worldZ = bus.position.z + (-localX * sinY + localZ * cosY);
    const worldY = bus.position.y + localY;

    player.teleport(worldX, worldY, worldZ);
  }

  exitPlayerToCurb(player) {
    if (!this.doubleDeckerBus || !player) return;
    const bus = this.doubleDeckerBus;
    const cosY = Math.cos(bus.rotation.y);
    const sinY = Math.sin(bus.rotation.y);

    // Step out onto sidewalk curb to the left of the bus doors
    const localX = 0;
    const localZ = 2.8;
    const worldX = bus.position.x + (localX * cosY + localZ * sinY);
    const worldZ = bus.position.z + (-localX * sinY + localZ * cosY);

    player.teleport(worldX, 0.05, worldZ);
  }

  isPlayerAboard(player, bus) {
    if (!player) return false;
    const dx = player.position.x - bus.position.x;
    const dz = player.position.z - bus.position.z;
    const dy = player.position.y - bus.position.y;

    // Check bounds: Length 12.8m, Width 2.85m, Height up to 4.5m
    if (Math.abs(dx) < 6.2 && Math.abs(dz) < 1.4 && dy >= 0.5 && dy <= 4.6) {
      return true;
    }
    return false;
  }

  getPlayerCurrentDeck(player) {
    if (!this.doubleDeckerBus || !this.isPlayerAboard(player, this.doubleDeckerBus)) return null;
    const dy = player.position.y - this.doubleDeckerBus.position.y;
    return (dy >= 2.2) ? 'UPPER_DECK' : 'LOWER_DECK';
  }

  getInteractionDistance(playerPos, bus) {
    return bus.position.distanceTo(playerPos);
  }
}
