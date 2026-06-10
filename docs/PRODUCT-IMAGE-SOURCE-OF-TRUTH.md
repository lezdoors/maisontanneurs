# Maison Tanneurs Product Image Source of Truth

This file is the durable rule for product photography. If an older audit, handoff, prompt, Supabase row, local public image, or generated-media note conflicts with this file, this file wins.

## Absolute source folder

Use only this folder for real product commerce photography:

`/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/usable product pics`

Every sellable product must map to one product folder inside that directory.

## Hero-first contract

Inside each product folder, the approved `Hero-*` file is the mandatory primary product image.

That Drive `Hero-*` source must be encoded/upserted into the canonical Supabase delivery object:

`products/drop-02/{slug}-pdp-white.webp`

The derived public URL must remain first everywhere:

1. Supabase `products.images[0]`
2. Airtable `Products.Images[0]`
3. storefront product cards
4. PDP first image
5. sitemap/feed/marketplace main image
6. any product ad or catalogue export

If `images[0]` is `scale`, `macro`, `pdp-04`, a numbered gallery angle, a generated lifestyle shot, or a legacy/supplier-derived object, that is a bug.

## Banned as product-commerce source

Do not use these as real product photography sources:

- Downloads mirrors
- old prototypes or local `public/assets` / old `public/products` folders
- supplier screenshots, Oussam/source folders, or phone snaps
- Higgsfield scratch outputs or generated lifestyle/editorial images
- `_merged` unless every file is traced back to a reviewed SKU folder and explicitly approved
- old Supabase objects that do not trace back to the current Drive `Hero-*` / product folder
- files from Maison Izem, Chapuis, AKAL, Nitra, Raccordement, or any cross-brand folder

Supabase Storage is a delivery/cache layer, not the source of truth. If Supabase disagrees with Drive, fix Supabase to match Drive.

## What to do when blocked

If a product has no matching `usable product pics` folder, no `Hero-*`, multiple competing heroes, or unclear identity, do not fill the gap from generated/legacy assets. Report it as blocked/ambiguous and create a source mapping:

`source file -> visible product identity -> canonical slug -> role/surface -> decision/notes`

## Editorial exception

Editorial/video/brand-world assets may come from other approved Maison Tanneurs folders only for non-commerce sections such as homepage atmosphere, atelier proof, journal, trust, or Meta creative. They must not replace product heroes or product-gallery source-of-truth images.

## Verification commands

Run these before telling Ryan the product-image rules are clean:

```bash
cd /Users/ryanz/kechken
pnpm audit:hero
pnpm audit:image-contract
pnpm audit:catalogue
```

`pnpm audit:hero` is the authority for Drive `Hero-*` -> Supabase/Airtable first-image alignment.
