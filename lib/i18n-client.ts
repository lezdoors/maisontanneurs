"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { localeFromPathname, switchLocaleHref, t, withLocale, type Locale } from "@/lib/i18n-shared";

export function useLocale(): Locale {
  return localeFromPathname(usePathname());
}

export function useT() {
  const locale = useLocale();
  return (key: string) => t(locale, key);
}

export function useLocalizedHref() {
  const locale = useLocale();
  return (href: string) => withLocale(href, locale);
}

export function useSwitchLocaleHref() {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const search = searchParams?.toString();
  return (locale: Locale) => switchLocaleHref(pathname, search ? `?${search}` : "", locale);
}
