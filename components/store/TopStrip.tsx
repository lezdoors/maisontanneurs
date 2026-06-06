"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CurrencySwitcher from "@/components/store/CurrencySwitcher";

// Aether-pattern announcement strip — sticks at top above the main nav.
// Three columns: brand voice left · pill announcement center · Marrakech time right.
// Light register: #FFFFFF bg, #0F0F0F text, #E5E5E5 bottom rule.

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
      className="fixed top-0 inset-x-0 z-[60] w-full"
      role="region"
      aria-label="Brand strip"
      style={{
        background: "#FFFFFF",
        color: "#0F0F0F",
        borderBottom: "1px solid #E5E5E5",
        fontFamily: "var(--font-sans)",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.10em",
        fontSize: "11px",
      }}
    >
      <div className="h-[44px] flex items-center justify-between gap-4 px-5 md:px-8">
        {/* LEFT — brand voice */}
        <span className="hidden sm:inline-block whitespace-nowrap" style={{ color: "#0F0F0F" }}>
          Hand-cut in Marrakech
        </span>
        <span className="sm:hidden whitespace-nowrap" style={{ color: "#0F0F0F" }}>
          Marrakech
        </span>

        {/* CENTER — promo pill (Aether: solid black pill, white text) */}
        <Link
          href="/products?from=insider"
          className="inline-flex items-center rounded-full transition-opacity hover:opacity-85"
          style={{
            background: "#0F0F0F",
            color: "#FFFFFF",
            padding: "6px 18px",
            letterSpacing: "0.10em",
          }}
        >
          Insider 15% off first order
        </Link>

        {/* RIGHT — currency switcher + Marrakech time */}
        <div className="flex items-center gap-4 md:gap-6">
          <CurrencySwitcher variant="light" />
          <span
            className="hidden md:inline-flex items-center gap-2 whitespace-nowrap tabular-nums"
            style={{ color: "#0F0F0F" }}
          >
            <span>Marrakech</span>
            <span aria-live="polite">{time || "--:--"}</span>
            <span style={{ opacity: 0.55 }}>GMT+1</span>
          </span>
          <span
            className="md:hidden inline-flex items-center gap-1.5 whitespace-nowrap tabular-nums"
            style={{ color: "#0F0F0F" }}
          >
            <span aria-live="polite">{time || "--:--"}</span>
            <span style={{ opacity: 0.55 }}>GMT+1</span>
          </span>
        </div>
      </div>
    </div>
  );
}
