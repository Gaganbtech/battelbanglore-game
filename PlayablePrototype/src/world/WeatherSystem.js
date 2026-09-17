// Monsoon Weather System: Volumetric Fog, Rain Droplets, Wet Road PBR & Puddle Splashes
// BENGALURU: LAST CITY - Phase 2 Overhaul
import * as THREE from 'three';

export class WeatherSystem {
  constructor(scene, audioManager, roadNetwork = null) {
    this.scene = scene;
    this.audioManager = audioManager;
    this.roadNetwork = roadNetwork;

    this.currentWeather = 'clear'; // 'clear', 'rain'
    this.rainParticles = null;
    this.rainCount = 4500;
    this.rainBounds = { x: 300, y: 55, z: 300 };

    this.buildRainParticleSystem();
    this.buildPuddleSplashSystem();
  }

  buildRainParticleSystem() {
    const rainGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.rainCount * 3);
    const velocities = new Float32Array(this.rainCount);

    for (let i = 0; i < this.rainCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * this.rainBounds.x;
      positions[i * 3 + 1] = Math.random() * this.rainBounds.y;
      positions[i * 3 + 2] = (Math.random() - 0.5) * this.rainBounds.z;
      velocities[i] = 48 + Math.random() * 24;
    }

    rainGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.rainVelocities = velocities;

    const rainMat = new THREE.PointsMaterial({
      color: 0xbbdefb,
      size: 0.32,
      transparent: true,
      opacity: 0.8
    });

    this.rainParticles = new THREE.Points(rainGeo, rainMat);
    this.rainParticles.visible = false;
    this.scene.add(this.rainParticles);
  }

  buildPuddleSplashSystem() {
    // Dynamic ground splash rings
    this.splashCount = 200;
    const splashGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.splashCount * 3);

    for (let i = 0; i < this.splashCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = 0.05;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120;
    }

    splashGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const splashMat = new THREE.PointsMaterial({
      color: 0x90caf9,
      size: 0.65,
      transparent: true,
      opacity: 0.6
    });

    this.splashParticles = new THREE.Points(splashGeo, splashMat);
    this.splashParticles.visible = false;
    this.scene.add(this.splashParticles);
  }

  toggleWeather() {
    this.currentWeather = (this.currentWeather === 'clear') ? 'rain' : 'clear';
    this.applyWeather(this.currentWeather);
    return this.currentWeather;
  }

  applyWeather(state) {
    this.currentWeather = state;
    const isRain = (state === 'rain');

    if (this.rainParticles) this.rainParticles.visible = isRain;
    if (this.splashParticles) this.splashParticles.visible = isRain;
    if (this.audioManager) this.audioManager.setRainActive(isRain);
    if (this.roadNetwork) this.roadNetwork.setWetRoad(isRain);

    // Weather fog adaptation
    if (isRain) {
      this.originalFogColor = this.scene.fog ? this.scene.fog.color.getHex() : 0x9fc5e8;
      if (this.scene.fog) {
        this.scene.fog.color.setHex(0x546e7a);
        this.scene.fog.density = 0.0055; // Heavier monsoon atmospheric mist
      }
    } else {
      if (this.scene.fog && this.originalFogColor) {
        this.scene.fog.color.setHex(this.originalFogColor);
        this.scene.fog.density = 0.0028;
      }
    }
  }

  update(delta, playerPosition) {
    if (this.currentWeather !== 'rain') return;

    // 1. Rain Streaks Falling
    const positions = this.rainParticles.geometry.attributes.position.array;
    for (let i = 0; i < this.rainCount; i++) {
      positions[i * 3 + 1] -= this.rainVelocities[i] * delta;

      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = this.rainBounds.y;
        positions[i * 3 + 0] = playerPosition.x + (Math.random() - 0.5) * 160;
        positions[i * 3 + 2] = playerPosition.z + (Math.random() - 0.5) * 160;
      }
    }
    this.rainParticles.geometry.attributes.position.needsUpdate = true;

    // 2. Road Puddle Splashes
    if (this.splashParticles && this.splashParticles.visible) {
      const splashPos = this.splashParticles.geometry.attributes.position.array;
      for (let i = 0; i < this.splashCount; i++) {
        if (Math.random() < 0.15) {
          splashPos[i * 3 + 0] = playerPosition.x + (Math.random() - 0.5) * 80;
          splashPos[i * 3 + 2] = playerPosition.z + (Math.random() - 0.5) * 80;
        }
      }
      this.splashParticles.geometry.attributes.position.needsUpdate = true;
    }
  }
}
