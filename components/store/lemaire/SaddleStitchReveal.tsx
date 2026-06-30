"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

type SaddleStitchRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  divider?: boolean;
  stitch?: boolean;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export default function SaddleStitchReveal({
  children,
  className = "",
  delay = 0,
  divider = true,
  stitch = true,
}: SaddleStitchRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -12% 0px" });
  const reduced = useReducedMotion();

  const animate = inView && !reduced;

  return (
    <motion.div
      ref={ref}
      className={"relative " + className}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={
        reduced
          ? { opacity: 1, y: 0 }
          : animate
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 18 }
      }
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}

      {divider !== false && (
        <div
          className="absolute inset-x-0 bottom-0"
          aria-hidden="true"
          style={{ pointerEvents: "none" }}
        >
          {/* Resting 1px hairline */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-px bg-[#1C1A17]/12 origin-left"
            initial={reduced ? false : { scaleX: 0, opacity: 0 }}
            animate={
              reduced
                ? { scaleX: 1, opacity: 1 }
                : animate
                  ? { scaleX: 1, opacity: 1 }
                  : { scaleX: 0, opacity: 0 }
            }
            transition={{ duration: 0.5, ease: EASE, delay: delay + 1.05 }}
          />

          {/* Waxed-linen saddle-stitch draw left -> right, then fades */}
          {stitch !== false && !reduced && (
            <div className="absolute inset-x-0 bottom-0 overflow-hidden">
              <motion.div
                className="w-full origin-left"
                style={{
                  height: 2,
                  background:
                    "repeating-linear-gradient(90deg,#8a7350 0 6px, transparent 6px 11px)",
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={
                  animate
                    ? { scaleX: 1, opacity: [0, 1, 1, 0] }
                    : { scaleX: 0, opacity: 0 }
                }
                transition={{ duration: 1.2, ease: EASE, delay }}
              />
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
