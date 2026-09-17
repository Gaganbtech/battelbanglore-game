// Active Automated Namma Metro Train: Aerodynamic Nose, Ribbed Stainless Shell & Boarding Carriage
// BENGALURU: LAST CITY - Phase 2 Overhaul
import * as THREE from 'three';

export class MovingMetroTrain {
  constructor(scene, audioManager) {
    this.scene = scene;
    this.audioManager = audioManager;

    this.position = new THREE.Vector3(-140, 15.6, -18.2);
    this.speed = 20.0;
    this.stationX = 0;
    this.state = 'cruising'; // 'cruising', 'stopping', 'docked', 'departing'
    this.dockTimer = 0;

    this.mesh = this.buildTrainMesh();
    this.mesh.position.copy(this.position);
    this.scene.add(this.mesh);
  }

  buildTrainMesh() {
    const group = new THREE.Group();

    // High-tech stainless steel & purple line materials
    const stainlessMat = new THREE.MeshStandardMaterial({
      color: 0xdde3ea,
      metalness: 0.88,
      roughness: 0.22
    });

    const purpleMat = new THREE.MeshStandardMaterial({
      color: 0x6a1b9a,
      roughness: 0.35,
      metalness: 0.1
    });

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x11161f,
      roughness: 0.08,
      metalness: 0.95
    });

    const interiorMat = new THREE.MeshStandardMaterial({
      color: 0x374151,
      roughness: 0.6
    });

    const pantographMat = new THREE.MeshStandardMaterial({
      color: 0x263238,
      metalness: 0.9,
      roughness: 0.2
    });

    const coachLength = 22.0;
    const coachWidth = 3.5;
    const coachHeight = 3.6;

    // 3-Coach Modern Metro Train formation
    for (let i = 0; i < 3; i++) {
      const coach = new THREE.Group();
      coach.position.x = (i - 1) * (coachLength + 0.6);

      // Floor & Bogies
      const floor = new THREE.Mesh(new THREE.BoxGeometry(coachLength, 0.4, coachWidth), interiorMat);
      floor.position.y = 0.2;
      floor.receiveShadow = true;
      coach.add(floor);

      // Bogie Wheelsets (Front & Rear of each coach)
      const bogieGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.24, 12);
      [-coachLength * 0.35, coachLength * 0.35].forEach(bx => {
        const bogieL = new THREE.Mesh(bogieGeo, pantographMat);
        bogieL.rotation.x = Math.PI / 2;
        bogieL.position.set(bx, -0.2, coachWidth * 0.4);
        coach.add(bogieL);

        const bogieR = bogieL.clone();
        bogieR.position.z = -coachWidth * 0.4;
        coach.add(bogieR);
      });

      // Main Stainless Steel Body Shell
      const body = new THREE.Mesh(new THREE.BoxGeometry(coachLength, coachHeight * 0.72, coachWidth), stainlessMat);
      body.position.y = coachHeight * 0.36 + 0.4;
      body.castShadow = true;
      coach.add(body);

      // Purple Line Vinyl Stripe along waistline
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(coachLength + 0.06, 0.5, coachWidth + 0.06), purpleMat);
      stripe.position.y = 1.65;
      coach.add(stripe);

      // Passenger Panoramic Windows
      for (let w = -coachLength / 2 + 3.2; w < coachLength / 2 - 2.5; w += 3.8) {
        const winN = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.3, 0.08), glassMat);
        winN.position.set(w, 2.2, coachWidth / 2 + 0.04);
        coach.add(winN);

        const winS = winN.clone();
        winS.position.z = -coachWidth / 2 - 0.04;
        coach.add(winS);
      }

      // Roof & Air Conditioning Unit
      const roof = new THREE.Mesh(new THREE.BoxGeometry(coachLength, 0.35, coachWidth), stainlessMat);
      roof.position.y = coachHeight + 0.18;
      roof.castShadow = true;
      coach.add(roof);

      // Rooftop HVAC Pod
      const hvac = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.45, 2.2), pantographMat);
      hvac.position.set(0, coachHeight + 0.42, 0);
      coach.add(hvac);

      // Rooftop Pantograph on Middle Coach (i === 1)
      if (i === 1) {
        const pantoBase = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.15, 1.8), pantographMat);
        pantoBase.position.set(0, coachHeight + 0.45, 0);
        coach.add(pantoBase);

        const pantoArm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.0, 6), pantographMat);
        pantoArm.rotation.z = Math.PI / 4;
        pantoArm.position.set(0, coachHeight + 1.2, 0);
        coach.add(pantoArm);
      }

      // Aerodynamic Tapered Nose Cone on Lead & Trailing Coaches
      if (i === 2) {
        // Front Lead Coach Nose
        const noseGeo = new THREE.ConeGeometry(coachWidth * 0.52, 3.8, 4);
        const nose = new THREE.Mesh(noseGeo, stainlessMat);
        nose.rotation.z = -Math.PI / 2;
        nose.position.set(coachLength / 2 + 1.9, coachHeight * 0.45, 0);
        coach.add(nose);

        // Windshield Glass
        const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.4, coachWidth * 0.8), glassMat);
        windshield.rotation.z = -Math.PI / 6;
        windshield.position.set(coachLength / 2 + 1.2, coachHeight * 0.65, 0);
        coach.add(windshield);
      } else if (i === 0) {
        // Rear Trailing Coach Nose
        const rearNoseGeo = new THREE.ConeGeometry(coachWidth * 0.52, 3.8, 4);
        const rearNose = new THREE.Mesh(rearNoseGeo, stainlessMat);
        rearNose.rotation.z = Math.PI / 2;
        rearNose.position.set(-coachLength / 2 - 1.9, coachHeight * 0.45, 0);
        coach.add(rearNose);
      }

      group.add(coach);
    }

    // High-Intensity Dual LED Headlights
    const hlMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const hlMeshL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.25, 0.35), hlMat);
    hlMeshL.position.set(35.5, 1.8, 0.9);
    group.add(hlMeshL);

    const hlMeshR = hlMeshL.clone();
    hlMeshR.position.z = -0.9;
    group.add(hlMeshR);

    // Front Light Beam
    this.headlightBeam = new THREE.SpotLight(0xffffff, 3.0, 70, Math.PI / 6, 0.25);
    this.headlightBeam.position.set(36, 1.8, 0);
    this.headlightBeam.target.position.set(70, 0, 0);
    group.add(this.headlightBeam);
    group.add(this.headlightBeam.target);

    return group;
  }

  update(delta, player) {
    const distToStation = Math.abs(this.position.x - this.stationX);

    // State Machine
    if (this.state === 'cruising') {
      this.speed = 20.0;
      this.position.x += this.speed * delta;

      if (this.position.x > -45 && this.position.x < this.stationX) {
        this.state = 'stopping';
      }
    } else if (this.state === 'stopping') {
      // Decelerate smoothly into platform berth
      this.speed = THREE.MathUtils.lerp(this.speed, 0, delta * 2.2);
      this.position.x += this.speed * delta;

      if (distToStation < 0.4 || this.speed < 0.3) {
        this.position.x = this.stationX;
        this.speed = 0;
        this.state = 'docked';
        this.dockTimer = 9.0; // 9 seconds dwell time at station platform
        if (this.audioManager) this.audioManager.playUIBeep(520);
      }
    } else if (this.state === 'docked') {
      this.dockTimer -= delta;
      if (this.dockTimer <= 0) {
        this.state = 'departing';
        if (this.audioManager) this.audioManager.playUIBeep(680);
      }
    } else if (this.state === 'departing') {
      this.speed = THREE.MathUtils.lerp(this.speed, 20.0, delta * 1.5);
      this.position.x += this.speed * delta;

      if (this.position.x > 260) {
        // Loop back to western approach
        this.position.x = -260;
        this.state = 'cruising';
      }
    }

    this.mesh.position.copy(this.position);

    // Dynamic Boarding Detection: If player is standing on the moving carriage deck, carry the player!
    if (player && player.position.y >= 14.5 && player.position.y <= 17.5) {
      const dx = player.position.x - this.position.x;
      const dz = player.position.z - this.position.z;

      if (Math.abs(dx) < 33 && Math.abs(dz) < 2.2) {
        // Player is aboard the moving carriage deck
        player.position.x += this.speed * delta;
        player.mesh.position.copy(player.position);
      }
    }
  }
}
