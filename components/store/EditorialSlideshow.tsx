"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Slide = {
  src: string;
  alt: string;
  caption: [string, string];
};

const SLIDES: Slide[] = [
  {
    src: "/atelier/atelier-wide-light-beams.webp",
    alt: "Marrakech atelier — light shafts through arched windows, two artisans at work",
    caption: ["THE MAISON", "IN MARRAKECH"],
  },
  {
    src: "/brand/editorial/atelier-cutting-table.webp",
    alt: "Artisan cutting cognac leather at a wooden workbench inside a Moroccan-arched atelier",
    caption: ["CUT BY HAND", "FINISHED ON THE BENCH"],
  },
  {
    src: "/atelier/atelier-hides-stack.webp",
    alt: "Stacked full-grain hides in cognac and caramel tones, with artisans at work behind",
    caption: ["FULL-GRAIN LEATHER", "QUIETLY PROVEN"],
  },
  {
    src: "/brand/editorial/atelier-hands-stitching.webp",
    alt: "Weathered hands hand-finishing a cognac leather piece with a brass awl and waxed thread",
    caption: ["BESPOKE WORK", "BY APPOINTMENT"],
  },
  {
    src: "/atelier/atelier-cognac-plinth.webp",
    alt: "A cognac leather satchel on a travertine plinth inside a Marrakech stone-arched room",
    caption: ["FROM ATELIER", "TO JOURNEY"],
  },
];

const AUTO_ADVANCE_MS = 5600;
const FADE_MS = 700;

/**
 * Editorial slideshow — large stage, sharp edges, minimal captions, thin
 * arrows, small counter. Smooth opacity-only transitions. Auto-advances
 * unless the user takes manual control; pauses entirely under
 * prefers-reduced-motion (and disables fade so the first slide shows
 * statically).
 */
export default function EditorialSlideshow() {
  const [current, setCurrent] = useState(0);
  const [manualOverride, setManualOverride] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Auto-advance unless reduce-motion is on or the user has taken control.
  useEffect(() => {
    if (reduceMotion || manualOverride) return;
    timerRef.current = window.setTimeout(() => {
      setCurrent((i) => (i + 1) % SLIDES.length);
    }, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [current, reduceMotion, manualOverride]);

  const next = useCallback(() => {
    setManualOverride(true);
    setCurrent((i) => (i + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setManualOverride(true);
    setCurrent((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Keyboard support: ← / → when the slideshow has focus.
  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    },
    [next, prev],
  );

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Maison Tanneurs in Marrakech"
      tabIndex={0}
      onKeyDown={handleKey}
      className="relative w-full overflow-hidden bg-[var(--color-paper)] focus:outline-none"
    >
      <div className="relative aspect-[16/9] md:aspect-[21/9] w-full">
        {SLIDES.map((slide, i) => {
          const active = i === current;
          return (
            <div
              key={slide.src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${SLIDES.length}`}
              aria-hidden={!active}
              className="absolute inset-0"
              style={{
                opacity: active ? 1 : 0,
                transition: reduceMotion
                  ? "none"
                  : `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
              }}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(8,7,6,0) 0%, rgba(8,7,6,0) 55%, rgba(8,7,6,0.55) 100%)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 px-6 md:px-12 pb-10 md:pb-14">
                <div className="mx-auto max-w-[1400px] text-white">
                  <p
                    className="tech-meta opacity-70"
                    style={{ letterSpacing: "0.32em" }}
                  >
                    Plate · {String(i + 1).padStart(2, "0")} /{" "}
                    {String(SLIDES.length).padStart(2, "0")}
                  </p>
                  <h3
                    className="mt-3 text-white"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 500,
                      letterSpacing: "0.22em",
                      fontSize: "clamp(18px, 2.2vw, 28px)",
                      lineHeight: 1.18,
                    }}
                  >
                    {slide.caption[0]}
                    <br />
                    {slide.caption[1]}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Thin arrow controls */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 inline-flex h-11 w-11 items-center justify-center text-white/80 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-white/70"
        style={{ background: "transparent" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          aria-hidden
        >
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 inline-flex h-11 w-11 items-center justify-center text-white/80 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-white/70"
        style={{ background: "transparent" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          aria-hidden
        >
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Counter — top-right */}
      <div
        aria-hidden
        className="absolute right-4 md:right-8 top-4 md:top-6 z-10 tech-meta text-white/80"
        style={{ letterSpacing: "0.24em" }}
      >
        {String(current + 1).padStart(2, "0")} /{" "}
        {String(SLIDES.length).padStart(2, "0")}
      </div>

      <span aria-live="polite" className="sr-only">
        Slide {current + 1} of {SLIDES.length}: {SLIDES[current]!.caption[0]} {SLIDES[current]!.caption[1]}
      </span>
    </section>
  );
}
