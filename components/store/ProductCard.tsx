"use client";

import Image from "next/image";
import Link from "next/link";
import { useCurrency } from "@/components/store/CurrencyProvider";
import { bust } from "@/lib/image-url";
import { productImageClass } from "@/lib/product-image-presentation";
import { useLocalizedHref } from "@/lib/i18n-client";

interface ProductCardProps {
  title: string;
  price: number;
  image: string;
  slug: string;
  category?: string;
  origin?: string;
  badge?: string;
  eager?: boolean;
}

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
  eager = false,
}: ProductCardProps) {
  const href = useLocalizedHref();
  const { format } = useCurrency();
  const family = deriveFamily(slug);

  return (
    <Link
      href={href(`/products/${slug}`)}
      className="group block bg-[color:var(--color-paper)]"
    >
      <div className="mt-product-frame relative aspect-[4/5]">
        <Image
          src={bust(image)}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          loading={eager ? "eager" : "lazy"}
          className={productImageClass(image)}
        />
      </div>

      <div
        className="px-0 pt-5 flex flex-col gap-2"
        style={{ background: "var(--color-paper)" }}
      >
        <div
          className="flex items-center gap-3 text-[10.5px] tracking-[0.14em] uppercase"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--color-ink-muted)",
          }}
        >
          <span>{family}</span>
          <span aria-hidden className="text-[color:var(--color-rule-strong)]">/</span>
          <span>Marrakech atelier</span>
        </div>

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

        <div
          className="text-[10.5px] tracking-[0.16em] uppercase mt-1"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--color-ink)",
          }}
        >
          <span>{format(price)}</span>
        </div>
      </div>
    </Link>
  );
}
