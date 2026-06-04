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
        bottom: 24,
        left: "auto",
        right: 24,
        zIndex: 100,
        width: "min(560px, calc(100vw - 48px))",
        background: "var(--color-near-black, #0a0a0a)",
        color: "var(--color-ivory, #f5efe6)",
        border: "1px solid rgba(245, 239, 230, 0.18)",
        padding: "14px 16px",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          flexDirection: "row",
          gap: 14,
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
        className="cookie-banner-inner"
      >
        <p
          style={{
            fontFamily: "var(--font-sans, Inter)",
            fontSize: 11,
            lineHeight: 1.35,
            color: "rgba(245, 239, 230, 0.85)",
            margin: 0,
            maxWidth: 330,
          }}
        >
          {t("cookie.copy")}{" "}
          <a
            href={href("/legal/privacy")}
            style={{
              color: "var(--color-ivory, #f5efe6)",
              textDecoration: "underline",
              textUnderlineOffset: 4,
            }}
          >
            {t("cookie.privacy")}
          </a>
          .
        </p>
        <div className="cookie-banner-actions" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
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
            {t("cookie.accept")}
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
            padding: 8px 14px !important;
          }
          .cookie-banner-inner {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 8px !important;
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
            bottom: 0 !important;
          }
        }
        @media (min-width: 768px) {
          .cookie-banner-inner {
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 18px !important;
          }
          .cookie-banner-actions {
            flex: 0 0 auto !important;
            flex-wrap: nowrap !important;
          }
        }
      `}</style>
    </div>
  );
}
