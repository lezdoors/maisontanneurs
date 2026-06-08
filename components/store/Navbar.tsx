"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/components/store/CartProvider";
import { LOCALES, LOCALE_LABELS } from "@/lib/i18n";
import { useLocale, useLocalizedHref, useSwitchLocaleHref, useT } from "@/lib/i18n-client";

// Centered Létrange-pattern nav. Order is deliberate:
// Collection (commerce) → Savoir-faire (story) → Boutique (visit) → Bespoke (custom) → Trade (B2B) → Contact (always last).
const NAV_ITEMS = [
  { labelKey: "nav.collection", href: "/products" },
  { labelKey: "nav.savoirFaire", href: "/atelier#atelier" },
  { labelKey: "nav.boutique", href: "/boutique" },
  { labelKey: "nav.bespoke", href: "/bespoke" },
  { labelKey: "nav.trade", href: "/trade" },
  { labelKey: "nav.contact", href: "/contact" },
];

function isItemActive(itemHref: string, pathname: string, locale: string): boolean {
  // Strip locale prefix from pathname for comparison
  const stripped = pathname.replace(new RegExp(`^/(${LOCALES.join("|")})(?=/|$)`), "") || "/";
  const base = itemHref.split("#")[0]!;
  if (base === "/") return stripped === "/";
  return stripped === base || stripped.startsWith(base + "/");
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useT();
  const href = useLocalizedHref();
  const switchLocaleHref = useSwitchLocaleHref();
  const { items, openCart } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);
  const prevCartCountRef = useRef(cartCount);
  const isHome = pathname === "/" || LOCALES.some((l) => pathname === `/${l}`);
  const onHero = isHome && !scrolled && !drawer && !searchOpen;
  const navInk = onHero ? "text-white" : "text-[#0f0f0f]";
  const navMuted = onHero ? "text-white/72" : "text-[#0f0f0f]/70";
  const navRule = onHero ? "border-white/20" : "border-[#e5e5e5]";
  const underlineColor = onHero ? "rgba(255,255,255,0.85)" : "rgba(15,15,15,0.85)";

  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawer(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawer]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (drawer) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [drawer]);

  useEffect(() => {
    queueMicrotask(() => {
      setDrawer(false);
      setSearchOpen(false);
    });
  }, [pathname]);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 32 || window.location.hash.length > 0);
    update();
    const raf = window.requestAnimationFrame(update);
    const timer = window.setTimeout(update, 250);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("hashchange", update);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("hashchange", update);
    };
  }, []);

  useEffect(() => {
    if (cartCount <= prevCartCountRef.current) {
      prevCartCountRef.current = cartCount;
      return;
    }
    setCartPulse(true);
    const timer = window.setTimeout(() => setCartPulse(false), 350);
    prevCartCountRef.current = cartCount;
    return () => window.clearTimeout(timer);
  }, [cartCount]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchValue.trim();
    setSearchOpen(false);
    setSearchValue("");
    router.push(href(q ? `/products?q=${encodeURIComponent(q)}` : "/products"));
  }

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full border-b transition-colors duration-500 ${
          onHero
            ? "bg-transparent text-white border-white/15"
            : "bg-white/95 text-[#0f0f0f] border-[#e5e5e5] backdrop-blur"
        }`}
        style={{ ["--mt-nav-underline" as string]: underlineColor }}
      >
        {/* Row 1 — thin announcement strip with language switcher */}
        <div
          className={`hidden md:flex h-7 items-center justify-between px-6 border-b ${navRule} ${navMuted}`}
        >
          <span className="tech-meta">{t("nav.shipping")}</span>
          <span className="tech-meta flex items-center gap-2" aria-label="Language selector">
            {LOCALES.map((l, i) => (
              <span key={l} className="inline-flex items-center gap-2">
                {i > 0 && <span aria-hidden>·</span>}
                <Link
                  href={switchLocaleHref(l)}
                  hrefLang={l}
                  className={l === locale ? navInk : "hover:opacity-70"}
                  aria-current={l === locale ? "true" : undefined}
                >
                  {LOCALE_LABELS[l]}
                </Link>
              </span>
            ))}
          </span>
          <span className="tech-meta">{t("nav.edition")}</span>
        </div>

        {/* Row 2 — wordmark + utilities */}
        <div
          className={`grid grid-cols-[1fr_auto_1fr] items-center px-5 md:px-6 transition-[padding,height] duration-500 ${
            scrolled ? "py-2 md:py-3" : "py-4 md:py-6"
          }`}
        >
          {/* Left: mobile hamburger only */}
          <div className="flex items-center justify-start">
            <button
              type="button"
              onClick={() => setDrawer((v) => !v)}
              aria-label={t("nav.menu")}
              aria-expanded={drawer}
              className={`md:hidden inline-flex h-11 w-11 -ml-2 items-center justify-center relative z-[60] ${navInk}`}
              style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                aria-hidden
              >
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          </div>

          {/* Center: wordmark + subtitle */}
          <Link
            href={href("/")}
            aria-label="Maison Tanneurs home"
            className="flex flex-col items-center text-center select-none"
          >
            <span
              className={`mt-brand-wordmark ${navInk} ${
                scrolled ? "mt-brand-wordmark--compact" : ""
              }`}
              aria-hidden="true"
            >
              Maison
              <span className="mt-brand-wordmark__gap" aria-hidden="true">
                &nbsp;
              </span>
              Tanneurs
            </span>
            <span className="sr-only">Maison Tanneurs</span>
            <span
              className={`tech-meta mt-1 ${navMuted}`}
              style={{
                fontSize: scrolled ? "8px" : "9px",
                letterSpacing: scrolled ? "0.26em" : "0.3em",
                transition: "font-size 500ms cubic-bezier(0.4,0,0.2,1), letter-spacing 500ms cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              {t("nav.subtitle")}
            </span>
          </Link>

          {/* Right: utilities */}
          <div className="flex items-center justify-end gap-5 md:gap-6">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label={t("nav.search")}
              className="hidden md:inline-flex tech-label hover:opacity-60"
            >
              {t("nav.search")}
            </button>
            <button
              type="button"
              onClick={openCart}
              aria-label={t("nav.bag")}
              className="tech-label inline-flex items-center gap-2 hover:opacity-60"
            >
              <span>{t("nav.bag")}</span>
              <span
                className={`inline-flex min-w-5 h-5 px-1.5 items-center justify-center rounded-full border text-[10px] leading-none transition-transform duration-200 ${
                  cartPulse ? "scale-110" : "scale-100"
                } ${cartCount > 0 ? "bg-[#0f0f0f] text-white border-[#0f0f0f]" : onHero ? "bg-white/10 text-white border-white/35" : "bg-white text-[#0f0f0f] border-[#0f0f0f]/15"}`}
              >
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Row 3 — horizontal nav with sliding underline */}
        <nav
          className={`hidden md:flex justify-center items-center border-t ${navRule} transition-[height] duration-500 ${
            scrolled ? "h-9" : "h-11"
          }`}
          aria-label="Primary"
        >
          <ul className="flex items-center gap-[clamp(28px,3.6vw,56px)]">
            {NAV_ITEMS.map((item) => {
              const active = isItemActive(item.href, pathname, locale);
              return (
                <li key={item.labelKey} className="relative">
                  <Link
                    href={href(item.href)}
                    className={`mt-nav-link tech-label inline-block py-2 ${navInk}`}
                    aria-current={active ? "page" : undefined}
                    data-active={active ? "true" : undefined}
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Search overlay */}
        {searchOpen && (
          <div className="border-t border-[#e5e5e5] bg-white px-6 py-6">
            <form
              onSubmit={submitSearch}
              className="max-w-[640px] mx-auto flex items-stretch border-b border-[#0f0f0f]"
            >
              <input
                autoFocus
                type="search"
                placeholder={t("search.placeholder")}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="flex-1 py-3 text-[15px] bg-transparent outline-none text-[#0f0f0f] placeholder:text-[#6b6b6b]"
                style={{ letterSpacing: "-0.01em" }}
              />
              <button type="submit" className="tech-label px-4 text-[#0f0f0f]">
                {t("nav.search")}
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      {drawer && (
        <>
          <div
            onClick={() => setDrawer(false)}
            className="md:hidden fixed inset-0 bg-[#0f0f0f]/55 z-[70] backdrop-blur-sm"
            aria-hidden
          />
          <aside
            className="md:hidden fixed left-0 top-0 bottom-0 w-[88vw] max-w-[380px] z-[71] bg-white overflow-y-auto"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e5e5e5]">
              <span className="mt-brand-wordmark mt-brand-wordmark--drawer text-[#0f0f0f]" aria-hidden="true">
                Maison
                <span className="mt-brand-wordmark__gap" aria-hidden="true">
                  &nbsp;
                </span>
                Tanneurs
              </span>
              <span className="sr-only">Maison Tanneurs</span>
              <button
                onClick={() => setDrawer(false)}
                aria-label={t("nav.closeMenu")}
                className="h-11 w-11 -mr-2 inline-flex items-center justify-center text-[#0f0f0f]"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden
                >
                  <path d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>

            <nav className="px-6 pt-10 pb-8 flex flex-col">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.labelKey}
                  href={href(item.href)}
                  onClick={() => setDrawer(false)}
                  className="py-4 border-b border-[#e5e5e5] text-[#0f0f0f]"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "26px",
                    letterSpacing: "-0.01em",
                    fontWeight: 400,
                  }}
                >
                  {t(item.labelKey)}
                </Link>
              ))}

              <div className="mt-10 flex flex-col gap-5">
                <Link
                  href={href("/legal/care")}
                  onClick={() => setDrawer(false)}
                  className="tech-label opacity-70 text-[#0f0f0f]"
                >
                  {t("nav.careGuide")}
                </Link>
                <Link
                  href={href("/legal/shipping")}
                  onClick={() => setDrawer(false)}
                  className="tech-label opacity-70 text-[#0f0f0f]"
                >
                  {t("footer.shipping")}
                </Link>
                <Link
                  href={href("/legal/returns")}
                  onClick={() => setDrawer(false)}
                  className="tech-label opacity-70 text-[#0f0f0f]"
                >
                  {t("footer.returns")}
                </Link>
                <Link
                  href={href("/legal/repair")}
                  onClick={() => setDrawer(false)}
                  className="tech-label opacity-70 text-[#0f0f0f]"
                >
                  {t("footer.repairGuarantee")}
                </Link>
              </div>

              <div className="mt-10 pt-6 border-t border-[#e5e5e5] flex items-center gap-3">
                {LOCALES.map((l, i) => (
                  <span key={l} className="inline-flex items-center gap-3">
                    {i > 0 && <span aria-hidden className="opacity-30">·</span>}
                    <Link
                      href={switchLocaleHref(l)}
                      onClick={() => setDrawer(false)}
                      hrefLang={l}
                      className={`tech-label ${l === locale ? "text-[#0f0f0f]" : "text-[#0f0f0f]/45"}`}
                      aria-current={l === locale ? "true" : undefined}
                    >
                      {LOCALE_LABELS[l]}
                    </Link>
                  </span>
                ))}
              </div>

              <p
                className="mt-10 text-[#0f0f0f]/55"
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "14px",
                  lineHeight: 1.5,
                }}
              >
                {t("nav.subtitle")}
              </p>
            </nav>
          </aside>
        </>
      )}
    </>
  );
}
