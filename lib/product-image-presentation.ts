import type { Product } from "@/lib/supabase/types";

// Curated alternate-angle picks for product card hover swap. Each entry is a
// deliberate choice (not images[1] roulette) — pick the angle that best sells
// the silhouette from a complementary view to the Hero. If a slug isn't in
// this map, the hover swap doesn't fire — better to show no swap than a
// random supplier shot.
//
// File contract: `/products/hover/{slug}.webp` (enforced by
// scripts/audit-image-contract.ts and the template-literal type below).
const HOVER_BY_SLUG: Record<string, `/products/hover/${string}.webp`> = {
  // Populate with curated picks when files land in public/products/hover/.
  // Until then, ProductSpotlight (or any future hover-swap surface) will not
  // fade to a random alternate — selectProductHoverImage() returns undefined
  // and the consuming component is expected to skip the swap.
};

const DRIVE_HERO_BY_SLUG: Record<string, string> = {
  "atlas-briefcase-vintage": "/products/hero/atlas-briefcase-vintage.webp",
  "atlas-field-briefcase": "/products/hero/atlas-field-briefcase.webp",
  "atlas-kilim-duffle": "/products/hero/atlas-kilim-duffle.webp",
  "atlas-kilim-rucksack": "/products/hero/atlas-kilim-rucksack.webp",
  "atlas-messenger-laptop": "/products/hero/atlas-messenger-laptop.webp",
  "atlas-weekender-cognac": "/products/hero/atlas-weekender-cognac.webp",
  "classic-cognac-satchel": "/products/hero/classic-cognac-satchel.webp",
  "cognac-brogue-backpack": "/products/hero/cognac-brogue-backpack.webp",
  "expedition-rolltop-cognac": "/products/hero/expedition-rolltop-cognac.webp",
  "expedition-rolltop-noir": "/products/hero/expedition-rolltop-noir.webp",
  "explorer-rolltop-cognac": "/products/hero/explorer-rolltop-cognac.webp",
  "heritage-rucksack": "/products/hero/heritage-rucksack.webp",
  "marrakech-tote-cognac": "/products/hero/marrakech-tote-cognac.webp",
  "medina-crossbody-cognac": "/products/hero/medina-crossbody-cognac.webp",
  "medina-crossbody-envelope": "/products/hero/medina-crossbody-envelope.webp",
  "medina-crossbody-tooled-walnut": "/products/hero/medina-crossbody-tooled-walnut.webp",
  "medina-duffle": "/products/hero/medina-duffle.webp",
  "medina-rucksack-drawstring": "/products/hero/medina-rucksack-drawstring.webp",
  "medina-saddlebag-tooled-cognac": "/products/hero/medina-saddlebag-tooled-cognac.webp",
  "oasis-weekender-oxblood": "/products/hero/oasis-weekender-oxblood.webp",
  "vintage-buckle-backpack": "/products/hero/vintage-buckle-backpack.webp",
  "vintage-satchel-light-brown": "/products/hero/vintage-satchel-light-brown.webp",
  "woven-leather-backpack": "/products/hero/woven-leather-backpack.webp",
};

function basename(src: string): string {
  try {
    return decodeURIComponent(src.split(/[?#]/)[0]?.split("/").pop() ?? "").toLowerCase();
  } catch {
    return src.split(/[?#]/)[0]?.split("/").pop()?.toLowerCase() ?? "";
  }
}

export function isPreferredProductHeroImage(src: string): boolean {
  const file = basename(src);
  return (
    file.startsWith("hero-") ||
    file.includes("-hero") ||
    file.includes(" hero") ||
    file.includes("pdp-white") ||
    file.includes("white-bg") ||
    file.includes("white")
  );
}

function imageRank(src: string): number {
  const file = basename(src);
  if (file.startsWith("hero-")) return 0;
  if (file.includes("pdp-white")) return 1;
  if (file.includes("white-bg") || file.includes("white")) return 2;
  if (file.includes("-hero") || file.includes(" hero")) return 3;
  if (file.includes("scale")) return 8;
  return 5;
}

export function orderProductImages(images: string[] | null | undefined): string[] {
  if (!Array.isArray(images)) return [];
  return images
    .map((src, index) => ({ src, index, rank: imageRank(src) }))
    .sort((a, b) => (a.rank - b.rank) || (a.index - b.index))
    .map((item) => item.src);
}

export function selectDriveHeroImage(product: Product): string | undefined {
  return DRIVE_HERO_BY_SLUG[product.slug];
}

export function selectProductHeroImage(product: Product): string | undefined {
  return selectDriveHeroImage(product) ?? orderProductImages(product.images)[0];
}

// Returns the curated hover swap image for this product, or undefined if no
// pick has been made. Consumers MUST treat undefined as "do not swap" — never
// fall back to images[1] or a random pick.
export function selectProductHoverImage(product: Product): string | undefined {
  return HOVER_BY_SLUG[product.slug];
}

export function orderProductGalleryImages(product: Product): string[] {
  const driveHero = selectDriveHeroImage(product);
  const ordered = orderProductImages(product.images);
  if (!driveHero) return ordered;
  return [driveHero, ...ordered.filter((src) => src !== driveHero)];
}

export function productImageClass(src: string): string {
  const needsEdgeTrim = src.startsWith("/products/hero/") || src.includes("atlas-field-briefcase");
  return `object-contain mt-product-img-standard${needsEdgeTrim ? " mt-product-img-edge-trim" : ""}`;
}
