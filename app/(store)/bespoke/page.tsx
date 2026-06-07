import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bespoke — commission an object",
  description:
    "A single object, designed with the atelier and made on the same bench. Twelve to fourteen weeks from confirmed design.",
  alternates: {
    canonical: "/bespoke",
  },
};

export default function BespokePage() {
  return (
    <main>
      <article className="max-w-[680px] mx-auto px-6 pt-[180px] pb-[120px]">
        <span className="eyebrow">Bespoke</span>
        <h1>One object, designed with the atelier.</h1>
        <p className="font-serif italic text-[var(--color-ink-soft)] text-[19px] md:text-[21px] leading-[1.5] mt-6 max-w-[46ch]">
          A leather chosen with you, a hardware specified by hand, a piece
          built on the same bench as the catalogue — at the same standard,
          for one carrier.
        </p>

        <div className="mt-14 flex flex-col gap-10">
          <div>
            <p className="tech-label text-[var(--color-bronze)]">
              How it works
            </p>
            <p className="mt-3 text-[var(--color-ink-soft)]">
              We are taking commissions by introduction at the moment. Write
              to{" "}
              <a
                href="mailto:bespoke@maisontanneurs.com"
                className="underline underline-offset-4"
              >
                bespoke@maisontanneurs.com
              </a>{" "}
              with the silhouette, the leather direction, and what the object
              is for. We reply within one working day.
            </p>
          </div>

          <div>
            <p className="tech-label text-[var(--color-bronze)]">Lead time</p>
            <p className="mt-3 text-[var(--color-ink-soft)]">
              Twelve to fourteen weeks from confirmed design. Worldwide DHL
              Express shipping included.
            </p>
          </div>

          <div>
            <p className="tech-label text-[var(--color-bronze)]">
              Looking instead for the current edition?
            </p>
            <p className="mt-3 text-[var(--color-ink-soft)]">
              <Link href="/products" className="underline underline-offset-4">
                Browse the collection
              </Link>
              .
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
