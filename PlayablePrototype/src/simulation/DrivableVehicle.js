// Interactive Drivable Auto-Rickshaw & Car with vehicle physics, steering, and camera attachment
import * as THREE from 'three';

export class DrivableVehicle {
  constructor(scene, type = 'auto', initialPosition = new THREE.Vector3(8, 0, 15)) {
    this.scene = scene;
    this.type = type;
    this.position = initialPosition.clone();
    this.yaw = 0;
    this.speed = 0;
    this.maxForwardSpeed = (type === 'auto') ? 22.0 : 35.0;
    this.maxReverseSpeed = -8.0;
    this.acceleration = 12.0;
    this.brakingDecel = 18.0;
    this.steerSpeed = 1.8;
    this.friction = 4.5;

    this.isOccupied = false;
    this.mesh = this.buildVehicleMesh();
    this.mesh.position.copy(this.position);
    this.scene.add(this.mesh);
  }

  buildVehicleMesh() {
    const group = new THREE.Group();

    if (this.type === 'auto') {
      // Distinctive Player Drivable Auto-Rickshaw (Bengaluru Signature Green & Yellow)
      const greenMat = new THREE.MeshStandardMaterial({ color: 0x00897b, roughness: 0.4 });
      const yellowMat = new THREE.MeshStandardMaterial({ color: 0xffd600, roughness: 0.3 });
      const blackMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8 });
      const chromeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9, roughness: 0.1 });

      const body = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.2, 1.8), greenMat);
      body.position.y = 0.7;
      body.castShadow = true;
      group.add(body);

      const hood = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.0, 1.75), yellowMat);
      hood.position.set(-0.35, 1.7, 0);
      hood.castShadow = true;
      group.add(hood);

      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 8), chromeMat);
      handle.rotation.z = Math.PI / 2;
      handle.position.set(0.9, 1.3, 0);
      group.add(handle);

      // Wheels
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
      const frontW = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.22, 12), wheelMat);
      frontW.rotation.x = Math.PI / 2;
      frontW.position.set(1.3, 0.38, 0);
      group.add(frontW);

      const rearWL = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.22, 12), wheelMat);
      rearWL.rotation.x = Math.PI / 2;
      rearWL.position.set(-1.1, 0.38, 0.9);
      group.add(rearWL);

      const rearWR = rearWL.clone();
      rearWR.position.z = -0.9;
      group.add(rearWR);

      // Headlight
      const hlMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffea00, emissiveIntensity: 0.6 });
      const hl = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), hlMat);
      hl.position.set(1.75, 0.8, 0);
      group.add(hl);

      // Tail Brake Lights
      this.brakeLightMat = new THREE.MeshStandardMaterial({ color: 0xff1744, emissive: 0xff1744, emissiveIntensity: 0.2 });
      const brakeL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.3), this.brakeLightMat);
      brakeL.position.set(-1.72, 0.8, 0.7);
      group.add(brakeL);

      const brakeR = brakeL.clone();
      brakeR.position.z = -0.7;
      group.add(brakeR);
    }

    return group;
  }

  update(delta, inputKeys, audioManager) {
    if (!this.isOccupied) return;

    // Acceleration & Braking
    const isAccelerating = inputKeys.forward;
    const isReversing = inputKeys.backward;
    const isHandbrake = inputKeys.jump;

    if (isAccelerating) {
      this.speed = Math.min(this.maxForwardSpeed, this.speed + this.acceleration * delta);
      if (this.brakeLightMat) this.brakeLightMat.emissiveIntensity = 0.2;
    } else if (isReversing) {
      if (this.speed > 0.5) {
        // Active braking
        this.speed = Math.max(0, this.speed - this.brakingDecel * delta);
        if (this.brakeLightMat) this.brakeLightMat.emissiveIntensity = 1.8;
      } else {
        // Reverse
        this.speed = Math.max(this.maxReverseSpeed, this.speed - this.acceleration * 0.7 * delta);
        if (this.brakeLightMat) this.brakeLightMat.emissiveIntensity = 0.2;
      }
    } else {
      // Natural friction deceleration
      if (this.speed > 0) {
        this.speed = Math.max(0, this.speed - this.friction * delta);
      } else if (this.speed < 0) {
        this.speed = Math.min(0, this.speed + this.friction * delta);
      }
      if (this.brakeLightMat) this.brakeLightMat.emissiveIntensity = 0.2;
    }

    if (isHandbrake) {
      this.speed = THREE.MathUtils.lerp(this.speed, 0, delta * 8);
      if (this.brakeLightMat) this.brakeLightMat.emissiveIntensity = 2.0;
    }

    // Steering
    if (Math.abs(this.speed) > 0.1) {
      const steerDir = (inputKeys.left ? 1 : 0) - (inputKeys.right ? 1 : 0);
      const speedFactor = (this.speed >= 0) ? 1 : -1;
      this.yaw += steerDir * this.steerSpeed * delta * speedFactor;
    }

    // Move forward in local facing direction
    const forwardX = Math.cos(this.yaw);
    const forwardZ = -Math.sin(this.yaw);

    this.position.x += forwardX * this.speed * delta;
    this.position.z += forwardZ * this.speed * delta;

    this.mesh.position.copy(this.position);
    this.mesh.rotation.y = this.yaw;

    // Engine sound feedback
    if (audioManager) {
      const speedNormalized = Math.abs(this.speed) / this.maxForwardSpeed;
      audioManager.playVehicleEngine(speedNormalized);
    }
  }

  getInteractionDistance(playerPos) {
    return this.position.distanceTo(playerPos);
  }
}
