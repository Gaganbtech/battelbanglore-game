// Server Authority & Replicated Architecture for Bengaluru: Last City
// Scalable 100-Player Battle Royale Match Architecture
import * as THREE from 'three';
import { EBattleRoyaleMatchState, MatchStateMachine } from './BattleRoyaleMatchState.js';

export class BattleRoyalePlayerState {
  constructor(playerId, name, squadId = 1, isLocalPlayer = false) {
    this.playerId = playerId;
    this.name = name;
    this.squadId = squadId;
    this.teamId = squadId;
    this.isLocalPlayer = isLocalPlayer;

    // Vital Stats
    this.health = 100.0;
    this.maxHealth = 100.0;
    this.boost = 0.0; // 0-100 energy drink/painkiller boost
    this.isKnocked = false;
    this.isAlive = true;
    this.knockBleedTimer = 100.0; // Seconds to bleed out

    // Combat Gear & Mitigations
    this.helmetLevel = 0; // 0, 1, 2, 3
    this.helmetDurability = 100;
    this.armorLevel = 0;  // 0, 1, 2, 3
    this.armorDurability = 100;
    this.backpackLevel = 1; // 1, 2, 3

    // Performance & Stats
    this.kills = 0;
    this.damageDealt = 0.0;
    this.revivesCount = 0;
    this.distanceTraveled = 0.0;
    this.survivalTime = 0.0;
    this.placement = 0;

    // Spatial & Loadout
    this.position = new THREE.Vector3();
    this.yaw = 0.0;
    this.currentWeaponKey = 'ar9';
    this.vehicleId = null;
    this.inventory = {
      primary: 'ar9',
      secondary: null,
      sidearm: null,
      melee: 'fists',
      throwable: null,
      ammo: { '5.56mm': 90, '7.62mm': 0, '9mm': 60, '.50cal': 0, '12gauge': 0 },
      meds: { bandage: 5, firstAid: 1, medkit: 0, energyDrink: 2, painkiller: 1 }
    };
  }

  takeDamage(rawDamage, hitLocation = 'body', armorAbsorption = true) {
    if (!this.isAlive) return { finalDamage: 0, knocked: false, eliminated: false };

    let mitigation = 0.0;
    if (armorAbsorption) {
      if (hitLocation === 'head' && this.helmetLevel > 0) {
        // Helmets: L1=30%, L2=40%, L3=55%
        const mults = [0, 0.30, 0.40, 0.55];
        mitigation = mults[this.helmetLevel] || 0.0;
        this.helmetDurability = Math.max(0, this.helmetDurability - rawDamage * 0.4);
        if (this.helmetDurability <= 0) this.helmetLevel = 0;
      } else if (this.armorLevel > 0) {
        // Vests: L1=20%, L2=30%, L3=45%
        const mults = [0, 0.20, 0.30, 0.45];
        mitigation = mults[this.armorLevel] || 0.0;
        this.armorDurability = Math.max(0, this.armorDurability - rawDamage * 0.4);
        if (this.armorDurability <= 0) this.armorLevel = 0;
      }
    }

    const finalDamage = Math.max(1.0, rawDamage * (1.0 - mitigation));
    this.health = Math.max(0, this.health - finalDamage);

    let knocked = false;
    let eliminated = false;

    if (this.health <= 0) {
      if (!this.isKnocked) {
        this.isKnocked = true;
        this.health = 100.0; // Knocked health pool
        this.knockBleedTimer = 100.0;
        knocked = true;
      } else {
        // Already knocked, taking fatal damage
        this.isAlive = false;
        this.isKnocked = false;
        eliminated = true;
      }
    }

    return { finalDamage, knocked, eliminated };
  }
}

export class BattleRoyaleGameState {
  constructor() {
    this.matchStateMachine = new MatchStateMachine(EBattleRoyaleMatchState.WaitingForPlayers);
    this.matchId = 'BLC-BR-' + Math.floor(100000 + Math.random() * 900000);
    this.mode = 'SQUAD'; // 'SOLO', 'DUO', 'SQUAD'
    this.maxPlayers = 100;
    this.aliveCount = 100;
    this.totalTeams = 25;
    this.aliveTeams = 25;
    this.matchTimer = 0.0;

    // Flight Path
    this.flightStart = new THREE.Vector3(-280, 260, -220);
    this.flightEnd = new THREE.Vector3(280, 260, 240);
    this.aircraftPosition = new THREE.Vector3();
    this.flightProgress = 0.0; // 0.0 to 1.0

    // Safe Zone Data
    this.safeZoneCenter = new THREE.Vector3(0, 0, 0);
    this.safeZoneRadius = 380.0;
    this.targetZoneCenter = new THREE.Vector3(0, 0, 0);
    this.targetZoneRadius = 380.0;
    this.currentZonePhase = 0; // 0=Initial, 1-5, 6=Final
    this.zonePhaseTimer = 0.0;
    this.isZoneShrinking = false;
    this.stormDPS = 0.0;

    // Replicated 100-Player Contender Registry
    this.players = new Map();
  }

  registerPlayer(playerState) {
    this.players.set(playerState.playerId, playerState);
  }

  getPlayer(playerId) {
    return this.players.get(playerId);
  }
}

export class BattleRoyaleGameMode {
  constructor(gameState, audioManager = null) {
    this.gameState = gameState;
    this.audioManager = audioManager;
    this.killfeedCallbacks = [];
    this.onVictoryCallbacks = [];

    // Pre-populate 100 contenders (1 local player + 99 simulated competitors across 25 squads)
    this.init100Players();
  }

  init100Players() {
    const indianPlayerNames = [
      'Gagan_A', 'Kavya_Rao', 'Rohit_Sharma', 'Arjun_Reddy', 'Vikram_Rathore',
      'Pooja_Patil', 'Aditya_Roy', 'Deepak_Kumar', 'Ananya_Pandey', 'Naveen_Kumar',
      'Praveen_G', 'Suresh_Raina', 'Kiran_B', 'Divya_Spandana', 'Chetan_Kumar',
      'Harsha_Bhogle', 'Surya_Kumar', 'Ishan_Kishan', 'Rishabh_Pant', 'Shreyas_Iyer',
      'Mayank_Agarwal', 'KL_Rahul', 'Manish_Pandey', 'Devdutt_Padikkal', 'Prasidh_Krishna',
      'Abhimanyu_Mithun', 'Vinay_Kumar', 'Stuart_Binny', 'Robin_Uthappa', 'Dodda_Ganesh',
      'Javagal_Srinath', 'Anil_Kumble', 'Venkatesh_Prasad', 'Sunil_Joshi', 'Brijesh_Patel',
      'EAS_Prasanna', 'BS_Chandrasekhar', 'G_Viswanath', 'Roger_Binny', 'Syed_Kirmani',
      'Rahul_Dravid', 'Vijay_Bharadwaj', 'Sujith_Somasunder', 'David_Johnson', 'Raghuram_Bhat'
    ];

    const weaponKeys = ['ar9', 'kestrel', 'raven', 'pulse9', 'longshot'];

    // Player 1: Local Player
    const localPlayer = new BattleRoyalePlayerState('P-001', 'Gagan_A (You)', 1, true);
    this.gameState.registerPlayer(localPlayer);

    // Players 2 to 100: Simulated Contenders
    for (let i = 2; i <= 100; i++) {
      const pid = `P-${String(i).padStart(3, '0')}`;
      const namePool = indianPlayerNames[(i - 2) % indianPlayerNames.length];
      const name = `${namePool}_${Math.floor(10 + Math.random() * 89)}`;
      const squadId = Math.floor((i - 1) / 4) + 1; // 25 squads of 4

      const bot = new BattleRoyalePlayerState(pid, name, squadId, false);
      bot.currentWeaponKey = weaponKeys[Math.floor(Math.random() * weaponKeys.length)];
      bot.helmetLevel = Math.random() > 0.4 ? 2 : (Math.random() > 0.3 ? 1 : 0);
      bot.armorLevel = Math.random() > 0.4 ? 2 : (Math.random() > 0.3 ? 1 : 0);
      bot.position.set((Math.random() - 0.5) * 400, 0, (Math.random() - 0.5) * 400);

      this.gameState.registerPlayer(bot);
    }
  }

  update(delta, localPlayerPos = null) {
    const sm = this.gameState.matchStateMachine;
    sm.update(delta);
    this.gameState.matchTimer += delta;

    // Simulate competitor interactions during ActiveMatch
    if (sm.isState(EBattleRoyaleMatchState.ActiveMatch) || sm.isState(EBattleRoyaleMatchState.FinalZone)) {
      this.simulateMatchCombat(delta, localPlayerPos);
    }
  }

  simulateMatchCombat(delta, localPlayerPos) {
    // Periodically simulate authentic firefights between remote squads
    if (Math.random() < delta * 0.45 && this.gameState.aliveCount > 4) {
      const aliveBots = Array.from(this.gameState.players.values()).filter(p => p.isAlive && !p.isLocalPlayer);
      if (aliveBots.length >= 2) {
        const killer = aliveBots[Math.floor(Math.random() * aliveBots.length)];
        let victim = aliveBots[Math.floor(Math.random() * aliveBots.length)];

        // Don't kill same squad members
        if (killer.squadId !== victim.squadId) {
          const res = victim.takeDamage(120, 'body', true);
          if (res.eliminated || res.knocked) {
            killer.kills += 1;
            killer.damageDealt += 100;
            if (res.eliminated) {
              this.gameState.aliveCount = Math.max(1, this.gameState.aliveCount - 1);
            }

            const weapons = ['AR-9 Special', 'Kestrel Carbine', 'Raven-45', 'Pulse-9 SMG', 'Longshot-50', 'Storm Wall'];
            const weaponUsed = weapons[Math.floor(Math.random() * weapons.length)];

            this.broadcastKillfeed(killer.name, victim.name, weaponUsed, res.eliminated);
          }
        }
      }
    }

    // Check Victory condition (Only Local Squad remains)
    if (this.gameState.aliveCount <= 4) {
      const remainingAlive = Array.from(this.gameState.players.values()).filter(p => p.isAlive);
      const allLocalSquad = remainingAlive.every(p => p.squadId === 1);
      if (allLocalSquad && !this.gameState.matchStateMachine.isState(EBattleRoyaleMatchState.MatchEnding) && !this.gameState.matchStateMachine.isState(EBattleRoyaleMatchState.MatchComplete)) {
        this.triggerVictory();
      }
    }
  }

  authoritativeDamagePlayer(targetPlayerId, damage, hitLocation = 'body', sourcePlayerId = null) {
    const target = this.gameState.getPlayer(targetPlayerId);
    if (!target || !target.isAlive) return null;

    const res = target.takeDamage(damage, hitLocation, true);

    if (sourcePlayerId) {
      const source = this.gameState.getPlayer(sourcePlayerId);
      if (source) {
        source.damageDealt += res.finalDamage;
        if (res.eliminated) {
          source.kills += 1;
          this.gameState.aliveCount = Math.max(1, this.gameState.aliveCount - 1);
          this.broadcastKillfeed(source.name, target.name, source.currentWeaponKey, true);
        } else if (res.knocked) {
          this.broadcastKillfeed(source.name, target.name, source.currentWeaponKey, false);
        }
      }
    }

    return res;
  }

  broadcastKillfeed(killer, victim, weapon, isElimination) {
    const entry = { killer, victim, weapon, isElimination, timestamp: Date.now() };
    this.killfeedCallbacks.forEach(cb => cb(entry));
  }

  onKillfeed(cb) {
    this.killfeedCallbacks.push(cb);
  }

  triggerVictory() {
    this.gameState.matchStateMachine.setState(EBattleRoyaleMatchState.MatchEnding);
    this.onVictoryCallbacks.forEach(cb => cb());
  }

  onVictory(cb) {
    this.onVictoryCallbacks.push(cb);
  }
}
