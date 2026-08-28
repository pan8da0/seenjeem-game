import { useState } from "react";
import { intro } from "../data/content";
import { useExperience } from "../context/ExperienceContext";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { Particles } from "./Particles";
import "./Intro.css";

export function Intro() {
  const { enter } = useExperience();
  const reducedMotion = useReducedMotion();
  const [isLeaving, setIsLeaving] = useState(false);

  function handleOpen() {
    if (isLeaving) return;
    enter();
    setIsLeaving(true);
    const delay = reducedMotion ? 50 : 900;
    window.setTimeout(() => {
      document.getElementById("chapter-01")?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
      });
    }, delay);
  }

  return (
    <section className={`intro ${isLeaving ? "is-leaving" : ""}`} aria-label="Introduction">
      <Particles />
      <div className="intro__vignette" aria-hidden="true" />
      <div className="intro__content">
        <p className="intro__greeting display">{intro.greeting}</p>
        <div className="intro__lines">
          {intro.lines.map((line, i) => (
            <p key={i} className="intro__line display" style={{ "--i": i } as React.CSSProperties}>
              {line}
            </p>
          ))}
        </div>
        <p className="intro__signoff display">{intro.signOff}</p>

        <button type="button" className="intro__cta" onClick={handleOpen}>
          {intro.cta}
        </button>
      </div>
    </section>
  );
}
