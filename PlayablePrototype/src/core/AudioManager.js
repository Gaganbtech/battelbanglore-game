// Procedural Web Audio synthesizer for Bengaluru: Last City ambient audio

export class AudioManager {
  constructor(gameState) {
    this.gameState = gameState;
    this.ctx = null;
    this.isInitialized = false;

    this.cityAmbienceNode = null;
    this.rainNode = null;
    this.engineNode = null;
    this.masterGain = null;
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.gameState.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.setupCityAmbience();
      this.setupRainAudio();
      this.isInitialized = true;
    } catch (err) {
      console.warn('Web Audio could not be initialized:', err);
    }
  }

  setupCityAmbience() {
    if (!this.ctx) return;
    
    // Low frequency city drone / traffic hum
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(55, this.ctx.currentTime); // Low 55Hz city rumble

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start();

    this.cityAmbienceNode = { osc, gain };
  }

  setupRainAudio() {
    if (!this.ctx) return;

    // White noise generator for monsoon rain
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.0, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0, this.ctx.currentTime); // Off by default

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    whiteNoise.start();

    this.rainNode = { gain };
  }

  setRainActive(isActive) {
    if (!this.rainNode || !this.ctx) return;
    const targetGain = isActive ? 0.22 : 0.0;
    this.rainNode.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.4);
  }

  playFootstep() {
    if (!this.ctx || !this.isInitialized) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  playVehicleEngine(speedFactor) {
    if (!this.ctx || !this.isInitialized) return;
    if (!this.engineNode) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      this.engineNode = { osc, gain };
    }

    const freq = 65 + speedFactor * 160;
    this.engineNode.osc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.1);
  }

  stopVehicleEngine() {
    if (this.engineNode && this.ctx) {
      this.engineNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
      setTimeout(() => {
        if (this.engineNode) {
          try { this.engineNode.osc.stop(); } catch(e) {}
          this.engineNode = null;
        }
      }, 150);
    }
  }

  playUIBeep(frequency = 540) {
    if (!this.ctx || !this.isInitialized) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playAirBrakeHiss() {
    if (!this.ctx || !this.isInitialized) return;
    try {
      const bufferSize = this.ctx.sampleRate * 0.45;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.12));
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2400, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.4);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      whiteNoise.start();
    } catch (e) {}
  }

  playBusDoorChime() {
    if (!this.ctx || !this.isInitialized) return;
    try {
      // 2-tone chime: High E (659Hz) then High C (523Hz)
      [
        { freq: 659, time: 0 },
        { freq: 523, time: 0.14 }
      ].forEach(note => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, this.ctx.currentTime + note.time);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime + note.time);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + note.time + 0.22);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(this.ctx.currentTime + note.time);
        osc.stop(this.ctx.currentTime + note.time + 0.25);
      });
    } catch (e) {}
  }

  setMasterVolume(val) {
    if (!this.masterGain || !this.ctx) return;
    this.masterGain.gain.setValueAtTime(val, this.ctx.currentTime);
  }
}
