// In-Game HUD coordinator: health/stamina/nitro bars, compass, prompt, weapon ammo, killfeed, and BR stats
import { ZONES } from '../config/constants.js';

export class HUD {
  constructor(gameState, audioManager) {
    this.gameState = gameState;
    this.audioManager = audioManager;

    // Elements
    this.hudRoot = document.getElementById('hud');
    this.healthBar = document.getElementById('health-bar');
    this.healthVal = document.getElementById('health-value');
    this.staminaBar = document.getElementById('stamina-bar');
    this.staminaVal = document.getElementById('stamina-value');
    this.compassBearing = document.getElementById('compass-bearing');
    this.districtPill = document.getElementById('current-district-pill');
    this.interactionPrompt = document.getElementById('interaction-prompt');
    this.promptLabel = document.getElementById('prompt-label');

    // Phase 2 Elements
    this.crosshair = document.getElementById('weapon-crosshair');
    this.ammoClip = document.getElementById('ammo-clip');
    this.ammoReserve = document.getElementById('ammo-reserve');
    this.killfeed = document.getElementById('killfeed-container');
    this.brStatusPanel = document.getElementById('br-status-panel');
    this.brAliveCount = document.getElementById('br-alive-count');
    this.brStormTimer = document.getElementById('br-storm-timer');
    this.stormWarning = document.getElementById('storm-warning-banner');

    this.onToggleTime = null;
    this.onToggleWeather = null;
    this.onToggleCamera = null;
    this.onOpenMap = null;
    this.onOpenGarage = null;

    this.initButtons();
  }

  initButtons() {
    const btnTime = document.getElementById('btn-toggle-time');
    const btnWeather = document.getElementById('btn-toggle-weather');
    const btnCamera = document.getElementById('btn-toggle-camera');
    const btnMap = document.getElementById('btn-open-map');
    const btnGarage = document.getElementById('btn-open-garage');
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

    if (btnGarage) {
      btnGarage.addEventListener('click', () => {
        this.audioManager.playUIBeep(640);
        if (this.onOpenGarage) this.onOpenGarage();
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

  setCrosshairAiming(isAiming) {
    if (!this.crosshair) return;
    if (isAiming) {
      this.crosshair.classList.add('aiming');
    } else {
      this.crosshair.classList.remove('aiming');
    }
  }

  updateAmmo(clip, reserve) {
    if (this.ammoClip) this.ammoClip.innerText = clip;
    if (this.ammoReserve) this.ammoReserve.innerText = reserve;
  }

  updateBRStats(aliveCount, secondsRemaining, isOutsideStorm) {
    if (this.brStatusPanel) this.brStatusPanel.classList.remove('hidden');
    if (this.brAliveCount) this.brAliveCount.innerText = aliveCount;

    if (this.brStormTimer) {
      const mins = Math.floor(secondsRemaining / 60);
      const secs = secondsRemaining % 60;
      this.brStormTimer.innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    if (this.stormWarning) {
      if (isOutsideStorm) {
        this.stormWarning.classList.remove('hidden');
      } else {
        this.stormWarning.classList.add('hidden');
      }
    }
  }

  triggerKillfeed(text) {
    if (!this.killfeed) return;
    const item = document.createElement('div');
    item.className = 'killfeed-item';
    item.innerText = text;
    this.killfeed.appendChild(item);

    setTimeout(() => {
      if (item.parentNode) item.parentNode.removeChild(item);
    }, 4500);
  }

  update(playerPos, cameraBearing, vehicleNitro = null) {
    // Health Bar
    if (this.healthBar) {
      const hpPct = Math.round((this.gameState.health / this.gameState.maxHealth) * 100);
      this.healthBar.style.width = `${hpPct}%`;
      this.healthVal.innerText = `${Math.round(this.gameState.health)} / ${this.gameState.maxHealth}`;
    }

    // Stamina or Nitro Bar
    if (this.staminaBar) {
      if (vehicleNitro !== null) {
        const nitroPct = Math.round(vehicleNitro);
        this.staminaBar.style.width = `${nitroPct}%`;
        this.staminaVal.innerText = `NITRO: ${nitroPct}%`;
        this.staminaBar.style.background = 'linear-gradient(90deg, #00e5ff 0%, #76ff03 100%)';
      } else {
        const stamPct = Math.round((this.gameState.stamina / this.gameState.maxStamina) * 100);
        this.staminaBar.style.width = `${stamPct}%`;
        this.staminaVal.innerText = `${stamPct}%`;
        this.staminaBar.style.background = 'linear-gradient(90deg, #ff9100 0%, #ffd600 100%)';
      }
    }

    // Compass
    if (this.compassBearing) {
      this.compassBearing.innerText = `${String(cameraBearing).padStart(3, '0')}°`;
    }

    // District pill determination
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
