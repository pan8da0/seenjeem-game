import { useExperience } from "../context/ExperienceContext";
import { totalChapters } from "../data/content";
import "./ProgressIndicator.css";

export function ProgressIndicator() {
  const { hasEntered, activeChapter } = useExperience();

  if (!hasEntered || !activeChapter) return null;

  return (
    <div className="progress-indicator" aria-hidden="true">
      {activeChapter} / 0{totalChapters}
    </div>
  );
}
