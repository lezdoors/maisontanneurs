import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Maison Tanneurs",
  description:
    "A small leather house working out of a Marrakech atelier. Full-grain leather, hand-stitched, solid brass hardware. Shipped direct in three to five days.",
};

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-[70vh] w-full overflow-hidden bg-[#0e0d0c]">
        <Image
          src="/hero/hero-kechken-atelier.webp"
          alt="Maison Tanneurs atelier — bags hanging from wooden beams in golden light"
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
              About · Maison Tanneurs
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
              Hand-stitched in Marrakech.
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
            A leather house for people who want the maker&apos;s mark on the
            bag they carry.
          </p>
          <p className="text-[15px] font-sans font-light leading-[1.75] text-[var(--color-ink-soft)] mb-5">
            Maison Tanneurs is a small leather house working out of a Marrakech
            atelier. We make bags — full-grain leather, solid brass
            hardware, contrast saddle-stitch — cut and finished by hand,
            one piece at a time, by artisans who have been working leather
            in the medina for generations.
          </p>
          <p className="text-[15px] font-sans font-light leading-[1.75] text-[var(--color-ink-soft)] mb-5">
            Every bag ships direct from the atelier via DHL or FedEx,
            three to five days to your door. No middlemen, no warehouses,
            no inventory we didn&apos;t make. What you carry was finished by
            the person who signed the lining.
          </p>
          <p className="text-[15px] font-sans font-light leading-[1.75] text-[var(--color-ink-soft)]">
            Drop 01 lands June 2026 — a tight edition of bags and small
            leather goods, restocked only when the leather is right.
          </p>
        </div>
      </section>

      {/* Image break */}
      <section className="px-6 md:px-10 pb-8 bg-[var(--color-bg)]">
        <div className="relative aspect-[21/9] overflow-hidden bg-[var(--color-bg-alt)] max-w-[1400px] mx-auto">
          <Image
            src="/products/drop-01/heritage-rucksack-01-v2.webp"
            alt="Heritage Rucksack in cognac full-grain leather"
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
              text: "Silhouettes drawn for daily carry, not season-driven trend. Form, leather grain, and brass hardware do the talking. The Moroccan reference is in the contrast saddle-stitch and the patina, not in literal motif.",
            },
            {
              label: "Atelier",
              text: "Each bag is cut, stitched, and finished by hand in a small Marrakech atelier. Full-grain Moroccan leather, solid brass hardware, vegetable-tanned linings. One artisan finishes a bag from start to end — signed inside.",
            },
            {
              label: "Shipping",
              text: "Three to five business days direct from Marrakech via DHL or FedEx. Tracking included on every order. Returns within 30 days, no questions asked.",
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
            A tight edition of bags and small leather goods,
            hand-stitched in Marrakech. Shipping June 2026.
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
