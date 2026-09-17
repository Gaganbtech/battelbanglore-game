// Reference Production Tactical Battle Royale HUD (Pixel-Accurate Target Implementation)
// BENGALURU: LAST CITY - Master Production Overhaul
// Top-Left: Alive 100 & Kills 0 + Mission Card
// Top-Center: 360° Military Compass + Safe Zone Storm Warning
// Top-Right: Telemetry (52ms, Battery 89%, 08:22) + Settings + Circular Minimap + Zone Collapse Timer
// Bottom-Left: 4-Player Squad Status Cards with Live HP Bars
// Bottom-Center: Tactical Weapon Dock (Primary AR, Pistol, Grenade, Medkit) + Armor & Health Vitals
// Bottom-Right: Tactical Action Icons (ADS, Crouch, Prone, Sprint, Jump)
export class ReferenceProductionHUD {
  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'reference-production-hud';
    this.container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 100;
      font-family: 'Rajdhani', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      user-select: none;
      overflow: hidden;
      display: none;
    `;

    this.container.innerHTML = `
      <!-- TOP LEFT: ALIVE / KILLS + MISSION CARD -->
      <div style="position: absolute; top: 16px; left: 24px; display: flex; flex-direction: column; gap: 8px;">
        <!-- Alive / Kills Pill -->
        <div style="display: flex; gap: 12px; background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(51, 65, 85, 0.8); border-radius: 6px; padding: 6px 14px; backdrop-filter: blur(8px); box-shadow: 0 4px 16px rgba(0,0,0,0.5);">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="color: #94a3b8; font-size: 13px;">👥</span>
            <span style="color: #94a3b8; font-size: 11px; font-weight: 700; letter-spacing: 1px;">ALIVE</span>
            <span id="ref-alive-count" style="color: #f8fafc; font-size: 16px; font-weight: 800;">100</span>
          </div>
          <div style="width: 1px; height: 16px; background: #334155; margin: auto 0;"></div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="color: #ef4444; font-size: 13px;">☠️</span>
            <span style="color: #94a3b8; font-size: 11px; font-weight: 700; letter-spacing: 1px;">KILLS</span>
            <span id="ref-kills-count" style="color: #f8fafc; font-size: 16px; font-weight: 800;">0</span>
          </div>
        </div>

        <!-- Mission Card -->
        <div style="background: rgba(15, 23, 42, 0.8); border-left: 3px solid #f59e0b; border-radius: 4px; padding: 8px 12px; backdrop-filter: blur(8px); width: 260px;">
          <div style="display: flex; align-items: center; gap: 6px; color: #f59e0b; font-size: 11px; font-weight: 800; letter-spacing: 1px;">
            <span>▣</span>
            <span>EXPLORE BENGALURU</span>
          </div>
          <div style="color: #e2e8f0; font-size: 12px; font-weight: 600; margin-top: 3px; display: flex; align-items: center; gap: 6px;">
            <span style="width: 10px; height: 10px; border: 1px solid #64748b; border-radius: 2px; display: inline-block;"></span>
            <span>Visit MG Road Metro & Central Tech Park</span>
          </div>
        </div>
      </div>

      <!-- TOP CENTER: 360° COMPASS TAPE & STORM WARNING BANNER -->
      <div style="position: absolute; top: 14px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 10px;">
        <!-- Compass Tape Bar -->
        <div style="width: 520px; height: 34px; background: rgba(15, 23, 42, 0.78); border: 1px solid rgba(51, 65, 85, 0.85); border-radius: 6px; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px); position: relative; overflow: hidden; box-shadow: 0 4px 18px rgba(0,0,0,0.5);">
          <div id="ref-compass-strip" style="display: flex; gap: 18px; color: #cbd5e1; font-weight: 700; font-size: 12px; letter-spacing: 1.5px;">
            <span>NW</span><span>330</span><span>345</span><span style="color:#f59e0b; font-weight:900;">N</span><span>15</span><span>30</span><span>NE</span><span>60</span><span>75</span><span style="color:#38bdf8;">E</span>
          </div>
          <!-- Center Gold Indicator Tick -->
          <div style="position: absolute; bottom: 0; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-bottom: 7px solid #f59e0b;"></div>
        </div>

        <!-- Storm Damage Warning Banner -->
        <div id="ref-storm-warning" style="background: rgba(220, 38, 38, 0.35); border: 1px solid #ef4444; color: #fca5a5; padding: 6px 24px; border-radius: 6px; font-weight: 800; font-size: 13px; letter-spacing: 2px; display: none; backdrop-filter: blur(8px); text-shadow: 0 0 10px rgba(239, 68, 68, 0.8);">
          ⚠️ OUTSIDE SAFE ZONE - TAKING STORM DAMAGE!
        </div>
      </div>

      <!-- TOP RIGHT: TELEMETRY, SETTINGS, MINIMAP, ZONE STATUS -->
      <div style="position: absolute; top: 16px; right: 24px; display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
        <!-- Top Status Bar: Ping, Battery, Time, Settings -->
        <div style="display: flex; align-items: center; gap: 12px; color: #94a3b8; font-size: 12px; font-weight: 700; background: rgba(15, 23, 42, 0.85); padding: 4px 10px; border-radius: 6px; border: 1px solid #334155;">
          <span style="color: #22c55e;">📶 52ms</span>
          <span>🔋 89%</span>
          <span>08:22</span>
          <span style="cursor: pointer;" title="Settings">⚙️</span>
        </div>

        <!-- Circular Minimap Radar Wrapper -->
        <div style="position: relative; width: 140px; height: 140px; border-radius: 50%; border: 2px solid rgba(56, 189, 248, 0.45); overflow: hidden; background: #070c14; box-shadow: 0 4px 20px rgba(0,0,0,0.6);">
          <canvas id="ref-minimap-canvas" width="140" height="140" style="width: 100%; height: 100%; display: block;"></canvas>
          <div style="position: absolute; top: 8px; left: 50%; transform: translateX(-50%); color: #38bdf8; font-size: 10px; font-weight: 800;">N</div>
          <div style="position: absolute; bottom: 6px; left: 50%; transform: translateX(-50%); font-size: 10px; color: #cbd5e1;">Central Urban</div>
        </div>

        <!-- Zone Information Card -->
        <div style="background: rgba(15, 23, 42, 0.88); border: 1px solid #334155; border-radius: 6px; padding: 6px 12px; width: 150px; text-align: right; backdrop-filter: blur(8px);">
          <div style="color: #38bdf8; font-size: 10px; font-weight: 800; letter-spacing: 1px;">ZONE A: CENTRAL URBAN</div>
          <div style="display: flex; justify-content: flex-end; align-items: center; gap: 6px; margin-top: 2px;">
            <span style="color: #f59e0b; font-size: 12px;">🧭</span>
            <span style="color: #94a3b8; font-size: 10px; font-weight: 700;">Safe Zone Shrinks In:</span>
          </div>
          <div id="ref-zone-timer" style="color: #f59e0b; font-size: 18px; font-weight: 900; font-variant-numeric: tabular-nums;">
            02:45
          </div>
        </div>
      </div>

      <!-- CENTER: DYNAMIC RETICLE & INTERACTION PROMPT -->
      <div id="ref-interaction-prompt" style="position: absolute; top: 62%; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.9); border: 1px solid #38bdf8; color: #f8fafc; padding: 6px 16px; border-radius: 4px; font-size: 13px; font-weight: 700; display: none; backdrop-filter: blur(6px);">
        [E] Enter Vehicle
      </div>

      <!-- BOTTOM LEFT: 4-PLAYER TACTICAL SQUAD CARDS -->
      <div style="position: absolute; bottom: 24px; left: 24px; width: 190px; display: flex; flex-direction: column; gap: 6px;">
        <!-- Player 1 (Local) -->
        <div style="background: rgba(15, 23, 42, 0.82); border-left: 3px solid #00e5ff; border-radius: 4px; padding: 5px 8px; backdrop-filter: blur(6px);">
          <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700;">
            <span style="color: #00e5ff;">1 Player_001 (You)</span>
            <span style="color: #94a3b8;">🎙️ 🔊</span>
          </div>
          <div style="width: 100%; height: 3px; background: #334155; border-radius: 2px; margin-top: 3px;">
            <div id="sq-hp-1" style="width: 100%; height: 100%; background: #00e5ff;"></div>
          </div>
        </div>

        <!-- Teammate 2 -->
        <div style="background: rgba(15, 23, 42, 0.75); border-left: 3px solid #22c55e; border-radius: 4px; padding: 5px 8px; backdrop-filter: blur(6px);">
          <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700;">
            <span style="color: #e2e8f0;">2 Karthik_07</span>
            <span style="color: #94a3b8;">🎙️</span>
          </div>
          <div style="width: 100%; height: 3px; background: #334155; border-radius: 2px; margin-top: 3px;">
            <div style="width: 100%; height: 100%; background: #22c55e;"></div>
          </div>
        </div>

        <!-- Teammate 3 -->
        <div style="background: rgba(15, 23, 42, 0.75); border-left: 3px solid #f59e0b; border-radius: 4px; padding: 5px 8px; backdrop-filter: blur(6px);">
          <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700;">
            <span style="color: #e2e8f0;">3 Sneha_P</span>
            <span style="color: #94a3b8;">🎙️</span>
          </div>
          <div style="width: 100%; height: 3px; background: #334155; border-radius: 2px; margin-top: 3px;">
            <div style="width: 100%; height: 100%; background: #f59e0b;"></div>
          </div>
        </div>

        <!-- Teammate 4 -->
        <div style="background: rgba(15, 23, 42, 0.75); border-left: 3px solid #a855f7; border-radius: 4px; padding: 5px 8px; backdrop-filter: blur(6px);">
          <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700;">
            <span style="color: #e2e8f0;">4 Rohan_99</span>
            <span style="color: #94a3b8;">🎙️</span>
          </div>
          <div style="width: 100%; height: 3px; background: #334155; border-radius: 2px; margin-top: 3px;">
            <div style="width: 100%; height: 100%; background: #a855f7;"></div>
          </div>
        </div>
      </div>

      <!-- BOTTOM CENTER: WEAPON SELECTION DOCK & VITALS BARS -->
      <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 8px;">
        <!-- Weapon Slots Row -->
        <div style="display: flex; gap: 8px; align-items: flex-end;">
          <!-- Primary AR Card (Active Gold Outline) -->
          <div style="background: rgba(15, 23, 42, 0.85); border: 2px solid #f59e0b; border-radius: 6px; padding: 6px 12px; width: 140px; backdrop-filter: blur(8px); box-shadow: 0 0 12px rgba(245, 158, 11, 0.25);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #f59e0b; font-size: 10px; font-weight: 800;">AR-9</span>
              <span style="color: #22c55e; font-size: 9px; font-weight: 700; background: rgba(34, 197, 94, 0.15); padding: 1px 4px; border-radius: 2px;">AUTO</span>
            </div>
            <div style="text-align: center; margin: 4px 0; color: #cbd5e1; font-size: 18px;">︻╦╤─</div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 800;">
              <span style="color: #f8fafc;"><b id="ref-clip-ammo">30</b> <span style="color:#64748b;">/</span> <span id="ref-reserve-ammo">120</span></span>
              <span style="color: #94a3b8; font-size: 10px;">5.56</span>
            </div>
          </div>

          <!-- Secondary Pistol Card -->
          <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid #334155; border-radius: 6px; padding: 6px 10px; width: 85px; backdrop-filter: blur(8px);">
            <div style="color: #94a3b8; font-size: 9px; font-weight: 700;">PISTOL</div>
            <div style="text-align: center; margin: 3px 0; color: #64748b; font-size: 14px;">⌐╦╦═─</div>
            <div style="color: #cbd5e1; font-size: 11px; font-weight: 700; text-align: right;">15 / 45</div>
          </div>

          <!-- Grenade Quickslot -->
          <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid #334155; border-radius: 6px; padding: 6px 8px; width: 45px; text-align: center; backdrop-filter: blur(8px);">
            <div style="font-size: 14px;">💣</div>
            <div style="color: #f8fafc; font-size: 10px; font-weight: 800;">2</div>
          </div>

          <!-- Medkit Quickslot -->
          <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid #334155; border-radius: 6px; padding: 6px 8px; width: 45px; text-align: center; backdrop-filter: blur(8px);">
            <div style="font-size: 14px;">➕</div>
            <div style="color: #f8fafc; font-size: 10px; font-weight: 800;">3</div>
          </div>
        </div>

        <!-- Dual Vitals Bars (Helmet/Armor & Health) -->
        <div style="width: 280px; display: flex; flex-direction: column; gap: 4px;">
          <!-- Armor / Helmet Bar -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="color: #e2e8f0; font-size: 11px; font-weight: 700;">🛡️ 100</span>
            <div style="flex: 1; height: 6px; background: rgba(30, 41, 59, 0.8); border-radius: 3px; overflow: hidden; border: 1px solid #475569;">
              <div id="ref-armor-bar" style="width: 100%; height: 100%; background: #ffffff;"></div>
            </div>
          </div>

          <!-- Health Vitals Bar -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="color: #e2e8f0; font-size: 11px; font-weight: 700;">❤️ 100</span>
            <div style="flex: 1; height: 6px; background: rgba(30, 41, 59, 0.8); border-radius: 3px; overflow: hidden; border: 1px solid #475569;">
              <div id="ref-health-bar" style="width: 100%; height: 100%; background: #ffffff;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- BOTTOM RIGHT: TACTICAL ACTION ICONS -->
      <div style="position: absolute; bottom: 24px; right: 24px; display: flex; align-items: center; gap: 10px;">
        <!-- ADS Scope Button -->
        <div style="width: 44px; height: 44px; border-radius: 50%; background: rgba(15, 23, 42, 0.75); border: 1px solid #38bdf8; display: flex; justify-content: center; align-items: center; color: #38bdf8; font-size: 16px;" title="Scope / ADS [Right Click]">
          🎯
        </div>
        <!-- Crouch Button -->
        <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(15, 23, 42, 0.75); border: 1px solid #64748b; display: flex; justify-content: center; align-items: center; color: #cbd5e1; font-size: 14px;" title="Crouch [C]">
          🧎
        </div>
        <!-- Prone Button -->
        <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(15, 23, 42, 0.75); border: 1px solid #64748b; display: flex; justify-content: center; align-items: center; color: #cbd5e1; font-size: 14px;" title="Prone [Z]">
          🛌
        </div>
        <!-- Sprint Button -->
        <div style="width: 46px; height: 46px; border-radius: 50%; background: rgba(15, 23, 42, 0.75); border: 1px solid #f59e0b; display: flex; justify-content: center; align-items: center; color: #f59e0b; font-size: 16px;" title="Sprint [Shift]">
          🏃
        </div>
      </div>
    `;

    document.body.appendChild(this.container);
  }

  update(aliveCount, killsCount, zoneData, playerState, weaponState, compassBearing = 0) {
    const aliveEl = this.container.querySelector('#ref-alive-count');
    const killsEl = this.container.querySelector('#ref-kills-count');
    if (aliveEl) aliveEl.textContent = String(aliveCount);
    if (killsEl) killsEl.textContent = String(killsCount);

    // Zone Info
    if (zoneData) {
      const timerEl = this.container.querySelector('#ref-zone-timer');
      const warningEl = this.container.querySelector('#ref-storm-warning');

      const mins = Math.floor(zoneData.timeRemaining / 60);
      const secs = Math.floor(zoneData.timeRemaining % 60);
      if (timerEl) timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

      if (warningEl) {
        warningEl.style.display = zoneData.isOutside ? 'block' : 'none';
      }
    }

    // Ammo Sync
    if (weaponState) {
      const clipEl = this.container.querySelector('#ref-clip-ammo');
      const resEl = this.container.querySelector('#ref-reserve-ammo');
      if (clipEl) clipEl.textContent = String(weaponState.clip);
      if (resEl) resEl.textContent = String(weaponState.reserve);
    }

    // Health & Armor Sync
    if (playerState) {
      const hpBar = this.container.querySelector('#ref-health-bar');
      const sq1 = this.container.querySelector('#sq-hp-1');
      if (hpBar) hpBar.style.width = `${Math.max(0, playerState.health)}%`;
      if (sq1) sq1.style.width = `${Math.max(0, playerState.health)}%`;
    }
  }

  setVisible(visible) {
    this.container.style.display = visible ? 'block' : 'none';
  }

  showInteractionPrompt(text) {
    const prompt = this.container.querySelector('#ref-interaction-prompt');
    if (prompt) {
      prompt.textContent = text;
      prompt.style.display = 'block';
    }
  }

  hideInteractionPrompt() {
    const prompt = this.container.querySelector('#ref-interaction-prompt');
    if (prompt) {
      prompt.style.display = 'none';
    }
  }
}
