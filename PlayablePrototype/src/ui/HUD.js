// Original Tactical Battle Royale HUD Coordinator & Simulation Dev Controls
// BENGALURU: LAST CITY - Phase 2 Overhaul
import { ZONES } from '../config/constants.js';

export class HUD {
  constructor(gameState, audioManager) {
    this.gameState = gameState;
    this.audioManager = audioManager;

    // Elements
    this.hudRoot = document.getElementById('hud');
    this.healthBar = document.getElementById('health-bar');
    this.healthVal = document.getElementById('health-value');
    this.armorBar = document.getElementById('armor-bar');
    this.armorVal = document.getElementById('armor-value');
    this.staminaBar = document.getElementById('stamina-bar');
    this.staminaVal = document.getElementById('stamina-value');

    this.compassBearing = document.getElementById('compass-bearing');
    this.districtPill = document.getElementById('current-district-pill');
    this.interactionPrompt = document.getElementById('interaction-prompt');
    this.promptLabel = document.getElementById('prompt-label');

    // Tactical Weapon Elements
    this.weaponName = document.getElementById('weapon-name');
    this.weaponFiremode = document.getElementById('weapon-firemode');
    this.weaponCaliber = document.getElementById('weapon-caliber');
    this.ammoClip = document.getElementById('ammo-clip');
    this.ammoReserve = document.getElementById('ammo-reserve');
    this.crosshair = document.getElementById('weapon-crosshair');

    // Battle Royale Match Telemetry
    this.killfeed = document.getElementById('killfeed-container');
    this.brStatusPanel = document.getElementById('br-status-panel');
    this.brAliveCount = document.getElementById('br-alive-count');
    this.brStormTimer = document.getElementById('br-storm-timer');
    this.stormWarning = document.getElementById('storm-warning-banner');

    // Simulation Dev Drawer
    this.devDrawer = document.getElementById('sim-dev-drawer');
    this.btnToggleDevDrawer = document.getElementById('btn-toggle-dev-drawer');
    this.btnCloseDevDrawer = document.getElementById('btn-close-dev-drawer');

    // Callbacks
    this.onToggleTime = null;
    this.onToggleWeather = null;
    this.onToggleCamera = null;
    this.onOpenMap = null;
    this.onOpenGarage = null;
    this.onSelectWeapon = null;

    this.initButtons();
  }

  initButtons() {
    // 1. Simulation Dev Drawer Toggles
    if (this.btnToggleDevDrawer) {
      this.btnToggleDevDrawer.addEventListener('click', () => {
        this.toggleDevDrawer();
      });
    }

    if (this.btnCloseDevDrawer) {
      this.btnCloseDevDrawer.addEventListener('click', () => {
        if (this.devDrawer) this.devDrawer.classList.add('hidden');
      });
    }

    // 2. Testing Simulation Drawer Buttons
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

    // 3. Dev Drawer Weapon Select Buttons
    const wepBtns = document.querySelectorAll('.d-wep-btn');
    wepBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const wepKey = btn.getAttribute('data-wep');
        wepBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (this.onSelectWeapon) this.onSelectWeapon(wepKey);
        this.audioManager.playUIBeep(580);
      });
    });
  }

  toggleDevDrawer() {
    if (!this.devDrawer) return;
    this.devDrawer.classList.toggle('hidden');
    this.audioManager.playUIBeep(520);
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

  updateWeaponCard(name, fireMode, caliber, clip, reserve, currentKey) {
    if (this.weaponName) this.weaponName.innerText = name;
    if (this.weaponFiremode) this.weaponFiremode.innerText = fireMode;
    if (this.weaponCaliber) this.weaponCaliber.innerText = caliber;
    if (this.ammoClip) {
      this.ammoClip.innerText = clip;
      // Low-ammo warning coloring
      this.ammoClip.style.color = (clip <= 5) ? '#ff1744' : '#ffffff';
    }
    if (this.ammoReserve) this.ammoReserve.innerText = reserve;

    // Update active slot pill in footer
    const pills = document.querySelectorAll('.slot-pill');
    pills.forEach(pill => {
      const slot = pill.getAttribute('data-slot');
      if (slot === currentKey) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // Update drawer button
    const wepBtns = document.querySelectorAll('.d-wep-btn');
    wepBtns.forEach(b => {
      if (b.getAttribute('data-wep') === currentKey) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });
  }

  updateAmmo(clip, reserve) {
    if (this.ammoClip) {
      this.ammoClip.innerText = clip;
      this.ammoClip.style.color = (clip <= 5) ? '#ff1744' : '#ffffff';
    }
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
    // 1. Health Bar & Vitals
    if (this.healthBar) {
      const hpPct = Math.round((this.gameState.health / this.gameState.maxHealth) * 100);
      this.healthBar.style.width = `${hpPct}%`;
      this.healthVal.innerText = `${Math.round(this.gameState.health)} / ${this.gameState.maxHealth}`;
    }

    // 2. Armor Vest Shield (Simulated 100 HP Shield)
    if (this.armorBar) {
      const armorVal = Math.min(100, Math.round(this.gameState.health));
      this.armorBar.style.width = `${armorVal}%`;
      if (this.armorVal) this.armorVal.innerText = `${armorVal} / 100`;
    }

    // 3. Stamina or Nitro Bar
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

    // 4. Compass Bearing
    if (this.compassBearing) {
      this.compassBearing.innerText = `${String(cameraBearing).padStart(3, '0')}°`;
    }

    // 5. District Landmark Pill Determination
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
