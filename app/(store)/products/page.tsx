import { Suspense } from "react";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import { Product } from "@/lib/supabase/types";
import { STATIC_PRODUCTS, LIGHTING_DB_CATEGORIES, mergeWithStatic } from "@/lib/products";
import { HIDDEN_SKUS, HIDDEN_SKUS_ARRAY } from "@/lib/hidden-skus";
import { normalizeProductFamilies } from "@/lib/product-taxonomy";
import ProductCard from "@/components/store/ProductCard";
import CategoryFilter from "@/components/store/CategoryFilter";
import { getRequestLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";
import { productListImage } from "@/lib/landing-product-curation";

// Normalize a URL category param into the stored DB category form. Handles:
// - Decoded spaces (?category=Wall%20Plates → "Wall Plates")
// - Mixed case
// - "Lighting" → roll-up to multiple DB categories
function resolveCategoryFilter(raw: string): { in?: string[]; eq?: string } {
  const decoded = decodeURIComponent(raw).trim();
  const normalized = decoded
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
  if (normalized.toLowerCase() === "lighting") {
    return { in: [...LIGHTING_DB_CATEGORIES] };
  }
  return { eq: normalized };
}

export const metadata: Metadata = {
  title: "Collection",
  description:
    "Hand-stitched leather goods sourced direct from a Marrakech atelier. Free worldwide shipping via DHL Express, with most orders arriving in 5 to 10 business days.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Maison Tanneurs Collection",
    description:
      "Hand-stitched leather goods sourced direct from a Marrakech atelier. Free worldwide shipping via DHL Express, with most orders arriving in 5 to 10 business days.",
    url: "/products",
  },
};

async function getProducts(category?: string, q?: string): Promise<Product[]> {
  const matchesQuery = (p: Product, needle: string) => {
    const hay = `${p.title} ${p.description ?? ""} ${(p.materials ?? []).join(" ")} ${p.category}`.toLowerCase();
    return hay.includes(needle.toLowerCase());
  };

  try {
    const supabase = await createServerSupabase();

    // If Supabase not configured, use static products
    if (!supabase) {
      let products = normalizeProductFamilies(STATIC_PRODUCTS as Product[]).filter(
        (p) => !HIDDEN_SKUS.has(p.slug) && p.status === "available" && p.featured,
      );
      if (category && category !== "all") {
        const r = resolveCategoryFilter(category);
        if (r.in) {
          const allowed = new Set(r.in);
          products = products.filter((p) => allowed.has(p.category));
        } else if (r.eq) {
          products = products.filter((p) => p.category === r.eq);
        }
      }
      if (q) products = products.filter((p) => matchesQuery(p as Product, q));
      return products as Product[];
    }

    // NOTE: don't filter by category at the DB level — Supabase legacy rows
    // have category="Leather Goods" and would be excluded before the overlay
    // gets a chance to remap them. Fetch all available+featured, merge with
    // STATIC (which fixes legacy categories), then filter client-side.
    const hiddenList = `(${HIDDEN_SKUS_ARRAY.join(",")})`;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", "available")
      .eq("featured", true)
      .not("slug", "in", hiddenList)
      .order("created_at", { ascending: false });

    if (error || !data) {
      // Fall back to static products only if Supabase truly errored.
      let products = normalizeProductFamilies(STATIC_PRODUCTS as Product[]).filter(
        (p) => !HIDDEN_SKUS.has(p.slug) && p.status === "available" && p.featured,
      );
      if (category && category !== "all") {
        const r = resolveCategoryFilter(category);
        if (r.in) {
          const allowed = new Set(r.in);
          products = products.filter((p) => allowed.has(p.category));
        } else if (r.eq) {
          products = products.filter((p) => p.category === r.eq);
        }
      }
      if (q) products = products.filter((p) => matchesQuery(p as Product, q));
      return products as Product[];
    }

    // Merge Supabase results with STATIC supplement (Drop 02 SKUs not yet
    // in Supabase). Then re-apply category/query filters to the merged set
    // so STATIC entries with correct categories surface.
    let products = normalizeProductFamilies(mergeWithStatic(data as Product[])).filter(
      (p) => !HIDDEN_SKUS.has(p.slug) && p.status === "available" && p.featured,
    );
    if (category && category !== "all") {
      const r = resolveCategoryFilter(category);
      if (r.in) {
        const allowed = new Set(r.in);
        products = products.filter((p) => allowed.has(p.category));
      } else if (r.eq) {
        products = products.filter((p) => p.category === r.eq);
      }
    }
    if (q) products = products.filter((p) => matchesQuery(p as Product, q));
    return products;
  } catch {
    let products = normalizeProductFamilies(STATIC_PRODUCTS as Product[]).filter(
      (p) => !HIDDEN_SKUS.has(p.slug) && p.status === "available" && p.featured,
    );
    if (category && category !== "all") {
      const r = resolveCategoryFilter(category);
      if (r.in) {
        const allowed = new Set(r.in);
        products = products.filter((p) => allowed.has(p.category));
      } else if (r.eq) {
        products = products.filter((p) => p.category === r.eq);
      }
    }
    if (q) products = products.filter((p) => matchesQuery(p as Product, q));
    return products as Product[];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const locale = await getRequestLocale();
  const category =
    typeof params.category === "string" ? params.category : undefined;
  const q = typeof params.q === "string" ? params.q : undefined;
  const products = await getProducts(category, q);

  return (
    <main>
      {/* Collection Header */}
      <section className="pt-[clamp(96px,11vw,136px)] px-[clamp(20px,4vw,72px)] pb-0">
        <div className="grid grid-cols-1 gap-8 border-b border-[color:var(--color-rule)] pb-8 lg:grid-cols-[1.4fr_0.8fr_0.55fr] lg:items-end lg:gap-14">
          <div>
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-bronze)]">
              Marrakech atelier · Paris register
            </p>
            <h1 className="font-display text-[clamp(54px,8vw,108px)] font-normal leading-[0.92] text-[var(--color-ink)]">
              Collection
            </h1>
          </div>
          <p className="max-w-[46ch] font-display text-[clamp(17px,1.7vw,22px)] italic leading-[1.45] text-[color:var(--color-ink-soft)]">
            {t(locale, "products.copy")}
          </p>
          <div className="grid grid-cols-3 border border-[var(--color-rule)] lg:block lg:border-0">
            {["Verified heroes", "DHL Express", "Small batches"].map((item) => (
              <div
                key={item}
                className="border-r border-[var(--color-rule)] px-3 py-3 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)] last:border-r-0 lg:border-r-0 lg:border-t lg:px-0 lg:text-left"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Toolbar -- wrapped in Suspense for useSearchParams */}
      <Suspense
        fallback={
          <div className="sticky top-[56px] md:top-[76px] z-30 bg-white/95 backdrop-blur border-b border-[color:var(--color-rule)]">
            <div className="flex items-center justify-between px-[clamp(24px,4vw,72px)] py-4">
              <div className="h-4 w-48 bg-pearl animate-pulse" />
              <div className="h-4 w-16 bg-pearl animate-pulse" />
            </div>
          </div>
        }
      >
        <CategoryFilter productCount={products.length} />
      </Suspense>

      {/* Product Grid */}
      <section className="px-[clamp(20px,4vw,72px)] py-[clamp(34px,5vw,64px)]">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[clamp(28px,4vw,56px)] gap-y-[clamp(54px,7vw,84px)]">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                title={product.title}
                price={product.price}
                image={productListImage(product) || "/products/product-04.png"}
                slug={product.slug}
                category={product.category}
                badge={product.featured ? "One of a Kind" : undefined}
                eager={index < 9}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-serif italic text-[22px] text-graphite mb-4">
              No pieces found in this category.
            </p>
            <p className="body-copy">
              Explore our full collection or check back soon for new works.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
