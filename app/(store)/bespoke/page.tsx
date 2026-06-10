import Link from "next/link";
import type { Metadata } from "next";
import AtmosphereVideo from "@/components/store/AtmosphereVideo";
import EditorialSplit from "@/components/store/EditorialSplit";

export const metadata: Metadata = {
  title: "Bespoke — commission an object",
  description:
    "A single object, designed with the atelier and made on the same bench. Twelve to fourteen weeks from confirmed design.",
  alternates: {
    canonical: "/bespoke",
  },
  openGraph: {
    images: ["/brand/editorial/sketch-satchel-handbag-pencil.webp"],
  },
};

const STEPS = [
  {
    n: "01",
    label: "Introduction",
    text: "We take commissions by introduction. Write to hello@maisontanneurs.com with the silhouette, the leather direction, and what the object is for. We reply within one working day.",
  },
  {
    n: "02",
    label: "Design & leather",
    text: "The leather is chosen with you, the hardware specified by hand, and the design confirmed before anything is cut. Nothing goes to the bench until both sides have signed off on the drawing.",
  },
  {
    n: "03",
    label: "The bench",
    text: "Twelve to fourteen weeks from confirmed design. Your piece is built on the same bench as the catalogue, by the same seven hands, at the same standard — for one carrier.",
  },
  {
    n: "04",
    label: "Dispatch",
    text: "Shipped direct from the atelier via DHL Express, worldwide, included. You receive a tracking number the day the piece leaves Marrakech.",
  },
];

export default function BespokePage() {
  return (
    <main>
      {/* Header */}
      <article className="max-w-[680px] mx-auto px-6 pt-[180px] pb-[clamp(56px,8vw,96px)]">
        <span className="eyebrow">Bespoke</span>
        <h1>One object, designed with the atelier.</h1>
        <p className="font-serif italic text-[var(--color-ink-soft)] text-[19px] md:text-[21px] leading-[1.5] mt-6 max-w-[46ch]">
          A leather chosen with you, a hardware specified by hand, a piece
          built on the same bench as the catalogue — at the same standard,
          for one carrier.
        </p>
      </article>

      {/* The bench — atmosphere */}
      <AtmosphereVideo
        eyebrow="The Bench"
        headline="Same bench. One carrier."
        body="The commission does not leave the circuit. The artisan who cuts the catalogue cuts your piece; the one who closes the final stitch ties the tag. What changes is that every decision — leather, hardware, proportion — is made for you."
        ctaLabel="Open a commission"
        ctaHref="mailto:hello@maisontanneurs.com?subject=Bespoke%20Commission"
        videoSrc="/brand/atelier/atelier-hands-at-work.mp4"
        poster="/brand/atelier/atelier-hands-at-work-poster.jpg"
        videoSide="left"
      />

      {/* How it works — four steps */}
      <section className="px-6 py-[clamp(64px,9vw,128px)]">
        <div className="max-w-[680px] mx-auto">
          <span className="eyebrow">How it works</span>
          <ol className="mt-10 flex flex-col gap-12">
            {STEPS.map((s) => (
              <li key={s.n} className="grid grid-cols-[48px_1fr] gap-x-6">
                <span className="tech-label text-[var(--color-mineral)] pt-1">
                  {s.n}
                </span>
                <div>
                  <p className="tech-label text-[var(--color-bronze)]">
                    {s.label}
                  </p>
                  <p className="mt-3 text-[var(--color-ink-soft)] leading-[1.7]">
                    {s.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* From the sketchbook — closing */}
      <EditorialSplit
        eyebrow="From the sketchbook"
        headline="It starts as a drawing."
        body="Every commission begins the way every edition begins — a pencil silhouette, a leather swatch, a hardware note in the margin. If you would rather start from something that already exists, the current edition is on the bench now."
        ctaLabel="Browse the collection"
        ctaHref="/products"
        secondaryLabel="Inside the atelier"
        secondaryHref="/atelier"
        image="/brand/editorial/sketch-satchel-handbag-pencil.webp"
        imageAlt="A pencil sketch of a buckled leather satchel on textured drawing paper"
        photoSide="right"
        plateBackground
      />

      {/* Footnote */}
      <section className="px-6 py-[clamp(48px,6vw,80px)]">
        <div className="max-w-[680px] mx-auto">
          <p className="text-[14px] text-[var(--color-mineral)] leading-[1.7]">
            Looking to stock the house or commission gifts at volume? See{" "}
            <Link href="/trade" className="underline underline-offset-4">
              Trade
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
