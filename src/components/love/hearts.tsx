"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { cn } from "@/lib/utils";

// Corazón en una caja de 100 x 90
export const HEART_PATH =
  "M50 24 C50 10 38 0 25 0 C10 0 0 12 0 27 C0 52 30 70 50 88 C70 70 100 52 100 27 C100 12 90 0 75 0 C62 0 50 10 50 24 Z";

/** Relicario plateado abierto con dos fotos (parte superior de la página). */
export function PhotoLocket({
  left,
  right,
  className,
}: {
  left: string;
  right: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");

  const half = (src: string, side: "l" | "r") => (
    <g>
      <clipPath id={`${id}-clip-${side}`}>
        <path d={HEART_PATH} transform="translate(9 9) scale(0.82)" />
      </clipPath>
      {/* marco exterior plateado */}
      <path
        d={HEART_PATH}
        fill={`url(#${id}-silver)`}
        stroke="#8c8f96"
        strokeWidth="1"
      />
      <path
        d={HEART_PATH}
        transform="translate(6 6) scale(0.88)"
        fill="#3a3b40"
      />
      <image
        href={src}
        x="0"
        y="0"
        width="100"
        height="90"
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${id}-clip-${side})`}
      />
      {/* brillo */}
      <path
        d="M16 12 C24 6 34 7 38 12"
        fill="none"
        stroke="white"
        strokeOpacity="0.8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </g>
  );

  return (
    <motion.svg
      viewBox="0 0 230 150"
      className={cn("drop-shadow-[0_12px_18px_rgba(40,0,5,0.55)]", className)}
      initial={{ rotate: -4 }}
      animate={{ rotate: [-4, 3, -4] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "50% 0%" }}
    >
      <defs>
        <linearGradient id={`${id}-silver`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor="#c9ccd3" />
          <stop offset="0.6" stopColor="#f4f5f7" />
          <stop offset="1" stopColor="#8e929b" />
        </linearGradient>
      </defs>
      {/* argolla */}
      <rect
        x="104"
        y="0"
        width="22"
        height="18"
        rx="7"
        fill="none"
        stroke={`url(#${id}-silver)`}
        strokeWidth="5"
      />
      <g transform="translate(8 26) rotate(-10 55 45) scale(1.02)">
        {half(left, "l")}
      </g>
      <g transform="translate(120 26) rotate(10 45 45) scale(1.02)">
        {half(right, "r")}
      </g>
      {/* bisagra */}
      <circle cx="115" cy="38" r="5" fill={`url(#${id}-silver)`} stroke="#8c8f96" />
    </motion.svg>
  );
}

/** Corazón de caramelo rosa con una inicial, flotando. */
export function CandyHeart({
  letter,
  className,
  delay = 0,
  rotate = 0,
}: {
  letter: string;
  className?: string;
  delay?: number;
  rotate?: number;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <motion.svg
      viewBox="-6 -6 112 102"
      className={cn(
        "pointer-events-none drop-shadow-[0_10px_14px_rgba(80,0,20,0.35)]",
        className
      )}
      initial={{ y: 0, rotate }}
      animate={{ y: [0, -12, 0], rotate: [rotate, rotate + 6, rotate] }}
      transition={{ duration: 4.5, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <radialGradient id={`${id}-candy`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffe3ea" />
          <stop offset="0.55" stopColor="#f7b6c4" />
          <stop offset="1" stopColor="#e88aa0" />
        </radialGradient>
      </defs>
      <path d={HEART_PATH} fill={`url(#${id}-candy)`} />
      <path
        d={HEART_PATH}
        transform="translate(10 9) scale(0.8)"
        fill="none"
        stroke="#e07e95"
        strokeWidth="2.5"
        strokeOpacity="0.6"
      />
      <text
        x="50"
        y="54"
        textAnchor="middle"
        fontSize="34"
        fill="#c2344f"
        style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic" }}
      >
        {letter}
      </text>
    </motion.svg>
  );
}

/** Ilustración de dos corazones dorados con moño (dentro de cada recibo). */
export function GoldLocket({
  left,
  right,
  className,
}: {
  left: string;
  right: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const heart = (x: number, rot: number, letter: string) => (
    <g transform={`translate(${x} 22) rotate(${rot} 50 45)`}>
      <path d={HEART_PATH} fill={`url(#${id}-gold)`} stroke="#8a5a1c" strokeWidth="1.5" />
      <path
        d={HEART_PATH}
        transform="translate(9 8) scale(0.82)"
        fill="#fdf1e4"
        stroke="#b27c33"
        strokeWidth="1.5"
      />
      <text
        x="50"
        y="56"
        textAnchor="middle"
        fontSize="34"
        fill="#b3243a"
        style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic" }}
      >
        {letter}
      </text>
    </g>
  );

  return (
    <svg viewBox="0 0 220 120" className={className}>
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f7dca0" />
          <stop offset="0.5" stopColor="#d9a653" />
          <stop offset="1" stopColor="#a8732d" />
        </linearGradient>
      </defs>
      {heart(8, -8, left)}
      {heart(108, 8, right)}
      {/* moño */}
      <g
        fill="#f6c9cf"
        stroke="#c98992"
        strokeWidth="1.5"
        strokeLinejoin="round"
      >
        <path d="M40 22 C18 4 6 18 22 30 C30 36 38 30 40 22 Z" />
        <path d="M40 22 C52 0 72 8 60 24 C54 32 44 30 40 22 Z" />
        <path d="M40 22 C34 40 30 60 20 76" fill="none" />
        <path d="M40 22 C48 44 56 58 70 70" fill="none" />
        <circle cx="40" cy="22" r="5" />
      </g>
    </svg>
  );
}
