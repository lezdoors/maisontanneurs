"use client";

import Image from "next/image";
import Link from "next/link";

type Tile = {
  eyebrow: string;
  title: string;
  cta: string;
  href: string;
  image: string;
  alt: string;
};

// Three real-catalogue cross-sells. All images are from /products/* — no invented SKUs, no stock photography.
const TILES: Tile[] = [
  {
    eyebrow: "Lighting",
    title: "Pierced brass pendants.",
    cta: "Discover the pendants",
    href: "/products?category=Lighting",
    image: "/products/pendant-lights/alhambra-pendant-scale.webp",
    alt: "Alhambra hand-pierced brass pendant casting a mandala shadow on white plaster",
  },
  {
    eyebrow: "Seating",
    title: "Hand-stitched leather poufs.",
    cta: "Discover the poufs",
    href: "/products?category=Poufs",
    image: "/products/leather-poufs/leather-poufs-collection-hero.webp",
    alt: "Four hand-stitched Moroccan leather poufs in chocolate, cognac, rose and saffron arranged on a raw-oak bench over a vintage Berber rug",
  },
  {
    eyebrow: "Wood & Bone",
    title: "Carved cedar, set with bone.",
    cta: "Discover the tables",
    href: "/products?category=Tables",
    image: "/products/wood-furniture/moroccan-mother-of-pearl-side-table-scale.webp",
    alt: "Double-tiered octagonal side table with hand-inlaid black and white bone marquetry",
  },
];

export default function SecondaryContent() {
  return (
    <section className="rb-section-tight bg-[var(--color-bg-alt)]">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {TILES.map((t) => (
          <Link key={t.title} href={t.href} className="rb-card group block">
            <div className="rb-card-img-wrap aspect-[5/6] bg-white">
              <Image
                src={t.image}
                alt={t.alt}
                fill
                sizes="(max-width:768px) 100vw, 33vw"
                className="rb-card-img object-cover"
              />
            </div>
            <div className="pt-5">
              <div className="rb-eyebrow mb-2">{t.eyebrow}</div>
              <div className="rb-h2 mb-3">{t.title}</div>
              <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase text-[var(--color-ink)] border-b border-[var(--color-ink)] pb-1 group-hover:text-[var(--color-brass-hi)] group-hover:border-[var(--color-brass-hi)] transition-colors">
                {t.cta} <span aria-hidden>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
