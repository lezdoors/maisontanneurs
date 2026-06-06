import Image from "next/image";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { STATIC_PRODUCTS, mergeWithStatic } from "@/lib/products";
import { HIDDEN_SKUS, HIDDEN_SKUS_ARRAY } from "@/lib/hidden-skus";
import { bust } from "@/lib/image-url";
import { productImageClass } from "@/lib/product-image-presentation";
import { curateLandingProducts, productListImage } from "@/lib/landing-product-curation";
import type { Product } from "@/lib/supabase/types";

// Polène / Les-Tanneurs-v2 register: stripped product cells, no borders, no
// chrome eyebrows, no SKU labels, no Specimen→ links. Just a tactile frame,
// the name in serif, and the color in micro-sans. Massive breathing room
// (120px row-gap), 4:5 portrait frames, F5F5F5 plate.

const FEATURED_LIMIT = 3;
const FULL_LIMIT = 6;
const FETCH_LIMIT = 24;

type GridVariant = "featured" | "full";

async function loadCurrentEdition(limit: number): Promise<Product[]> {
  try {
    const supabase = await createServerSupabase();
    if (!supabase) {
      return curateLandingProducts(
        (STATIC_PRODUCTS as Product[]).filter(
          (p) => !HIDDEN_SKUS.has(p.slug) && p.status === "available",
        ),
        limit,
      );
    }
    const hiddenList = `(${HIDDEN_SKUS_ARRAY.join(",")})`;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", "available")
      .eq("featured", true)
      .not("slug", "in", hiddenList)
      .order("created_at", { ascending: false })
      .limit(FETCH_LIMIT);
    if (error || !data || data.length === 0) {
      return curateLandingProducts(
        (STATIC_PRODUCTS as Product[]).filter(
          (p) => !HIDDEN_SKUS.has(p.slug) && p.status === "available",
        ),
        limit,
      );
    }
    const merged = mergeWithStatic(data as Product[]).filter(
      (p) => !HIDDEN_SKUS.has(p.slug) && p.status === "available",
    );
    return curateLandingProducts(merged, limit);
  } catch {
    return curateLandingProducts(
      (STATIC_PRODUCTS as Product[]).filter(
        (p) => !HIDDEN_SKUS.has(p.slug) && p.status === "available",
      ),
      limit,
    );
  }
}

function colorFor(p: Product): string {
  // Best-effort: pull a color name out of the title (e.g. "Medina Duffle · Cognac")
  // or the first material. Fallback to "Cognac".
  const fromTitle = p.title.split(/[·\-]/)[1]?.trim();
  if (fromTitle && fromTitle.length < 24) return fromTitle;
  const fromMaterial = (p.materials ?? [])[0]?.split(/[·,]/)[0]?.trim();
  return fromMaterial ?? "Cognac";
}

export default async function ArchitecturalGrid({
  variant = "full",
}: {
  variant?: GridVariant;
}) {
  const isFeatured = variant === "featured";
  const products = await loadCurrentEdition(isFeatured ? FEATURED_LIMIT : FULL_LIMIT);
  const total = products.length;

  return (
    <section
      id={isFeatured ? "featured-pieces" : "collection"}
      className="w-full bg-[var(--color-paper)] text-[var(--color-ink)]"
      aria-label={isFeatured ? "Featured pieces" : "Current edition"}
    >
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 px-[clamp(24px,6vw,80px)] pt-[clamp(88px,12vw,170px)] pb-[clamp(44px,6vw,84px)] md:grid-cols-[0.72fr_1fr] md:items-end">
        <div>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--color-bronze)",
              marginBottom: "24px",
            }}
          >
            {isFeatured ? "Edition index · first look" : "Volume I · full catalogue"}
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(48px, 7vw, 112px)",
              lineHeight: 0.9,
              letterSpacing: "-0.025em",
              margin: 0,
              maxWidth: "11ch",
              color: "var(--color-ink)",
            }}
          >
            {isFeatured ? (
              <>
                Three objects.
                <br />
                One departure.
              </>
            ) : (
              <>
                The edition,
                <br />
                in full.
              </>
            )}
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-[1fr_220px] md:items-end">
          <p
            style={{
              maxWidth: "58ch",
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(18px, 1.55vw, 24px)",
              lineHeight: 1.48,
              color: "var(--color-ink-soft)",
              margin: 0,
            }}
          >
            {isFeatured
              ? "A tighter opening: travel volume, evening structure, and one numbered daily-carry object. Less catalogue, more decision."
              : "Hand-cut and saddle-stitched in a small Marrakech atelier. Product photography stays clean; campaign images stay in the film."}
          </p>
          <div className="border-t border-[var(--color-rule)] pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
              Visible objects
            </p>
            <p className="mt-2 font-display text-[42px] leading-none text-[var(--color-ink)]">
              {String(total).padStart(2, "0")}
            </p>
          </div>
        </div>
      </div>

      {/* LT2 .gallery — generous gaps, no cell borders */}
      <div
        className="mx-auto max-w-[1500px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        style={{
          padding: isFeatured
            ? "24px clamp(24px,8vw,80px) clamp(88px,12vw,150px)"
            : "40px clamp(24px,8vw,80px) clamp(120px,16vw,200px)",
          columnGap: "clamp(34px, 5vw, 76px)",
          rowGap: "clamp(62px, 8vw, 104px)",
        }}
      >
        {products.map((p, i) => (
          <ProductCell key={p.slug} product={p} index={i + 1} />
        ))}
      </div>

      {/* Trailing CTA — quiet bottom rule + view-all link */}
      <div className="mx-auto max-w-[1400px] px-[clamp(24px,6vw,80px)] text-center pb-[clamp(80px,10vw,140px)]">
        <Link
          href="/products"
          className="inline-flex items-center gap-3 hover:opacity-60 transition-opacity"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "12px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--color-ink)",
            borderBottom: "1px solid var(--color-ink)",
            paddingBottom: "6px",
          }}
        >
          {isFeatured ? "Continue to the Collection" : "View the Full Catalogue"}
        </Link>
      </div>
    </section>
  );
}

function ProductCell({ product, index }: { product: Product; index: number }) {
  const hero = productListImage(product);
  const color = colorFor(product);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block cursor-pointer"
    >
      {/* Frame — consistent product plate, 4:5 portrait, sharp corners. */}
      <div
        className="mt-product-frame mt-ratio-portrait relative"
        style={{
          aspectRatio: "4 / 5",
        }}
      >
        {hero ? (
          <Image
            src={bust(hero)}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            priority={index <= 3}
            className={productImageClass(hero)}
            style={{
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              color: "var(--color-ink-soft)",
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              letterSpacing: "0.18em",
            }}
          >
            IMAGE PENDING
          </div>
        )}

        {/* Edition mark — top-left, very subtle */}
        <span
          className="absolute"
          style={{
            top: "20px",
            left: "22px",
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "13px",
            color: "var(--color-ink-soft)",
          }}
        >
          N° {String(index).padStart(2, "0")}
        </span>
      </div>

      {/* Meta — no border, generous gap, LT2 serif name + sans color */}
      <div className="mt-7 text-left">
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "22px",
            letterSpacing: 0,
            color: "var(--color-ink)",
            margin: 0,
          }}
        >
          {product.title}
        </h3>
        <p
          style={{
            marginTop: "8px",
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            color: "var(--color-ink-soft)",
            letterSpacing: "0.01em",
          }}
        >
          {color}
        </p>
      </div>
    </Link>
  );
}

function numberWord(n: number): string {
  const words: Record<number, string> = {
    1: "one", 2: "two", 3: "three", 4: "four", 5: "five",
    6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten",
    11: "eleven", 12: "twelve", 13: "thirteen", 14: "fourteen",
    15: "fifteen", 16: "sixteen", 18: "eighteen", 20: "twenty",
  };
  return words[n] ?? String(n);
}
