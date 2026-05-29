"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CURRENCY_COOKIE,
  DEFAULT_CURRENCY,
  type Currency,
} from "@/lib/currency";
import { convertUSDCents, type RateMap } from "@/lib/fx";
import { formatPrice as formatPriceUtil } from "@/lib/utils";

interface CurrencyContextValue {
  currency: Currency;
  rates: RateMap;
  setCurrency: (next: Currency) => void;
  // Format a USD-cents value in the active currency.
  format: (usdCents: number) => string;
  // Convert USD cents → active-currency minor units (no formatting).
  convert: (usdCents: number) => number;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

interface CurrencyProviderProps {
  initialCurrency: Currency;
  rates: RateMap;
  children: ReactNode;
}

// Hydrates from server-resolved currency + rates (passed from layout). Client
// toggles via setCurrency, which writes the cookie and triggers a soft
// router refresh through useTransition in the switcher component.
export function CurrencyProvider({
  initialCurrency,
  rates,
  children,
}: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<Currency>(initialCurrency);

  const setCurrency = useCallback((next: Currency) => {
    setCurrencyState(next);
    if (typeof document !== "undefined") {
      // 1-year persistent cookie. Path=/ so the proxy reads it on every nav.
      document.cookie = `${CURRENCY_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    }
  }, []);

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      rates,
      setCurrency,
      format: (usdCents: number) =>
        formatPriceUtil(convertUSDCents(usdCents, currency, rates), currency),
      convert: (usdCents: number) => convertUSDCents(usdCents, currency, rates),
    }),
    [currency, rates, setCurrency],
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    // SSR / pre-hydration fallback — render USD without crashing if a
    // component reaches useCurrency before the provider mounts.
    return {
      currency: DEFAULT_CURRENCY,
      rates: { USD: 1, EUR: 0.92, GBP: 0.79 },
      setCurrency: () => {},
      format: (cents) => formatPriceUtil(cents, DEFAULT_CURRENCY),
      convert: (cents) => cents,
    };
  }
  return ctx;
}
