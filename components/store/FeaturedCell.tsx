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
import type { Product } from "@/lib/supabase/types";

function colorFor(p: Product): string {
  const fromTitle = p.title.split(/[·\-]/)[1]?.trim();
  if (fromTitle && fromTitle.length < 24) return fromTitle;
  const fromMaterial = (p.materials ?? [])[0]?.split(/[·,]/)[0]?.trim();
  return fromMaterial ?? "Cognac";
}

// Homepage product cell — clean white commerce band, registry N° mark,
// Cormorant title, price, and a hover swap to the second curated angle.
export default function FeaturedCell({
  product,
  index,
  eager = false,
}: {
  product: Product;
  index: number;
  eager?: boolean;
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
      {/* Product floats on the white commerce band — no plate, no box */}
      <div className="relative aspect-[4/5]">
        {hero ? (
          <>
            <Image
              src={bust(hero)}
              alt={product.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              priority={eager}
              loading={eager ? undefined : "lazy"}
              className={productImageClass(hero)}
            />
            {hover && (
              <Image
                src={bust(hover)}
                alt=""
                aria-hidden
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                loading="lazy"
                className={`${productImageClass(hover)} opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100`}
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

        {/* Registry edition mark */}
        <span
          className="absolute left-[22px] top-[20px] text-[9px] uppercase tracking-[0.25em]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-ink-muted)" }}
        >
          N° {String(index).padStart(2, "0")}
        </span>
      </div>

      {/* Placard metadata — left-flush under the object */}
      <div className="mt-6 text-left">
        <h3
          className="text-[clamp(20px,1.9vw,25px)] leading-[1.05]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 400, color: "var(--color-ink)" }}
        >
          {product.title}
        </h3>
        <p
          className="mt-2 text-[12px] tracking-[0.02em]"
          style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-soft)" }}
        >
          {color}
        </p>
        <div className="mt-4 flex items-baseline justify-between border-t border-[var(--color-rule-soft)] pt-3">
          <span
            className="text-[15px] italic"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            {format(product.price)}
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-muted)] transition-colors group-hover:text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Inspect
          </span>
        </div>
      </div>
    </Link>
  );
}
