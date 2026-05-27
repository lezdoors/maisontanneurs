import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { bust } from "@/lib/image-url";

interface ProductCardProps {
  title: string;
  price: number;
  image: string;
  slug: string;
  category?: string;
  origin?: string;
  badge?: string;
}

// Categories where price IS shown on the grid (gateway products).
// Leather Goods (bags, larger pieces) hide price on grid → click to PDP.
const SHOW_PRICE_CATEGORIES = new Set([
  "Wallets",
  "Accessories",
  "SLG",
  "Small Leather Goods",
]);

function deriveFamily(slug: string): string {
  // Heuristic: take the silhouette stem from the slug.
  // medina-duffle → DUFFLE  · marrakech-tote-cognac → TOTE
  // heritage-rucksack → RUCKSACK · cognac-brogue-backpack → BACKPACK
  const parts = slug.split("-");
  // Drop a known brand prefix
  const brandPrefixes = ["medina", "marrakech", "praticien", "explorer", "atlas"];
  const stem = brandPrefixes.includes(parts[0]) ? parts.slice(1) : parts;
  // Drop trailing color names
  const colors = [
    "amber",
    "black",
    "bordeaux",
    "burgundy",
    "chocolate",
    "cognac",
    "jade",
    "noir",
    "oxblood",
    "polychrome",
    "tan",
    "teal",
    "walnut",
  ];
  const trimmed = stem.filter((s) => !colors.includes(s));
  // Prefer a true bag silhouette over finish/closure modifiers.
  const silhouettes = [
    "backpack",
    "briefcase",
    "crossbody",
    "duffle",
    "messenger",
    "rolltop",
    "rucksack",
    "saddlebag",
    "satchel",
    "tote",
    "weekender",
  ];
  const silhouette = trimmed.find((s) => silhouettes.includes(s)) || trimmed[trimmed.length - 1] || trimmed[0] || parts[0];
  return silhouette.replace(/-/g, " ").toUpperCase();
}

export default function ProductCard({
  title,
  price,
  image,
  slug,
  category,
}: ProductCardProps) {
  const showPrice = category ? SHOW_PRICE_CATEGORIES.has(category) : false;
  const family = deriveFamily(slug);

  return (
    <Link
      href={`/products/${slug}`}
      className="group block border border-[color:var(--color-rule)] bg-[color:var(--color-paper)] transition-colors hover:border-[color:var(--color-ink)]/35"
    >
      {/* Image plate — F9F9F9 admin surface */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--color-plate)]">
        <Image
          src={bust(image)}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-contain p-[7%] mt-product-img-trim transition-transform duration-[1200ms] ease-out group-hover:scale-[1.025]"
        />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-[color:var(--color-plate)]" />
      </div>

      {/* Admin / dossier register info block */}
      <div
        className="border-t border-[color:var(--color-rule)] px-5 py-4 flex flex-col gap-2"
        style={{ background: "var(--color-paper)" }}
      >
        {/* Top row: SKU mono line */}
        <div
          className="flex items-center gap-3 text-[10.5px] tracking-[0.14em] uppercase"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--color-ink-muted)",
          }}
        >
          <span>{family}</span>
          <span aria-hidden className="text-[color:var(--color-rule-strong)]">/</span>
          <span className="truncate">{slug}</span>
        </div>

        {/* Product title */}
        <h3
          className="text-[15px] leading-tight"
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            letterSpacing: "-0.005em",
            color: "var(--color-ink)",
          }}
        >
          {title}
        </h3>

        {/* Price OR "View details" — depends on category */}
        <div
          className="text-[11px] tracking-[0.16em] uppercase mt-1"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--color-ink)",
          }}
        >
          {showPrice ? (
            <span>{formatPrice(price)}</span>
          ) : (
            <span className="opacity-85 group-hover:opacity-100 transition-opacity">
              View Specifications →
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
