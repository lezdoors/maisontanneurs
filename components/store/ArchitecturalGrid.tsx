import Image from "next/image";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { STATIC_PRODUCTS } from "@/lib/products";
import type { Product } from "@/lib/supabase/types";

const GRID_LIMIT = 5;

async function loadCurrentEdition(): Promise<Product[]> {
  try {
    const supabase = await createServerSupabase();
    if (!supabase) return STATIC_PRODUCTS.slice(0, GRID_LIMIT) as Product[];

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", "available")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(GRID_LIMIT);

    if (error || !data || data.length === 0) {
      return STATIC_PRODUCTS.slice(0, GRID_LIMIT) as Product[];
    }
    return data as Product[];
  } catch {
    return STATIC_PRODUCTS.slice(0, GRID_LIMIT) as Product[];
  }
}

function familyFor(category: string): string {
  const map: Record<string, string> = {
    "Leather Goods": "OBJECT",
    Bags: "TOTE",
    Backpacks: "BACKPACK",
    Crossbody: "CROSSBODY",
    Totes: "TOTE",
    Duffles: "WEEKENDER",
  };
  return (map[category] ?? category).toUpperCase();
}

export default async function ArchitecturalGrid() {
  const products = await loadCurrentEdition();
  const total = products.length;

  return (
    <section
      id="collection"
      className="w-full bg-[#ffffff] text-[#0f0f0f]"
      aria-label="Current edition"
    >
      <div className="border-y border-[#e5e5e5]">
        <div className="px-6 py-5 flex flex-wrap items-end justify-between gap-y-4">
          <div className="flex items-end gap-6">
            <span className="tech-label opacity-60">§02</span>
            <h2
              className="leading-none font-medium"
              style={{
                fontSize: "clamp(28px, 3.6vw, 36px)",
                letterSpacing: "-0.03em",
              }}
            >
              Index — Current Edition
            </h2>
          </div>
          <div className="flex items-center gap-8 tech-meta opacity-70">
            <span>{String(total).padStart(2, "0")} Objects</span>
            <span>Spring 2026</span>
            <Link href="/products" className="underline-offset-4 hover:underline">
              View Full Catalog →
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-[#e5e5e5]">
        {products.map((p, i) => (
          <ProductCell key={p.slug} product={p} index={i + 1} total={total} />
        ))}
        <TrailingCell />
      </div>
    </section>
  );
}

function ProductCell({
  product,
  index,
  total,
}: {
  product: Product;
  index: number;
  total: number;
}) {
  const family = familyFor(product.category);
  const skuTag = product.slug.toUpperCase();
  const hero = product.images?.[0];

  return (
    <article
      className="group relative border-r border-b border-[#e5e5e5] bg-white"
      data-sku={skuTag}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative bg-[#f9f9f9]" style={{ aspectRatio: "4 / 5" }}>
          {hero ? (
            <Image
              src={hero}
              alt={product.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[#0f0f0f]/40 tech-meta">
              IMAGE PENDING
            </div>
          )}
          <span className="absolute left-3 top-3 tech-meta opacity-60">
            {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className="absolute right-3 top-3 border border-[#0f0f0f]/80 bg-white px-2 py-1 tech-meta">
            AVAILABLE
          </span>
        </div>

        <div className="px-5 pt-4 pb-6">
          <div className="tech-meta opacity-70">
            FAMILY: {family} &nbsp;·&nbsp; SKU: {skuTag}
          </div>
          <div className="mt-2 flex items-end justify-between gap-4">
            <h3
              className="font-medium leading-tight"
              style={{ fontSize: "20px", letterSpacing: "-0.015em" }}
            >
              {product.title}
            </h3>
            <span className="tech-meta opacity-60 shrink-0">
              ED. 04 / {String(product.available_quantity).padStart(3, "0")}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[#e5e5e5] pt-3">
            <span className="tech-meta opacity-70">
              {(product.materials ?? [])[0] ?? "Full-Grain Bovine"}
            </span>
            <span className="tech-label opacity-80 group-hover:opacity-100 group-hover:underline underline-offset-4">
              Specimen →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function TrailingCell() {
  return (
    <article
      className="relative hidden lg:block border-r border-b border-[#e5e5e5] bg-[#0f0f0f] text-white"
      aria-label="Next edition preview"
    >
      <div className="flex h-full min-h-[420px] flex-col justify-between p-6">
        <div className="flex items-center justify-between">
          <span className="tech-meta opacity-60">06 / 05</span>
          <span className="tech-meta opacity-60">NEXT EDITION</span>
        </div>
        <div>
          <h3 className="display-xxl" style={{ fontSize: "44px" }}>
            Edition 05
            <br />
            <span className="opacity-50">incoming.</span>
          </h3>
          <p
            className="mt-4 text-white/70 leading-relaxed"
            style={{ fontSize: "13px", letterSpacing: "-0.01em", maxWidth: "62ch" }}
          >
            A new architecture of carry. Reserve before the cycle closes.
          </p>
          <Link
            href="#atelier"
            className="mt-6 inline-flex h-10 items-center border border-white/40 px-5 tech-label hover:opacity-70"
          >
            Join the Atelier List
          </Link>
        </div>
      </div>
    </article>
  );
}
