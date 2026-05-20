import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Kechken",
  description:
    "A modern Moroccan apparel label — streetwear, jewelry, and leather goods designed in-house and made to order, shipped within three to five days.",
};

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-[70vh] w-full overflow-hidden bg-[#0e0d0c]">
        <Image
          src="/hero/hero-kechken-atelier.webp"
          alt="Kechken atelier — bags hanging from wooden beams in golden light"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,7,6,0.4) 0%, rgba(8,7,6,0.15) 40%, rgba(8,7,6,0.75) 100%)",
          }}
        />
        <div className="absolute bottom-12 left-6 md:left-10 right-6">
          <div className="max-w-[1200px] mx-auto">
            <div
              className="mb-4 uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: "0.32em",
                color: "rgba(245,244,241,0.82)",
              }}
            >
              About · Kechken
            </div>
            <h1
              className="font-serif leading-[1.0] text-[#f5f4f1]"
              style={{
                fontFamily:
                  "var(--font-serif, 'Cormorant Garamond', 'Times New Roman', serif)",
                fontSize: "clamp(40px, 6vw, 88px)",
                letterSpacing: "-0.015em",
                fontWeight: 500,
              }}
            >
              Modern Moroccan, made wearable.
            </h1>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="ed-section bg-[var(--color-bg)]">
        <div className="max-w-[680px] mx-auto px-6">
          <div className="ed-eyebrow mb-6">The Brand</div>
          <p className="text-[19px] md:text-[21px] font-serif italic font-light leading-[1.45] text-[var(--color-ink)] mb-8"
             style={{ fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)" }}>
            A wardrobe for people who carry culture into the room.
          </p>
          <p className="text-[15px] font-sans font-light leading-[1.75] text-[var(--color-ink-soft)] mb-5">
            Kechken is a contemporary apparel label rooted in the visual
            register of the Maghreb — Atlas mountain silhouettes, zellige
            geometry, Berber typography, the colour of Marrakech limestone
            at golden hour. We design tees, hoodies, leather goods, and
            silver jewelry that read as modern first, Moroccan second.
          </p>
          <p className="text-[15px] font-sans font-light leading-[1.75] text-[var(--color-ink-soft)] mb-5">
            Every piece is designed in-house and produced when you order it.
            No deadstock. No overproduction. No advance inventory destroyed
            at season&apos;s end. Pieces are printed, cut, and finished by a
            vetted production partner and shipped within three to five days
            from the warehouse closest to you.
          </p>
          <p className="text-[15px] font-sans font-light leading-[1.75] text-[var(--color-ink-soft)]">
            We launch in collections — small, intentional drops, each tied
            to a single visual idea. Drop 01 lands June 2026.
          </p>
        </div>
      </section>

      {/* Image break */}
      <section className="px-6 md:px-10 pb-8 bg-[var(--color-bg)]">
        <div className="relative aspect-[21/9] overflow-hidden bg-[var(--color-bg-alt)] max-w-[1400px] mx-auto">
          <Image
            src="/products/drop-01/wordmark-tee-01.webp"
            alt="Bone-coloured hoodie on limestone in a Moroccan courtyard"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 1400px, 100vw"
          />
        </div>
      </section>

      {/* Three pillars */}
      <section className="ed-section bg-[var(--color-bg)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[1200px] mx-auto px-6 md:px-10">
          {[
            {
              label: "Design",
              text: "Every print, pattern, and silhouette is drawn in-house. The Moroccan reference is in the form, the colour, and the line — not in literal motif. Modern silhouettes first.",
            },
            {
              label: "Production",
              text: "Made to order via a vetted print-on-demand partner with warehouses in the US and EU. Heavyweight cotton, full-grain leather, sterling silver. Each piece is finished only when you place the order.",
            },
            {
              label: "Shipping",
              text: "Three to five business days from the warehouse nearest to you. Tracking included. Returns within 30 days, no questions asked.",
            },
          ].map((item) => (
            <div key={item.label}>
              <h3 className="text-[11px] font-sans tracking-[0.22em] uppercase text-[var(--color-ink)] mb-4">
                {item.label}
              </h3>
              <p className="text-[15px] font-sans font-light leading-[1.7] text-[var(--color-ink-soft)]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="ed-section bg-[var(--color-bg-alt)]">
        <div className="max-w-[860px] mx-auto px-6 text-center">
          <h2 className="ed-h2 mb-6 max-w-[18ch] mx-auto">
            See the first drop.
          </h2>
          <p className="text-[15px] font-sans font-light leading-[1.7] text-[var(--color-ink-soft)] mb-10 max-w-[44ch] mx-auto">
            Five pieces. Each tied to the Atlas line motif. Shipping
            June 2026.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center bg-[var(--color-ink)] text-[var(--color-bg)] px-8 py-4 uppercase font-medium hover:opacity-90 transition-opacity"
            style={{ fontSize: "11px", letterSpacing: "0.22em" }}
          >
            Shop Drop 01
          </Link>
        </div>
      </section>
    </main>
  );
}
