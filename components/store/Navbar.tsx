"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/store/CartProvider";

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Shop", href: "/products" },
  { label: "Care", href: "/legal/care" },
  { label: "Story", href: "/about" },
  { label: "Contact", href: "mailto:hello@maisontanneurs.com" },
];

const NAV_LINK_CLASS =
  "text-[11px] font-medium uppercase tracking-[0.18em] transition-colors";

export default function Navbar() {
  const router = useRouter();
  const { items, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchValue.trim();
    setSearchOpen(false);
    setSearchValue("");
    if (q) router.push(`/products?q=${encodeURIComponent(q)}`);
    else router.push("/products");
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 320);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Transparent over hero (ivory text), paper-white on scroll (charcoal text).
  const linkColor = scrolled
    ? "text-[color:var(--color-ink)]"
    : "text-[color:var(--color-ivory)]";
  const linkHover = scrolled
    ? "hover:text-[color:var(--color-cognac)]"
    : "hover:opacity-70";

  return (
    <header
      className={`fixed top-[40px] inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[color:var(--color-paper)]/95 backdrop-blur-md shadow-[0_1px_0_var(--color-rule)]"
          : "bg-transparent"
      }`}
    >
      <div className="relative h-[64px] md:h-[76px] flex items-center px-5 md:px-10">
        <div className="flex items-center gap-8 z-10">
          <button
            onClick={() => setDrawer((v) => !v)}
            aria-label="Menu"
            aria-expanded={drawer}
            className={`md:hidden inline-flex items-center transition-colors ${linkColor} ${linkHover}`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>

          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {NAV_LINKS.slice(0, 2).map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={`${NAV_LINK_CLASS} ${linkColor} ${linkHover}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Centered brand monogram — invert when over hero only */}
        <Link
          href="/"
          aria-label="Maison Tanneurs"
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none flex items-center gap-3 transition-colors ${linkColor}`}
        >
          <Image
            src="/brand/maison-tanneurs.png"
            alt=""
            width={2048}
            height={2048}
            priority
            className={`h-[40px] md:h-[44px] w-auto transition-[filter] duration-500 ${
              scrolled ? "" : "invert"
            }`}
          />
          <span
            className="hidden sm:inline tracking-[0.22em] text-[12px] md:text-[13px]"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 600 }}
          >
            MAISON TANNEURS
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-5 md:gap-7 z-10">
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {NAV_LINKS.slice(2).map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={`${NAV_LINK_CLASS} ${linkColor} ${linkHover}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div
            className={`flex items-center gap-4 md:gap-5 md:ml-2 md:pl-5 md:border-l transition-colors ${
              scrolled
                ? "md:border-[color:var(--color-rule)]"
                : "md:border-[color:var(--color-ivory)]/30"
            }`}
          >
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              className={`hidden md:inline-flex transition-colors ${linkColor} ${linkHover}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
            <button
              onClick={openCart}
              aria-label="Cart"
              className={`relative transition-colors ${linkColor} ${linkHover}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 8h16l-1 11a2 2 0 0 1-2 1.75H7a2 2 0 0 1-2-1.75L4 8z" />
                <path d="M8 8V6a4 4 0 0 1 8 0v2" />
              </svg>
              {cartCount > 0 && (
                <span
                  className={`absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-medium flex items-center justify-center ${
                    scrolled
                      ? "bg-[color:var(--color-ink)] text-[color:var(--color-paper)]"
                      : "bg-[color:var(--color-ivory)] text-[color:var(--color-warm-black)]"
                  }`}
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search overlay — paper-white panel with charcoal text */}
      {searchOpen && (
        <div className="absolute top-full inset-x-0 bg-[color:var(--color-paper)] border-t border-[color:var(--color-rule)] px-6 md:px-10 py-6">
          <form onSubmit={submitSearch} className="max-w-[640px] mx-auto">
            <div className="flex items-stretch border-b border-[color:var(--color-ink)]">
              <input
                autoFocus
                type="search"
                placeholder="Search pieces, drops, stories"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="flex-1 py-3 text-[16px] bg-transparent outline-none text-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-muted)]"
                style={{ fontFamily: "var(--font-sans)" }}
              />
              <button type="submit" className="ed-eyebrow px-3 text-[color:var(--color-ink)]">
                Search
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile drawer — paper-white, charcoal ink */}
      {drawer && (
        <>
          <div
            onClick={() => setDrawer(false)}
            className="md:hidden fixed inset-0 bg-[color:var(--color-warm-black)]/45 backdrop-blur-sm z-40"
            aria-hidden
          />
          <aside
            className="md:hidden fixed left-0 top-0 bottom-0 w-[300px] z-50 overflow-y-auto"
            style={{
              background: "var(--color-paper)",
              color: "var(--color-ink)",
            }}
          >
            <div className="flex items-center justify-between px-7 py-5 border-b border-[color:var(--color-rule)]">
              <span
                className="text-[11px] font-medium tracking-[0.22em] uppercase text-[color:var(--color-bronze)]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Menu
              </span>
              <button
                onClick={() => setDrawer(false)}
                aria-label="Close menu"
                className="text-[color:var(--color-ink)]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>
            <nav className="px-7 py-8 flex flex-col gap-6">
              <div className="ed-eyebrow">Browse</div>
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setDrawer(false)}
                  className="text-[15px] tracking-[0.06em] uppercase font-medium text-[color:var(--color-ink)]"
                >
                  {l.label}
                </Link>
              ))}
              <div className="h-px bg-[color:var(--color-rule)] my-2" />
              <div className="ed-eyebrow">Help</div>
              <Link
                href="/legal/shipping"
                onClick={() => setDrawer(false)}
                className="text-[13px] text-[color:var(--color-ink-soft)]"
              >
                Shipping
              </Link>
              <Link
                href="/legal/returns"
                onClick={() => setDrawer(false)}
                className="text-[13px] text-[color:var(--color-ink-soft)]"
              >
                Returns
              </Link>
              <Link
                href="/legal/faq"
                onClick={() => setDrawer(false)}
                className="text-[13px] text-[color:var(--color-ink-soft)]"
              >
                FAQ
              </Link>
            </nav>
          </aside>
        </>
      )}
    </header>
  );
}
