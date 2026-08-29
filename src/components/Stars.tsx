import { useEffect, useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import "./Stars.css";

interface Star {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  alpha: number;
  phase: number;
  twinkleSpeed: number;
}

interface Glow {
  x: number;
  y: number;
  r: number;
  speed: number;
  alpha: number;
  phase: number;
}

interface StarsProps {
  /** 'intro' is the full layered field; 'ending' is a handful of faint, near-static points. */
  variant?: "intro" | "ending";
  className?: string;
}

/**
 * A restrained, cinematic star field — small warm-white points across a few
 * depth layers (size/speed/brightness scale together), plus a few soft
 * glowing dust particles. Not a starfield demo: sparse, slow, and dim.
 */
export function Stars({ variant = "intro", className = "" }: StarsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let glows: Glow[] = [];
    let frame = 0;
    let running = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const isEnding = variant === "ending";

    function resize() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = width * height;
      const starCount = isEnding
        ? Math.min(14, Math.round(area / 45000))
        : Math.min(90, Math.round(area / 11000));

      stars = Array.from({ length: starCount }, () => {
        const layer = Math.random();
        const depth = layer < 0.55 ? 0 : layer < 0.85 ? 1 : 2;
        const sizeBase = [0.5, 0.9, 1.5][depth];
        const speedBase = [0.012, 0.024, 0.045][depth];
        const alphaBase = [0.25, 0.4, 0.6][depth];
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: sizeBase + Math.random() * sizeBase * 0.6,
          speed: speedBase * (0.7 + Math.random() * 0.6),
          drift: (Math.random() - 0.5) * 0.02,
          alpha: (isEnding ? alphaBase * 0.55 : alphaBase) * (0.7 + Math.random() * 0.3),
          phase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.006 + Math.random() * 0.01,
        };
      });

      const glowCount = isEnding ? 2 : Math.min(7, Math.round(area / 160000));
      glows = Array.from({ length: glowCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 10 + Math.random() * 16,
        speed: 0.01 + Math.random() * 0.015,
        alpha: 0.05 + Math.random() * 0.07,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function tick() {
      if (!running || !ctx) return;
      frame += 1;
      ctx.clearRect(0, 0, width, height);

      for (const star of stars) {
        star.y -= star.speed;
        star.x += star.drift;
        if (star.y < -6) {
          star.y = height + 6;
          star.x = Math.random() * width;
        }
        const twinkle = 0.55 + 0.45 * Math.sin(frame * star.twinkleSpeed + star.phase);
        ctx.beginPath();
        ctx.fillStyle = `rgba(240, 227, 204, ${star.alpha * twinkle})`;
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const glow of glows) {
        glow.y -= glow.speed;
        if (glow.y < -glow.r * 2) {
          glow.y = height + glow.r * 2;
          glow.x = Math.random() * width;
        }
        const pulse = 0.6 + 0.4 * Math.sin(frame * 0.008 + glow.phase);
        const grad = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, glow.r);
        grad.addColorStop(0, `rgba(233, 189, 140, ${glow.alpha * pulse})`);
        grad.addColorStop(1, "rgba(233, 189, 140, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(glow.x, glow.y, glow.r, 0, Math.PI * 2);
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
  }, [reducedMotion, variant]);

  if (reducedMotion) return null;

  return <canvas ref={canvasRef} className={`stars stars--${variant} ${className}`} aria-hidden="true" />;
}
