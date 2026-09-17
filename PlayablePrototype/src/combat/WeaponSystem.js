// High-Fidelity Weapon System: Original Weapons, Ballistics, Recoil, Shell Ejections, and Impact VFX
// BENGALURU: LAST CITY - Phase 2 Overhaul
import * as THREE from 'three';

export const WEAPON_REGISTRY = {
  ar9: {
    id: 'ar9',
    name: 'AR-9 BANGALORE SPECIAL',
    type: 'Assault Rifle',
    caliber: '5.56x45mm NATO',
    maxClip: 30,
    reserveMax: 150,
    fireRate: 0.105, // ~570 RPM
    damage: 34,
    recoilVertical: 0.024,
    recoilHorizontal: 0.008,
    cameraKick: 0.018,
    reloadTime: 1.8,
    emptyReloadTime: 2.2,
    bulletVelocity: 240,
    spreadHip: 0.022,
    spreadADS: 0.003,
    colorTrim: 0xff9100 // Amber trim
  },
  kestrel: {
    id: 'kestrel',
    name: 'KESTREL AR-5',
    type: 'Bullpup Carbine',
    caliber: '5.56x45mm Lightweight',
    maxClip: 30,
    reserveMax: 150,
    fireRate: 0.085, // ~700 RPM
    damage: 28,
    recoilVertical: 0.014,
    recoilHorizontal: 0.005,
    cameraKick: 0.011,
    reloadTime: 1.6,
    emptyReloadTime: 1.9,
    bulletVelocity: 260,
    spreadHip: 0.018,
    spreadADS: 0.002,
    colorTrim: 0x00e5ff // Cyan trim
  },
  raven: {
    id: 'raven',
    name: 'RAVEN ARX',
    type: 'Heavy Battle Rifle',
    caliber: '7.62x51mm AP',
    maxClip: 20,
    reserveMax: 100,
    fireRate: 0.14, // ~430 RPM
    damage: 52,
    recoilVertical: 0.038,
    recoilHorizontal: 0.014,
    cameraKick: 0.028,
    reloadTime: 2.1,
    emptyReloadTime: 2.6,
    bulletVelocity: 280,
    spreadHip: 0.032,
    spreadADS: 0.004,
    colorTrim: 0xd50000 // Crimson trim
  },
  pulse9: {
    id: 'pulse9',
    name: 'PULSE-9 CQB',
    type: 'Tactical SMG',
    caliber: '9x19mm Parabellum',
    maxClip: 32,
    reserveMax: 160,
    fireRate: 0.07, // ~850 RPM
    damage: 22,
    recoilVertical: 0.016,
    recoilHorizontal: 0.012,
    cameraKick: 0.012,
    reloadTime: 1.4,
    emptyReloadTime: 1.7,
    bulletVelocity: 190,
    spreadHip: 0.026,
    spreadADS: 0.006,
    colorTrim: 0x76ff03 // Lime trim
  },
  longshot: {
    id: 'longshot',
    name: 'LONGSHOT X',
    type: 'Precision Marksman Rifle',
    caliber: '.338 Bangalore Lapua',
    maxClip: 5,
    reserveMax: 30,
    fireRate: 0.85, // Single action
    damage: 110,
    recoilVertical: 0.065,
    recoilHorizontal: 0.018,
    cameraKick: 0.045,
    reloadTime: 2.8,
    emptyReloadTime: 3.4,
    bulletVelocity: 360,
    spreadHip: 0.055,
    spreadADS: 0.0005,
    colorTrim: 0xffd600 // Gold trim
  }
};

export class WeaponSystem {
  constructor(scene, camera, audioManager) {
    this.scene = scene;
    this.camera = camera;
    this.audioManager = audioManager;

    this.hasWeapon = true;
    this.currentWeaponKey = 'ar9';
    this.activeConfig = WEAPON_REGISTRY.ar9;

    this.isAiming = false;
    this.isADS = false;
    this.isFiring = false;
    this.isReloading = false;
    this.reloadProgress = 0;

    // Ammo Pools
    this.clipAmmo = this.activeConfig.maxClip;
    this.reserveAmmo = 120;
    this.fireTimer = 0;
    this.fireMode = 'AUTO'; // 'AUTO', 'BURST', 'SINGLE'

    // Recoil spring states
    this.weaponRecoilZ = 0; // backward push
    this.weaponRecoilPitch = 0; // muzzle climb
    this.weaponRecoilYaw = 0; // muzzle kick

    // Active particle systems
    this.tracers = [];
    this.impactParticles = [];
    this.shellCasings = [];

    // Weapon 3D Models
    this.weaponRoot = new THREE.Group();
    this.weaponMeshes = {};
    this.buildAllWeaponModels();

    // Muzzle flash point light
    this.muzzleLight = new THREE.PointLight(0xffb300, 0, 15);
    this.scene.add(this.muzzleLight);

    this.switchWeapon('ar9');
  }

  toggleFireMode() {
    if (this.fireMode === 'AUTO') {
      this.fireMode = 'BURST';
    } else if (this.fireMode === 'BURST') {
      this.fireMode = 'SINGLE';
    } else {
      this.fireMode = 'AUTO';
    }
    if (this.audioManager) this.audioManager.playUIBeep(580);
    return this.fireMode;
  }

  buildAllWeaponModels() {
    for (const [key, config] of Object.entries(WEAPON_REGISTRY)) {
      const model = this.createDetailedWeaponMesh(config);
      model.visible = false;
      this.weaponMeshes[key] = model;
      this.weaponRoot.add(model);
    }
  }

  createDetailedWeaponMesh(config) {
    const group = new THREE.Group();

    // Materials
    const gunmetalMat = new THREE.MeshStandardMaterial({
      color: 0x181a1d,
      metalness: 0.85,
      roughness: 0.28
    });
    const mattePolymerMat = new THREE.MeshStandardMaterial({
      color: 0x121316,
      roughness: 0.75,
      metalness: 0.1
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: config.colorTrim,
      roughness: 0.4,
      metalness: 0.6
    });
    const glassLensMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.65
    });

    // 1. Lower & Upper Receiver
    const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.12, 0.44), gunmetalMat);
    receiver.position.set(0, 0, 0);
    receiver.castShadow = true;
    group.add(receiver);

    // Ejection port on right side
    const ejectPort = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.04, 0.10), gunmetalMat);
    ejectPort.position.set(0.034, 0.03, 0.02);
    group.add(ejectPort);
    group.userData.ejectionPort = ejectPort;

    // Top Picatinny Rail
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.42), gunmetalMat);
    rail.position.set(0, 0.07, 0.02);
    group.add(rail);

    // 2. Tactical Handguard & Barrel Shroud
    const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.32), mattePolymerMat);
    handguard.position.set(0, 0.01, 0.36);
    handguard.castShadow = true;
    group.add(handguard);

    // Fluted Barrel
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.38, 10), gunmetalMat);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.02, 0.52);
    group.add(barrel);

    // Muzzle Brake / Flash Compensator
    const muzzleBrake = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.035, 0.08), accentMat);
    muzzleBrake.position.set(0, 0.02, 0.72);
    group.add(muzzleBrake);
    group.userData.muzzleTip = muzzleBrake;

    // Muzzle Flash Star Mesh (Hidden by default)
    const flashMat = new THREE.MeshBasicMaterial({ color: 0xffea00, transparent: true, opacity: 0 });
    const flashMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.14, 0), flashMat);
    flashMesh.position.set(0, 0.02, 0.82);
    group.add(flashMesh);
    group.userData.flashMesh = flashMesh;

    // 3. Ergonomic Pistol Grip
    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.16, 0.08), mattePolymerMat);
    grip.rotation.x = -Math.PI / 7;
    grip.position.set(0, -0.12, -0.06);
    group.add(grip);

    // Trigger Guard & Trigger
    const triggerGuard = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.06, 0.07), gunmetalMat);
    triggerGuard.position.set(0, -0.08, 0.01);
    group.add(triggerGuard);

    // 4. Detachable Curved Magazine
    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.22, 0.09), mattePolymerMat);
    mag.rotation.x = -Math.PI / 9;
    mag.position.set(0, -0.16, 0.12);
    mag.castShadow = true;
    group.add(mag);
    group.userData.magazine = mag;

    // 5. Tactical Stock
    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.14, 0.26), mattePolymerMat);
    stock.position.set(0, -0.02, -0.32);
    stock.castShadow = true;
    group.add(stock);

    // 6. Holographic Optical Sight
    const opticMount = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.06, 0.11), accentMat);
    opticMount.position.set(0, 0.11, 0.06);
    group.add(opticMount);

    const opticLens = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.045, 0.01), glassLensMat);
    opticLens.position.set(0, 0.12, 0.06);
    group.add(opticLens);

    return group;
  }

  attachToPlayer(playerWeaponSocket) {
    if (playerWeaponSocket) {
      playerWeaponSocket.add(this.weaponRoot);
      // Position weapon so stock rests in shoulder pocket
      this.weaponRoot.position.set(0, 0.08, 0.12);
      this.weaponRoot.rotation.set(0, 0, 0);
    }
  }

  switchWeapon(weaponKey) {
    if (!WEAPON_REGISTRY[weaponKey]) return;
    this.currentWeaponKey = weaponKey;
    this.activeConfig = WEAPON_REGISTRY[weaponKey];

    // Toggle active 3D model
    for (const [key, mesh] of Object.entries(this.weaponMeshes)) {
      mesh.visible = (key === weaponKey);
    }

    this.clipAmmo = this.activeConfig.maxClip;
    this.fireTimer = 0;
    this.isReloading = false;
  }

  setAiming(isAiming, isADS = false) {
    this.isAiming = isAiming;
    this.isADS = isADS;
  }

  startFire() {
    this.isFiring = true;
  }

  stopFire() {
    this.isFiring = false;
  }

  reload() {
    if (this.isReloading || this.clipAmmo >= this.activeConfig.maxClip || this.reserveAmmo <= 0) return;

    this.isReloading = true;
    const isEmpty = (this.clipAmmo === 0);
    const duration = isEmpty ? this.activeConfig.emptyReloadTime : this.activeConfig.reloadTime;
    this.reloadDuration = duration;
    this.reloadTimer = 0;

    // Audio cue for magazine drop
    this.audioManager.playUIBeep(320);

    setTimeout(() => {
      const needed = this.activeConfig.maxClip - this.clipAmmo;
      const take = Math.min(needed, this.reserveAmmo);
      this.clipAmmo += take;
      this.reserveAmmo -= take;
      this.isReloading = false;
      // Audio cue for fresh magazine seated & bolt chambered
      this.audioManager.playUIBeep(640);
    }, duration * 1000);
  }

  update(delta, camera, isPlayerInVehicle, cameraSystem = null) {
    if (isPlayerInVehicle) {
      this.weaponRoot.visible = false;
      return;
    }
    this.weaponRoot.visible = true;

    // 1. Firing Loop with Individual Fire Rates
    this.fireTimer += delta;
    if (this.isFiring && this.fireTimer >= this.activeConfig.fireRate && !this.isReloading) {
      this.fireTimer = 0;
      if (this.clipAmmo > 0) {
        this.executeShot(camera, cameraSystem);
      } else {
        this.reload();
      }
    }

    // 2. Weapon Recoil Spring Recovery
    this.weaponRecoilZ = THREE.MathUtils.lerp(this.weaponRecoilZ, 0, delta * 18);
    this.weaponRecoilPitch = THREE.MathUtils.lerp(this.weaponRecoilPitch, 0, delta * 16);
    this.weaponRecoilYaw = THREE.MathUtils.lerp(this.weaponRecoilYaw, 0, delta * 16);

    // Apply recoil translation & rotation to active model
    const currentModel = this.weaponMeshes[this.currentWeaponKey];
    if (currentModel) {
      currentModel.position.z = -this.weaponRecoilZ;
      currentModel.rotation.x = this.weaponRecoilPitch;
      currentModel.rotation.y = this.weaponRecoilYaw;

      // Reload animation: magazine drops down and recovers
      if (this.isReloading && currentModel.userData.magazine) {
        this.reloadTimer = (this.reloadTimer || 0) + delta;
        const progress = Math.min(1.0, this.reloadTimer / this.reloadDuration);
        const magDrop = Math.sin(progress * Math.PI) * 0.16;
        currentModel.userData.magazine.position.y = -0.16 - magDrop;
      } else if (currentModel.userData.magazine) {
        currentModel.userData.magazine.position.y = -0.16;
      }

      // Mechanical bolt slide cycling recovery
      if (currentModel.userData.ejectionPort) {
        currentModel.userData.ejectionPort.position.z = THREE.MathUtils.lerp(
          currentModel.userData.ejectionPort.position.z,
          0.02,
          delta * 22
        );
      }

      // Decay muzzle flash opacity
      if (currentModel.userData.flashMesh && currentModel.userData.flashMesh.material.opacity > 0) {
        currentModel.userData.flashMesh.material.opacity = Math.max(0, currentModel.userData.flashMesh.material.opacity - delta * 25);
      }
    }

    // Decay muzzle light
    if (this.muzzleLight.intensity > 0) {
      this.muzzleLight.intensity = Math.max(0, this.muzzleLight.intensity - delta * 45);
    }

    // 3. Bullet Tracers Update
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const tracer = this.tracers[i];
      tracer.life -= delta;
      tracer.mesh.position.addScaledVector(tracer.velocity, delta);

      if (tracer.life <= 0) {
        this.scene.remove(tracer.mesh);
        this.tracers.splice(i, 1);
      }
    }

    // 4. Brass Shell Casings Update (Physics Tumbling)
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
        shell.velocity.y = Math.abs(shell.velocity.y) * 0.35; // Dampened bounce
        shell.velocity.x *= 0.6;
        shell.velocity.z *= 0.6;
      }

      if (shell.life <= 0) {
        this.scene.remove(shell.mesh);
        this.shellCasings.splice(i, 1);
      }
    }

    // 5. Impact Particles Update
    for (let i = this.impactParticles.length - 1; i >= 0; i--) {
      const part = this.impactParticles[i];
      part.life -= delta;
      part.mesh.position.addScaledVector(part.velocity, delta);
      part.mesh.scale.multiplyScalar(0.94);

      if (part.life <= 0) {
        this.scene.remove(part.mesh);
        this.impactParticles.splice(i, 1);
      }
    }
  }

  executeShot(camera, cameraSystem) {
    this.clipAmmo--;
    const currentModel = this.weaponMeshes[this.currentWeaponKey];
    if (!currentModel) return;

    // 1. Recoil Impulse & Mechanical Bolt Kick
    this.weaponRecoilZ = 0.08;
    this.weaponRecoilPitch = -this.activeConfig.recoilVertical * 1.5;
    this.weaponRecoilYaw = (Math.random() - 0.5) * this.activeConfig.recoilHorizontal * 2.0;

    if (currentModel.userData.ejectionPort) {
      currentModel.userData.ejectionPort.position.z = -0.04; // Kick back
    }

    // Apply Camera Recoil Kick
    if (cameraSystem) {
      cameraSystem.addRecoilImpulse(this.activeConfig.cameraKick, this.activeConfig.recoilHorizontal);
    }

    // 2. Muzzle Flash & Point Light
    const worldMuzzlePos = new THREE.Vector3();
    if (currentModel.userData.muzzleTip) {
      currentModel.userData.muzzleTip.getWorldPosition(worldMuzzlePos);
    } else {
      currentModel.getWorldPosition(worldMuzzlePos);
    }

    this.muzzleLight.position.copy(worldMuzzlePos);
    this.muzzleLight.intensity = 4.0;

    if (currentModel.userData.flashMesh) {
      currentModel.userData.flashMesh.material.opacity = 1.0;
      currentModel.userData.flashMesh.rotation.z = Math.random() * Math.PI * 2;
    }

    // 3. Brass Shell Ejection
    this.ejectShellCasing(currentModel);

    // 4. Audio Synthesis
    this.playAcousticGunshot(this.activeConfig.caliber);

    // 5. Raycasting Shot & Bullet Spread
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

    const aimDir = raycaster.ray.direction.clone();
    const spread = this.isADS ? this.activeConfig.spreadADS : (this.isAiming ? this.activeConfig.spreadHip * 0.5 : this.activeConfig.spreadHip);
    aimDir.x += (Math.random() - 0.5) * spread;
    aimDir.y += (Math.random() - 0.5) * spread;
    aimDir.normalize();

    // 6. Luminous Bullet Tracer Mesh
    const tracerGeo = new THREE.CylinderGeometry(0.035, 0.035, 2.4, 6);
    const tracerMat = new THREE.MeshBasicMaterial({ color: 0xffea00 });
    const tracerMesh = new THREE.Mesh(tracerGeo, tracerMat);

    tracerMesh.position.copy(worldMuzzlePos);
    tracerMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), aimDir);
    this.scene.add(tracerMesh);

    this.tracers.push({
      mesh: tracerMesh,
      velocity: aimDir.clone().multiplyScalar(this.activeConfig.bulletVelocity),
      life: 0.9
    });

    // 7. Impact Detection & Surface-Specific VFX
    const hitDistance = 40 + Math.random() * 35;
    const impactPoint = worldMuzzlePos.clone().addScaledVector(aimDir, hitDistance);

    // Detect surface type based on elevation and position
    let surfaceType = 'ROAD';
    if (impactPoint.y > 1.5) surfaceType = 'CONCRETE';
    if (impactPoint.y > 12.0) surfaceType = 'METAL'; // Metro track / station
    if (Math.abs(impactPoint.x) > 120 && impactPoint.z < -100) surfaceType = 'GLASS'; // Tech Park glass

    this.spawnSurfaceImpactVFX(impactPoint, surfaceType, aimDir);
  }

  ejectShellCasing(currentModel) {
    const ejectWorldPos = new THREE.Vector3();
    if (currentModel.userData.ejectionPort) {
      currentModel.userData.ejectionPort.getWorldPosition(ejectWorldPos);
    } else {
      currentModel.getWorldPosition(ejectWorldPos);
    }

    const shellGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.045, 6);
    const shellMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.2 });
    const shellMesh = new THREE.Mesh(shellGeo, shellMat);
    shellMesh.position.copy(ejectWorldPos);
    this.scene.add(shellMesh);

    // Eject to the right and slightly upward/backward
    const velocity = new THREE.Vector3(
      1.8 + Math.random() * 1.2,
      2.2 + Math.random() * 0.8,
      -0.8 + Math.random() * 0.6
    );

    this.shellCasings.push({
      mesh: shellMesh,
      velocity: velocity,
      rotSpeed: new THREE.Vector3(12 + Math.random() * 10, 8 + Math.random() * 8, 0),
      life: 2.2
    });
  }

  spawnSurfaceImpactVFX(position, surfaceType, incidentDir) {
    const particleCount = (surfaceType === 'METAL') ? 16 : 10;

    let color = 0x888888; // Default concrete dust
    if (surfaceType === 'METAL') color = 0xffab00; // Glowing ricochet sparks
    else if (surfaceType === 'GLASS') color = 0x80deea; // Glass shards
    else if (surfaceType === 'ROAD') color = 0x333333; // Asphalt pulverized bits

    const partGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    const partMat = new THREE.MeshBasicMaterial({ color: color });

    for (let i = 0; i < particleCount; i++) {
      const partMesh = new THREE.Mesh(partGeo, partMat);
      partMesh.position.copy(position);
      this.scene.add(partMesh);

      // Bounce back in opposite direction of bullet
      const bounceVelocity = incidentDir.clone().negate().multiplyScalar(4 + Math.random() * 6);
      bounceVelocity.x += (Math.random() - 0.5) * 6;
      bounceVelocity.y += (Math.random() - 0.2) * 5;
      bounceVelocity.z += (Math.random() - 0.5) * 6;

      this.impactParticles.push({
        mesh: partMesh,
        velocity: bounceVelocity,
        life: 0.25 + Math.random() * 0.25
      });
    }
  }

  playAcousticGunshot(caliber) {
    if (!this.audioManager || !this.audioManager.ctx) return;
    const ctx = this.audioManager.ctx;

    // 1. High frequency snappy transient crack
    const oscCrack = ctx.createOscillator();
    const gainCrack = ctx.createGain();
    oscCrack.type = 'sawtooth';
    oscCrack.frequency.setValueAtTime(420, ctx.currentTime);
    oscCrack.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.11);
    gainCrack.gain.setValueAtTime(0.32, ctx.currentTime);
    gainCrack.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.13);
    oscCrack.connect(gainCrack);
    gainCrack.connect(this.audioManager.masterGain);
    oscCrack.start();
    oscCrack.stop(ctx.currentTime + 0.14);

    // 2. Low-frequency punch boom
    const oscBoom = ctx.createOscillator();
    const gainBoom = ctx.createGain();
    oscBoom.type = 'sine';
    oscBoom.frequency.setValueAtTime(140, ctx.currentTime);
    oscBoom.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 0.22);
    gainBoom.gain.setValueAtTime(0.28, ctx.currentTime);
    gainBoom.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.24);
    oscBoom.connect(gainBoom);
    gainBoom.connect(this.audioManager.masterGain);
    oscBoom.start();
    oscBoom.stop(ctx.currentTime + 0.25);
  }
}
