"use client";

import Link from "next/link";
import { useState } from "react";

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Nitra",
    links: [
      { label: "About", href: "/about" },
      { label: "Drops", href: "/products" },
      { label: "Press", href: "mailto:hello@nitra.com?subject=Press%20inquiry" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact", href: "mailto:hello@nitra.com" },
      { label: "Shipping", href: "/legal/shipping" },
      { label: "Returns", href: "/legal/returns" },
      { label: "Size & Care", href: "/legal/care" },
    ],
  },
  {
    title: "Trade",
    links: [
      { label: "Wholesale", href: "mailto:hello@nitra.com?subject=Wholesale" },
      { label: "Collabs", href: "mailto:hello@nitra.com?subject=Collab" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms of Sale", href: "/legal/terms" },
      { label: "Returns Policy", href: "/legal/returns" },
    ],
  },
];

const SOCIAL = [
  { label: "Instagram", href: "https://www.instagram.com/nitra" },
  { label: "TikTok", href: "https://www.tiktok.com/@nitra" },
];

const REGIONS = [
  { label: "Europe", items: ["France", "United Kingdom", "Germany", "Italy", "Spain"] },
  { label: "Americas", items: ["United States", "Canada", "Brazil"] },
  { label: "Middle East & Africa", items: ["Morocco", "United Arab Emirates", "Saudi Arabia"] },
  { label: "Asia & Pacific", items: ["Japan", "Singapore", "Australia"] },
];

type NewsletterStatus = "idle" | "submitting" | "ok" | "error";

export default function Footer() {
  const [openCountry, setOpenCountry] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
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
        body: JSON.stringify({ email, consent }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error || "Could not subscribe right now.");
        return;
      }
      setStatus("ok");
      setMessage("Thank you — a welcome note is on its way to your inbox.");
      setEmail("");
      setConsent(false);
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <footer className="bg-white border-t border-[var(--color-rule)]">
      {/* Newsletter band */}
      <div className="bg-[var(--color-bg-alt)] border-b border-[var(--color-rule)]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-12 md:py-16 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 items-center">
          <div>
            <div className="rb-eyebrow mb-3">Newsletter</div>
            <h3 className="rb-h2 max-w-[28ch]">
              Drops and dispatches. No noise.
            </h3>
          </div>
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col gap-3"
            aria-live="polite"
          >
            <div className="flex items-stretch border border-[var(--color-ink)]">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === "submitting"}
                className="flex-1 px-4 py-3.5 text-[14px] bg-transparent outline-none placeholder:text-[var(--color-mineral)] disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="px-5 bg-[var(--color-ink)] text-white text-[11px] tracking-[0.12em] uppercase font-medium disabled:opacity-60"
              >
                {status === "submitting" ? "Sending…" : "Subscribe"}
              </button>
            </div>
            <label className="flex items-start gap-2 text-[11px] leading-[1.5] text-[var(--color-muted)]">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                I agree to receive newsletters from Nitra and accept the{" "}
                <Link href="/legal/privacy" className="underline">
                  privacy policy
                </Link>
                .
              </span>
            </label>
            {message && (
              <p
                className={`text-[12px] mt-1 ${
                  status === "ok" ? "text-[var(--color-cedar)]" : "text-[#a44]"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Multi-column links */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pt-14 pb-10 grid grid-cols-2 md:grid-cols-4 gap-10">
        {COLS.map((c) => (
          <div key={c.title}>
            <h5 className="text-[12px] tracking-[0.1em] uppercase font-medium text-[var(--color-ink)] mb-4">
              {c.title}
            </h5>
            <ul className="space-y-2.5">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[13px] text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Brand statement strip */}
      <div className="border-t border-[var(--color-rule)] py-10">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center md:justify-between gap-6">
          <div className="text-[13px] tracking-[0.18em] uppercase text-[var(--color-ink)] font-medium">
            Rooted in the Maghreb · Made for now
          </div>
          <div className="flex items-center gap-5">
            {SOCIAL.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="text-[11px] tracking-[0.06em] uppercase text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom utility row */}
      <div className="border-t border-[var(--color-rule)] bg-[var(--color-bg-alt)]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-[11px] text-[var(--color-muted)]">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/about" className="hover:text-[var(--color-ink)]">Contact</Link>
            <Link href="/about" className="hover:text-[var(--color-ink)]">Store locator</Link>
            <Link href="/about" className="hover:text-[var(--color-ink)]">Privacy</Link>
            <Link href="/about" className="hover:text-[var(--color-ink)]">Cookie preferences</Link>
            <Link href="/about" className="hover:text-[var(--color-ink)]">Legal notices</Link>
            <Link href="/about" className="hover:text-[var(--color-ink)]">Accessibility</Link>
          </div>
          <div className="flex items-center gap-5">
            <button
              onClick={() => setOpenCountry((v) => !v)}
              className="inline-flex items-center gap-1.5 hover:text-[var(--color-ink)] transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
              </svg>
              United States · English
            </button>
            <span>© {new Date().getFullYear()} Nitra</span>
          </div>
        </div>
      </div>

      {/* Country selector modal */}
      {openCountry && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setOpenCountry(false)}
        >
          <div
            className="bg-white max-w-[860px] w-full max-h-[80vh] overflow-y-auto p-8 md:p-12"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-8">
              <h3 className="rb-h2">Choose your country</h3>
              <button
                onClick={() => setOpenCountry(false)}
                aria-label="Close"
                className="text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {REGIONS.map((r) => (
                <div key={r.label}>
                  <div className="rb-meta mb-3">{r.label}</div>
                  <ul className="space-y-2">
                    {r.items.map((c) => (
                      <li key={c}>
                        <button className="text-[13px] text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors">
                          {c}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
