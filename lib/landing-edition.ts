import { STATIC_PRODUCTS, mergeWithStatic } from "@/lib/products";
import { HIDDEN_SKUS, HIDDEN_SKUS_ARRAY } from "@/lib/hidden-skus";
import { productListImage } from "@/lib/landing-product-curation";
import { selectProductHeroImage } from "@/lib/product-image-presentation";
import { bust } from "@/lib/image-url";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Product } from "@/lib/supabase/types";

export type ProductVM = {
  slug: string;
  title: string;
  priceCents: number;
  image: string;
  material: string;
};

const HERO_SLUG = "atlas-weekender-cognac";
const GRID_SLUGS = [
  "oasis-weekender-oxblood",
  "atlas-briefcase-vintage",
  "expedition-rolltop-noir",
  "atlas-kilim-duffle",
  "marrakech-tote-cognac",
  "medina-crossbody-tooled-walnut",
];
const CAROUSEL_SLUGS = [
  "classic-cognac-satchel",
  "heritage-rucksack",
  "woven-leather-backpack",
  "cognac-brogue-backpack",
];

function staticFallback(): Product[] {
  return (STATIC_PRODUCTS as Product[]).filter(
    (p) => !HIDDEN_SKUS.has(p.slug) && p.status === "available",
  );
}

async function loadAvailableProducts(): Promise<Product[]> {
  try {
    const supabase = await createServerSupabase();
    if (!supabase) return staticFallback();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", "available")
      .not("slug", "in", `(${HIDDEN_SKUS_ARRAY.join(",")})`);

    if (error || !data || data.length === 0) return staticFallback();

    return mergeWithStatic(data as Product[]);
  } catch {
    return staticFallback();
  }
}

function toVM(p: Product): ProductVM {
  return {
    slug: p.slug,
    title: p.title,
    priceCents: p.price,
    image: bust(productListImage(p) ?? selectProductHeroImage(p) ?? ""),
    material: (p.materials && p.materials[0]) || "Full-grain leather, hand-finished",
  };
}

export async function loadHomeProducts(): Promise<{
  hero: ProductVM | null;
  grid: ProductVM[];
  carousel: ProductVM[];
}> {
  const products = await loadAvailableProducts();
  const map = new Map<string, Product>(products.map((p) => [p.slug, p]));

  const hero = map.has(HERO_SLUG) ? toVM(map.get(HERO_SLUG)!) : null;

  const grid = GRID_SLUGS.map((s) => map.get(s))
    .filter((p): p is Product => Boolean(p))
    .map(toVM);

  const carousel = CAROUSEL_SLUGS.map((s) => map.get(s))
    .filter((p): p is Product => Boolean(p))
    .map(toVM);

  return { hero, grid, carousel };
}
