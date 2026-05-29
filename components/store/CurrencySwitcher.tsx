"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  SUPPORTED_CURRENCIES,
  CURRENCY_SYMBOLS,
  type Currency,
} from "@/lib/currency";
import { useCurrency } from "@/components/store/CurrencyProvider";

// Quiet currency switcher for the top strip / nav. Three letters, three
// chevron states, no chrome. Cookie write happens in CurrencyProvider;
// router.refresh() re-runs the proxy so server components re-render with
// the new currency.
export default function CurrencySwitcher({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  const fg =
    variant === "dark"
      ? "rgba(255,255,255,0.92)"
      : "#0F0F0F";
  const bg =
    variant === "dark" ? "rgba(15,15,15,0.95)" : "#FFFFFF";
  const border =
    variant === "dark" ? "rgba(255,255,255,0.18)" : "#E5E5E5";

  function choose(next: Currency) {
    if (next === currency) {
      setOpen(false);
      return;
    }
    setCurrency(next);
    setOpen(false);
    startTransition(() => router.refresh());
  }

  return (
    <div className="relative inline-block" style={{ color: fg }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 whitespace-nowrap"
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 500,
          fontSize: "11px",
          letterSpacing: "0.10em",
          textTransform: "uppercase",
        }}
      >
        <span>{CURRENCY_SYMBOLS[currency]}</span>
        <span>{currency}</span>
        <span aria-hidden style={{ opacity: 0.55 }}>
          {open ? "▴" : "▾"}
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Currency"
          className="absolute right-0 mt-2 min-w-[120px] py-1 shadow-md z-[80]"
          style={{
            background: bg,
            border: `1px solid ${border}`,
            color: fg,
          }}
        >
          {SUPPORTED_CURRENCIES.map((c) => {
            const active = c === currency;
            return (
              <li key={c} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => choose(c)}
                  className="w-full text-left px-3 py-2 inline-flex items-center justify-between gap-3 hover:opacity-80"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: active ? 600 : 500,
                    fontSize: "11px",
                    letterSpacing: "0.10em",
                    textTransform: "uppercase",
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    <span style={{ opacity: 0.65 }}>{CURRENCY_SYMBOLS[c]}</span>
                    <span>{c}</span>
                  </span>
                  {active && (
                    <span aria-hidden style={{ opacity: 0.55 }}>
                      ✓
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
