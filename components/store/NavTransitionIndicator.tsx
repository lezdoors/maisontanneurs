"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Maison Tanneurs navigation transition indicator.
 *
 * Replaces the previous first-paint splash. NEVER renders on initial page
 * load. Only appears when an in-app navigation takes longer than
 * SHOW_AFTER_MS, at which point it fades in a centered wordmark + a thin
 * left-to-right animated rule (the Létrange-style sleek loading rule),
 * then fades out as soon as the destination route mounts.
 *
 * Implementation:
 *  - Catches anchor clicks at the document level. Same-origin internal
 *    navigations start a pending timer.
 *  - usePathname() updates when the new route commits → pending cleared.
 *  - prefers-reduced-motion → instant opacity, no rule animation.
 */
const SHOW_AFTER_MS = 280;
const FADE_MS = 320;
const RULE_DURATION_MS = 1400;

type Phase = "idle" | "armed" | "visible" | "fading";

function isInternalNavigation(target: HTMLAnchorElement, event: MouseEvent): boolean {
  // Respect modifier-keys + non-left clicks (open in new tab, etc.)
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (event.button !== 0) return false;
  if (target.target && target.target !== "_self") return false;
  if (target.hasAttribute("download")) return false;
  const href = target.getAttribute("href");
  if (!href) return false;
  // External, mailto, tel, hash-only — skip
  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#")
  ) {
    // For absolute http(s) URLs, allow if same origin
    if (href.startsWith("http")) {
      try {
        const u = new URL(href, window.location.href);
        if (u.origin !== window.location.origin) return false;
        // Same-origin but pathname unchanged + different hash → no nav
        if (u.pathname === window.location.pathname && u.search === window.location.search) {
          return false;
        }
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
  // Relative href — assume internal
  // But check if it'd actually result in a new path
  try {
    const u = new URL(href, window.location.href);
    if (u.pathname === window.location.pathname && u.search === window.location.search) {
      return false;
    }
  } catch {
    /* fall through */
  }
  return true;
}

export default function NavTransitionIndicator() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [reduceMotion, setReduceMotion] = useState(false);
  const armedTimerRef = useRef<number | null>(null);
  const fadeTimerRef = useRef<number | null>(null);
  const ruleResetRef = useRef(0);

  // Track reduced-motion preference.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Capture-phase listener so we see the click before Next.js client-side
  // routing takes over.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const handler = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (event.defaultPrevented) return;
      if (!isInternalNavigation(anchor, event)) return;

      // Arm the indicator. Only flips to visible if the timer fires before
      // pathname changes — i.e. the new route hasn't committed in time.
      if (armedTimerRef.current) window.clearTimeout(armedTimerRef.current);
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
      setPhase("armed");
      armedTimerRef.current = window.setTimeout(() => {
        ruleResetRef.current += 1;
        setPhase("visible");
      }, SHOW_AFTER_MS);
    };
    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler, true);
      if (armedTimerRef.current) window.clearTimeout(armedTimerRef.current);
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    };
  }, []);

  // When the pathname changes, the destination has committed — clear.
  useEffect(() => {
    if (armedTimerRef.current) {
      window.clearTimeout(armedTimerRef.current);
      armedTimerRef.current = null;
    }
    if (phase === "armed") {
      setPhase("idle");
      return;
    }
    if (phase === "visible") {
      setPhase("fading");
      fadeTimerRef.current = window.setTimeout(() => setPhase("idle"), FADE_MS);
    }
    // intentionally only respond to pathname here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (phase !== "visible" && phase !== "fading") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-[var(--color-paper)]"
      style={{
        opacity: phase === "fading" ? 0 : 1,
        transition: `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: "clamp(20px, 2.6vw, 30px)",
          letterSpacing: "0.18em",
          color: "var(--color-ink)",
          lineHeight: 1,
        }}
      >
        MAISON&nbsp;&nbsp;TANNEURS
      </span>
      <span
        className="mt-2 tech-meta"
        style={{
          fontSize: "9.5px",
          letterSpacing: "0.32em",
          color: "var(--color-ink-muted)",
        }}
      >
        MARRAKECH · ATELIER
      </span>

      <div
        aria-hidden
        className="mt-7 h-px overflow-hidden"
        style={{
          width: "clamp(180px, 24vw, 260px)",
          background: "rgba(15,15,15,0.10)",
        }}
      >
        <div
          // Re-keying with ruleResetRef ensures the animation restarts cleanly
          // each time the indicator is shown.
          key={ruleResetRef.current}
          style={{
            height: "100%",
            background: "rgba(15,15,15,0.55)",
            transformOrigin: "left center",
            animation: reduceMotion
              ? undefined
              : `mt-loader-rule ${RULE_DURATION_MS}ms cubic-bezier(0.65, 0, 0.35, 1) infinite`,
            transform: reduceMotion ? "scaleX(1)" : "scaleX(0)",
          }}
        />
      </div>

      <style>{`
        @keyframes mt-loader-rule {
          0% { transform: scaleX(0); transform-origin: left center; }
          60% { transform: scaleX(1); transform-origin: left center; }
          61% { transform-origin: right center; }
          100% { transform: scaleX(0); transform-origin: right center; }
        }
      `}</style>
    </div>
  );
}
