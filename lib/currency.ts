// Multi-currency primitives for Maison Tanneurs.
//
// Prices are stored as USD minor units (cents). Display + checkout currency
// is selected per-request via the `mt-currency` cookie, with a locale-pinned
// default when no cookie is set. FX conversion lives in lib/fx.ts.
//
// Revolut Acquiring accepts ISO 4217 currency per createOrder call (verified
// 2026-05-21 in lib/revolut.ts) so the same selection drives both display
// and charge.

import type { Locale } from "@/lib/i18n";

export const SUPPORTED_CURRENCIES = ["USD", "EUR", "GBP"] as const;
export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

export const DEFAULT_CURRENCY: Currency = "USD";

export function isCurrency(value: unknown): value is Currency {
  return (
    typeof value === "string" &&
    (SUPPORTED_CURRENCIES as readonly string[]).includes(value)
  );
}

// Locale → default currency. fr defaults to EUR; en/ar default to USD. The
// user can override via the header switcher; cookie persists the choice.
export function defaultCurrencyForLocale(locale: Locale): Currency {
  if (locale === "fr") return "EUR";
  return "USD";
}

export const CURRENCY_COOKIE = "mt-currency";

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
};
