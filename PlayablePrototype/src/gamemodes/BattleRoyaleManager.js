// Battle Royale Match Coordinator: Sky Drop, Shrinking Storm Wall, Killfeed, and Victory Loop
import * as THREE from 'three';

export class BattleRoyaleManager {
  constructor(scene, gameState, audioManager) {
    this.scene = scene;
    this.gameState = gameState;
    this.audioManager = audioManager;

    this.isBRActive = false;
    this.isSkyDropping = false;
    this.aliveCount = 100;
    this.killfeedTimer = 0;

    // Safe-Zone Ring definition
    this.currentCenter = new THREE.Vector3(10, 0, -10);
    this.targetCenter = new THREE.Vector3(20, 0, -15);
    this.currentRadius = 240.0;
    this.targetRadius = 130.0;
    this.phaseTimeRemaining = 120.0;
    this.ringPhase = 1;

    // 3D Cylindrical Storm Barrier Wall
    this.stormMesh = this.buildStormWallMesh();
    this.scene.add(this.stormMesh);
    this.stormMesh.visible = false;
  }

  buildStormWallMesh() {
    const geo = new THREE.CylinderGeometry(1, 1, 120, 48, 1, true);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffb300,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(this.currentCenter.x, 60, this.currentCenter.z);
    mesh.scale.set(this.currentRadius, 1, this.currentRadius);
    return mesh;
  }

  startBattleRoyale(player) {
    this.isBRActive = true;
    this.isSkyDropping = true;
    this.aliveCount = 100;
    this.currentRadius = 240.0;
    this.targetRadius = 140.0;
    this.phaseTimeRemaining = 120.0;
    this.ringPhase = 1;
    this.stormMesh.visible = true;

    // Teleport player high in sky for Sky Drop
    player.teleport(20, 160, 40);
    player.velocity.set(0, -14, 0);

    this.audioManager.playUIBeep(880);
  }

  update(delta, player, hud) {
    if (!this.isBRActive) return;

    // 1. Sky Drop Descent Handling
    if (this.isSkyDropping) {
      if (player.position.y <= 1.2) {
        this.isSkyDropping = false;
        this.audioManager.playFootstep();
      }
    }

    // 2. Safe Zone Shrinking Timer
    this.phaseTimeRemaining -= delta;
    if (this.phaseTimeRemaining <= 0) {
      this.advanceRingPhase();
    }

    // Interpolate storm wall towards target radius
    this.currentRadius = THREE.MathUtils.lerp(this.currentRadius, this.targetRadius, delta * 0.08);
    this.currentCenter.lerp(this.targetCenter, delta * 0.05);

    this.stormMesh.position.set(this.currentCenter.x, 60, this.currentCenter.z);
    this.stormMesh.scale.set(this.currentRadius, 1, this.currentRadius);

    // 3. Out-of-Zone Storm Damage Check
    const playerDist2D = Math.sqrt(
      Math.pow(player.position.x - this.currentCenter.x, 2) +
      Math.pow(player.position.z - this.currentCenter.z, 2)
    );

    const isOutsideStorm = playerDist2D > this.currentRadius;
    if (isOutsideStorm) {
      this.gameState.health = Math.max(0, this.gameState.health - 6.0 * delta);
    }

    // 4. Simulated Killfeed & Living Contenders reduction
    this.killfeedTimer += delta;
    if (this.killfeedTimer >= 6.5 && this.aliveCount > 1) {
      this.killfeedTimer = 0;
      const eliminatedCount = Math.floor(Math.random() * 3) + 1;
      this.aliveCount = Math.max(1, this.aliveCount - eliminatedCount);

      if (hud) {
        hud.triggerKillfeed(this.generateRandomKillfeedEntry());
      }
    }

    // 5. Update HUD BR parameters
    if (hud) {
      hud.updateBRStats(this.aliveCount, Math.ceil(this.phaseTimeRemaining), isOutsideStorm);
    }
  }

  advanceRingPhase() {
    this.ringPhase++;
    if (this.ringPhase === 2) {
      this.targetRadius = 75.0;
      this.targetCenter.set(10, 0, -20); // Focuses around Central Metro Station
      this.phaseTimeRemaining = 90.0;
    } else if (this.ringPhase === 3) {
      this.targetRadius = 38.0;
      this.targetCenter.set(0, 0, -20); // Final Showdown Platform Circle
      this.phaseTimeRemaining = 60.0;
    } else {
      this.phaseTimeRemaining = 45.0;
    }
  }

  generateRandomKillfeedEntry() {
    const victims = ['IndiranagarRider', 'TechParkSniper', 'BrigadeRebel', 'KoramangalaKing', 'MetroRider44', 'VajraPilot', 'CyberRickshaw'];
    const killers = ['BangaloreGhost', 'WhitefieldViper', 'DeccanHunter', 'NammaChampion', 'MysorePhantom'];
    const weapons = ['AR-9 Special', 'Sniper Rifle', 'Vajra Supercar', 'Tactical SMG'];

    const k = killers[Math.floor(Math.random() * killers.length)];
    const v = victims[Math.floor(Math.random() * victims.length)];
    const w = weapons[Math.floor(Math.random() * weapons.length)];

    return `${k} eliminated ${v} (${w})`;
  }
}
