import { finalMoment } from "../data/content";
import { useReveal } from "../hooks/useReveal";
import "./FinalMoment.css";

export function FinalMoment() {
  const focusRef = useReveal<HTMLDivElement>();
  const birthdayRef = useReveal<HTMLDivElement>();

  return (
    <section className="chapter today final-moment" aria-label="Closing">
      <div ref={focusRef} className="final-moment__focus reveal container">
        <p className="display final-moment__focus-line">{finalMoment.focusLine}</p>
      </div>

      <div ref={birthdayRef} className="final-moment__birthday reveal container">
        <p className="display final-moment__birthday-line">{finalMoment.birthday}</p>
      </div>

      <footer className="final-moment__footer">
        <p className="hand">
          {finalMoment.signature} <span className="final-moment__heart" aria-hidden="true">♥</span>
        </p>
      </footer>
    </section>
  );
}
