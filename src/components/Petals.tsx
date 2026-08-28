import { useReducedMotion } from "../hooks/useReducedMotion";
import "./Petals.css";

const PETALS = [
  { left: "8%", delay: "0s", duration: "22s", size: 10 },
  { left: "22%", delay: "-6s", duration: "26s", size: 7 },
  { left: "48%", delay: "-12s", duration: "24s", size: 9 },
  { left: "68%", delay: "-3s", duration: "28s", size: 6 },
  { left: "84%", delay: "-9s", duration: "23s", size: 8 },
];

/** A handful of very slow, very low-opacity petals. Punctuation, not weather. */
export function Petals() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  return (
    <div className="petals" aria-hidden="true">
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="petals__petal"
          style={
            {
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
