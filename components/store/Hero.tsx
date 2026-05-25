"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Slide = { src: string; alt: string };

// HD hero rotation — warm-first sequence. Slide 1 must be welcoming, not
// cold. Blue-hour and night frames demoted out of position 0 per Polène
// guidance (warm light, easy on the eyes, no scrim wars).
const SLIDES: Slide[] = [
  {
    src: "/brand/hero/home-hero-1-arches.webp",
    alt: "Cognac duffle on a sunlit Marrakech stone plaza beneath carved arches at sunrise",
  },
  {
    src: "/brand/hero/home-hero-3-woman-arches.webp",
    alt: "Model with cognac duffle in a Marrakech arched gallery at golden hour",
  },
  {
    src: "/brand/hero/home-hero-colonnade.webp",
    alt: "Model walking through a sun-washed limestone colonnade",
  },
  {
    src: "/brand/hero/home-hero-5-courtyard-walk.webp",
    alt: "Model walking through a riad courtyard at warm late-afternoon light",
  },
  {
    src: "/brand/hero/home-hero-cedar-forest.webp",
    alt: "Cognac duffle in the Atlas cedar forest at golden hour",
  },
];

const ROTATE_MS = 6500;

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % SLIDES.length),
      ROTATE_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      id="top"
      className="relative w-full min-h-[100svh] overflow-hidden"
      style={{ background: "#0f0f0f", color: "#ffffff" }}
      aria-label="Engineered in Marrakech"
    >
      {/* Photo stack */}
      <div className="absolute inset-0">
        {SLIDES.map((s, i) => (
          <div
            key={s.src}
            className="absolute inset-0 transition-opacity"
            style={{
              opacity: i === active ? 1 : 0,
              transitionDuration: "1200ms",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            aria-hidden={i !== active}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "center 46%" }}
            />
          </div>
        ))}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.20) 38%, rgba(0,0,0,0) 65%)",
          }}
        />
      </div>

      {/* Top meta strip */}
      <div
        className="relative z-10 flex items-center justify-between px-6 pt-6"
        style={{ color: "rgba(255,255,255,0.85)" }}
      >
        <span className="tech-meta">§01 — Cinematic</span>
        <span className="tech-meta hidden md:inline">
          N 31°37′ W 7°59′ · Marrakech
        </span>
        <span className="tech-meta">Edition 04 / 2026</span>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-6 border-l border-white/10" />
      <div className="pointer-events-none absolute inset-y-0 right-6 border-l border-white/10" />

      {/* Headline block */}
      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-6 pb-12">
        <div className="max-w-[1400px]">
          <div
            className="mb-6 flex items-center gap-4"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            <span className="h-px w-10 bg-white/40" />
            <span className="tech-meta">Spring Atelier — Vol. 04</span>
          </div>

          <h1
            className="display-xxl"
            style={{
              color: "#ffffff",
              fontSize: "clamp(56px, 11.5vw, 200px)",
            }}
          >
            Engineered
            <br />
            in&nbsp;Marrakech
            <span style={{ color: "rgba(255,255,255,0.42)" }}>.</span>
          </h1>

          <p
            className="mt-8 leading-relaxed"
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "16px",
              letterSpacing: "-0.005em",
              maxWidth: "52ch",
            }}
          >
            Hand-cut and saddle-stitched in a small Marrakech atelier. Numbered, signed, shipped worldwide.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="inline-flex h-12 items-center justify-center px-7 hover:opacity-80 transition-opacity"
              style={{
                background: "#ffffff",
                color: "#0f0f0f",
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              View the Collection
            </Link>
            <Link
              href="/about"
              className="inline-flex h-12 items-center justify-center px-7 hover:opacity-70 transition-opacity"
              style={{
                background: "transparent",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.55)",
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Inside the Atelier
            </Link>
          </div>

          {/* Bottom ledger */}
          <div
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-3 border-t pt-5"
            style={{
              borderColor: "rgba(255,255,255,0.18)",
              color: "rgba(255,255,255,0.72)",
            }}
          >
            <Ledger k="Material" v="Bovine, Vegetable-Tanned" />
            <Ledger k="Origin" v="Tannerie Chouara" />
            <Ledger k="Hands" v="07 Artisans" />
            <Ledger k="Cycle" v="14 Days / Object" />
          </div>
        </div>
      </div>

      {/* Slide dots */}
      <div
        className="absolute right-6 bottom-6 z-10 hidden md:flex items-center gap-2 px-3 py-2"
        style={{
          background: "rgba(255,255,255,0.10)",
          border: "1px solid rgba(255,255,255,0.20)",
        }}
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show hero ${i + 1}`}
            aria-current={i === active}
            className="block w-1.5 h-1.5 transition-colors"
            style={{
              background:
                i === active ? "#ffffff" : "rgba(255,255,255,0.35)",
            }}
          />
        ))}
      </div>
    </section>
  );
}

function Ledger({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className="tech-meta"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        {k}
      </span>
      <span className="tech-meta" style={{ color: "#ffffff" }}>
        {v}
      </span>
    </div>
  );
}
