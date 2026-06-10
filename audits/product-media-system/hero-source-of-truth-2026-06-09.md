# Maison Tanneurs — Hero Source of Truth Audit

Generated: 2026-06-09T22:52:53.799Z
Drive root: /Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/usable product pics

## Hard rule

If a product source folder contains `Hero-*`, that human-curated file is the product hero. It must be encoded/upserted as the canonical `{slug}-pdp-white.webp` object and that URL must be first in Airtable `Images` and Supabase `products.images`.

## Summary

- Supabase products audited: 35
- PASS: 26
- WARN: 9
- FAIL: 0

## Detail

| Verdict | Slug | Drive folder | Hero file(s) | Supabase first image | Airtable first image | Notes |
|---|---|---|---|---|---|---|
| PASS | `atlas-briefcase-vintage` | MT-MS-001__atlas-briefcase-vintage | Hero-atlas-briefcase-vintage.png | atlas-briefcase-vintage-pdp-white.webp | atlas-briefcase-vintage-pdp-white.webp | — |
| PASS | `atlas-field-briefcase` | MT-MS-002__atlas-field-briefcase | Hero-atlas-field-briefcase.webp | atlas-field-briefcase-pdp-white.webp | atlas-field-briefcase-pdp-white.webp | — |
| PASS | `atlas-kilim-duffle` | MT-WD-002__atlas-kilim-duffle | Hero-atlas-kilim-duffle.png | atlas-kilim-duffle-pdp-white.webp | atlas-kilim-duffle-pdp-white.webp | — |
| PASS | `atlas-kilim-rucksack` | MT-BP-002__atlas-kilim-rucksack | Hero-atlas-kilim-rucksack.png | atlas-kilim-rucksack-pdp-white.webp | atlas-kilim-rucksack-pdp-white.webp | — |
| PASS | `atlas-messenger-laptop` | MT-MS-003__atlas-messenger-laptop | Hero-atlas-messenger-laptop.png | atlas-messenger-laptop-pdp-white.webp | atlas-messenger-laptop-pdp-white.webp | — |
| PASS | `atlas-weekender-cognac` | MT-WD-003__atlas-weekender-cognac | Hero-atlas-weekender-cognac.png | atlas-weekender-cognac-pdp-white.webp | atlas-weekender-cognac-pdp-white.webp | — |
| WARN | `black-stitched-backpack` | — | — | black-stitched-backpack-pdp-white.webp | — | no matching Drive Hero-* source found; no Airtable Products record found |
| PASS | `classic-cognac-satchel` | MT-CB-001__classic-cognac-satchel | Hero-classic-cognac-satchel.png | classic-cognac-satchel-pdp-white.webp | classic-cognac-satchel-pdp-white.webp | — |
| PASS | `cognac-brogue-backpack` | MT-BP-003__cognac-brogue-backpack | Hero-cognac-brogue-backpack.png | cognac-brogue-backpack-pdp-white.webp | cognac-brogue-backpack-pdp-white.webp | — |
| PASS | `expedition-rolltop-cognac` | MT-BP-004__expedition-rolltop-cognac | Hero-expedition-rolltop-cognac.png | expedition-rolltop-cognac-pdp-white.webp | expedition-rolltop-cognac-pdp-white.webp | — |
| PASS | `expedition-rolltop-noir` | MT-BP-005__expedition-rolltop-noir | Hero-expedition-rolltop-noir.png | expedition-rolltop-noir-pdp-white.webp | expedition-rolltop-noir-pdp-white.webp | — |
| PASS | `explorer-rolltop-cognac` | MT-BP-006__explorer-rolltop-cognac | Hero-explorer-rolltop-cognac.png | explorer-rolltop-cognac-pdp-white.webp | explorer-rolltop-cognac-pdp-white.webp | — |
| WARN | `explorer-rolltop-noir` | MT-BP-007__explorer-rolltop-noir | Hero-explorer-rolltop-noir.png | explorer-rolltop-noir-pdp-white.webp | — | no Airtable Products record found |
| WARN | `heritage-rucksack` | — | — | heritage-rucksack-pdp-white.webp | heritage-rucksack-pdp-white.webp | no matching Drive Hero-* source found |
| WARN | `marrakech-tote-bordeaux` | — | — | marrakech-tote-bordeaux-pdp-white.webp | — | no matching Drive Hero-* source found; no Airtable Products record found |
| PASS | `marrakech-tote-cognac` | MT-TT-001__marrakech-tote-cognac | Hero-marrakech-tote-cognac.png | marrakech-tote-cognac-pdp-white.webp | marrakech-tote-cognac-pdp-white.webp | — |
| WARN | `marrakech-tote-noir` | — | — | marrakech-tote-noir-pdp-white.webp | — | no matching Drive Hero-* source found; no Airtable Products record found |
| PASS | `medina-cargo-rucksack-cognac` | MT-BP-012__medina-cargo-rucksack-cognac | Hero-medina-cargo-rucksack-cognac.png | medina-cargo-rucksack-cognac-pdp-white.webp | medina-cargo-rucksack-cognac-pdp-white.webp | — |
| PASS | `medina-crossbody-clasp-teal` | MT-CB-003__medina-crossbody-clasp-teal | Hero-medina-crossbody-clasp-teal.png | medina-crossbody-clasp-teal-pdp-white.webp | medina-crossbody-clasp-teal-pdp-white.webp | — |
| PASS | `medina-crossbody-cognac` | MT-CB-004__medina-crossbody-cognac | Hero-medina-crossbody-cognac.png | medina-crossbody-cognac-pdp-white.webp | medina-crossbody-cognac-pdp-white.webp | — |
| PASS | `medina-crossbody-envelope` | MT-CB-005__medina-crossbody-envelope | Hero-medina-crossbody-envelope.png | medina-crossbody-envelope-pdp-white.webp | medina-crossbody-envelope-pdp-white.webp | — |
| WARN | `medina-crossbody-tassel` | — | — | medina-crossbody-tassel-pdp-white.webp | — | no matching Drive Hero-* source found; no Airtable Products record found |
| PASS | `medina-crossbody-tooled-walnut` | MT-CB-007__medina-crossbody-tooled-walnut | Hero-medina-crossbody-tooled-walnut.png | medina-crossbody-tooled-walnut-pdp-white.webp | medina-crossbody-tooled-walnut-pdp-white.webp | — |
| PASS | `medina-duffle` | MT-WD-005__medina-duffle | Hero-medina-duffle.png | medina-duffle-pdp-white.webp | medina-duffle-pdp-white.webp | — |
| PASS | `medina-market-tote-cognac` | MT-TT-002__medina-market-tote-cognac | Hero-medina-market-tote-cognac.png | medina-market-tote-cognac-pdp-white.webp | medina-market-tote-cognac-pdp-white.webp | — |
| PASS | `medina-rucksack-drawstring` | MT-BP-014__medina-rucksack-drawstring | Hero-medina-rucksack-drawstring.png | medina-rucksack-drawstring-pdp-white.webp | medina-rucksack-drawstring-pdp-white.webp | — |
| WARN | `medina-rucksack-flap-chocolate` | — | — | medina-rucksack-flap-chocolate-pdp-white.webp | medina-rucksack-flap-chocolate-pdp-white.webp | no matching Drive Hero-* source found |
| PASS | `medina-saddlebag-tooled-cognac` | MT-CB-008__medina-saddlebag-tooled-cognac | Hero-medina-saddlebag-tooled-cognac.png | medina-saddlebag-tooled-cognac-pdp-white.webp | medina-saddlebag-tooled-cognac-pdp-white.webp | — |
| PASS | `medina-zigzag-tote-chocolate` | MT-TT-003__medina-zigzag-tote-chocolate | Hero-medina-zigzag-tote-chocolate.png | medina-zigzag-tote-chocolate-pdp-white.webp | medina-zigzag-tote-chocolate-pdp-white.webp | — |
| PASS | `oasis-weekender-oxblood` | MT-WD-006__oasis-weekender-oxblood | Hero-oasis-weekender-oxblood.png | oasis-weekender-oxblood-pdp-white.webp | oasis-weekender-oxblood-pdp-white.webp | — |
| WARN | `rolltop-daypack` | — | — | — | — | no matching Drive Hero-* source found; Supabase images array is empty; no Airtable Products record found |
| WARN | `test-e2e` | — | — | heritage-rucksack-01-v2.webp | — | no matching Drive Hero-* source found; no Airtable Products record found |
| PASS | `vintage-buckle-backpack` | MT-BP-017__vintage-buckle-backpack | Hero-vintage-buckle-backpack.png | vintage-buckle-backpack-pdp-white.webp | vintage-buckle-backpack-pdp-white.webp | — |
| PASS | `vintage-satchel-light-brown` | MT-CB-011__vintage-satchel-light-brown | Hero-vintage-satchel-light-brown.png | vintage-satchel-light-brown-pdp-white.webp | vintage-satchel-light-brown-pdp-white.webp | — |
| PASS | `woven-leather-backpack` | MT-BP-019__woven-leather-backpack | Hero-woven-leather-backpack.png | woven-leather-backpack-pdp-white.webp | woven-leather-backpack-pdp-white.webp | — |
