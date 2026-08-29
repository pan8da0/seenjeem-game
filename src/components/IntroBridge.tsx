import { Stars } from "./Stars";
import "./IntroBridge.css";

/** Blends the intro's night sky into Chaos's warm paper world. */
export function IntroBridge() {
  return (
    <div className="intro-bridge" aria-hidden="true">
      <Stars variant="ending" className="intro-bridge__stars" />
      <div className="texture-paper intro-bridge__paper" />
    </div>
  );
}
