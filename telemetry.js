/**
 * ============================================================================
 * F1 TELEMETRY PORTFOLIO - TELEMETRY & COCKPIT CONTROLLER
 * Driver: Manan Joshi #14 | Real-time Canvas Waveforms & HUD Gauges
 * ============================================================================
 */

class F1TelemetryController {
  constructor() {
    // Car State
    this.carState = {
      speed: 312,        // km/h
      rpm: 12400,        // RPM
      gear: 7,           // 1 to 8
      throttle: 88,      // 0 to 100%
      brake: 0,          // 0 to 100%
      drs: true,         // DRS active
      delta: -0.428,     // Lap delta vs pole
      isAccelerating: false,
      isBraking: false
    };

    // Gear ratios & top speeds per gear
    this.gearLimits = {
      1: { minSpeed: 0, maxSpeed: 105, minRpm: 4500, maxRpm: 14500 },
      2: { minSpeed: 60, maxSpeed: 155, minRpm: 5000, maxRpm: 14600 },
      3: { minSpeed: 110, maxSpeed: 200, minRpm: 5500, maxRpm: 14700 },
      4: { minSpeed: 160, maxSpeed: 245, minRpm: 6000, maxRpm: 14800 },
      5: { minSpeed: 210, maxSpeed: 285, minRpm: 6500, maxRpm: 14900 },
      6: { minSpeed: 250, maxSpeed: 315, minRpm: 7000, maxRpm: 15000 },
      7: { minSpeed: 280, maxSpeed: 338, minRpm: 7500, maxRpm: 15000 },
      8: { minSpeed: 310, maxSpeed: 358, minRpm: 8000, maxRpm: 15000 }
    };

    // Telemetry Canvas Data History
    this.maxPoints = 120;
    this.telemetryHistory = {
      speed: [],
      throttle: [],
      brake: [],
      rpm: []
    };

    // DOM Elements
    this.speedEl = document.getElementById('hudSpeed');
    this.gearEl = document.getElementById('hudGear');
    this.rpmEl = document.getElementById('hudRpm');
    this.drsEl = document.getElementById('hudDrs');
    this.deltaEl = document.getElementById('hudDelta');
    this.ledNodes = document.querySelectorAll('.rpm-led-bar .led-node');
    this.canvas = document.getElementById('telemetryCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    // Initialize telemetry history buffers
    this.initBuffers();
  }

  initBuffers() {
    for (let i = 0; i < this.maxPoints; i++) {
      const phase = (i / this.maxPoints) * Math.PI * 4;
      this.telemetryHistory.speed.push(260 + Math.sin(phase) * 60 + Math.random() * 8);
      this.telemetryHistory.throttle.push(Math.max(10, Math.sin(phase + 0.5) * 80 + 20));
      this.telemetryHistory.brake.push(Math.sin(phase + 3.14) > 0.4 ? 75 : 0);
      this.telemetryHistory.rpm.push(11500 + Math.sin(phase) * 2800);
    }
  }

  init() {
    this.setupEventListeners();
    this.initStartingLights();
    this.renderCanvas();
    this.startSimulationLoop();
  }

  setupEventListeners() {
    // Pedals: Gas, Brake, Shifts
    const gasBtn = document.getElementById('gasPedalBtn');
    const brakeBtn = document.getElementById('brakePedalBtn');
    const shiftUpBtn = document.getElementById('shiftUpBtn');
    const shiftDownBtn = document.getElementById('shiftDownBtn');
    const drsToggleBtn = document.getElementById('drsToggleBtn');
    const replayLightsBtn = document.getElementById('replayLightsBtn');

    if (gasBtn) {
      gasBtn.addEventListener('mousedown', () => this.setGas(true));
      gasBtn.addEventListener('mouseup', () => this.setGas(false));
      gasBtn.addEventListener('mouseleave', () => this.setGas(false));
      gasBtn.addEventListener('touchstart', (e) => { e.preventDefault(); this.setGas(true); }, { passive: false });
      gasBtn.addEventListener('touchend', (e) => { e.preventDefault(); this.setGas(false); });
    }

    if (brakeBtn) {
      brakeBtn.addEventListener('mousedown', () => this.setBrake(true));
      brakeBtn.addEventListener('mouseup', () => this.setBrake(false));
      brakeBtn.addEventListener('mouseleave', () => this.setBrake(false));
      brakeBtn.addEventListener('touchstart', (e) => { e.preventDefault(); this.setBrake(true); }, { passive: false });
      brakeBtn.addEventListener('touchend', (e) => { e.preventDefault(); this.setBrake(false); });
    }

    if (shiftUpBtn) {
      shiftUpBtn.addEventListener('click', () => this.shiftUp());
    }

    if (shiftDownBtn) {
      shiftDownBtn.addEventListener('click', () => this.shiftDown());
    }

    if (drsToggleBtn) {
      drsToggleBtn.addEventListener('click', () => this.toggleDRS());
    }

    if (replayLightsBtn) {
      replayLightsBtn.addEventListener('click', () => this.playStartingLightsSequence());
    }

    // Keyboard controls for telemetry cockpit!
    window.addEventListener('keydown', (e) => {
      // Avoid capturing input if typing in form or chat
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        this.setGas(true);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        this.setBrake(true);
      } else if (e.key === 'e' || e.key === 'E') {
        this.shiftUp();
      } else if (e.key === 'q' || e.key === 'Q') {
        this.shiftDown();
      } else if (e.key === 'd' || e.key === 'D') {
        this.toggleDRS();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        this.setGas(false);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        this.setBrake(false);
      }
    });

    // Resize canvas on window resize
    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });
  }

  setGas(active) {
    this.carState.isAccelerating = active;
    this.carState.throttle = active ? 100 : 25;
    if (active) this.carState.brake = 0;
  }

  setBrake(active) {
    this.carState.isBraking = active;
    this.carState.brake = active ? 95 : 0;
    if (active) this.carState.throttle = 0;
  }

  shiftUp() {
    if (this.carState.gear < 8) {
      this.carState.gear++;
      this.carState.rpm = Math.max(8200, this.carState.rpm - 2800);
      if (window.f1Audio) window.f1Audio.playGearShiftSound();
      this.updateHudDOM();
    }
  }

  shiftDown() {
    if (this.carState.gear > 1) {
      this.carState.gear--;
      this.carState.rpm = Math.min(14200, this.carState.rpm + 2400);
      if (window.f1Audio) window.f1Audio.playGearShiftSound();
      this.updateHudDOM();
    }
  }

  toggleDRS() {
    this.carState.drs = !this.carState.drs;
    if (this.drsEl) {
      if (this.carState.drs) {
        this.drsEl.classList.add('active');
        this.drsEl.textContent = 'DRS OPEN';
      } else {
        this.drsEl.classList.remove('active');
        this.drsEl.textContent = 'DRS AVAIL';
      }
    }
    if (window.f1Audio) window.f1Audio.playPitRadioBeep();
  }

  // Main continuous physics & HUD update simulation
  startSimulationLoop() {
    const loop = () => {
      const curGear = this.carState.gear;
      const limits = this.gearLimits[curGear];

      if (this.carState.isAccelerating) {
        // Accelerate
        const accelRate = (1.5 - (this.carState.speed / 400)) * (this.carState.drs ? 1.8 : 1.4);
        this.carState.speed = Math.min(limits.maxSpeed, this.carState.speed + accelRate);
        this.carState.rpm = Math.min(14850, this.carState.rpm + 110);

        // Auto shift up at peak rev limiter
        if (this.carState.rpm >= 14750 && this.carState.gear < 8) {
          this.shiftUp();
        }
      } else if (this.carState.isBraking) {
        // Brake hard
        this.carState.speed = Math.max(30, this.carState.speed - 3.8);
        this.carState.rpm = Math.max(4500, this.carState.rpm - 260);

        // Auto downshift when RPM drops too low
        if (this.carState.rpm <= 6000 && this.carState.gear > 1) {
          this.shiftDown();
        }
      } else {
        // Cruising / slight drag oscillation
        const targetCruisingSpeed = 308 + Math.sin(Date.now() / 800) * 8;
        this.carState.speed += (targetCruisingSpeed - this.carState.speed) * 0.05;
        const targetRpm = 11800 + Math.sin(Date.now() / 600) * 900;
        this.carState.rpm += (targetRpm - this.carState.rpm) * 0.05;
        this.carState.throttle = 75 + Math.sin(Date.now() / 1000) * 15;
      }

      // Delta micro fluctuations
      this.carState.delta = -0.428 + Math.sin(Date.now() / 2500) * 0.04;

      // Update Audio Engine
      if (window.f1Audio && !window.f1Audio.isMuted) {
        window.f1Audio.updateEngineSound(this.carState.rpm);
      }

      // Update DOM
      this.updateHudDOM();

      // Push telemetry history
      this.telemetryHistory.speed.push(this.carState.speed);
      this.telemetryHistory.throttle.push(this.carState.throttle);
      this.telemetryHistory.brake.push(this.carState.brake);
      this.telemetryHistory.rpm.push(this.carState.rpm);

      if (this.telemetryHistory.speed.length > this.maxPoints) {
        this.telemetryHistory.speed.shift();
        this.telemetryHistory.throttle.shift();
        this.telemetryHistory.brake.shift();
        this.telemetryHistory.rpm.shift();
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  updateHudDOM() {
    if (this.speedEl) this.speedEl.textContent = Math.round(this.carState.speed);
    if (this.gearEl) this.gearEl.textContent = this.carState.gear;
    if (this.rpmEl) this.rpmEl.textContent = Math.round(this.carState.rpm).toLocaleString();
    if (this.deltaEl) this.deltaEl.textContent = (this.carState.delta > 0 ? '+' : '') + this.carState.delta.toFixed(3) + 's';

    // Update LED shift lights
    // 15 total LEDs: 1-5 green, 6-10 red, 11-15 purple
    const rpmFrac = Math.max(0, Math.min(1, (this.carState.rpm - 7000) / (14800 - 7000)));
    const activeLeds = Math.round(rpmFrac * this.ledNodes.length);

    this.ledNodes.forEach((led, index) => {
      led.classList.remove('active', 'green', 'red', 'purple', 'flash');
      if (index < activeLeds) {
        led.classList.add('active');
        if (index < 5) {
          led.classList.add('green');
        } else if (index < 10) {
          led.classList.add('red');
        } else {
          led.classList.add('purple');
          if (activeLeds >= 14) {
            led.classList.add('flash');
          }
        }
      }
    });
  }

  /* =========================================================================
     5-RED-LIGHTS STARTING SEQUENCE
     ========================================================================= */
  initStartingLights() {
    // Automatically trigger on page load with brief initial delay
    setTimeout(() => {
      this.playStartingLightsSequence();
    }, 1200);
  }

  playStartingLightsSequence() {
    const lightBoxes = document.querySelectorAll('.light-box');
    const statusText = document.getElementById('lightsStatusText');
    if (!lightBoxes.length) return;

    // Reset all lights
    lightBoxes.forEach(box => {
      box.classList.remove('active', 'green-launch');
    });

    if (statusText) statusText.textContent = 'FORMATION LAP COMPLETE // STANDING START SEQUENCE';

    let currentLight = 0;
    const interval = setInterval(() => {
      if (currentLight < lightBoxes.length) {
        lightBoxes[currentLight].classList.add('active');
        if (window.f1Audio) window.f1Audio.playLightTone(false);
        currentLight++;
      } else {
        clearInterval(interval);
        // Random pause between 0.8s and 2.4s (real FIA random timing)
        const launchDelay = 900 + Math.random() * 1200;
        setTimeout(() => {
          // LIGHTS OUT!
          lightBoxes.forEach(box => {
            box.classList.remove('active');
            box.classList.add('green-launch');
          });

          if (statusText) {
            statusText.textContent = 'LIGHTS OUT AND AWAY WE GO! 🏁';
            statusText.style.color = '#00e676';
          }

          if (window.f1Audio) window.f1Audio.playLightTone(true);

          // Clear green launch flash after 1.8s
          setTimeout(() => {
            lightBoxes.forEach(box => box.classList.remove('green-launch'));
            if (statusText) {
              statusText.textContent = 'RACE LAP 1/50 ACTIVE // P1 MANAN JOSHI';
              statusText.style.color = '';
            }
          }, 1800);
        }, launchDelay);
      }
    }, 900);
  }

  /* =========================================================================
     CANVAS TELEMETRY GRAPH RENDERING
     ========================================================================= */
  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width * (window.devicePixelRatio || 1);
    this.canvas.height = rect.height * (window.devicePixelRatio || 1);
    if (this.ctx) {
      this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    }
  }

  renderCanvas() {
    if (!this.canvas || !this.ctx) return;
    this.resizeCanvas();

    const draw = () => {
      const w = this.canvas.width / (window.devicePixelRatio || 1);
      const h = this.canvas.height / (window.devicePixelRatio || 1);
      const ctx = this.ctx;

      // Clear Canvas
      ctx.clearRect(0, 0, w, h);

      // Grid background lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';

      // Horizontal grid lines
      const horizSteps = 5;
      for (let i = 1; i < horizSteps; i++) {
        const y = (h / horizSteps) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Vertical distance grid lines
      const vertSteps = 8;
      for (let i = 1; i < vertSteps; i++) {
        const x = (w / vertSteps) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();

        // Distance label
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillText(`${i * 150}m`, x + 4, h - 8);
      }

      // Draw Telemetry Channels
      // 1. RPM (Purple)
      this.drawTrace(ctx, w, h, this.telemetryHistory.rpm, 4000, 15500, '#b138dd', 1.8);

      // 2. Speed (Cyan)
      this.drawTrace(ctx, w, h, this.telemetryHistory.speed, 0, 370, '#00f0ff', 2.2);

      // 3. Throttle (Green)
      this.drawTrace(ctx, w, h, this.telemetryHistory.throttle, 0, 110, '#00e676', 1.6);

      // 4. Brake (Red)
      this.drawTrace(ctx, w, h, this.telemetryHistory.brake, 0, 110, '#ff1801', 1.8);

      // Current Telemetry Cursor line (Leading edge)
      ctx.beginPath();
      ctx.moveTo(w - 2, 0);
      ctx.lineTo(w - 2, h);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();

      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);
  }

  drawTrace(ctx, w, h, data, minVal, maxVal, color, lineWidth = 2) {
    if (!data || data.length < 2) return;

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    const stepX = w / (this.maxPoints - 1);

    for (let i = 0; i < data.length; i++) {
      const x = i * stepX;
      const normalized = Math.max(0, Math.min(1, (data[i] - minVal) / (maxVal - minVal)));
      const y = h - (normalized * (h - 24)) - 12;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
    ctx.restore();
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.telemetryController = new F1TelemetryController();
  window.telemetryController.init();
});
