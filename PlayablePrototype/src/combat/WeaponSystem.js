// Weapon System: AR-9 Bangalore Special Assault Rifle, ADS Aiming, Tracers, and Ballistics
import * as THREE from 'three';

export class WeaponSystem {
  constructor(scene, camera, audioManager) {
    this.scene = scene;
    this.camera = camera;
    this.audioManager = audioManager;

    this.hasWeapon = true;
    this.weaponType = 'ar9'; // 'ar9' or 'pistol'
    this.isAiming = false;
    this.isFiring = false;

    this.clipAmmo = 30;
    this.maxClip = 30;
    this.reserveAmmo = 120;
    this.fireRate = 0.11; // ~550 RPM
    this.fireTimer = 0;
    this.isReloading = false;

    this.tracers = [];
    this.impactSparks = [];

    this.mesh = this.buildRifleMesh();
    this.muzzleLight = new THREE.PointLight(0xffb300, 0, 10);
    this.scene.add(this.muzzleLight);
  }

  buildRifleMesh() {
    const group = new THREE.Group();

    const metalMat = new THREE.MeshStandardMaterial({ color: 0x212529, metalness: 0.9, roughness: 0.25 });
    const polymerMat = new THREE.MeshStandardMaterial({ color: 0x111315, roughness: 0.7 });
    const saffronTrimMat = new THREE.MeshStandardMaterial({ color: 0xff9100, roughness: 0.4 }); // Bengaluru Accent Trim

    // Receiver Body
    const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.48), metalMat);
    receiver.position.set(0, 0, 0);
    group.add(receiver);

    // Barrel & Muzzle Shroud
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.36, 8), metalMat);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.03, 0.38);
    group.add(barrel);

    // Muzzle Brake
    const muzzle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.06), saffronTrimMat);
    muzzle.position.set(0, 0.03, 0.58);
    group.add(muzzle);
    this.muzzleTip = muzzle;

    // Curved Banana Magazine
    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.24, 0.1), polymerMat);
    mag.rotation.x = -Math.PI / 8;
    mag.position.set(0, -0.16, 0.12);
    group.add(mag);

    // Tactical Stock
    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.16, 0.28), polymerMat);
    stock.position.set(0, -0.04, -0.32);
    group.add(stock);

    // Holographic Sight Mount
    const sight = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.06, 0.12), saffronTrimMat);
    sight.position.set(0, 0.1, 0.05);
    group.add(sight);

    group.scale.set(0.9, 0.9, 0.9);
    return group;
  }

  attachToPlayer(playerRightArm) {
    if (playerRightArm) {
      playerRightArm.add(this.mesh);
      this.mesh.position.set(0, -0.32, 0.22);
      this.mesh.rotation.set(Math.PI / 2, 0, 0);
    }
  }

  setAiming(isAiming) {
    this.isAiming = isAiming;
  }

  startFire() {
    this.isFiring = true;
  }

  stopFire() {
    this.isFiring = false;
  }

  reload() {
    if (this.isReloading || this.clipAmmo >= this.maxClip || this.reserveAmmo <= 0) return;

    this.isReloading = true;
    this.audioManager.playUIBeep(380);

    setTimeout(() => {
      const needed = this.maxClip - this.clipAmmo;
      const take = Math.min(needed, this.reserveAmmo);
      this.clipAmmo += take;
      this.reserveAmmo -= take;
      this.isReloading = false;
      this.audioManager.playUIBeep(720);
    }, 1200);
  }

  update(delta, camera, isPlayerInVehicle) {
    if (isPlayerInVehicle) {
      this.mesh.visible = false;
      return;
    }
    this.mesh.visible = true;

    // Firing loop
    this.fireTimer += delta;
    if (this.isFiring && this.fireTimer >= this.fireRate && !this.isReloading) {
      this.fireTimer = 0;
      if (this.clipAmmo > 0) {
        this.executeShot(camera);
      } else {
        this.reload();
      }
    }

    // Decay muzzle light
    if (this.muzzleLight.intensity > 0) {
      this.muzzleLight.intensity = Math.max(0, this.muzzleLight.intensity - delta * 35);
    }

    // Update active bullet tracers
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const tracer = this.tracers[i];
      tracer.life -= delta;
      tracer.mesh.position.addScaledVector(tracer.velocity, delta);

      if (tracer.life <= 0) {
        this.scene.remove(tracer.mesh);
        this.tracers.splice(i, 1);
      }
    }

    // Update impact sparks
    for (let i = this.impactSparks.length - 1; i >= 0; i--) {
      const spark = this.impactSparks[i];
      spark.life -= delta;
      spark.mesh.scale.multiplyScalar(0.92);
      if (spark.life <= 0) {
        this.scene.remove(spark.mesh);
        this.impactSparks.splice(i, 1);
      }
    }
  }

  executeShot(camera) {
    this.clipAmmo--;

    // Gunshot Audio synthesis
    this.playGunshotAudio();

    // Muzzle flash point light
    const worldMuzzlePos = new THREE.Vector3();
    this.muzzleTip.getWorldPosition(worldMuzzlePos);
    this.muzzleLight.position.copy(worldMuzzlePos);
    this.muzzleLight.intensity = 3.5;

    // Raycast shot from camera center (crosshair target)
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

    // Aim direction with slight spread
    const aimDir = raycaster.ray.direction.clone();
    aimDir.x += (Math.random() - 0.5) * (this.isAiming ? 0.008 : 0.024);
    aimDir.y += (Math.random() - 0.5) * (this.isAiming ? 0.008 : 0.024);
    aimDir.normalize();

    // Spawn 3D Luminous Bullet Tracer
    const tracerGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.5, 6);
    const tracerMat = new THREE.MeshBasicMaterial({ color: 0xffd54f });
    const tracerMesh = new THREE.Mesh(tracerGeo, tracerMat);

    tracerMesh.position.copy(worldMuzzlePos);
    tracerMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), aimDir);
    this.scene.add(tracerMesh);

    this.tracers.push({
      mesh: tracerMesh,
      velocity: aimDir.clone().multiplyScalar(220), // 220 m/s tracer velocity
      life: 0.8
    });

    // Spawn impact sparks at estimated target distance
    const hitTargetPos = worldMuzzlePos.clone().addScaledVector(aimDir, 45 + Math.random() * 30);
    this.spawnImpactSparks(hitTargetPos);
  }

  spawnImpactSparks(pos) {
    const sparkGeo = new THREE.SphereGeometry(0.25, 6, 6);
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffab00 });
    const spark = new THREE.Mesh(sparkGeo, sparkMat);
    spark.position.copy(pos);
    this.scene.add(spark);

    this.impactSparks.push({ mesh: spark, life: 0.15 });
  }

  playGunshotAudio() {
    if (!this.audioManager.ctx) return;
    const ctx = this.audioManager.ctx;

    // Snappy transient pop + noise crack
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(380, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

    osc.connect(gain);
    gain.connect(this.audioManager.masterGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }
}
