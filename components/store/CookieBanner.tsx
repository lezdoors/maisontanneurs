"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Consent state shape:
//   "all"  — analytics + marketing pixels enabled
//   "none" — only essential cookies (Stripe session, cart, auth)
//   null   — user has not made a choice yet → banner is shown
const STORAGE_KEY = "mi-cookie-consent";

export type ConsentChoice = "all" | "none";

export function getConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "all" || v === "none" ? v : null;
}

function setConsent(choice: ConsentChoice) {
  window.localStorage.setItem(STORAGE_KEY, choice);
  window.dispatchEvent(
    new CustomEvent("mi-consent-change", { detail: { consent: choice } }),
  );
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const pinLeft = pathname.startsWith("/products/");

  useEffect(() => {
    // Defer to avoid SSR mismatch
    const c = getConsent();
    if (c === null) setVisible(true);

    // Hide if another tab accepts/rejects
    const onChange = () => {
      if (getConsent() !== null) setVisible(false);
    };
    window.addEventListener("storage", onChange);
    return () => window.removeEventListener("storage", onChange);
  }, []);

  if (!visible) return null;

  const accept = () => {
    setConsent("all");
    setVisible(false);
  };

  const reject = () => {
    setConsent("none");
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="cookie-banner"
      style={{
        position: "fixed",
        bottom: 24,
        left: pinLeft ? 24 : "auto",
        right: pinLeft ? "auto" : 24,
        zIndex: 100,
        width: "min(420px, calc(100vw - 48px))",
        background: "var(--color-near-black, #0a0a0a)",
        color: "var(--color-ivory, #f5efe6)",
        border: "1px solid rgba(245, 239, 230, 0.18)",
        padding: "18px 20px",
        boxShadow: "0 18px 48px rgba(0,0,0,0.28)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          alignItems: "flex-start",
        }}
        className="cookie-banner-inner"
      >
        <p
          style={{
            fontFamily: "var(--font-sans, Inter)",
            fontSize: 13,
            lineHeight: 1.55,
            color: "rgba(245, 239, 230, 0.85)",
            margin: 0,
            maxWidth: 720,
          }}
        >
          We use cookies to improve your experience, measure how the site is used,
          and personalise advertising. You can accept or decline non-essential
          cookies. Essential cookies (cart, checkout) are always on.{" "}
          <a
            href="/legal/privacy"
            style={{
              color: "var(--color-ivory, #f5efe6)",
              textDecoration: "underline",
              textUnderlineOffset: 4,
            }}
          >
            Privacy policy
          </a>
          .
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={reject}
            style={{
              fontFamily: "var(--font-sans, Inter)",
              fontWeight: 500,
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "12px 24px",
              background: "transparent",
              color: "var(--color-ivory, #f5efe6)",
              border: "1px solid rgba(245, 239, 230, 0.55)",
              cursor: "pointer",
              transition: "background .2s ease, border-color .2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#f5efe6";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(245, 239, 230, 0.55)";
            }}
          >
            Decline
          </button>
          <button
            onClick={accept}
            style={{
              fontFamily: "var(--font-sans, Inter)",
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "12px 24px",
              background: "var(--color-ivory, #f5efe6)",
              color: "var(--color-warm-black, #141210)",
              border: "1px solid var(--color-ivory, #f5efe6)",
              cursor: "pointer",
              transition: "background .2s ease, color .2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "#f5efe6";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#f5efe6";
              (e.currentTarget as HTMLButtonElement).style.color = "#141210";
            }}
          >
            Accept all
          </button>
        </div>
      </div>
      <style>{`
        @media (max-width: 767px) {
          .cookie-banner {
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: auto !important;
            border-left: 0 !important;
            border-right: 0 !important;
            border-bottom: 0 !important;
          }
        }
        @media (min-width: 768px) {
          .cookie-banner-inner {
            flex-direction: column !important;
            align-items: flex-start !important;
            justify-content: flex-start !important;
            gap: 14px !important;
          }
        }
      `}</style>
    </div>
  );
}
