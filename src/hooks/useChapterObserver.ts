import { useEffect, useRef } from "react";
import { useExperience } from "../context/ExperienceContext";

/**
 * Registers a chapter section so the progress indicator (and any future
 * chapter-aware behaviour) knows which chapter is currently centred in the
 * viewport.
 */
export function useChapterObserver<T extends HTMLElement>(chapterNumber: string) {
  const ref = useRef<T | null>(null);
  const { setActiveChapter } = useExperience();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActiveChapter(chapterNumber);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [chapterNumber, setActiveChapter]);

  return ref;
}
