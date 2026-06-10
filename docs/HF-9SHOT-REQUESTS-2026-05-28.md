# Maison Tanneurs HF 9-Shot Requests — 2026-05-28

> 2026-06-09 hard stop: this is an old fallback brief, not a current build rule.
> Do not generate or wire product commerce images from this file unless Ryan
> explicitly reopens a specific SKU. Current product commerce imagery must come
> only from Drive `Maison Tanneurs/usable product pics`; each product's `Hero-*`
> stays first as `{slug}-pdp-white.webp`. See
> `docs/PRODUCT-IMAGE-SOURCE-OF-TRUTH.md`.

Purpose: fallback brief for Ryan/Rocco only if visual audit proves the exact
product set is not already in Higgsfield or Google Drive. Do not treat this file
as an automatic generation list.

Ryan confirmed the completed 9-shot sets may already exist under unreliable
names, and as of the latest handoff he believes all bags have their 9 multishots
somewhere in HF/Drive. First inspect:

- Google Drive `usable product pics`
- Higgsfield web account
- Archived contact sheets:
  `/Users/ryanz/brand-assets/maison-tanneurs/_audits/2026-05-28-product-source-sheets`
- Focused backpack verification:
  `/Users/ryanz/brand-assets/maison-tanneurs/_audits/2026-05-28-product-source-sheets/focused-backpack-search/cognac-woven-visual-verification.jpg`

Only generate after checking the actual bag silhouette against the live PDP
reference and failing to find/download the existing 9-shot set.

Use Higgsfield's 9-shot product option, not one-off single shots. Ryan has the
unlimited single-shot toggle, but the launch gap here is multi-angle PDP gallery
depth.

Update: Ryan provided/confirmed the exact Drive sources for
`cognac-brogue-backpack` and `woven-leather-backpack`. Both folders have been
renamed to canonical `product-slug-pdp-01.webp` through `-09.webp`, uploaded to
Supabase Storage, and wired to the live product rows. Do not generate either SKU.

Save completed folders in Google Drive:

`/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/usable product pics`

## Current Action List — Download Finished HF Sets, Do Not Regenerate First

As of the latest visual QA, these visible launch SKUs still need exact finished
HF 9-shot exports or explicit SKU reassignment before Codex can encode/upload/
wire them:

| SKU | Destination folder |
| --- | --- |
| `atlas-briefcase-vintage` | `/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/usable product pics/atlas-briefcase-vintage` |
| `medina-crossbody-cognac` | `/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/usable product pics/medina-crossbody-cognac` |
| `vintage-satchel-light-brown` | `/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/usable product pics/vintage-satchel-light-brown` |

2026-05-28 QA hold:

- `atlas-briefcase-vintage` folder now contains 9 PNGs, but the visible product
  is a soft cognac top-handle handbag with tan flap and front zip pocket. It
  does **not** match the current live `atlas-briefcase-vintage` SKU description
  or supplier reference, which is the larger vintage flap briefcase with side
  buckles and twin front pockets. Do not wire this folder to
  `atlas-briefcase-vintage` without Ryan/Rocco explicitly confirming the SKU
  should be renamed/reassigned.
- `medina-crossbody-cognac` folder now contains 9 PNGs, but the visible product
  is a small structured top-handle flap handbag. It does **not** cleanly match
  the current live `medina-crossbody-cognac` description, which says adjustable
  shoulder strap/crossbody. Do not wire without explicit mapping confirmation.
- Contact sheets for both folders are archived at
  `/Users/ryanz/brand-assets/maison-tanneurs/_audits/2026-05-28-new-drive-sets/`.

Launch-acceptable but still useful to archive when found:

| SKU | What to do |
| --- | --- |
| `black-stitched-backpack` | Find/archive the exact finished source folder when convenient; live gallery is acceptable. |
| `classic-cognac-satchel` | Find/archive the exact finished source folder when convenient; live gallery is acceptable. |

Do not use `Bags Screen shots`, Oussam uploads, supplier folders, screenshot
folders, grids/contact sheets, or raw background-removal files as PDP/gallery
assets. They are visual references only.

## Priority 1 — Fallback 9-Shot Sets Only If Exact Existing Set Is Not Found

### `atlas-briefcase-vintage-9shot`

Live PDP: `https://maisontanneurs.com/products/atlas-briefcase-vintage`

Use the current live PDP hero/reference image.

Preserve exactly:

- Structured burgundy/cognac briefcase body.
- Twin rolled top handles.
- Brass center lock plate.
- Side gussets.
- Slim leather tabs and stitching.

Reject if HF changes it into a soft duffle, tote, messenger, or generic satchel.

### `medina-crossbody-cognac-9shot`

Live PDP: `https://maisontanneurs.com/products/medina-crossbody-cognac`

Use the current live PDP hero/reference image.

Preserve exactly:

- Simple cognac rectangular crossbody.
- Single front flap.
- Pointed stitched tab.
- One center buckle strap.
- Long shoulder strap.
- White contrast stitching.

Reject if HF adds extra pockets, tooling, tassels, second buckles, logos, or a
different closure.

### `vintage-satchel-light-brown-9shot`

Live PDP: `https://maisontanneurs.com/products/vintage-satchel-light-brown`

Use the current live PDP hero/reference image.

Preserve exactly:

- Tall light-brown vertical satchel shape.
- Simple flap.
- Bottom tab closure.
- Shoulder strap.
- Plain leather surface, no ornate tooling.

Reject if HF turns it into a structured buckle satchel, briefcase, or messenger.

## Resolved 2026-05-28

- `cognac-brogue-backpack`: Drive folder
  `usable product pics/cognac-brogue-backpack`; staged at
  `/Users/ryanz/brand-assets/maison-tanneurs/_upload-ready/2026-05-28-cognac-brogue-backpack`.
- `woven-leather-backpack`: Drive folder
  `usable product pics/woven-leather-backpack`; staged at
  `/Users/ryanz/brand-assets/maison-tanneurs/_upload-ready/2026-05-28-woven-leather-backpack`.
- `atlas-kilim-rucksack`: Drive folder
  `usable product pics/atlas-kilim-rucksack`; staged at
  `/Users/ryanz/brand-assets/maison-tanneurs/_upload-ready/2026-05-28-atlas-kilim-rucksack-full`.
- `atlas-field-briefcase`: Drive folder
  `usable product pics/atlas-field-briefcase`; staged at
  `/Users/ryanz/brand-assets/maison-tanneurs/_upload-ready/2026-05-28-atlas-field-briefcase`.

## Required 9-Shot Output Mix

Each folder should contain 9 separate images, not a grid/contact sheet:

1. Clean front hero.
2. Rear view.
3. Left side profile.
4. Right side profile.
5. Three-quarter front.
6. Three-quarter rear.
7. Interior/opening or top detail if available.
8. Hardware/stitching macro.
9. Strap/handle/side construction detail.

All shots:

- Clean white or very light neutral background.
- Luxury ecommerce PDP style.
- No props, no models, no text, no logos.
- Product centered with enough white margin.
- Product identity must match the live PDP reference.

## After Ryan/Rocco Generates

Codex/ops should:

1. Run visual QA against the live PDP reference.
2. Reject wrong-product or collage/grid outputs.
3. Encode accepted images to WebP.
4. Upload to Supabase Storage.
5. Update `products.images[]`.
6. Rerun:
   - `pnpm exec tsx scripts/audit-assets.ts`
   - `pnpm exec tsx scripts/audit-media-sources.ts`
   - `pnpm audit:public`
7. Deploy only after audits pass.
