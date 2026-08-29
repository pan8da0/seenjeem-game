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
        className={`final-letter__trigger hand ${open ? "is-open" : ""}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <svg className="final-letter__icon" viewBox="0 0 32 24" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="30" height="22" rx="2" stroke="currentColor" strokeWidth="1.3" />
          <path d="M2 2.5 L16 14 L30 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>{chapter05Today.oneLastThing}</span>
      </button>

      <div
        id={panelId}
        className={`final-letter__panel ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="final-letter__panel-inner">
          <div className="final-letter__envelope">
            <div className="final-letter__flap">
              <span className="final-letter__seal" aria-hidden="true">
                🤍
              </span>
            </div>
            <div className="final-letter__page">
              <div className="texture-paper final-letter__page-texture" aria-hidden="true" />
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
