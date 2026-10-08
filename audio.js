/**
 * ============================================================================
 * F1 TELEMETRY PORTFOLIO - WEB AUDIO SYNTHESIZER
 * Driver: Manan Joshi #14 | Pit Radio & Engine Synthesizer
 * 100% Native Web Audio API - Zero External Audio Files Needed
 * ============================================================================
 */

class F1AudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true; // Default muted for browser autoplay policies
    this.engineOsc1 = null;
    this.engineOsc2 = null;
    this.engineGain = null;
    this.engineFilter = null;
    this.isEngineRunning = false;
  }

  // Initialize AudioContext on first user interaction
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.init();
    this.isMuted = !this.isMuted;
    
    if (this.isMuted) {
      this.stopEngineSound();
    } else {
      this.playPitRadioBeep();
    }
    return !this.isMuted;
  }

  /**
   * F1 Pit-Radio Chirp / Squelch sound effect
   */
  playPitRadioBeep() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Primary Chirp
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1750, now);
      osc.frequency.exponentialRampToValueAtTime(2400, now + 0.06);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);

      // Radio noise squelch burst
      const bufferSize = this.ctx.sampleRate * 0.08;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(2200, now);
      noiseFilter.Q.setValueAtTime(3.0, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.04, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      whiteNoise.start(now + 0.02);
      whiteNoise.stop(now + 0.1);
    } catch (e) {
      console.warn('Audio synthesis notice:', e);
    }
  }

  /**
   * 5-Red-Lights Out sequence beep / horn
   */
  playLightTone(isLaunch = false) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (!isLaunch) {
        // Light ON beep (F1 high beep)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(950, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
      } else {
        // LIGHTS OUT green launch tone
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.45);
      }
    } catch (e) {
      console.warn('Audio tone notice:', e);
    }
  }

  /**
   * Gear Shift pneumatic click & exhaust pop
   */
  playGearShiftSound() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {
      console.warn('Gear shift audio notice:', e);
    }
  }

  /**
   * Continuous / dynamic engine rev synthesis
   */
  updateEngineSound(rpm) {
    if (this.isMuted) {
      this.stopEngineSound();
      return;
    }
    this.init();
    if (!this.ctx) return;

    const baseFreq = 55 + (rpm / 15000) * 190; // 55Hz to ~245Hz fundamental

    if (!this.isEngineRunning) {
      try {
        const now = this.ctx.currentTime;
        this.engineOsc1 = this.ctx.createOscillator();
        this.engineOsc2 = this.ctx.createOscillator();
        this.engineGain = this.ctx.createGain();
        this.engineFilter = this.ctx.createBiquadFilter();

        this.engineOsc1.type = 'sawtooth';
        this.engineOsc2.type = 'square';

        this.engineOsc1.frequency.setValueAtTime(baseFreq, now);
        this.engineOsc2.frequency.setValueAtTime(baseFreq * 1.5, now);

        this.engineFilter.type = 'lowpass';
        this.engineFilter.frequency.setValueAtTime(600 + (rpm / 15000) * 1400, now);
        this.engineFilter.Q.setValueAtTime(2.5, now);

        this.engineGain.gain.setValueAtTime(0.08, now);

        this.engineOsc1.connect(this.engineFilter);
        this.engineOsc2.connect(this.engineFilter);
        this.engineFilter.connect(this.engineGain);
        this.engineGain.connect(this.ctx.destination);

        this.engineOsc1.start(now);
        this.engineOsc2.start(now);
        this.isEngineRunning = true;
      } catch (e) {
        console.warn('Engine sound init notice:', e);
      }
    } else {
      try {
        const now = this.ctx.currentTime;
        if (this.engineOsc1 && this.engineOsc2 && this.engineFilter) {
          this.engineOsc1.frequency.setTargetAtTime(baseFreq, now, 0.05);
          this.engineOsc2.frequency.setTargetAtTime(baseFreq * 1.5, now, 0.05);
          this.engineFilter.frequency.setTargetAtTime(600 + (rpm / 15000) * 1400, now, 0.05);
        }
      } catch (e) {}
    }
  }

  stopEngineSound() {
    if (this.isEngineRunning) {
      try {
        if (this.engineGain && this.ctx) {
          const now = this.ctx.currentTime;
          this.engineGain.gain.setTargetAtTime(0.001, now, 0.1);
        }
        setTimeout(() => {
          if (this.engineOsc1) {
            this.engineOsc1.stop();
            this.engineOsc1.disconnect();
          }
          if (this.engineOsc2) {
            this.engineOsc2.stop();
            this.engineOsc2.disconnect();
          }
          this.isEngineRunning = false;
        }, 150);
      } catch (e) {
        this.isEngineRunning = false;
      }
    }
  }
}

// Global audio engine instance
window.f1Audio = new F1AudioEngine();
