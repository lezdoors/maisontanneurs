import Image from "next/image";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { Product } from "@/lib/supabase/types";
import { STATIC_PRODUCTS } from "@/lib/products";
import { HIDDEN_SKUS, HIDDEN_SKUS_ARRAY } from "@/lib/hidden-skus";
import { getServerPriceFormatter } from "@/lib/price-server";
import { orderProductImages } from "@/lib/product-image-presentation";

async function getFeatured(): Promise<Product[]> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const hiddenList = `(${HIDDEN_SKUS_ARRAY.join(",")})`;
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "available")
        .eq("featured", true)
        .not("slug", "in", hiddenList)
        .order("created_at", { ascending: false })
        .limit(12);
      if (!error && data && data.length > 0) {
        return (data as Product[]).filter(
          (p) => !HIDDEN_SKUS.has(p.slug) && Array.isArray(p.images) && p.images.length >= 2,
        );
      }
    }
  } catch {
    // fall through
  }
  return STATIC_PRODUCTS.filter(
    (p) =>
      p.featured &&
      p.status === "available" &&
      !HIDDEN_SKUS.has(p.slug) &&
      p.images.length >= 2,
  ) as unknown as Product[];
}

export default async function ProductSpotlight() {
  const featured = await getFeatured();
  if (featured.length === 0) return null;
  const { format } = await getServerPriceFormatter();

  return (
    <section className="bg-[var(--rb-card-bg-alt)]">
      <div className="max-w-[1480px] mx-auto px-3 md:px-4 pt-10 md:pt-14 pb-14">
        <div className="flex items-end justify-between gap-6 mb-6 px-3 md:px-2">
          <div>
            <div className="rb-eyebrow mb-3">The Atelier</div>
            <h2 className="font-sans font-light tracking-[-0.01em] text-[clamp(22px,2.2vw,30px)] text-[var(--color-ink)]">
              Pieces from our Marrakech workshop.
            </h2>
          </div>
        </div>

        <div className="rb-scroll-x grid grid-flow-col auto-cols-[88vw] sm:auto-cols-[48vw] md:auto-cols-[32%] lg:auto-cols-[calc((100%-2rem)/3)] overflow-x-auto gap-4 snap-x snap-mandatory pb-2">
          {featured.map((p) => {
            const ordered = orderProductImages(p.images);
            const primary = ordered[0] || "/products/product-04.png";
            const secondary = ordered[1] || primary;
            const angles = ordered.length;
            return (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="rb-product-card group relative block snap-start"
              >
                <div className="relative aspect-[4/5] bg-[var(--rb-card-bg)] overflow-hidden">
                  <Image
                    src={primary}
                    alt={p.title}
                    fill
                    sizes="(max-width:768px) 88vw, 500px"
                    className="object-cover transition-opacity duration-500 ease-out group-hover:opacity-0"
                  />
                  <Image
                    src={secondary}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(max-width:768px) 88vw, 500px"
                    className="object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                  />
                </div>

                <div className="bg-[var(--rb-card-bg)] px-5 md:px-6 pt-1 pb-5 md:pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">
                    <div>
                      <div className="text-[13px] text-[var(--color-muted)] leading-tight">{p.category}</div>
                      <div className="text-[20px] md:text-[22px] font-light text-[var(--color-ink)] leading-[1.15] tracking-[-0.005em] mt-1">
                        {p.title}
                      </div>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-[15px] font-medium text-[var(--color-ink)]">{format(p.price)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-1.5">
                      {angles > 1 && (
                        <div className="text-[11px] text-[var(--color-muted)]">
                          {angles} views
                        </div>
                      )}
                      {p.materials && p.materials.length > 0 && (
                        <div className="text-[11px] text-[var(--color-muted)] line-clamp-1 max-w-[18ch]">
                          {p.materials.slice(0, 2).join(" · ")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
