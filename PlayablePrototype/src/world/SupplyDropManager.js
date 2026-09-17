// Tactical Supply Drop & Airdrop Crate System for Bengaluru: Last City
// Simulates cargo plane airdrops, slow parachute descent, red smoke beacons, and legendary loot caches
import * as THREE from 'three';

export class SupplyDropManager {
  constructor(scene, audioManager) {
    this.scene = scene;
    this.audioManager = audioManager;
    this.drops = [];
    this.group = new THREE.Group();

    this.dropInterval = 90.0; // Airdrop every 90 seconds
    this.dropTimer = 45.0;     // First drop arrives at 45s

    this.scene.add(this.group);
  }

  triggerSupplyDrop(targetPos = null) {
    const dropX = targetPos ? targetPos.x : (Math.random() - 0.5) * 200;
    const dropZ = targetPos ? targetPos.z : (Math.random() - 0.5) * 200;

    const crate = this.buildSupplyCrateMesh(dropX, 160.0, dropZ);
    this.drops.push(crate);
    this.group.add(crate.mesh);

    if (this.audioManager) {
      this.audioManager.playVehicleEngine(0.8);
      this.audioManager.playUIBeep(720);
    }
  }

  buildSupplyCrateMesh(x, y, z) {
    const root = new THREE.Group();
    root.position.set(x, y, z);

    // 1. Military Steel Crate (Cobalt Blue with Red Cross)
    const crateMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 0.4,
      metalness: 0.6
    });

    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626, // Crimson corner brackets
      roughness: 0.5
    });

    const box = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.4, 2.0), crateMat);
    box.castShadow = true;
    root.add(box);

    const frame = new THREE.Mesh(new THREE.BoxGeometry(2.08, 0.25, 2.08), frameMat);
    root.add(frame);

    // 2. Parachute Canopy (above crate while falling)
    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Red cargo parachute
      roughness: 0.7,
      side: THREE.DoubleSide
    });
    const canopy = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 2.5, 12, 1, true), canopyMat);
    canopy.position.y = 4.5;
    root.add(canopy);

    // 3. Billowing Crimson Smoke Beacon Flare (Visible across Bengaluru)
    const smokeGeo = new THREE.CylinderGeometry(0.3, 0.8, 45, 8);
    const smokeMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.55
    });
    const smokeBeam = new THREE.Mesh(smokeGeo, smokeMat);
    smokeBeam.position.y = 22.5;
    root.add(smokeBeam);

    return {
      mesh: root,
      canopy,
      smokeBeam,
      position: root.position,
      targetY: 0.7,
      fallSpeed: 8.5, // m/s
      hasLanded: false,
      isOpened: false,
      loot: {
        weapon: 'Longshot-50 Anti-Material Sniper',
        weaponKey: 'longshot',
        helmet: 3,
        armor: 3,
        scope: '8x High-Caliber Marksman Scope',
        medkit: 1,
        ammoCount: 30
      }
    };
  }

  update(delta) {
    this.dropTimer -= delta;
    if (this.dropTimer <= 0) {
      this.triggerSupplyDrop();
      this.dropTimer = this.dropInterval;
    }

    // Animate active drops
    this.drops.forEach(drop => {
      if (!drop.hasLanded) {
        drop.position.y -= drop.fallSpeed * delta;
        if (drop.position.y <= drop.targetY) {
          drop.position.y = drop.targetY;
          drop.hasLanded = true;
          drop.canopy.visible = false; // Detach parachute canopy
          if (this.audioManager) this.audioManager.playFootstep();
        }
      } else {
        // Smoke flare pulse on ground
        const pulse = 0.45 + Math.sin(Date.now() * 0.005) * 0.15;
        drop.smokeBeam.material.opacity = pulse;
      }
    });
  }

  getClosestDrop(playerPos, maxDist = 4.0) {
    for (let drop of this.drops) {
      if (drop.hasLanded && !drop.isOpened && drop.position.distanceTo(playerPos) < maxDist) {
        return drop;
      }
    }
    return null;
  }
}
