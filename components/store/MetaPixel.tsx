"use client";

import { useEffect } from "react";
import { getConsent } from "./CookieBanner";

// Meta Pixel loader — only fires after explicit user consent.
//
// Server-side companion: lib/meta-capi.ts (Conversions API for Purchase events,
// fired from app/api/webhooks/stripe/route.ts on checkout.session.completed).
//
// Env var: NEXT_PUBLIC_META_PIXEL_ID
// If unset, this component is a no-op.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

function injectPixel(pixelId: string) {
  if (typeof window === "undefined") return;
  if (window.fbq) return; // already loaded

  // Meta's standard pixel queue stub, written without the cramped 2015-era
  // boilerplate so TypeScript can follow it.
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const w = window as any;
  const fbq: any = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod.apply(fbq, args);
    } else {
      fbq.queue.push(args);
    }
  };
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  w.fbq = fbq;
  if (!w._fbq) w._fbq = fbq;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  const firstScript = document.getElementsByTagName("script")[0];
  firstScript.parentNode!.insertBefore(script, firstScript);

  window.fbq!("init", pixelId);
  window.fbq!("track", "PageView");
}

export default function MetaPixel() {
  useEffect(() => {
    if (!PIXEL_ID) return;

    if (getConsent() === "all") {
      injectPixel(PIXEL_ID);
    }

    const onConsent = (e: Event) => {
      const detail = (e as CustomEvent).detail as { consent?: string };
      if (detail?.consent === "all") injectPixel(PIXEL_ID);
    };
    window.addEventListener("mi-consent-change", onConsent);
    return () => window.removeEventListener("mi-consent-change", onConsent);
  }, []);

  if (!PIXEL_ID) return null;

  return (
    <noscript>
      <img
        height={1}
        width={1}
        style={{ display: "none" }}
        alt=""
        src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
      />
    </noscript>
  );
}

// Helper for components that fire standard events (ViewContent, AddToCart, etc.)
export function trackPixelEvent(
  event: "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase" | "Search",
  params?: Record<string, unknown>,
) {
  if (typeof window === "undefined") return;
  if (!window.fbq) return; // not loaded yet (no consent or no pixel id)
  window.fbq("track", event, params || {});
}
