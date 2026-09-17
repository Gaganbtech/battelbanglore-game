// Third-person playable protagonist character
import * as THREE from 'three';
import { PLAYER_CONFIG } from '../config/constants.js';

export class PlayerCharacter {
  constructor(scene, gameState, audioManager) {
    this.scene = scene;
    this.gameState = gameState;
    this.audioManager = audioManager;

    this.position = new THREE.Vector3(0, 1.0, 10);
    this.velocity = new THREE.Vector3();
    this.rotation = new THREE.Euler(0, 0, 0, 'YXZ');
    this.facingAngle = 0;

    this.isGrounded = true;
    this.isCrouched = false;
    this.isSprinting = false;
    this.isMoving = false;

    this.walkCycle = 0;
    this.footstepTimer = 0;

    this.mesh = this.buildCharacterMesh();
    this.scene.add(this.mesh);
  }

  buildCharacterMesh() {
    const group = new THREE.Group();

    // Stylized Young Modern Protagonist (Bengaluru aesthetic)
    // Dark jacket, tactical denims, backpack, sneakers
    const skinMat = new THREE.MeshStandardMaterial({ color: 0x9c684b, roughness: 0.8 });
    const jacketMat = new THREE.MeshStandardMaterial({ color: 0x1a2634, roughness: 0.5 }); // Dark navy tech jacket
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x242830, roughness: 0.7 }); // Charcoal jeans
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0xdfdfdf, roughness: 0.3 }); // White high-tops
    const backpackMat = new THREE.MeshStandardMaterial({ color: 0xff9800, roughness: 0.6 }); // Amber tactical pack

    // Torso / Jacket
    const torsoGeo = new THREE.BoxGeometry(0.55, 0.75, 0.32);
    this.torso = new THREE.Mesh(torsoGeo, jacketMat);
    this.torso.position.y = 1.15;
    this.torso.castShadow = true;
    group.add(this.torso);

    // Backpack
    const packGeo = new THREE.BoxGeometry(0.42, 0.48, 0.18);
    const pack = new THREE.Mesh(packGeo, backpackMat);
    pack.position.set(0, 0.05, -0.22);
    pack.castShadow = true;
    this.torso.add(pack);

    // Head
    const headGeo = new THREE.BoxGeometry(0.3, 0.35, 0.32);
    this.head = new THREE.Mesh(headGeo, skinMat);
    this.head.position.y = 0.55;
    this.head.castShadow = true;
    this.torso.add(this.head);

    // Hair
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    const hairGeo = new THREE.BoxGeometry(0.32, 0.14, 0.34);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 0.15, -0.02);
    this.head.add(hair);

    // Left Arm
    const armGeo = new THREE.BoxGeometry(0.16, 0.65, 0.16);
    this.leftArm = new THREE.Mesh(armGeo, jacketMat);
    this.leftArm.position.set(-0.36, 0.0, 0);
    this.leftArm.castShadow = true;
    this.torso.add(this.leftArm);

    // Right Arm
    this.rightArm = new THREE.Mesh(armGeo, jacketMat);
    this.rightArm.position.set(0.36, 0.0, 0);
    this.rightArm.castShadow = true;
    this.torso.add(this.rightArm);

    // Pelvis
    const pelvisGeo = new THREE.BoxGeometry(0.5, 0.25, 0.28);
    this.pelvis = new THREE.Mesh(pelvisGeo, pantsMat);
    this.pelvis.position.y = 0.72;
    this.pelvis.castShadow = true;
    group.add(this.pelvis);

    // Left Leg
    const legGeo = new THREE.BoxGeometry(0.2, 0.7, 0.2);
    this.leftLeg = new THREE.Mesh(legGeo, pantsMat);
    this.leftLeg.position.set(-0.16, -0.38, 0);
    this.leftLeg.castShadow = true;
    this.pelvis.add(this.leftLeg);

    // Left Shoe
    const shoeGeo = new THREE.BoxGeometry(0.22, 0.14, 0.32);
    const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
    leftShoe.position.set(0, -0.38, 0.05);
    this.leftLeg.add(leftShoe);

    // Right Leg
    this.rightLeg = new THREE.Mesh(legGeo, pantsMat);
    this.rightLeg.position.set(0.16, -0.38, 0);
    this.rightLeg.castShadow = true;
    this.pelvis.add(this.rightLeg);

    // Right Shoe
    const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
    rightShoe.position.set(0, -0.38, 0.05);
    this.rightLeg.add(rightShoe);

    group.position.copy(this.position);
    return group;
  }

  update(delta, inputKeys, cameraYaw, colliders = []) {
    if (this.gameState.isInVehicle) {
      this.mesh.visible = false;
      return;
    }
    this.mesh.visible = true;

    // Crouch handling
    this.isCrouched = inputKeys.crouch;
    const targetScaleY = this.isCrouched ? 0.65 : 1.0;
    this.mesh.scale.y = THREE.MathUtils.lerp(this.mesh.scale.y, targetScaleY, delta * 12);

    // Stamina & Sprint logic
    const wantsSprint = inputKeys.sprint && !this.isCrouched && this.gameState.stamina > 5;
    if (wantsSprint && this.isMoving) {
      this.isSprinting = true;
      this.gameState.stamina = Math.max(0, this.gameState.stamina - PLAYER_CONFIG.STAMINA_DRAIN_SPRINT * delta);
    } else {
      this.isSprinting = false;
      this.gameState.stamina = Math.min(PLAYER_CONFIG.MAX_STAMINA, this.gameState.stamina + PLAYER_CONFIG.STAMINA_RECOVERY * delta);
    }

    // Determine target speed
    let moveSpeed = PLAYER_CONFIG.RUN_SPEED;
    if (this.isCrouched) moveSpeed = PLAYER_CONFIG.CROUCH_SPEED;
    else if (this.isSprinting) moveSpeed = PLAYER_CONFIG.SPRINT_SPEED;
    else if (!inputKeys.sprint) moveSpeed = PLAYER_CONFIG.RUN_SPEED;

    // Movement direction from inputs relative to camera yaw
    const moveX = (inputKeys.right ? 1 : 0) - (inputKeys.left ? 1 : 0);
    const moveZ = (inputKeys.backward ? 1 : 0) - (inputKeys.forward ? 1 : 0);

    const inputDir = new THREE.Vector3(moveX, 0, moveZ);
    if (inputDir.lengthSq() > 0.001) {
      inputDir.normalize();
      this.isMoving = true;

      // Rotate by camera yaw
      inputDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraYaw);

      // Smooth acceleration
      this.velocity.x = THREE.MathUtils.lerp(this.velocity.x, inputDir.x * moveSpeed, delta * 14);
      this.velocity.z = THREE.MathUtils.lerp(this.velocity.z, inputDir.z * moveSpeed, delta * 14);

      // Orient mesh towards movement direction
      const targetAngle = Math.atan2(this.velocity.x, this.velocity.z);
      // Smooth shortest rotation
      let diff = targetAngle - this.facingAngle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.facingAngle += diff * delta * 12;
      this.mesh.rotation.y = this.facingAngle;

      // Animate walk cycle
      const cycleSpeed = this.isSprinting ? 18 : (this.isCrouched ? 8 : 12);
      this.walkCycle += delta * cycleSpeed;
      this.animateLocomotion();

      // Footstep audio
      this.footstepTimer += delta * (this.isSprinting ? 2.4 : 1.6);
      if (this.footstepTimer >= 1.0) {
        this.footstepTimer = 0;
        this.audioManager.playFootstep();
      }
    } else {
      this.isMoving = false;
      this.velocity.x = THREE.MathUtils.lerp(this.velocity.x, 0, delta * 16);
      this.velocity.z = THREE.MathUtils.lerp(this.velocity.z, 0, delta * 16);
      this.resetLocomotionPose(delta);
    }

    // Jump & Gravity
    if (inputKeys.jump && this.isGrounded && !this.isCrouched) {
      this.velocity.y = PLAYER_CONFIG.JUMP_VELOCITY;
      this.isGrounded = false;
      this.audioManager.playFootstep();
    }

    if (!this.isGrounded) {
      this.velocity.y -= PLAYER_CONFIG.GRAVITY * delta;
    }

    // Apply movement
    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
    this.position.z += this.velocity.z * delta;

    // Check ground elevation (elevated metro station platform height or ground level)
    let groundHeight = 0.0;
    // Check if on elevated metro platform: x between -40 and 40, z between -35 and -5
    if (Math.abs(this.position.x) < 45 && this.position.z > -36 && this.position.z < -4) {
      // Platform surface is at height 14.0 or stairs ramp
      groundHeight = 14.0;
    } else if (this.position.y > 10.0 && this.position.z > -50 && this.position.z < -2) {
      groundHeight = 14.0;
    }

    if (this.position.y <= groundHeight) {
      this.position.y = groundHeight;
      this.velocity.y = 0;
      this.isGrounded = true;
    }

    // Clamp inside world boundaries
    const maxBound = 290;
    this.position.x = THREE.MathUtils.clamp(this.position.x, -maxBound, maxBound);
    this.position.z = THREE.MathUtils.clamp(this.position.z, -maxBound, maxBound);

    this.mesh.position.copy(this.position);
  }

  animateLocomotion() {
    const swingAngle = Math.sin(this.walkCycle) * (this.isSprinting ? 0.75 : 0.45);
    
    // Legs swing opposite to each other
    this.leftLeg.rotation.x = swingAngle;
    this.rightLeg.rotation.x = -swingAngle;

    // Arms swing opposite to legs
    this.leftArm.rotation.x = -swingAngle * 0.9;
    this.rightArm.rotation.x = swingAngle * 0.9;

    // Slight vertical bounce
    this.torso.position.y = 1.15 + Math.abs(Math.sin(this.walkCycle * 2)) * 0.04;
  }

  resetLocomotionPose(delta) {
    this.leftLeg.rotation.x = THREE.MathUtils.lerp(this.leftLeg.rotation.x, 0, delta * 10);
    this.rightLeg.rotation.x = THREE.MathUtils.lerp(this.rightLeg.rotation.x, 0, delta * 10);
    this.leftArm.rotation.x = THREE.MathUtils.lerp(this.leftArm.rotation.x, 0, delta * 10);
    this.rightArm.rotation.x = THREE.MathUtils.lerp(this.rightArm.rotation.x, 0, delta * 10);
    this.torso.position.y = THREE.MathUtils.lerp(this.torso.position.y, 1.15, delta * 10);
  }

  teleport(x, y, z) {
    this.position.set(x, y, z);
    this.velocity.set(0, 0, 0);
    this.mesh.position.copy(this.position);
  }
}
