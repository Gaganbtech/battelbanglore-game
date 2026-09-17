// Professional Third-person camera with shoulder offset, occlusion avoidance, and FOV kick
import * as THREE from 'three';
import { CAMERA_CONFIG } from '../config/constants.js';

export class ThirdPersonCamera {
  constructor(camera, domElement, gameState) {
    this.camera = camera;
    this.domElement = domElement;
    this.gameState = gameState;

    this.target = new THREE.Vector3();
    this.currentPosition = new THREE.Vector3();

    this.yaw = 0;
    this.pitch = 0.2; // slight downward angle

    this.currentDistance = CAMERA_CONFIG.DISTANCE;
    this.targetDistance = CAMERA_CONFIG.DISTANCE;

    this.shoulderOffsetX = CAMERA_CONFIG.SHOULDER_OFFSET_X;
    this.targetShoulderOffsetX = CAMERA_CONFIG.SHOULDER_OFFSET_X;

    this.minPitch = -0.55;
    this.maxPitch = 1.15;

    this.currentFOV = CAMERA_CONFIG.DEFAULT_FOV;
    this.targetFOV = CAMERA_CONFIG.DEFAULT_FOV;

    this.shakeIntensity = 0;
    this.shakeDecay = 4.0;
  }

  update(delta, targetPosition, mouseDelta, isSprinting = false, sceneColliders = []) {
    // Process mouse rotation
    this.yaw -= mouseDelta.x * CAMERA_CONFIG.ROTATION_SPEED;
    this.pitch += mouseDelta.y * CAMERA_CONFIG.ROTATION_SPEED;
    this.pitch = THREE.MathUtils.clamp(this.pitch, this.minPitch, this.maxPitch);

    // FOV adjustment for sprint
    this.targetFOV = isSprinting ? CAMERA_CONFIG.SPRINT_FOV : this.gameState.fov;
    this.currentFOV = THREE.MathUtils.lerp(this.currentFOV, this.targetFOV, delta * 8);
    this.camera.fov = this.currentFOV;
    this.camera.updateProjectionMatrix();

    // Calculate shoulder target point (above player head slightly offset to the right)
    const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));

    const shoulderOffset = right.clone().multiplyScalar(this.shoulderOffsetX);
    const lookTarget = targetPosition.clone().add(new THREE.Vector3(0, CAMERA_CONFIG.HEIGHT, 0)).add(shoulderOffset);

    // Calculate ideal camera position based on yaw, pitch, and distance
    const horizontalDistance = this.currentDistance * Math.cos(this.pitch);
    const verticalDistance = this.currentDistance * Math.sin(this.pitch);

    const cameraOffsetX = Math.sin(this.yaw) * horizontalDistance;
    const cameraOffsetZ = Math.cos(this.yaw) * horizontalDistance;
    const cameraOffsetY = verticalDistance;

    const idealPosition = lookTarget.clone().add(new THREE.Vector3(cameraOffsetX, cameraOffsetY, cameraOffsetZ));

    // Collision avoidance: ensure camera doesn't dip below ground
    if (idealPosition.y < 0.6) {
      idealPosition.y = 0.6;
    }

    // Smooth dampening towards ideal position
    this.currentPosition.lerp(idealPosition, delta * 15);

    // Camera shake (e.g. footsteps or vehicle engine)
    if (this.shakeIntensity > 0.001) {
      this.currentPosition.x += (Math.random() - 0.5) * this.shakeIntensity;
      this.currentPosition.y += (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeIntensity = Math.max(0, this.shakeIntensity - this.shakeDecay * delta);
    }

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(lookTarget);
  }

  triggerShake(intensity = 0.15) {
    this.shakeIntensity = intensity;
  }

  toggleShoulderSide() {
    this.shoulderOffsetX = -this.shoulderOffsetX;
  }

  getYaw() {
    return this.yaw;
  }

  getCompassBearing() {
    // 0 to 360 degrees
    let deg = Math.round(((-this.yaw * 180 / Math.PI) % 360 + 360) % 360);
    return deg;
  }
}
