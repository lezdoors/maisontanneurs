"use client";

import Link from "next/link";
import NewsletterSignup from "@/components/store/NewsletterSignup";
import { useLocalizedHref, useT } from "@/lib/i18n-client";

type ColumnDef = { titleKey: string; links: { labelKey: string; href: string }[] };

const COLUMNS: ColumnDef[] = [
  {
    titleKey: "footer.collection",
    links: [
      { labelKey: "footer.allObjects", href: "/products" },
      { labelKey: "footer.backpacks", href: "/products?category=Backpack" },
      { labelKey: "footer.briefcases", href: "/products?category=Briefcase" },
      { labelKey: "footer.crossbody", href: "/products?category=Crossbody" },
      { labelKey: "footer.duffles", href: "/products?category=Duffle" },
      { labelKey: "footer.messengers", href: "/products?category=Messenger" },
      { labelKey: "footer.rolltops", href: "/products?category=Rolltop" },
      { labelKey: "footer.saddlebags", href: "/products?category=Saddlebag" },
      { labelKey: "footer.satchels", href: "/products?category=Satchel" },
      { labelKey: "footer.totes", href: "/products?category=Tote" },
      { labelKey: "footer.weekenders", href: "/products?category=Weekender" },
    ],
  },
  {
    titleKey: "footer.atelier",
    links: [
      { labelKey: "footer.story", href: "/about" },
      { labelKey: "footer.production", href: "/about" },
      { labelKey: "footer.materialsCare", href: "/legal/care" },
    ],
  },
  {
    titleKey: "footer.support",
    links: [
      { labelKey: "nav.careGuide", href: "/legal/care" },
      { labelKey: "footer.shipping", href: "/legal/shipping" },
      { labelKey: "footer.returns", href: "/legal/returns" },
      { labelKey: "footer.repairGuarantee", href: "/legal/repair" },
      { labelKey: "footer.faq", href: "/legal/faq" },
      { labelKey: "footer.contact", href: "/contact" },
    ],
  },
  {
    titleKey: "footer.connect",
    links: [
      { labelKey: "footer.instagram", href: "https://instagram.com/maisontanneurs" },
      { labelKey: "footer.atelierList", href: "mailto:hello@maisontanneurs.com?subject=Atelier%20List" },
      { labelKey: "footer.trade", href: "mailto:hello@maisontanneurs.com?subject=Trade" },
      { labelKey: "footer.repair", href: "mailto:repair@maisontanneurs.com?subject=Repair%20Request" },
    ],
  },
];

export default function Footer() {
  const t = useT();
  const href = useLocalizedHref();
  return (
    <footer className="w-full bg-white text-[#0f0f0f] border-t border-[#e5e5e5]">
      <NewsletterSignup />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 px-6 pt-14 pb-14">
        {COLUMNS.map((c) => (
          <Column key={c.titleKey} {...c} />
        ))}
      </div>

      <div className="border-t border-[#e5e5e5]">
        <div className="px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <span className="tech-meta opacity-70">{t("footer.tagline")}</span>
          <span className="tech-meta opacity-70">{t("footer.rights")}</span>
          <div className="flex items-center gap-6 tech-meta opacity-70">
            <Link href={href("/legal/privacy")} className="hover:underline underline-offset-4">
              {t("footer.privacy")}
            </Link>
            <Link href={href("/legal/terms")} className="hover:underline underline-offset-4">
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Column({ titleKey, links }: ColumnDef) {
  const t = useT();
  const href = useLocalizedHref();
  return (
    <div>
      <h4 className="font-medium" style={{ fontSize: "15px", letterSpacing: "-0.015em" }}>
        {t(titleKey)}
      </h4>
      <ul className="mt-5 flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l.labelKey}>
            <Link
              href={href(l.href)}
              className="tech-meta opacity-75 hover:opacity-100 hover:underline underline-offset-4"
            >
              {t(l.labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
