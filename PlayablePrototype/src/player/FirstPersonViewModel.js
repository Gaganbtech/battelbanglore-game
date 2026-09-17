// AAA First-Person Weapon Viewmodel & Locomotion Animation System
// BENGALURU: LAST CITY - Master Production Overhaul
// Renders tactical gloved arms and hands holding the hero assault rifle in front of camera,
// with EOTech holographic optic, illuminated reticle dot, Lissajous breathing sway,
// figure-8 movement bob, precision ADS alignment down the sight axis, mechanical bolt slide cycling,
// and spent brass shell ejection.
import * as THREE from 'three';

export class FirstPersonViewModel {
  constructor(camera, scene, audioManager) {
    this.camera = camera;
    this.scene = scene;
    this.audioManager = audioManager;

    // Viewmodel root attached directly to camera so it moves seamlessly with player view
    this.viewmodelRoot = new THREE.Group();
    this.viewmodelRoot.name = 'FirstPersonViewModel';
    this.camera.add(this.viewmodelRoot);

    // ADS & Locomotion Animation States
    this.isADS = false;
    this.adsProgress = 0.0; // 0 = Hipfire, 1 = Full ADS Optic Centering
    this.bobTimer = 0.0;
    this.swayTimer = 0.0;
    this.recoilZ = 0.0;
    this.recoilPitch = 0.0;
    this.recoilYaw = 0.0;

    // Default Hipfire Offset relative to Camera
    this.hipOffset = new THREE.Vector3(0.18, -0.22, -0.45);
    // ADS Target Offset: centers the holographic optic directly on camera optical center
    this.adsOffset = new THREE.Vector3(0.0, -0.145, -0.32);

    this.currentPosition = this.hipOffset.clone();
    this.currentRotation = new THREE.Euler(0, 0, 0);

    // Shell casings
    this.shellCasings = [];

    this.buildTacticalGlovedArmsAndWeapon();
  }

  buildTacticalGlovedArmsAndWeapon() {
    // 1. High-Detail PBR Materials
    const gloveMat = new THREE.MeshStandardMaterial({
      color: 0x181a1f, // Black reinforced tactical combat glove
      roughness: 0.65,
      metalness: 0.15
    });

    const sleeveMat = new THREE.MeshStandardMaterial({
      color: 0x242d38, // Charcoal/Navy Cordura combat jacket sleeve
      roughness: 0.78,
      metalness: 0.08
    });

    const knuckleMat = new THREE.MeshStandardMaterial({
      color: 0x0f1115, // Hard polymer knuckle guard
      roughness: 0.35,
      metalness: 0.4
    });

    const gunmetalMat = new THREE.MeshStandardMaterial({
      color: 0x1c1f24, // Matte black anodized weapon receiver
      roughness: 0.28,
      metalness: 0.88
    });

    const barrelMat = new THREE.MeshStandardMaterial({
      color: 0x121417,
      roughness: 0.32,
      metalness: 0.92
    });

    const opticHousingMat = new THREE.MeshStandardMaterial({
      color: 0x2b2e35, // EOTech style matte magnesium housing
      roughness: 0.45,
      metalness: 0.6
    });

    const glassLensMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      roughness: 0.05,
      metalness: 0.95,
      transparent: true,
      opacity: 0.35,
      clearcoat: 1.0
    });

    const reticleMat = new THREE.MeshBasicMaterial({
      color: 0xff3b30, // Vibrant glowing red holographic reticle dot
      transparent: true,
      opacity: 0.95
    });

    // 2. Weapon Hierarchy
    this.weaponGroup = new THREE.Group();
    this.weaponGroup.name = 'FP_HeroWeapon';

    // Receiver (Upper & Lower)
    const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.09, 0.34), gunmetalMat);
    receiver.position.set(0, 0, 0);
    this.weaponGroup.add(receiver);

    // Top Picatinny Rail
    const picatinnyRail = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.015, 0.38), gunmetalMat);
    picatinnyRail.position.set(0, 0.052, 0.02);
    this.weaponGroup.add(picatinnyRail);

    // Mechanical Bolt Slide Carrier (Cycles on fire)
    this.boltSlide = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.035, 0.09), gunmetalMat);
    this.boltSlide.position.set(0.028, 0.022, 0.02);
    this.weaponGroup.add(this.boltSlide);

    // Ejection Port Opening
    const ejectPortFrame = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.042, 0.11), gunmetalMat);
    ejectPortFrame.position.set(0.027, 0.022, 0.02);
    this.weaponGroup.add(ejectPortFrame);

    // Handguard & Barrel Shroud with Venting Slots
    const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.065, 0.28), gunmetalMat);
    handguard.position.set(0, 0.005, 0.28);
    this.weaponGroup.add(handguard);

    // Fluted Chrome-Lined Barrel & Muzzle Brake
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.36, 12), barrelMat);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.012, 0.42);
    this.weaponGroup.add(barrel);

    const muzzleBrake = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.06, 8), barrelMat);
    muzzleBrake.rotation.x = Math.PI / 2;
    muzzleBrake.position.set(0, 0.012, 0.62);
    this.weaponGroup.add(muzzleBrake);

    // Muzzle tip position for raycasting & muzzle flash
    this.muzzleTip = new THREE.Object3D();
    this.muzzleTip.position.set(0, 0.012, 0.66);
    this.weaponGroup.add(this.muzzleTip);

    // Procedural Muzzle Flash Mesh
    const flashMat = new THREE.MeshBasicMaterial({ color: 0xffea00, transparent: true, opacity: 0 });
    this.muzzleFlash = new THREE.Mesh(new THREE.OctahedronGeometry(0.09, 0), flashMat);
    this.muzzleFlash.position.set(0, 0.012, 0.70);
    this.weaponGroup.add(this.muzzleFlash);

    // 3. EOTech Holographic Optic Sight Housing
    const opticMount = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.025, 0.10), opticHousingMat);
    opticMount.position.set(0, 0.068, 0.04);
    this.weaponGroup.add(opticMount);

    const opticHood = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.052, 0.12), opticHousingMat);
    opticHood.position.set(0, 0.095, 0.04);
    this.weaponGroup.add(opticHood);

    // Glass Window Inside Optic
    const opticGlass = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.042, 0.005), glassLensMat);
    opticGlass.position.set(0, 0.095, 0.04);
    this.weaponGroup.add(opticGlass);

    // Glowing Red Holographic Reticle Dot (Target Point of Sight)
    const reticleDot = new THREE.Mesh(new THREE.SphereGeometry(0.0035, 8, 8), reticleMat);
    reticleDot.position.set(0, 0.095, 0.045);
    this.weaponGroup.add(reticleDot);

    // 4. Detachable Curved Magazine & Pistol Grip
    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.18, 0.075), gunmetalMat);
    mag.rotation.x = -Math.PI / 10;
    mag.position.set(0, -0.11, 0.10);
    this.weaponGroup.add(mag);

    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.065), gloveMat);
    grip.rotation.x = -Math.PI / 6;
    grip.position.set(0, -0.09, -0.06);
    this.weaponGroup.add(grip);

    // 5. Right Arm & Gloved Hand (Trigger Hand)
    this.rightArmGroup = new THREE.Group();
    // Sleeve Forearm
    const rSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.32, 10), sleeveMat);
    rSleeve.rotation.x = Math.PI / 3;
    rSleeve.rotation.z = -Math.PI / 8;
    rSleeve.position.set(0.12, -0.18, -0.18);
    this.rightArmGroup.add(rSleeve);

    // Gloved Hand Palm & Knuckles
    const rPalm = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.075, 0.045), gloveMat);
    rPalm.position.set(0.035, -0.09, -0.04);
    this.rightArmGroup.add(rPalm);

    const rKnuckles = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.02, 0.03), knuckleMat);
    rKnuckles.position.set(0.04, -0.07, -0.03);
    this.rightArmGroup.add(rKnuckles);

    // Trigger Finger curling into guard
    const rTriggerFinger = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.055, 6), gloveMat);
    rTriggerFinger.rotation.z = Math.PI / 2.5;
    rTriggerFinger.position.set(0.02, -0.06, 0.01);
    this.rightArmGroup.add(rTriggerFinger);

    this.weaponGroup.add(this.rightArmGroup);

    // 6. Left Arm & Gloved Hand (Support Hand on Handguard)
    this.leftArmGroup = new THREE.Group();
    // Sleeve Forearm reaching across
    const lSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.34, 10), sleeveMat);
    lSleeve.rotation.x = Math.PI / 3.5;
    lSleeve.rotation.y = -Math.PI / 6;
    lSleeve.position.set(-0.16, -0.16, 0.08);
    this.leftArmGroup.add(lSleeve);

    // Support Hand cupping the underside of handguard
    const lPalm = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.065, 0.055), gloveMat);
    lPalm.position.set(-0.02, -0.025, 0.28);
    this.leftArmGroup.add(lPalm);

    const lThumb = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.06, 6), gloveMat);
    lThumb.rotation.z = -Math.PI / 3;
    lThumb.position.set(-0.045, 0.01, 0.29);
    this.leftArmGroup.add(lThumb);

    this.weaponGroup.add(this.leftArmGroup);

    // Attach to root
    this.viewmodelRoot.add(this.weaponGroup);
    this.viewmodelRoot.position.copy(this.hipOffset);
  }

  setADS(active) {
    this.isADS = active;
  }

  triggerFireRecoil() {
    this.recoilZ = 0.048; // Kick back toward camera
    this.recoilPitch = -0.032; // Muzzle climb
    this.recoilYaw = (Math.random() - 0.5) * 0.012;

    // Bolt slide cycle back
    if (this.boltSlide) {
      this.boltSlide.position.z = -0.035;
    }

    // Flash burst
    if (this.muzzleFlash) {
      this.muzzleFlash.material.opacity = 1.0;
      this.muzzleFlash.rotation.z = Math.random() * Math.PI * 2;
    }

    // Eject spent brass casing in world space
    this.ejectSpentBrass();
  }

  ejectSpentBrass() {
    const worldPos = new THREE.Vector3();
    if (this.boltSlide) {
      this.boltSlide.getWorldPosition(worldPos);
    } else {
      this.weaponGroup.getWorldPosition(worldPos);
    }

    const shellGeo = new THREE.CylinderGeometry(0.009, 0.009, 0.036, 6);
    const shellMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Polished brass
      metalness: 0.95,
      roughness: 0.18
    });
    const shellMesh = new THREE.Mesh(shellGeo, shellMat);
    shellMesh.position.copy(worldPos);
    this.scene.add(shellMesh);

    // Ejection vector: to right and slightly up/back
    const camDir = new THREE.Vector3();
    this.camera.getWorldDirection(camDir);
    const camRight = new THREE.Vector3().crossVectors(camDir, new THREE.Vector3(0, 1, 0)).normalize();

    const velocity = camRight.clone().multiplyScalar(2.2 + Math.random() * 0.8)
      .add(new THREE.Vector3(0, 1.8 + Math.random() * 0.6, 0))
      .addScaledVector(camDir, -0.6);

    this.shellCasings.push({
      mesh: shellMesh,
      velocity: velocity,
      rotSpeed: new THREE.Vector3(15 + Math.random() * 10, 12 + Math.random() * 8, 0),
      life: 1.8
    });
  }

  update(delta, isMoving = false, isSprinting = false) {
    // 1. Smooth ADS Transition Lerp
    const targetAds = this.isADS ? 1.0 : 0.0;
    this.adsProgress = THREE.MathUtils.lerp(this.adsProgress, targetAds, delta * 14);

    // 2. Lissajous Idle Breathing Sway & Movement Bob
    this.swayTimer += delta * (this.isADS ? 1.2 : 2.0);
    const swayAmp = this.isADS ? 0.0008 : 0.0035;
    const swayX = Math.sin(this.swayTimer) * swayAmp;
    const swayY = Math.cos(this.swayTimer * 2) * (swayAmp * 0.7);

    // Figure-8 Footstep Movement Bob
    let bobX = 0;
    let bobY = 0;
    if (isMoving) {
      const bobFreq = isSprinting ? 14 : 9;
      const bobAmp = isSprinting ? 0.024 : (this.isADS ? 0.003 : 0.012);
      this.bobTimer += delta * bobFreq;
      bobX = Math.sin(this.bobTimer * 0.5) * bobAmp;
      bobY = Math.abs(Math.cos(this.bobTimer)) * bobAmp * 0.8;
    }

    // 3. Interpolate Target Offset (Hip vs ADS)
    const targetOffset = new THREE.Vector3().lerpVectors(this.hipOffset, this.adsOffset, this.adsProgress);
    targetOffset.x += swayX + bobX;
    targetOffset.y += swayY - bobY;

    // Apply Recoil Springs
    this.recoilZ = THREE.MathUtils.lerp(this.recoilZ, 0, delta * 18);
    this.recoilPitch = THREE.MathUtils.lerp(this.recoilPitch, 0, delta * 16);
    this.recoilYaw = THREE.MathUtils.lerp(this.recoilYaw, 0, delta * 16);

    targetOffset.z -= this.recoilZ;

    this.currentPosition.lerp(targetOffset, delta * 20);
    this.viewmodelRoot.position.copy(this.currentPosition);

    // Rotate weapon for recoil climb and canting
    const targetRotX = this.recoilPitch;
    const targetRotY = this.recoilYaw;
    const targetRotZ = (this.isADS ? 0.0 : -0.04) + bobX * 1.5;
    this.viewmodelRoot.rotation.set(targetRotX, targetRotY, targetRotZ);

    // 4. Recover Bolt Slide
    if (this.boltSlide) {
      this.boltSlide.position.z = THREE.MathUtils.lerp(this.boltSlide.position.z, 0.02, delta * 25);
    }

    // 5. Fade Muzzle Flash
    if (this.muzzleFlash && this.muzzleFlash.material.opacity > 0) {
      this.muzzleFlash.material.opacity = Math.max(0, this.muzzleFlash.material.opacity - delta * 30);
    }

    // 6. Update Shell Casings (Physics Tumbling & Ground Bounce)
    for (let i = this.shellCasings.length - 1; i >= 0; i--) {
      const shell = this.shellCasings[i];
      shell.life -= delta;
      shell.velocity.y -= 9.8 * delta; // Gravity
      shell.mesh.position.addScaledVector(shell.velocity, delta);
      shell.mesh.rotation.x += shell.rotSpeed.x * delta;
      shell.mesh.rotation.y += shell.rotSpeed.y * delta;

      // Ground bounce
      if (shell.mesh.position.y <= 0.04) {
        shell.mesh.position.y = 0.04;
        shell.velocity.y = Math.abs(shell.velocity.y) * 0.35;
        shell.velocity.x *= 0.6;
        shell.velocity.z *= 0.6;
      }

      if (shell.life <= 0) {
        this.scene.remove(shell.mesh);
        this.shellCasings.splice(i, 1);
      }
    }
  }

  setVisible(visible) {
    this.viewmodelRoot.visible = visible;
  }
}
