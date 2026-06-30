// Canonical product media — sourced ONLY from Drive "usable product pics"
// (Hero-<slug>.png + <slug>-pdp-NN), optimized into /public/products/<slug>/.
// This is the single source of truth for product photography on the storefront;
// it overrides any legacy Supabase / static `images[]`. Built by
// scripts build_product_media.py → lib/product-media.json.
import media from "./product-media.json";

type Entry = { hero: string | null; gallery: string[] };
const MEDIA = media as Record<string, Entry>;

/** Drive Hero-<slug> for this slug, or undefined if we have no canonical set. */
export function productHeroLocal(slug: string): string | undefined {
  return MEDIA[slug]?.hero || undefined;
}

/** Full ordered gallery [hero, ...angles] from Drive, or [] if none. */
export function productGalleryLocal(slug: string): string[] {
  const e = MEDIA[slug];
  if (!e || !e.hero) return [];
  return [e.hero, ...(e.gallery || [])];
}

/** The first non-hero angle, for card hover swaps. */
export function productHoverLocal(slug: string): string | undefined {
  return MEDIA[slug]?.gallery?.[0] || undefined;
}

export function hasLocalMedia(slug: string): boolean {
  return Boolean(MEDIA[slug]?.hero);
}
