// Battle Royale Safe Zone & Atmospheric Storm System for Bengaluru: Last City
// Manages 6-Phase dynamic shrinking circles, atmospheric storm wall visuals, and escalating DPS
import * as THREE from 'three';

export const ZONE_PHASE_CONFIG = [
  { phase: 1, radius: 320.0, waitTime: 120.0, shrinkTime: 70.0, dps: 1.5, centerOffset: [0, 0] },
  { phase: 2, radius: 210.0, waitTime: 90.0,  shrinkTime: 55.0, dps: 2.5, centerOffset: [15, -10] },
  { phase: 3, radius: 120.0, waitTime: 75.0,  shrinkTime: 45.0, dps: 4.5, centerOffset: [5, -20] },
  { phase: 4, radius: 65.0,  waitTime: 60.0,  shrinkTime: 35.0, dps: 7.5, centerOffset: [0, -15] },
  { phase: 5, radius: 30.0,  waitTime: 45.0,  shrinkTime: 25.0, dps: 12.0, centerOffset: [0, -20] },
  { phase: 6, radius: 0.0,   waitTime: 20.0,  shrinkTime: 20.0, dps: 20.0, centerOffset: [0, -20] } // Final Sudden Death
];

export class BattleRoyaleZoneManager {
  constructor(scene, audioManager) {
    this.scene = scene;
    this.audioManager = audioManager;
    this.group = new THREE.Group();

    this.currentPhaseIndex = 0;
    this.currentPhaseConfig = ZONE_PHASE_CONFIG[0];
    this.currentRadius = 380.0;
    this.targetRadius = ZONE_PHASE_CONFIG[0].radius;
    this.currentCenter = new THREE.Vector3(0, 0, 0);
    this.targetCenter = new THREE.Vector3(0, 0, 0);

    this.phaseTimer = this.currentPhaseConfig.waitTime;
    this.isShrinking = false;
    this.isActive = false;

    // Atmospheric Storm Wall Cylinder
    this.stormMesh = this.buildStormWallMesh();
    this.group.add(this.stormMesh);
    this.scene.add(this.group);
    this.group.visible = false;
  }

  buildStormWallMesh() {
    const geo = new THREE.CylinderGeometry(1, 1, 140, 64, 1, true);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8, // Electric Cerulean Storm Wall
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = 70;
    return mesh;
  }

  startZoneProgression() {
    this.isActive = true;
    this.group.visible = true;
    this.currentPhaseIndex = 0;
    this.loadPhase(0);
  }

  loadPhase(idx) {
    if (idx >= ZONE_PHASE_CONFIG.length) return;
    this.currentPhaseIndex = idx;
    this.currentPhaseConfig = ZONE_PHASE_CONFIG[idx];
    this.targetRadius = this.currentPhaseConfig.radius;
    this.targetCenter.set(
      this.currentPhaseConfig.centerOffset[0],
      0,
      this.currentPhaseConfig.centerOffset[1]
    );

    this.phaseTimer = this.currentPhaseConfig.waitTime;
    this.isShrinking = false;

    if (this.audioManager) {
      this.audioManager.playUIBeep(440);
    }
  }

  update(delta, player, playerState) {
    if (!this.isActive) return;

    this.phaseTimer -= delta;

    if (!this.isShrinking) {
      if (this.phaseTimer <= 0) {
        // Wait time elapsed -> begin shrinking!
        this.isShrinking = true;
        this.phaseTimer = this.currentPhaseConfig.shrinkTime;
        if (this.audioManager) this.audioManager.playAirBrakeHiss();
      }
    } else {
      // Shrinking active
      const shrinkSpeed = (delta / this.currentPhaseConfig.shrinkTime);
      this.currentRadius = THREE.MathUtils.lerp(this.currentRadius, this.targetRadius, shrinkSpeed * 2.5);
      this.currentCenter.lerp(this.targetCenter, shrinkSpeed * 2.0);

      if (this.phaseTimer <= 0) {
        // Shrink complete -> advance to next phase
        this.currentRadius = this.targetRadius;
        this.currentCenter.copy(this.targetCenter);
        this.loadPhase(this.currentPhaseIndex + 1);
      }
    }

    // Update 3D Storm Mesh position and scale
    this.stormMesh.position.set(this.currentCenter.x, 70, this.currentCenter.z);
    this.stormMesh.scale.set(this.currentRadius, 1, this.currentRadius);

    // 2D distance calculation from player to circle center
    const distToCenter = Math.hypot(
      player.position.x - this.currentCenter.x,
      player.position.z - this.currentCenter.z
    );

    const isOutside = distToCenter > this.currentRadius;

    // Apply storm DPS if outside safe zone
    if (isOutside && playerState && playerState.isAlive) {
      const dps = this.currentPhaseConfig.dps;
      playerState.takeDamage(dps * delta, 'body', false); // Storm damage bypasses armor
    }

    return {
      isOutside,
      currentRadius: this.currentRadius,
      currentCenter: this.currentCenter,
      targetRadius: this.targetRadius,
      targetCenter: this.targetCenter,
      phase: this.currentPhaseConfig.phase,
      timeRemaining: Math.max(0, Math.ceil(this.phaseTimer)),
      isShrinking: this.isShrinking
    };
  }

  getSafeRadius() {
    return this.currentRadius;
  }

  getSafeCenter() {
    return this.currentCenter;
  }
}
