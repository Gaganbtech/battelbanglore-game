// Mission HUD & Active Objective Overlay (Phase 4)
export class MissionHUD {
  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'mission-hud';
    this.container.style.cssText = `
      position: absolute;
      top: 140px;
      left: 24px;
      padding: 12px 18px;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(12px);
      border-left: 4px solid #38bdf8;
      border-radius: 4px;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      pointer-events: none;
      display: none;
      z-index: 25;
      min-width: 240px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    `;

    this.container.innerHTML = `
      <div style="font-size: 11px; text-transform: uppercase; color: #38bdf8; font-weight: 700; letter-spacing: 1.2px;" id="mission-category">OBJECTIVE</div>
      <div style="font-size: 15px; font-weight: 800; margin: 4px 0 6px 0;" id="mission-title">Mission Title</div>
      <div style="font-size: 12px; color: #94a3b8; line-height: 1.4;" id="mission-desc">Reach target destination.</div>
      <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 12px; font-weight: 700; color: #facc15;">
        <span id="mission-distance">DIST: ---m</span>
        <span id="mission-timer"></span>
      </div>
    `;

    document.body.appendChild(this.container);
  }

  update(activeMission, playerPos, timer) {
    if (!activeMission) {
      this.container.style.display = 'none';
      return;
    }

    this.container.style.display = 'block';
    document.getElementById('mission-category').textContent = activeMission.category || 'MISSION';
    document.getElementById('mission-title').textContent = activeMission.title;
    document.getElementById('mission-desc').textContent = activeMission.description;

    const dist = Math.round(playerPos.distanceTo(activeMission.targetPos));
    document.getElementById('mission-distance').textContent = `DIST: ${dist}m`;

    const timerElem = document.getElementById('mission-timer');
    if (activeMission.timeLimit && timer > 0) {
      timerElem.textContent = `TIME: ${Math.ceil(timer)}s`;
      timerElem.style.display = 'inline';
    } else {
      timerElem.style.display = 'none';
    }
  }

  hide() {
    this.container.style.display = 'none';
  }
}
