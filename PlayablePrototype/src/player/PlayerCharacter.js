// Realistic Humanoid Character Model & Locomotion Animation System
// BENGALURU: LAST CITY - Phase 2 Overhaul
import * as THREE from 'three';
import { PLAYER_CONFIG } from '../config/constants.js';

export class PlayerCharacter {
  constructor(scene, gameState, audioManager) {
    this.scene = scene;
    this.gameState = gameState;
    this.audioManager = audioManager;

    this.position = new THREE.Vector3(0, 0.0, 10);
    this.velocity = new THREE.Vector3();
    this.facingAngle = 0;
    this.aimPitch = 0;

    // Locomotion States
    this.isGrounded = true;
    this.isCrouched = false;
    this.isSprinting = false;
    this.isMoving = false;
    this.isAiming = false;
    this.isDowned = false; // Downed / Knocked state architecture

    // Animation Timers & Blend Weights
    this.walkCycle = 0;
    this.footstepTimer = 0;
    this.crouchBlend = 0; // 0 = standing, 1 = crouched
    this.sprintBlend = 0; // 0 = walk/jog, 1 = full sprint
    this.landCompression = 0; // Impact absorption depth
    this.airTime = 0;
    this.fallVelocity = 0;
    this.hitReaction = 0; // Damage flinch impulse

    // Build the anatomical character mesh & animation rig
    this.mesh = this.buildCharacterMesh();
    this.scene.add(this.mesh);
  }

  buildCharacterMesh() {
    const root = new THREE.Group();

    // High-quality PBR Materials with realistic roughness & specular response
    this.skinMat = new THREE.MeshStandardMaterial({
      color: 0x9b6748, // Warm South Asian complexion
      roughness: 0.65,
      metalness: 0.05
    });

    this.tacticalVestMat = new THREE.MeshStandardMaterial({
      color: 0x1e242b, // Matte ballistic nylon
      roughness: 0.75,
      metalness: 0.1
    });

    this.shirtMat = new THREE.MeshStandardMaterial({
      color: 0x2a3545, // Navy tactical moisture-wicking combat shirt
      roughness: 0.7,
      metalness: 0.05
    });

    this.pantsMat = new THREE.MeshStandardMaterial({
      color: 0x242830, // Charcoal reinforced ripstop cargo pants
      roughness: 0.8,
      metalness: 0.05
    });

    this.gearLeatherMat = new THREE.MeshStandardMaterial({
      color: 0x1a1614, // Dark brown combat leather
      roughness: 0.5,
      metalness: 0.15
    });

    this.bootMat = new THREE.MeshStandardMaterial({
      color: 0x151618, // Matte black tactical combat boots
      roughness: 0.55,
      metalness: 0.2
    });

    this.backpackMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Amber tactical assault pack (Bengaluru accent)
      roughness: 0.65,
      metalness: 0.1
    });

    this.metalHardwareMat = new THREE.MeshStandardMaterial({
      color: 0x71717a, // Gunmetal clips and buckles
      roughness: 0.3,
      metalness: 0.85
    });

    this.gloveMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937, // Hard-knuckle tactical gloves
      roughness: 0.5,
      metalness: 0.2
    });

    // ==========================================
    // 1. PELVIS & ROOT ROOT BONE
    // ==========================================
    this.pelvis = new THREE.Group();
    this.pelvis.position.y = 0.92; // Natural human hip height
    root.add(this.pelvis);

    // Anatomical Pelvic Basin Mesh
    const pelvisGeo = new THREE.CylinderGeometry(0.18, 0.16, 0.22, 12);
    const pelvisMesh = new THREE.Mesh(pelvisGeo, this.pantsMat);
    pelvisMesh.castShadow = true;
    this.pelvis.add(pelvisMesh);

    // Tactical Duty Belt with Holster Strap
    const beltGeo = new THREE.CylinderGeometry(0.20, 0.20, 0.08, 14);
    const belt = new THREE.Mesh(beltGeo, this.gearLeatherMat);
    belt.position.y = 0.1;
    this.pelvis.add(belt);

    // Belt buckle
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.03), this.metalHardwareMat);
    buckle.position.set(0, 0.1, 0.2);
    this.pelvis.add(buckle);

    // Side utility pouches
    const pouchGeo = new THREE.BoxGeometry(0.08, 0.11, 0.06);
    const pouchL = new THREE.Mesh(pouchGeo, this.tacticalVestMat);
    pouchL.position.set(-0.21, 0.06, 0.04);
    this.pelvis.add(pouchL);

    const pouchR = new THREE.Mesh(pouchGeo, this.tacticalVestMat);
    pouchR.position.set(0.21, 0.06, 0.04);
    this.pelvis.add(pouchR);

    // ==========================================
    // 2. SPINE & TORSO (UPPER BODY)
    // ==========================================
    this.spine = new THREE.Group();
    this.spine.position.y = 0.14;
    this.pelvis.add(this.spine);

    // Lower abdomen / spine
    const abdomenGeo = new THREE.CylinderGeometry(0.19, 0.18, 0.24, 12);
    const abdomen = new THREE.Mesh(abdomenGeo, this.shirtMat);
    abdomen.position.y = 0.12;
    abdomen.castShadow = true;
    this.spine.add(abdomen);

    // Chest & Thorax
    this.chest = new THREE.Group();
    this.chest.position.y = 0.26;
    this.spine.add(this.chest);

    const chestGeo = new THREE.BoxGeometry(0.44, 0.36, 0.28);
    const chestMesh = new THREE.Mesh(chestGeo, this.shirtMat);
    chestMesh.position.y = 0.18;
    chestMesh.castShadow = true;
    this.chest.add(chestMesh);

    // Tactical Plate Carrier Vest (Front & Back armor plates)
    const vestFrontGeo = new THREE.BoxGeometry(0.38, 0.34, 0.12);
    const vestFront = new THREE.Mesh(vestFrontGeo, this.tacticalVestMat);
    vestFront.position.set(0, 0.18, 0.12);
    vestFront.castShadow = true;
    this.chest.add(vestFront);

    // MOLLE Webbing Strips across chest
    for (let row = -0.08; row <= 0.08; row += 0.05) {
      const molle = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.016, 0.015), this.gearLeatherMat);
      molle.position.set(0, 0.18 + row, 0.185);
      this.chest.add(molle);
    }

    // Triple Magazine Pouch on chest vest
    for (let mag = -0.09; mag <= 0.09; mag += 0.09) {
      const magPouch = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.14, 0.05), this.gearLeatherMat);
      magPouch.position.set(mag, 0.14, 0.19);
      this.chest.add(magPouch);
    }

    // Comms Radio on left shoulder
    const radio = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.05), this.metalHardwareMat);
    radio.position.set(-0.16, 0.32, 0.12);
    this.chest.add(radio);

    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.18, 6), this.metalHardwareMat);
    antenna.position.set(-0.16, 0.44, 0.12);
    this.chest.add(antenna);

    // Tactical Assault Backpack on back
    this.backpack = new THREE.Group();
    this.backpack.position.set(0, 0.18, -0.18);
    const packMain = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.42, 0.18), this.backpackMat);
    packMain.castShadow = true;
    this.backpack.add(packMain);

    // Backpack lower pouch
    const packLower = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.15, 0.10), this.backpackMat);
    packLower.position.set(0, -0.12, -0.10);
    this.backpack.add(packLower);
    this.chest.add(this.backpack);

    // ==========================================
    // 3. NECK & HEAD (HUMAN PROPORTIONS)
    // ==========================================
    this.neck = new THREE.Group();
    this.neck.position.y = 0.36;
    this.chest.add(this.neck);

    const neckGeo = new THREE.CylinderGeometry(0.075, 0.085, 0.14, 10);
    const neckMesh = new THREE.Mesh(neckGeo, this.skinMat);
    neckMesh.position.y = 0.07;
    neckMesh.castShadow = true;
    this.neck.add(neckMesh);

    // Head Group
    this.head = new THREE.Group();
    this.head.position.y = 0.14;
    this.neck.add(this.head);

    // Sculpted Cranium & Face
    const craniumGeo = new THREE.SphereGeometry(0.13, 16, 14);
    craniumGeo.scale(0.9, 1.15, 1.05);
    const cranium = new THREE.Mesh(craniumGeo, this.skinMat);
    cranium.position.set(0, 0.12, 0);
    cranium.castShadow = true;
    this.head.add(cranium);

    // Sculpted Jaw & Chin definition
    const jawGeo = new THREE.ConeGeometry(0.09, 0.14, 6);
    jawGeo.scale(1.2, 1.0, 1.0);
    const jaw = new THREE.Mesh(jawGeo, this.skinMat);
    jaw.rotation.x = Math.PI;
    jaw.position.set(0, 0.02, 0.04);
    this.head.add(jaw);

    // Nose Bridge
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.06, 4), this.skinMat);
    nose.rotation.x = -Math.PI / 6;
    nose.position.set(0, 0.11, 0.14);
    this.head.add(nose);

    // Ears
    const earGeo = new THREE.BoxGeometry(0.02, 0.05, 0.03);
    const earL = new THREE.Mesh(earGeo, this.skinMat);
    earL.position.set(-0.12, 0.11, 0.0);
    this.head.add(earL);

    const earR = earL.clone();
    earR.position.x = 0.12;
    this.head.add(earR);

    // Modern Styled Hair / Undercut
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x12100e, roughness: 0.9 });
    const hairTop = new THREE.Mesh(new THREE.SphereGeometry(0.135, 12, 10), hairMat);
    hairTop.scale.set(0.92, 0.95, 1.08);
    hairTop.position.set(0, 0.16, -0.01);
    this.head.add(hairTop);

    // Tactical Headset with microphone
    const headsetBand = new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.015, 8, 16, Math.PI), this.tacticalVestMat);
    headsetBand.rotation.z = Math.PI / 2;
    headsetBand.rotation.y = Math.PI / 2;
    headsetBand.position.set(0, 0.18, 0);
    this.head.add(headsetBand);

    const earCupL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 10), this.tacticalVestMat);
    earCupL.rotation.z = Math.PI / 2;
    earCupL.position.set(-0.135, 0.11, 0);
    this.head.add(earCupL);

    const earCupR = earCupL.clone();
    earCupR.position.x = 0.135;
    this.head.add(earCupR);

    const micBoom = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.12, 6), this.metalHardwareMat);
    micBoom.rotation.x = Math.PI / 3;
    micBoom.position.set(-0.12, 0.06, 0.08);
    this.head.add(micBoom);

    // ==========================================
    // 4. ARMS & TWO-HANDED WEAPON GRIP
    // ==========================================
    // Right Shoulder Joint
    this.rightShoulder = new THREE.Group();
    this.rightShoulder.position.set(0.24, 0.30, 0.02);
    this.chest.add(this.rightShoulder);

    const deltoidR = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), this.shirtMat);
    this.rightShoulder.add(deltoidR);

    // Right Upper Arm
    this.rightUpperArm = new THREE.Group();
    this.rightShoulder.add(this.rightUpperArm);
    const upperArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.28, 10), this.shirtMat);
    upperArmR.position.y = -0.14;
    upperArmR.castShadow = true;
    this.rightUpperArm.add(upperArmR);

    // Right Elbow & Forearm
    this.rightElbow = new THREE.Group();
    this.rightElbow.position.y = -0.28;
    this.rightUpperArm.add(this.rightElbow);

    const elbowR = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), this.shirtMat);
    this.rightElbow.add(elbowR);

    const forearmR = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.045, 0.26, 10), this.shirtMat);
    forearmR.position.y = -0.13;
    forearmR.castShadow = true;
    this.rightElbow.add(forearmR);

    // Right Wrist & Tactical Hand
    this.rightHand = new THREE.Group();
    this.rightHand.position.y = -0.26;
    this.rightElbow.add(this.rightHand);

    const palmR = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.085, 0.045), this.gloveMat);
    palmR.position.y = -0.04;
    palmR.castShadow = true;
    this.rightHand.add(palmR);

    // Dedicated Weapon Socket (Weapon attaches here!)
    this.weaponSocket = new THREE.Group();
    this.weaponSocket.position.set(0, -0.04, 0.06);
    this.rightHand.add(this.weaponSocket);

    // Left Shoulder Joint
    this.leftShoulder = new THREE.Group();
    this.leftShoulder.position.set(-0.24, 0.30, 0.02);
    this.chest.add(this.leftShoulder);

    const deltoidL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), this.shirtMat);
    this.leftShoulder.add(deltoidL);

    // Left Upper Arm
    this.leftUpperArm = new THREE.Group();
    this.leftShoulder.add(this.leftUpperArm);
    const upperArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.28, 10), this.shirtMat);
    upperArmL.position.y = -0.14;
    upperArmL.castShadow = true;
    this.leftUpperArm.add(upperArmL);

    // Left Elbow & Forearm
    this.leftElbow = new THREE.Group();
    this.leftElbow.position.y = -0.28;
    this.leftUpperArm.add(this.leftElbow);

    const elbowL = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), this.shirtMat);
    this.leftElbow.add(elbowL);

    const forearmL = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.045, 0.26, 10), this.shirtMat);
    forearmL.position.y = -0.13;
    forearmL.castShadow = true;
    this.leftElbow.add(forearmL);

    // Left Wrist & Tactical Hand (Supports weapon fore-end)
    this.leftHand = new THREE.Group();
    this.leftHand.position.y = -0.26;
    this.leftElbow.add(this.leftHand);

    const palmL = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.085, 0.045), this.gloveMat);
    palmL.position.y = -0.04;
    palmL.castShadow = true;
    this.leftHand.add(palmL);

    // ==========================================
    // 5. LEGS & COMBAT BOOTS
    // ==========================================
    // Left Hip Joint
    this.leftHip = new THREE.Group();
    this.leftHip.position.set(-0.13, -0.08, 0);
    this.pelvis.add(this.leftHip);

    // Left Thigh
    this.leftThigh = new THREE.Group();
    this.leftHip.add(this.leftThigh);
    const thighL = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.075, 0.42, 12), this.pantsMat);
    thighL.position.y = -0.21;
    thighL.castShadow = true;
    this.leftThigh.add(thighL);

    // Left Cargo Pocket
    const pocketL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.14, 0.12), this.pantsMat);
    pocketL.position.set(-0.09, -0.18, 0);
    this.leftThigh.add(pocketL);

    // Left Knee & Knee Pad
    this.leftKnee = new THREE.Group();
    this.leftKnee.position.y = -0.42;
    this.leftThigh.add(this.leftKnee);

    const kneePadL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.11, 0.06), this.tacticalVestMat);
    kneePadL.position.set(0, -0.02, 0.08);
    this.leftKnee.add(kneePadL);

    // Left Shin
    const shinL = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.38, 10), this.pantsMat);
    shinL.position.y = -0.19;
    shinL.castShadow = true;
    this.leftKnee.add(shinL);

    // Left Combat Boot
    this.leftAnkle = new THREE.Group();
    this.leftAnkle.position.y = -0.38;
    this.leftKnee.add(this.leftAnkle);

    const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.14, 0.26), this.bootMat);
    bootL.position.set(0, -0.04, 0.05);
    bootL.castShadow = true;
    this.leftAnkle.add(bootL);

    // Boot rubber sole tread
    const soleL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, 0.28), this.bootMat);
    soleL.position.set(0, -0.11, 0.05);
    this.leftAnkle.add(soleL);

    // Right Hip Joint
    this.rightHip = new THREE.Group();
    this.rightHip.position.set(0.13, -0.08, 0);
    this.pelvis.add(this.rightHip);

    // Right Thigh
    this.rightThigh = new THREE.Group();
    this.rightHip.add(this.rightThigh);
    const thighR = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.075, 0.42, 12), this.pantsMat);
    thighR.position.y = -0.21;
    thighR.castShadow = true;
    this.rightThigh.add(thighR);

    // Right Cargo Pocket
    const pocketR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.14, 0.12), this.pantsMat);
    pocketR.position.set(0.09, -0.18, 0);
    this.rightThigh.add(pocketR);

    // Right Knee & Knee Pad
    this.rightKnee = new THREE.Group();
    this.rightKnee.position.y = -0.42;
    this.rightThigh.add(this.rightKnee);

    const kneePadR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.11, 0.06), this.tacticalVestMat);
    kneePadR.position.set(0, -0.02, 0.08);
    this.rightKnee.add(kneePadR);

    // Right Shin
    const shinR = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.38, 10), this.pantsMat);
    shinR.position.y = -0.19;
    shinR.castShadow = true;
    this.rightKnee.add(shinR);

    // Right Combat Boot
    this.rightAnkle = new THREE.Group();
    this.rightAnkle.position.y = -0.38;
    this.rightKnee.add(this.rightAnkle);

    const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.14, 0.26), this.bootMat);
    bootR.position.set(0, -0.04, 0.05);
    bootR.castShadow = true;
    this.rightAnkle.add(bootR);

    const soleR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, 0.28), this.bootMat);
    soleR.position.set(0, -0.11, 0.05);
    this.rightAnkle.add(soleR);

    // Expose rightArm for backward compatibility
    this.rightArm = this.weaponSocket;

    root.position.copy(this.position);
    return root;
  }

  update(delta, inputKeys, cameraYaw, cameraPitch = 0, isAiming = false, colliders = []) {
    if (this.gameState.isInVehicle) {
      this.mesh.visible = false;
      return;
    }
    this.mesh.visible = true;
    this.aimPitch = cameraPitch;
    this.isAiming = isAiming;

    // 1. Crouch Transition with Smooth Blending
    this.isCrouched = inputKeys.crouch && !this.isDowned;
    const targetCrouchBlend = this.isCrouched ? 1.0 : 0.0;
    this.crouchBlend = THREE.MathUtils.lerp(this.crouchBlend, targetCrouchBlend, delta * 10);

    // 2. Stamina & Sprint Logic
    const wantsSprint = inputKeys.sprint && !this.isCrouched && this.gameState.stamina > 5 && !this.isAiming;
    if (wantsSprint && this.isMoving) {
      this.isSprinting = true;
      this.gameState.stamina = Math.max(0, this.gameState.stamina - PLAYER_CONFIG.STAMINA_DRAIN_SPRINT * delta);
    } else {
      this.isSprinting = false;
      this.gameState.stamina = Math.min(PLAYER_CONFIG.MAX_STAMINA, this.gameState.stamina + PLAYER_CONFIG.STAMINA_RECOVERY * delta);
    }

    const targetSprintBlend = this.isSprinting ? 1.0 : 0.0;
    this.sprintBlend = THREE.MathUtils.lerp(this.sprintBlend, targetSprintBlend, delta * 8);

    // 3. Speed & Direction Calculation
    let targetSpeed = PLAYER_CONFIG.RUN_SPEED;
    if (this.isCrouched) targetSpeed = PLAYER_CONFIG.CROUCH_SPEED;
    else if (this.isSprinting) targetSpeed = PLAYER_CONFIG.SPRINT_SPEED;
    else if (this.isAiming) targetSpeed = PLAYER_CONFIG.RUN_SPEED * 0.7; // Aim walk speed

    const moveX = (inputKeys.right ? 1 : 0) - (inputKeys.left ? 1 : 0);
    const moveZ = (inputKeys.backward ? 1 : 0) - (inputKeys.forward ? 1 : 0);
    const inputDir = new THREE.Vector3(moveX, 0, moveZ);

    if (inputDir.lengthSq() > 0.001) {
      inputDir.normalize();
      this.isMoving = true;

      // Camera-relative movement
      inputDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraYaw);

      // Smooth acceleration with momentum
      const accelRate = this.isGrounded ? 14 : 4;
      this.velocity.x = THREE.MathUtils.lerp(this.velocity.x, inputDir.x * targetSpeed, delta * accelRate);
      this.velocity.z = THREE.MathUtils.lerp(this.velocity.z, inputDir.z * targetSpeed, delta * accelRate);

      // Facing angle logic: In combat/aiming, face camera yaw; in free run, face movement direction
      let targetAngle = Math.atan2(this.velocity.x, this.velocity.z);
      if (this.isAiming) {
        targetAngle = cameraYaw + Math.PI; // Face target forward
      }

      let diff = targetAngle - this.facingAngle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.facingAngle += diff * delta * (this.isAiming ? 20 : 12);
      this.mesh.rotation.y = this.facingAngle;

      // Walk cycle rate scaling
      const cycleSpeed = this.isSprinting ? 16 : (this.isCrouched ? 8 : 11);
      this.walkCycle += delta * cycleSpeed;

      // Synchronized footsteps
      this.footstepTimer += delta * (this.isSprinting ? 2.6 : (this.isCrouched ? 1.1 : 1.7));
      if (this.footstepTimer >= 1.0) {
        this.footstepTimer = 0;
        this.audioManager.playFootstep();
      }
    } else {
      this.isMoving = false;
      this.velocity.x = THREE.MathUtils.lerp(this.velocity.x, 0, delta * 16);
      this.velocity.z = THREE.MathUtils.lerp(this.velocity.z, 0, delta * 16);
      // When aiming while stationary, face camera direction
      if (this.isAiming) {
        let diff = (cameraYaw + Math.PI) - this.facingAngle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        this.facingAngle += diff * delta * 18;
        this.mesh.rotation.y = this.facingAngle;
      }
    }

    // 4. Jump, Gravity & Landing Compression
    if (inputKeys.jump && this.isGrounded && !this.isCrouched) {
      this.velocity.y = PLAYER_CONFIG.JUMP_VELOCITY;
      this.isGrounded = false;
      this.airTime = 0;
      this.audioManager.playFootstep();
    }

    if (!this.isGrounded) {
      this.fallVelocity = this.velocity.y;
      this.velocity.y -= PLAYER_CONFIG.GRAVITY * delta;
      this.airTime += delta;
    }

    // Apply translation
    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
    this.position.z += this.velocity.z * delta;

    // Ground & Metro Station Platform elevation check
    let groundHeight = 0.0;
    if (Math.abs(this.position.x) < 45 && this.position.z > -36 && this.position.z < -4) {
      groundHeight = 14.0;
    } else if (this.position.y > 10.0 && this.position.z > -50 && this.position.z < -2) {
      groundHeight = 14.0;
    }

    // Landing Impact Event
    if (this.position.y <= groundHeight) {
      this.position.y = groundHeight;
      if (!this.isGrounded) {
        // Impact compression based on impact speed
        const impactForce = Math.min(1.0, Math.abs(this.fallVelocity) / 22);
        this.landCompression = impactForce * 0.28;
        this.audioManager.playFootstep();
      }
      this.velocity.y = 0;
      this.isGrounded = true;
    }

    // Decay landing compression spring
    this.landCompression = THREE.MathUtils.lerp(this.landCompression, 0, delta * 14);

    // Decay hit reaction flinch
    this.hitReaction = THREE.MathUtils.lerp(this.hitReaction, 0, delta * 12);

    // Clamp inside world bounds
    const maxBound = 290;
    this.position.x = THREE.MathUtils.clamp(this.position.x, -maxBound, maxBound);
    this.position.z = THREE.MathUtils.clamp(this.position.z, -maxBound, maxBound);

    this.mesh.position.copy(this.position);

    // 5. Update Skeletal Pose & Locomotion Animation Blending
    this.updateAnimationPose(delta);
  }

  updateAnimationPose(delta) {
    // ----------------------------------------------------
    // Pelvis Height & Crouch / Landing Vertical Offsets
    // ----------------------------------------------------
    const basePelvisY = 0.92;
    const crouchDrop = this.crouchBlend * 0.38; // Drops hip when crouched
    const landingDrop = this.landCompression;
    const breathingIdle = Math.sin(Date.now() * 0.0025) * 0.012 * (1.0 - this.sprintBlend);
    const sprintBounce = this.isMoving ? Math.abs(Math.sin(this.walkCycle * 2)) * (0.02 + 0.04 * this.sprintBlend) : 0;

    this.pelvis.position.y = basePelvisY - crouchDrop - landingDrop + breathingIdle + sprintBounce;

    // ----------------------------------------------------
    // Torso Lean & Spine Rotation
    // ----------------------------------------------------
    // Sprint leans torso forward (~14 deg), crouch hunches forward
    const sprintLean = this.sprintBlend * 0.26;
    const crouchHunch = this.crouchBlend * 0.22;
    const hitFlinch = this.hitReaction * 0.25;
    this.spine.rotation.x = sprintLean + crouchHunch - hitFlinch;

    // Aim pitch (upper body pitches up/down with camera)
    this.chest.rotation.x = THREE.MathUtils.clamp(-this.aimPitch * 0.8, -0.6, 0.6);

    // Subtle spine twist during lateral turns
    if (this.isMoving) {
      this.spine.rotation.y = Math.sin(this.walkCycle) * 0.06;
    } else {
      this.spine.rotation.y = 0;
    }

    // ----------------------------------------------------
    // Legs Locomotion Blending
    // ----------------------------------------------------
    if (this.isGrounded) {
      if (this.isMoving) {
        const strideLength = 0.42 + this.sprintBlend * 0.35 - this.crouchBlend * 0.15;
        const legSwing = Math.sin(this.walkCycle) * strideLength;

        // Thigh swing
        this.leftThigh.rotation.x = legSwing;
        this.rightThigh.rotation.x = -legSwing;

        // Knee bend on rear swing
        this.leftKnee.rotation.x = legSwing < 0 ? Math.abs(legSwing) * 1.2 : 0.1;
        this.rightKnee.rotation.x = -legSwing < 0 ? Math.abs(legSwing) * 1.2 : 0.1;

        // Ankle foot level adjustment
        this.leftAnkle.rotation.x = -legSwing * 0.4;
        this.rightAnkle.rotation.x = legSwing * 0.4;
      } else {
        // Idle standing or crouched stance
        const idleKneeBend = this.crouchBlend * 0.85 + this.landCompression * 2.0;
        this.leftThigh.rotation.x = -idleKneeBend * 0.5;
        this.rightThigh.rotation.x = -idleKneeBend * 0.5;
        this.leftKnee.rotation.x = idleKneeBend;
        this.rightKnee.rotation.x = idleKneeBend;
        this.leftAnkle.rotation.x = -idleKneeBend * 0.5;
        this.rightAnkle.rotation.x = -idleKneeBend * 0.5;
      }
    } else {
      // Airborne jump / falling posture
      this.leftThigh.rotation.x = 0.3;
      this.rightThigh.rotation.x = 0.2;
      this.leftKnee.rotation.x = 0.4;
      this.rightKnee.rotation.x = 0.5;
    }

    // ----------------------------------------------------
    // Two-Handed Weapon Grip & Arm Handling
    // ----------------------------------------------------
    if (this.isAiming) {
      // ADS / Shoulder Aim: Weapon locked forward into eye-line
      this.rightShoulder.rotation.set(-1.45, 0.28, -0.2);
      this.rightElbow.rotation.set(1.1, 0.0, 0.0);
      this.rightHand.rotation.set(-0.2, 0.15, 0.0);

      // Left arm reaches across to support handguard
      this.leftShoulder.rotation.set(-1.35, -0.45, 0.35);
      this.leftElbow.rotation.set(1.4, 0.0, 0.0);
      this.leftHand.rotation.set(-0.15, -0.2, 0.0);
    } else if (this.isSprinting) {
      // Sprint Weapon Carry: High-port tactical carry
      const armPump = Math.sin(this.walkCycle) * 0.35;
      this.rightShoulder.rotation.set(-0.85 + armPump, 0.2, -0.15);
      this.rightElbow.rotation.set(1.2, 0, 0);

      this.leftShoulder.rotation.set(-0.75 - armPump, -0.2, 0.15);
      this.leftElbow.rotation.set(1.3, 0, 0);
    } else {
      // Hip Fire / Relaxed Patrol Ready
      const idleBob = Math.sin(Date.now() * 0.003) * 0.03;
      this.rightShoulder.rotation.set(-1.05 + idleBob, 0.22, -0.1);
      this.rightElbow.rotation.set(0.95, 0.0, 0.0);
      this.rightHand.rotation.set(-0.1, 0.05, 0.0);

      this.leftShoulder.rotation.set(-0.95 + idleBob, -0.38, 0.25);
      this.leftElbow.rotation.set(1.2, 0.0, 0.0);
      this.leftHand.rotation.set(-0.1, -0.1, 0.0);
    }
  }

  applyHitDamage(damageAmount = 20) {
    this.hitReaction = 1.0;
    this.gameState.health = Math.max(0, this.gameState.health - damageAmount);
    if (this.gameState.health <= 0) {
      this.enterDownedState();
    }
  }

  enterDownedState() {
    this.isDowned = true;
    this.isCrouched = true;
    // Downed crawling posture
    this.pelvis.position.y = 0.35;
    this.spine.rotation.x = 0.85;
  }

  teleport(x, y, z) {
    this.position.set(x, y, z);
    this.velocity.set(0, 0, 0);
    this.mesh.position.copy(this.position);
  }
}
