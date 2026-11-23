// src/audio/adventureMusic.js

const TRACK_DURATION_MS = 150000; // Najmanje 2.5 minute po skladbi

const MENU_TRACKS = [
  {
    id: 'hearth-hall',
    title: 'Hearth of the Quiet Hall',
    melody: [196.00, 220.00, 261.63, 246.94, 220.00, 196.00, 174.61, 196.00],
    harmony: [130.81, 146.83, 164.81, 146.83, 130.81, 130.81, 110.00, 130.81],
    bass: [65.41, 65.41, 87.31, 87.31, 73.42, 73.42, 65.41, 65.41]
  },
  {
    id: 'dawn-over-stone',
    title: 'Dawn Over Stone & Moss',
    melody: [220.00, 246.94, 293.66, 261.63, 220.00, 196.00, 174.61, 164.81],
    harmony: [146.83, 164.81, 196.00, 174.61, 146.83, 130.81, 110.00, 110.00],
    bass: [73.42, 73.42, 98.00, 98.00, 87.31, 87.31, 73.42, 73.42]
  }
];

const GAME_TRACKS = [
  {
    id: 'misty-expedition',
    title: 'Misty Expedition & Winding Path',
    melody: [220.00, 261.63, 293.66, 261.63, 220.00, 196.00, 174.61, 196.00],
    harmony: [146.83, 174.61, 220.00, 174.61, 146.83, 130.81, 146.83, 164.81],
    bass: [73.42, 73.42, 87.31, 87.31, 98.00, 98.00, 87.31, 73.42]
  },
  {
    id: 'amber-lanterns',
    title: 'Amber Lanterns of the Valley',
    melody: [174.61, 220.00, 261.63, 329.63, 293.66, 261.63, 220.00, 196.00],
    harmony: [130.81, 174.61, 196.00, 220.00, 196.00, 174.61, 146.83, 130.81],
    bass: [87.31, 87.31, 65.41, 65.41, 73.42, 73.42, 87.31, 98.00]
  },
  {
    id: 'twilight-watch',
    title: 'Twilight Watch Beyond the Ridge',
    melody: [196.00, 220.00, 261.63, 293.66, 261.63, 220.00, 196.00, 164.81],
    harmony: [130.81, 146.83, 164.81, 196.00, 164.81, 146.83, 130.81, 110.00],
    bass: [65.41, 65.41, 110.00, 110.00, 98.00, 98.00, 87.31, 65.41]
  }
];

export class AdventureMusicPlayer {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.filterNode = null;
    this.timer = null;
    this.step = 0;
    this.mode = 'menu'; // 'menu' | 'game'
    this.trackIndexByMode = { menu: 0, game: 0 };
    this.trackStartedAtByMode = { menu: 0, game: 0 };
    this.isPlaying = false;
    this.intensity = 'calm';
    this.volume = 0.35;
    this.duckUntil = 0;
    this.sessionId = 0;
    this.activeNodes = new Set();
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.value = this.mode === 'menu' ? 410 : 460;
      this.filterNode.Q.value = 0.7;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0;

      this.filterNode.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  getTargetGain() {
    if (!this.isPlaying) return 0;
    const nowMs = Date.now();
    const duckFactor = nowMs < this.duckUntil ? 0.3 : 1;
    const modeScale = this.mode === 'menu' ? 0.12 : 0.15;
    return this.volume * modeScale * duckFactor;
  }

  applyGainInstant() {
    if (!this.masterGain || !this.ctx) return;
    const target = this.getTargetGain();
    try {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(target, this.ctx.currentTime);
      this.masterGain.gain.value = target;
    } catch (e) {}
  }

  duckForEffect(durationMs = 400) {
    if (!this.isPlaying) return;
    this.duckUntil = Date.now() + durationMs;
    this.applyGainInstant();
    setTimeout(() => {
      if (this.isPlaying) {
        this.applyGainInstant();
      }
    }, durationMs);
  }

  setMode(nextMode) {
    const normalized = nextMode === 'game' ? 'game' : 'menu';
    if (this.mode === normalized) return;
    this.mode = normalized;
    this.step = 0;
    this.trackStartedAtByMode[normalized] = Date.now();
    this.applyGainInstant();
    if (this.filterNode && this.ctx) {
      const cutoff = normalized === 'menu'
        ? 410
        : (this.intensity === 'intense' ? 600 : this.intensity === 'lively' ? 520 : 460);
      try {
        this.filterNode.frequency.setValueAtTime(cutoff, this.ctx.currentTime);
      } catch (e) {}
    }
  }

  setVolume(vol0to100) {
    this.volume = Math.max(0, Math.min(1, Number(vol0to100) / 100));
    if (this.isPlaying && this.volume > 0) {
      this.ensureContext();
      this.applyGainInstant();
    } else if (this.masterGain && this.ctx) {
      this.applyGainInstant();
    }
  }

  setIntensity(level) {
    this.intensity = level;
    if (this.filterNode && this.ctx) {
      const cutoff = this.mode === 'menu'
        ? 410
        : (level === 'intense' ? 600 : level === 'lively' ? 520 : 460);
      try {
        this.filterNode.frequency.setValueAtTime(cutoff, this.ctx.currentTime);
      } catch (e) {}
    }
  }

  start(enabled, vol0to100) {
    this.volume = Math.max(0, Math.min(1, Number(vol0to100) / 100));
    if (!enabled || Number(vol0to100) <= 0) {
      this.stop();
      return;
    }

    try {
      this.ensureContext();

      if (!this.trackStartedAtByMode[this.mode]) {
        this.trackStartedAtByMode[this.mode] = Date.now();
      }

      this.isPlaying = true;
      this.applyGainInstant();

      if (this.timer) {
        return;
      }

      const currentSession = ++this.sessionId;

      const playSoftNote = (freq, type, startTime, duration, peakGain) => {
        if (!freq || !this.ctx || !this.filterNode || !this.isPlaying) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);

        g.gain.setValueAtTime(0.0005, startTime);
        g.gain.linearRampToValueAtTime(peakGain, startTime + 0.14);
        g.gain.setValueAtTime(peakGain * 0.9, startTime + Math.max(0.16, duration - 0.16));
        g.gain.exponentialRampToValueAtTime(0.0005, startTime + duration);

        osc.connect(g);
        g.connect(this.filterNode);

        const entry = { osc, g };
        this.activeNodes.add(entry);
        osc.onended = () => {
          this.activeNodes.delete(entry);
        };

        osc.start(startTime);
        osc.stop(startTime + duration + 0.03);
      };

      const tick = () => {
        if (!this.isPlaying || currentSession !== this.sessionId || !this.ctx) {
          this.timer = null;
          return;
        }

        const playlist = this.mode === 'menu' ? MENU_TRACKS : GAME_TRACKS;
        const nowMs = Date.now();
        const startedAt = this.trackStartedAtByMode[this.mode] || nowMs;

        if (nowMs - startedAt >= TRACK_DURATION_MS) {
          this.trackIndexByMode[this.mode] = (this.trackIndexByMode[this.mode] + 1) % playlist.length;
          this.trackStartedAtByMode[this.mode] = nowMs;
          this.step = 0;
        }

        const currentStartedAt = this.trackStartedAtByMode[this.mode] || nowMs;
        const track = playlist[this.trackIndexByMode[this.mode] % playlist.length];
        const idx = this.step % track.melody.length;
        const now = this.ctx.currentTime;

        const songProgress = Math.min(1, (nowMs - currentStartedAt) / TRACK_DURATION_MS);
        const includeHarmony = this.mode === 'menu' ? songProgress >= 0.15 : (this.intensity !== 'calm' || songProgress >= 0.2);
        const includeBass = this.mode === 'menu' ? (songProgress >= 0.4 && idx % 2 === 0) : ((this.intensity === 'intense' || songProgress >= 0.45) && idx % 2 === 0);

        const stepIntervalMs = this.mode === 'menu'
          ? 1200
          : (this.intensity === 'intense' ? 840 : this.intensity === 'lively' ? 980 : 1120);
        const noteDurationSec = (stepIntervalMs / 1000) * 1.45;

        playSoftNote(
          track.melody[idx],
          this.mode === 'menu' ? 'sine' : 'triangle',
          now,
          noteDurationSec,
          this.mode === 'menu' ? 0.18 : 0.22
        );

        if (includeHarmony) {
          playSoftNote(
            track.harmony[idx],
            'sine',
            now,
            noteDurationSec * 1.2,
            0.13
          );
        }

        if (includeBass) {
          playSoftNote(
            track.bass[idx],
            'sine',
            now,
            noteDurationSec * 1.8,
            0.17
          );
        }

        this.step += 1;
        this.timer = setTimeout(tick, stepIntervalMs);
      };

      tick();
    } catch (e) {}
  }

  stop() {
    this.isPlaying = false;
    this.sessionId += 1;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.masterGain.gain.value = 0;
      } catch (e) {}
    }
    this.activeNodes.forEach(({ osc, g }) => {
      try {
        g.gain.cancelScheduledValues(0);
        g.gain.setValueAtTime(0, 0);
        osc.stop(0);
        osc.disconnect();
      } catch (e) {}
    });
    this.activeNodes.clear();
  }
}

export const adventureMusicPlayer = new AdventureMusicPlayer();