"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocalizedHref, useT } from "@/lib/i18n-client";

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
  const t = useT();
  const href = useLocalizedHref();
  const isProductPage = pathname.startsWith("/products/");

  useEffect(() => {
    const showTimer = window.setTimeout(() => {
      if (getConsent() === null) setVisible(true);
    }, 0);

    // Hide if another tab accepts/rejects
    const onChange = () => {
      if (getConsent() !== null) setVisible(false);
    };
    window.addEventListener("storage", onChange);
    return () => {
      window.clearTimeout(showTimer);
      window.removeEventListener("storage", onChange);
    };
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
      className={`cookie-banner ${isProductPage ? "cookie-banner-pdp" : ""}`}
      style={{
        position: "fixed",
        bottom: isProductPage ? 18 : 22,
        left: 22,
        right: "auto",
        zIndex: 100,
        width: "min(440px, calc(100vw - 44px))",
        background: "rgba(255, 255, 255, 0.96)",
        color: "var(--color-ink, #2c2a28)",
        border: "1px solid rgba(20, 18, 16, 0.18)",
        boxShadow: "0 18px 60px rgba(20, 18, 16, 0.12)",
        backdropFilter: "blur(10px)",
        padding: "16px",
      }}
    >
      <div
        style={{
          maxWidth: "none",
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          alignItems: "stretch",
          justifyContent: "flex-start",
        }}
        className="cookie-banner-inner"
      >
        <p
          style={{
            fontFamily: "var(--font-sans, Inter)",
            fontSize: 11,
            lineHeight: 1.35,
            color: "rgba(44, 42, 40, 0.78)",
            margin: 0,
            maxWidth: 760,
          }}
        >
          {t("cookie.copy")}{" "}
          <a
            href={href("/legal/privacy")}
            style={{
              color: "var(--color-ink, #2c2a28)",
              textDecoration: "underline",
              textUnderlineOffset: 4,
            }}
          >
            {t("cookie.privacy")}
          </a>
          .
        </p>
        <div className="cookie-banner-actions" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button
            onClick={reject}
            style={{
              fontFamily: "var(--font-sans, Inter)",
              fontWeight: 500,
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "8px 18px",
              background: "transparent",
              color: "var(--color-ink, #2c2a28)",
              border: "1px solid rgba(20, 18, 16, 0.35)",
              cursor: "pointer",
              transition: "background .2s ease, border-color .2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#2c2a28";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(20, 18, 16, 0.35)";
            }}
          >
            {t("cookie.decline")}
          </button>
          <button
            onClick={accept}
            style={{
              fontFamily: "var(--font-sans, Inter)",
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "8px 18px",
              background: "var(--color-warm-black, #141210)",
              color: "#ffffff",
              border: "1px solid var(--color-warm-black, #141210)",
              cursor: "pointer",
              transition: "background .2s ease, color .2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#2c2a28";
              (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#141210";
              (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
            }}
          >
            {t("cookie.accept")}
          </button>
        </div>
      </div>
      <style>{`
        @media (max-width: 767px) {
          .cookie-banner {
            left: 14px !important;
            right: 14px !important;
            bottom: 14px !important;
            width: auto !important;
            padding: 14px !important;
          }
          .cookie-banner-inner {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 10px !important;
          }
          .cookie-banner p {
            font-size: 10.5px !important;
            line-height: 1.3 !important;
            max-width: 100% !important;
          }
          .cookie-banner-actions {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 8px !important;
            width: 100% !important;
          }
          .cookie-banner-actions button {
            width: 100% !important;
            min-height: 34px !important;
            padding: 8px 8px !important;
            font-size: 10px !important;
            letter-spacing: 0.14em !important;
          }
          .cookie-banner-pdp {
            bottom: 14px !important;
          }
        }
      `}</style>
    </div>
  );
}
