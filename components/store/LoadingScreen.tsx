"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Session key: once shown, don't replay on internal nav within the same tab.
const SESSION_KEY = "mt-loading-shown";
const HOLD_MS = 900;        // time the brand moment holds before fading
const FADE_MS = 600;        // length of the fade-out
const TOTAL_MS = HOLD_MS + FADE_MS;

/**
 * First-paint brand moment. Renders the arched-door MT badge with a thin
 * animated rule underneath (left-to-right scaleX) for ~900ms, then fades
 * out and unmounts. Session-gated so internal navigation doesn't replay.
 *
 * Respects prefers-reduced-motion (skips entirely so the page renders
 * immediately for users who set that flag).
 */
export default function LoadingScreen() {
  const [phase, setPhase] = useState<"hidden" | "visible" | "fading" | "done">("hidden");

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Skip for reduced-motion users — they get an instant page.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      return;
    }
    // Skip if already shown this tab session.
    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === "1") {
        setPhase("done");
        return;
      }
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // sessionStorage blocked (private browsing / strict cookie blockers) — still show once.
    }

    setPhase("visible");
    const t1 = window.setTimeout(() => setPhase("fading"), HOLD_MS);
    const t2 = window.setTimeout(() => setPhase("done"), TOTAL_MS);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (phase === "hidden" || phase === "done") return null;

  return (
    <div
      role="presentation"
      aria-hidden
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--color-paper)]"
      style={{
        opacity: phase === "fading" ? 0 : 1,
        transition: `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        pointerEvents: "none",
      }}
    >
      <div
        className="relative"
        style={{ width: "clamp(160px, 22vw, 240px)", aspectRatio: "1 / 1" }}
      >
        <Image
          src="/brand/logos/mt-badge.webp"
          alt=""
          fill
          priority
          sizes="240px"
          className="object-contain"
        />
      </div>
      <div
        aria-hidden
        className="mt-8 h-px overflow-hidden"
        style={{ width: "clamp(180px, 26vw, 280px)", background: "rgba(15,15,15,0.08)" }}
      >
        <div
          style={{
            height: "100%",
            background: "rgba(15,15,15,0.55)",
            transform: phase === "visible" ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left center",
            transition: `transform ${HOLD_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`,
          }}
        />
      </div>
    </div>
  );
}
