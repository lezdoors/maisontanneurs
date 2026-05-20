import { Suspense } from "react";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import { Product } from "@/lib/supabase/types";
import { STATIC_PRODUCTS, LIGHTING_DB_CATEGORIES } from "@/lib/products";
import ProductCard from "@/components/store/ProductCard";
import CategoryFilter from "@/components/store/CategoryFilter";

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
  title: "Drops",
  description:
    "Hand-stitched leather wearables sourced direct from a Marrakech atelier. Shipped worldwide in 3–5 days via DHL/FedEx.",
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
      let products = STATIC_PRODUCTS;
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

    let query = supabase
      .from("products")
      .select("*")
      .eq("status", "available")
      .order("created_at", { ascending: false });

    if (category && category !== "all") {
      const r = resolveCategoryFilter(category);
      if (r.in) {
        query = query.in("category", r.in);
      } else if (r.eq) {
        query = query.eq("category", r.eq);
      }
    }

    if (q) {
      const needle = `%${q}%`;
      query = query.or(`title.ilike.${needle},description.ilike.${needle},category.ilike.${needle}`);
    }

    const { data, error } = await query;

    if (error || !data) {
      // Fall back to static products only if Supabase truly errored.
      // An empty result (no matches for the query) should stay empty, not fall back.
      let products = STATIC_PRODUCTS;
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

    return data as Product[];
  } catch {
    let products = STATIC_PRODUCTS;
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
  const category =
    typeof params.category === "string" ? params.category : undefined;
  const q = typeof params.q === "string" ? params.q : undefined;
  const products = await getProducts(category, q);

  return (
    <main>
      {/* Collection Header */}
      <section className="pt-[180px] px-[clamp(24px,4vw,72px)] pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 lg:gap-16 items-end pb-10 border-b border-stone">
          <h1 className="disp text-[clamp(56px,8vw,112px)] max-w-[14ch]">
            Drops
          </h1>
          <p className="font-serif italic text-[18px] leading-[1.55] text-graphite max-w-[44ch]">
            Hand-stitched leather from a small Marrakech atelier. Each drop
            is a tight edition — released, sold, restocked only when the
            leather is right.
          </p>
        </div>
      </section>

      {/* Filter Toolbar -- wrapped in Suspense for useSearchParams */}
      <Suspense
        fallback={
          <div className="sticky top-[69px] z-30 bg-chalk border-b border-stone">
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
      <section className="px-[clamp(24px,4vw,72px)] py-[80px]">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-9 gap-y-[72px]">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                title={product.title}
                price={product.price}
                image={product.images[0] || "/products/product-04.png"}
                slug={product.slug}
                badge={product.featured ? "One of a Kind" : undefined}
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
