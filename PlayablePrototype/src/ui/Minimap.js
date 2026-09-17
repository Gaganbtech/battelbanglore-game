// Circular HUD Radar Minimap & Fullscreen Sector District Map Canvas Renderers
import { ZONES } from '../config/constants.js';

export class MinimapRenderer {
  constructor(minimapCanvas, worldMapCanvas) {
    this.miniCanvas = minimapCanvas;
    this.miniCtx = minimapCanvas ? minimapCanvas.getContext('2d') : null;

    this.worldCanvas = worldMapCanvas;
    this.worldCtx = worldMapCanvas ? worldMapCanvas.getContext('2d') : null;
  }

  renderMinimap(playerPos, playerYaw, currentZoneName) {
    if (!this.miniCtx) return;

    const ctx = this.miniCtx;
    const w = this.miniCanvas.width;
    const h = this.miniCanvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Dark grid background
    ctx.save();
    ctx.fillStyle = '#080e18';
    ctx.fillRect(0, 0, w, h);

    // World-to-minimap zoom scale
    const zoom = 0.55;

    // Draw roads relative to player position
    ctx.strokeStyle = '#222d3d';
    ctx.lineWidth = 14 * zoom;

    // EW Road (z = 0)
    const roadY = cy - (0 - playerPos.z) * zoom;
    ctx.beginPath();
    ctx.moveTo(0, roadY);
    ctx.lineTo(w, roadY);
    ctx.stroke();

    // NS Road (x = 0)
    const roadX = cx + (0 - playerPos.x) * zoom;
    ctx.beginPath();
    ctx.moveTo(roadX, 0);
    ctx.lineTo(roadX, h);
    ctx.stroke();

    // Metro Line (z = -20) (Purple)
    const metroY = cy - (-20 - playerPos.z) * zoom;
    ctx.strokeStyle = '#7b1fa2';
    ctx.lineWidth = 5 * zoom;
    ctx.beginPath();
    ctx.moveTo(0, metroY);
    ctx.lineTo(w, metroY);
    ctx.stroke();

    // Metro Station Landmark Marker
    const metroStationX = cx + (0 - playerPos.x) * zoom;
    ctx.fillStyle = '#ab47bc';
    ctx.beginPath();
    ctx.arc(metroStationX, metroY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Flyover Line (Yellow)
    const flyoverX = cx + (50 - playerPos.x) * zoom;
    ctx.strokeStyle = '#fbc02d';
    ctx.lineWidth = 6 * zoom;
    ctx.beginPath();
    ctx.moveTo(flyoverX, 0);
    ctx.lineTo(flyoverX, h);
    ctx.stroke();

    // Player position (Center of radar)
    ctx.fillStyle = '#00e5ff';
    ctx.beginPath();
    ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Player heading cone / arrow
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-playerYaw);

    ctx.fillStyle = '#ff9800';
    ctx.beginPath();
    ctx.moveTo(0, -9);
    ctx.lineTo(-5, 4);
    ctx.lineTo(5, 4);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
    ctx.restore();
  }

  renderWorldMap(playerPos, playerYaw) {
    if (!this.worldCtx) return;

    const ctx = this.worldCtx;
    const w = this.worldCanvas.width;
    const h = this.worldCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Background Metropolitan Grid
    ctx.fillStyle = '#090e17';
    ctx.fillRect(0, 0, w, h);

    // World coordinate mapping: world (-300 to 300) -> canvas (0 to w, 0 to h)
    const toCanvasX = (wx) => ((wx + 300) / 600) * w;
    const toCanvasY = (wz) => ((wz + 300) / 600) * h;

    // Draw Zone Sectors
    Object.values(ZONES).forEach(zone => {
      const zx = toCanvasX(zone.center.x);
      const zy = toCanvasY(zone.center.z);
      const zr = (zone.radius / 600) * w;

      // Zone radius glow
      ctx.fillStyle = zone.color + '18';
      ctx.beginPath();
      ctx.arc(zx, zy, zr, 0, Math.PI * 2);
      ctx.fill();

      // Zone boundary dashed stroke
      ctx.strokeStyle = zone.color + '88';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Zone Label
      ctx.fillStyle = zone.color;
      ctx.font = 'bold 12px Rajdhani, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(zone.name, zx, zy - zr - 6);
    });

    // Main Boulevards
    ctx.strokeStyle = '#273444';
    ctx.lineWidth = 14;

    // EW Highway
    ctx.beginPath();
    ctx.moveTo(0, toCanvasY(0));
    ctx.lineTo(w, toCanvasY(0));
    ctx.stroke();

    // NS Highway
    ctx.beginPath();
    ctx.moveTo(toCanvasX(0), 0);
    ctx.lineTo(toCanvasX(0), h);
    ctx.stroke();

    // Secondary Arteries
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(0, toCanvasY(100));
    ctx.lineTo(w, toCanvasY(100));
    ctx.moveTo(0, toCanvasY(-90));
    ctx.lineTo(w, toCanvasY(-90));
    ctx.moveTo(toCanvasX(110), 0);
    ctx.lineTo(toCanvasX(110), h);
    ctx.moveTo(toCanvasX(-110), 0);
    ctx.lineTo(toCanvasX(-110), h);
    ctx.stroke();

    // Metro Line (Purple)
    ctx.strokeStyle = '#9c27b0';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, toCanvasY(-20));
    ctx.lineTo(w, toCanvasY(-20));
    ctx.stroke();

    // 3 Metro Stations (West Gate, MG Road Central, Silicon Valley Park)
    const stations = [
      { name: 'WEST GATE', x: -220, z: -20 },
      { name: 'MG ROAD CENTRAL', x: 0, z: -20 },
      { name: 'SILICON VALLEY PARK', x: 220, z: -20 }
    ];

    stations.forEach(st => {
      const sx = toCanvasX(st.x);
      const sy = toCanvasY(st.z);
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(sx - 7, sy - 5, 14, 10);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(sx - 7, sy - 5, 14, 10);

      ctx.fillStyle = '#f3e8ff';
      ctx.font = 'bold 9px Rajdhani, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(st.name, sx, sy - 8);
    });

    // Majestic Central Bus Depot Marker
    const depotX = toCanvasX(-60);
    const depotY = toCanvasY(95);
    ctx.fillStyle = '#15803d';
    ctx.fillRect(depotX - 10, depotY - 8, 20, 16);
    ctx.strokeStyle = '#86efac';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(depotX - 10, depotY - 8, 20, 16);
    ctx.fillStyle = '#86efac';
    ctx.font = 'bold 10px Rajdhani, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MAJESTIC BUS DEPOT', depotX, depotY + 20);

    // Enterable Buildings Icons
    const enterable = [
      { name: 'PEENYA WAREHOUSE', x: -100, z: -120, col: '#f59e0b' },
      { name: 'SILICON TECH OFFICE', x: 110, z: -50, col: '#38bdf8' },
      { name: 'RESIDENCY APARTMENT', x: 45, z: 55, col: '#ec4899' }
    ];
    enterable.forEach(b => {
      const bx = toCanvasX(b.x);
      const by = toCanvasY(b.z);
      ctx.fillStyle = b.col;
      ctx.beginPath();
      ctx.arc(bx, by, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '9px Rajdhani, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(b.name, bx, by + 12);
    });

    // Lake Feature (Zone G)
    ctx.fillStyle = '#0f4d5cbb';
    ctx.beginPath();
    ctx.ellipse(toCanvasX(-120), toCanvasY(110), 45, 38, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#26c6da';
    ctx.stroke();

    // Battle Royale Safe Zone Circle (Golden Ring)
    ctx.strokeStyle = '#ffd54f';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(toCanvasX(0), toCanvasY(0), 170, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#ffd54f';
    ctx.font = '10px Rajdhani, sans-serif';
    ctx.fillText('BR PLAY ZONE BOUNDARY', toCanvasX(0), toCanvasY(0) - 175);

    // Player Location Marker
    const px = toCanvasX(playerPos.x);
    const py = toCanvasY(playerPos.z);

    ctx.fillStyle = '#00e5ff';
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fill();

    // Player directional arrow
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(-playerYaw);

    ctx.fillStyle = '#ff9800';
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(-7, 6);
    ctx.lineTo(7, 6);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}
