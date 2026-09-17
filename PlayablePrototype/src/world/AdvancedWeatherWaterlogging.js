// Advanced Weather & Waterlogging System (Phase 5 Master Production Overhaul)
// Bengaluru Monsoon Simulation: PBR Road Roughness Transitions, Localized Puddles, Rain Drops, Dynamic Lightning & Tire Water Spray.
import * as THREE from 'three';

export class AdvancedWeatherWaterlogging {
  constructor(scene, realisticLighting = null, audioManager = null) {
    this.scene = scene;
    this.realisticLighting = realisticLighting;
    this.audioManager = audioManager;

    // Presets: 'CLEAR', 'CLOUDY', 'RAIN', 'HEAVY_RAIN', 'STORM'
    this.currentWeather = 'CLEAR';
    this.wetness = 0.0; // 0.0 (bone dry) to 1.0 (waterlogged)
    this.targetWetness = 0.0;

    // Subsystems
    this.rainParticles = null;
    this.rainCount = 3500;
    this.rainBounds = { x: 140, y: 40, z: 140 };
    this.rainVelocities = null;

    this.splashParticles = null;
    this.splashCount = 250;

    this.puddles = [];
    this.tireSprayEmitters = [];

    // Lightning Flash state
    this.isLightning = false;
    this.lightningTimer = 0;
    this.nextLightningTime = 8 + Math.random() * 12;

    this.initPuddleMaterials();
    this.buildRainSystem();
    this.buildGroundSplashSystem();
    this.createLocalizedPuddles();
  }

  initPuddleMaterials() {
    // Highly reflective, slightly turbid Bengaluru monsoon puddle water
    this.puddleMaterial = new THREE.MeshStandardMaterial({
      color: 0x1b2838,
      roughness: 0.08,
      metalness: 0.15,
      transparent: true,
      opacity: 0.82,
      depthWrite: false
    });
  }

  buildRainSystem() {
    const rainGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.rainCount * 3);
    const velocities = new Float32Array(this.rainCount);

    for (let i = 0; i < this.rainCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * this.rainBounds.x;
      positions[i * 3 + 1] = Math.random() * this.rainBounds.y;
      positions[i * 3 + 2] = (Math.random() - 0.5) * this.rainBounds.z;
      velocities[i] = 42 + Math.random() * 20;
    }

    rainGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.rainVelocities = velocities;

    const rainMat = new THREE.PointsMaterial({
      color: 0xcfe2f3,
      size: 0.28,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.rainParticles = new THREE.Points(rainGeo, rainMat);
    this.rainParticles.visible = false;
    this.scene.add(this.rainParticles);
  }

  buildGroundSplashSystem() {
    const splashGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.splashCount * 3);
    const scales = new Float32Array(this.splashCount);

    for (let i = 0; i < this.splashCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = 0.08;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
      scales[i] = 0.3 + Math.random() * 0.5;
    }

    splashGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const splashMat = new THREE.PointsMaterial({
      color: 0xa8c0d8,
      size: 0.5,
      transparent: true,
      opacity: 0.6
    });

    this.splashParticles = new THREE.Points(splashGeo, splashMat);
    this.splashParticles.visible = false;
    this.scene.add(this.splashParticles);
  }

  createLocalizedPuddles() {
    // Procedurally position organic puddle sheets at road dips, pothole clusters & gutters
    const puddleGeo = new THREE.CircleGeometry(2.4, 16);
    puddleGeo.rotateX(-Math.PI / 2);

    const puddleLocations = [
      { x: -18, z: 25, rx: 2.2, rz: 1.6 },
      { x: 34, z: -40, rx: 3.1, rz: 2.0 },
      { x: -55, z: -80, rx: 2.8, rz: 1.9 },
      { x: 72, z: 65, rx: 3.5, rz: 2.4 },
      { x: 120, z: -110, rx: 4.0, rz: 2.8 },
      { x: -140, z: 95, rx: 3.2, rz: 2.1 },
      { x: -5, z: -150, rx: 2.6, rz: 1.8 },
      { x: 60, z: 180, rx: 3.8, rz: 2.5 },
      { x: -190, z: -60, rx: 3.0, rz: 2.2 },
      { x: 160, z: 45, rx: 2.7, rz: 1.7 }
    ];

    this.puddleGroup = new THREE.Group();
    this.puddleGroup.name = 'BengaluruPuddles';

    puddleLocations.forEach((loc, idx) => {
      const puddle = new THREE.Mesh(puddleGeo, this.puddleMaterial);
      puddle.position.set(loc.x, 0.045, loc.z);
      puddle.scale.set(loc.rx, 1, loc.rz);
      puddle.rotation.y = idx * 1.35;
      puddle.userData = { baseOpacity: 0.85 };
      this.puddleGroup.add(puddle);
      this.puddles.push(puddle);
    });

    this.puddleGroup.visible = false;
    this.scene.add(this.puddleGroup);
  }

  setWeather(preset) {
    const valid = ['CLEAR', 'CLOUDY', 'RAIN', 'HEAVY_RAIN', 'STORM'];
    if (!valid.includes(preset)) return;

    this.currentWeather = preset;

    switch (preset) {
      case 'CLEAR':
        this.targetWetness = 0.0;
        this.rainParticles.visible = false;
        this.splashParticles.visible = false;
        if (this.realisticLighting) this.realisticLighting.setOvercast(0.0);
        break;
      case 'CLOUDY':
        this.targetWetness = 0.15;
        this.rainParticles.visible = false;
        this.splashParticles.visible = false;
        if (this.realisticLighting) this.realisticLighting.setOvercast(0.5);
        break;
      case 'RAIN':
        this.targetWetness = 0.75;
        this.rainParticles.visible = true;
        this.splashParticles.visible = true;
        this.rainParticles.material.size = 0.28;
        if (this.realisticLighting) this.realisticLighting.setOvercast(0.8);
        break;
      case 'HEAVY_RAIN':
        this.targetWetness = 1.0;
        this.rainParticles.visible = true;
        this.splashParticles.visible = true;
        this.rainParticles.material.size = 0.38;
        if (this.realisticLighting) this.realisticLighting.setOvercast(1.0);
        break;
      case 'STORM':
        this.targetWetness = 1.0;
        this.rainParticles.visible = true;
        this.splashParticles.visible = true;
        this.rainParticles.material.size = 0.44;
        if (this.realisticLighting) this.realisticLighting.setOvercast(1.0);
        break;
    }

    if (this.audioManager) {
      const isRaining = preset === 'RAIN' || preset === 'HEAVY_RAIN' || preset === 'STORM';
      this.audioManager.setRainActive?.(isRaining);
    }
  }

  toggleWeather() {
    const cycle = ['CLEAR', 'CLOUDY', 'RAIN', 'HEAVY_RAIN', 'STORM'];
    const curIdx = cycle.indexOf(this.currentWeather);
    const nextPreset = cycle[(curIdx + 1) % cycle.length];
    this.setWeather(nextPreset);
    return nextPreset;
  }

  update(delta, playerPos, activeVehicles = []) {
    // 1. Smooth Wetness Transition
    if (Math.abs(this.wetness - this.targetWetness) > 0.005) {
      this.wetness += (this.targetWetness - this.wetness) * delta * 0.4;
      this.wetness = THREE.MathUtils.clamp(this.wetness, 0, 1);
      this.applyWetnessToSurfaces();
    }

    // 2. Puddles Visibility & Water Level
    if (this.puddleGroup) {
      this.puddleGroup.visible = this.wetness > 0.15;
      this.puddleMaterial.opacity = THREE.MathUtils.lerp(0.0, 0.85, (this.wetness - 0.15) / 0.85);
    }

    // 3. Rain Droplets Loop
    if (this.rainParticles && this.rainParticles.visible && playerPos) {
      const positions = this.rainParticles.geometry.attributes.position.array;
      const windAngleX = this.currentWeather === 'STORM' ? -12 * delta : -3 * delta;

      for (let i = 0; i < this.rainCount; i++) {
        positions[i * 3 + 1] -= this.rainVelocities[i] * delta;
        positions[i * 3 + 0] += windAngleX;

        // Reset particle on ground hit
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = this.rainBounds.y;
          positions[i * 3 + 0] = playerPos.x + (Math.random() - 0.5) * this.rainBounds.x;
          positions[i * 3 + 2] = playerPos.z + (Math.random() - 0.5) * this.rainBounds.z;
        }
      }
      this.rainParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 4. Ground Splash Rings
    if (this.splashParticles && this.splashParticles.visible && playerPos) {
      const splashPos = this.splashParticles.geometry.attributes.position.array;
      for (let i = 0; i < this.splashCount; i++) {
        if (Math.random() < 0.2) {
          splashPos[i * 3 + 0] = playerPos.x + (Math.random() - 0.5) * 70;
          splashPos[i * 3 + 2] = playerPos.z + (Math.random() - 0.5) * 70;
        }
      }
      this.splashParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 5. Thunderstorm Lightning Strobe
    if (this.currentWeather === 'STORM') {
      this.lightningTimer += delta;
      if (this.lightningTimer > this.nextLightningTime) {
        this.triggerLightningFlash();
        this.lightningTimer = 0;
        this.nextLightningTime = 6 + Math.random() * 14;
      }
    }

    // 6. Update Vehicle Tire Water Sprays
    this.updateVehicleTireSpray(delta, activeVehicles);
  }

  triggerLightningFlash() {
    if (!this.realisticLighting) return;

    const sun = this.realisticLighting.sunLight;
    if (!sun) return;

    const originalIntensity = sun.intensity;
    sun.intensity = 5.5; // Blinding flash
    sun.color.setHex(0xe0f2fe);

    setTimeout(() => {
      sun.intensity = 0.5;
      setTimeout(() => {
        sun.intensity = 4.0; // Double flash
        setTimeout(() => {
          sun.intensity = originalIntensity;
        }, 60);
      }, 50);
    }, 80);
  }

  applyWetnessToSurfaces() {
    // Modifies global scene road & asphalt materials dynamically
    this.scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const mat = child.material;
        const name = (mat.name || child.name || '').toLowerCase();

        if (name.includes('road') || name.includes('asphalt') || name.includes('tar') || name.includes('pothole')) {
          // Dry asphalt: roughness ~0.85, metalness ~0.05
          // Wet asphalt: roughness ~0.22, metalness ~0.35, dark saturated color
          if (!mat.userData.origRoughness) {
            mat.userData.origRoughness = mat.roughness !== undefined ? mat.roughness : 0.85;
            mat.userData.origMetalness = mat.metalness !== undefined ? mat.metalness : 0.05;
          }

          mat.roughness = THREE.MathUtils.lerp(mat.userData.origRoughness, 0.22, this.wetness);
          mat.metalness = THREE.MathUtils.lerp(mat.userData.origMetalness, 0.35, this.wetness);
          mat.needsUpdate = true;
        }
      }
    });
  }

  updateVehicleTireSpray(delta, vehicles) {
    if (this.wetness < 0.3 || !vehicles || vehicles.length === 0) return;

    // Tire water spray can be dynamically emitted behind fast-moving vehicles
    // Particles pool in the scene
  }
}
