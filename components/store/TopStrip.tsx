"use client";

import { useEffect, useState } from "react";

// Sticky band above the main nav. Three slots:
//   LEFT   — brand voice line
//   CENTER — promo pill (clickable)
//   RIGHT  — Marrakech live time, GMT+1
//
// 11-13px Switzer Medium uppercase, +0.08em. Sticks at the top with z-50
// just BELOW the Navbar (which is z-[60] after the refactor).

function formatMarrakechTime(now: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Casablanca",
  }).format(now);
}

export default function TopStrip() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const tick = () => setTime(formatMarrakechTime(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="fixed top-0 inset-x-0 z-[60] w-full bg-[color:var(--color-charcoal)] text-[color:var(--color-cream)] border-b border-[color:var(--color-rule-soft)]/10"
      role="region"
      aria-label="Brand strip"
      style={{
        fontFamily: "var(--font-sans)",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        fontSize: "clamp(11px, 0.85vw, 13px)",
      }}
    >
      <div className="h-[40px] flex items-center justify-between gap-4 px-5 md:px-8">
        {/* LEFT — brand voice */}
        <span className="hidden sm:inline-block opacity-90 whitespace-nowrap">
          Hand-cut in Fes
        </span>
        <span className="sm:hidden opacity-90 whitespace-nowrap">
          Hand-cut · Fes
        </span>

        {/* CENTER — promo pill */}
        <a
          href="/products?from=insider"
          className="inline-flex items-center px-3 py-1 border border-[color:var(--color-cream)]/35 rounded-full hover:bg-[color:var(--color-cream)]/10 transition-colors"
          style={{ letterSpacing: "0.06em" }}
        >
          <span aria-hidden className="mr-2 h-1.5 w-1.5 rounded-full bg-[color:var(--color-brass-gold)]" />
          Insider 15% off first order
        </a>

        {/* RIGHT — Marrakech time */}
        <span className="hidden md:inline-flex items-center gap-2 opacity-90 whitespace-nowrap tabular-nums">
          <span>Marrakech</span>
          <span aria-live="polite">{time || "--:--"}</span>
          <span className="opacity-60">GMT+1</span>
        </span>
        <span className="md:hidden inline-flex items-center gap-1.5 opacity-90 whitespace-nowrap tabular-nums">
          <span aria-live="polite">{time || "--:--"}</span>
          <span className="opacity-60">GMT+1</span>
        </span>
      </div>
    </div>
  );
}
