// Original Battle Royale Killfeed UI for Bengaluru: Last City
// Displays high-contrast tactical elimination entries with weapon icons & distances

export class KillFeedUI {
  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'br-killfeed-container';
    this.container.style.cssText = `
      position: absolute;
      top: 18px;
      right: 20px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      pointer-events: none;
      z-index: 120;
      font-family: 'Rajdhani', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    document.body.appendChild(this.container);

    this.entries = [];
    this.maxEntries = 5;
  }

  addEntry(killer, victim, weapon, isElimination = true, isHeadshot = false) {
    const el = document.createElement('div');
    el.className = 'killfeed-entry';
    el.style.cssText = `
      background: linear-gradient(90deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.75) 100%);
      border-left: 3px solid ${isElimination ? '#ef4444' : '#f59e0b'};
      color: #f8fafc;
      padding: 5px 12px;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      backdrop-filter: blur(4px);
      animation: killfeedSlideIn 0.25s ease-out forwards;
    `;

    const icon = isElimination ? '☠️' : '⚠️';
    const hsBadge = isHeadshot ? '<span style="color: #ef4444; font-weight:800; font-size:11px;">[HEADSHOT]</span>' : '';

    el.innerHTML = `
      <span style="color: #60a5fa;">${killer}</span>
      <span style="color: #94a3b8; font-size: 11px;">[${weapon}]</span>
      <span>${icon}</span>
      <span style="color: #f87171;">${victim}</span>
      ${hsBadge}
    `;

    this.container.appendChild(el);
    this.entries.push(el);

    if (this.entries.length > this.maxEntries) {
      const oldest = this.entries.shift();
      if (oldest && oldest.parentElement) oldest.remove();
    }

    // Auto-fade after 5 seconds
    setTimeout(() => {
      el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
      el.style.opacity = '0';
      el.style.transform = 'translateX(20px)';
      setTimeout(() => {
        if (el.parentElement) el.remove();
        const idx = this.entries.indexOf(el);
        if (idx !== -1) this.entries.splice(idx, 1);
      }, 500);
    }, 4500);
  }
}
