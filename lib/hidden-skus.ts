// Single source of truth for SKUs we want hidden from BOTH the build-time
// catalogue audit and the runtime storefront queries.
//
// Why this exists: it is the repo-side mirror of Supabase launch gating.
// Hidden rows should also be status='reserved' and featured=false in Supabase,
// but importing this list in both audits and storefront loaders gives a
// belt-and-suspenders guard if a stale DB snapshot or sync drift appears.
//
// Remove a slug the moment its DB row has a canonical -scale.webp /
// -pdp-white.webp hero AND a clean build confirms the audit re-evaluates it.

export const HIDDEN_SKUS: ReadonlySet<string> = new Set([
  // Internal QA row; never list or index publicly.
  "test-e2e",

  // Kept hidden because Storage has no canonical hero (pdp-white / scale /
  // pdp-hero / scale-hero). To bring online: first find/download the finished
  // HF/Drive product set; generate only after visual search fails. Upload to
  // drop-02/<slug>-pdp-white.webp, re-run the manifest builder
  // (scripts/build-images-manifest.py), then remove the slug from this set.
  // See docs/PRODUCT-IMAGES-MANIFEST.md for canonical inventory.

  // Duplicate/scope suppression: the patterned leather + textile duffle belongs
  // to the Kilim family, so keep this duplicate commercial SKU off launch.
  "medina-duffle",

  // Supabase-only rows missing required approved launch galleries/identity
  // confirmation. Keep reserved + hidden until approved galleries exist.
  "medina-cargo-rucksack-cognac",
  "medina-market-tote-cognac",
  "medina-zigzag-tote-chocolate",
]);

export const HIDDEN_SKUS_ARRAY: readonly string[] = Array.from(HIDDEN_SKUS);
