"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocalizedHref, useT } from "@/lib/i18n-client";

// Consent state shape:
//   "all"  — analytics + marketing pixels enabled
//   "none" — only essential cookies (checkout session, cart, auth)
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
  const isCommercePage = pathname.startsWith("/products");
  const isProductPage = pathname.startsWith("/products/");

  useEffect(() => {
    const showDelay = isCommercePage ? 8000 : 2200;
    const showTimer = window.setTimeout(() => {
      if (getConsent() === null) setVisible(true);
    }, showDelay);

    // Hide if another tab accepts/rejects
    const onChange = () => {
      if (getConsent() !== null) setVisible(false);
    };
    window.addEventListener("storage", onChange);
    return () => {
      window.clearTimeout(showTimer);
      window.removeEventListener("storage", onChange);
    };
  }, [isCommercePage]);

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
        left: "auto",
        top: "auto",
        bottom: 18,
        right: 18,
        zIndex: 100,
        width: "min(330px, calc(100vw - 36px))",
        background: "var(--color-near-black, #0a0a0a)",
        color: "var(--color-ivory, #f5efe6)",
        border: "1px solid rgba(245, 239, 230, 0.18)",
        padding: "12px 14px 14px",
        boxShadow: "0 18px 50px rgba(0, 0, 0, 0.24)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          alignItems: "stretch",
        }}
        className="cookie-banner-inner"
      >
        <p
          style={{
            fontFamily: "var(--font-sans, Inter)",
            fontSize: 10.5,
            lineHeight: 1.45,
            letterSpacing: "0.01em",
            color: "rgba(244, 240, 232, 0.82)",
            margin: 0,
            maxWidth: 700,
          }}
        >
          <span className="cookie-copy-full">
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
          </span>
          <span className="cookie-copy-mobile">
            Cookies: essential only unless accepted.{" "}
            <a
              href={href("/legal/privacy")}
              style={{
                color: "var(--color-ivory, #f5efe6)",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Privacy
            </a>
            .
          </span>
        </p>
        <div className="cookie-banner-actions" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={reject}
            style={{
              fontFamily: "var(--font-sans, Inter)",
              fontWeight: 500,
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              padding: "8px 16px",
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
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              padding: "8px 16px",
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
        .cookie-copy-mobile {
          display: none;
        }
        @media (max-width: 767px) {
          .cookie-banner {
            left: 0 !important;
            right: 0 !important;
            top: auto !important;
            bottom: 0 !important;
            width: auto !important;
            border-left: 0 !important;
            border-right: 0 !important;
            border-top: 1px solid rgba(245, 239, 230, 0.12) !important;
            border-bottom: 0 !important;
            padding: 8px 12px calc(8px + env(safe-area-inset-bottom)) !important;
          }
          .cookie-banner-inner {
            display: grid !important;
            grid-template-columns: minmax(0, 1fr) auto !important;
            align-items: center !important;
            gap: 10px !important;
          }
          .cookie-banner p {
            font-size: 9px !important;
            line-height: 1.18 !important;
            max-width: 100% !important;
          }
          .cookie-copy-full {
            display: none !important;
          }
          .cookie-copy-mobile {
            display: inline !important;
          }
          .cookie-banner-actions {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 6px !important;
            width: 184px !important;
          }
          .cookie-banner-actions button {
            width: 100% !important;
            min-height: 30px !important;
            padding: 5px 7px !important;
            font-size: 9px !important;
            letter-spacing: 0.1em !important;
          }
          .cookie-banner-pdp {
            top: auto !important;
            bottom: calc(86px + env(safe-area-inset-bottom)) !important;
            border-bottom: 1px solid rgba(245, 239, 230, 0.12) !important;
          }
          @media (max-width: 360px) {
            .cookie-banner-inner {
              grid-template-columns: 1fr !important;
              gap: 6px !important;
            }
            .cookie-banner-actions {
              width: 100% !important;
            }
          }
        }
        @media (min-width: 768px) {
          .cookie-banner-actions {
            justify-content: flex-end !important;
            flex: 0 0 auto !important;
            flex-wrap: nowrap !important;
          }
        }
      `}</style>
    </div>
  );
}
