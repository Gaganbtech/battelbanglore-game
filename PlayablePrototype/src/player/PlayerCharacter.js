// AAA Realistic Humanoid Character Model, 8-Direction Locomotion, Weapon IK & Stance Blending
// BENGALURU: LAST CITY - Phase 2.5 Overhaul
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
    this.isDowned = false;

    // 8-Direction Locomotion Blending
    this.moveXInput = 0; // -1 (left) to +1 (right)
    this.moveZInput = 0; // -1 (forward) to +1 (backward)
    this.localVelocity = new THREE.Vector2(); // forward / strafe

    // Animation Blend Weights & Springs
    this.walkCycle = 0;
    this.footstepTimer = 0;
    this.crouchBlend = 0;     // 0 = standing, 1 = crouched
    this.sprintBlend = 0;     // 0 = walk/jog, 1 = sprint
    this.strafeBlend = 0;     // -1 (left) to +1 (right)
    this.forwardBlend = 0;    // -1 (back) to +1 (forward)
    this.landCompression = 0; // Impact absorption depth
    this.airTime = 0;
    this.fallVelocity = 0;
    this.hitReaction = 0;

    // Weapon Switching Animation
    this.isSwitchingWeapon = false;
    this.weaponSwitchProgress = 1.0;
    this.pendingWeaponKey = null;

    // Build the anatomical human mesh & hierarchical animation rig
    this.mesh = this.buildHumanCharacterMesh();
    this.scene.add(this.mesh);
  }

  buildHumanCharacterMesh() {
    const root = new THREE.Group();

    // High-Resolution Physically Based Materials (PBR)
    this.skinMat = new THREE.MeshStandardMaterial({
      color: 0x9e6c4c, // Realistic warm South Asian skin tone
      roughness: 0.62,
      metalness: 0.04
    });

    this.hairMat = new THREE.MeshStandardMaterial({
      color: 0x110f0d, // Dark textured hair
      roughness: 0.88,
      metalness: 0.02
    });

    this.vestMat = new THREE.MeshStandardMaterial({
      color: 0x1c2228, // Matte ballistic cordura nylon
      roughness: 0.72,
      metalness: 0.1
    });

    this.shirtMat = new THREE.MeshStandardMaterial({
      color: 0x243242, // Navy moisture-wicking tactical combat shirt
      roughness: 0.68,
      metalness: 0.05
    });

    this.pantsMat = new THREE.MeshStandardMaterial({
      color: 0x20242b, // Charcoal reinforced ripstop cargo pants
      roughness: 0.78,
      metalness: 0.05
    });

    this.leatherMat = new THREE.MeshStandardMaterial({
      color: 0x1a1512, // Dark combat leather
      roughness: 0.48,
      metalness: 0.15
    });

    this.bootMat = new THREE.MeshStandardMaterial({
      color: 0x121315, // Matte black tactical boots with rubber sole
      roughness: 0.55,
      metalness: 0.2
    });

    this.backpackMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Amber tactical assault pack (Bengaluru accent)
      roughness: 0.65,
      metalness: 0.08
    });

    this.gloveMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937, // Hard-knuckle tactical gloves
      roughness: 0.5,
      metalness: 0.2
    });

    this.hardwareMat = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Gunmetal clips, D-rings and buckles
      roughness: 0.3,
      metalness: 0.85
    });

    // ==========================================
    // 1. PELVIS & ROOT BONE
    // ==========================================
    this.pelvis = new THREE.Group();
    this.pelvis.position.y = 0.92; // Natural human hip height
    root.add(this.pelvis);

    // Anatomical Pelvis Geometry
    const pelvisGeo = new THREE.CylinderGeometry(0.18, 0.16, 0.22, 14);
    const pelvisMesh = new THREE.Mesh(pelvisGeo, this.pantsMat);
    pelvisMesh.castShadow = true;
    this.pelvis.add(pelvisMesh);

    // Tactical Duty Belt with Holster
    const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.205, 0.08, 16), this.leatherMat);
    belt.position.y = 0.09;
    this.pelvis.add(belt);

    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.06, 0.03), this.hardwareMat);
    buckle.position.set(0, 0.09, 0.21);
    this.pelvis.add(buckle);

    // Side Utility Pouches
    [-0.22, 0.22].forEach(px => {
      const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.06), this.vestMat);
      pouch.position.set(px, 0.05, 0.04);
      this.pelvis.add(pouch);
    });

    // Side Holster on Right Thigh
    const holster = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 0.09), this.leatherMat);
    holster.position.set(0.21, -0.12, 0.02);
    this.pelvis.add(holster);

    // ==========================================
    // 2. SPINE & TORSO (UPPER BODY SEPARATION)
    // ==========================================
    this.spine = new THREE.Group();
    this.spine.position.y = 0.14;
    this.pelvis.add(this.spine);

    // Lower abdomen
    const abdomenGeo = new THREE.CylinderGeometry(0.19, 0.18, 0.24, 14);
    const abdomen = new THREE.Mesh(abdomenGeo, this.shirtMat);
    abdomen.position.y = 0.12;
    abdomen.castShadow = true;
    this.spine.add(abdomen);

    // Thorax / Chest
    this.chest = new THREE.Group();
    this.chest.position.y = 0.26;
    this.spine.add(this.chest);

    const chestGeo = new THREE.BoxGeometry(0.44, 0.36, 0.28);
    const chestMesh = new THREE.Mesh(chestGeo, this.shirtMat);
    chestMesh.position.y = 0.18;
    chestMesh.castShadow = true;
    this.chest.add(chestMesh);

    // Tactical Plate Carrier Vest (Front & Back armor plates)
    const vestFront = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.34, 0.12), this.vestMat);
    vestFront.position.set(0, 0.18, 0.12);
    vestFront.castShadow = true;
    this.chest.add(vestFront);

    // MOLLE Webbing Strips across chest
    for (let row = -0.08; row <= 0.08; row += 0.05) {
      const molle = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.016, 0.015), this.leatherMat);
      molle.position.set(0, 0.18 + row, 0.185);
      this.chest.add(molle);
    }

    // Triple Rifle Magazine Pouches on Chest
    for (let mag = -0.09; mag <= 0.09; mag += 0.09) {
      const magPouch = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.14, 0.05), this.leatherMat);
      magPouch.position.set(mag, 0.14, 0.19);
      this.chest.add(magPouch);
    }

    // Tactical Comms Radio with Whip Antenna on Left Shoulder
    const radio = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.05), this.hardwareMat);
    radio.position.set(-0.16, 0.32, 0.12);
    this.chest.add(radio);

    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.2, 6), this.hardwareMat);
    antenna.position.set(-0.16, 0.45, 0.12);
    this.chest.add(antenna);

    // Contoured Tactical Assault Backpack on Back
    this.backpack = new THREE.Group();
    this.backpack.position.set(0, 0.18, -0.18);
    const packMain = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.42, 0.18), this.backpackMat);
    packMain.castShadow = true;
    this.backpack.add(packMain);

    const packLower = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.15, 0.10), this.backpackMat);
    packLower.position.set(0, -0.12, -0.10);
    this.backpack.add(packLower);
    this.chest.add(this.backpack);

    // ==========================================
    // 3. NECK & REALISTIC HEAD WITH FACIAL FEATURES
    // ==========================================
    this.neck = new THREE.Group();
    this.neck.position.y = 0.36;
    this.chest.add(this.neck);

    const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.14, 12), this.skinMat);
    neckMesh.position.y = 0.07;
    neckMesh.castShadow = true;
    this.neck.add(neckMesh);

    // Head Group
    this.head = new THREE.Group();
    this.head.position.y = 0.14;
    this.neck.add(this.head);

    // Cranium & Facial Structure
    const craniumGeo = new THREE.SphereGeometry(0.13, 18, 16);
    craniumGeo.scale(0.9, 1.15, 1.05);
    const cranium = new THREE.Mesh(craniumGeo, this.skinMat);
    cranium.position.set(0, 0.12, 0);
    cranium.castShadow = true;
    this.head.add(cranium);

    // Defined Jaw & Chin
    const jawGeo = new THREE.ConeGeometry(0.09, 0.14, 8);
    jawGeo.scale(1.2, 1.0, 1.0);
    const jaw = new THREE.Mesh(jawGeo, this.skinMat);
    jaw.rotation.x = Math.PI;
    jaw.position.set(0, 0.02, 0.04);
    this.head.add(jaw);

    // Sculpted Nose
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.06, 6), this.skinMat);
    nose.rotation.x = -Math.PI / 6;
    nose.position.set(0, 0.11, 0.14);
    this.head.add(nose);

    // Realistic Eyes (Dark Iris)
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1a120b });
    [-0.042, 0.042].forEach(ex => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), eyeMat);
      eye.position.set(ex, 0.135, 0.128);
      this.head.add(eye);
    });

    // Anatomical Ears
    [-0.12, 0.12].forEach(ex => {
      const ear = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.05, 0.03), this.skinMat);
      ear.position.set(ex, 0.11, 0.0);
      this.head.add(ear);
    });

    // Modern Styled Hair Mesh
    const hairTop = new THREE.Mesh(new THREE.SphereGeometry(0.135, 14, 12), this.hairMat);
    hairTop.scale.set(0.92, 0.95, 1.08);
    hairTop.position.set(0, 0.16, -0.01);
    this.head.add(hairTop);

    // Tactical Headset with Mic Boom
    const headsetBand = new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.015, 8, 16, Math.PI), this.vestMat);
    headsetBand.rotation.z = Math.PI / 2;
    headsetBand.rotation.y = Math.PI / 2;
    headsetBand.position.set(0, 0.18, 0);
    this.head.add(headsetBand);

    [-0.135, 0.135].forEach(ex => {
      const earCup = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 10), this.vestMat);
      earCup.rotation.z = Math.PI / 2;
      earCup.position.set(ex, 0.11, 0);
      this.head.add(earCup);
    });

    const micBoom = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.12, 6), this.hardwareMat);
    micBoom.rotation.x = Math.PI / 3;
    micBoom.position.set(-0.12, 0.06, 0.08);
    this.head.add(micBoom);

    // ==========================================
    // 4. ARMS & TWO-HANDED WEAPON IK SYSTEM
    // ==========================================
    // Right Shoulder & Arm
    this.rightShoulder = new THREE.Group();
    this.rightShoulder.position.set(0.24, 0.30, 0.02);
    this.chest.add(this.rightShoulder);

    const deltoidR = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 10), this.shirtMat);
    this.rightShoulder.add(deltoidR);

    this.rightUpperArm = new THREE.Group();
    this.rightShoulder.add(this.rightUpperArm);
    const upperArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.28, 12), this.shirtMat);
    upperArmR.position.y = -0.14;
    upperArmR.castShadow = true;
    this.rightUpperArm.add(upperArmR);

    this.rightElbow = new THREE.Group();
    this.rightElbow.position.y = -0.28;
    this.rightUpperArm.add(this.rightElbow);

    const forearmR = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.045, 0.26, 12), this.shirtMat);
    forearmR.position.y = -0.13;
    forearmR.castShadow = true;
    this.rightElbow.add(forearmR);

    this.rightHand = new THREE.Group();
    this.rightHand.position.y = -0.26;
    this.rightElbow.add(this.rightHand);

    // Tactical Glove with Articulated Fingers
    const palmR = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.085, 0.045), this.gloveMat);
    palmR.position.y = -0.04;
    palmR.castShadow = true;
    this.rightHand.add(palmR);

    // Finger Grip Segments (Holding pistol grip & trigger)
    const fingerGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.065, 6);
    const triggerFinger = new THREE.Mesh(fingerGeo, this.gloveMat);
    triggerFinger.rotation.z = Math.PI / 3;
    triggerFinger.position.set(0.03, -0.05, 0.05);
    this.rightHand.add(triggerFinger);

    // Dedicated Weapon Socket (Weapon attaches here!)
    this.weaponSocket = new THREE.Group();
    this.weaponSocket.position.set(0, -0.04, 0.06);
    this.rightHand.add(this.weaponSocket);

    // Left Shoulder & Arm (Support Hand)
    this.leftShoulder = new THREE.Group();
    this.leftShoulder.position.set(-0.24, 0.30, 0.02);
    this.chest.add(this.leftShoulder);

    const deltoidL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 10), this.shirtMat);
    this.leftShoulder.add(deltoidL);

    this.leftUpperArm = new THREE.Group();
    this.leftShoulder.add(this.leftUpperArm);
    const upperArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.28, 12), this.shirtMat);
    upperArmL.position.y = -0.14;
    upperArmL.castShadow = true;
    this.leftUpperArm.add(upperArmL);

    this.leftElbow = new THREE.Group();
    this.leftElbow.position.y = -0.28;
    this.leftUpperArm.add(this.leftElbow);

    const forearmL = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.045, 0.26, 12), this.shirtMat);
    forearmL.position.y = -0.13;
    forearmL.castShadow = true;
    this.leftElbow.add(forearmL);

    this.leftHand = new THREE.Group();
    this.leftHand.position.y = -0.26;
    this.leftElbow.add(this.leftHand);

    const palmL = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.085, 0.045), this.gloveMat);
    palmL.position.y = -0.04;
    palmL.castShadow = true;
    this.leftHand.add(palmL);

    // Left Fingers curling around rifle handguard
    const supportFinger = new THREE.Mesh(fingerGeo, this.gloveMat);
    supportFinger.rotation.x = Math.PI / 4;
    supportFinger.position.set(-0.02, -0.05, 0.04);
    this.leftHand.add(supportFinger);

    // Expose rightArm for backward compatibility
    this.rightArm = this.weaponSocket;

    // ==========================================
    // 5. LEGS, KNEES & COMBAT FOOTWEAR
    // ==========================================
    // Left Hip & Leg
    this.leftHip = new THREE.Group();
    this.leftHip.position.set(-0.13, -0.08, 0);
    this.pelvis.add(this.leftHip);

    this.leftThigh = new THREE.Group();
    this.leftHip.add(this.leftThigh);
    const thighL = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.075, 0.42, 14), this.pantsMat);
    thighL.position.y = -0.21;
    thighL.castShadow = true;
    this.leftThigh.add(thighL);

    const pocketL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.14, 0.12), this.pantsMat);
    pocketL.position.set(-0.09, -0.18, 0);
    this.leftThigh.add(pocketL);

    this.leftKnee = new THREE.Group();
    this.leftKnee.position.y = -0.42;
    this.leftThigh.add(this.leftKnee);

    const kneePadL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.11, 0.06), this.vestMat);
    kneePadL.position.set(0, -0.02, 0.08);
    this.leftKnee.add(kneePadL);

    const shinL = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.38, 12), this.pantsMat);
    shinL.position.y = -0.19;
    shinL.castShadow = true;
    this.leftKnee.add(shinL);

    this.leftAnkle = new THREE.Group();
    this.leftAnkle.position.y = -0.38;
    this.leftKnee.add(this.leftAnkle);

    const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.14, 0.26), this.bootMat);
    bootL.position.set(0, -0.04, 0.05);
    bootL.castShadow = true;
    this.leftAnkle.add(bootL);

    const soleL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, 0.28), this.bootMat);
    soleL.position.set(0, -0.11, 0.05);
    this.leftAnkle.add(soleL);

    // Right Hip & Leg
    this.rightHip = new THREE.Group();
    this.rightHip.position.set(0.13, -0.08, 0);
    this.pelvis.add(this.rightHip);

    this.rightThigh = new THREE.Group();
    this.rightHip.add(this.rightThigh);
    const thighR = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.075, 0.42, 14), this.pantsMat);
    thighR.position.y = -0.21;
    thighR.castShadow = true;
    this.rightThigh.add(thighR);

    const pocketR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.14, 0.12), this.pantsMat);
    pocketR.position.set(0.09, -0.18, 0);
    this.rightThigh.add(pocketR);

    this.rightKnee = new THREE.Group();
    this.rightKnee.position.y = -0.42;
    this.rightThigh.add(this.rightKnee);

    const kneePadR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.11, 0.06), this.vestMat);
    kneePadR.position.set(0, -0.02, 0.08);
    this.rightKnee.add(kneePadR);

    const shinR = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.38, 12), this.pantsMat);
    shinR.position.y = -0.19;
    shinR.castShadow = true;
    this.rightKnee.add(shinR);

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

    root.position.copy(this.position);
    return root;
  }

  startWeaponSwitch(newWeaponKey) {
    this.isSwitchingWeapon = true;
    this.weaponSwitchProgress = 0.0;
    this.pendingWeaponKey = newWeaponKey;
  }

  update(delta, inputKeys, cameraYaw, cameraPitch = 0, isAiming = false, colliders = []) {
    if (this.gameState.isInVehicle) {
      this.mesh.visible = false;
      return;
    }
    this.mesh.visible = true;
    this.aimPitch = cameraPitch;
    this.isAiming = isAiming;

    // 1. Crouch Transition
    this.isCrouched = inputKeys.crouch && !this.isDowned;
    const targetCrouch = this.isCrouched ? 1.0 : 0.0;
    this.crouchBlend = THREE.MathUtils.lerp(this.crouchBlend, targetCrouch, delta * 10);

    // 2. Sprint & Stamina
    const wantsSprint = inputKeys.sprint && !this.isCrouched && this.gameState.stamina > 5 && !this.isAiming;
    if (wantsSprint && this.isMoving) {
      this.isSprinting = true;
      this.gameState.stamina = Math.max(0, this.gameState.stamina - PLAYER_CONFIG.STAMINA_DRAIN_SPRINT * delta);
    } else {
      this.isSprinting = false;
      this.gameState.stamina = Math.min(PLAYER_CONFIG.MAX_STAMINA, this.gameState.stamina + PLAYER_CONFIG.STAMINA_RECOVERY * delta);
    }
    this.sprintBlend = THREE.MathUtils.lerp(this.sprintBlend, this.isSprinting ? 1.0 : 0.0, delta * 8);

    // 3. 8-Direction Movement Decomposition
    const rawX = (inputKeys.right ? 1 : 0) - (inputKeys.left ? 1 : 0);
    const rawZ = (inputKeys.backward ? 1 : 0) - (inputKeys.forward ? 1 : 0);
    this.moveXInput = rawX;
    this.moveZInput = rawZ;

    let targetSpeed = PLAYER_CONFIG.RUN_SPEED;
    if (this.isCrouched) targetSpeed = PLAYER_CONFIG.CROUCH_SPEED;
    else if (this.isSprinting) targetSpeed = PLAYER_CONFIG.SPRINT_SPEED;
    else if (this.isAiming) targetSpeed = PLAYER_CONFIG.RUN_SPEED * 0.65;

    const inputDir = new THREE.Vector3(rawX, 0, rawZ);

    if (inputDir.lengthSq() > 0.001) {
      inputDir.normalize();
      this.isMoving = true;

      // Transform input vector by camera orientation
      const worldMoveDir = inputDir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraYaw);

      // Smooth acceleration with mass momentum
      const accel = this.isGrounded ? 15 : 4;
      this.velocity.x = THREE.MathUtils.lerp(this.velocity.x, worldMoveDir.x * targetSpeed, delta * accel);
      this.velocity.z = THREE.MathUtils.lerp(this.velocity.z, worldMoveDir.z * targetSpeed, delta * accel);

      // In Combat / ADS: Character always faces camera look direction!
      // In Free Run (sprinting without aim): Face movement direction smoothly
      let targetFacing = cameraYaw + Math.PI;
      if (this.isSprinting && !this.isAiming) {
        targetFacing = Math.atan2(this.velocity.x, this.velocity.z);
      }

      let diff = targetFacing - this.facingAngle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.facingAngle += diff * delta * (this.isAiming ? 22 : 12);
      this.mesh.rotation.y = this.facingAngle;

      // Compute local forward / strafe components for 8-way animation blending
      const charForward = new THREE.Vector3(Math.sin(this.facingAngle), 0, Math.cos(this.facingAngle));
      const charRight = new THREE.Vector3(charForward.z, 0, -charForward.x);

      this.forwardBlend = worldMoveDir.dot(charForward);
      this.strafeBlend = worldMoveDir.dot(charRight);

      // Walk cycle speed scaling
      const cycleSpeed = this.isSprinting ? 16 : (this.isCrouched ? 8 : 11);
      this.walkCycle += delta * cycleSpeed;

      // Synchronized Footsteps Audio
      this.footstepTimer += delta * (this.isSprinting ? 2.6 : (this.isCrouched ? 1.1 : 1.7));
      if (this.footstepTimer >= 1.0) {
        this.footstepTimer = 0;
        this.audioManager.playFootstep();
      }
    } else {
      this.isMoving = false;
      this.velocity.x = THREE.MathUtils.lerp(this.velocity.x, 0, delta * 16);
      this.velocity.z = THREE.MathUtils.lerp(this.velocity.z, 0, delta * 16);
      this.forwardBlend = THREE.MathUtils.lerp(this.forwardBlend, 0, delta * 12);
      this.strafeBlend = THREE.MathUtils.lerp(this.strafeBlend, 0, delta * 12);

      // Stationary aiming faces camera direction
      if (this.isAiming) {
        let diff = (cameraYaw + Math.PI) - this.facingAngle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        this.facingAngle += diff * delta * 20;
        this.mesh.rotation.y = this.facingAngle;
      }
    }

    // 4. Jump, Gravity & Impact Absorption
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

    // Translation
    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
    this.position.z += this.velocity.z * delta;

    // Platform & Ground Elevation check
    let groundHeight = 0.0;
    if (Math.abs(this.position.x) < 45 && this.position.z > -36 && this.position.z < -4) {
      groundHeight = 14.0; // Metro station platform
    } else if (this.position.y > 10.0 && this.position.z > -50 && this.position.z < -2) {
      groundHeight = 14.0;
    }

    if (this.position.y <= groundHeight) {
      this.position.y = groundHeight;
      if (!this.isGrounded) {
        const impact = Math.min(1.0, Math.abs(this.fallVelocity) / 22);
        this.landCompression = impact * 0.28;
        this.audioManager.playFootstep();
      }
      this.velocity.y = 0;
      this.isGrounded = true;
    }

    this.landCompression = THREE.MathUtils.lerp(this.landCompression, 0, delta * 14);
    this.hitReaction = THREE.MathUtils.lerp(this.hitReaction, 0, delta * 12);

    // 5. Weapon Switch Animation Progress
    if (this.isSwitchingWeapon) {
      this.weaponSwitchProgress += delta * 3.5;
      if (this.weaponSwitchProgress >= 1.0) {
        this.weaponSwitchProgress = 1.0;
        this.isSwitchingWeapon = false;
      }
    }

    // World Boundary clamp
    const maxBound = 290;
    this.position.x = THREE.MathUtils.clamp(this.position.x, -maxBound, maxBound);
    this.position.z = THREE.MathUtils.clamp(this.position.z, -maxBound, maxBound);

    this.mesh.position.copy(this.position);

    // 6. Update Skeletal Joint Poses & 8-Direction Locomotion
    this.updateAnimationPose(delta);
  }

  updateAnimationPose(delta) {
    // ----------------------------------------------------
    // Pelvis Height, Crouch & Landing Compression
    // ----------------------------------------------------
    const basePelvisY = 0.92;
    const crouchDrop = this.crouchBlend * 0.38;
    const landingDrop = this.landCompression;
    const breathing = Math.sin(Date.now() * 0.0025) * 0.012 * (1.0 - this.sprintBlend);
    const sprintBounce = this.isMoving ? Math.abs(Math.sin(this.walkCycle * 2)) * (0.02 + 0.04 * this.sprintBlend) : 0;

    this.pelvis.position.y = basePelvisY - crouchDrop - landingDrop + breathing + sprintBounce;

    // ----------------------------------------------------
    // Torso Lean, Spine Decoupling & Aim Pitch
    // ----------------------------------------------------
    const sprintLean = this.sprintBlend * 0.26;
    const crouchHunch = this.crouchBlend * 0.22;
    const hitFlinch = this.hitReaction * 0.25;

    // Spine pitches forward on sprint/crouch
    this.spine.rotation.x = sprintLean + crouchHunch - hitFlinch;

    // Lateral strafe body lean
    this.spine.rotation.z = -this.strafeBlend * 0.08;

    // Upper body aims up/down with camera pitch
    this.chest.rotation.x = THREE.MathUtils.clamp(-this.aimPitch * 0.82, -0.65, 0.65);

    // Dynamic spine counter-twist during movement
    if (this.isMoving) {
      this.spine.rotation.y = Math.sin(this.walkCycle) * 0.07;
    } else {
      this.spine.rotation.y = 0;
    }

    // ----------------------------------------------------
    // 8-Direction Leg Locomotion Blending
    // ----------------------------------------------------
    if (this.isGrounded) {
      if (this.isMoving) {
        const stride = 0.44 + this.sprintBlend * 0.35 - this.crouchBlend * 0.15;
        const forwardCycle = Math.sin(this.walkCycle) * stride * Math.sign(this.forwardBlend || 1);
        const strafeCycle = Math.cos(this.walkCycle) * stride * 0.5 * this.strafeBlend;

        // Thigh pitch and roll
        this.leftThigh.rotation.x = forwardCycle;
        this.rightThigh.rotation.x = -forwardCycle;
        this.leftThigh.rotation.z = strafeCycle;
        this.rightThigh.rotation.z = -strafeCycle;

        // Knee articulation
        this.leftKnee.rotation.x = forwardCycle < 0 ? Math.abs(forwardCycle) * 1.3 : 0.1;
        this.rightKnee.rotation.x = -forwardCycle < 0 ? Math.abs(forwardCycle) * 1.3 : 0.1;

        // Ankle orientation
        this.leftAnkle.rotation.x = -forwardCycle * 0.4;
        this.rightAnkle.rotation.x = forwardCycle * 0.4;
      } else {
        // Idle stance (relaxed or crouched)
        const idleBend = this.crouchBlend * 0.85 + this.landCompression * 2.0;
        this.leftThigh.rotation.set(-idleBend * 0.5, 0, 0);
        this.rightThigh.rotation.set(-idleBend * 0.5, 0, 0);
        this.leftKnee.rotation.set(idleBend, 0, 0);
        this.rightKnee.rotation.set(idleBend, 0, 0);
        this.leftAnkle.rotation.set(-idleBend * 0.5, 0, 0);
        this.rightAnkle.rotation.set(-idleBend * 0.5, 0, 0);
      }
    } else {
      // Jump / Falling posture
      this.leftThigh.rotation.set(0.3, 0, 0);
      this.rightThigh.rotation.set(0.2, 0, 0);
      this.leftKnee.rotation.set(0.45, 0, 0);
      this.rightKnee.rotation.set(0.55, 0, 0);
    }

    // ----------------------------------------------------
    // Weapon Holding & Animated Switching IK
    // ----------------------------------------------------
    // Weapon switch dip curve: dips down to waist then returns
    let switchDip = 0;
    if (this.isSwitchingWeapon) {
      switchDip = Math.sin(this.weaponSwitchProgress * Math.PI) * 0.6;
    }

    if (this.isAiming) {
      // ADS / Shoulder Aim: Weapon aligned to eye-line
      this.rightShoulder.rotation.set(-1.45 + switchDip, 0.26, -0.18);
      this.rightElbow.rotation.set(1.15, 0.0, 0.0);
      this.rightHand.rotation.set(-0.18, 0.14, 0.0);

      // Support hand firmly following forend socket
      this.leftShoulder.rotation.set(-1.38 + switchDip, -0.42, 0.32);
      this.leftElbow.rotation.set(1.38, 0.0, 0.0);
      this.leftHand.rotation.set(-0.12, -0.18, 0.0);
    } else if (this.isSprinting) {
      // Tactical Sprint Carry: High-port diagonal carry across chest
      const pump = Math.sin(this.walkCycle) * 0.35;
      this.rightShoulder.rotation.set(-0.85 + pump + switchDip, 0.22, -0.15);
      this.rightElbow.rotation.set(1.22, 0, 0);

      this.leftShoulder.rotation.set(-0.75 - pump + switchDip, -0.22, 0.15);
      this.leftElbow.rotation.set(1.28, 0, 0);
    } else {
      // Hip Fire / Patrol Low-Ready Stance
      const idleBob = Math.sin(Date.now() * 0.003) * 0.03;
      this.rightShoulder.rotation.set(-1.05 + idleBob + switchDip, 0.22, -0.1);
      this.rightElbow.rotation.set(0.98, 0.0, 0.0);
      this.rightHand.rotation.set(-0.1, 0.05, 0.0);

      this.leftShoulder.rotation.set(-0.95 + idleBob + switchDip, -0.36, 0.24);
      this.leftElbow.rotation.set(1.22, 0.0, 0.0);
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
    this.pelvis.position.y = 0.35;
    this.spine.rotation.x = 0.85;
  }

  teleport(x, y, z) {
    this.position.set(x, y, z);
    this.velocity.set(0, 0, 0);
    this.mesh.position.copy(this.position);
  }
}
