"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  type Variants,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import ParticleButton from "@/components/kokonutui/particle-button";
import { cn } from "@/lib/utils";
import { Receipt } from "./receipt";

// Avance a tirones, como el papel de una impresora térmica
const PRINT_BURSTS = 9;
const printerEase = (t: number) => {
  const step = Math.floor(t * PRINT_BURSTS);
  const local = t * PRINT_BURSTS - step;
  // cada tirón avanza rápido y luego se detiene un instante
  return Math.min(1, (step + Math.min(1, local * 1.6)) / PRINT_BURSTS);
};

const PRINT_MS = 1600;
const PULL_THRESHOLD = 50;

// dir = 1 → siguiente (el actual se arranca y cae), -1 → anterior (el actual vuelve a entrar)
const variants: Variants = {
  enter: { y: "-100%", rotate: 0, opacity: 1 },
  center: {
    y: "0%",
    rotate: 0,
    opacity: 1,
    transition: { y: { duration: PRINT_MS / 1000, ease: printerEase } },
  },
  exit: (dir: number) =>
    dir > 0
      ? {
          y: ["0%", "3%", "70%"],
          rotate: [0, -2, 9],
          opacity: [1, 1, 0],
          transition: { duration: 0.6, times: [0, 0.2, 1], ease: "easeIn" },
        }
      : {
          y: "-100%",
          transition: { duration: 0.6, ease: [0.5, 0, 0.9, 0.6] },
        },
};

export function ReceiptCarousel({ reasons }: { reasons: string[] }) {
  const [[active, dir], setState] = useState<[number, number]>([0, 1]);
  const activeRef = useRef(0);
  const busy = useRef(false);
  const [printing, setPrinting] = useState(true);
  const last = reasons.length - 1;

  // Arrastre vertical con el mouse: tira hacia abajo o empuja hacia la ranura
  const pullY = useMotionValue(0);
  const drag = useRef<{ y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const areaRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (i: number) => {
      const target = Math.max(0, Math.min(last, i));
      if (target === activeRef.current || busy.current) return;
      busy.current = true;
      setTimeout(() => (busy.current = false), 700);
      setState([target, target > activeRef.current ? 1 : -1]);
      setPrinting(true);
      activeRef.current = target;
    },
    [last]
  );

  const next = () => (active >= last ? goTo(0) : goTo(active + 1));

  // Luz de la impresora encendida mientras sale el recibo
  useEffect(() => {
    const t = setTimeout(() => setPrinting(false), PRINT_MS + 600);
    return () => clearTimeout(t);
  }, [active]);

  // Rueda del mouse sobre el recibo (en los extremos deja scrollear la página)
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const delta =
        Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      const target = activeRef.current + (delta > 0 ? 1 : -1);
      if (target < 0 || target > last) return;
      e.preventDefault();
      goTo(target);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [goTo, last]);

  // Flechas del teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(activeRef.current + 1);
      if (e.key === "ArrowLeft") goTo(activeRef.current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag.current = { y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dy = e.clientY - drag.current.y;
    // hacia abajo cede con resistencia; hacia arriba se frena en la ranura
    pullY.set(dy > 0 ? dy * 0.55 : Math.max(-70, dy * 0.4));
  };

  const endDrag = () => {
    if (!drag.current) return;
    drag.current = null;
    setDragging(false);
    const y = pullY.get();
    if (y > PULL_THRESHOLD) goTo(activeRef.current + 1);
    else if (y < -40) goTo(activeRef.current - 1);
    animate(pullY, 0, { type: "spring", stiffness: 400, damping: 30 });
  };

  // Táctil: deslizar a los lados cambia de recibo sin bloquear el scroll vertical
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.current.x;
    const dy = t.clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      goTo(activeRef.current + (dx < 0 ? 1 : -1));
    }
  };

  return (
    <section
      className="relative w-full pt-[26px]"
      aria-roledescription="dispensador de recibos"
    >
      {/* Ranura de la impresora */}
      <div className="pointer-events-none absolute top-0 left-1/2 z-20 h-[52px] w-[min(94vw,560px)] -translate-x-1/2 rounded-2xl bg-[linear-gradient(180deg,#ffffff_0%,#dcdfe4_45%,#b9bdc5_75%,#eef0f3_100%)] shadow-[0_14px_22px_-8px_rgba(40,0,5,0.7),inset_0_2px_0_#fff]">
        <div className="absolute top-1/2 left-1/2 h-3 w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2c2d31] shadow-[inset_0_3px_4px_rgba(0,0,0,0.8)]" />
        <span
          className={cn(
            "absolute top-1/2 right-[3%] size-2 -translate-y-1/2 rounded-full transition-colors",
            printing
              ? "animate-pulse bg-[#7dff9a] shadow-[0_0_8px_#7dff9a]"
              : "bg-[#9aa0a8]"
          )}
        />
      </div>

      {/* Solo se recorta el borde superior (la ranura); lo que cae puede salir por abajo */}
      <div
        ref={areaRef}
        className="relative flex justify-center [clip-path:inset(0_-100vw_-100vh_-100vw)]"
      >
        <motion.div
          style={{ y: pullY }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className={cn(
            "grid pt-[14px] pb-10 select-none",
            dragging ? "cursor-grabbing" : "cursor-grab"
          )}
        >
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={active}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="[grid-area:1/1]"
              style={{ transformOrigin: "50% 0%" }}
            >
              <Receipt
                index={active}
                total={reasons.length}
                text={reasons[active]}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Controles */}
      <div className="relative z-10 mx-auto flex max-w-md flex-col items-center gap-5 px-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            className="grid size-10 place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition hover:bg-white/20 disabled:opacity-30"
            aria-label="Razón anterior"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="flex items-center gap-1.5">
            {reasons.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir a la razón ${i + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === active
                    ? "w-6 bg-[var(--love-gold)]"
                    : "w-2 bg-white/40 hover:bg-white/70"
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            disabled={active === last}
            className="grid size-10 place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition hover:bg-white/20 disabled:opacity-30"
            aria-label="Siguiente razón"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <ParticleButton
          onClick={next}
          className="font-receipt h-11 rounded-full bg-[var(--love-gold)] px-6 text-sm font-bold text-[var(--love-red-deep)] shadow-[0_8px_20px_-6px_rgba(0,0,0,0.5)] hover:bg-[#ffd36b]"
        >
          {active >= last ? "Volver a empezar" : "Imprimir otra razón"}
        </ParticleButton>
      </div>
    </section>
  );
}
