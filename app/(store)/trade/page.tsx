import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Trade — wholesale and stockists",
  description:
    "Maison Tanneurs accepts a small number of trade accounts each season. Write to introduce your house, your region, and your annual volume.",
  alternates: {
    canonical: "/trade",
  },
};

export default function TradePage() {
  return (
    <main>
      <article className="max-w-[680px] mx-auto px-6 pt-[180px] pb-[120px]">
        <span className="eyebrow">Trade</span>
        <h1>Stockists, hotels, gifting.</h1>
        <p className="font-serif italic text-[var(--color-ink-soft)] text-[19px] md:text-[21px] leading-[1.5] mt-6 max-w-[46ch]">
          The atelier runs a single closed circuit of seven artisans. We open
          a small number of trade accounts each season so the bench stays
          quiet and the work stays good.
        </p>

        <div className="mt-14 flex flex-col gap-10">
          <div>
            <p className="tech-label text-[var(--color-bronze)]">
              Introductions
            </p>
            <p className="mt-3 text-[var(--color-ink-soft)]">
              Write to{" "}
              <a
                href="mailto:hello@maisontanneurs.com"
                className="underline underline-offset-4"
              >
                hello@maisontanneurs.com
              </a>{" "}
              with the name of your house, your region, your annual volume,
              and a line about what you carry. We reply within one working
              day and share the trade dossier from there.
            </p>
          </div>

          <div>
            <p className="tech-label text-[var(--color-bronze)]">
              Corporate gifting
            </p>
            <p className="mt-3 text-[var(--color-ink-soft)]">
              Custom hardware, embossing, and presentation packaging on
              orders of forty or more. Write to the same address with the
              date you need the gifts delivered.
            </p>
          </div>

          <div>
            <p className="tech-label text-[var(--color-bronze)]">
              One-off commissions
            </p>
            <p className="mt-3 text-[var(--color-ink-soft)]">
              For a single piece designed with the atelier, see{" "}
              <Link href="/bespoke" className="underline underline-offset-4">
                Bespoke
              </Link>
              .
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
