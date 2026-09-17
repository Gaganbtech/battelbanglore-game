// Professional Third-Person Battle Royale Camera System
// BENGALURU: LAST CITY - Phase 2 Overhaul
import * as THREE from 'three';
import { CAMERA_CONFIG } from '../config/constants.js';

export class ThirdPersonCamera {
  constructor(camera, domElement, gameState) {
    this.camera = camera;
    this.domElement = domElement;
    this.gameState = gameState;

    this.target = new THREE.Vector3();
    this.currentPosition = new THREE.Vector3();
    this.smoothedLookTarget = new THREE.Vector3();

    this.yaw = 0;
    this.pitch = 0.15; // Natural eye-line angle

    // Spring Arm Distance & Offsets
    this.currentDistance = CAMERA_CONFIG.DISTANCE; // Default ~2.8m
    this.targetDistance = CAMERA_CONFIG.DISTANCE;

    this.shoulderOffsetX = CAMERA_CONFIG.SHOULDER_OFFSET_X; // Default 0.55
    this.targetShoulderOffsetX = CAMERA_CONFIG.SHOULDER_OFFSET_X;

    this.cameraHeight = CAMERA_CONFIG.HEIGHT;
    this.targetHeight = CAMERA_CONFIG.HEIGHT;

    this.minPitch = -0.75;
    this.maxPitch = 1.25;

    // Dynamic FOV Transitions
    this.currentFOV = CAMERA_CONFIG.DEFAULT_FOV;
    this.targetFOV = CAMERA_CONFIG.DEFAULT_FOV;

    // Recoil, Sway & Landing Camera Impulses
    this.recoilPitch = 0;
    this.recoilYaw = 0;
    this.shakeIntensity = 0;
    this.shakeDecay = 6.0;
    this.landingImpulse = 0;

    // Raycaster for Triple-Ray Collision Testing
    this.raycaster = new THREE.Raycaster();

    // Shoulder switch on V key
    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'v' && !e.repeat) {
        this.toggleShoulderSide();
      }
    });
  }

  update(delta, targetPosition, mouseDelta, isSprinting = false, isCrouched = false, isAiming = false, isADS = false, sceneColliders = [], busDeck = null) {
    // 1. Mouse Look with Recoil Dampening
    const sensitivity = isADS ? CAMERA_CONFIG.ROTATION_SPEED * 0.55 : CAMERA_CONFIG.ROTATION_SPEED;
    this.yaw -= mouseDelta.x * sensitivity;
    this.pitch += mouseDelta.y * sensitivity;

    // Add recoil kick into pitch & yaw, then damp towards zero
    this.pitch += this.recoilPitch;
    this.yaw += this.recoilYaw;
    this.recoilPitch = THREE.MathUtils.lerp(this.recoilPitch, 0, delta * 15);
    this.recoilYaw = THREE.MathUtils.lerp(this.recoilYaw, 0, delta * 15);

    this.pitch = THREE.MathUtils.clamp(this.pitch, this.minPitch, this.maxPitch);

    // 2. Camera Mode Tuning (Hip Fire vs Shoulder Aim vs ADS vs Sprint vs BMTC Panoramic)
    if (busDeck === 'UPPER_DECK') {
      // Upper Deck Panoramic Vista Mode
      this.targetDistance = 2.1;
      this.targetFOV = 78.0;
      this.targetShoulderOffsetX = 0.22;
      this.targetHeight = 1.35;
    } else if (busDeck === 'LOWER_DECK') {
      // Lower Deck Commuter Mode
      this.targetDistance = 1.85;
      this.targetFOV = 68.0;
      this.targetShoulderOffsetX = 0.25;
      this.targetHeight = 1.25;
    } else if (isADS) {
      // Precision ADS sight-picture
      this.targetDistance = 0.85;
      this.targetFOV = 48.0;
      this.targetShoulderOffsetX = 0.28;
      this.targetHeight = isCrouched ? 1.05 : 1.48;
    } else if (isAiming) {
      // Tight Shoulder Aim
      this.targetDistance = 1.85;
      this.targetFOV = 62.0;
      this.targetShoulderOffsetX = 0.42;
      this.targetHeight = isCrouched ? 1.15 : 1.55;
    } else if (isSprinting) {
      // High-speed Sprint
      this.targetDistance = CAMERA_CONFIG.DISTANCE * 1.12;
      this.targetFOV = CAMERA_CONFIG.SPRINT_FOV;
      this.targetShoulderOffsetX = CAMERA_CONFIG.SHOULDER_OFFSET_X;
      this.targetHeight = CAMERA_CONFIG.HEIGHT;
    } else {
      // Standard Third-Person Exploration
      this.targetDistance = CAMERA_CONFIG.DISTANCE;
      this.targetFOV = this.gameState.fov || CAMERA_CONFIG.DEFAULT_FOV;
      this.targetShoulderOffsetX = CAMERA_CONFIG.SHOULDER_OFFSET_X;
      this.targetHeight = isCrouched ? 1.15 : CAMERA_CONFIG.HEIGHT;
    }

    // Smoothly interpolate distance, FOV, shoulder offset & height
    const zoomSpeed = isADS ? 18 : 10;
    this.currentDistance = THREE.MathUtils.lerp(this.currentDistance, this.targetDistance, delta * zoomSpeed);
    this.currentFOV = THREE.MathUtils.lerp(this.currentFOV, this.targetFOV, delta * zoomSpeed);
    this.shoulderOffsetX = THREE.MathUtils.lerp(this.shoulderOffsetX, this.targetShoulderOffsetX, delta * 12);
    this.cameraHeight = THREE.MathUtils.lerp(this.cameraHeight, this.targetHeight, delta * 10);

    this.camera.fov = this.currentFOV;
    this.camera.updateProjectionMatrix();

    // 3. Dynamic Organic Weapon Sway (Lissajous curves)
    const time = Date.now() * 0.0018;
    const swayX = Math.sin(time) * (isADS ? 0.0015 : 0.004);
    const swayY = Math.cos(time * 2) * (isADS ? 0.0015 : 0.004);

    // 4. Compute Shoulder Target Point
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    const shoulderOffset = right.clone().multiplyScalar(this.shoulderOffsetX);
    
    // Landing dip impulse
    this.landingImpulse = THREE.MathUtils.lerp(this.landingImpulse, 0, delta * 12);

    const desiredLookTarget = targetPosition.clone()
      .add(new THREE.Vector3(0, this.cameraHeight - this.landingImpulse, 0))
      .add(shoulderOffset)
      .add(new THREE.Vector3(swayX, swayY, 0));

    this.smoothedLookTarget.lerp(desiredLookTarget, delta * 20);

    // 5. Spherical Camera Orbit Coordinates
    const horizontalDistance = this.currentDistance * Math.cos(this.pitch);
    const verticalDistance = this.currentDistance * Math.sin(this.pitch);

    const cameraOffsetX = Math.sin(this.yaw) * horizontalDistance;
    const cameraOffsetZ = Math.cos(this.yaw) * horizontalDistance;
    const cameraOffsetY = verticalDistance;

    const idealPosition = this.smoothedLookTarget.clone().add(new THREE.Vector3(cameraOffsetX, cameraOffsetY, cameraOffsetZ));

    // Triple-Ray Collision Test against Obstacles / Walls / Vehicles
    let actualDistance = this.currentDistance;
    if (sceneColliders && sceneColliders.length > 0) {
      const cameraDir = idealPosition.clone().sub(this.smoothedLookTarget).normalize();
      const rightOffset = right.clone().multiplyScalar(0.18);

      const rayOrigins = [
        this.smoothedLookTarget.clone(),
        this.smoothedLookTarget.clone().add(rightOffset),
        this.smoothedLookTarget.clone().sub(rightOffset)
      ];

      for (const origin of rayOrigins) {
        this.raycaster.set(origin, cameraDir);
        this.raycaster.far = this.currentDistance;
        const hits = this.raycaster.intersectObjects(sceneColliders, false);
        if (hits.length > 0 && hits[0].distance < actualDistance) {
          actualDistance = Math.max(0.5, hits[0].distance - 0.22);
        }
      }
    }

    if (actualDistance < this.currentDistance) {
      const cameraDir = idealPosition.clone().sub(this.smoothedLookTarget).normalize();
      idealPosition.copy(this.smoothedLookTarget).addScaledVector(cameraDir, actualDistance);
    }

    // Ground & Obstacle Collision Cushion
    const minHeightAboveGround = (targetPosition.y > 10.0) ? 14.5 : (targetPosition.y > 2.0 ? targetPosition.y - 0.2 : 0.5);
    if (idealPosition.y < minHeightAboveGround) {
      idealPosition.y = minHeightAboveGround;
    }

    // Dampening to eliminate abrupt snaps
    this.currentPosition.lerp(idealPosition, delta * 18);

    // Camera micro-shake (footsteps, gunfire recoil, explosions)
    if (this.shakeIntensity > 0.0005) {
      this.currentPosition.x += (Math.random() - 0.5) * this.shakeIntensity;
      this.currentPosition.y += (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeIntensity = Math.max(0, this.shakeIntensity - this.shakeDecay * delta);
    }

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.smoothedLookTarget);
  }

  addRecoilImpulse(pitchKick = 0.022, yawKick = 0.008) {
    this.recoilPitch += pitchKick;
    this.recoilYaw += (Math.random() - 0.5) * yawKick;
    this.triggerShake(0.04);
  }

  triggerLandingImpulse(force = 0.12) {
    this.landingImpulse = force;
    this.triggerShake(0.06);
  }

  triggerShake(intensity = 0.15) {
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
  }

  toggleShoulderSide() {
    this.shoulderOffsetX = -this.shoulderOffsetX;
    this.targetShoulderOffsetX = -this.targetShoulderOffsetX;
  }

  getYaw() {
    return this.yaw;
  }

  getPitch() {
    return this.pitch;
  }

  getCompassBearing() {
    return Math.round(((-this.yaw * 180 / Math.PI) % 360 + 360) % 360);
  }
}
