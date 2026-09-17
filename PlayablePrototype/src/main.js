// BENGALURU: LAST CITY - Master Prototype Engine (Phase 2)
import * as THREE from 'three';
import { GameState, GameModeState } from './core/GameState.js';
import { InputManager } from './core/InputManager.js';
import { AudioManager } from './core/AudioManager.js';

import { PlayerCharacter } from './player/PlayerCharacter.js';
import { ThirdPersonCamera } from './player/ThirdPersonCamera.js';

import { RoadNetwork } from './world/RoadNetwork.js';
import { MetroSystem } from './world/MetroSystem.js';
import { CityBuilder } from './world/CityBuilder.js';
import { DayNightCycle } from './world/DayNightCycle.js';
import { WeatherSystem } from './world/WeatherSystem.js';
import { MovingMetroTrain } from './world/MovingMetroTrain.js';

import { TrafficSystem } from './simulation/TrafficSystem.js';
import { CivilianNPCSystem } from './simulation/CivilianNPCSystem.js';
import { DrivableVehicle } from './simulation/DrivableVehicle.js';
import { Supercar } from './simulation/Supercar.js';

import { WeaponSystem } from './combat/WeaponSystem.js';
import { LootSpawner } from './combat/LootSpawner.js';
import { BattleRoyaleManager } from './gamemodes/BattleRoyaleManager.js';

import { MinimapRenderer } from './ui/Minimap.js';
import { HUD } from './ui/HUD.js';
import { MainMenu } from './ui/MainMenu.js';
import { GarageMenu } from './ui/GarageMenu.js';

class BengaluruGame {
  constructor() {
    this.container = document.getElementById('game-container');

    // Setup Three.js Scene, Camera, and Renderer
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.container.appendChild(this.renderer.domElement);

    // Systems & State
    this.gameState = new GameState();
    this.audioManager = new AudioManager(this.gameState);
    this.inputManager = new InputManager(this.renderer.domElement, this.gameState);

    // World Infrastructure
    this.roadNetwork = new RoadNetwork(this.scene);
    this.metroSystem = new MetroSystem(this.scene);
    this.cityBuilder = new CityBuilder(this.scene);
    this.movingMetro = new MovingMetroTrain(this.scene, this.audioManager);

    // Vehicles: Auto-Rickshaw & Phase 2 Vajra Hypercar
    this.trafficSystem = new TrafficSystem(this.scene);
    this.civilianNPCSystem = new CivilianNPCSystem(this.scene);
    this.drivableAuto = new DrivableVehicle(this.scene, 'auto', new THREE.Vector3(8, 0, 14));
    this.supercar = new Supercar(this.scene, new THREE.Vector3(-12, 0, 16));

    // Atmosphere
    this.dayNightCycle = new DayNightCycle(
      this.scene,
      this.renderer,
      this.roadNetwork,
      this.cityBuilder,
      this.trafficSystem
    );
    this.weatherSystem = new WeatherSystem(this.scene, this.audioManager);

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

    // Start Battle Royale Sky Drop
    this.mainMenu.onStartBattleRoyale = () => {
      this.gameState.setState(GameModeState.PLAYING);
      this.hud.show();
      this.brManager.startBattleRoyale(this.player);
      this.inputManager.requestPointerLock();
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

    // Interaction with [E]
    this.inputManager.onInteractCallback = () => {
      if (!this.gameState.isPlaying()) return;

      if (this.gameState.isInVehicle) {
        this.exitVehicle();
      } else {
        // 1. Check Supercar
        const distToSupercar = this.supercar.getInteractionDistance(this.player.position);
        if (distToSupercar < 4.5) {
          this.enterVehicle(this.supercar);
          return;
        }

        // 2. Check Auto-Rickshaw
        const distToAuto = this.drivableAuto.getInteractionDistance(this.player.position);
        if (distToAuto < 4.2) {
          this.enterVehicle(this.drivableAuto);
          return;
        }

        // 3. Check Ground Loot Crate
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
      }
    };
  }

  setupCombatInputs() {
    // Left Click: Shoot
    this.inputManager.onFireStartCallback = () => {
      if (!this.gameState.isInVehicle && this.weaponSystem) {
        this.weaponSystem.startFire();
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
        this.weaponSystem.setAiming(true);
        this.hud.setCrosshairAiming(true);
        this.thirdPersonCamera.targetFOV = 52.0; // Zoom
      }
    };

    this.inputManager.onAimStopCallback = () => {
      this.weaponSystem.setAiming(false);
      this.hud.setCrosshairAiming(false);
      this.thirdPersonCamera.targetFOV = 75.0;
    };

    // R Key: Reload
    this.inputManager.onReloadCallback = () => {
      if (this.weaponSystem) {
        this.weaponSystem.reload();
      }
    };
  }

  enterVehicle(vehicle) {
    this.gameState.isInVehicle = true;
    this.gameState.activeVehicle = vehicle;
    vehicle.isOccupied = true;
    this.hud.hideInteractionPrompt();
    this.audioManager.playUIBeep(520);
  }

  exitVehicle() {
    if (!this.gameState.activeVehicle) return;
    const vehicle = this.gameState.activeVehicle;
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
      // Update Player or Vehicle
      if (this.gameState.isInVehicle) {
        const vehicle = this.gameState.activeVehicle;
        vehicle.update(delta, this.inputManager.keys, this.audioManager);
        this.thirdPersonCamera.update(delta, vehicle.position, mouseDelta, false);
      } else {
        const cameraYaw = this.thirdPersonCamera.getYaw();
        this.player.update(delta, this.inputManager.keys, cameraYaw);
        this.thirdPersonCamera.update(
          delta,
          this.player.position,
          mouseDelta,
          this.player.isSprinting
        );

        // Check interaction prompts
        const distSupercar = this.supercar.getInteractionDistance(this.player.position);
        const distAuto = this.drivableAuto.getInteractionDistance(this.player.position);
        const lootCrate = this.lootSpawner.getClosestCrate(this.player.position);

        if (distSupercar < 4.5) {
          this.hud.showInteractionPrompt('Drive Vajra Hypercar [E]');
        } else if (distAuto < 4.2) {
          this.hud.showInteractionPrompt('Drive Auto-Rickshaw [E]');
        } else if (lootCrate) {
          this.hud.showInteractionPrompt(`Pick up ${lootCrate.name} [E]`);
        } else if (Math.abs(this.player.position.x) < 35 && Math.abs(this.player.position.z - (-20)) < 15) {
          this.hud.showInteractionPrompt('Board Namma Metro Train Platform');
        } else {
          this.hud.hideInteractionPrompt();
        }
      }

      // Update Phase 2 Systems
      this.weaponSystem.update(delta, this.camera, this.gameState.isInVehicle);
      this.lootSpawner.update(delta);
      this.movingMetro.update(delta, this.player);
      this.brManager.update(delta, this.player, this.hud);

      // Update Phase 1 Systems
      this.trafficSystem.update(delta);
      this.civilianNPCSystem.update(delta, this.player.position);
      this.dayNightCycle.update(delta);
      this.weatherSystem.update(delta, this.player.position);

      // Update HUD, Ammo, and Minimap
      const activePos = this.gameState.isInVehicle ? this.gameState.activeVehicle.position : this.player.position;
      const compassBearing = this.thirdPersonCamera.getCompassBearing();
      const nitroVal = (this.gameState.isInVehicle && this.gameState.activeVehicle === this.supercar) ? this.supercar.nitroFuel : null;
      
      this.hud.update(activePos, compassBearing, nitroVal);
      this.hud.updateAmmo(this.weaponSystem.clipAmmo, this.weaponSystem.reserveAmmo);
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
