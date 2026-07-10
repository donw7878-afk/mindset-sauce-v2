"use client";

import { useEffect, useRef } from "react";

interface Speck {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  phase: number;
  speed: number;
}

/**
 * Gold dust drifting in a dark room. Canvas 2D — cheap enough to run
 * everywhere, dense on desktop, sparse on mobile (spec §16).
 */
export default function Particles({ density = 1 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let specks: Speck[] = [];
    let raf = 0;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
      const isMobile = window.innerWidth < 640;
      const count = Math.round(
        (width * height) / (isMobile ? 38000 : 16000) * density
      );
      specks = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.4 + Math.random() * 1.4,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -0.04 - Math.random() * 0.14,
        phase: Math.random() * Math.PI * 2,
        speed: 0.004 + Math.random() * 0.008,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const s of specks) {
        s.x += s.vx;
        s.y += s.vy;
        s.phase += s.speed;
        if (s.y < -4) {
          s.y = height + 4;
          s.x = Math.random() * width;
        }
        if (s.x < -4) s.x = width + 4;
        if (s.x > width + 4) s.x = -4;
        const alpha = 0.12 + 0.28 * (0.5 + 0.5 * Math.sin(s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 213, 160, ${alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    build();
    draw();
    const onResize = () => build();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [density]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
