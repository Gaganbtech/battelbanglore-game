// End-of-Match Results & Victory Modal UI for Bengaluru: Last City
// Displays detailed post-match stats: Placement, Kills, Damage, Survival Time, and Team Breakdown

export class MatchResultUI {
  constructor(audioManager) {
    this.audioManager = audioManager;
    this.container = document.createElement('div');
    this.container.id = 'match-results-modal';
    this.container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: radial-gradient(circle at center, rgba(15, 23, 42, 0.94) 0%, rgba(2, 6, 23, 0.98) 100%);
      backdrop-filter: blur(12px);
      z-index: 300;
      display: none;
      justify-content: center;
      align-items: center;
      font-family: 'Rajdhani', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      user-select: none;
    `;

    this.container.innerHTML = `
      <div style="width: 720px; background: rgba(30, 41, 59, 0.85); border: 1px solid #475569; border-radius: 12px; padding: 36px 44px; box-shadow: 0 24px 64px rgba(0,0,0,0.9); text-align: center; backdrop-filter: blur(16px);">
        <!-- Victory / Defeat Title Header -->
        <div id="res-badge" style="display: inline-block; padding: 4px 16px; border-radius: 20px; font-size: 13px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; background: rgba(234, 179, 8, 0.15); color: #eab308; border: 1px solid #eab308;">
          MATCH COMPLETED
        </div>
        
        <h1 id="res-title" style="margin: 0; font-size: 46px; font-weight: 900; letter-spacing: 3px; color: #f8fafc; text-transform: uppercase;">
          #1 VICTORY
        </h1>
        <p id="res-subtitle" style="margin: 6px 0 28px 0; color: #94a3b8; font-size: 16px; letter-spacing: 1px;">
          BENGALURU LAST SURVIVORS • SQUAD DEPLOYMENT
        </p>

        <!-- Stats Grid (4 Cards) -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px;">
          <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid #334155; border-radius: 8px; padding: 16px;">
            <div style="color: #64748b; font-size: 12px; font-weight: 700; letter-spacing: 1px;">PLACEMENT</div>
            <div id="res-placement" style="color: #f59e0b; font-size: 32px; font-weight: 800; margin-top: 4px;">#1</div>
          </div>
          <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid #334155; border-radius: 8px; padding: 16px;">
            <div style="color: #64748b; font-size: 12px; font-weight: 700; letter-spacing: 1px;">ELIMINATIONS</div>
            <div id="res-kills" style="color: #ef4444; font-size: 32px; font-weight: 800; margin-top: 4px;">6</div>
          </div>
          <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid #334155; border-radius: 8px; padding: 16px;">
            <div style="color: #64748b; font-size: 12px; font-weight: 700; letter-spacing: 1px;">DAMAGE DEALT</div>
            <div id="res-damage" style="color: #38bdf8; font-size: 32px; font-weight: 800; margin-top: 4px;">840</div>
          </div>
          <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid #334155; border-radius: 8px; padding: 16px;">
            <div style="color: #64748b; font-size: 12px; font-weight: 700; letter-spacing: 1px;">SURVIVAL TIME</div>
            <div id="res-time" style="color: #22c55e; font-size: 32px; font-weight: 800; margin-top: 4px;">14:22</div>
          </div>
        </div>

        <!-- Buttons -->
        <div style="display: flex; justify-content: center; gap: 20px;">
          <button id="btn-return-lobby" style="background: #1e293b; border: 1px solid #475569; color: #f8fafc; padding: 12px 32px; border-radius: 6px; font-size: 15px; font-weight: 700; letter-spacing: 1px; cursor: pointer; transition: all 0.2s;">
            RETURN TO LOBBY
          </button>
          <button id="btn-play-again" style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); border: none; color: #fff; padding: 12px 36px; border-radius: 6px; font-size: 15px; font-weight: 700; letter-spacing: 1px; cursor: pointer; box-shadow: 0 4px 16px rgba(2, 132, 199, 0.4); transition: all 0.2s;">
            PLAY AGAIN
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(this.container);
  }

  showResults(isWinner, kills = 0, damage = 0, survivalSec = 0, placement = 1) {
    const title = this.container.querySelector('#res-title');
    const badge = this.container.querySelector('#res-badge');
    const placeEl = this.container.querySelector('#res-placement');
    const killsEl = this.container.querySelector('#res-kills');
    const dmgEl = this.container.querySelector('#res-damage');
    const timeEl = this.container.querySelector('#res-time');

    if (isWinner) {
      title.textContent = '#1 VICTORY';
      title.style.color = '#facc15';
      badge.textContent = 'BENGALURU CHAMPIONS';
      badge.style.borderColor = '#facc15';
      badge.style.color = '#facc15';
    } else {
      title.textContent = `#${placement} MATCH ENDED`;
      title.style.color = '#f87171';
      badge.textContent = 'BETTER LUCK NEXT TIME';
      badge.style.borderColor = '#ef4444';
      badge.style.color = '#ef4444';
    }

    if (placeEl) placeEl.textContent = `#${placement}`;
    if (killsEl) killsEl.textContent = String(kills);
    if (dmgEl) dmgEl.textContent = String(Math.round(damage));

    const mins = Math.floor(survivalSec / 60);
    const secs = Math.floor(survivalSec % 60);
    if (timeEl) timeEl.textContent = `${mins}:${String(secs).padStart(2, '0')}`;

    this.container.style.display = 'flex';

    if (this.audioManager) {
      this.audioManager.playUIBeep(isWinner ? 880 : 330);
    }
  }

  hide() {
    this.container.style.display = 'none';
  }
}
