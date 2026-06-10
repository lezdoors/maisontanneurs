import type { Metadata } from "next";
import Link from "next/link";
import EditorialSlideshow from "@/components/store/EditorialSlideshow";

export const metadata: Metadata = {
  title: "Boutique — visit the atelier",
  description:
    "Maison Tanneurs is a small Marrakech atelier. Visits are by appointment only — write ahead and we will plan a quiet hour.",
  alternates: {
    canonical: "/boutique",
  },
  openGraph: {
    images: ["/brand/editorial/boutique-wide.webp"],
  },
};

export default function BoutiquePage() {
  return (
    <main className="bg-[var(--color-paper)]">
      <div className="pt-[clamp(140px,16vh,200px)]">
        <EditorialSlideshow />
      </div>

      <article className="max-w-[680px] mx-auto px-6 pt-[clamp(72px,10vw,128px)] pb-[120px]">
        <span className="eyebrow">Boutique · Atelier</span>
        <h1>Marrakech, by appointment.</h1>
        <p className="font-serif italic text-[var(--color-ink-soft)] text-[19px] md:text-[21px] leading-[1.5] mt-6 max-w-[46ch]">
          We do not run a public storefront. The atelier opens for a small
          number of visits each season — to handle the leather, see the
          fourteen-day cycle, and meet the seven hands behind it.
        </p>

        <div className="mt-14 flex flex-col gap-10">
          <div>
            <p className="tech-label text-[var(--color-bronze)]">
              How to visit
            </p>
            <p className="mt-3 text-[var(--color-ink-soft)]">
              Write to{" "}
              <a
                href="mailto:hello@maisontanneurs.com"
                className="underline underline-offset-4"
              >
                hello@maisontanneurs.com
              </a>{" "}
              with the dates you have in mind. We confirm within one working
              day and send the address with the confirmation.
            </p>
          </div>

          <div>
            <p className="tech-label text-[var(--color-bronze)]">Elsewhere</p>
            <p className="mt-3 text-[var(--color-ink-soft)]">
              We do not list at department stores or marketplaces. If you
              would like to stock Maison Tanneurs, see{" "}
              <Link href="/trade" className="underline underline-offset-4">
                Trade
              </Link>
              . For a single commissioned piece, see{" "}
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
