"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Slide = {
  src: string;
  alt: string;
};

// Register-sequenced: hands (craft) → atelier (place) → lifestyle (life) → material (quality).
// Swap entries here when the new picks land; keep the registers in this order.
const SLIDES: Slide[] = [
  {
    src: "/atelier/atelier-awl-hand-macro.webp",
    alt: "Weathered artisan hand pressing a brass awl into cognac leather, contrast saddle-stitch in progress",
  },
  {
    src: "/atelier/atelier-wide-light-beams.webp",
    alt: "Wide view of the Marrakech atelier, light shafts cutting through arched windows over two artisans at work",
  },
  {
    src: "/atelier/lifestyle-tennis-court.webp",
    alt: "Cognac leather bag carried courtside, golden afternoon light on the clay",
  },
  {
    src: "/atelier/atelier-cognac-plinth.webp",
    alt: "A cognac leather satchel resting on a travertine plinth inside a stone-arched Marrakech room",
  },
];

const AUTO_ADVANCE_MS = 8000;
const FADE_MS = 1200;

export default function AtelierHero() {
  const [current, setCurrent] = useState(0);
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

  useEffect(() => {
    if (reduceMotion) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [current, reduceMotion]);

  return (
    <section
      className="relative h-[70vh] w-full overflow-hidden bg-[#0e0d0c]"
      aria-roledescription="carousel"
      aria-label="Atelier — slow editorial sequence"
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          aria-hidden={i !== current}
          className="absolute inset-0"
          style={{
            opacity: i === current ? 1 : 0,
            transition: reduceMotion ? "none" : `opacity ${FADE_MS}ms ease-in-out`,
          }}
        >
          <Image
            src={slide.src}
            alt={i === current ? slide.alt : ""}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,7,6,0.4) 0%, rgba(8,7,6,0.15) 40%, rgba(8,7,6,0.75) 100%)",
        }}
      />

      <div className="absolute bottom-12 left-6 md:left-10 right-6">
        <div className="max-w-[1200px] mx-auto">
          <div
            className="mb-4 uppercase"
            style={{
              fontSize: "11px",
              letterSpacing: "0.32em",
              color: "rgba(245,244,241,0.82)",
            }}
          >
            Atelier · Maison Tanneurs
          </div>
          <h1
            className="text-[color:var(--color-cream)]"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(40px, 6vw, 96px)",
              letterSpacing: "-0.02em",
              fontWeight: 800,
              lineHeight: 1.05,
              textShadow: "0 0 6px rgba(0,0,0,0.7)",
            }}
          >
            Hand-stitched in Marrakech.
          </h1>
        </div>
      </div>

      <div
        className="absolute bottom-4 right-6 md:right-10 flex items-center gap-3"
        aria-live="polite"
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`Show slide ${i + 1} of ${SLIDES.length}`}
            aria-current={i === current}
            className="block"
            style={{
              width: i === current ? 18 : 6,
              height: 2,
              background: i === current ? "rgba(245,244,241,0.95)" : "rgba(245,244,241,0.45)",
              border: 0,
              padding: 0,
              cursor: "pointer",
              transition: "width 400ms ease, background 400ms ease",
            }}
          />
        ))}
      </div>
    </section>
  );
}
