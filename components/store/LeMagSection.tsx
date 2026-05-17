"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

type Article = {
  category: string;
  date: string;
  title: string;
  href: string;
  image: string;
  alt: string;
};

// Editorial cards — every image is a real catalogue piece or a brand-anchored atelier scene.
// No invented products, no stock photography.
const ARTICLES: Article[] = [
  {
    category: "The Atelier",
    date: "May 2026",
    title: "Inside the salon on Derb el Ferran",
    href: "/about",
    image: "/campaigns/hero-salon-wide.png",
    alt: "Restored Marrakech riad salon with the brand's banquette, throne chairs and brass pendant",
  },
  {
    category: "Iconic Piece",
    date: "May 2026",
    title: "Chamss — the pierced brass star",
    href: "/products/chamss-brass-pendant",
    image: "/products/pendant-lights/alhambra-pendant-scale.webp",
    alt: "Chamss pierced brass pendant lantern",
  },
  {
    category: "Iconic Piece",
    date: "April 2026",
    title: "The octagonal coffee table",
    href: "/products/octagonal-coffee-table",
    image: "/products/wood-furniture/moroccan-mother-of-pearl-side-table-scale.webp",
    alt: "Hand-carved octagonal coffee table",
  },
  {
    category: "Material",
    date: "April 2026",
    title: "On full-grain leather and silk stitching",
    href: "/products/cognac-leather-pouf",
    image: "/products/leather-poufs/leather-pouf-black-scale.webp",
    alt: "Cognac leather pouf",
  },
  {
    category: "The Atelier",
    date: "March 2026",
    title: "Five poufs on the terrace.",
    href: "/products?category=Poufs",
    image: "/campaigns/hero-mediterranean-midday.webp",
    alt: "Five hand-stitched Moroccan leather poufs in green, navy, terracotta, mustard and ivory grouped on a Mediterranean infinity terrace with brass lantern and zellige table",
  },
];

const FILTERS = ["All", "The Atelier", "Iconic Piece", "Material"];

export default function LeMagSection() {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const w = card ? card.offsetWidth + 24 : 360;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  return (
    <section className="rb-section bg-white">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
          <div>
            <div className="rb-eyebrow mb-3">Journal</div>
            <h2 className="rb-display text-[clamp(28px,3.4vw,44px)]">
              Stories from the atelier.
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll(-1)}
              aria-label="Previous"
              className="w-11 h-11 border border-[var(--color-rule)] flex items-center justify-center hover:border-[var(--color-ink)] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Next"
              className="w-11 h-11 border border-[var(--color-rule)] flex items-center justify-center hover:border-[var(--color-ink)] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-6 mb-10 border-b border-[var(--color-rule)] overflow-x-auto rb-scroll-x">
          {FILTERS.map((f, i) => (
            <button
              key={f}
              className={`shrink-0 pb-3 text-[12px] tracking-[0.06em] transition-colors ${
                i === 0
                  ? "text-[var(--color-ink)] border-b-2 border-[var(--color-ink)] -mb-px font-medium"
                  : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div
          ref={trackRef}
          className="rb-scroll-x flex overflow-x-auto gap-6 snap-x snap-mandatory pb-2 -mx-6 md:-mx-10 px-6 md:px-10"
        >
          {ARTICLES.map((a) => (
            <Link
              key={a.title}
              href={a.href}
              data-card
              className="rb-card group snap-start shrink-0 w-[78vw] sm:w-[44vw] md:w-[340px] lg:w-[380px]"
            >
              <div className="rb-card-img-wrap aspect-[4/3] bg-[var(--color-bg-alt)]">
                <Image
                  src={a.image}
                  alt={a.alt}
                  fill
                  sizes="(max-width:768px) 78vw, 380px"
                  className="rb-card-img object-cover"
                />
              </div>
              <div className="pt-4">
                <div className="rb-meta">
                  {a.category} · {a.date}
                </div>
                <div className="rb-card-title mt-2 leading-[1.3]">
                  {a.title}
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] tracking-[0.08em] uppercase text-[var(--color-brass-hi)] group-hover:gap-2.5 transition-all">
                  More <span aria-hidden>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
