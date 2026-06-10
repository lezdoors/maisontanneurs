# Maison Tanneurs product media source-of-truth cleanup plan — 2026-06-08
Canonical product source folder:
`/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/usable product pics`

## Contract from Ryan
- The only hard-drive source for real product pictures is Google Drive `Maison Tanneurs/usable product pics`.
- Any product-like image outside that folder is not a product source. It may be a derived site asset, old fallback, random reference, or launch creative, but agents must not choose products from it.
- Site/catalogue product images must be derived from a reviewed `Hero-*` / PDP image inside `usable product pics`, then encoded/uploaded to the canonical site/Supabase path.
- No agent gets to invent a product from Downloads, public/assets, public/products legacy folders, supplier screenshots, HF folders, or old prototypes.

## Current inventory
- Top-level folders inside usable product pics: 51
- Suspicious top-level folders needing cleanup/merge: 21
- Repo public product/asset slug folders not matching Drive top-level source folders: 11

## Suspicious folders in `usable product pics`
- `Bags Screen shots` — not canonical slug casing/spacing, hero_count=0; images=15; heroes=none; child_dirs=11
- `atlas-kilim-duffle-alt` — role/variant token in top-level folder; images=9; heroes=['Hero-atlas-kilim-duffle-alt.png']; child_dirs=0
- `atlas-kilim-rucksack-alt` — role/variant token in top-level folder, hero_count=3; images=10; heroes=['Hero-atlas-kilim-rucksack-alt-02.png', 'Hero-atlas-kilim-rucksack-alt-03.png', 'Hero-atlas-kilim-rucksack-alt.png']; child_dirs=0
- `atlas-messenger-laptop` — hero_count=2; images=10; heroes=['Hero-atlas-messenger-laptop-02.png', 'Hero-atlas-messenger-laptop.png']; child_dirs=0
- `classic-cognac-satchel` — hero_count=4; images=10; heroes=['Hero-classic-cognac-satchel-02-hd.png', 'Hero-classic-cognac-satchel-02.png', 'Hero-classic-cognac-satchel-HD.png', 'Hero-classic-cognac-satchel.png']; child_dirs=1
- `cognac-brogue-backpack` — hero_count=2; images=9; heroes=['Hero-cognac-brogue-backpack-hd.png', 'Hero-cognac-brogue-backpack.png']; child_dirs=0
- `explorer-rolltop-cognac` — hero_count=3; images=21; heroes=['Hero-explorer-rolltop-cognac-02.png', 'Hero-explorer-rolltop-cognac-03.png', 'Hero-explorer-rolltop-cognac.png']; child_dirs=0
- `explorer-rolltop-cognac-scale` — role/variant token in top-level folder; images=9; heroes=['Hero-explorer-rolltop-cognac-scale.png']; child_dirs=0
- `le-nomade` — hero_count=2; images=9; heroes=['Hero-le-nomade-02.png', 'Hero-le-nomade.png']; child_dirs=1
- `marrakech-tote-cognac` — hero_count=4; images=14; heroes=['Hero-marrakech-tote-cognac-02.png', 'Hero-marrakech-tote-cognac-03.png', 'Hero-marrakech-tote-cognac-04.png', 'Hero-marrakech-tote-cognac.png']; child_dirs=0
- `medina-cargo-rucksack-moutarde` — hero_count=2; images=15; heroes=['Hero-medina-cargo-rucksack-moutarde-02.png', 'Hero-medina-cargo-rucksack-moutarde.png']; child_dirs=0
- `medina-crossbody-envelope` — hero_count=2; images=9; heroes=['Hero-medina-crossbody-envelope-02.png', 'Hero-medina-crossbody-envelope.png']; child_dirs=0
- `medina-crossbody-envelope-alt` — role/variant token in top-level folder; images=10; heroes=['Hero-medina-crossbody-envelope-alt.png']; child_dirs=0
- `medina-crossbody-tooled-walnut-macro` — role/variant token in top-level folder, hero_count=9; images=9; heroes=['Hero-medina-crossbody-tooled-walnut-macro-02.png', 'Hero-medina-crossbody-tooled-walnut-macro-03.png', 'Hero-medina-crossbody-tooled-walnut-macro-04.png', 'Hero-medina-crossbody-tooled-walnut-macro-05.png', 'Hero-medina-crossbody-tooled-walnut-macro-06.png', 'Hero-medina-crossbody-tooled-walnut-macro-07.png', 'Hero-medina-crossbody-tooled-walnut-macro-08.png', 'Hero-medina-crossbody-tooled-walnut-macro-09.png', 'Hero-medina-crossbody-tooled-walnut-macro.png']; child_dirs=0
- `medina-crossbody-walnut-macro` — role/variant token in top-level folder; images=11; heroes=['Hero-medina-crossbody-walnut-macro.png']; child_dirs=0
- `medina-duffle-alt` — role/variant token in top-level folder, hero_count=2; images=13; heroes=['Hero-medina-duffle-alt-02.png', 'Hero-medina-duffle-alt.png']; child_dirs=0
- `medina-duffle-scale` — role/variant token in top-level folder; images=9; heroes=['Hero-medina-duffle-scale.png']; child_dirs=0
- `medina-rucksack-drawstring-light-brown` — hero_count=4; images=13; heroes=['Hero-medina-rucksack-drawstring-light-brown-02.png', 'Hero-medina-rucksack-drawstring-light-brown-03.png', 'Hero-medina-rucksack-drawstring-light-brown-04.png', 'Hero-medina-rucksack-drawstring-light-brown.png']; child_dirs=0
- `medina-rucksack-drawstring-scale` — role/variant token in top-level folder; images=19; heroes=['Hero-medina-rucksack-drawstring-scale.png']; child_dirs=0
- `vintage-buckle-backpack-light-pdp` — role/variant token in top-level folder, hero_count=2; images=10; heroes=['Hero-vintage-buckle-backpack-light-pdp-02.png', 'Hero-vintage-buckle-backpack-light-pdp.png']; child_dirs=0
- `vintage-buckle-backpack-scale` — role/variant token in top-level folder; images=10; heroes=['Hero-vintage-buckle-backpack-scale.png']; child_dirs=1

## Alias groups to resolve first
- `medina-duffle` should be the review anchor. Existing alias/role folders: medina-duffle-alt, medina-duffle-scale. Decide by visual contact sheet: merge role assets into one folder OR split into colorway slug if visibly a separate sellable color.
- `vintage-buckle-backpack` should be the review anchor. Existing alias/role folders: vintage-buckle-backpack-light-pdp, vintage-buckle-backpack-scale. Decide by visual contact sheet: merge role assets into one folder OR split into colorway slug if visibly a separate sellable color.
- `medina-crossbody-envelope` should be the review anchor. Existing alias/role folders: medina-crossbody-envelope-alt. Decide by visual contact sheet: merge role assets into one folder OR split into colorway slug if visibly a separate sellable color.
- `medina-rucksack-drawstring` should be the review anchor. Existing alias/role folders: medina-rucksack-drawstring-light-brown, medina-rucksack-drawstring-scale. Decide by visual contact sheet: merge role assets into one folder OR split into colorway slug if visibly a separate sellable color.
- `atlas-kilim-duffle` should be the review anchor. Existing alias/role folders: atlas-kilim-duffle-alt. Decide by visual contact sheet: merge role assets into one folder OR split into colorway slug if visibly a separate sellable color.

Immediate visual notes from contact sheets already inspected:
- `medina-duffle` is currently misnamed: visible product is a tall sling/drawstring rucksack, not the weekender duffle. Do not wire it as the Medina Duffle until renamed/split.
- `medina-duffle-alt` is a separate crossbody/messenger silhouette, not the same duffle. It needs its own commercial slug or merge with an existing crossbody/messenger product after visual review.
- `medina-duffle-scale` is the actual weekender duffle family. This likely needs to become the canonical `medina-duffle` set, with scale/lifestyle filenames folded into the same top-level folder.
- `vintage-buckle-backpack`, `vintage-buckle-backpack-light-pdp`, and `vintage-buckle-backpack-scale` are not one simple duplicate: light/honey and dark/chocolate versions look like distinct sellable colorways. Final slugs should preserve color if both are sold.

## Upscale candidates
Rule: hero/PDP long side <= 1365 px is an upscaling candidate for PDP/marketplace use.
- `atlas-briefcase-vintage` — 9/9 small; examples: Hero-atlas-briefcase-vintage.png (1365x1365), atlas-briefcase-vintage-pdp-01.png (1365x1365), atlas-briefcase-vintage-pdp-02.png (1365x1365)
- `atlas-escape-duffle` — 9/9 small; examples: Hero-atlas-escape-duffle.png (1365x1365), atlas-escape-duffle-pdp-01.png (1365x1365), atlas-escape-duffle-pdp-02.png (1365x1365)
- `atlas-field-briefcase` — 18/18 small; examples: Hero-atlas-field-briefcase.webp (1365x1365), atlas-field-briefcase-pdp-01.png (1365x1365), atlas-field-briefcase-pdp-02.webp (1365x1365)
- `atlas-kilim-backpack` — 10/10 small; examples: Hero-atlas-kilim-backpack.png (1365x1365), atlas-kilim-backpack-pdp-01.png (1365x1365), atlas-kilim-backpack-pdp-02.png (1365x1365)
- `atlas-kilim-duffle` — 9/9 small; examples: Hero-atlas-kilim-duffle.png (1365x1365), atlas-kilim-duffle-pdp-01.png (1365x1365), atlas-kilim-duffle-pdp-02.png (1365x1365)
- `atlas-kilim-duffle-alt` — 9/9 small; examples: Hero-atlas-kilim-duffle-alt.png (1365x1365), atlas-kilim-duffle-alt-pdp-01.png (1365x1365), atlas-kilim-duffle-alt-pdp-02.png (1365x1365)
- `atlas-kilim-rucksack-alt` — 10/10 small; examples: Hero-atlas-kilim-rucksack-alt-02.png (1365x1365), Hero-atlas-kilim-rucksack-alt-03.png (1365x1365), Hero-atlas-kilim-rucksack-alt.png (1365x1365)
- `atlas-messenger-laptop` — 9/10 small; examples: Hero-atlas-messenger-laptop-02.png (1365x1365), atlas-messenger-laptop-pdp-01.png (1365x1365), atlas-messenger-laptop-pdp-02.png (1365x1365)
- `classic-cognac-satchel` — 10/10 small; examples: Hero-classic-cognac-satchel-02-hd.png (1365x1365), Hero-classic-cognac-satchel-02.png (1365x1365), Hero-classic-cognac-satchel-HD.png (1365x1365)
- `cognac-brogue-backpack` — 9/9 small; examples: Hero-cognac-brogue-backpack-hd.png (1365x1365), Hero-cognac-brogue-backpack.png (1365x1365), cognac-brogue-backpack-pdp-01-hd.png (1365x1365)
- `explorer-rolltop-cognac` — 21/21 small; examples: Hero-explorer-rolltop-cognac-02.png (1365x1365), Hero-explorer-rolltop-cognac-03.png (1365x1365), Hero-explorer-rolltop-cognac.png (1365x1365)
- `explorer-rolltop-cognac-scale` — 9/9 small; examples: Hero-explorer-rolltop-cognac-scale.png (1365x1365), explorer-rolltop-cognac-scale-pdp-01.png (1365x1365), explorer-rolltop-cognac-scale-pdp-02.png (1365x1365)
- `explorer-rolltop-noir` — 10/10 small; examples: Hero-explorer-rolltop-noir.png (1365x1365), explorer-rolltop-noir-pdp-01.png (1365x1365), explorer-rolltop-noir-pdp-02.png (1365x1365)
- `kilim-travel-bag-moutarde` — 10/10 small; examples: Hero-kilim-travel-bag-moutarde.png (1365x1365), kilim-travel-bag-moutarde-pdp-01.png (1365x1365), kilim-travel-bag-moutarde-pdp-02.png (1365x1365)
- `le-caravanier-chocolate` — 10/10 small; examples: Hero-le-caravanier-chocolate.png (1344x1344), le-caravanier-chocolate-pdp-01.png (1342x1345), le-caravanier-chocolate-pdp-02.png (1343x1343)
- `le-caravanier-light` — 10/10 small; examples: Hero-le-caravanier-light.png (1365x1365), le-caravanier-light-pdp-01.png (1365x1365), le-caravanier-light-pdp-02.png (1365x1365)
- `le-nomade` — 9/9 small; examples: Hero-le-nomade-02.png (1365x1365), Hero-le-nomade.png (1365x1365), le-nomade-pdp-01.png (1365x1365)
- `marrakech-tote-cognac` — 9/14 small; examples: Hero-marrakech-tote-cognac-03.png (1365x1365), Hero-marrakech-tote-cognac-04.png (1365x1365), marrakech-tote-cognac-pdp-04.png (1365x1365)
- `medina-cargo-rucksack-cognac` — 9/9 small; examples: Hero-medina-cargo-rucksack-cognac.png (1344x1344), medina-cargo-rucksack-cognac-pdp-01.png (1343x1344), medina-cargo-rucksack-cognac-pdp-02.png (1345x1343)
- `medina-cargo-rucksack-moutarde` — 15/15 small; examples: Hero-medina-cargo-rucksack-moutarde-02.png (1365x1365), Hero-medina-cargo-rucksack-moutarde.png (1365x1365), medina-cargo-rucksack-moutarde-pdp-01.png (1365x1365)
- `medina-courtyard-crossbody` — 10/10 small; examples: Hero-medina-courtyard-crossbody.png (1365x1365), medina-courtyard-crossbody-pdp-01.png (1365x1365), medina-courtyard-crossbody-pdp-02.png (1365x1365)
- `medina-crossbody-envelope` — 9/9 small; examples: Hero-medina-crossbody-envelope-02.png (1365x1365), Hero-medina-crossbody-envelope.png (1365x1365), medina-crossbody-envelope-pdp-01.png (1365x1365)
- `medina-crossbody-envelope-alt` — 10/10 small; examples: Hero-medina-crossbody-envelope-alt.png (1365x1365), medina-crossbody-envelope-alt-pdp-01.png (1365x1365), medina-crossbody-envelope-alt-pdp-02.png (1365x1365)
- `medina-crossbody-tooled-dark-brown` — 10/10 small; examples: Hero-medina-crossbody-tooled-dark-brown.png (1365x1365), medina-crossbody-tooled-dark-brown-pdp-01.png (1365x1365), medina-crossbody-tooled-dark-brown-pdp-02.png (1365x1365)
- `medina-crossbody-tooled-walnut-macro` — 8/9 small; examples: Hero-medina-crossbody-tooled-walnut-macro-02.png (1365x1365), Hero-medina-crossbody-tooled-walnut-macro-03.png (1365x1365), Hero-medina-crossbody-tooled-walnut-macro-04.png (1365x1365)
- `medina-crossbody-walnut-macro` — 11/11 small; examples: Hero-medina-crossbody-walnut-macro.png (1365x1365), medina-crossbody-walnut-macro-pdp-01.png (1365x1365), medina-crossbody-walnut-macro-pdp-02.png (1365x1365)
- `medina-duffle` — 8/8 small; examples: Hero-medina-duffle.png (1365x1365), medina-duffle-pdp-01.png (1365x1365), medina-duffle-pdp-02.png (1365x1365)
- `medina-duffle-alt` — 13/13 small; examples: Hero-medina-duffle-alt-02.png (1365x1365), Hero-medina-duffle-alt.png (1365x1365), medina-duffle-alt-pdp-01.png (1365x1365)
- `medina-rucksack-drawstring-light-brown` — 11/13 small; examples: Hero-medina-rucksack-drawstring-light-brown-04.png (1365x1365), Hero-medina-rucksack-drawstring-light-brown.png (1024x1024), medina-rucksack-drawstring-light-brown-pdp-01.png (1365x1365)
- `medina-zigzag-tote-chocolate` — 10/10 small; examples: Hero-medina-zigzag-tote-chocolate.png (1024x1024), medina-zigzag-tote-chocolate-pdp-01.png (1365x1365), medina-zigzag-tote-chocolate-pdp-02.png (1365x1365)
- `vintage-buckle-backpack` — 8/8 small; examples: Hero-vintage-buckle-backpack.png (1365x1365), vintage-buckle-backpack-pdp-01.png (1365x1365), vintage-buckle-backpack-pdp-02.png (1365x1365)
- `vintage-buckle-backpack-light-pdp` — 9/10 small; examples: Hero-vintage-buckle-backpack-light-pdp-02.png (1365x1365), vintage-buckle-backpack-light-pdp-pdp-01.png (1365x1365), vintage-buckle-backpack-light-pdp-pdp-02.png (1365x1365)
- `vintage-satchel-light-brown` — 10/10 small; examples: Hero-vintage-satchel-light-brown.png (1024x1024), vintage-satchel-light-brown-pdp-01.png (1365x1365), vintage-satchel-light-brown-pdp-02.png (1365x1365)
- `vintage-satchel-moutarde` — 10/11 small; examples: Hero-vintage-satchel-moutarde.png (1365x1365), vintage-satchel-moutarde-pdp-02.png (1365x1365), vintage-satchel-moutarde-pdp-03.png (1365x1365)

## Repo/site cleanup findings
These local repo product-like folders are not source of truth and should be treated as derived/cache/legacy only unless mapped back to Drive:
- `public/products/babouche-crossbody-cognac` (9 images)
- `public/products/cedre-crossbody-chocolate` (9 images)
- `public/products/kilim-duffle-amber` (9 images)
- `public/products/kilim-duffle-polychrome` (9 images)
- `public/products/medersa-rucksack-cognac` (9 images)
- `public/products/rif-rucksack-tan` (9 images)
- `public/products/safran-tote-cognac` (9 images)
- `public/products/saharienne-saddle-cognac` (9 images)
- `public/products/tadelakt-rucksack-cognac` (9 images)
- `public/assets/marrakech-tote` (1 images)
- `public/assets/medina-crossbody` (2 images)

Code references containing `/assets/` should be replaced or justified because they bypass canonical product source:

## Cleanup plan
1. Freeze the rule in repo docs: `usable product pics` is the only human product source. Supabase `products/drop-02` and `public/products/...` are derived outputs only.
2. Build a manifest file with one row per commercial product: `slug`, Drive folder path, required `Hero-*`, gallery filenames, dimensions, status, derived Supabase URL, and whether it is launch-visible.
3. Clean Drive top-level structure: one commercial product = one slug folder. No top-level `*-alt`, `*-scale`, `*-pdp`, `*-macro`, no screenshot bucket mixed with products. Alias folders are merged/archived under `_merged/` only after Ryan approves the mapping.
4. Rename direct child files in place only: `Hero-{slug}.*`, `{slug}-pdp-NN.*`, `{slug}-scale-NN.*`, `{slug}-macro-NN.*`. Do not create nested folders inside product folders.
5. Generate contact sheets for every suspicious alias group before merging; visible product identity wins over filename.
6. Encode/upload only from manifest-approved Drive files. Hero-derived image must become `products/drop-02/{slug}-pdp-white.webp` and stay first in Airtable/Supabase/site/feed/marketplace.
7. Add a repo guard script that fails if product catalogue code references `/assets/*`, Downloads, old prototypes, or local public product folders that are not declared as derived from the Drive manifest.
8. After cleanup, run catalogue parity: Drive manifest vs Supabase products vs Airtable vs `/products` vs sitemap/feed.

## Approval needed before destructive cleanup
- I can create manifests/docs/scripts now.
- I should not delete or permanently move existing image folders without your approval. Safer first pass: copy/merge into canonical folder, then move old aliases into `_merged/{old-name}`.
