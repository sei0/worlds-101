type SoundType = "flip" | "reveal" | "jackpot";

const audioCache: Map<SoundType, HTMLAudioElement> = new Map();

const SOUND_URLS: Record<SoundType, string> = {
  flip: "/sounds/flip.mp3",
  reveal: "/sounds/reveal.mp3",
  jackpot: "/sounds/jackpot.mp3",
};

function getAudio(type: SoundType): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;

  let audio = audioCache.get(type);
  if (!audio) {
    audio = new Audio(SOUND_URLS[type]);
    audio.preload = "auto";
    audioCache.set(type, audio);
  }
  return audio;
}

export function preloadSounds(): void {
  if (typeof window === "undefined") return;
  Object.keys(SOUND_URLS).forEach((type) => getAudio(type as SoundType));
}

export function playSound(type: SoundType, volume = 0.3): void {
  const audio = getAudio(type);
  if (!audio) return;

  audio.volume = Math.min(1, Math.max(0, volume));
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

export function playCardFlip(): void {
  playSound("flip", 0.2);
}

export function playCardReveal(grade: string): void {
  if (grade === "DEMON_KING" || grade === "LEGENDARY") {
    playSound("jackpot", 0.4);
  } else {
    playSound("reveal", 0.25);
  }
}
