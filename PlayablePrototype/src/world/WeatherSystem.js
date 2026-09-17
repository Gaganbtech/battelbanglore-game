// Weather System: Clear, Cloudy, and Monsoon Rain with particle droplets and road wetness
import * as THREE from 'three';

export class WeatherSystem {
  constructor(scene, audioManager) {
    this.scene = scene;
    this.audioManager = audioManager;

    this.currentWeather = 'clear'; // 'clear', 'rain'
    this.rainParticles = null;
    this.rainCount = 3500;
    this.rainBounds = { x: 300, y: 50, z: 300 };

    this.buildRainParticleSystem();
  }

  buildRainParticleSystem() {
    const rainGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.rainCount * 3);
    const velocities = new Float32Array(this.rainCount);

    for (let i = 0; i < this.rainCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * this.rainBounds.x;
      positions[i * 3 + 1] = Math.random() * this.rainBounds.y;
      positions[i * 3 + 2] = (Math.random() - 0.5) * this.rainBounds.z;
      velocities[i] = 45 + Math.random() * 25;
    }

    rainGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.rainVelocities = velocities;

    const rainMat = new THREE.PointsMaterial({
      color: 0x90caf9,
      size: 0.28,
      transparent: true,
      opacity: 0.75
    });

    this.rainParticles = new THREE.Points(rainGeo, rainMat);
    this.rainParticles.visible = false;
    this.scene.add(this.rainParticles);
  }

  toggleWeather() {
    this.currentWeather = (this.currentWeather === 'clear') ? 'rain' : 'clear';
    this.applyWeather(this.currentWeather);
    return this.currentWeather;
  }

  applyWeather(state) {
    this.currentWeather = state;
    if (state === 'rain') {
      this.rainParticles.visible = true;
      this.audioManager.setRainActive(true);
    } else {
      this.rainParticles.visible = false;
      this.audioManager.setRainActive(false);
    }
  }

  update(delta, playerPosition) {
    if (this.currentWeather !== 'rain') return;

    const positions = this.rainParticles.geometry.attributes.position.array;
    for (let i = 0; i < this.rainCount; i++) {
      positions[i * 3 + 1] -= this.rainVelocities[i] * delta;

      // Reset when hitting ground
      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = this.rainBounds.y;
        // Keep rain localized around player position
        positions[i * 3 + 0] = playerPosition.x + (Math.random() - 0.5) * 160;
        positions[i * 3 + 2] = playerPosition.z + (Math.random() - 0.5) * 160;
      }
    }

    this.rainParticles.geometry.attributes.position.needsUpdate = true;
  }
}
