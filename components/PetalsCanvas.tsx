"use client";

import React, { useEffect, useRef } from "react";

interface PetalsCanvasProps {
  started: boolean;
}

interface Petal {
  x: number;
  y: number;
  s: number;
  vy: number;
  vx: number;
  sway: number;
  freq: number;
  ph: number;
  rot: number;
  vr: number;
  ft: number;
  fp: number;
  color: string;
  a: number;
  t: number;
  burst: boolean;
}

const COLORS = [
  "#ffc7dd",
  "#ffa6cb",
  "#ff86b8",
  "#ffb8d3",
  "#ff6aa6",
  "#ffd9e8",
];

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export function PetalsCanvas({ started }: PetalsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = 0;
    let H = 0;
    let DPR = 1;

    const resize = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const petals: Petal[] = [];
    const isMobile = window.innerWidth < 600;
    let target = isMobile ? 14 : 22;
    const MAX = isMobile ? 55 : 100;

    const spawn = (x?: number, y?: number, burst = false) => {
      const size = rand(8, 17) * (W < 600 ? 0.85 : 1.1);
      petals.push({
        x: x ?? rand(-20, W + 20),
        y: y ?? rand(-40, -10),
        s: size,
        vy: burst ? rand(-90, 60) : rand(28, 70),
        vx: burst ? rand(-120, 120) : rand(-12, 12),
        sway: rand(14, 38),
        freq: rand(0.7, 1.6),
        ph: rand(0, Math.PI * 2),
        rot: rand(0, Math.PI * 2),
        vr: rand(-1.4, 1.4),
        ft: rand(1.2, 2.6),
        fp: rand(0, Math.PI * 2),
        color: COLORS[(Math.random() * COLORS.length) | 0],
        a: rand(0.75, 1),
        t: 0,
        burst,
      });
    };

    const drawPetal = (p: Petal) => {
      const s = p.s;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, Math.cos(p.t * p.ft + p.fp));
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.95, -s * 0.75, s * 0.75, s * 0.6, 0, s);
      ctx.bezierCurveTo(-s * 0.75, s * 0.6, -s * 0.95, -s * 0.75, 0, -s);
      ctx.fill();

      // Highlight kilau
      ctx.globalAlpha = p.a * 0.35;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.ellipse(-s * 0.15, -s * 0.25, s * 0.18, s * 0.45, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, W, H);

      if (petals.length < target && Math.random() < dt * target * 0.35) {
        spawn();
      }

      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        p.t += dt;
        if (p.burst) {
          p.vy += 110 * dt;
          p.vx *= 1 - dt * 0.9;
          if (p.vy > 70) {
            p.vy = rand(35, 70);
            p.burst = false;
          }
        }
        p.x += (p.vx + Math.sin(p.t * p.freq + p.ph) * p.sway) * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;

        if (p.y > H + 30 || p.x < -60 || p.x > W + 60) {
          petals.splice(i, 1);
          continue;
        }
        drawPetal(p);
      }

      animId = requestAnimationFrame(frame);
    };

    animId = requestAnimationFrame(frame);

    // Initial burst & target scaling when started
    let timeout1: NodeJS.Timeout | undefined;
    let timeout2: NodeJS.Timeout | undefined;

    if (started) {
      const burstCount = W < 600 ? 28 : 45;
      for (let i = 0; i < burstCount; i++) {
        spawn(rand(0, W), rand(-60, H * 0.35), true);
      }

      timeout1 = setTimeout(() => {
        target = MAX * 0.55;
      }, 2200);

      timeout2 = setTimeout(() => {
        target = MAX;
      }, 5200);
    }

    // Touch / pointer spawn
    const handlePointerDown = (e: PointerEvent) => {
      if (!started) return;
      const targetElement = e.target as HTMLElement | null;
      if (targetElement?.closest("button")) return;

      for (let i = 0; i < 8; i++) {
        spawn(e.clientX + rand(-10, 10), e.clientY + rand(-10, 10), true);
      }
      if (petals.length > MAX + 40) {
        petals.splice(0, petals.length - MAX - 40);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", handlePointerDown);
      if (timeout1) clearTimeout(timeout1);
      if (timeout2) clearTimeout(timeout2);
    };
  }, [started]);

  return <canvas id="petals" ref={canvasRef} aria-hidden="true" />;
}
