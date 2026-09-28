"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Dust = { x: number; y: number; r: number; phase: number; speed: number };
type Sparkle = {
  x: number;
  y: number;
  size: number;
  phase: number;
  speed: number;
  rot: number;
  gold: boolean;
};
type Wish = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  hue: "gold" | "pink";
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** Destello de 4 puntas estilo Genshin (brillo + cruz alargada). */
function drawSparkle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  alpha: number,
  rot: number,
  gold: boolean
) {
  const core = gold ? "255, 236, 180" : "255, 240, 245";
  const glow = gold ? "255, 196, 90" : "255, 170, 200";
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);

  const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.6);
  halo.addColorStop(0, `rgba(${glow}, ${0.45 * alpha})`);
  halo.addColorStop(1, `rgba(${glow}, 0)`);
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(0, 0, size * 1.6, 0, Math.PI * 2);
  ctx.fill();

  // Estrella de 4 puntas con lados cóncavos; la vertical más larga
  const long = size * 1.6;
  const short = size;
  const w = size * 0.14;
  ctx.fillStyle = `rgba(${core}, ${alpha})`;
  ctx.shadowColor = `rgba(${glow}, ${alpha})`;
  ctx.shadowBlur = size * 0.8;
  ctx.beginPath();
  ctx.moveTo(0, -long);
  ctx.quadraticCurveTo(w, -w, short, 0);
  ctx.quadraticCurveTo(w, w, 0, long);
  ctx.quadraticCurveTo(-w, w, -short, 0);
  ctx.quadraticCurveTo(-w, -w, 0, -long);
  ctx.fill();
  ctx.restore();
}

export function StarField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dust: Dust[] = [];
    let sparkles: Sparkle[] = [];
    const wishes: Wish[] = [];
    let raf = 0;
    let nextWish = performance.now() + 1500;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = (w * h) / 10000;
      dust = Array.from({ length: Math.round(area * 1.6) }, () => ({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(0.4, 1.4),
        phase: rand(0, Math.PI * 2),
        speed: rand(0.6, 2),
      }));
      sparkles = Array.from({ length: Math.round(area * 0.22) + 6 }, () => ({
        x: rand(0, w),
        y: rand(0, h),
        size: rand(4, 11),
        phase: rand(0, Math.PI * 2),
        speed: rand(0.5, 1.4),
        rot: rand(-0.15, 0.15),
        gold: Math.random() < 0.6,
      }));
    };

    const spawnWish = () => {
      const fromLeft = Math.random() < 0.5;
      const speed = rand(7, 11);
      const angle = rand(0.35, 0.6); // hacia abajo en diagonal
      wishes.push({
        x: fromLeft ? rand(-100, w * 0.4) : rand(w * 0.6, w + 100),
        y: rand(-60, h * 0.35),
        vx: (fromLeft ? 1 : -1) * Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        max: rand(70, 110),
        hue: Math.random() < 0.75 ? "gold" : "pink",
      });
    };

    const frame = (now: number) => {
      const t = now / 1000;
      ctx.clearRect(0, 0, w, h);

      // polvo de estrellas
      for (const d of dust) {
        const a = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t * d.speed + d.phase));
        ctx.fillStyle = `rgba(255, 235, 220, ${a})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // destellos que aparecen, brillan y se apagan
      for (const s of sparkles) {
        const k = Math.sin(t * s.speed + s.phase);
        if (k <= 0) continue;
        const a = Math.pow(k, 3);
        drawSparkle(ctx, s.x, s.y + Math.sin(t * 0.4 + s.phase) * 3, s.size * (0.4 + 0.6 * a), a, s.rot, s.gold);
      }

      // "deseos": estrellas fugaces con estela
      if (!reduced && now > nextWish) {
        spawnWish();
        nextWish = now + rand(2200, 5000);
      }
      for (let i = wishes.length - 1; i >= 0; i--) {
        const m = wishes[i];
        m.life++;
        m.x += m.vx;
        m.y += m.vy;
        const fade = Math.sin((m.life / m.max) * Math.PI);
        const tail = 16;
        const color = m.hue === "gold" ? "255, 205, 110" : "255, 160, 200";
        const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * tail, m.y - m.vy * tail);
        grad.addColorStop(0, `rgba(255, 250, 235, ${fade})`);
        grad.addColorStop(0.25, `rgba(${color}, ${0.7 * fade})`);
        grad.addColorStop(1, `rgba(${color}, 0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * tail, m.y - m.vy * tail);
        ctx.stroke();
        drawSparkle(ctx, m.x, m.y, 7, fade, 0, m.hue === "gold");
        if (m.life >= m.max) wishes.splice(i, 1);
      }

      if (!reduced) raf = requestAnimationFrame(frame);
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      // sin animación: se dibuja una sola vez, estático
      if (reduced) frame(performance.now());
    });
    ro.observe(canvas);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
    />
  );
}
