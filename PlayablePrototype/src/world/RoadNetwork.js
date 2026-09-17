// Modular road network, intersections, markings, and elevated flyover
import * as THREE from 'three';

export class RoadNetwork {
  constructor(scene) {
    this.scene = scene;
    this.streetlights = [];
    this.colliders = [];
    this.group = new THREE.Group();

    this.buildGroundAndRoads();
    this.buildElevatedFlyover();
    this.scene.add(this.group);
  }

  buildGroundAndRoads() {
    // City ground terrain
    const groundGeo = new THREE.PlaneGeometry(600, 600, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x14181f,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.group.add(ground);

    // Main Asphalt Roads (North-South & East-West)
    const asphaltMat = new THREE.MeshStandardMaterial({
      color: 0x22262c,
      roughness: 0.65,
      metalness: 0.15
    });

    // East-West Main Boulevard (z = 0)
    const ewRoadGeo = new THREE.PlaneGeometry(580, 24);
    const ewRoad = new THREE.Mesh(ewRoadGeo, asphaltMat);
    ewRoad.rotation.x = -Math.PI / 2;
    ewRoad.position.y = 0.02;
    ewRoad.receiveShadow = true;
    this.group.add(ewRoad);

    // North-South Main Boulevard (x = 0)
    const nsRoadGeo = new THREE.PlaneGeometry(24, 580);
    const nsRoad = new THREE.Mesh(nsRoadGeo, asphaltMat);
    nsRoad.rotation.x = -Math.PI / 2;
    nsRoad.position.y = 0.02;
    nsRoad.receiveShadow = true;
    this.group.add(nsRoad);

    // Secondary Roads
    const roadZ100 = new THREE.Mesh(new THREE.PlaneGeometry(580, 16), asphaltMat);
    roadZ100.rotation.x = -Math.PI / 2;
    roadZ100.position.set(0, 0.02, 100);
    roadZ100.receiveShadow = true;
    this.group.add(roadZ100);

    const roadZneg90 = new THREE.Mesh(new THREE.PlaneGeometry(580, 16), asphaltMat);
    roadZneg90.rotation.x = -Math.PI / 2;
    roadZneg90.position.set(0, 0.02, -90);
    roadZneg90.receiveShadow = true;
    this.group.add(roadZneg90);

    const roadX110 = new THREE.Mesh(new THREE.PlaneGeometry(16, 580), asphaltMat);
    roadX110.rotation.x = -Math.PI / 2;
    roadX110.position.set(110, 0.02, 0);
    roadX110.receiveShadow = true;
    this.group.add(roadX110);

    const roadXneg110 = new THREE.Mesh(new THREE.PlaneGeometry(16, 580), asphaltMat);
    roadXneg110.rotation.x = -Math.PI / 2;
    roadXneg110.position.set(-110, 0.02, 0);
    roadXneg110.receiveShadow = true;
    this.group.add(roadXneg110);

    // Road Markings & Indian-Style Median Dividers (Black & Yellow kerbs)
    this.buildRoadMarkings();
    this.buildStreetlights();
  }

  buildRoadMarkings() {
    const whiteMat = new THREE.MeshBasicMaterial({ color: 0xefefef });
    const yellowMat = new THREE.MeshBasicMaterial({ color: 0xffb300 });

    // Double yellow median line for EW road
    for (let x = -280; x < 280; x += 15) {
      if (Math.abs(x) < 20 || Math.abs(x - 110) < 15 || Math.abs(x + 110) < 15) continue; // Skip intersections
      const dashGeo = new THREE.PlaneGeometry(8, 0.35);
      const dash = new THREE.Mesh(dashGeo, whiteMat);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(x, 0.03, 5);
      this.group.add(dash);

      const dash2 = dash.clone();
      dash2.position.z = -5;
      this.group.add(dash2);
    }

    // Zebra Crossings at Central Intersection (x=0, z=0)
    for (let i = -8; i <= 8; i += 2) {
      const stripeGeo = new THREE.PlaneGeometry(1.2, 8);
      const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      
      // North crossing
      const stripeN = new THREE.Mesh(stripeGeo, stripeMat);
      stripeN.rotation.x = -Math.PI / 2;
      stripeN.position.set(i, 0.04, -16);
      this.group.add(stripeN);

      // South crossing
      const stripeS = new THREE.Mesh(stripeGeo, stripeMat);
      stripeS.rotation.x = -Math.PI / 2;
      stripeS.position.set(i, 0.04, 16);
      this.group.add(stripeS);
    }

    // Concrete Footpaths & Median Kerbs
    const kerbMat = new THREE.MeshStandardMaterial({ color: 0x3a3f47, roughness: 0.8 });
    const kerbGeo = new THREE.BoxGeometry(260, 0.3, 1.2);

    // Medians with yellow/black warning pattern
    const median1 = new THREE.Mesh(kerbGeo, kerbMat);
    median1.position.set(140, 0.15, 0);
    this.group.add(median1);

    const median2 = new THREE.Mesh(kerbGeo, kerbMat);
    median2.position.set(-140, 0.15, 0);
    this.group.add(median2);
  }

  buildStreetlights() {
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x2c333a, metalness: 0.8, roughness: 0.3 });
    const lampMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffa040, emissiveIntensity: 0.2 });

    const polePositions = [
      [-70, 14], [-30, 14], [30, 14], [70, 14], [140, 14], [180, 14],
      [-70, -14], [-30, -14], [30, -14], [70, -14], [140, -14], [180, -14],
      [14, -60], [14, 60], [-14, -60], [-14, 60]
    ];

    polePositions.forEach(([px, pz]) => {
      const poleGroup = new THREE.Group();
      poleGroup.position.set(px, 0, pz);

      // Vertical pole
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 7.5, 8), poleMat);
      pole.position.y = 3.75;
      pole.castShadow = true;
      poleGroup.add(pole);

      // Curved arm
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.5, 8), poleMat);
      arm.rotation.z = Math.PI / 3;
      arm.position.set(pz > 0 ? 0 : 0, 7.2, pz > 0 ? -0.8 : 0.8);
      poleGroup.add(arm);

      // Lamp fixture
      const fixture = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.8), lampMat);
      fixture.position.set(0, 7.4, pz > 0 ? -1.6 : 1.6);
      poleGroup.add(fixture);

      // Light source (turns on at night)
      const light = new THREE.PointLight(0xffa840, 0, 25);
      light.position.copy(fixture.position);
      light.position.y -= 0.5;
      poleGroup.add(light);

      this.streetlights.push({ light, fixture });
      this.group.add(poleGroup);
    });
  }

  buildElevatedFlyover() {
    // Zone F: Elevated Flyover / Expressway (elevated roadway with concrete piers and on-ramps)
    const flyoverGroup = new THREE.Group();
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x4a5059, roughness: 0.8 });
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x2a2f38, roughness: 0.6 });
    const barrierMat = new THREE.MeshStandardMaterial({ color: 0x75808e, roughness: 0.5 });

    const flyoverElevation = 10.5;
    const flyoverLength = 280;

    // Roadway deck
    const deck = new THREE.Mesh(new THREE.BoxGeometry(16, 1.2, flyoverLength), roadMat);
    deck.position.set(50, flyoverElevation, 30);
    deck.castShadow = true;
    deck.receiveShadow = true;
    flyoverGroup.add(deck);

    // Concrete Crash Barriers (left and right)
    const barrierL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.4, flyoverLength), barrierMat);
    barrierL.position.set(50 - 7.8, flyoverElevation + 0.8, 30);
    flyoverGroup.add(barrierL);

    const barrierR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.4, flyoverLength), barrierMat);
    barrierR.position.set(50 + 7.8, flyoverElevation + 0.8, 30);
    flyoverGroup.add(barrierR);

    // Concrete Piers supporting the flyover
    for (let z = 30 - flyoverLength / 2 + 25; z < 30 + flyoverLength / 2; z += 35) {
      const pier = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, flyoverElevation, 12), concreteMat);
      pier.position.set(50, flyoverElevation / 2, z);
      pier.castShadow = true;
      flyoverGroup.add(pier);

      // Crosshead
      const crosshead = new THREE.Mesh(new THREE.BoxGeometry(14, 1.5, 2.5), concreteMat);
      crosshead.position.set(50, flyoverElevation - 0.7, z);
      crosshead.castShadow = true;
      flyoverGroup.add(crosshead);
    }

    // On-Ramp slope
    const rampLength = 60;
    const rampGeo = new THREE.BoxGeometry(10, 1.0, rampLength);
    const ramp = new THREE.Mesh(rampGeo, roadMat);
    ramp.rotation.x = Math.atan2(flyoverElevation, rampLength);
    ramp.position.set(50, flyoverElevation / 2, 30 + flyoverLength / 2 + rampLength / 2 - 10);
    flyoverGroup.add(ramp);

    // Overhead Highway Sign
    const signPostMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const signPost = new THREE.Mesh(new THREE.BoxGeometry(15, 0.4, 0.4), signPostMat);
    signPost.position.set(50, flyoverElevation + 5.5, 20);
    flyoverGroup.add(signPost);

    const signBoardMat = new THREE.MeshStandardMaterial({ color: 0x00703c, roughness: 0.4 }); // Green Indian highway sign
    const signBoard = new THREE.Mesh(new THREE.BoxGeometry(8, 2.2, 0.2), signBoardMat);
    signBoard.position.set(50, flyoverElevation + 5.5, 20);
    flyoverGroup.add(signBoard);

    this.group.add(flyoverGroup);
  }

  setNightMode(isNight) {
    const intensity = isNight ? 1.5 : 0;
    const emissiveIntensity = isNight ? 1.0 : 0.2;
    this.streetlights.forEach(({ light, fixture }) => {
      light.intensity = intensity;
      fixture.material.emissiveIntensity = emissiveIntensity;
    });
  }
}
