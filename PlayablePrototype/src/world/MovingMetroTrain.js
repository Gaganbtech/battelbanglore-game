// Active Automated Namma Metro Train: station docking, passenger boarding, and elevated rail travel
import * as THREE from 'three';

export class MovingMetroTrain {
  constructor(scene, audioManager) {
    this.scene = scene;
    this.audioManager = audioManager;

    this.position = new THREE.Vector3(-120, 15.6, -18.2);
    this.speed = 18.0;
    this.stationX = 0;
    this.state = 'cruising'; // 'cruising', 'stopping', 'docked', 'departing'
    this.dockTimer = 0;

    this.mesh = this.buildTrainMesh();
    this.mesh.position.copy(this.position);
    this.scene.add(this.mesh);
  }

  buildTrainMesh() {
    const group = new THREE.Group();

    const silverMat = new THREE.MeshStandardMaterial({ color: 0xd9e2ec, metalness: 0.8, roughness: 0.2 });
    const purpleMat = new THREE.MeshStandardMaterial({ color: 0x7b1fa2, roughness: 0.4 }); // Signature Purple Line
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x1a232f, roughness: 0.1 });
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.7 });

    const coachLength = 22.0;
    const coachWidth = 3.4;
    const coachHeight = 3.6;

    // 3-Coach Modern Metro Train with open interior deck for player boarding
    for (let i = 0; i < 3; i++) {
      const coach = new THREE.Group();
      coach.position.x = (i - 1) * (coachLength + 0.5);

      // Floor
      const floor = new THREE.Mesh(new THREE.BoxGeometry(coachLength, 0.4, coachWidth), floorMat);
      floor.position.y = 0.2;
      floor.receiveShadow = true;
      coach.add(floor);

      // Exterior Shell
      const body = new THREE.Mesh(new THREE.BoxGeometry(coachLength, coachHeight * 0.7, coachWidth), silverMat);
      body.position.y = coachHeight * 0.35 + 0.4;
      body.castShadow = true;
      coach.add(body);

      // Purple Line Livery Stripe
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(coachLength + 0.05, 0.45, coachWidth + 0.05), purpleMat);
      stripe.position.y = 1.6;
      coach.add(stripe);

      // Panoramic Windows
      for (let w = -coachLength / 2 + 3; w < coachLength / 2 - 2; w += 3.5) {
        const win = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.2, 0.1), glassMat);
        win.position.set(w, 2.2, coachWidth / 2 + 0.03);
        coach.add(win);
      }

      // Roof
      const roof = new THREE.Mesh(new THREE.BoxGeometry(coachLength, 0.4, coachWidth), silverMat);
      roof.position.y = coachHeight + 0.2;
      roof.castShadow = true;
      coach.add(roof);

      group.add(coach);
    }

    // Front Headlight Beam
    const trainBeam = new THREE.SpotLight(0xffffff, 2.5, 60, Math.PI / 6, 0.3);
    trainBeam.position.set(34, 2.0, 0);
    trainBeam.target.position.set(60, 0, 0);
    group.add(trainBeam);
    group.add(trainBeam.target);

    return group;
  }

  update(delta, player) {
    const distToStation = Math.abs(this.position.x - this.stationX);

    // State Machine
    if (this.state === 'cruising') {
      this.speed = 18.0;
      this.position.x += this.speed * delta;

      if (this.position.x > -40 && this.position.x < this.stationX) {
        this.state = 'stopping';
      }
    } else if (this.state === 'stopping') {
      // Smooth deceleration into MG Road Central platform
      this.speed = THREE.MathUtils.lerp(this.speed, 0, delta * 2.0);
      this.position.x += this.speed * delta;

      if (distToStation < 0.5 || this.speed < 0.4) {
        this.position.x = this.stationX;
        this.speed = 0;
        this.state = 'docked';
        this.dockTimer = 8.0; // 8 seconds at platform
        this.audioManager.playUIBeep(580);
      }
    } else if (this.state === 'docked') {
      this.dockTimer -= delta;
      if (this.dockTimer <= 0) {
        this.state = 'departing';
        this.audioManager.playUIBeep(740);
      }
    } else if (this.state === 'departing') {
      this.speed = THREE.MathUtils.lerp(this.speed, 22.0, delta * 1.5);
      this.position.x += this.speed * delta;

      if (this.position.x > 260) {
        // Loop back to start of viaduct
        this.position.x = -260;
        this.state = 'cruising';
      }
    }

    this.mesh.position.copy(this.position);

    // If player is standing inside or on top of the train carriage, carry player with train velocity
    if (player && player.position.y > 14.5 && Math.abs(player.position.z - this.position.z) < 2.5) {
      if (Math.abs(player.position.x - this.position.x) < 32.0) {
        player.position.x += this.speed * delta;
        player.mesh.position.copy(player.position);
      }
    }
  }
}
