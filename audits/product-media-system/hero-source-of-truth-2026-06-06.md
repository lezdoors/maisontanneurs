# Maison Tanneurs — Hero Source of Truth Audit

Generated: 2026-06-06T05:23:19.410Z
Drive root: /Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/usable product pics

## Hard rule

If a product source folder contains `Hero-*`, that human-curated file is the product hero. It must be encoded/upserted as the canonical `{slug}-pdp-white.webp` object and that URL must be first in Airtable `Images` and Supabase `products.images`.

## Summary

- Supabase products audited: 35
- PASS: 20
- WARN: 15
- FAIL: 0

## Detail

| Verdict | Slug | Drive folder | Hero file(s) | Supabase first image | Airtable first image | Notes |
|---|---|---|---|---|---|---|
| PASS | `atlas-briefcase-vintage` | atlas-briefcase-vintage | Hero-atlas-briefcase-vintage.png | atlas-briefcase-vintage-pdp-white.webp | atlas-briefcase-vintage-pdp-white.webp | — |
| PASS | `atlas-field-briefcase` | atlas-field-briefcase | Hero-atlas-field-briefcase-pdp-04.webp | atlas-field-briefcase-pdp-white.webp | atlas-field-briefcase-pdp-white.webp | — |
| WARN | `atlas-kilim-duffle` | — | — | atlas-kilim-duffle-pdp-white.webp | atlas-kilim-duffle-pdp-white.webp | no matching Drive Hero-* source found |
| PASS | `atlas-kilim-rucksack` | atlas-kilim-rucksack | Hero- atlas-kilim-rucksack-pdp.png | atlas-kilim-rucksack-pdp-white.webp | atlas-kilim-rucksack-pdp-white.webp | — |
| WARN | `atlas-messenger-laptop` | atlas-messenger-laptop | Hero-Atlas Messenger · Laptop.png; Hero-atlas-messenger-laptop.png | atlas-messenger-laptop-pdp-white.webp | atlas-messenger-laptop-pdp-white.webp | multiple Hero-* files: Hero-Atlas Messenger · Laptop.png; Hero-atlas-messenger-laptop.png |
| PASS | `atlas-weekender-cognac` | atlas-weekender-cognac | Hero- atlas-weekender-cognac.png | atlas-weekender-cognac-pdp-white.webp | atlas-weekender-cognac-pdp-white.webp | — |
| WARN | `black-stitched-backpack` | — | — | black-stitched-backpack-pdp-white.webp | — | no matching Drive Hero-* source found; no Airtable Products record found |
| WARN | `classic-cognac-satchel` | classic-cognac-satchel | Hero-classic-cognac-satchel-00.png; Hero-classic-cognac-satchel-01 copy.png | classic-cognac-satchel-pdp-white.webp | classic-cognac-satchel-pdp-white.webp | multiple Hero-* files: Hero-classic-cognac-satchel-00.png; Hero-classic-cognac-satchel-01 copy.png |
| PASS | `cognac-brogue-backpack` | cognac-brogue-backpack | Hero-cognac-brogue-backpack-pdp-06 copy.png | cognac-brogue-backpack-pdp-white.webp | cognac-brogue-backpack-pdp-white.webp | — |
| PASS | `expedition-rolltop-cognac` | expedition-rolltop-cognac | Hero- expedition-rolltop-cognac.png | expedition-rolltop-cognac-pdp-white.webp | expedition-rolltop-cognac-pdp-white.webp | — |
| PASS | `expedition-rolltop-noir` | expedition-rolltop-noir | Hero-expedition-rolltop-noir.png | expedition-rolltop-noir-pdp-white.webp | expedition-rolltop-noir-pdp-white.webp | — |
| WARN | `explorer-rolltop-cognac` | explorer-rolltop-cognac | Hero-1-explorer-rolltop-cognac-scale-hd.png; Hero-explorer-rolltop-cognac-hd.png | explorer-rolltop-cognac-pdp-white.webp | explorer-rolltop-cognac-pdp-white.webp | multiple Hero-* files: Hero-1-explorer-rolltop-cognac-scale-hd.png; Hero-explorer-rolltop-cognac-hd.png |
| WARN | `explorer-rolltop-noir` | — | — | explorer-rolltop-noir-macro-04.webp | — | no matching Drive Hero-* source found; no Airtable Products record found |
| PASS | `heritage-rucksack` | heritage-rucksack | Hero-heritage-rucksack hero.png | heritage-rucksack-pdp-white.webp | heritage-rucksack-pdp-white.webp | — |
| WARN | `marrakech-tote-bordeaux` | — | — | marrakech-tote-bordeaux-pdp-white.webp | — | no matching Drive Hero-* source found; no Airtable Products record found |
| WARN | `marrakech-tote-cognac` | marrakech-tote-cognac | Hero- 01- marrakech-tote-cognac.png; Hero- marrakech-tote-cognac-pdp.png; Hero-marrakech-tote-cognac -1.png; Hero-marrakech-tote-cognac.png | marrakech-tote-cognac-pdp-white.webp | marrakech-tote-cognac-pdp-white.webp | multiple Hero-* files: Hero- 01- marrakech-tote-cognac.png; Hero- marrakech-tote-cognac-pdp.png; Hero-marrakech-tote-cognac -1.png; Hero-marrakech-tote-cognac.png |
| WARN | `marrakech-tote-noir` | — | — | marrakech-tote-noir-pdp-white.webp | — | no matching Drive Hero-* source found; no Airtable Products record found |
| PASS | `medina-cargo-rucksack-cognac` | medina-cargo-rucksack-cognac | Hero-medina-cargo-rucksack-cognac.png | medina-cargo-rucksack-cognac-pdp-white.webp | medina-cargo-rucksack-cognac-pdp-white.webp | — |
| PASS | `medina-crossbody-clasp-teal` | medina-crossbody-clasp-teal | Hero-medina-crossbody-clasp-teal.png | medina-crossbody-clasp-teal-pdp-white.webp | medina-crossbody-clasp-teal-pdp-white.webp | — |
| PASS | `medina-crossbody-cognac` | medina-crossbody-cognac | Hero-medina-crossbody-cognac-pdp-white.png | medina-crossbody-cognac-pdp-white.webp | medina-crossbody-cognac-pdp-white.webp | — |
| WARN | `medina-crossbody-envelope` | medina-crossbody-envelope | Hero-medina-crossbody-envelope -1.png; Hero-medina-crossbody-envelope.png | medina-crossbody-envelope-pdp-white.webp | medina-crossbody-envelope-pdp-white.webp | multiple Hero-* files: Hero-medina-crossbody-envelope -1.png; Hero-medina-crossbody-envelope.png |
| WARN | `medina-crossbody-tassel` | — | — | medina-crossbody-tassel-pdp-white.webp | — | no matching Drive Hero-* source found; no Airtable Products record found |
| WARN | `medina-crossbody-tooled-walnut` | — | — | medina-crossbody-tooled-walnut-pdp-white.webp | medina-crossbody-tooled-walnut-pdp-white.webp | no matching Drive Hero-* source found |
| PASS | `medina-duffle` | medina-duffle | Hero-medina-duffle-macro.png | medina-duffle-pdp-white.webp | medina-duffle-pdp-white.webp | — |
| PASS | `medina-market-tote-cognac` | medina-market-tote-cognac | Hero-medina-market-tote-cognac.png | medina-market-tote-cognac-pdp-white.webp | medina-market-tote-cognac-pdp-white.webp | — |
| PASS | `medina-rucksack-drawstring` | medina-rucksack-drawstring | Hero- medina-rucksack-drawstring.png | medina-rucksack-drawstring-pdp-white.webp | medina-rucksack-drawstring-pdp-white.webp | — |
| WARN | `medina-rucksack-flap-chocolate` | — | — | medina-rucksack-flap-chocolate-pdp-white.webp | medina-rucksack-flap-chocolate-pdp-white.webp | no matching Drive Hero-* source found |
| PASS | `medina-saddlebag-tooled-cognac` | medina-saddlebag-tooled-cognac | Hero-medina-saddlebag-tooled-cognac.png | medina-saddlebag-tooled-cognac-pdp-white.webp | medina-saddlebag-tooled-cognac-pdp-white.webp | — |
| PASS | `medina-zigzag-tote-chocolate` | medina-zigzag-tote-chocolate | Hero-medina-zigzag-tote-chocolate.png | medina-zigzag-tote-chocolate-pdp-white.webp | medina-zigzag-tote-chocolate-pdp-white.webp | — |
| PASS | `oasis-weekender-oxblood` | oasis-weekender-oxblood | Hero- Oasis Weekender · Oxblood.png | oasis-weekender-oxblood-pdp-white.webp | oasis-weekender-oxblood-pdp-white.webp | — |
| WARN | `rolltop-daypack` | — | — | — | — | no matching Drive Hero-* source found; Supabase images array is empty; no Airtable Products record found |
| WARN | `test-e2e` | — | — | heritage-rucksack-01-v2.webp | — | no matching Drive Hero-* source found; no Airtable Products record found |
| PASS | `vintage-buckle-backpack` | vintage-buckle-backpack | Hero-vintage-buckle-backpack.png | vintage-buckle-backpack-pdp-white.webp | vintage-buckle-backpack-pdp-white.webp | — |
| PASS | `vintage-satchel-light-brown` | vintage-satchel-light-brown | Hero- vintage-satchel-light-brown.png | vintage-satchel-light-brown-pdp-white.webp | vintage-satchel-light-brown-pdp-white.webp | — |
| PASS | `woven-leather-backpack` | woven-leather-backpack | Hero- woven-leather-backpack-pdp.png | woven-leather-backpack-pdp-white.webp | woven-leather-backpack-pdp-white.webp | — |
