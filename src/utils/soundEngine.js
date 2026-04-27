// Sound utility using Web Audio API
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  getContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.ctx;
  }

  whoosh(direction = 'right', style = 'default') {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const pannerNode = ctx.createStereoPanner();

      oscillator.connect(gainNode);
      gainNode.connect(pannerNode);
      pannerNode.connect(ctx.destination);

      let startFreq, endFreq, dur;

      if (style === 'pop') {
        oscillator.type = 'sine';
        startFreq = direction === 'right' ? 800 : 1000;
        endFreq = direction === 'right' ? 400 : 600;
        dur = 0.1;
      } else if (style === 'arcade') {
        oscillator.type = 'square';
        startFreq = direction === 'right' ? 300 : 400;
        endFreq = direction === 'right' ? 600 : 800;
        dur = 0.15;
      } else {
        // default
        oscillator.type = 'sine';
        startFreq = direction === 'right' ? 200 : 300;
        endFreq = direction === 'right' ? 600 : 100;
        dur = 0.2;
      }

      oscillator.frequency.setValueAtTime(startFreq, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + dur);

      gainNode.gain.setValueAtTime(style === 'arcade' ? 0.05 : 0.18, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur + 0.05);

      pannerNode.pan.setValueAtTime(direction === 'right' ? 0.7 : -0.7, ctx.currentTime);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + dur + 0.05);
    } catch (e) { /* silent fail */ }
  }

  trash() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      [0, 0.05, 0.1].forEach((t, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(150 - i * 30, ctx.currentTime + t);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + t + 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + t);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.15);
        osc.type = 'sawtooth';
        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + 0.2);
      });
    } catch (e) { /* silent fail */ }
  }

  folder() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) { /* silent fail */ }
  }

  pop() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) { /* silent fail */ }
  }

  setEnabled(val) {
    this.enabled = val;
  }
}

export const soundEngine = new SoundEngine();
