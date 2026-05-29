// FX rate fetcher + USD-cents converter.
//
// Source: frankfurter.app — free, no API key, ECB reference rates updated
// once per business day. We cache for 24h via Next's fetch revalidate, so
// the displayed price stays stable inside a 24h window and the price the
// user saw is the price Revolut charges (server re-reads the same cache
// when creating the order).

import { SUPPORTED_CURRENCIES, type Currency } from "@/lib/currency";

export type RateMap = Record<Currency, number>;

const FRANKFURTER_URL =
  "https://api.frankfurter.app/latest?base=USD&symbols=EUR,GBP";

// Static fallback used only when the rate API is unreachable at build/runtime
// (e.g., offline dev, transient outage). Approximate rates from May 2026 — the
// goal is to never show a broken price, not to be precise. Live fetches
// overwrite within 24h.
const FALLBACK_RATES: RateMap = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
};

export async function getRates(): Promise<RateMap> {
  try {
    const res = await fetch(FRANKFURTER_URL, {
      next: { revalidate: 86400, tags: ["fx-rates"] },
    });
    if (!res.ok) return FALLBACK_RATES;
    const data = (await res.json()) as { rates?: Partial<Record<Currency, number>> };
    if (!data.rates) return FALLBACK_RATES;
    return {
      USD: 1,
      EUR: data.rates.EUR ?? FALLBACK_RATES.EUR,
      GBP: data.rates.GBP ?? FALLBACK_RATES.GBP,
    };
  } catch {
    return FALLBACK_RATES;
  }
}

// Convert USD minor units (cents) → target-currency minor units.
// Rounds to the nearest minor unit. The same function is used for display
// and for Revolut order amounts, so the user sees the price they're charged.
export function convertUSDCents(
  usdCents: number,
  target: Currency,
  rates: RateMap,
): number {
  if (target === "USD") return usdCents;
  const rate = rates[target] ?? 1;
  return Math.round(usdCents * rate);
}

export function isSupportedCurrency(value: string): value is Currency {
  return (SUPPORTED_CURRENCIES as readonly string[]).includes(value);
}
