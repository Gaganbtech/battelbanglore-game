// In-Game HUD coordinator: health/stamina bars, compass, prompt, and quick toggles
import { ZONES } from '../config/constants.js';

export class HUD {
  constructor(gameState, audioManager) {
    this.gameState = gameState;
    this.audioManager = audioManager;

    // DOM Elements
    this.hudRoot = document.getElementById('hud');
    this.healthBar = document.getElementById('health-bar');
    this.healthVal = document.getElementById('health-value');
    this.staminaBar = document.getElementById('stamina-bar');
    this.staminaVal = document.getElementById('stamina-value');
    this.compassBearing = document.getElementById('compass-bearing');
    this.districtPill = document.getElementById('current-district-pill');
    this.interactionPrompt = document.getElementById('interaction-prompt');
    this.promptLabel = document.getElementById('prompt-label');

    this.onToggleTime = null;
    this.onToggleWeather = null;
    this.onToggleCamera = null;
    this.onOpenMap = null;

    this.initButtons();
  }

  initButtons() {
    const btnTime = document.getElementById('btn-toggle-time');
    const btnWeather = document.getElementById('btn-toggle-weather');
    const btnCamera = document.getElementById('btn-toggle-camera');
    const btnMap = document.getElementById('btn-open-map');
    const minimapTrigger = document.getElementById('minimap-click-trigger');

    if (btnTime) {
      btnTime.addEventListener('click', () => {
        this.audioManager.playUIBeep(520);
        if (this.onToggleTime) {
          const newTime = this.onToggleTime();
          const icons = { day: '☀️ Time: Day', sunset: '🌅 Time: Sunset', night: '🌙 Time: Night' };
          btnTime.innerText = icons[newTime] || '☀️ Time: Day';
        }
      });
    }

    if (btnWeather) {
      btnWeather.addEventListener('click', () => {
        this.audioManager.playUIBeep(480);
        if (this.onToggleWeather) {
          const newWeather = this.onToggleWeather();
          btnWeather.innerText = (newWeather === 'rain') ? '🌧️ Weather: Rain' : '☀️ Weather: Clear';
        }
      });
    }

    if (btnCamera) {
      btnCamera.addEventListener('click', () => {
        this.audioManager.playUIBeep(600);
        if (this.onToggleCamera) this.onToggleCamera();
      });
    }

    if (btnMap) {
      btnMap.addEventListener('click', () => {
        this.audioManager.playUIBeep(700);
        if (this.onOpenMap) this.onOpenMap();
      });
    }

    if (minimapTrigger) {
      minimapTrigger.addEventListener('click', () => {
        this.audioManager.playUIBeep(700);
        if (this.onOpenMap) this.onOpenMap();
      });
    }
  }

  show() {
    if (this.hudRoot) this.hudRoot.classList.remove('hidden');
  }

  hide() {
    if (this.hudRoot) this.hudRoot.classList.add('hidden');
  }

  update(playerPos, cameraBearing) {
    // Health & Stamina bars
    if (this.healthBar) {
      const hpPct = Math.round((this.gameState.health / this.gameState.maxHealth) * 100);
      this.healthBar.style.width = `${hpPct}%`;
      this.healthVal.innerText = `${Math.round(this.gameState.health)} / ${this.gameState.maxHealth}`;
    }

    if (this.staminaBar) {
      const stamPct = Math.round((this.gameState.stamina / this.gameState.maxStamina) * 100);
      this.staminaBar.style.width = `${stamPct}%`;
      this.staminaVal.innerText = `${stamPct}%`;
    }

    // Compass
    if (this.compassBearing) {
      this.compassBearing.innerText = `${String(cameraBearing).padStart(3, '0')}°`;
    }

    // Determine current district by distance to zone centers
    let currentZone = ZONES.ZONE_A;
    let closestDist = Infinity;

    Object.values(ZONES).forEach(zone => {
      const dx = playerPos.x - zone.center.x;
      const dz = playerPos.z - zone.center.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < closestDist) {
        closestDist = dist;
        currentZone = zone;
      }
    });

    if (this.districtPill && this.districtPill.innerText !== currentZone.name) {
      this.districtPill.innerText = currentZone.name;
      this.districtPill.style.color = currentZone.color;
    }
  }

  showInteractionPrompt(text) {
    if (!this.interactionPrompt) return;
    this.promptLabel.innerText = text;
    this.interactionPrompt.classList.remove('hidden');
  }

  hideInteractionPrompt() {
    if (!this.interactionPrompt) return;
    this.interactionPrompt.classList.add('hidden');
  }
}
