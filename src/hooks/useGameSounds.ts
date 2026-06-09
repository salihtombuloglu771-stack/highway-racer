'use client';

// Singleton Web Audio state — no files needed, all synthesised
let _ctx: AudioContext | null = null;
let _engOsc1: OscillatorNode | null = null;
let _engOsc2: OscillatorNode | null = null;
let _engGain: GainNode | null = null;
let _ready = false;

function ac(): AudioContext {
  if (!_ctx) {
    _ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return _ctx;
}

export function initAudio(): void {
  if (_ready || typeof window === 'undefined') return;
  try {
    const c = ac();
    if (c.state === 'suspended') c.resume();

    _engOsc1 = c.createOscillator();
    _engOsc2 = c.createOscillator();
    const filter = c.createBiquadFilter();
    _engGain  = c.createGain();
    const g2  = c.createGain();

    _engOsc1.type = 'sawtooth';
    _engOsc2.type = 'sawtooth';
    filter.type   = 'lowpass';
    filter.frequency.value = 1100;
    filter.Q.value = 1.8;
    g2.gain.value  = 0.3;

    _engOsc1.connect(filter);
    _engOsc2.connect(g2);
    g2.connect(filter);
    filter.connect(_engGain);
    _engGain.connect(c.destination);
    _engGain.gain.value = 0;

    _engOsc1.start();
    _engOsc2.start();
    _ready = true;
  } catch { /* audio blocked */ }
}

export function updateEngine(speed: number, maxSpeed: number, nitroActive: boolean): void {
  if (!_engOsc1 || !_engOsc2 || !_engGain || !_ctx) return;
  const t    = _ctx.currentTime;
  const norm = Math.min(speed / maxSpeed, 1);
  const base = 55 + norm * 170;
  const freq = nitroActive ? base * 1.45 : base;
  const vol  = speed > 0.5 ? 0.022 + norm * 0.06 : 0;
  _engOsc1.frequency.setTargetAtTime(freq, t, 0.09);
  _engOsc2.frequency.setTargetAtTime(freq * 2.018, t, 0.09);
  _engGain.gain.setTargetAtTime(vol, t, 0.06);
}

export function stopEngine(): void {
  if (!_engGain || !_ctx) return;
  _engGain.gain.setTargetAtTime(0, _ctx.currentTime, 0.15);
}

export function playCrash(): void {
  if (!_ctx) return;
  try {
    const c = _ctx, n = Math.floor(c.sampleRate * 0.65);
    const buf = c.createBuffer(1, n, c.sampleRate);
    const d   = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-5 * i / n);
    const src = c.createBufferSource(), g = c.createGain();
    src.buffer = buf; g.gain.value = 0.9;
    src.connect(g); g.connect(c.destination); src.start();
  } catch { /* */ }
}

export function playWhoosh(): void {
  if (!_ctx) return;
  try {
    const c = _ctx, t = c.currentTime;
    const osc = c.createOscillator(), g = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.2);
    g.gain.setValueAtTime(0.13, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
    osc.connect(g); g.connect(c.destination);
    osc.start(t); osc.stop(t + 0.24);
  } catch { /* */ }
}

export function playCoin(): void {
  if (!_ctx) return;
  try {
    const c = _ctx;
    [523.25, 659.25, 784].forEach((freq, i) => {
      const osc = c.createOscillator(), g = c.createGain();
      const t   = c.currentTime + i * 0.055;
      osc.type  = 'sine'; osc.frequency.value = freq;
      g.gain.setValueAtTime(0.07, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.connect(g); g.connect(c.destination);
      osc.start(t); osc.stop(t + 0.12);
    });
  } catch { /* */ }
}
