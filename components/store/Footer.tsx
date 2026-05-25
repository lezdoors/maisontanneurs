import Link from "next/link";
import NewsletterSignup from "@/components/store/NewsletterSignup";

type ColumnDef = { title: string; links: { label: string; href: string }[] };

const COLUMNS: ColumnDef[] = [
  {
    title: "Collection",
    links: [
      { label: "All Objects", href: "/products" },
      { label: "Backpacks", href: "/products?category=Backpack" },
      { label: "Crossbody", href: "/products?category=Crossbody" },
      { label: "Totes", href: "/products?category=Tote" },
      { label: "Weekenders", href: "/products?category=Weekender" },
    ],
  },
  {
    title: "Atelier",
    links: [
      { label: "The Story", href: "/about" },
      { label: "Production Footprint", href: "/about" },
      { label: "Materials & Care", href: "/legal/care" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Care Guide", href: "/legal/care" },
      { label: "Shipping", href: "/legal/shipping" },
      { label: "Returns", href: "/legal/returns" },
      { label: "FAQ", href: "/legal/faq" },
      { label: "Contact", href: "/contact" },
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
      {
        label: "Repair Request",
        href: "mailto:repair@maisontanneurs.com?subject=Repair%20Request",
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-white text-[#0f0f0f] border-t border-[#e5e5e5]">
      <NewsletterSignup />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 px-6 pt-14 pb-10">
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
