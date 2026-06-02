"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/components/store/CartProvider";
import { LOCALES, LOCALE_LABELS } from "@/lib/i18n";
import { useLocale, useLocalizedHref, useSwitchLocaleHref, useT } from "@/lib/i18n-client";

const NAV_LEFT = [
  { labelKey: "nav.collection", href: "/products" },
  { labelKey: "nav.savoirFaire", href: "/about#atelier" },
  { labelKey: "nav.contact", href: "/contact" },
];

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

  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawer(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawer]);

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
    <header
      className={`fixed top-0 z-50 w-full border-b transition-colors duration-500 ${
        onHero ? "bg-transparent text-white border-white/20" : "bg-white/95 text-[#0f0f0f] border-[#e5e5e5] backdrop-blur"
      }`}
    >
      <div className={`hidden md:flex h-7 items-center justify-between px-6 border-b ${navRule} ${navMuted}`}>
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

      <div className={`grid grid-cols-3 items-center px-5 md:px-6 transition-[height] duration-500 ${scrolled ? "h-12" : "h-14"}`}>
        <nav className="flex items-center gap-5 md:gap-8">
          <button
            type="button"
            onClick={() => setDrawer((v) => !v)}
            aria-label="Open menu"
            aria-expanded={drawer}
            className={`md:hidden inline-flex h-11 w-11 -ml-2 items-center justify-center ${navInk}`}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>

          <Link
            href={href("/")}
            aria-label="Maison Tanneurs"
            className="hidden md:flex h-9 w-9 items-center justify-center"
          >
            <img
              src="/brand/logos/mt-monogram.png"
              alt=""
              aria-hidden="true"
              className={`h-8 w-8 object-contain transition-[filter] duration-500 ${onHero ? "invert" : ""}`}
              width={32}
              height={32}
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LEFT.map((l) => (
              <Link
                key={l.labelKey}
                href={href(l.href)}
              className="tech-label hover:opacity-60"
              >
                {t(l.labelKey)}
              </Link>
            ))}
          </div>
        </nav>

        <div className="flex justify-center">
          <Link
            href={href("/")}
            aria-label="Maison Tanneurs home"
            className="font-medium"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(14px, 1.4vw, 18px)",
              letterSpacing: "clamp(0.2em, 1vw, 0.34em)",
            }}
          >
            MAISON&nbsp;&nbsp;TANNEURS
          </Link>
        </div>

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
              <span
                className="font-medium"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  letterSpacing: "0.28em",
                }}
              >
                MAISON&nbsp;&nbsp;TANNEURS
              </span>
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
              {NAV_LEFT.map((l) => (
                <Link
                  key={l.labelKey}
                  href={href(l.href)}
                  onClick={() => setDrawer(false)}
                  className="py-4 border-b border-[#e5e5e5] text-[#0f0f0f]"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "26px",
                    letterSpacing: "-0.01em",
                    fontWeight: 400,
                  }}
                >
                  {t(l.labelKey)}
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
                Marrakech atelier · stitching leather since 1962.
              </p>
            </nav>
          </aside>
        </>
      )}
    </header>
  );
}
