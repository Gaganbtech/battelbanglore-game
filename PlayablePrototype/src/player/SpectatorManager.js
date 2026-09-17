// Spectator Mode Manager for Bengaluru: Last City
// Cycles camera through surviving squad members when local player is eliminated
import * as THREE from 'three';

export class SpectatorManager {
  constructor(camera, gameState) {
    this.camera = camera;
    this.gameState = gameState;
    this.isSpectating = false;
    this.currentTargetIndex = 0;
    this.squadMembers = [];
  }

  startSpectating(squadMembers = []) {
    this.isSpectating = true;
    this.squadMembers = squadMembers.filter(m => m.isAlive);
    this.currentTargetIndex = 0;
  }

  nextTarget() {
    if (this.squadMembers.length === 0) return;
    this.currentTargetIndex = (this.currentTargetIndex + 1) % this.squadMembers.length;
  }

  prevTarget() {
    if (this.squadMembers.length === 0) return;
    this.currentTargetIndex = (this.currentTargetIndex - 1 + this.squadMembers.length) % this.squadMembers.length;
  }

  getCurrentTarget() {
    if (!this.isSpectating || this.squadMembers.length === 0) return null;
    return this.squadMembers[this.currentTargetIndex];
  }

  update(delta) {
    if (!this.isSpectating) return;

    // Refresh living squad members
    this.squadMembers = this.squadMembers.filter(m => m.isAlive);
    if (this.squadMembers.length === 0) return;

    if (this.currentTargetIndex >= this.squadMembers.length) {
      this.currentTargetIndex = 0;
    }

    const target = this.squadMembers[this.currentTargetIndex];
    if (target && target.position) {
      // Smoothly orbit spectator camera behind target
      const offset = new THREE.Vector3(0, 2.2, 3.5);
      this.camera.position.lerp(target.position.clone().add(offset), delta * 8.0);
      this.camera.lookAt(target.position.clone().add(new THREE.Vector3(0, 1.4, 0)));
    }
  }
}
