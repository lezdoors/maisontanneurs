import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, dirForLocale, isLocale, type Locale, withLocale } from "@/lib/i18n";
import {
  CURRENCY_COOKIE,
  DEFAULT_CURRENCY,
  defaultCurrencyForLocale,
  isCurrency,
} from "@/lib/currency";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/").filter(Boolean)[0];
  const locale: Locale = isLocale(first) ? first : DEFAULT_LOCALE;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-mt-locale", locale);
  requestHeaders.set("x-mt-dir", dirForLocale(locale));

  // Currency: explicit cookie wins, otherwise locale-pinned default.
  const cookieCurrency = request.cookies.get(CURRENCY_COOKIE)?.value;
  const currency = isCurrency(cookieCurrency)
    ? cookieCurrency
    : defaultCurrencyForLocale(locale) ?? DEFAULT_CURRENCY;
  requestHeaders.set("x-mt-currency", currency);

  const strippedPath =
    locale !== DEFAULT_LOCALE
      ? pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/"
      : pathname;

  // Protect admin routes except the login page. Keep this guard before locale rewrites.
  if (strippedPath.startsWith("/admin") && strippedPath !== "/admin") {
    const session = request.cookies.get("akal-admin-session");
    if (!session) {
      return NextResponse.redirect(new URL(withLocale("/admin", locale), request.url));
    }
  }

  if (locale !== DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = strippedPath;
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|robots.txt|sitemap.xml|.*\\..*).*)"],
};
