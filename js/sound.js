// ============================================
// Super Mario Demo - Sound Manager
// ============================================

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
      this.enabled = false;
    }
  }

  playTone(freq, duration, type = 'square', volume = 0.12) {
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

  playSeq(notes, interval = 0.08) {
    if (!this.enabled || !this.ctx) return;
    notes.forEach((n, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = n.f;
      const t = this.ctx.currentTime + i * interval;
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + (n.d || interval));
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + (n.d || interval));
    });
  }

  jump() {
    this.playSeq([{f:400,d:.05},{f:500,d:.05},{f:600,d:.05},{f:700,d:.08}], 0.04);
  }
  coin() {
    this.playSeq([{f:988,d:.05},{f:1319,d:.15}], 0.06);
  }
  stomp() {
    this.playTone(200, 0.15, 'square', 0.1);
  }
  powerup() {
    this.playSeq([{f:523,d:.08},{f:659,d:.08},{f:784,d:.08},{f:1047,d:.08},{f:1319,d:.08},{f:1568,d:.15}], 0.06);
  }
  bump() {
    this.playTone(200, 0.1, 'square', 0.08);
  }
  breakSound() {
    this.playTone(150, 0.1, 'sawtooth', 0.08);
    this.playTone(100, 0.15, 'square', 0.06);
  }
  die() {
    this.playSeq([{f:800,d:.15},{f:700,d:.15},{f:600,d:.15},{f:500,d:.15},{f:400,d:.15},{f:300,d:.3}], 0.12);
  }
  flagpole() {
    this.playSeq([{f:330,d:.08},{f:392,d:.08},{f:523,d:.08},{f:659,d:.08},{f:784,d:.08},{f:1047,d:.08},{f:1319,d:.2}], 0.08);
  }
  pause() {
    this.playTone(500, 0.1, 'square', 0.08);
  }
}
