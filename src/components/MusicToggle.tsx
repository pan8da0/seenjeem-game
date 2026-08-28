import { useExperience } from "../context/ExperienceContext";
import { music } from "../data/music";
import "./MusicToggle.css";

export function MusicToggle() {
  const { hasEntered, isPlaying, toggleMusic } = useExperience();

  if (!music.available || !hasEntered) return null;

  return (
    <button
      type="button"
      className="music-toggle"
      onClick={toggleMusic}
      aria-label={isPlaying ? "Pause background music" : "Play background music"}
      aria-pressed={isPlaying}
    >
      <span aria-hidden="true" className={`music-toggle__note ${isPlaying ? "is-playing" : ""}`}>
        ♪
      </span>
    </button>
  );
}
