import type { Product } from "@/lib/supabase/types";
import { selectProductHeroImage } from "@/lib/product-image-presentation";

const LANDING_FEATURED_ORDER = [
  "atlas-weekender-cognac",
  "oasis-weekender-oxblood",
  "medina-saddlebag-tooled-cognac",
  "expedition-rolltop-noir",
  "atlas-kilim-duffle",
  "marrakech-tote-cognac",
];

const LANDING_PRESENTATION_HOLD = new Set([
  "atlas-field-briefcase",
  "expedition-rolltop-cognac",
]);

// LIST_IMAGE_OVERRIDES is for landing-page presentation ONLY — the few SKUs
// that get a different shot on the homepage than in the catalogue grid.
// NEVER use this to work around a wrong Hero source. The Hero-* file in
// Drive is the source of truth for product imagery; if a product looks
// wrong, fix Supabase/Storage, not this map.
//
// Type is constrained to `/products/landing/...` so TypeScript refuses any
// attempt to slip a Supabase URL fragment or non-landing path into the map.
const LIST_IMAGE_OVERRIDES: Record<string, `/products/landing/${string}.webp`> = {
  "atlas-weekender-cognac": "/products/landing/atlas-weekender-cognac-landing.webp",
  "oasis-weekender-oxblood": "/products/landing/oasis-weekender-oxblood-landing.webp",
  "medina-saddlebag-tooled-cognac": "/products/landing/medina-saddlebag-tooled-cognac-landing.webp",
  "expedition-rolltop-noir": "/products/landing/expedition-rolltop-noir-landing.webp",
  "atlas-kilim-duffle": "/products/landing/atlas-kilim-duffle-landing.webp",
  "marrakech-tote-cognac": "/products/landing/marrakech-tote-cognac-landing.webp",
};

export function isLandingPresentationHold(slug: string): boolean {
  return LANDING_PRESENTATION_HOLD.has(slug);
}

export function curateLandingProducts(products: Product[], limit: number): Product[] {
  const eligible = products.filter(
    (product) => !LANDING_PRESENTATION_HOLD.has(product.slug),
  );
  const order = new Map(LANDING_FEATURED_ORDER.map((slug, index) => [slug, index]));

  return eligible
    .sort((a, b) => {
      const aRank = order.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
      const bRank = order.get(b.slug) ?? Number.MAX_SAFE_INTEGER;
      if (aRank !== bRank) return aRank - bRank;
      return products.indexOf(a) - products.indexOf(b);
    })
    .slice(0, limit);
}

export function selectObjectOfEdition(products: Product[]): Product | null {
  return curateLandingProducts(products, 1)[0] ?? null;
}

export function productListImage(product: Product): string | undefined {
  const override = LIST_IMAGE_OVERRIDES[product.slug];
  if (override) return override;
  return selectProductHeroImage(product);
}

// Card-hover secondary angle. Only numbered -pdp-NN gallery shots qualify:
// they are white-studio product angles, whereas -scale lifestyle objects sit
// on gray/in-context plates and would flash a gray square on the white card.
export function productHoverImage(product: Product): string | undefined {
  return product.images?.find((url) => /-pdp-\d{2}\.webp$/.test(url));
}
