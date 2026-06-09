// Cache-busting wrapper for Supabase Storage product images served via
// Next.js Image optimization. Next/Image caches optimized variants keyed by
// URL; when we re-upload a file to the same Storage path (e.g. after a
// source crop pass), the cached variant is stale until the version bump
// rolls. Appending a ?v= query string forces Next/Image to treat the URL
// as new and re-optimize from origin.
//
// Bump CACHE_BUSTER_VERSION any time we recrop / reprocess product image files.
// (Last bump: 2026-06-09 — explorer-rolltop-cognac + vintage-buckle-backpack
// normalized from 1600x2000 to the 2400x2400 white-plate grid spec.)

const CACHE_BUSTER_VERSION = "2026-06-09-plate-normalize-r6";

const SUPABASE_HOST = "xbtabpurfavngwmwtawc.supabase.co";

export function bust(url: string | null | undefined): string {
  if (!url) return "";
  if (!url.includes(SUPABASE_HOST) && !url.startsWith("/products/hero/")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${CACHE_BUSTER_VERSION}`;
}
