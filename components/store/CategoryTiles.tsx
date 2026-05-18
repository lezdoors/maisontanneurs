import Link from "next/link";

type Tile = {
  label: string;
  href: string;
  caption: string;
  /** When real campaign imagery lands, set image. Null → gradient placeholder. */
  image: string | null;
  /** Gradient placeholder so each tile has a distinct mood. */
  gradient: string;
};

const TILES: Tile[] = [
  {
    label: "Streetwear",
    href: "/products?category=Streetwear",
    caption: "Tees, hoodies, sweats",
    image: null,
    gradient: "linear-gradient(180deg, #f0e6d2 0%, #c8b89a 100%)",
  },
  {
    label: "Jewelry",
    href: "/products?category=Jewelry",
    caption: "Sterling silver, hand-finished",
    image: null,
    gradient: "linear-gradient(180deg, #2a2622 0%, #5c4530 100%)",
  },
  {
    label: "Limited Drops",
    href: "/products?category=Limited%20Drops",
    caption: "Seasonal, numbered, made-to-order",
    image: null,
    gradient: "linear-gradient(180deg, #d8a47a 0%, #8c4d2e 100%)",
  },
  {
    label: "The Atelier",
    href: "/story",
    caption: "How we work · The brand",
    image: null,
    gradient: "linear-gradient(180deg, #ddd1b9 0%, #6b6258 100%)",
  },
];

export default function CategoryTiles() {
  return (
    <section className="ed-section-tight bg-[var(--color-bg-alt)]">
      <div className="max-w-[1480px] mx-auto">
        <div className="flex items-end justify-between gap-6 mb-10 px-1">
          <div>
            <div className="ed-eyebrow mb-4">Explore</div>
            <h2 className="ed-h2 max-w-[18ch]">
              Four ways into the house.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {TILES.map((tile) => (
            <Link
              key={tile.label}
              href={tile.href}
              className="group block relative aspect-[3/4] md:aspect-[5/6] overflow-hidden bg-[var(--color-bg-tinted)]"
            >
              <div
                aria-hidden
                className="absolute inset-0 transition-transform duration-[1100ms] ease-[var(--ease)] group-hover:scale-105"
                style={{ background: tile.gradient }}
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 55%, rgba(28,26,24,0.45) 100%)",
                }}
              />
              <div className="relative h-full w-full flex flex-col justify-end p-8 md:p-12 text-white">
                <div className="ed-eyebrow text-white/75 mb-3">
                  {tile.caption}
                </div>
                <div className="ed-tile-label text-white">{tile.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
