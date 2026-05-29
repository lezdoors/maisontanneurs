import { headers } from "next/headers";
import { DEFAULT_LOCALE, dirForLocale, isLocale, type Locale } from "@/lib/i18n";
import {
  DEFAULT_CURRENCY,
  isCurrency,
  type Currency,
} from "@/lib/currency";

export async function getRequestLocale(): Promise<Locale> {
  const h = await headers();
  const locale = h.get("x-mt-locale");
  return isLocale(locale) ? locale : DEFAULT_LOCALE;
}

export async function getRequestDir(): Promise<"ltr" | "rtl"> {
  return dirForLocale(await getRequestLocale());
}

export async function getRequestCurrency(): Promise<Currency> {
  const h = await headers();
  const currency = h.get("x-mt-currency");
  return isCurrency(currency) ? currency : DEFAULT_CURRENCY;
}
