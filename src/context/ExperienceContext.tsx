import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { music } from "../data/music";

interface ExperienceState {
  hasEntered: boolean;
  enter: () => void;
  isPlaying: boolean;
  toggleMusic: () => void;
  fadeVolumeTo: (target: number, durationMs?: number) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  activeChapter: string | null;
  setActiveChapter: (chapter: string | null) => void;
}

const ExperienceContext = createContext<ExperienceState | null>(null);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [hasEntered, setHasEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeChapter, setActiveChapter] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeHandle = useRef<number | null>(null);

  const fadeVolumeTo = useCallback((target: number, durationMs = 1500) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeHandle.current) cancelAnimationFrame(fadeHandle.current);

    const start = audio.volume;
    const startTime = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / durationMs);
      audio.volume = start + (target - start) * t;
      if (t < 1) {
        fadeHandle.current = requestAnimationFrame(step);
      }
    };
    fadeHandle.current = requestAnimationFrame(step);
  }, []);

  const enter = useCallback(() => {
    setHasEntered(true);
    const audio = audioRef.current;
    if (audio && music.available) {
      audio.volume = music.volume;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, []);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      hasEntered,
      enter,
      isPlaying,
      toggleMusic,
      fadeVolumeTo,
      audioRef,
      activeChapter,
      setActiveChapter,
    }),
    [hasEntered, enter, isPlaying, toggleMusic, fadeVolumeTo, activeChapter],
  );

  return (
    <ExperienceContext.Provider value={value}>
      {children}
      {music.available && <audio ref={audioRef} src={music.src} loop preload="none" />}
    </ExperienceContext.Provider>
  );
}

export function useExperience(): ExperienceState {
  const ctx = useContext(ExperienceContext);
  if (!ctx) throw new Error("useExperience must be used within ExperienceProvider");
  return ctx;
}
