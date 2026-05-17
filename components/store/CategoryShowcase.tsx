import Image from "next/image";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";

// Curated hero per category — overrides whatever the DB returns first.
// Each value is the public Supabase Storage URL.
const HERO_OVERRIDE: Record<string, string> = {
  Lighting:
    "https://unsenfjlqqqjibbnbpur.supabase.co/storage/v1/object/public/media/products/scale/noor-pendant-scale.webp",
  Poufs:
    "https://unsenfjlqqqjibbnbpur.supabase.co/storage/v1/object/public/media/products/scale/leather-pouf-brown-scale.webp",
  Tables:
    "/products/wood-furniture/moroccan-mother-of-pearl-side-table-scale.webp",
  Furniture:
    "https://unsenfjlqqqjibbnbpur.supabase.co/storage/v1/object/public/media/products/scale/kursi-royal-scale.webp",
};

// We surface 4 visual categories on the home grid. "Lighting" rolls up Pendants + Lamps + Lanterns + Sconces.
const SHOWCASE = [
  { title: "Lighting",  dbCategories: ["Pendants", "Lamps", "Lanterns", "Sconces"], href: "/products?category=Pendants" },
  { title: "Poufs",     dbCategories: ["Poufs"],     href: "/products?category=Poufs" },
  { title: "Tables",    dbCategories: ["Tables"],    href: "/products?category=Tables" },
  { title: "Furniture", dbCategories: ["Furniture"], href: "/products?category=Furniture" },
] as const;

export default async function CategoryShowcase() {
  const supabase = await createServerSupabase();
  let counts: Record<string, number> = {};

  if (supabase) {
    const { data } = await supabase
      .from("products")
      .select("category")
      .eq("status", "available");
    if (data) {
      for (const row of data) {
        counts[row.category] = (counts[row.category] || 0) + 1;
      }
    }
  }

  return (
    <section className="rb-section-tight bg-[var(--rb-card-bg-alt)]">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-end justify-between gap-6 mb-8">
          <h2 className="rb-h2">Explore the collection</h2>
          <Link href="/products" className="rb-more hidden md:inline-flex">
            See all
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {SHOWCASE.map((c) => {
            const total = c.dbCategories.reduce((sum, cat) => sum + (counts[cat] || 0), 0);
            return (
              <Link key={c.title} href={c.href} className="rb-product-card group block">
                <div className="rb-card-img-wrap aspect-[4/5] bg-[var(--rb-card-bg)] overflow-hidden">
                  <Image
                    src={HERO_OVERRIDE[c.title]}
                    alt={c.title}
                    fill
                    sizes="(max-width:768px) 50vw, 25vw"
                    className="rb-card-img object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="px-4 py-4 bg-[var(--rb-card-bg)] flex items-baseline justify-between">
                  <div className="rb-card-title text-[14px]">{c.title}</div>
                  <div className="text-[11px] text-[var(--color-muted)]">
                    {total} {total === 1 ? "piece" : "pieces"}
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
