"use client";

import Image from "next/image";
import { useScrollReveal } from "@/lib/useScrollReveal";

export default function JournalSection() {
  useScrollReveal();

  const entries = [
    {
      image: "/products/leather-poufs/leather-pouf-black-scale.webp",
      meta: "Field Notes — No.01",
      title: "The embroidered throne.",
      body: "Each Hachkar pouf takes forty hours of hand-embroidery. Silk thread, leather hide, geometric patterns passed down through centuries of Berber tradition.",
    },
    {
      image: "/products/wood-furniture/moroccan-throne-chair-01.webp",
      meta: "Field Notes — No.02",
      title: "On cedar and ceremony.",
      body: "Hand-carved from Atlas cedar. The throne chair was traditionally reserved for the head of household — a symbol of authority, crafted to last generations.",
    },
    {
      image: "/products/pendant-lights/alhambra-pendant-scale.webp",
      meta: "Field Notes — No.03",
      title: "Light through geometric shadow.",
      body: "Each brass pendant is pierced by hand with Islamic star patterns. At night, walls become maps of light and shadow — geometry made luminous.",
    },
  ];

  return (
    <section className="section-pad bg-[var(--color-bone-2)] border-t border-[var(--color-line)]">
      {/* Header */}
      <div className="px-6 md:px-10 mb-12 md:mb-20 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-3.5 mb-6 reveal">
          <div className="w-12 h-px bg-[var(--color-cedar)]" />
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-cedar)]">
            05 &middot; The Journal
          </span>
        </div>
        <h2 className="font-serif text-[clamp(36px,5vw,72px)] leading-[1.08] tracking-[-0.015em] text-[var(--color-ink)] max-w-[22ch] reveal reveal-delay-1">
          Notes from the <em className="italic text-[var(--color-clay)]">workshop</em>, the souk, and the long road home.
        </h2>
      </div>

      {/* Journal grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-6 md:px-10 max-w-[1400px] mx-auto">
        {entries.map((entry, i) => (
          <article
            key={entry.title}
            className="group cursor-pointer reveal"
            style={{ transitionDelay: `${(i + 1) * 0.15}s` }}
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-[var(--color-bone)] mb-5">
              <Image
                src={entry.image}
                alt={entry.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </div>
            <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[var(--color-cedar)] block mb-2">
              {entry.meta}
            </span>
            <h4 className="text-[17px] font-serif tracking-[-0.01em] text-[var(--color-ink)] mb-2 leading-snug">
              {entry.title}
            </h4>
            <p className="text-[14px] font-sans font-light leading-[1.7] text-[var(--color-charcoal)]/85">
              {entry.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
