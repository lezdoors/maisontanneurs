import type { Currency } from "./currency";

// Locale strings for Intl currency formatting. Keep separate from the app's
// Locale (en/fr/ar) so we can format EUR as "1 234,56 €" on a French page
// without affecting site copy locale.
const CURRENCY_INTL_LOCALE: Record<Currency, string> = {
  USD: "en-US",
  EUR: "fr-FR",
  GBP: "en-GB",
};

export function formatPrice(
  cents: number,
  currency: Currency = "USD",
): string {
  return new Intl.NumberFormat(CURRENCY_INTL_LOCALE[currency], {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function generateOrderNumber(): string {
  const num = Math.floor(Math.random() * 999999)
    .toString()
    .padStart(6, "0");
  return `MI-${num}`;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
