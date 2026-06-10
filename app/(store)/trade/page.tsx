import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import EditorialSplit from "@/components/store/EditorialSplit";

export const metadata: Metadata = {
  title: "Trade — hospitality, stockists, gifting",
  description:
    "Maison Tanneurs works with a small number of hotels, stockists, and houses each season. Numbered editions from a single Marrakech bench — by application.",
  alternates: {
    canonical: "/trade",
  },
  openGraph: {
    images: ["/brand/editorial/atelier-lineup.webp"],
  },
};

export default function TradePage() {
  return (
    <main>
      {/* §00 — Header */}
      <article className="max-w-[680px] mx-auto px-6 pt-[180px] pb-[clamp(56px,8vw,96px)]">
        <span className="eyebrow">Trade — By application</span>
        <h1>Stockists, hotels, gifting.</h1>
        <p className="font-serif italic text-[var(--color-ink-soft)] text-[19px] md:text-[21px] leading-[1.5] mt-6 max-w-[46ch]">
          The atelier runs a single closed circuit of seven artisans. We open
          a small number of trade accounts each season so the bench stays
          quiet and the work stays good.
        </p>
      </article>

      {/* §01 — Proof plate */}
      <section className="px-6 md:px-10 pb-[clamp(56px,8vw,112px)]">
        <div className="max-w-[1400px] mx-auto">
          <div className="relative aspect-[21/9] overflow-hidden bg-[var(--color-plate)]">
            <Image
              src="/brand/editorial/atelier-lineup.webp"
              alt="Five tagged leather bags of the current edition lined up on a long wooden bench in the Marrakech atelier, warm window light"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 1400px, 100vw"
            />
          </div>
          <p className="tech-meta text-[var(--color-mineral)] mt-4">
            Edition lineup — tagged, numbered, dispatched from one bench.
          </p>
        </div>
      </section>

      {/* §02 — Luxury Hospitality */}
      <EditorialSplit
        eyebrow="01 — Hospitality"
        headline="For the houses that host."
        body="Pieces for suites, guest gifting, and house boutiques — drawn from the same numbered editions we sell under our own name. There is no diffusion line and no second factory; allocations are seasonal and confirmed against the bench's fourteen-day cycle. Write with the property, the rooms, and the occasion."
        ctaLabel="Write — Hospitality"
        ctaHref="mailto:wholesale@maisontanneurs.com?subject=Trade%20Hospitality"
        image="/brand/editorial/hands-handover-cognac.webp"
        imageAlt="An artisan's weathered hands passing a finished cognac leather briefcase to a customer in the atelier"
        photoSide="right"
      />

      {/* §03 — Selected Retail */}
      <EditorialSplit
        eyebrow="02 — Selected Retail"
        headline="A small number of stockists."
        body="Write with the name of your house, your region, your annual volume, and a line about what you carry. We reply within one working day and share the trade dossier from there. Runs never exceed two hundred objects per edition, so stockist allocations are confirmed before the leather is cut."
        ctaLabel="Write — Stockists"
        ctaHref="mailto:wholesale@maisontanneurs.com?subject=Trade%20Introduction%20Stockist"
        secondaryLabel="Inside the atelier"
        secondaryHref="/atelier"
        image="/brand/editorial/journal-small-run-lineup.webp"
        imageAlt="A small production run of tagged leather backpacks and briefcases arranged on a workbench in raking sunlight"
        photoSide="left"
        plateBackground
      />

      {/* §04 — Corporate Gifting */}
      <EditorialSplit
        eyebrow="03 — Gifting"
        headline="Gifts that outlast the occasion."
        body="Custom hardware, embossing, and presentation packaging on orders of forty or more. Each piece is wrapped, tagged, and numbered at the bench where it was stitched. Write with the date you need the gifts delivered and we will confirm it against the production cycle before any work begins."
        ctaLabel="Write — Gifting"
        ctaHref="mailto:wholesale@maisontanneurs.com?subject=Corporate%20Gifting"
        image="/brand/editorial/workbench-bag-gloves.webp"
        imageAlt="A cognac leather handbag being wrapped in tissue paper on the atelier workbench beside a kraft edition tag"
        photoSide="right"
      />

      {/* §05 — Terms ledger */}
      <section className="px-6 py-[clamp(64px,9vw,128px)]">
        <div className="max-w-[680px] mx-auto">
          <span className="eyebrow">The Terms</span>
          <ul className="mt-8 divide-y divide-[var(--color-rule)] border-y border-[var(--color-rule)]">
            <LedgerRow k="Circuit" v="07 artisans · one bench" />
            <LedgerRow k="Run" v="≤ 200 objects / edition" />
            <LedgerRow k="Cadence" v="04 editions / year" />
            <LedgerRow k="Cycle" v="14 days" />
            <LedgerRow k="Dispatch" v="DHL Express · worldwide" />
            <LedgerRow k="Repair" v="Lifetime" />
            <LedgerRow k="Reply" v="One working day" />
          </ul>
        </div>
      </section>

      {/* §06 — Closing */}
      <section className="px-6 pb-[120px]">
        <div className="max-w-[680px] mx-auto flex flex-col gap-10 pt-2">
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
          <div>
            <p className="tech-label text-[var(--color-bronze)]">Visit</p>
            <p className="mt-3 text-[var(--color-ink-soft)]">
              The atelier receives trade visits by appointment — see{" "}
              <Link href="/boutique" className="underline underline-offset-4">
                Boutique
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function LedgerRow({ k, v }: { k: string; v: string }) {
  return (
    <li className="flex items-baseline justify-between py-3.5">
      <span className="tech-label text-[var(--color-mineral)]">{k}</span>
      <span className="tech-meta text-[var(--color-ink)]">{v}</span>
    </li>
  );
}
