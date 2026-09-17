// Production Battle Royale Tactical HUD for Bengaluru: Last City
// Displays 4-Player Squad Cards, Alive Contenders, 360° Compass, Altitude/Speed, and Zone Timers
export class BattleRoyaleHUD {
  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'br-master-hud';
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
      display: none;
    `;

    this.container.innerHTML = `
      <!-- Top Center: 360° Military Compass Bar -->
      <div style="position: absolute; top: 12px; left: 50%; transform: translateX(-50%); width: 440px; height: 32px; background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(51, 65, 85, 0.8); border-radius: 6px; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(6px); overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.5);">
        <div id="br-compass-tape" style="display: flex; gap: 24px; color: #cbd5e1; font-weight: 700; font-size: 13px; letter-spacing: 2px;">
          <span>NW</span><span>•</span><span style="color:#38bdf8;">N</span><span>•</span><span>NE</span><span>•</span><span style="color:#f59e0b;">E</span><span>•</span><span>SE</span><span>•</span><span style="color:#38bdf8;">S</span><span>•</span><span>SW</span><span>•</span><span style="color:#f59e0b;">W</span>
        </div>
        <div style="position: absolute; bottom: 0; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-bottom: 6px solid #f59e0b;"></div>
      </div>

      <!-- Top Center-Left: Contenders Alive & Kills -->
      <div style="position: absolute; top: 16px; left: 24px; display: flex; gap: 14px;">
        <div style="background: rgba(15, 23, 42, 0.85); border: 1px solid #334155; border-radius: 6px; padding: 6px 14px; backdrop-filter: blur(6px); display: flex; align-items: center; gap: 8px;">
          <div style="width: 8px; height: 8px; background: #22c55e; border-radius: 50%;"></div>
          <span style="color: #94a3b8; font-size: 12px; font-weight: 700;">ALIVE:</span>
          <span id="br-alive-count" style="color: #f8fafc; font-size: 18px; font-weight: 800;">100</span>
        </div>
        <div style="background: rgba(15, 23, 42, 0.85); border: 1px solid #334155; border-radius: 6px; padding: 6px 14px; backdrop-filter: blur(6px); display: flex; align-items: center; gap: 8px;">
          <span style="color: #ef4444; font-size: 14px;">☠️</span>
          <span style="color: #94a3b8; font-size: 12px; font-weight: 700;">KILLS:</span>
          <span id="br-kills-count" style="color: #f8fafc; font-size: 18px; font-weight: 800;">0</span>
        </div>
      </div>

      <!-- Top Right: Safe Zone Phase & Collapse Timer -->
      <div style="position: absolute; top: 60px; right: 20px; background: rgba(15, 23, 42, 0.85); border: 1px solid #334155; border-radius: 6px; padding: 8px 16px; backdrop-filter: blur(6px); display: flex; align-items: center; gap: 12px;">
        <div>
          <div id="br-zone-phase" style="color: #94a3b8; font-size: 11px; font-weight: 700; letter-spacing: 1px;">ZONE PHASE 1</div>
          <div id="br-zone-status" style="color: #38bdf8; font-size: 14px; font-weight: 800;">WAITING</div>
        </div>
        <div id="br-zone-timer" style="color: #f8fafc; font-size: 22px; font-weight: 900; font-variant-numeric: tabular-nums;">
          02:00
        </div>
      </div>

      <!-- Bottom-Left: 4-Player Tactical Squad Card -->
      <div id="br-squad-panel" style="position: absolute; bottom: 24px; left: 24px; width: 220px; display: flex; flex-direction: column; gap: 8px;">
        <!-- Player 1 (Local) -->
        <div class="squad-member-card" style="background: rgba(15, 23, 42, 0.8); border-left: 4px solid #38bdf8; border-radius: 4px; padding: 6px 10px; backdrop-filter: blur(6px);">
          <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700;">
            <span style="color: #f8fafc;">1. Gagan_A (You)</span>
            <span id="sq-p1-hp" style="color: #38bdf8;">100 HP</span>
          </div>
          <div style="width: 100%; height: 4px; background: #334155; border-radius: 2px; margin-top: 4px; overflow: hidden;">
            <div id="sq-p1-bar" style="width: 100%; height: 100%; background: #38bdf8; transition: width 0.2s;"></div>
          </div>
        </div>

        <!-- Teammate 2 -->
        <div class="squad-member-card" style="background: rgba(15, 23, 42, 0.7); border-left: 4px solid #22c55e; border-radius: 4px; padding: 6px 10px; backdrop-filter: blur(6px);">
          <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700;">
            <span style="color: #cbd5e1;">2. Kavya_Rao</span>
            <span id="sq-p2-hp" style="color: #22c55e;">100 HP</span>
          </div>
          <div style="width: 100%; height: 4px; background: #334155; border-radius: 2px; margin-top: 4px; overflow: hidden;">
            <div id="sq-p2-bar" style="width: 100%; height: 100%; background: #22c55e;"></div>
          </div>
        </div>

        <!-- Teammate 3 -->
        <div class="squad-member-card" style="background: rgba(15, 23, 42, 0.7); border-left: 4px solid #eab308; border-radius: 4px; padding: 6px 10px; backdrop-filter: blur(6px);">
          <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700;">
            <span style="color: #cbd5e1;">3. Rohit_S</span>
            <span id="sq-p3-hp" style="color: #eab308;">100 HP</span>
          </div>
          <div style="width: 100%; height: 4px; background: #334155; border-radius: 2px; margin-top: 4px; overflow: hidden;">
            <div id="sq-p3-bar" style="width: 100%; height: 100%; background: #eab308;"></div>
          </div>
        </div>

        <!-- Teammate 4 -->
        <div class="squad-member-card" style="background: rgba(15, 23, 42, 0.7); border-left: 4px solid #a855f7; border-radius: 4px; padding: 6px 10px; backdrop-filter: blur(6px);">
          <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700;">
            <span style="color: #cbd5e1;">4. Arjun_R</span>
            <span id="sq-p4-hp" style="color: #a855f7;">100 HP</span>
          </div>
          <div style="width: 100%; height: 4px; background: #334155; border-radius: 2px; margin-top: 4px; overflow: hidden;">
            <div id="sq-p4-bar" style="width: 100%; height: 100%; background: #a855f7;"></div>
          </div>
        </div>
      </div>

      <!-- Center-Right: Freefall Altitude & Speed Meter -->
      <div id="br-freefall-meter" style="position: absolute; right: 180px; top: 40%; transform: translateY(-50%); display: none; flex-direction: column; align-items: flex-end; gap: 8px;">
        <div style="background: rgba(15, 23, 42, 0.85); border: 1px solid #38bdf8; border-radius: 6px; padding: 8px 14px; text-align: right; backdrop-filter: blur(6px);">
          <div style="color: #94a3b8; font-size: 10px; font-weight: 700;">ALTITUDE</div>
          <div id="ff-alt" style="color: #38bdf8; font-size: 24px; font-weight: 900;">240m</div>
        </div>
        <div style="background: rgba(15, 23, 42, 0.85); border: 1px solid #f59e0b; border-radius: 6px; padding: 8px 14px; text-align: right; backdrop-filter: blur(6px);">
          <div style="color: #94a3b8; font-size: 10px; font-weight: 700;">SPEED</div>
          <div id="ff-spd" style="color: #f59e0b; font-size: 24px; font-weight: 900;">145 km/h</div>
        </div>
        <div id="ff-deploy-hint" style="color: #f8fafc; font-size: 12px; font-weight: 700; background: rgba(0,0,0,0.6); padding: 4px 8px; border-radius: 4px;">
          PRESS [SPACE] TO DEPLOY CANOPY
        </div>
      </div>

      <!-- Center Warning: Out of Safe Zone / Storm Warning -->
      <div id="br-storm-warning" style="position: absolute; top: 18%; left: 50%; transform: translateX(-50%); background: rgba(239, 68, 68, 0.25); border: 1px solid #ef4444; color: #f87171; padding: 8px 24px; border-radius: 6px; font-weight: 800; font-size: 16px; letter-spacing: 2px; display: none; backdrop-filter: blur(8px); animation: pulse 1s infinite alternate;">
        ⚠️ OUTSIDE SAFE ZONE — STORM DAMAGE TICKING
      </div>
    `;

    document.body.appendChild(this.container);
  }

  update(aliveCount, killsCount, zoneData, playerState = null, flightController = null) {
    const aliveEl = this.container.querySelector('#br-alive-count');
    const killsEl = this.container.querySelector('#br-kills-count');
    if (aliveEl) aliveEl.textContent = String(aliveCount);
    if (killsEl) killsEl.textContent = String(killsCount);

    // Zone Info
    if (zoneData) {
      const phaseEl = this.container.querySelector('#br-zone-phase');
      const statusEl = this.container.querySelector('#br-zone-status');
      const timerEl = this.container.querySelector('#br-zone-timer');
      const warningEl = this.container.querySelector('#br-storm-warning');

      if (phaseEl) phaseEl.textContent = `ZONE PHASE ${zoneData.phase}`;
      if (statusEl) statusEl.textContent = zoneData.isShrinking ? 'SHRINKING' : 'HOLDING';

      const mins = Math.floor(zoneData.timeRemaining / 60);
      const secs = Math.floor(zoneData.timeRemaining % 60);
      if (timerEl) timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

      if (warningEl) {
        warningEl.style.display = zoneData.isOutside ? 'block' : 'none';
      }
    }

    // Local Player HP sync
    if (playerState) {
      const p1Hp = this.container.querySelector('#sq-p1-hp');
      const p1Bar = this.container.querySelector('#sq-p1-bar');
      if (p1Hp && p1Bar) {
        if (playerState.isKnocked) {
          p1Hp.textContent = `KNOCKED (${Math.ceil(playerState.knockBleedTimer)}s)`;
          p1Hp.style.color = '#ef4444';
          p1Bar.style.background = '#ef4444';
          p1Bar.style.width = `${playerState.knockBleedTimer}%`;
        } else {
          p1Hp.textContent = `${Math.ceil(playerState.health)} HP`;
          p1Hp.style.color = '#38bdf8';
          p1Bar.style.background = '#38bdf8';
          p1Bar.style.width = `${playerState.health}%`;
        }
      }
    }

    // Freefall & Parachute Meter
    const ffMeter = this.container.querySelector('#br-freefall-meter');
    if (flightController && flightController.isDropping()) {
      ffMeter.style.display = 'flex';
      const altEl = this.container.querySelector('#ff-alt');
      const spdEl = this.container.querySelector('#ff-spd');
      const hintEl = this.container.querySelector('#ff-deploy-hint');

      if (altEl) altEl.textContent = `${Math.max(0, Math.round(flightController.altitude))}m`;
      if (spdEl) spdEl.textContent = `${Math.round(flightController.currentSpeed * 3.6)} km/h`;
      if (hintEl) {
        hintEl.textContent = (flightController.state === 'Parachute') ? 'PARACHUTE DEPLOYED • STEER WITH WASD' : 'PRESS [SPACE] TO DEPLOY CANOPY';
      }
    } else if (ffMeter) {
      ffMeter.style.display = 'none';
    }
  }
}
