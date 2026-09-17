// Knocked State & Squad Revive System for Bengaluru: Last City
// Simulates crawling, health bleed-out, circular revive progress, and squad interactions
import * as THREE from 'three';

export class KnockReviveSystem {
  constructor(audioManager) {
    this.audioManager = audioManager;
    this.isReviving = false;
    this.reviveProgress = 0.0;
    this.reviveTarget = null;
    this.requiredReviveTime = 8.5; // 8.5 seconds to complete revive
  }

  startRevive(reviverPlayerState, targetPlayerState) {
    if (!targetPlayerState.isKnocked || !targetPlayerState.isAlive) return false;
    if (reviverPlayerState.isKnocked || !reviverPlayerState.isAlive) return false;

    this.isReviving = true;
    this.reviveProgress = 0.0;
    this.reviveTarget = targetPlayerState;

    if (this.audioManager) {
      this.audioManager.playUIBeep(520);
    }
    return true;
  }

  cancelRevive() {
    this.isReviving = false;
    this.reviveProgress = 0.0;
    this.reviveTarget = null;
  }

  update(delta, player, playerState, nearbyTeammates = []) {
    // 1. Local Player Knocked State Logic
    if (playerState.isKnocked && playerState.isAlive) {
      playerState.knockBleedTimer -= delta;

      // Lower crawl speed to 1.5 m/s
      player.speed = 1.5;

      // Crawling low-profile body tilt
      if (player.torso) {
        player.torso.rotation.x = Math.PI / 2.5;
        player.torso.position.y = 0.45;
      }

      // Bleed out to complete elimination if timer expires
      if (playerState.knockBleedTimer <= 0) {
        playerState.isAlive = false;
        playerState.isKnocked = false;
        playerState.health = 0;
        if (this.audioManager) this.audioManager.playUIBeep(220);
      }
    }

    // 2. Revive in progress
    if (this.isReviving && this.reviveTarget) {
      this.reviveProgress += delta / this.requiredReviveTime;

      if (this.reviveProgress >= 1.0) {
        // Revive successfully completed!
        this.reviveTarget.isKnocked = false;
        this.reviveTarget.health = 30.0; // Revived with partial health
        playerState.revivesCount += 1;

        if (this.audioManager) {
          this.audioManager.playUIBeep(880);
        }

        this.cancelRevive();
        return true;
      }
    }

    return false;
  }

  getReviveProgress() {
    return Math.min(1.0, Math.max(0.0, this.reviveProgress));
  }
}
