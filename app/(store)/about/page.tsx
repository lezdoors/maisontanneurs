import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Atelier",
  description:
    "A small house of makers, working by hand from a workshop near the Medina, Marrakech.",
};

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <Image
          src="/products/wood-furniture/moroccan-living-room-01.webp"
          alt="Traditional Moroccan living room with handcrafted furnishings"
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(26,18,11,0.2) 0%, transparent 40%, rgba(26,18,11,0.65) 100%)",
          }}
        />
        <div className="absolute bottom-12 left-6 md:left-10">
          <h1 className="font-serif text-[clamp(36px,5vw,64px)] leading-[1.08] tracking-[-0.015em] text-[var(--color-bone)]">
            The Atelier
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="section-pad bg-[var(--color-bone)]">
        <div className="max-w-[680px] mx-auto px-6">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-cedar)] block mb-6">
            Marrakech &middot; Est. 1974
          </span>
          <p className="text-[17px] font-serif italic font-light leading-relaxed text-[var(--color-ink)] mb-6">
            A small house of makers, working by hand from a workshop near the
            Medina. Eight benches. Eight craftspeople. No machines. No catalogue.
          </p>
          <p className="text-[15px] font-sans font-light leading-[1.7] text-[var(--color-charcoal)] mb-6">
            Kechken began as a family workshop on Rue Dar el Bacha,
            Marrakech, founded in 1974. The name came later — the work came
            first. Brass, bone, cedar, leather: materials sourced within a day&apos;s
            drive of the workshop, shaped by hands that learned from hands before
            them.
          </p>
          <p className="text-[15px] font-sans font-light leading-[1.7] text-[var(--color-charcoal)] mb-6">
            We do not hold inventory. When a piece is commissioned, it is begun.
            When it is finished, it is shown. When it sells, another is started.
            This is slow work, done at the pace of the material.
          </p>
          <p className="text-[15px] font-sans font-light leading-[1.7] text-[var(--color-charcoal)]">
            Every object ships from Marrakech by sea, in custom cedar crates.
            White-glove delivery is included. Lead times are honestly told:
            eight to twenty-four weeks, depending on the complexity of the piece.
          </p>
        </div>
      </section>

      {/* Image break */}
      <section className="px-6 md:px-10 py-8 bg-[var(--color-bone)]">
        <div className="relative aspect-[21/9] overflow-hidden bg-[var(--color-bone-2)] max-w-[1400px] mx-auto">
          <Image
            src="/products/wood-furniture/moroccan-bone-inlay-bed-set-01.webp"
            alt="Hand-inlaid bone furniture crafted in Marrakech"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Values */}
      <section className="section-pad bg-[var(--color-bone)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[1200px] mx-auto px-6 md:px-10">
          {[
            {
              label: "Origin",
              text: "Every material is sourced within Morocco. Cedar from the Middle Atlas. Brass from Fez. Leather from Marrakech. Bone from the coast.",
            },
            {
              label: "Process",
              text: "No machines. No moulds. Each piece is drawn by hand, cut, assembled, and finished by a single maker. The process is the product.",
            },
            {
              label: "Delivery",
              text: "Shipped by sea in custom cedar crates. White-glove delivery to your door. Lead times of 8-24 weeks, honestly told.",
            },
          ].map((item) => (
            <div key={item.label}>
              <h3 className="text-[11px] font-sans tracking-[0.22em] uppercase text-[var(--color-ink)] mb-3">
                {item.label}
              </h3>
              <p className="text-[15px] font-sans font-light leading-[1.7] text-[var(--color-charcoal)]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
