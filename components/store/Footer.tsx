import Link from "next/link";
import NewsletterSignup from "@/components/store/NewsletterSignup";

type ColumnDef = { title: string; links: { label: string; href: string }[] };

const COLUMNS: ColumnDef[] = [
  {
    title: "Collection",
    links: [
      { label: "All Objects", href: "/products" },
      { label: "Weekender", href: "/products?category=Duffles" },
      { label: "Tote", href: "/products?category=Totes" },
      { label: "Crossbody", href: "/products?category=Crossbody" },
      { label: "Archive", href: "/products?archive=1" },
    ],
  },
  {
    title: "Atelier",
    links: [
      { label: "The Tannery", href: "/about" },
      { label: "Artisans", href: "/about#artisans" },
      { label: "Materials", href: "/legal/care" },
      { label: "Method", href: "#atelier" },
    ],
  },
  {
    title: "Journal",
    links: [
      { label: "Field Notes", href: "/feed" },
      { label: "Dispatches", href: "/feed" },
      { label: "Lookbook", href: "/feed" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Care Guide", href: "/legal/care" },
      { label: "Shipping", href: "/legal/shipping" },
      { label: "Returns", href: "/legal/returns" },
      { label: "FAQ", href: "/legal/faq" },
      { label: "Contact", href: "mailto:hello@maisontanneurs.com" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Instagram", href: "https://instagram.com/maisontanneurs" },
      {
        label: "Atelier List",
        href: "mailto:hello@maisontanneurs.com?subject=Atelier%20List",
      },
      {
        label: "Trade Inquiries",
        href: "mailto:hello@maisontanneurs.com?subject=Trade",
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-white text-[#0f0f0f] border-t border-[#e5e5e5]">
      <NewsletterSignup />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-y-10 gap-x-6 px-6 pt-14 pb-10">
        {COLUMNS.map((c) => (
          <Column key={c.title} {...c} />
        ))}
      </div>

      <div className="px-6 pb-2 overflow-hidden" aria-hidden>
        <div
          className="font-semibold leading-[0.85] select-none"
          style={{
            fontFamily: "var(--font-sans)",
            letterSpacing: "-0.05em",
            fontSize: "clamp(80px, 17.2vw, 360px)",
          }}
        >
          MAISON TANNEURS
        </div>
      </div>

      <div className="border-t border-[#e5e5e5]">
        <div className="px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <span className="tech-meta opacity-70">
            Filed in Marrakech — Carried Anywhere.
          </span>
          <span className="tech-meta opacity-70">
            © 2026 Maison Tanneurs · All Rights Reserved
          </span>
          <div className="flex items-center gap-6 tech-meta opacity-70">
            <Link
              href="/legal/privacy"
              className="hover:underline underline-offset-4"
            >
              Privacy
            </Link>
            <Link
              href="/legal/terms"
              className="hover:underline underline-offset-4"
            >
              Terms
            </Link>
            <Link
              href="/legal/accessibility"
              className="hover:underline underline-offset-4"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Column({ title, links }: ColumnDef) {
  return (
    <div>
      <h4
        className="font-medium"
        style={{ fontSize: "15px", letterSpacing: "-0.015em" }}
      >
        {title}
      </h4>
      <ul className="mt-5 flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="tech-meta opacity-75 hover:opacity-100 hover:underline underline-offset-4"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
