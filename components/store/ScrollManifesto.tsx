"use client";

import { useEffect, useRef, useState } from "react";

// Parallax scroll manifesto — large statement text translates upward as the
// viewer scrolls past, over a still atmospheric backdrop. Aether pattern.

const LINES = [
  "Made by hand,",
  "shaped by use,",
  "carried for life.",
];

export default function ScrollManifesto() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 when section enters viewport from bottom, 1 when it exits at top.
      const p = 1 - (rect.bottom - 0) / (vh + rect.height);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (raf === 0) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf !== 0) cancelAnimationFrame(raf);
    };
  }, []);

  // Translate text upward as user scrolls past. Max -120px over the section.
  const translate = -progress * 120;

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{
        background: "#F9F9F9",
        borderTop: "1px solid #E5E5E5",
        borderBottom: "1px solid #E5E5E5",
        minHeight: "92svh",
      }}
      aria-label="House manifesto"
    >
      {/* Backdrop image, subtle */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/brand/hero/home-hero-1-arches.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center 46%",
          opacity: 0.18,
          filter: "saturate(0.85)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #F9F9F9 0%, rgba(249,249,249,0.4) 50%, #F9F9F9 100%)",
        }}
      />

      <div
        className="relative mx-auto flex items-center"
        style={{
          maxWidth: "1600px",
          paddingLeft: "clamp(24px, 5vw, 80px)",
          paddingRight: "clamp(24px, 5vw, 80px)",
          minHeight: "92svh",
        }}
      >
        <div
          style={{
            transform: `translateY(${translate}px)`,
            willChange: "transform",
          }}
        >
          <div
            className="uppercase"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              letterSpacing: "0.18em",
              fontWeight: 500,
              color: "#8C4A26",
              marginBottom: "32px",
            }}
          >
            The House
          </div>
          {LINES.map((line) => (
            <div
              key={line}
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "clamp(48px, 7vw, 128px)",
                letterSpacing: "-0.04em",
                lineHeight: 1.0,
                color: "#0F0F0F",
                margin: 0,
                whiteSpace: "nowrap",
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
