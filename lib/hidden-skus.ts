// Single source of truth for SKUs we want hidden from BOTH the build-time
// catalogue audit and the runtime storefront queries.
//
// Why this exists: rows demoted to status='draft' in Postgres are not always
// reflected in PostgREST's snapshot via the us-west-1 shared pooler (observed
// 2026-05-24). The audit's REST client and the storefront's REST client both
// see the stale `available` snapshot, so the storefront keeps surfacing
// products that have non-canonical heroes (supplier raws, -pdp-hero naming).
//
// Importing this list in both `scripts/audit-catalogue.ts` and the storefront
// loaders gives belt-and-suspenders: drafts hide the row when PostgREST is
// fresh, this list hides the row when PostgREST is stale.
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


  // Duplicate/scope suppression: user confirmed the Kilim duffle should not
  // launch because the Kilim Leather Duffle Bag and atlas-kilim-rucksack cover
  // the same product family/color story.
  "atlas-kilim-duffle",
  // Duplicate/scope suppression: the patterned leather + textile duffle belongs
  // to the Kilim family, so keep this duplicate commercial SKU off launch.
  "medina-duffle",
  // Duplicate/scope suppression: Expedition Rolltop Noir is the only black bag
  // in the launch set. Keep this older black backpack SKU off the storefront.
  "black-stitched-backpack",

  // Group B — only macro shots in Storage, no canonical hero. Macros are
  // gallery-only per Turbo's convention; audit rejects them as images[0].
  // Stay hidden until a pdp-white or scale shot lands.
  "explorer-rolltop-noir",
]);

export const HIDDEN_SKUS_ARRAY: readonly string[] = Array.from(HIDDEN_SKUS);
