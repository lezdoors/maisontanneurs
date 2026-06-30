"use client";

import Image from "next/image";
import Link from "next/link";
import { useCurrency } from "@/components/store/CurrencyProvider";
import { useLocalizedHref } from "@/lib/i18n-client";
import { bust } from "@/lib/image-url";
import {
  orderProductImages,
  productImageClass,
} from "@/lib/product-image-presentation";
import { productListImage } from "@/lib/landing-product-curation";
import {
  productHeroLocal,
  productHoverLocal,
  productGalleryLocal,
} from "@/lib/product-media";
import StitchLine from "@/components/brand/StitchLine";
import type { Product } from "@/lib/supabase/types";

function colorFor(p: Product): string {
  const fromTitle = p.title.split(/[·\-]/)[1]?.trim();
  if (fromTitle && fromTitle.length < 24) return fromTitle;
  const fromMaterial = (p.materials ?? [])[0]?.split(/[·,]/)[0]?.trim();
  return fromMaterial ?? "Cognac";
}

// Homepage product cell — clean white commerce band, registry N° mark,
// Cormorant title, price, and a hover swap to the second curated angle.
function familyTag(slug: string): string {
  const tokens = ["weekender", "duffle", "holdall", "tote", "satchel", "crossbody", "saddlebag", "backpack", "rucksack", "rolltop", "messenger", "briefcase", "sling"];
  const hit = tokens.find((t) => slug.includes(t));
  return (hit ?? "object").toUpperCase();
}

export default function FeaturedCell({
  product,
  index,
  eager = false,
  ar = "4 / 5",
}: {
  product: Product;
  index: number;
  eager?: boolean;
  ar?: string;
}) {
  const href = useLocalizedHref();
  const { format } = useCurrency();

  // Canonical Drive media first; fall back to legacy resolution only if absent.
  const localGallery = productGalleryLocal(product.slug);
  const hero = productHeroLocal(product.slug) ?? productListImage(product);
  const ordered = localGallery.length
    ? localGallery
    : orderProductImages(product.images);
  const hover =
    productHoverLocal(product.slug) ??
    ordered.find((img) => img && img !== hero);
  const color = colorFor(product);

  return (
    <Link
      href={href(`/products/${product.slug}`)}
      className="group block cursor-pointer"
    >
      {/* Bare object — no plate, no box; floats on the canvas */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: ar }}>
        {hero ? (
          <>
            <Image
              src={bust(hero)}
              alt={product.title}
              fill
              sizes="(min-width: 1024px) 42vw, (min-width: 640px) 50vw, 100vw"
              priority={eager}
              loading={eager ? undefined : "lazy"}
              className={`${productImageClass(hero)} transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]`}
            />
            {hover && (
              <Image
                src={bust(hover)}
                alt=""
                aria-hidden
                fill
                sizes="(min-width: 1024px) 42vw, (min-width: 640px) 50vw, 100vw"
                loading="lazy"
                className={`${productImageClass(hover)} opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100`}
              />
            )}
          </>
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-[11px] tracking-[0.18em]"
            style={{ color: "var(--color-ink-muted)", fontFamily: "var(--font-sans)" }}
          >
            IMAGE PENDING
          </div>
        )}
      </div>

      {/* Gallery placard — left-flush, technical register */}
      <div className="mt-7 max-w-[34ch] text-left">
        <p
          className="text-[9px] uppercase tracking-[0.32em] text-[var(--color-ink-muted)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          N° {String(index).padStart(2, "0")} <span className="px-1 opacity-40">//</span> {familyTag(product.slug)}
        </p>
        <h3
          className="mt-3 text-[clamp(22px,2.1vw,30px)] leading-[1.02]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 300, letterSpacing: "0.005em", color: "var(--color-ink)" }}
        >
          {product.title}
        </h3>
        <StitchLine animate width={120} className="mt-4 -ml-[2px]" />
        <div className="mt-3 flex items-baseline gap-5">
          <span
            className="text-[14px] italic"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            {format(product.price)}
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.26em] text-[var(--color-ink-muted)] transition-colors group-hover:text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {color} · Inspect
          </span>
        </div>
      </div>
    </Link>
  );
}
