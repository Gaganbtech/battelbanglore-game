// Dynamic Day/Night Cycle with solar trajectory, skybox transitions, and nighttime lighting activation
import * as THREE from 'three';

export class DayNightCycle {
  constructor(scene, renderer, roadNetwork, cityBuilder, trafficSystem) {
    this.scene = scene;
    this.renderer = renderer;
    this.roadNetwork = roadNetwork;
    this.cityBuilder = cityBuilder;
    this.trafficSystem = trafficSystem;

    // Sun / Moon directional light
    this.sunLight = new THREE.DirectionalLight(0xfff4e0, 2.2);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 500;
    this.sunLight.shadow.camera.left = -200;
    this.sunLight.shadow.camera.right = 200;
    this.sunLight.shadow.camera.top = 200;
    this.sunLight.shadow.camera.bottom = -200;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    // Ambient / Hemisphere light
    this.hemiLight = new THREE.HemisphereLight(0xdce9f5, 0x2b333d, 1.2);
    this.scene.add(this.hemiLight);

    this.modes = ['day', 'sunset', 'night'];
    this.currentModeIndex = 0;
    this.currentMode = 'day';

    this.applyMode(this.currentMode);
  }

  cycleNext() {
    this.currentModeIndex = (this.currentModeIndex + 1) % this.modes.length;
    this.currentMode = this.modes[this.currentModeIndex];
    this.applyMode(this.currentMode);
    return this.currentMode;
  }

  applyMode(mode) {
    this.currentMode = mode;
    const isNight = (mode === 'night');
    const isSunset = (mode === 'sunset');

    if (mode === 'day') {
      this.sunLight.color.setHex(0xfff7e6);
      this.sunLight.intensity = 2.4;
      this.sunLight.position.set(120, 200, 80);

      this.hemiLight.color.setHex(0xd8e7f5);
      this.hemiLight.groundColor.setHex(0x28303a);
      this.hemiLight.intensity = 1.2;

      this.scene.background = new THREE.Color(0x82b4df); // Sunny clear sky
      this.scene.fog = new THREE.FogExp2(0x9fc5e8, 0.0028);
    } else if (mode === 'sunset') {
      this.sunLight.color.setHex(0xff7043);
      this.sunLight.intensity = 1.8;
      this.sunLight.position.set(220, 45, -60);

      this.hemiLight.color.setHex(0xffa726);
      this.hemiLight.groundColor.setHex(0x3e2723);
      this.hemiLight.intensity = 0.9;

      this.scene.background = new THREE.Color(0xc75a38); // Golden hour dusk
      this.scene.fog = new THREE.FogExp2(0x8c462e, 0.0035);
    } else if (mode === 'night') {
      this.sunLight.color.setHex(0x5c79a8);
      this.sunLight.intensity = 0.35; // Moonlight
      this.sunLight.position.set(-100, 160, -120);

      this.hemiLight.color.setHex(0x1a2638);
      this.hemiLight.groundColor.setHex(0x0a0e14);
      this.hemiLight.intensity = 0.4;

      this.scene.background = new THREE.Color(0x060910); // Deep night sky
      this.scene.fog = new THREE.FogExp2(0x090f1a, 0.0042);
    }

    // Toggle nighttime city illumination
    if (this.roadNetwork) this.roadNetwork.setNightMode(isNight || isSunset);
    if (this.cityBuilder) this.cityBuilder.setNightMode(isNight || isSunset);
    if (this.trafficSystem) this.trafficSystem.setNightMode(isNight || isSunset);
  }

  update(delta) {
    // Subtle sun drift
    if (this.currentMode === 'day') {
      this.sunLight.position.x += delta * 0.4;
    }
  }
}
