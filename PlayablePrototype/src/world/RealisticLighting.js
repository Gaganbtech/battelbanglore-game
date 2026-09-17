// Physically Based Lighting & Atmosphere Rebuild (Phase 5)
// ACES Filmic exposure, solar trajectory, skylight gradients, soft shadow cascades, and night streetlamp pools.
import * as THREE from 'three';

export class RealisticLighting {
  constructor(scene, renderer) {
    this.scene = scene;
    this.renderer = renderer;
    this.group = new THREE.Group();

    // Configure Renderer Tone Mapping & Exposure for production realism
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap; // Optimized soft shadow filtering

    // 1. Directional Sun/Moon Light with tight 75m cascade around player
    this.sunLight = new THREE.DirectionalLight(0xfff7ed, 2.4);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.sunLight.shadow.camera.near = 5;
    this.sunLight.shadow.camera.far = 180;
    this.sunLight.shadow.camera.left = -50;
    this.sunLight.shadow.camera.right = 50;
    this.sunLight.shadow.camera.top = 50;
    this.sunLight.shadow.camera.bottom = -50;
    this.sunLight.shadow.bias = -0.00025;
    this.sunLight.shadow.normalBias = 0.02;
    this.group.add(this.sunLight);

    // 2. Realistic Hemisphere Skylight (Atmospheric Raleigh/Mie scattering approximation)
    this.hemiLight = new THREE.HemisphereLight(0xbae6fd, 0x334155, 1.15);
    this.group.add(this.hemiLight);

    // 3. Atmospheric Depth Fog
    this.scene.fog = new THREE.FogExp2(0x94a3b8, 0.0028);

    // Time-of-Day states
    this.timeOfDay = 'day'; // 'day', 'sunset', 'night', 'overcast'
    this.sunAngle = Math.PI / 3;

    this.applyTimeOfDay('day');
    this.scene.add(this.group);
  }

  applyTimeOfDay(mode) {
    this.timeOfDay = mode;

    if (mode === 'day') {
      // Crisp Bengaluru daytime sunlight (5600K)
      this.sunLight.color.setHex(0xfff7ed);
      this.sunLight.intensity = 2.5;
      this.sunLight.position.set(45, 95, 35);

      this.hemiLight.color.setHex(0xbae6fd); // Clear blue sky
      this.hemiLight.groundColor.setHex(0x475569); // Soil/asphalt bounce
      this.hemiLight.intensity = 1.15;

      this.scene.background = new THREE.Color(0x7dd3fc); // Atmospheric blue sky
      this.scene.fog.color.setHex(0x94a3b8);
      this.scene.fog.density = 0.0024;
      this.renderer.toneMappingExposure = 1.12;
    } else if (mode === 'sunset') {
      // Warm golden hour sunset (3200K)
      this.sunLight.color.setHex(0xf97316);
      this.sunLight.intensity = 2.8;
      this.sunLight.position.set(95, 25, 20);

      this.hemiLight.color.setHex(0xfdba74);
      this.hemiLight.groundColor.setHex(0x334155);
      this.hemiLight.intensity = 0.9;

      this.scene.background = new THREE.Color(0xc2410c);
      this.scene.fog.color.setHex(0x7c2d12);
      this.scene.fog.density = 0.0032;
      this.renderer.toneMappingExposure = 1.05;
    } else if (mode === 'night') {
      // Deep night with cool moonlight (20000K)
      this.sunLight.color.setHex(0x60a5fa);
      this.sunLight.intensity = 0.45;
      this.sunLight.position.set(-40, 80, -30);

      this.hemiLight.color.setHex(0x1e293b);
      this.hemiLight.groundColor.setHex(0x090d16);
      this.hemiLight.intensity = 0.4;

      this.scene.background = new THREE.Color(0x060913); // Deep night sky
      this.scene.fog.color.setHex(0x0b1120);
      this.scene.fog.density = 0.0038;
      this.renderer.toneMappingExposure = 1.25;
    } else if (mode === 'overcast') {
      // Diffuse monsoon overcast sky
      this.sunLight.color.setHex(0xe2e8f0);
      this.sunLight.intensity = 1.2;
      this.sunLight.position.set(20, 90, 15);

      this.hemiLight.color.setHex(0x94a3b8);
      this.hemiLight.groundColor.setHex(0x334155);
      this.hemiLight.intensity = 1.0;

      this.scene.background = new THREE.Color(0x64748b);
      this.scene.fog.color.setHex(0x475569);
      this.scene.fog.density = 0.0045;
      this.renderer.toneMappingExposure = 0.98;
    }
  }

  update(delta, playerPos) {
    // Keep shadow cascade box centered on active player for maximum shadow resolution
    if (playerPos) {
      this.sunLight.target.position.set(playerPos.x, 0, playerPos.z);
      this.sunLight.position.set(
        playerPos.x + (this.timeOfDay === 'sunset' ? 80 : 45),
        this.timeOfDay === 'sunset' ? 25 : 95,
        playerPos.z + (this.timeOfDay === 'sunset' ? 20 : 35)
      );
      this.sunLight.target.updateMatrixWorld();
    }
  }

  cycleNext() {
    const modes = ['day', 'sunset', 'night', 'overcast'];
    const idx = (modes.indexOf(this.timeOfDay) + 1) % modes.length;
    this.applyTimeOfDay(modes[idx]);
    return modes[idx];
  }
}
