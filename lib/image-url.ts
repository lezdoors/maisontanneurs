// Cache-busting wrapper for Supabase Storage product images served via
// Next.js Image optimization. Next/Image caches optimized variants keyed by
// URL; when we re-upload a file to the same Storage path (e.g. after a
// source crop pass), the cached variant is stale until the version bump
// rolls. Appending a ?v= query string forces Next/Image to treat the URL
// as new and re-optimize from origin.
//
// Bump CACHE_BUSTER_VERSION any time we recrop / reprocess product image files.
// (Last bump: 2026-06-08 — 6 hero files re-pulled from Rocco clean source to
// kill black/gray-plate variants on classic-cognac-satchel, cognac-brogue-
// backpack, explorer-rolltop-cognac, heritage-rucksack, marrakech-tote-cognac,
// vintage-buckle-backpack.)

const CACHE_BUSTER_VERSION = "2026-06-08-drive-hero-resync-r4";

const SUPABASE_HOST = "xbtabpurfavngwmwtawc.supabase.co";

export function bust(url: string | null | undefined): string {
  if (!url) return "";
  if (!url.includes(SUPABASE_HOST) && !url.startsWith("/products/hero/")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${CACHE_BUSTER_VERSION}`;
}
