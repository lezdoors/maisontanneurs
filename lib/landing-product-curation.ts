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

const LIST_IMAGE_OVERRIDES: Record<string, string> = {
  "atlas-weekender-cognac": "/products/landing/atlas-weekender-cognac-landing.webp",
  "oasis-weekender-oxblood": "/products/landing/oasis-weekender-oxblood-landing.webp",
  "medina-saddlebag-tooled-cognac": "/products/landing/medina-saddlebag-tooled-cognac-landing.webp",
  "expedition-rolltop-noir": "/products/landing/expedition-rolltop-noir-landing.webp",
  "atlas-kilim-duffle": "/products/landing/atlas-kilim-duffle-landing.webp",
  "marrakech-tote-cognac": "/products/landing/marrakech-tote-cognac-landing.webp",
  "expedition-rolltop-cognac": "expedition-rolltop-cognac-pdp-05.webp",
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
  const overrideName = LIST_IMAGE_OVERRIDES[product.slug];
  if (overrideName) {
    if (overrideName.startsWith("/")) return overrideName;
    return product.images?.find((image) => image.includes(overrideName)) ?? selectProductHeroImage(product);
  }
  return selectProductHeroImage(product);
}
