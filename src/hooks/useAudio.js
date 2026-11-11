// src/hooks/useAudio.js
// Shared AudioContext hook — prevents browser AudioContext limit issues
let sharedCtx = null;

const getAudioContext = () => {
  if (!sharedCtx) {
    sharedCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (sharedCtx.state === 'suspended') {
    sharedCtx.resume();
  }
  return sharedCtx;
};

export const playAudioEffect = (type, soundEnabled = true) => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    if (type === 'pickup') {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine'; osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.08);
      gain.gain.setValueAtTime(0.25, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(); osc.stop(now + 0.08);
    } else if (type === 'place') {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'triangle'; osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);
      gain.gain.setValueAtTime(0.4, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.start(); osc.stop(now + 0.12);
    } else if (type === 'coinSpin') {
      for (let i = 0; i < 14; i++) {
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine'; osc.frequency.setValueAtTime(700 + Math.random() * 300, now + i * 0.14);
        gain.gain.setValueAtTime(0.02, now + i * 0.14); gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.14 + 0.05);
        osc.start(now + i * 0.14); osc.stop(now + i * 0.14 + 0.05);
      }
    } else if (type === 'coinLand') {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine'; osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(250, now + 0.12);
      gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(); osc.stop(now + 0.12);
    } else if (type === 'victory') {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        const duration = idx === notes.length - 1 ? 0.35 : 0.11;
        gain.gain.setValueAtTime(0.25, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + duration);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + duration);
      });
    } else if (type === 'defeat') {
      const tones = [440, 370, 280];
      tones.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.18);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.85, now + idx * 0.18 + 0.17);
        gain.gain.setValueAtTime(0.2, now + idx * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.18 + 0.17);
        osc.start(now + idx * 0.18);
        osc.stop(now + idx * 0.18 + 0.17);
      });
    }
  } catch (e) {
    // Audio playback failed silently (e.g. autoplay policy)
  }
};

// ─────────────────────────────────────────────────────────────
// BGM engine — ambient pad whose tonality follows the active board.
// playBGM(seed, theme) starts the loop; stopBGM() fades it out.
// ─────────────────────────────────────────────────────────────
let bgmState = null; // { master, osc1, osc2, lfo, interval }

export const stopBGM = () => {
  if (!bgmState) return;
  const { master, osc1, osc2, lfo, interval } = bgmState;
  bgmState = null;
  try {
    if (interval) clearInterval(interval);
    const now = master.context.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
    master.gain.linearRampToValueAtTime(0.0001, now + 0.4);
    const kill = (n) => { try { n.stop(now + 0.45); } catch (e) { /* already stopped */ } };
    kill(osc1);
    kill(osc2);
    kill(lfo);
    setTimeout(() => { try { master.disconnect(); } catch (e) { /* detached */ } }, 500);
  } catch (e) {
    // best-effort teardown
  }
};

export const playBGM = (seed = 0, theme = null) => {
  stopBGM();
  try {
    const ctx = getAudioContext();
    // Root tone is derived from the board seed; a theme may override it via bgFreq/bgFreqs
    const roots = [130.81, 146.83, 164.81, 174.61, 196.0, 220.0, 246.94, 277.18];
    const root = theme && theme.bgFreq ? theme.bgFreq : roots[Math.abs(seed) % roots.length];
    const ratios = theme && Array.isArray(theme.bgFreqs) && theme.bgFreqs.length ? theme.bgFreqs : [1, 1.5, 2];
    const chord = ratios.map((r) => root * r);

    const master = ctx.createGain();
    const t0 = ctx.currentTime;
    master.gain.setValueAtTime(0.0001, t0);
    master.gain.linearRampToValueAtTime(0.05, t0 + 2);
    master.connect(ctx.destination);

    const mkOsc = (freq, type, detune) => {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.setValueAtTime(freq, t0);
      o.detune.setValueAtTime(detune, t0);
      o.connect(master);
      o.start();
      return o;
    };
    const osc1 = mkOsc(chord[0], 'sine', 0);
    const osc2 = mkOsc(chord[1] || chord[0] * 1.5, 'triangle', 7);

    // Slow LFO swells the second voice for a gentle breathing effect
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.12, t0);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime((chord[1] || chord[0] * 1.5) * 0.08, t0);
    lfo.connect(lfoGain);
    lfoGain.connect(osc2.frequency);
    lfo.start();

    // Gentle pentatonic arpeggio floating over the chord
    const scale = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3];
    let step = 0;
    const interval = setInterval(() => {
      try {
        const now = ctx.currentTime;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(root * 2 * scale[step % scale.length], now);
        g.gain.setValueAtTime(0.001, now);
        g.gain.linearRampToValueAtTime(0.06, now + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
        o.connect(g);
        g.connect(master);
        o.start(now);
        o.stop(now + 1.7);
        step += 1;
      } catch (e) {
        // ignore individual pluck failures
      }
    }, 1800);

    bgmState = { master, osc1, osc2, lfo, interval };
  } catch (e) {
    bgmState = null;
  }
};