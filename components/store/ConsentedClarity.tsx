"use client";

import { useEffect } from "react";
import { getConsent } from "./CookieBanner";

// Microsoft Clarity loader — gated behind cookie consent (same gate as MetaPixel).
// Env var: NEXT_PUBLIC_CLARITY_PROJECT_ID
// If unset, this component is a no-op.

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

const PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "wrj9fbl8n9";

function injectClarity(id: string) {
  if (typeof window === "undefined") return;
  if (window.clarity) return; // already loaded

  (function (c: Record<string, unknown>, l: Document, a: string, r: string, i: string) {
    const cw = c as unknown as Window;
    (cw as unknown as { [k: string]: unknown })[a] =
      (cw as unknown as { [k: string]: unknown })[a] ||
      function (...args: unknown[]) {
        ((cw as unknown as { [k: string]: { q?: unknown[] } })[a].q =
          (cw as unknown as { [k: string]: { q?: unknown[] } })[a].q || []).push(args);
      };
    const t = l.createElement(r) as HTMLScriptElement;
    t.async = true;
    t.src = "https://www.clarity.ms/tag/" + i;
    const y = l.getElementsByTagName(r)[0];
    y.parentNode!.insertBefore(t, y);
  })(window as unknown as Record<string, unknown>, document, "clarity", "script", id);
}

export default function ConsentedClarity() {
  useEffect(() => {
    if (!PROJECT_ID) return;

    if (getConsent() === "all") {
      injectClarity(PROJECT_ID);
    }

    const onConsent = (e: Event) => {
      const detail = (e as CustomEvent).detail as { consent?: string };
      if (detail?.consent === "all") injectClarity(PROJECT_ID);
    };
    window.addEventListener("mi-consent-change", onConsent);
    return () => window.removeEventListener("mi-consent-change", onConsent);
  }, []);

  return null;
}
