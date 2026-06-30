import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { STATIC_PRODUCTS, mergeWithStatic } from "@/lib/products";
import { HIDDEN_SKUS, HIDDEN_SKUS_ARRAY } from "@/lib/hidden-skus";
import { curateLandingProducts } from "@/lib/landing-product-curation";
import FeaturedCell from "@/components/store/FeaturedCell";
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
      className="w-full bg-[var(--color-commerce)] text-[var(--color-ink)]"
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

      {/* Asymmetric archive — bare objects, staggered heights, deliberate voids */}
      <div
        className="mx-auto grid max-w-[1500px] grid-cols-12 items-start"
        style={{
          columnGap: "clamp(20px,3vw,56px)",
          padding: isFeatured
            ? "16px clamp(24px,8vw,90px) clamp(96px,14vw,190px)"
            : "40px clamp(24px,8vw,90px) clamp(120px,16vw,220px)",
        }}
      >
        {products.map((p, i) => {
          const span = ["lg:col-span-6", "lg:col-span-4", "lg:col-span-5", "lg:col-span-4"][i % 4];
          const off = ["lg:mt-0", "lg:mt-48", "lg:mt-32", "lg:mt-24"][i % 4];
          const ar = ["4 / 5", "3 / 4", "5 / 6", "4 / 5"][i % 4];
          return (
            <div
              key={p.slug}
              className={`col-span-12 mb-16 sm:col-span-6 lg:mb-0 ${span} ${off}`}
            >
              <FeaturedCell product={p} index={i + 1} eager={i < 2} ar={ar} />
            </div>
          );
        })}
      </div>

      {/* Trailing CTA — quiet bottom rule + view-all link */}
      <div className="mx-auto max-w-[1500px] px-[clamp(24px,8vw,80px)] text-left pb-[clamp(80px,10vw,140px)]">
        <Link
          href="/products"
          className="group/cta inline-block p-4 -m-4"
        >
          <span
            className="inline-block border-b pb-[6px] transition-colors duration-300"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "12px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--color-ink)",
              borderColor: "var(--color-ink)",
            }}
          >
            {isFeatured ? "Continue to the Collection" : "View the Full Catalogue"}
          </span>
        </Link>
      </div>
    </section>
  );
}
