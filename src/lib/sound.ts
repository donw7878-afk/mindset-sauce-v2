/**
 * The Institute's sound engine — spec §15.
 * Opt-in only (muted by default, toggled in the nav), Web Audio API,
 * no music: mechanical, metallic, synthesized, restrained. The vault
 * sounds are the signature; everything else is secondary.
 *
 * Browser autoplay rules: the AudioContext is only created/resumed from
 * a user gesture. If the preference was restored from a previous visit,
 * `armResumeOnGesture()` quietly waits for the first interaction.
 */

const PREF_KEY = "msi_sound";
let ctx: AudioContext | null = null;
let on = false;
let ambienceNodes: { stop: () => void } | null = null;

export function soundEnabled(): boolean {
  return on;
}

export function initSoundPref(): boolean {
  try {
    on = localStorage.getItem(PREF_KEY) === "1";
  } catch {
    on = false;
  }
  if (on) armResumeOnGesture();
  return on;
}

/** Call from a user gesture (the nav toggle). */
export function setSoundEnabled(next: boolean) {
  on = next;
  try {
    localStorage.setItem(PREF_KEY, next ? "1" : "0");
  } catch {
    /* private mode */
  }
  if (next) {
    ensureCtx();
    startAmbience();
    // A quiet confirmation so "Sound On" is immediately believed
    uiClick(0.08);
  } else {
    stopAmbience();
  }
}

/** When the preference was restored without a gesture, wake on first interaction. */
export function armResumeOnGesture() {
  if (typeof window === "undefined") return;
  const wake = () => {
    if (!on) return;
    ensureCtx();
    startAmbience();
  };
  window.addEventListener("pointerdown", wake, { once: true });
  window.addEventListener("keydown", wake, { once: true });
}

function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      const Ctx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new Ctx();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function noiseBuffer(ac: AudioContext, seconds = 2): AudioBuffer {
  const buf = ac.createBuffer(1, ac.sampleRate * seconds, ac.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    // Brown-ish noise: warm, not hissy
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  return buf;
}

/* ---------------- Ambience ---------------- */

/** Hero ambience: low, warm, almost imperceptible. Runs while sound is on. */
export function startAmbience() {
  if (!on || ambienceNodes) return;
  const ac = ensureCtx();
  if (!ac) return;

  const src = ac.createBufferSource();
  src.buffer = noiseBuffer(ac, 4);
  src.loop = true;

  const low = ac.createBiquadFilter();
  low.type = "lowpass";
  low.frequency.value = 160;

  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.0001, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.018, ac.currentTime + 3);

  // A very slow breathing swell so the room feels alive
  const lfo = ac.createOscillator();
  lfo.frequency.value = 0.05;
  const lfoGain = ac.createGain();
  lfoGain.gain.value = 0.006;
  lfo.connect(lfoGain).connect(gain.gain);

  src.connect(low).connect(gain).connect(ac.destination);
  src.start();
  lfo.start();

  ambienceNodes = {
    stop: () => {
      const t = ac.currentTime;
      gain.gain.cancelScheduledValues(t);
      gain.gain.setValueAtTime(gain.gain.value || 0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1);
      src.stop(t + 1.1);
      lfo.stop(t + 1.1);
    },
  };
}

export function stopAmbience() {
  ambienceNodes?.stop();
  ambienceNodes = null;
}

/* ---------------- The vault ---------------- */

/** Heavy metallic bolt click — pin retraction. */
export function boltClick(volume = 0.4) {
  if (!on) return;
  const ac = ensureCtx();
  if (!ac) return;
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  osc.type = "square";
  osc.frequency.value = 170 + Math.random() * 40;
  const band = ac.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 850;
  band.Q.value = 7;
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(volume, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
  osc.connect(band).connect(g).connect(ac.destination);
  osc.start(t);
  osc.stop(t + 0.25);
  // Sub-thump beneath the click — vibration-like bass
  const sub = ac.createOscillator();
  sub.type = "sine";
  sub.frequency.value = 55;
  const sg = ac.createGain();
  sg.gain.setValueAtTime(0.0001, t);
  sg.gain.exponentialRampToValueAtTime(volume * 0.5, t + 0.02);
  sg.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
  sub.connect(sg).connect(ac.destination);
  sub.start(t);
  sub.stop(t + 0.35);
}

/** Deep resonant unlock — the mechanism releasing. */
export function deepRelease(volume = 0.5) {
  if (!on) return;
  const ac = ensureCtx();
  if (!ac) return;
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(52, t);
  osc.frequency.exponentialRampToValueAtTime(30, t + 2);
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(volume, t + 0.2);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
  osc.connect(g).connect(ac.destination);
  osc.start(t);
  osc.stop(t + 2.3);
}

/** Slow metal groan — the mass of the door in motion. */
export function doorGroan(volume = 0.16) {
  if (!on) return;
  const ac = ensureCtx();
  if (!ac) return;
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(38, t);
  osc.frequency.linearRampToValueAtTime(26, t + 2.8);
  const low = ac.createBiquadFilter();
  low.type = "lowpass";
  low.frequency.value = 220;
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(volume, t + 0.6);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 3);
  osc.connect(low).connect(g).connect(ac.destination);
  osc.start(t);
  osc.stop(t + 3.1);
  // Grinding texture beneath the groan
  const src = ac.createBufferSource();
  src.buffer = noiseBuffer(ac, 3);
  const band = ac.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 320;
  band.Q.value = 2;
  const ng = ac.createGain();
  ng.gain.setValueAtTime(0.0001, t);
  ng.gain.exponentialRampToValueAtTime(volume * 0.4, t + 0.6);
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 3);
  src.connect(band).connect(ng).connect(ac.destination);
  src.start(t);
  src.stop(t + 3);
}

/** Warm harmonic tone — gold light flooding (3s fade). */
export function goldTone(volume = 0.12) {
  if (!on) return;
  const ac = ensureCtx();
  if (!ac) return;
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  osc.type = "sine";
  osc.frequency.value = 220;
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(volume, t + 1.4);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);
  osc.connect(g).connect(ac.destination);
  osc.start(t);
  osc.stop(t + 3.3);
}

/* ---------------- The Ceremony ---------------- */

/** An extremely subtle heartbeat — lub-dub, barely there. */
export function heartbeat(beats = 3, volume = 0.09) {
  if (!on) return;
  const ac = ensureCtx();
  if (!ac) return;
  const start = ac.currentTime;
  for (let b = 0; b < beats; b++) {
    const base = start + b * 1.15;
    [0, 0.28].forEach((offset, i) => {
      const osc = ac.createOscillator();
      osc.type = "sine";
      osc.frequency.value = i === 0 ? 52 : 44;
      const g = ac.createGain();
      const t = base + offset;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(volume * (i === 0 ? 1 : 0.7), t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      osc.connect(g).connect(ac.destination);
      osc.start(t);
      osc.stop(t + 0.3);
    });
  }
}

/** A soft inhale — air drawn slowly in. */
export function breathIn(volume = 0.03) {
  if (!on) return;
  const ac = ensureCtx();
  if (!ac) return;
  const t = ac.currentTime;
  const src = ac.createBufferSource();
  src.buffer = noiseBuffer(ac, 2);
  const band = ac.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.setValueAtTime(400, t);
  band.frequency.linearRampToValueAtTime(900, t + 1.4);
  band.Q.value = 1.2;
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(volume, t + 1.1);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
  src.connect(band).connect(g).connect(ac.destination);
  src.start(t);
  src.stop(t + 1.7);
}

/* ---------------- Interface ---------------- */

/** Restrained tactile click for buttons. No arcade sounds. */
export function uiClick(volume = 0.06) {
  if (!on) return;
  const ac = ensureCtx();
  if (!ac) return;
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  osc.type = "square";
  osc.frequency.value = 2100;
  const high = ac.createBiquadFilter();
  high.type = "highpass";
  high.frequency.value = 1200;
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(volume, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  osc.connect(high).connect(g).connect(ac.destination);
  osc.start(t);
  osc.stop(t + 0.06);
}

/** Soft high shimmer — trackers, seals, certificates. */
function shimmer(freq: number, volume = 0.03, decay = 0.5) {
  if (!on) return;
  const ac = ensureCtx();
  if (!ac) return;
  const t = ac.currentTime;
  [freq, freq * 1.06].forEach((f, i) => {
    const osc = ac.createOscillator();
    osc.type = "sine";
    osc.frequency.value = f;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(volume * (i === 0 ? 1 : 0.5), t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    osc.connect(g).connect(ac.destination);
    osc.start(t);
    osc.stop(t + decay + 0.1);
  });
}

/** Soft filtered air movement — pages, cards, breath. */
function swish(center: number, volume = 0.035, duration = 0.22) {
  if (!on) return;
  const ac = ensureCtx();
  if (!ac) return;
  const t = ac.currentTime;
  const src = ac.createBufferSource();
  src.buffer = noiseBuffer(ac, 1);
  const band = ac.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.setValueAtTime(center, t);
  band.frequency.linearRampToValueAtTime(center * 1.5, t + duration);
  band.Q.value = 1.5;
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(volume, t + 0.04);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  src.connect(band).connect(g).connect(ac.destination);
  src.start(t);
  src.stop(t + duration + 0.05);
}

/** One subtle, unique sound per artifact hover. */
export function artifactSound(slug: string) {
  switch (slug) {
    case "manual": // soft page flutter
    case "workbook":
      swish(1400, 0.03, 0.18);
      break;
    case "tracker": // small gold progress shimmer
      shimmer(1320, 0.025, 0.45);
      break;
    case "emergency": // gentle card slide
      swish(700, 0.035, 0.26);
      break;
    case "cache": // soft breath / particle shimmer
      swish(500, 0.025, 0.5);
      break;
    case "certificate": // light metallic seal shimmer
      shimmer(2093, 0.028, 0.6);
      break;
    case "audio": // waveform glow
      shimmer(880, 0.022, 0.4);
      break;
    case "executables": // checkmark glow
      shimmer(1568, 0.022, 0.3);
      break;
    default:
      break;
  }
}
