"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

// "Le Fil" — the house signature. A saddle-stitch seam rendered as short
// slanted thread segments. When `animate`, the stitches sew themselves in
// left-to-right on scroll-into-view (each thread pulled by hand). Used as the
// card hairline, the hover underline, and section seams. No boxes — a line.
type Props = {
  /** seam length in px (numeric) — defaults to filling the parent at 100% via viewBox scaling */
  width?: number;
  /** stitch color (CSS color or var()) */
  color?: string;
  /** thread weight */
  weight?: number;
  /** draw-in on scroll into view */
  animate?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

const PITCH = 13;
const LEN = 9;
const SLANT = 3.2;
const H = 14;

export default function StitchLine({
  width = 240,
  color = "var(--color-ink)",
  weight = 1.4,
  animate = false,
  className,
  style,
}: Props) {
  const ref = useRef<SVGSVGElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduce = useReducedMotion();

  const n = Math.max(2, Math.floor(width / PITCH));
  const start = (width - (n - 1) * PITCH) / 2;
  const cy = H / 2;
  const segments = Array.from({ length: n }, (_, i) => start + i * PITCH);
  const shouldAnimate = animate && !reduce;
  const show = shouldAnimate ? inView : true;

  return (
    <svg
      ref={ref}
      width={width}
      height={H}
      viewBox={`0 0 ${width} ${H}`}
      className={className}
      style={style}
      aria-hidden
      role="presentation"
    >
      {segments.map((x, i) => (
        <motion.line
          key={i}
          x1={x - LEN / 2}
          y1={cy + SLANT}
          x2={x + LEN / 2}
          y2={cy - SLANT}
          stroke={color}
          strokeWidth={weight}
          strokeLinecap="round"
          initial={shouldAnimate ? { opacity: 0, pathLength: 0 } : false}
          animate={show ? { opacity: 0.85, pathLength: 1 } : { opacity: 0 }}
          transition={
            shouldAnimate
              ? { duration: 0.28, delay: 0.18 + i * 0.024, ease: "easeOut" }
              : { duration: 0 }
          }
        />
      ))}
    </svg>
  );
}
