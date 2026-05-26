"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/store/CartProvider";

const NAV_LEFT = [
  { label: "Collection", href: "/products" },
  { label: "Atelier", href: "/about" },
  { label: "Journal", href: "/feed" },
];

export default function Navbar() {
  const router = useRouter();
  const { items, openCart } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);
  const prevCartCountRef = useRef(cartCount);

  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawer(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawer]);

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
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#e5e5e5]">
      <div className="hidden md:flex h-7 items-center justify-between px-6 border-b border-[#e5e5e5] text-[#0f0f0f]/70">
        <span className="tech-meta">SHIPPING WORLDWIDE — FROM MARRAKECH</span>
        <span className="tech-meta">EN · FR · AR</span>
        <span className="tech-meta">EDITION 04 / SPRING 2026</span>
      </div>

      <div className="grid grid-cols-3 items-center h-14 px-5 md:px-6">
        <nav className="flex items-center gap-5 md:gap-8">
          <button
            type="button"
            onClick={() => setDrawer((v) => !v)}
            aria-label="Open menu"
            aria-expanded={drawer}
            className="md:hidden inline-flex items-center text-[#0f0f0f]"
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
            href="/"
            aria-label="Maison Tanneurs"
            className="flex h-6 w-6 items-center justify-center border border-[#0f0f0f]"
          >
            <span className="tech-label text-[#0f0f0f]">MT</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LEFT.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="tech-label hover:opacity-60"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="flex justify-center">
          <Link
            href="/"
            aria-label="Maison Tanneurs home"
            className="font-medium"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(14px, 1.4vw, 18px)",
              letterSpacing: "0.34em",
            }}
          >
            MAISON&nbsp;&nbsp;TANNEURS
          </Link>
        </div>

        <div className="flex items-center justify-end gap-5 md:gap-6">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Search"
            className="hidden md:inline-flex tech-label hover:opacity-60"
          >
            Search
          </button>
          <button
            type="button"
            onClick={openCart}
            aria-label="Bag"
            className="tech-label inline-flex items-center gap-2 hover:opacity-60"
          >
            <span>Bag</span>
            <span
              className={`inline-flex min-w-5 h-5 px-1.5 items-center justify-center rounded-full border border-[#0f0f0f]/15 text-[10px] leading-none transition-transform duration-200 ${
                cartPulse ? "scale-110" : "scale-100"
              } ${cartCount > 0 ? "bg-[#0f0f0f] text-white" : "bg-white text-[#0f0f0f]"}`}
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
              placeholder="Search objects, drops, dossiers"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1 py-3 text-[15px] bg-transparent outline-none text-[#0f0f0f] placeholder:text-[#6b6b6b]"
              style={{ letterSpacing: "-0.01em" }}
            />
            <button type="submit" className="tech-label px-4 text-[#0f0f0f]">
              Search
            </button>
          </form>
        </div>
      )}

      {drawer && (
        <>
          <div
            onClick={() => setDrawer(false)}
            className="md:hidden fixed inset-0 bg-[#0f0f0f]/45 z-40"
            aria-hidden
          />
          <aside
            className="md:hidden fixed left-0 top-0 bottom-0 w-[300px] z-50 bg-white border-r border-[#e5e5e5] overflow-y-auto"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5e5]">
              <span className="tech-label opacity-60">Menu</span>
              <button
                onClick={() => setDrawer(false)}
                aria-label="Close menu"
                className="text-[#0f0f0f]"
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
            <nav className="px-6 py-8 flex flex-col gap-6">
              {NAV_LEFT.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setDrawer(false)}
                  className="tech-label text-[#0f0f0f] text-[13px]"
                >
                  {l.label}
                </Link>
              ))}
              <div className="h-px bg-[#e5e5e5] my-2" />
              <Link
                href="/legal/care"
                onClick={() => setDrawer(false)}
                className="tech-meta text-[#0f0f0f]/70"
              >
                Care Guide
              </Link>
              <Link
                href="/legal/shipping"
                onClick={() => setDrawer(false)}
                className="tech-meta text-[#0f0f0f]/70"
              >
                Shipping
              </Link>
              <Link
                href="/legal/returns"
                onClick={() => setDrawer(false)}
                className="tech-meta text-[#0f0f0f]/70"
              >
                Returns
              </Link>
            </nav>
          </aside>
        </>
      )}
    </header>
  );
}
