// BENGALURU: LAST CITY - Master Prototype Engine (Phase 2)
import * as THREE from 'three';
import { GameState, GameModeState } from './core/GameState.js';
import { InputManager } from './core/InputManager.js';
import { AudioManager } from './core/AudioManager.js';

import { PlayerCharacter } from './player/PlayerCharacter.js';
import { ThirdPersonCamera } from './player/ThirdPersonCamera.js';

import { RoadNetwork } from './world/RoadNetwork.js';
import { CityBuilder } from './world/CityBuilder.js';
import { DayNightCycle } from './world/DayNightCycle.js';
import { WeatherSystem } from './world/WeatherSystem.js';

import { TrafficSystem } from './simulation/TrafficSystem.js';
import { DrivableVehicle } from './simulation/DrivableVehicle.js';
import { Supercar } from './simulation/Supercar.js';

import { WeaponSystem } from './combat/WeaponSystem.js';
import { LootSpawner } from './combat/LootSpawner.js';
import { BattleRoyaleManager } from './gamemodes/BattleRoyaleManager.js';

import { MinimapRenderer } from './ui/Minimap.js';
import { HUD } from './ui/HUD.js';
import { MainMenu } from './ui/MainMenu.js';
import { GarageMenu } from './ui/GarageMenu.js';

// Phase 2.5 BMTC Transportation Network
import { BMTCBusSystem } from './transport/BMTCBusSystem.js';
import { BusRouteManager } from './transport/BusRouteManager.js';
import { BusStopSystem } from './transport/BusStopSystem.js';
import { PassengerNPCSystem } from './transport/PassengerNPCSystem.js';

// Phase 3 Master Battle Royale Framework
import { EBattleRoyaleMatchState } from './gamemodes/BattleRoyaleMatchState.js';
import { BattleRoyaleGameState, BattleRoyaleGameMode } from './gamemodes/BattleRoyaleServerArchitecture.js';
import { MatchmakingManager } from './gamemodes/MatchmakingManager.js';
import { CargoAircraft } from './world/CargoAircraft.js';
import { FreefallParachuteController, EAirFlightState } from './player/FreefallParachuteController.js';
import { getDistrictAtPosition } from './world/BengaluruDistricts.js';
import { BattleRoyaleLootSystem } from './combat/BattleRoyaleLootSystem.js';
import { KnockReviveSystem } from './combat/KnockReviveSystem.js';
import { BattleRoyaleZoneManager } from './world/BattleRoyaleZoneManager.js';
import { SupplyDropManager } from './world/SupplyDropManager.js';
import { KillFeedUI } from './ui/KillFeedUI.js';
import { InventoryUI } from './ui/InventoryUI.js';
import { MatchResultUI } from './ui/MatchResultUI.js';
import { BattleRoyaleHUD } from './ui/BattleRoyaleHUD.js';
import { SpectatorManager } from './player/SpectatorManager.js';

// Phase 4 Advanced Living Bengaluru Systems
import { AdvancedMetroSystem } from './transport/AdvancedMetroSystem.js';
import { ElectricBusSystem } from './transport/ElectricBusSystem.js';
import { BusDepotSystem } from './transport/BusDepotSystem.js';
import { AdvancedCivilianAI } from './ai/AdvancedCivilianAI.js';
import { PoliceEmergencySystem } from './ai/PoliceEmergencySystem.js';
import { EnterableBuildings } from './world/EnterableBuildings.js';
import { DynamicCityEvents } from './world/DynamicCityEvents.js';
import { CityLifeManager } from './world/CityLifeManager.js';
import { MissionManager } from './missions/MissionManager.js';
import { MissionHUD } from './ui/MissionHUD.js';
import { EconomyProgression } from './core/EconomyProgression.js';

// Phase 5 Performance Overhaul & Authentic Bengaluru Road Systems
import { PerformanceProfiler } from './core/PerformanceProfiler.js';
import { InstancedCityInfrastructure } from './world/InstancedCityInfrastructure.js';
import { BengaluruRoadSystem } from './world/BengaluruRoadSystem.js';
import { WorldPartitionManager } from './world/WorldPartitionManager.js';

class BengaluruGame {
  constructor() {
    this.container = document.getElementById('game-container');

    // Setup Three.js Scene, Camera, and Renderer
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.container.appendChild(this.renderer.domElement);

    // Systems & State
    this.gameState = new GameState();
    this.audioManager = new AudioManager(this.gameState);
    this.inputManager = new InputManager(this.renderer.domElement, this.gameState);

    // Phase 5 Performance & Partitioning Architecture
    this.profiler = new PerformanceProfiler(this.renderer, this.scene);
    this.worldPartition = new WorldPartitionManager(this.scene);
    this.bengaluruRoads = new BengaluruRoadSystem(this.scene);
    this.instancedInfrastructure = new InstancedCityInfrastructure(this.scene);

    // World Infrastructure
    this.roadNetwork = new RoadNetwork(this.scene);
    this.cityBuilder = new CityBuilder(this.scene);

    // Vehicles: Auto-Rickshaw & Phase 2 Vajra Hypercar
    this.trafficSystem = new TrafficSystem(this.scene);
    this.drivableAuto = new DrivableVehicle(this.scene, 'auto', new THREE.Vector3(8, 0, 14));
    this.supercar = new Supercar(this.scene, new THREE.Vector3(-12, 0, 16));

    // Phase 2.5 BMTC Public Transportation Network
    this.busStopSystem = new BusStopSystem(this.scene);
    this.busRouteManager = new BusRouteManager(this.busStopSystem);
    this.bmtcBusSystem = new BMTCBusSystem(this.scene, this.audioManager);
    this.passengerNPCSystem = new PassengerNPCSystem(this.scene, this.bmtcBusSystem, this.busStopSystem);

    // Atmosphere
    this.dayNightCycle = new DayNightCycle(
      this.scene,
      this.renderer,
      this.roadNetwork,
      this.cityBuilder,
      this.trafficSystem
    );
    this.weatherSystem = new WeatherSystem(this.scene, this.audioManager, this.roadNetwork);

    // Player & Third-Person Camera
    this.player = new PlayerCharacter(this.scene, this.gameState, this.audioManager);
    this.thirdPersonCamera = new ThirdPersonCamera(this.camera, this.renderer.domElement, this.gameState);

    // Phase 2 Combat & Loot Systems
    this.weaponSystem = new WeaponSystem(this.scene, this.camera, this.audioManager);
    this.weaponSystem.attachToPlayer(this.player.rightArm);
    this.lootSpawner = new LootSpawner(this.scene);
    this.brManager = new BattleRoyaleManager(this.scene, this.gameState, this.audioManager);

    // UI Systems
    this.hud = new HUD(this.gameState, this.audioManager);
    this.mainMenu = new MainMenu(this.gameState, this.audioManager);
    this.garageMenu = new GarageMenu(this.supercar, this.audioManager);
    this.minimap = new MinimapRenderer(
      document.getElementById('minimap-canvas'),
      document.getElementById('world-map-canvas')
    );

    // Phase 3 Master Battle Royale Architecture
    this.brGameState = new BattleRoyaleGameState();
    this.brGameMode = new BattleRoyaleGameMode(this.brGameState, this.audioManager);
    this.matchmaking = new MatchmakingManager();
    this.cargoAircraft = new CargoAircraft(this.scene, this.audioManager);
    this.flightController = new FreefallParachuteController(this.scene, this.audioManager);
    this.brLootSystem = new BattleRoyaleLootSystem(this.scene);
    this.knockReviveSystem = new KnockReviveSystem(this.audioManager);
    this.brZoneManager = new BattleRoyaleZoneManager(this.scene, this.audioManager);
    this.supplyDropManager = new SupplyDropManager(this.scene, this.audioManager);
    this.killFeedUI = new KillFeedUI();
    this.inventoryUI = new InventoryUI(this.audioManager);
    this.matchResultUI = new MatchResultUI(this.audioManager);
    this.brHUD = new BattleRoyaleHUD();
    this.spectatorManager = new SpectatorManager(this.camera, this.gameState);

    // Phase 4 Advanced Living Open-World Systems
    this.economy = new EconomyProgression();
    this.advancedMetro = new AdvancedMetroSystem(this.scene, this.audioManager);
    this.electricBus = new ElectricBusSystem(this.scene, this.audioManager);
    this.busDepot = new BusDepotSystem(this.scene);
    this.advancedCivilianAI = new AdvancedCivilianAI(this.scene, this.audioManager);
    this.policeSystem = new PoliceEmergencySystem(this.scene, this.audioManager);
    this.enterableBuildings = new EnterableBuildings(this.scene, this.audioManager);
    this.dynamicEvents = new DynamicCityEvents(this.scene, this.audioManager);
    this.cityLifeManager = new CityLifeManager(
      this.dayNightCycle,
      this.weatherSystem,
      this.trafficSystem,
      this.advancedCivilianAI,
      this.advancedMetro,
      this.bmtcBusSystem,
      this.dynamicEvents
    );
    this.missionManager = new MissionManager(this.scene, this.audioManager, this.economy);
    this.missionHUD = new MissionHUD();

    // Setup Killfeed listener
    this.brGameMode.onKillfeed((entry) => {
      this.killFeedUI.addEntry(entry.killer, entry.victim, entry.weapon, entry.isElimination);
    });

    // Setup Victory listener
    this.brGameMode.onVictory(() => {
      const p = this.brGameState.getPlayer('P-001');
      this.matchResultUI.showResults(true, p.kills, p.damageDealt, this.brGameState.matchTimer, 1);
      this.inputManager.exitPointerLock();
    });

    // Inventory consumption callback
    this.inventoryUI.onUseItem = (itemType) => {
      const p = this.brGameState.getPlayer('P-001');
      if (itemType === 'firstAid' && p.inventory.meds.firstAid > 0) {
        p.inventory.meds.firstAid -= 1;
        p.health = Math.min(100, p.health + 75);
        this.audioManager.playUIBeep(720);
        this.hud.triggerKillfeed('Used Trauma First Aid Kit (+75 HP)');
      } else if (itemType === 'energyDrink' && p.inventory.meds.energyDrink > 0) {
        p.inventory.meds.energyDrink -= 1;
        p.boost = Math.min(100, p.boost + 40);
        this.audioManager.playUIBeep(880);
        this.hud.triggerKillfeed('Consumed Bengaluru Rush (+40 Boost)');
      }
      this.inventoryUI.updateDisplay(p);
    };

    // Match Result button callbacks
    const btnLobby = document.getElementById('btn-return-lobby');
    if (btnLobby) {
      btnLobby.onclick = () => {
        this.matchResultUI.hide();
        this.gameState.setState(GameModeState.MAIN_MENU);
        this.mainMenu.showMenu();
        this.hud.hide();
      };
    }
    const btnPlayAgain = document.getElementById('btn-play-again');
    if (btnPlayAgain) {
      btnPlayAgain.onclick = () => {
        this.matchResultUI.hide();
        this.mainMenu.onStartBattleRoyale();
      };
    }

    this.clock = new THREE.Clock();
    this.setupUICallbacks();
    this.setupCombatInputs();
    this.setupWindowEvents();

    // Start rendering loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupUICallbacks() {
    // Start City Exploration
    this.mainMenu.onStartGame = () => {
      this.gameState.setState(GameModeState.PLAYING);
      this.hud.show();
      this.inputManager.requestPointerLock();
    };

    // Start Battle Royale Matchmaking & Cargo Aircraft Flight Insertion
    this.mainMenu.onStartBattleRoyale = () => {
      this.hud.triggerKillfeed('Matchmaking: Searching for 100 Contenders (Squad Session)...');
      this.matchmaking.startMatchmaking((mode) => {
        this.gameState.setState(GameModeState.PLAYING);
        this.hud.show();
        this.brGameState.matchStateMachine.setState(EBattleRoyaleMatchState.AircraftDeparture);
        this.cargoAircraft.startFlight();
        this.brZoneManager.startZoneProgression();
        this.inputManager.requestPointerLock();
        this.hud.triggerKillfeed('Garuda C-130 Inbound over Bengaluru Airspace — Prepare to Jump [F]');
      });
    };

    // Open Garage
    this.mainMenu.onOpenGarage = () => {
      this.garageMenu.show();
      this.inputManager.exitPointerLock();
    };

    this.hud.onOpenGarage = () => {
      this.garageMenu.show();
      this.inputManager.exitPointerLock();
    };

    this.garageMenu.onTestDriveCallback = () => {
      this.mainMenu.hideMenu();
      this.gameState.setState(GameModeState.PLAYING);
      this.hud.show();
      this.enterVehicle(this.supercar);
      this.inputManager.requestPointerLock();
    };

    this.garageMenu.onCloseCallback = () => {
      if (this.gameState.currentState === GameModeState.MAIN_MENU) {
        this.mainMenu.showMenu();
      } else {
        this.inputManager.requestPointerLock();
      }
    };

    // Pause & Resume
    this.mainMenu.onResumeGame = () => {
      this.inputManager.requestPointerLock();
    };

    this.mainMenu.onQuitToMenu = () => {
      this.hud.hide();
      this.inputManager.exitPointerLock();
      if (this.gameState.isInVehicle) {
        this.exitVehicle();
      }
    };

    // Toggle pause with ESC
    this.inputManager.onPauseCallback = () => {
      if (this.gameState.currentState === GameModeState.PLAYING) {
        this.mainMenu.showPauseMenu();
        this.inputManager.exitPointerLock();
      } else if (this.gameState.currentState === GameModeState.PAUSED) {
        this.mainMenu.hidePauseMenu();
        this.inputManager.requestPointerLock();
      } else if (this.gameState.currentState === GameModeState.MAP_OPEN) {
        this.mainMenu.hideWorldMap();
        this.inputManager.requestPointerLock();
      }
    };

    // Toggle Map with M
    this.inputManager.onToggleMapCallback = () => {
      if (this.gameState.currentState === GameModeState.PLAYING) {
        this.mainMenu.showWorldMap();
        this.inputManager.exitPointerLock();
      } else if (this.gameState.currentState === GameModeState.MAP_OPEN) {
        this.mainMenu.hideWorldMap();
        this.inputManager.requestPointerLock();
      }
    };

    // Toggle Inventory with Tab
    this.inputManager.onToggleInventoryCallback = () => {
      if (this.gameState.isPlaying()) {
        const p = this.brGameState.getPlayer('P-001');
        this.inventoryUI.toggle(p);
      }
    };

    // HUD quick controls
    this.hud.onToggleTime = () => {
      const mode = this.dayNightCycle.cycleNext();
      this.gameState.timeOfDay = mode;
      return mode;
    };

    this.hud.onToggleWeather = () => {
      const weather = this.weatherSystem.toggleWeather();
      this.gameState.weather = weather;
      return weather;
    };

    this.hud.onToggleCamera = () => {
      this.thirdPersonCamera.toggleShoulderSide();
    };

    this.hud.onOpenMap = () => {
      this.mainMenu.showWorldMap();
      this.inputManager.exitPointerLock();
    };

    // Disembark / Exit bus or vehicle / Eject aircraft with [F]
    this.inputManager.onExitCallback = () => {
      if (!this.gameState.isPlaying()) return;

      // Check Cargo Aircraft Jump
      if (this.brGameState.matchStateMachine.isState(EBattleRoyaleMatchState.AircraftDeparture)) {
        if (this.cargoAircraft.canJump && !this.cargoAircraft.hasLocalPlayerJumped) {
          this.cargoAircraft.ejectPlayer(this.player);
          this.flightController.startDrop(this.player.position);
          this.brGameState.matchStateMachine.setState(EBattleRoyaleMatchState.DropPhase);
          this.hud.triggerKillfeed('Freefalling! [Space] Deploy Parachute');
          return;
        }
      }

      if (this.gameState.isInVehicle) {
        this.exitVehicle();
      } else {
        const ddBus = this.bmtcBusSystem.doubleDeckerBus;
        if (ddBus && this.bmtcBusSystem.isPlayerAboard(this.player, ddBus)) {
          this.bmtcBusSystem.exitPlayerToCurb(this.player);
          this.audioManager.playAirBrakeHiss();
          this.hud.triggerKillfeed('Alighted at Bus Stop');
        }
      }
    };

    // Interaction with [E]
    this.inputManager.onInteractCallback = () => {
      if (!this.gameState.isPlaying()) return;

      if (this.gameState.isInVehicle) {
        this.exitVehicle();
      } else {
        // 1. Check BMTC Double-Decker Bus (Boarding / Deck Transition)
        const ddBus = this.bmtcBusSystem.doubleDeckerBus;
        if (ddBus) {
          const isAboard = this.bmtcBusSystem.isPlayerAboard(this.player, ddBus);
          const currentDeck = this.bmtcBusSystem.getPlayerCurrentDeck(this.player);
          const distToBus = this.bmtcBusSystem.getInteractionDistance(this.player.position, ddBus);

          if (isAboard) {
            if (currentDeck === 'LOWER_DECK') {
              this.bmtcBusSystem.boardPlayer(this.player, 'UPPER_DECK');
              this.audioManager.playUIBeep(720);
              this.hud.triggerKillfeed('Climbed to Upper Deck Panoramic Lounge');
              return;
            } else {
              this.bmtcBusSystem.boardPlayer(this.player, 'LOWER_DECK');
              this.audioManager.playUIBeep(520);
              this.hud.triggerKillfeed('Descended to Lower Deck');
              return;
            }
          } else if (distToBus < 5.8) {
            this.bmtcBusSystem.boardPlayer(this.player, 'LOWER_DECK');
            this.audioManager.playBusDoorChime();
            this.hud.triggerKillfeed('Boarded BMTC SkyCruiser (Route 201G)');
            return;
          }
        }

        // 2. Check Supercar
        const distToSupercar = this.supercar.getInteractionDistance(this.player.position);
        if (distToSupercar < 4.5) {
          this.enterVehicle(this.supercar);
          return;
        }

        // 3. Check Auto-Rickshaw
        const distToAuto = this.drivableAuto.getInteractionDistance(this.player.position);
        if (distToAuto < 4.2) {
          this.enterVehicle(this.drivableAuto);
          return;
        }

        // 4. Check Supply Drop Crate
        const supplyDrop = this.supplyDropManager.getClosestDrop(this.player.position);
        if (supplyDrop) {
          supplyDrop.isOpened = true;
          supplyDrop.mesh.visible = false;
          const p = this.brGameState.getPlayer('P-001');
          p.armorLevel = 3;
          p.armorDurability = 250;
          p.helmetLevel = 3;
          p.helmetDurability = 230;
          this.weaponSystem.switchWeapon(supplyDrop.loot.weaponKey);
          this.audioManager.playUIBeep(880);
          this.hud.triggerKillfeed(`Equipped Legendary Supply Cache (${supplyDrop.loot.weapon})!`);
          return;
        }

        // 5. Check District Ground Loot
        const brLoot = this.brLootSystem.getClosestLoot(this.player.position);
        if (brLoot) {
          brLoot.isLooted = true;
          brLoot.mesh.visible = false;
          const p = this.brGameState.getPlayer('P-001');
          if (brLoot.item.category === 'weapon') {
            this.weaponSystem.switchWeapon(brLoot.item.weaponKey);
          } else if (brLoot.item.category === 'armor') {
            p.armorLevel = brLoot.item.level;
            p.armorDurability = brLoot.item.durability;
          } else if (brLoot.item.category === 'helmet') {
            p.helmetLevel = brLoot.item.level;
            p.helmetDurability = brLoot.item.durability;
          } else if (brLoot.item.category === 'med') {
            p.health = Math.min(100, p.health + brLoot.item.healAmount);
          }
          this.audioManager.playUIBeep(720);
          this.hud.triggerKillfeed(`Looted ${brLoot.item.name}!`);
          return;
        }

        // 6. Check Ground Loot Crate
        const crate = this.lootSpawner.getClosestCrate(this.player.position, 3.5);
        if (crate) {
          crate.isOpened = true;
          crate.mesh.visible = false;
          this.weaponSystem.clipAmmo = 30;
          this.weaponSystem.reserveAmmo = 120;
          this.audioManager.playUIBeep(880);
          this.hud.triggerKillfeed(`Equipped ${crate.name}!`);
          return;
        }

        // 7. Check Phase 4 Interactive Doors
        const doorResult = this.enterableBuildings.toggleClosestDoor(this.player.position);
        if (doorResult.success) {
          this.hud.triggerKillfeed(`${doorResult.isOpen ? 'Opened' : 'Closed'} ${doorResult.name}`);
          return;
        }

        // 8. Check Phase 4 Interior Loot
        const intLoot = this.enterableBuildings.getClosestInteriorLoot(this.player.position);
        if (intLoot) {
          intLoot.isLooted = true;
          intLoot.mesh.visible = false;
          this.weaponSystem.reserveAmmo += 60;
          this.audioManager.playUIBeep(880);
          this.hud.triggerKillfeed(`Secured ${intLoot.name}!`);
          return;
        }

        // 9. Quick Mission Start Check (If near any open-world mission start point)
        if (!this.missionManager.activeMission) {
          for (const m of this.missionManager.missions) {
            if (m.status === 'AVAILABLE') {
              this.missionManager.startMission(m.id);
              this.hud.triggerKillfeed(`Started Mission: ${m.title}`);
              return;
            }
          }
        }
      }
    };
  }

  setupCombatInputs() {
    // Left Click: Shoot
    this.inputManager.onFireStartCallback = () => {
      if (!this.gameState.isInVehicle && this.weaponSystem) {
        this.weaponSystem.startFire();
        if (this.advancedCivilianAI) {
          this.advancedCivilianAI.triggerGunfirePanic(this.player.position);
        }
      }
    };

    this.inputManager.onFireStopCallback = () => {
      if (this.weaponSystem) {
        this.weaponSystem.stopFire();
      }
    };

    // Right Click: Aim Down Sights (ADS)
    this.inputManager.onAimStartCallback = () => {
      if (!this.gameState.isInVehicle) {
        this.weaponSystem.setAiming(true, true);
        this.hud.setCrosshairAiming(true);
      }
    };

    this.inputManager.onAimStopCallback = () => {
      this.weaponSystem.setAiming(false, false);
      this.hud.setCrosshairAiming(false);
    };

    // Tactical Reload with [R]
    this.inputManager.onReloadCallback = () => {
      if (this.weaponSystem) {
        this.weaponSystem.startReload();
      }
    };

    // Toggle Fire Mode with [B]
    this.inputManager.onToggleFireModeCallback = () => {
      if (this.weaponSystem && this.weaponSystem.toggleFireMode) {
        const mode = this.weaponSystem.toggleFireMode();
        this.hud.triggerKillfeed(`Fire Mode: ${mode}`);
      }
    };

    // Number keys for weapon slots
    this.inputManager.onSwitchWeaponCallback = (wepKey) => {
      if (this.weaponSystem) {
        this.weaponSystem.switchWeapon(wepKey);
        this.hud.updateWeaponCard(
          this.weaponSystem.activeConfig.name,
          this.weaponSystem.fireMode || 'AUTO',
          this.weaponSystem.activeConfig.caliber,
          this.weaponSystem.clipAmmo,
          this.weaponSystem.reserveAmmo,
          wepKey
        );
        this.audioManager.playUIBeep(520);
      }
    };

    // Dev Drawer (~ key toggle)
    this.inputManager.onToggleDevDrawerCallback = () => {
      this.hud.toggleDevDrawer();
    };

    // Weapon selection from dev drawer
    this.hud.onSelectWeapon = (wepKey) => {
      if (this.weaponSystem) {
        this.weaponSystem.switchWeapon(wepKey);
        this.hud.updateWeaponCard(
          this.weaponSystem.activeConfig.name,
          this.weaponSystem.fireMode || 'AUTO',
          this.weaponSystem.activeConfig.caliber,
          this.weaponSystem.clipAmmo,
          this.weaponSystem.reserveAmmo,
          wepKey
        );
      }
    };
  }

  enterVehicle(vehicle) {
    this.gameState.isInVehicle = true;
    this.gameState.activeVehicle = vehicle;
    vehicle.isOccupied = true;
    if (vehicle.startEntryTransition) vehicle.startEntryTransition();
    this.hud.hideInteractionPrompt();
    this.audioManager.playUIBeep(520);
  }

  exitVehicle() {
    if (!this.gameState.activeVehicle) return;
    const vehicle = this.gameState.activeVehicle;
    if (vehicle.startExitTransition) vehicle.startExitTransition();
    vehicle.isOccupied = false;
    this.gameState.isInVehicle = false;
    this.gameState.activeVehicle = null;

    // Place player beside vehicle
    this.player.teleport(vehicle.position.x + 3.0, 0, vehicle.position.z);
    this.audioManager.stopVehicleEngine();
  }

  setupWindowEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  animate() {
    requestAnimationFrame(this.animate);

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const mouseDelta = this.inputManager.consumeMouseDelta();

    if (this.gameState.isPlaying()) {
      const isAiming = this.inputManager.keys.aim;
      const isADS = isAiming && !this.player.isSprinting;
      const p1State = this.brGameState.getPlayer('P-001');
      const matchState = this.brGameState.matchStateMachine.currentState;

      // Space key parachute deployment during freefall
      if (this.inputManager.keys.jump && this.flightController.state === EAirFlightState.Freefall) {
        this.flightController.deployParachute();
      }

      // Update Player or Vehicle
      if (this.gameState.isInVehicle) {
        const vehicle = this.gameState.activeVehicle;
        vehicle.update(delta, this.inputManager.keys, this.audioManager);
        this.thirdPersonCamera.update(delta, vehicle.position, mouseDelta, false, false, false, false);
      } else {
        const cameraYaw = this.thirdPersonCamera.getYaw();
        const cameraPitch = this.thirdPersonCamera.getPitch();
        const currentDeck = this.bmtcBusSystem.getPlayerCurrentDeck(this.player);

        // Aircraft Flight Phase
        if (matchState === EBattleRoyaleMatchState.AircraftDeparture) {
          this.cargoAircraft.update(delta, this.player, p1State);
          this.thirdPersonCamera.update(delta, this.player.position, mouseDelta, false, false, false, false);
          if (this.cargoAircraft.canJump && !this.cargoAircraft.hasLocalPlayerJumped) {
            this.hud.showInteractionPrompt('Eject / Jump from Aircraft [F]');
          }
        }
        // Freefall & Parachute Descent
        else if (matchState === EBattleRoyaleMatchState.DropPhase || this.flightController.isDropping()) {
          this.flightController.update(
            delta,
            this.player,
            this.inputManager.keys,
            cameraYaw,
            cameraPitch,
            () => {
              this.brGameState.matchStateMachine.setState(EBattleRoyaleMatchState.ActiveMatch);
              this.hud.triggerKillfeed('Touchdown! Scavenge weapons and rotate to the Safe Zone');
            }
          );
          this.thirdPersonCamera.update(delta, this.player.position, mouseDelta, false, false, false, false);
        }
        // Standard On-Foot Battle Royale Gameplay
        else {
          this.player.update(delta, this.inputManager.keys, cameraYaw, cameraPitch, isAiming);
          this.thirdPersonCamera.update(
            delta,
            this.player.position,
            mouseDelta,
            this.player.isSprinting,
            this.player.isCrouched,
            isAiming,
            isADS,
            [],
            currentDeck
          );

          // Interaction prompts check
          const ddBus = this.bmtcBusSystem.doubleDeckerBus;
          const isAboardDD = ddBus && this.bmtcBusSystem.isPlayerAboard(this.player, ddBus);
          const distDDBus = ddBus ? this.bmtcBusSystem.getInteractionDistance(this.player.position, ddBus) : 999;
          const distSupercar = this.supercar.getInteractionDistance(this.player.position);
          const distAuto = this.drivableAuto.getInteractionDistance(this.player.position);
          const lootCrate = this.lootSpawner.getClosestCrate(this.player.position);
          const supplyDrop = this.supplyDropManager.getClosestDrop(this.player.position);
          const brLoot = this.brLootSystem.getClosestLoot(this.player.position);

          if (supplyDrop) {
            this.hud.showInteractionPrompt(`Open Legendary Supply Drop (${supplyDrop.loot.weapon}) [E]`);
          } else if (brLoot) {
            this.hud.showInteractionPrompt(`Equip ${brLoot.item.name} [E]`);
          } else if (isAboardDD) {
            if (currentDeck === 'UPPER_DECK') {
              this.hud.showInteractionPrompt('Upper Deck Front Vista — [E] Descend to Lower Deck | [F] Alight');
            } else {
              this.hud.showInteractionPrompt('Lower Deck — [E] Climb to Upper Deck | [F] Alight to Curb');
            }
          } else if (distDDBus < 5.8) {
            this.hud.showInteractionPrompt('Board BMTC Double-Decker Bus (201G: Majestic ⇄ Electronic City) [E]');
          } else if (distSupercar < 4.8) {
            this.hud.showInteractionPrompt('Drive Vajra Venom GT [E]');
          } else if (distAuto < 4.2) {
            this.hud.showInteractionPrompt('Drive Auto-Rickshaw [E]');
          } else if (lootCrate) {
            this.hud.showInteractionPrompt(`Equip ${lootCrate.name} [E]`);
          } else if (this.enterableBuildings.getClosestInteriorLoot(this.player.position, 3.2)) {
            const intLoot = this.enterableBuildings.getClosestInteriorLoot(this.player.position, 3.2);
            this.hud.showInteractionPrompt(`Scavenge ${intLoot.name} [E]`);
          } else if (this.enterableBuildings.interactiveDoors.some(d => d.worldPos.distanceTo(this.player.position) < 3.2)) {
            this.hud.showInteractionPrompt('Open / Close Building Door [E]');
          } else if (this.electricBus.getInteractionDistance(this.player.position) < 6.0) {
            this.hud.showInteractionPrompt(`BMTC Vajra EV (Battery: ${Math.round(this.electricBus.batterySOC)}%) [E]`);
          } else if (Math.abs(this.player.position.x) < 35 && Math.abs(this.player.position.z - (-20)) < 15) {
            this.hud.showInteractionPrompt('Namma Metro Concourse — Ascend to Platform [E]');
          } else {
            this.hud.hideInteractionPrompt();
          }
        }
      }

      // Update Phase 3 Master Battle Royale Systems
      this.brGameMode.update(delta, this.player.position);
      const zoneData = this.brZoneManager.update(delta, this.player, p1State);
      this.supplyDropManager.update(delta);
      this.brLootSystem.update(delta);
      this.knockReviveSystem.update(delta, this.player, p1State);
      this.spectatorManager.update(delta);

      // Update Phase 4 Advanced Living Systems
      this.cityLifeManager.update(delta, this.player.position, this.hud);
      this.electricBus.update(delta, this.player, this.inputManager.keys);
      this.policeSystem.update(delta, matchState === EBattleRoyaleMatchState.ActiveMatch ? 'BATTLE_ROYALE' : 'OPEN_WORLD', this.player.position);
      this.missionManager.update(delta, this.player.position, this.gameState.isInVehicle ? 55 : 15, this.hud);
      this.missionHUD.update(this.missionManager.activeMission, this.player.position, this.missionManager.missionTimer);

      // Update Phase 3 HUD
      this.brHUD.update(this.brGameState.aliveCount, p1State.kills, zoneData, p1State, this.flightController);

      // Update Phase 2.5 BMTC Transportation Network
      this.bmtcBusSystem.update(delta, this.player, this.busRouteManager);
      this.busStopSystem.update(delta);
      this.passengerNPCSystem.update(delta);

      // Update Combat Systems
      this.weaponSystem.setAiming(isAiming, isADS);
      this.weaponSystem.update(delta, this.camera, this.gameState.isInVehicle, this.thirdPersonCamera);
      this.lootSpawner.update(delta);
      this.brManager.update(delta, this.player, this.hud);

      // Update Phase 5 Performance & Partitioning Systems
      this.profiler.update();
      this.worldPartition.update(this.player.position);
      this.trafficSystem.update(delta, this.player.position);
      this.dayNightCycle.update(delta);
      this.weatherSystem.update(delta, this.player.position);

      // Update HUD, Ammo, and Minimap
      const activePos = this.gameState.isInVehicle ? this.gameState.activeVehicle.position : this.player.position;
      const compassBearing = this.thirdPersonCamera.getCompassBearing();
      const nitroVal = (this.gameState.isInVehicle && this.gameState.activeVehicle === this.supercar) ? this.supercar.nitroFuel : null;
      
      this.hud.update(activePos, compassBearing, nitroVal);
      this.hud.updateWeaponCard(
        this.weaponSystem.activeConfig.name,
        this.weaponSystem.fireMode || 'AUTO',
        this.weaponSystem.activeConfig.caliber,
        this.weaponSystem.clipAmmo,
        this.weaponSystem.reserveAmmo,
        this.weaponSystem.currentWeaponKey
      );
      this.minimap.renderMinimap(activePos, this.thirdPersonCamera.getYaw(), this.gameState.currentZone);
    } else if (this.gameState.currentState === GameModeState.MAP_OPEN) {
      const activePos = this.gameState.isInVehicle ? this.gameState.activeVehicle.position : this.player.position;
      this.minimap.renderWorldMap(activePos, this.thirdPersonCamera.getYaw());
    }

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  }
}

// Bootstrap game when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  new BengaluruGame();
});
