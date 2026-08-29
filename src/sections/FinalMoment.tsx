import { finalMoment } from "../data/content";
import { useReveal } from "../hooks/useReveal";
import { Stars } from "../components/Stars";
import { FloralAccent } from "../components/FloralAccent";
import "./FinalMoment.css";

export function FinalMoment() {
  const focusRef = useReveal<HTMLDivElement>();
  const birthdayRef = useReveal<HTMLDivElement>();

  return (
    <section className="chapter today final-moment" aria-label="Closing">
      <Stars variant="ending" className="final-moment__stars" />
      <div className="final-moment__glow" aria-hidden="true" />
      <FloralAccent className="final-moment__floral" />

      <div className="final-moment__beat final-moment__beat--focus">
        <div ref={focusRef} className="final-moment__focus reveal container">
          <p className="display final-moment__focus-line">{finalMoment.focusLine}</p>
        </div>
      </div>

      <div className="final-moment__beat final-moment__beat--birthday">
        <div ref={birthdayRef} className="final-moment__birthday reveal container">
          <p className="display final-moment__birthday-line">{finalMoment.birthday}</p>
        </div>
      </div>

      <footer className="final-moment__footer">
        <p className="hand">
          {finalMoment.signature} <span className="final-moment__heart" aria-hidden="true">♥</span>
        </p>
      </footer>
    </section>
  );
}
