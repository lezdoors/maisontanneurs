"use client";

import Image from "next/image";
import { useScrollReveal } from "@/lib/useScrollReveal";

export default function CraftsmanshipSplit() {
  useScrollReveal();

  return (
    <section className="section-pad bg-[var(--color-bone-2)]">
      <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-8 md:gap-16 px-6 md:px-10 max-w-[1400px] mx-auto">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-bone)] reveal">
          <Image
            src="/products/wood-furniture/moroccan-mother-of-pearl-side-table-scale.webp"
            alt="Artisan-crafted mother-of-pearl side table"
            fill
            className="object-cover"
          />
        </div>

        {/* Text */}
        <div className="flex flex-col justify-center max-w-[50ch]">
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-cedar)] mb-4 reveal">
            03 &middot; The Hand
          </span>
          <h3 className="font-serif text-[clamp(40px,5vw,76px)] leading-[1.02] tracking-[-0.015em] text-[var(--color-ink)] mb-6 reveal reveal-delay-1">
            Each piece is made <em className="italic text-[var(--color-clay)]">by hand</em> using techniques passed down through generations.
          </h3>
          <p className="text-[15px] font-sans font-light leading-[1.75] text-[var(--color-charcoal)] mb-4 reveal reveal-delay-2">
            Our atelier is a room of eight benches. Omar chisels brass. Salma
            lays bone into resin. Hassan strikes silver with a wooden mallet,
            the same one his father used. Nothing here is stamped, cast, or
            printed.
          </p>
          <p className="text-[15px] font-sans font-light leading-[1.75] text-[var(--color-charcoal)] mb-6 reveal reveal-delay-3">
            A table will sit on the bench for a hundred hours. A fountain, six
            weeks. When it leaves, it leaves with a name — the maker&apos;s, not
            ours.
          </p>
          <a
            href="/about"
            className="group inline-flex items-center gap-3.5 text-[11px] font-mono tracking-[0.24em] uppercase text-[var(--color-cedar)] border-b border-[var(--color-line)] pb-2.5 transition-all duration-400 hover:text-[var(--color-clay)] hover:border-[var(--color-clay)] w-fit reveal reveal-delay-4"
          >
            Meet the makers
            <div className="relative w-8 h-px bg-current transition-all duration-500 ease-[var(--ease)] group-hover:w-12">
              <div className="absolute right-0 top-[-3px] w-[7px] h-[7px] border-t border-r border-current rotate-45" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
