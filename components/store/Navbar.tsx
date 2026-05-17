"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/store/CartProvider";

type MegaSection = {
  label: string;
  href: string;
  groups: { title: string; links: { label: string; href: string }[] }[];
  feature?: { title: string; href: string; image: string };
};

const PRODUCTS_MEGA: MegaSection = {
  label: "Drops",
  href: "/products",
  groups: [
    {
      title: "Tops",
      links: [
        { label: "Tees", href: "/products?category=Tees" },
        { label: "Hoodies", href: "/products?category=Hoodies" },
        { label: "Sweats", href: "/products?category=Sweats" },
      ],
    },
    {
      title: "Headwear",
      links: [
        { label: "Caps", href: "/products?category=Caps" },
        { label: "Scarves", href: "/products?category=Scarves" },
      ],
    },
    {
      title: "Outerwear",
      links: [
        { label: "Jackets", href: "/products?category=Outerwear" },
      ],
    },
  ],
  feature: {
    title: "Drop 01 · June 2026",
    href: "/products",
    image: "/products/drop-01/atlas-caravan-tee-01.svg",
  },
};

export default function Navbar() {
  const router = useRouter();
  const { items, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const enter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(label);
  };
  const leave = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 120);
  };

  const sections: MegaSection[] = [PRODUCTS_MEGA];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 bg-white transition-shadow duration-200 ${
        scrolled ? "shadow-[0_1px_0_var(--color-rule)]" : ""
      }`}
      onMouseLeave={leave}
    >
      {/* Top utility — small */}
      <div className="hidden md:flex items-center justify-end h-7 px-6 lg:px-10 text-[10px] tracking-[0.06em] uppercase text-[var(--color-muted)] border-b border-[var(--color-rule-soft)]">
        <div className="flex items-center gap-5">
          <span className="text-[var(--color-mineral)]">Ships worldwide · POD-fulfilled from US/EU</span>
          <span aria-hidden>·</span>
          <button className="hover:text-[var(--color-ink)] transition-colors">EN</button>
          <button className="opacity-50 hover:opacity-100 transition-opacity">FR</button>
        </div>
      </div>

      {/* Main bar */}
      <div className="relative h-[72px] md:h-[88px] flex items-center px-5 md:px-10">
        {/* Left cluster */}
        <div className="flex items-center gap-6 md:gap-10 z-10">
          <button
            onClick={() => setDrawer((v) => !v)}
            aria-label="Menu"
            aria-expanded={drawer}
            className="inline-flex items-center gap-2 text-[12px] tracking-[0.1em] uppercase text-[var(--color-ink)] hover:text-[var(--color-brass-hi)] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
            <span className="hidden md:inline">Menu</span>
          </button>
          <button
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Search"
            aria-expanded={searchOpen}
            className="hidden md:inline-flex items-center gap-2 text-[12px] tracking-[0.1em] uppercase text-[var(--color-ink)] hover:text-[var(--color-brass-hi)] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <span>Search</span>
          </button>
        </div>

        {/* Centered wordmark */}
        <Link
          href="/"
          aria-label="Nitra"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap flex flex-col items-center gap-[5px] leading-none"
        >
          <span className="font-sans text-[22px] md:text-[28px] tracking-[-0.018em] lowercase text-[var(--color-ink)] font-extrabold">
            nitra
          </span>
          <span className="font-sans text-[8px] md:text-[9px] tracking-[0.55em] font-semibold uppercase text-[var(--color-ink)] opacity-60 pl-[0.55em]">
            Maghreb · Made for now
          </span>
        </Link>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-5 md:gap-7 z-10">
          {sections.map((s) => (
            <div
              key={s.label}
              onMouseEnter={() => enter(s.label)}
              className="h-full hidden md:flex items-center"
            >
              <Link
                href={s.href}
                className={`text-[12px] tracking-[0.1em] uppercase font-medium transition-colors ${
                  open === s.label
                    ? "text-[var(--color-brass-hi)]"
                    : "text-[var(--color-ink)] hover:text-[var(--color-brass-hi)]"
                }`}
              >
                {s.label}
              </Link>
            </div>
          ))}

          {/* About — editorial wing, no mega menu */}
          <div
            onMouseEnter={leave}
            className="h-full hidden md:flex items-center"
          >
            <Link
              href="/about"
              className="text-[12px] tracking-[0.1em] uppercase font-medium text-[var(--color-ink)] hover:text-[var(--color-brass-hi)] transition-colors"
            >
              About
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-3 md:gap-4 md:ml-3 md:pl-5 md:border-l md:border-[var(--color-rule)]">
            <Link href="/products" aria-label="Browse the catalogue" className="hidden md:inline-flex flex-col items-center text-[var(--color-ink)] hover:text-[var(--color-brass-hi)] transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 8h16l-1 11a2 2 0 0 1-2 1.75H7a2 2 0 0 1-2-1.75L4 8z" />
                <path d="M8 8V6a4 4 0 0 1 8 0v2" />
              </svg>
              <span className="text-[8px] tracking-[0.1em] uppercase mt-0.5">Online shopping</span>
            </Link>
            <button onClick={openCart} aria-label="Cart" className="relative text-[var(--color-ink)] hover:text-[var(--color-brass-hi)] transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 7h12l-1.5 12.5a2 2 0 0 1-2 1.75h-5a2 2 0 0 1-2-1.75L6 7z" />
                <path d="M9 7V5a3 3 0 0 1 6 0v2" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 bg-[var(--color-ink)] text-white text-[9px] rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mega panel */}
        {open && (
          <div
            className={`rb-mega ${open ? "open" : ""}`}
            onMouseEnter={() => enter(open)}
            onMouseLeave={leave}
          >
            {(() => {
              const section = sections.find((s) => s.label === open);
              if (!section) return null;
              return (
                <div className="mx-auto max-w-[1280px] grid grid-cols-12 gap-8 px-10 py-10">
                  <div className="col-span-2 rb-eyebrow self-start">{section.label}</div>
                  <div className={`${section.feature ? "col-span-7" : "col-span-10"} grid grid-cols-4 gap-8`}>
                    {section.groups.map((g) => (
                      <div key={g.title}>
                        <div className="rb-meta mb-3">{g.title}</div>
                        <ul className="space-y-2.5">
                          {g.links.map((l) => (
                            <li key={l.label}>
                              <Link
                                href={l.href}
                                className="text-[13px] text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
                                onClick={() => setOpen(null)}
                              >
                                {l.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  {section.feature && (
                    <div className="col-span-3">
                      <Link
                        href={section.feature.href}
                        className="block group"
                        onClick={() => setOpen(null)}
                      >
                        <div className="relative aspect-[4/3] bg-[var(--rb-card-bg)] overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={section.feature.image}
                            alt={section.feature.title}
                            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        </div>
                        <div className="mt-3 rb-meta">Featured</div>
                        <div className="text-[15px] font-light mt-1 text-[var(--color-ink)]">{section.feature.title}</div>
                        <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] tracking-[0.08em] uppercase text-[var(--color-brass-hi)]">
                          Discover <span aria-hidden>→</span>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div className="border-t border-[var(--color-rule)] bg-white px-6 md:px-10 py-5">
          <form onSubmit={submitSearch} className="max-w-[720px] mx-auto flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-muted)] flex-none">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              autoFocus
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search for pieces, materials, or atelier names…"
              className="flex-1 bg-transparent border-0 outline-none text-[15px] text-[var(--color-ink)] placeholder:text-[var(--color-muted)]"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="text-[11px] tracking-[0.1em] uppercase text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
            >
              Close
            </button>
          </form>
        </div>
      )}

      {/* Slide-out drawer (works on all viewports) */}
      {drawer && (
        <>
          <div
            onClick={() => setDrawer(false)}
            className="fixed inset-0 top-[72px] md:top-[120px] bg-black/30 z-40"
            aria-hidden
          />
          <aside className="fixed left-0 top-[72px] md:top-[120px] bottom-0 w-[300px] md:w-[340px] bg-white border-r border-[var(--color-rule)] z-50 overflow-y-auto">
            <nav className="px-6 py-8 flex flex-col gap-5">
              <div className="rb-eyebrow text-[var(--color-mineral)]">Browse</div>
              <Link href="/products" onClick={() => setDrawer(false)} className="text-[14px] tracking-[0.04em] font-medium text-[var(--color-ink)] uppercase">
                All Products
              </Link>
              <Link href="/products?category=Pendants" onClick={() => setDrawer(false)} className="text-[13px] text-[var(--color-ink-soft)]">Lighting</Link>
              <Link href="/products?category=Poufs" onClick={() => setDrawer(false)} className="text-[13px] text-[var(--color-ink-soft)]">Poufs</Link>
              <Link href="/products?category=Tables" onClick={() => setDrawer(false)} className="text-[13px] text-[var(--color-ink-soft)]">Tables</Link>
              <Link href="/products?category=Furniture" onClick={() => setDrawer(false)} className="text-[13px] text-[var(--color-ink-soft)]">Furniture</Link>
              <Link href="/products?category=Vessels" onClick={() => setDrawer(false)} className="text-[13px] text-[var(--color-ink-soft)]">Vessels</Link>
              <Link href="/products?category=Wall%20Plates" onClick={() => setDrawer(false)} className="text-[13px] text-[var(--color-ink-soft)]">Wall Plates</Link>

              <div className="h-px bg-[var(--color-rule)] my-2" />
              <div className="rb-eyebrow text-[var(--color-mineral)]">The House</div>
              <Link href="/atelier" onClick={() => setDrawer(false)} className="text-[14px] tracking-[0.04em] font-medium text-[var(--color-ink)] uppercase">The Atelier</Link>
              <Link href="/about" onClick={() => setDrawer(false)} className="text-[13px] text-[var(--color-ink-soft)]">About</Link>

              <div className="h-px bg-[var(--color-rule)] my-2" />
              <div className="rb-eyebrow text-[var(--color-mineral)]">Help</div>
              <Link href="/legal/shipping" onClick={() => setDrawer(false)} className="text-[13px] text-[var(--color-ink-soft)]">Shipping</Link>
              <Link href="/legal/returns" onClick={() => setDrawer(false)} className="text-[13px] text-[var(--color-ink-soft)]">Returns</Link>
              <Link href="/legal/care" onClick={() => setDrawer(false)} className="text-[13px] text-[var(--color-ink-soft)]">Care</Link>
              <Link href="/legal/faq" onClick={() => setDrawer(false)} className="text-[13px] text-[var(--color-ink-soft)]">FAQ</Link>
              <a href="mailto:atelier@nitra.com" onClick={() => setDrawer(false)} className="text-[13px] text-[var(--color-ink-soft)]">Contact</a>
            </nav>
          </aside>
        </>
      )}
    </header>
  );
}
