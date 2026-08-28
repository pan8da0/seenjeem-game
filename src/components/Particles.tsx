import { useEffect, useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface Dot {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  alpha: number;
  phase: number;
}

/** Very slow, very sparse warm dust — not a starfield. */
export function Particles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dots: Dot[] = [];
    let frame = 0;
    let running = true;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round((width * height) / 26000);
      dots = Array.from({ length: Math.min(count, 46) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.6 + Math.random() * 1.4,
        speed: 0.06 + Math.random() * 0.12,
        drift: (Math.random() - 0.5) * 0.05,
        alpha: 0.15 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function tick() {
      if (!running || !ctx) return;
      frame += 1;
      ctx.clearRect(0, 0, width, height);
      for (const dot of dots) {
        dot.y -= dot.speed;
        dot.x += dot.drift;
        if (dot.y < -10) {
          dot.y = height + 10;
          dot.x = Math.random() * width;
        }
        const twinkle = 0.6 + 0.4 * Math.sin(frame * 0.01 + dot.phase);
        ctx.beginPath();
        ctx.fillStyle = `rgba(233, 216, 190, ${dot.alpha * twinkle})`;
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(tick);
    }

    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running) requestAnimationFrame(tick);
    };

    resize();
    requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return <canvas ref={canvasRef} className="particles" aria-hidden="true" />;
}
