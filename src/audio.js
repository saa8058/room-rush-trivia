const AUDIO_SETTINGS_KEY = "room-rush-audio-settings";

const SOUND_PATHS = {
  countdown: "/public/sounds/countdown.mp3",
  answerLock: "/public/sounds/answer-lock.mp3",
  reveal: "/public/sounds/reveal.mp3",
  correct: "/public/sounds/correct.mp3",
  wrong: "/public/sounds/wrong.mp3",
  leaderboard: "/public/sounds/leaderboard.mp3",
  winner: "/public/sounds/winner.mp3",
  music: "/public/sounds/background-loop.mp3"
};

const FALLBACK_TONES = {
  countdown: { frequency: 880, duration: 0.08, type: "square", gain: 0.16 },
  answerLock: { frequency: 620, duration: 0.11, type: "sine", gain: 0.18 },
  reveal: { frequency: 420, duration: 0.24, type: "triangle", gain: 0.16 },
  correct: { frequency: 980, duration: 0.2, type: "sine", gain: 0.2 },
  wrong: { frequency: 180, duration: 0.22, type: "sawtooth", gain: 0.12 },
  leaderboard: { frequency: 720, duration: 0.16, type: "triangle", gain: 0.14 },
  winner: { frequency: 1040, duration: 0.45, type: "sine", gain: 0.18 }
};

const DEFAULT_AUDIO_SETTINGS = {
  soundOn: false,
  musicOn: false,
  volume: 0.7
};

let audioState = {
  unlocked: false,
  context: null,
  settings: loadAudioSettings(),
  elements: new Map(),
  missingFiles: new Set()
};

export function getAudioSettings() {
  return {
    ...audioState.settings,
    unlocked: audioState.unlocked
  };
}

export async function enableAudio() {
  audioState.settings.soundOn = true;
  audioState.unlocked = true;
  saveAudioSettings();
  await ensureAudioContext();
  return getAudioSettings();
}

export function setSoundEnabled(enabled) {
  audioState.settings.soundOn = Boolean(enabled);
  if (!audioState.settings.soundOn) {
    audioState.settings.musicOn = false;
    stopAllAudio();
  }
  saveAudioSettings();
  return getAudioSettings();
}

export function setMusicEnabled(enabled) {
  audioState.settings.musicOn = Boolean(enabled);
  saveAudioSettings();
  if (audioState.settings.musicOn) startBackgroundMusic();
  else stopBackgroundMusic();
  return getAudioSettings();
}

export function setMasterVolume(value) {
  const volume = Math.max(0, Math.min(1, Number(value)));
  audioState.settings.volume = Number.isFinite(volume) ? volume : DEFAULT_AUDIO_SETTINGS.volume;
  saveAudioSettings();
  for (const element of audioState.elements.values()) element.volume = element.dataset.music ? musicVolume() : effectsVolume();
  return getAudioSettings();
}

export async function playSound(name) {
  if (!canPlayAudio() || name === "music") return;
  await ensureAudioContext();
  const element = await getAudioElement(name);
  if (element) {
    try {
      element.currentTime = 0;
      element.volume = effectsVolume();
      await element.play();
      return;
    } catch {
      audioState.missingFiles.add(name);
      element.pause();
    }
  }
  playFallbackTone(name);
}

export function startBackgroundMusic() {
  if (!canPlayAudio() || !audioState.settings.musicOn) {
    stopBackgroundMusic();
    return;
  }

  if (audioState.missingFiles.has("music")) {
    return;
  }

  const music = getOrCreateElement("music", true);
  music.volume = musicVolume();
  music.loop = true;
  music.play().catch(() => {
    audioState.missingFiles.add("music");
  });
}

export function stopAllAudio() {
  for (const element of audioState.elements.values()) {
    element.pause();
    element.currentTime = 0;
  }
  if (audioState.context?.state === "running") audioState.context.suspend().catch(() => {});
}

async function ensureAudioContext() {
  if (!audioState.context) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioState.context = new AudioContextClass();
  }
  if (audioState.context?.state === "suspended") await audioState.context.resume();
}

async function getAudioElement(name) {
  if (audioState.missingFiles.has(name)) return null;
  return getOrCreateElement(name, false);
}

function getOrCreateElement(name, isMusic) {
  if (audioState.elements.has(name)) return audioState.elements.get(name);
  const element = new Audio(SOUND_PATHS[name]);
  element.preload = "auto";
  element.volume = isMusic ? musicVolume() : effectsVolume();
  if (isMusic) element.dataset.music = "true";
  audioState.elements.set(name, element);
  return element;
}

function playFallbackTone(name) {
  if (!canPlayAudio()) return;
  if (name === "winner") {
    playToneSequence([
      { frequency: 784, offset: 0, duration: 0.16 },
      { frequency: 988, offset: 0.14, duration: 0.16 },
      { frequency: 1175, offset: 0.28, duration: 0.2 },
      { frequency: 1568, offset: 0.46, duration: 0.34 }
    ]);
    return;
  }

  const tone = FALLBACK_TONES[name];
  const context = audioState.context;
  if (!tone || !context) return;

  playTone({ ...tone, offset: 0 });
}

function playToneSequence(notes) {
  const context = audioState.context;
  if (!context) return;
  notes.forEach((note) => playTone({
    ...note,
    type: "sine",
    gain: 0.16
  }));
}

function playTone(tone) {
  const context = audioState.context;
  if (!tone || !context) return;
  if (audioState.settings.volume <= 0) return;

  const startAt = context.currentTime + (tone.offset || 0);
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = tone.type;
  oscillator.frequency.value = tone.frequency;
  const startGain = Math.max(0.001, tone.gain * audioState.settings.volume);
  gain.gain.value = startGain;
  gain.gain.setValueAtTime(startGain, startAt);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + tone.duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + tone.duration);
}

function stopBackgroundMusic() {
  const music = audioState.elements.get("music");
  if (!music) return;
  music.pause();
  music.currentTime = 0;
}

function canPlayAudio() {
  return audioState.unlocked && audioState.settings.soundOn;
}

function effectsVolume() {
  return 0.55 * audioState.settings.volume;
}

function musicVolume() {
  return 0.16 * audioState.settings.volume;
}

function loadAudioSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem(AUDIO_SETTINGS_KEY) || "{}");
    return {
      ...DEFAULT_AUDIO_SETTINGS,
      volume: typeof stored.volume === "number" ? stored.volume : DEFAULT_AUDIO_SETTINGS.volume,
      soundOn: false,
      musicOn: false
    };
  } catch {
    return { ...DEFAULT_AUDIO_SETTINGS };
  }
}

function saveAudioSettings() {
  localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(audioState.settings));
}
