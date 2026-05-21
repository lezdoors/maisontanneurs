"use client";

import { useEffect } from "react";
import { getConsent } from "./CookieBanner";

// GA4 loader — only fires after explicit user consent.
//
// Companion to Meta Pixel (MetaPixel.tsx) and Meta CAPI (lib/meta-capi.ts).
// Standard events are emitted via trackGA4Event() from PDP / cart / checkout.
//
// Env var: NEXT_PUBLIC_GA4_MEASUREMENT_ID
//   Set in Vercel to a "G-XXXXXXXX" measurement ID. If unset, this component
//   is a no-op so dev/preview deploys don't fire to the prod GA4 property.
//
// Verify firing: GA4 DebugView with ?debug_mode=1 appended.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

function injectGA4(id: string) {
  if (typeof window === "undefined") return;
  if (window.gtag) return; // already loaded

  window.dataLayer = window.dataLayer || [];
  const gtag = (...args: unknown[]) => {
    window.dataLayer!.push(args);
  };
  window.gtag = gtag;

  // Boot order: config first, then load the loader.
  gtag("js", new Date());
  gtag("config", id, {
    send_page_view: true,
    anonymize_ip: true,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);
}

export default function GA4() {
  useEffect(() => {
    if (!MEASUREMENT_ID) return;

    if (getConsent() === "all") {
      injectGA4(MEASUREMENT_ID);
    }

    const onConsent = (e: Event) => {
      const detail = (e as CustomEvent).detail as { consent?: string };
      if (detail?.consent === "all") injectGA4(MEASUREMENT_ID);
    };
    window.addEventListener("mi-consent-change", onConsent);
    return () => window.removeEventListener("mi-consent-change", onConsent);
  }, []);

  return null;
}

// Helper for components firing standard ecommerce events.
// GA4 reference: https://developers.google.com/analytics/devguides/collection/ga4/reference/events
export function trackGA4Event(
  event:
    | "view_item"
    | "add_to_cart"
    | "remove_from_cart"
    | "view_cart"
    | "begin_checkout"
    | "purchase"
    | "search",
  params?: Record<string, unknown>,
) {
  if (typeof window === "undefined") return;
  if (!window.gtag) return; // not loaded yet (no consent or no measurement ID)
  window.gtag("event", event, params || {});
}
