// High-Precision Performance Profiler & Developer Telemetry HUD (Phase 5)
// Tracks FPS, Frame Time, 1% Lows, WebGL Draw Calls, Triangles, Memory, and Quality Scalability.
export class PerformanceProfiler {
  constructor(renderer, scene) {
    this.renderer = renderer;
    this.scene = scene;

    this.enabled = true;
    this.fps = 60;
    this.frameTime = 16.67;
    this.avgFps = 60;
    this.onePercentLow = 60;
    this.pointOnePercentLow = 55;

    this.frameTimes = [];
    this.maxSamples = 120;
    this.lastTime = performance.now();
    this.spikeCount20ms = 0;
    this.spikeCount33ms = 0;

    // Quality preset: 'LOW', 'MEDIUM', 'HIGH', 'ULTRA'
    this.currentQuality = 'HIGH';

    this.createProfilerHUD();
    this.setupKeybindings();
  }

  createProfilerHUD() {
    this.container = document.createElement('div');
    this.container.id = 'perf-profiler-hud';
    this.container.style.cssText = `
      position: absolute;
      top: 14px;
      right: 14px;
      padding: 10px 14px;
      background: rgba(10, 15, 26, 0.92);
      border: 1px solid rgba(56, 189, 248, 0.4);
      border-radius: 6px;
      font-family: 'SF Mono', Consolas, Monaco, monospace;
      font-size: 11px;
      color: #e2e8f0;
      z-index: 9999;
      pointer-events: auto;
      min-width: 260px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      user-select: none;
    `;

    this.container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #1e293b; padding-bottom: 6px; margin-bottom: 8px;">
        <span style="color:#38bdf8; font-weight:800; letter-spacing:1px;">BLC TELEMETRY [F3]</span>
        <span id="perf-target-badge" style="background:#16a34a; color:#fff; padding:2px 6px; border-radius:3px; font-size:10px; font-weight:700;">60 FPS TARGET</span>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 4px 12px; margin-bottom: 8px;">
        <div>FPS: <b id="perf-fps" style="color:#22c55e; font-size:13px;">60.0</b></div>
        <div>FRAME: <b id="perf-ms" style="color:#38bdf8;">16.67 ms</b></div>
        <div>1% LOW: <b id="perf-1low" style="color:#facc15;">58.4</b></div>
        <div>0.1% LOW: <b id="perf-01low" style="color:#f97316;">52.1</b></div>
        <div>SPIKES >20ms: <b id="perf-spikes-20" style="color:#94a3b8;">0</b></div>
        <div>SPIKES >33ms: <b id="perf-spikes-33" style="color:#94a3b8;">0</b></div>
      </div>

      <div style="border-top: 1px solid #1e293b; padding-top: 6px; margin-bottom: 8px;">
        <div style="color:#94a3b8; font-size:10px; margin-bottom:4px;">RENDER PIPELINE</div>
        <div style="display:flex; justify-content:space-between;">
          <span>DRAW CALLS:</span> <b id="perf-draw-calls" style="color:#f43f5e;">--</b>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span>TRIANGLES:</span> <b id="perf-triangles" style="color:#e2e8f0;">--</b>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span>GEOMETRIES:</span> <b id="perf-geometries" style="color:#e2e8f0;">--</b>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span>HEAP RAM:</span> <b id="perf-ram" style="color:#a855f7;">-- MB</b>
        </div>
      </div>

      <div style="border-top: 1px solid #1e293b; padding-top: 6px;">
        <div style="color:#94a3b8; font-size:10px; margin-bottom:4px;">QUALITY SCALABILITY</div>
        <div style="display:flex; gap:4px;">
          <button class="q-btn" data-q="LOW" style="flex:1; padding:3px; font-size:9px; background:#1e293b; color:#94a3b8; border:1px solid #334155; border-radius:3px; cursor:pointer;">LOW</button>
          <button class="q-btn" data-q="MEDIUM" style="flex:1; padding:3px; font-size:9px; background:#1e293b; color:#94a3b8; border:1px solid #334155; border-radius:3px; cursor:pointer;">MED</button>
          <button class="q-btn active-q" data-q="HIGH" style="flex:1; padding:3px; font-size:9px; background:#0284c7; color:#fff; border:1px solid #38bdf8; border-radius:3px; cursor:pointer;">HIGH</button>
          <button class="q-btn" data-q="ULTRA" style="flex:1; padding:3px; font-size:9px; background:#1e293b; color:#94a3b8; border:1px solid #334155; border-radius:3px; cursor:pointer;">ULTRA</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.container);

    // Setup Quality Preset Buttons
    this.container.querySelectorAll('.q-btn').forEach(btn => {
      btn.onclick = () => {
        const quality = btn.getAttribute('data-q');
        this.applyQualityPreset(quality);
      };
    });
  }

  setupKeybindings() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'F3' || (e.key.toLowerCase() === 'p' && e.ctrlKey)) {
        this.toggleHUD();
      }
    });
  }

  toggleHUD() {
    this.enabled = !this.enabled;
    this.container.style.display = this.enabled ? 'block' : 'none';
  }

  applyQualityPreset(quality) {
    this.currentQuality = quality;

    this.container.querySelectorAll('.q-btn').forEach(btn => {
      if (btn.getAttribute('data-q') === quality) {
        btn.style.background = '#0284c7';
        btn.style.color = '#ffffff';
        btn.style.borderColor = '#38bdf8';
      } else {
        btn.style.background = '#1e293b';
        btn.style.color = '#94a3b8';
        btn.style.borderColor = '#334155';
      }
    });

    if (quality === 'LOW') {
      this.renderer.setPixelRatio(1.0);
      this.renderer.shadowMap.enabled = false;
    } else if (quality === 'MEDIUM') {
      this.renderer.setPixelRatio(1.0);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = 0; // BasicShadowMap
    } else if (quality === 'HIGH') {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = 1; // PCFShadowMap
    } else if (quality === 'ULTRA') {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = 2; // PCFSoftShadowMap
    }
  }

  update() {
    if (!this.enabled) return;

    const now = performance.now();
    const deltaMs = now - this.lastTime;
    this.lastTime = now;

    if (deltaMs > 0 && deltaMs < 200) {
      this.frameTimes.push(deltaMs);
      if (this.frameTimes.length > this.maxSamples) {
        this.frameTimes.shift();
      }

      if (deltaMs > 20.0) this.spikeCount20ms++;
      if (deltaMs > 33.3) this.spikeCount33ms++;

      this.frameTime = deltaMs;
      this.fps = 1000 / deltaMs;

      // Calculate 1% and 0.1% lows
      const sorted = [...this.frameTimes].sort((a, b) => b - a); // Longest frame times first
      const idx1Pct = Math.max(0, Math.floor(sorted.length * 0.01));
      const idx01Pct = Math.max(0, Math.floor(sorted.length * 0.001));

      this.onePercentLow = 1000 / sorted[idx1Pct];
      this.pointOnePercentLow = 1000 / sorted[idx01Pct];
    }

    // Refresh UI Every 6 Frames to minimize DOM overhead
    if (this.frameTimes.length % 6 === 0) {
      this.renderHUDValues();
    }
  }

  renderHUDValues() {
    const fpsElem = document.getElementById('perf-fps');
    const msElem = document.getElementById('perf-ms');
    const low1Elem = document.getElementById('perf-1low');
    const low01Elem = document.getElementById('perf-01low');
    const badge = document.getElementById('perf-target-badge');

    if (fpsElem) {
      fpsElem.textContent = this.fps.toFixed(1);
      fpsElem.style.color = this.fps >= 55 ? '#22c55e' : (this.fps >= 40 ? '#facc15' : '#ef4444');
    }

    if (msElem) {
      msElem.textContent = `${this.frameTime.toFixed(2)} ms`;
      msElem.style.color = this.frameTime <= 18.0 ? '#38bdf8' : (this.frameTime <= 25.0 ? '#facc15' : '#ef4444');
    }

    if (badge) {
      if (this.fps >= 58) {
        badge.textContent = 'SOLID 60 FPS';
        badge.style.background = '#16a34a';
      } else if (this.fps >= 45) {
        badge.textContent = 'ACCEPTABLE';
        badge.style.background = '#ca8a04';
      } else {
        badge.textContent = 'LAG DETECTED';
        badge.style.background = '#dc2626';
      }
    }

    if (low1Elem) low1Elem.textContent = this.onePercentLow.toFixed(1);
    if (low01Elem) low01Elem.textContent = this.pointOnePercentLow.toFixed(1);

    const s20 = document.getElementById('perf-spikes-20');
    if (s20) s20.textContent = this.spikeCount20ms;
    const s33 = document.getElementById('perf-spikes-33');
    if (s33) s33.textContent = this.spikeCount33ms;

    // WebGL Renderer Info
    if (this.renderer && this.renderer.info) {
      const info = this.renderer.info;
      const callsElem = document.getElementById('perf-draw-calls');
      if (callsElem) callsElem.textContent = info.render.calls;

      const triElem = document.getElementById('perf-triangles');
      if (triElem) triElem.textContent = info.render.triangles.toLocaleString();

      const geoElem = document.getElementById('perf-geometries');
      if (geoElem) geoElem.textContent = info.memory.geometries;
    }

    // Memory Heap
    if (performance.memory) {
      const ramElem = document.getElementById('perf-ram');
      if (ramElem) {
        const usedMb = Math.round(performance.memory.usedJSHeapSize / (1024 * 1024));
        ramElem.textContent = `${usedMb} MB`;
      }
    }
  }
}
