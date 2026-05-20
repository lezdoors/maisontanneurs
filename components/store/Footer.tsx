"use client";

import Link from "next/link";
import { useState } from "react";

const SHOP_LINKS = [
  { label: "New Drop", href: "/products" },
  { label: "Bags", href: "/products?category=Leather%20Goods" },
];

const HOUSE_LINKS = [
  { label: "The Story", href: "/about" },
  { label: "The Atelier", href: "/about" },
  { label: "Press", href: "mailto:hello@kechken.com?subject=Press" },
];

const HELP_LINKS = [
  { label: "Shipping", href: "/legal/shipping" },
  { label: "Returns", href: "/legal/returns" },
  { label: "Care", href: "/legal/care" },
  { label: "Contact", href: "mailto:hello@kechken.com" },
];

const SOCIAL = [
  { label: "Instagram", href: "https://www.instagram.com/kechken" },
  { label: "TikTok", href: "https://www.tiktok.com/@kechken" },
];

type NewsletterStatus = "idle" | "submitting" | "ok" | "error";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<NewsletterStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error || "Could not subscribe right now.");
        return;
      }
      setStatus("ok");
      setMessage("Thank you. We'll be in touch.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <footer className="bg-[var(--color-bg-dark)] text-white">
      {/* Newsletter editorial band */}
      <div className="border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 items-end">
          <div>
            <div className="ed-eyebrow text-white/55 mb-5">The List</div>
            <h3 className="ed-footer-headline text-white max-w-[18ch]">
              Quiet correspondence. Drops, dispatches, nothing else.
            </h3>
          </div>
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col gap-3 md:pb-3"
            aria-live="polite"
          >
            <div className="flex items-stretch border-b border-white">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === "submitting"}
                className="flex-1 py-3.5 text-[15px] bg-transparent outline-none placeholder:text-white/40 text-white disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="ed-eyebrow text-white px-3 disabled:opacity-60"
              >
                {status === "submitting" ? "Sending…" : "Join"}
              </button>
            </div>
            {message && (
              <p
                className={`text-[12px] ${
                  status === "ok" ? "text-white/85" : "text-[#e88a78]"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Link columns */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 pt-16 pb-12 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
        <div>
          <div className="ed-eyebrow text-white/55 mb-5">Shop</div>
          <ul className="space-y-3">
            {SHOP_LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-[13px] text-white/75 hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="ed-eyebrow text-white/55 mb-5">House</div>
          <ul className="space-y-3">
            {HOUSE_LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-[13px] text-white/75 hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="ed-eyebrow text-white/55 mb-5">Help</div>
          <ul className="space-y-3">
            {HELP_LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-[13px] text-white/75 hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="ed-eyebrow text-white/55 mb-5">Follow</div>
          <ul className="space-y-3">
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <Link href={s.href} className="text-[13px] text-white/75 hover:text-white transition-colors">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom utility */}
      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[11px] text-white/55">
          <div className="font-serif italic text-[14px] text-white/75">
            kechken · hand-stitched in marrakech
          </div>
          <div className="flex items-center gap-5 ed-meta">
            <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-white transition-colors">Terms</Link>
            <span>© {new Date().getFullYear()} Kechken</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
