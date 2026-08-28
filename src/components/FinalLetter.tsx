import { useId, useState } from "react";
import { chapter05Today } from "../data/content";
import "./FinalLetter.css";

export function FinalLetter() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="final-letter">
      <button
        type="button"
        className="final-letter__trigger hand"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {chapter05Today.oneLastThing}
      </button>

      <div
        id={panelId}
        className={`final-letter__panel ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="final-letter__panel-inner">
          <div className="final-letter__envelope">
            <div className="final-letter__flap" />
            <div className="final-letter__page">
              {chapter05Today.letter.map((line, i) => (
                <p key={i} className="display final-letter__line">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
