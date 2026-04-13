// ============================================
// Super Mario Demo - Sound System
// ============================================
// Procedural retro sound effects using Web Audio API

class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio not supported');
      this.enabled = false;
    }
  }

  playTone(freq, duration, type = 'square', volume = 0.15) {
    if (!this.enabled || !this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.value = freq;
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + duration);
  }

  playSequence(notes, interval = 0.08) {
    if (!this.enabled || !this.ctx) return;
    
    notes.forEach((note, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.value = note.freq;
      
      const startTime = this.ctx.currentTime + i * interval;
      const dur = note.dur || interval;
      
      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + dur);
    });
  }

  // ---- Game Sound Effects ----
  
  jump() {
    this.playSequence([
      { freq: 400, dur: 0.05 },
      { freq: 500, dur: 0.05 },
      { freq: 600, dur: 0.05 },
      { freq: 700, dur: 0.08 },
    ], 0.04);
  }

  bigJump() {
    this.playSequence([
      { freq: 300, dur: 0.05 },
      { freq: 450, dur: 0.05 },
      { freq: 550, dur: 0.05 },
      { freq: 650, dur: 0.1 },
    ], 0.04);
  }

  coin() {
    this.playSequence([
      { freq: 988, dur: 0.05 },
      { freq: 1319, dur: 0.15 },
    ], 0.06);
  }

  stomp() {
    this.playTone(200, 0.15, 'square', 0.12);
  }

  powerup() {
    this.playSequence([
      { freq: 523, dur: 0.08 },
      { freq: 659, dur: 0.08 },
      { freq: 784, dur: 0.08 },
      { freq: 1047, dur: 0.08 },
      { freq: 1319, dur: 0.08 },
      { freq: 1568, dur: 0.15 },
    ], 0.06);
  }

  grow() {
    this.playSequence([
      { freq: 400, dur: 0.1 },
      { freq: 500, dur: 0.1 },
      { freq: 600, dur: 0.1 },
      { freq: 700, dur: 0.1 },
      { freq: 800, dur: 0.1 },
      { freq: 900, dur: 0.15 },
    ], 0.08);
  }

  brickBreak() {
    // Noise-like effect
    this.playTone(150, 0.1, 'sawtooth', 0.1);
    this.playTone(100, 0.15, 'square', 0.08);
  }

  bump() {
    this.playTone(200, 0.1, 'square', 0.1);
  }

  die() {
    this.playSequence([
      { freq: 800, dur: 0.15 },
      { freq: 700, dur: 0.15 },
      { freq: 600, dur: 0.15 },
      { freq: 500, dur: 0.15 },
      { freq: 400, dur: 0.15 },
      { freq: 300, dur: 0.3 },
    ], 0.12);
  }

  flagpole() {
    this.playSequence([
      { freq: 330, dur: 0.08 },
      { freq: 392, dur: 0.08 },
      { freq: 523, dur: 0.08 },
      { freq: 659, dur: 0.08 },
      { freq: 784, dur: 0.08 },
      { freq: 1047, dur: 0.08 },
      { freq: 1319, dur: 0.2 },
    ], 0.08);
  }

  oneUp() {
    this.playSequence([
      { freq: 330, dur: 0.06 },
      { freq: 523, dur: 0.06 },
      { freq: 659, dur: 0.06 },
      { freq: 784, dur: 0.06 },
      { freq: 1047, dur: 0.1 },
    ], 0.05);
  }

  pause() {
    this.playTone(500, 0.1, 'square', 0.1);
  }
}
