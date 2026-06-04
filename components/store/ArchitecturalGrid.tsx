import Image from "next/image";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { STATIC_PRODUCTS, mergeWithStatic } from "@/lib/products";
import { HIDDEN_SKUS, HIDDEN_SKUS_ARRAY } from "@/lib/hidden-skus";
import { bust } from "@/lib/image-url";
import { productImageClass } from "@/lib/product-image-presentation";
import { curateLandingProducts, productListImage } from "@/lib/landing-product-curation";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/supabase/types";

// Polène / Les-Tanneurs-v2 register: stripped product cells, no borders, no
// chrome eyebrows, no SKU labels, no Specimen→ links. Just a tactile frame,
// the name in serif, and the color in micro-sans. Massive breathing room
// (120px row-gap), 4:5 portrait frames, F5F5F5 plate.

const GRID_LIMIT = 6;
const FETCH_LIMIT = 24;

async function loadCurrentEdition(): Promise<Product[]> {
  try {
    const supabase = await createServerSupabase();
    if (!supabase) {
      return curateLandingProducts(
        (STATIC_PRODUCTS as Product[]).filter(
          (p) => !HIDDEN_SKUS.has(p.slug) && p.status === "available",
        ),
        GRID_LIMIT,
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
        GRID_LIMIT,
      );
    }
    const merged = mergeWithStatic(data as Product[]).filter(
      (p) => !HIDDEN_SKUS.has(p.slug) && p.status === "available",
    );
    return curateLandingProducts(merged, GRID_LIMIT);
  } catch {
    return curateLandingProducts(
      (STATIC_PRODUCTS as Product[]).filter(
        (p) => !HIDDEN_SKUS.has(p.slug) && p.status === "available",
      ),
      GRID_LIMIT,
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

export default async function ArchitecturalGrid() {
  const products = await loadCurrentEdition();

  return (
    <section
      id="collection"
      className="w-full bg-[var(--color-paper)] text-[var(--color-ink)]"
      aria-label="Current edition"
    >
      {/* LT2 .section-head — quiet eyebrow, large serif title, italic subhead */}
      <div className="mx-auto max-w-[1400px] text-center pt-[clamp(74px,10vw,130px)] pb-[clamp(44px,6vw,82px)] px-[clamp(24px,6vw,80px)]">
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "12px",
            letterSpacing: "0.02em",
            color: "var(--color-ink-soft)",
            marginBottom: "28px",
          }}
        >
          Volume I — The Current Edition
        </p>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(40px, 5vw, 80px)",
            lineHeight: 1.04,
            letterSpacing: "-0.005em",
            margin: "0 auto",
            maxWidth: "18ch",
            color: "var(--color-ink)",
          }}
        >
          The first six objects.
        </h2>
        <p
          style={{
            margin: "28px auto 0",
            maxWidth: "56ch",
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(16px, 1.4vw, 19px)",
            lineHeight: 1.6,
            color: "var(--color-ink-soft)",
          }}
        >
          A sharper buying moment after the atelier story: price, material, availability, and a direct path into each dossier.
        </p>
      </div>

      {/* LT2 .gallery — generous gaps, no cell borders */}
      <div
        className="mx-auto max-w-[1500px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        style={{
          padding: "40px clamp(24px,8vw,80px) clamp(120px,16vw,200px)",
          columnGap: "clamp(40px, 6vw, 90px)",
          rowGap: "clamp(52px, 7vw, 84px)",
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
          View the Full Catalogue
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
        className="mt-product-frame relative"
        style={{
          aspectRatio: "4 / 5",
        }}
      >
        {hero ? (
          <Image
            src={bust(hero)}
            alt={product.title}
            fill
            loading="eager"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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

        {/* Italic edition number — top-left, very subtle */}
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
        <div className="flex items-start justify-between gap-5">
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(22px, 2vw, 30px)",
              lineHeight: 1.08,
              letterSpacing: 0,
              color: "var(--color-ink)",
              margin: 0,
            }}
          >
            {product.title}
          </h3>
          <span className="pt-1 text-right tech-meta text-[var(--color-ink-muted)]">
            {formatPrice(product.price)}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-[var(--color-rule)] pt-4">
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "12px",
              color: "var(--color-ink-soft)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {color}
          </p>
          <p className="tech-meta text-[var(--color-ink-muted)]">
            {product.available_quantity > 0
              ? `${String(product.available_quantity).padStart(2, "0")} left`
              : "On request"}
          </p>
        </div>
      </div>
    </Link>
  );
}
