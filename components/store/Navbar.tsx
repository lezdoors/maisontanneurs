"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/store/CartProvider";

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Shop", href: "/products" },
  { label: "Care", href: "/legal/care" },
  { label: "Story", href: "/about" },
  { label: "Contact", href: "mailto:hello@kechken.com" },
];

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
    // Trigger past the hero fold so nav stays transparent over the hero image
    const onScroll = () => setScrolled(window.scrollY > 320);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Transparent over hero, solid bone after 200px scroll (past hero fold)
  const inkClass = scrolled ? "text-[var(--color-ink)]" : "text-white";
  const hoverClass = scrolled ? "hover:text-[var(--color-bronze-hi)]" : "hover:opacity-65";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[var(--color-bg)]/95 backdrop-blur-md shadow-[0_1px_0_var(--color-rule)]"
          : "bg-transparent"
      }`}
    >
      <div className="relative h-[72px] md:h-[84px] flex items-center px-5 md:px-10">
        {/* Left: menu (mobile) + nav (desktop) */}
        <div className="flex items-center gap-8 z-10">
          <button
            onClick={() => setDrawer((v) => !v)}
            aria-label="Menu"
            aria-expanded={drawer}
            className={`md:hidden inline-flex items-center transition-colors ${inkClass} ${hoverClass}`}
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
                className={`text-[11px] tracking-[0.18em] uppercase font-medium transition-colors ${inkClass} ${hoverClass}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Centered brand monogram */}
        <Link
          href="/"
          aria-label="Maison Tanneurs"
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none flex items-center gap-3 transition-colors ${inkClass}`}
        >
          <Image
            src="/brand/maison-tanneurs.png"
            alt=""
            width={2048}
            height={2048}
            priority
            className={`h-[44px] md:h-[48px] w-auto transition-[filter] duration-500 ${
              scrolled ? "" : "invert"
            }`}
          />
          <span
            className="hidden sm:inline font-serif tracking-[0.18em] text-[14px] md:text-[15px]"
            style={{ fontFamily: "var(--font-serif, 'Cormorant Garamond', 'Times New Roman', serif)" }}
          >
MAISON TANNEURS
          </span>
        </Link>

        {/* Right: desktop nav (2) + icons */}
        <div className="ml-auto flex items-center gap-5 md:gap-7 z-10">
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {NAV_LINKS.slice(2).map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={`text-[11px] tracking-[0.18em] uppercase font-medium transition-colors ${inkClass} ${hoverClass}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className={`flex items-center gap-4 md:gap-5 md:ml-2 md:pl-5 md:border-l transition-colors ${scrolled ? "md:border-[var(--color-rule)]" : "md:border-white/30"}`}>
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              className={`hidden md:inline-flex transition-colors ${inkClass} ${hoverClass}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
            <button
              onClick={openCart}
              aria-label="Cart"
              className={`relative transition-colors ${inkClass} ${hoverClass}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 8h16l-1 11a2 2 0 0 1-2 1.75H7a2 2 0 0 1-2-1.75L4 8z" />
                <path d="M8 8V6a4 4 0 0 1 8 0v2" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-[var(--color-ink)] text-[var(--color-bg)] text-[10px] font-medium flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div className="absolute top-full inset-x-0 bg-[var(--color-bg)] border-t border-[var(--color-rule)] px-6 md:px-10 py-6">
          <form onSubmit={submitSearch} className="max-w-[640px] mx-auto">
            <div className="flex items-stretch border-b border-[var(--color-ink)]">
              <input
                autoFocus
                type="search"
                placeholder="Search pieces, drops, stories"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="flex-1 py-3 text-[16px] bg-transparent outline-none placeholder:text-[var(--color-mineral)]"
              />
              <button type="submit" className="ed-eyebrow text-[var(--color-ink)] px-3">
                Search
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile slide-out drawer */}
      {drawer && (
        <>
          <div
            onClick={() => setDrawer(false)}
            className="md:hidden fixed inset-0 top-[72px] bg-black/30 z-40"
            aria-hidden
          />
          <aside className="md:hidden fixed left-0 top-[72px] bottom-0 w-[300px] bg-[var(--color-bg)] border-r border-[var(--color-rule)] z-50 overflow-y-auto">
            <nav className="px-7 py-10 flex flex-col gap-7">
              <div className="ed-eyebrow text-[var(--color-mineral)]">Browse</div>
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setDrawer(false)}
                  className="text-[16px] tracking-[0.04em] uppercase font-medium text-[var(--color-ink)]"
                >
                  {l.label}
                </Link>
              ))}

              <div className="h-px bg-[var(--color-rule)] my-2" />
              <div className="ed-eyebrow text-[var(--color-mineral)]">Help</div>
              <Link href="/legal/shipping" onClick={() => setDrawer(false)} className="text-[13px] text-[var(--color-ink-soft)]">Shipping</Link>
              <Link href="/legal/returns" onClick={() => setDrawer(false)} className="text-[13px] text-[var(--color-ink-soft)]">Returns</Link>
              <Link href="/legal/faq" onClick={() => setDrawer(false)} className="text-[13px] text-[var(--color-ink-soft)]">FAQ</Link>
            </nav>
          </aside>
        </>
      )}
    </header>
  );
}
