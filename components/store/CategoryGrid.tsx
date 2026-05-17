"use client";

import Image from "next/image";
import { useScrollReveal } from "@/lib/useScrollReveal";

export default function CategoryGrid() {
  useScrollReveal();

  return (
    <section className="section-pad bg-[var(--color-bone)]">
      <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-8 md:gap-16 px-6 md:px-10 max-w-[1400px] mx-auto">
        {/* Text column */}
        <div className="flex flex-col justify-center">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-cedar)] mb-4 reveal">
            02 &middot; The Atelier
          </span>
          <h2
            className="font-serif text-[clamp(36px,5vw,76px)] leading-[1.08] tracking-[-0.015em] text-[var(--color-ink)] mb-6 reveal reveal-delay-1"
            style={{ maxWidth: "14ch" }}
          >
            A workshop on <em className="italic text-[var(--color-clay)]">Rue Dar el Bacha</em>.
          </h2>
          <p className="text-[15px] font-sans font-light leading-[1.7] text-[var(--color-charcoal)] max-w-[42ch] mb-4 reveal reveal-delay-2">
            Eight benches. Eight craftspeople. Trained by their parents, who
            were trained by theirs. The workshop has held the same address since
            the year Morocco gained independence.
          </p>
          <p className="text-[15px] font-sans font-light leading-[1.7] text-[var(--color-charcoal)] max-w-[42ch] reveal reveal-delay-3">
            We do not hold inventory. When a piece is made, it is shown. When
            it sells, another is begun.
          </p>
        </div>

        {/* Image column */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-bone-2)] reveal reveal-delay-1">
          <Image
            src="/products/wood-furniture/moroccan-living-room-01.webp"
            alt="Traditional Moroccan living room with handcrafted furnishings"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
