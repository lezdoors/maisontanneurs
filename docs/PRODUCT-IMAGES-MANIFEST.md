# Product Images — Canonical Manifest

_Generated: 2026-05-25 16:38 by `scripts/build-images-manifest.py`_

Single source of truth for **every Maison Tanneurs product image**: what's in Supabase Storage, what's on Drive, what's wired to `products.images[]` on the live site, and what state each SKU is in.

**Stop hunting.** When you need to add, replace, or audit a product photo, start here.

---

## Locations

| What | Where |
|---|---|
| Live storefront | https://maisontanneurs.com |
| Supabase Storage (canonical) | `https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/<slug>-<kind>.webp` |
| Legacy Storage | `products/drop-01/` (5 SKUs from launch — do not add more there) |
| Drive source-of-pixels | `My Drive/Maison Tanneurs/usable product pics/<slug>/` |
| Local mirror (Drop 02 only) | `~/maisontanneurs/public/products/<slug>/` (9 SKUs, the ones Rocco generated 2026-05-24) |
| Wired array | Supabase Postgres `products.images[]` per slug |
| Hidden-SKU escape hatch | `lib/hidden-skus.ts` (only slugs with no canonical hero) |

---

## Naming convention (Supabase Storage `drop-02/`)

| Suffix | Meaning | Used as |
|---|---|---|
| `<slug>-pdp-white.webp` | Seamless studio cyclorama, hero | `images[0]` ideal |
| `<slug>-scale.webp` | Lifestyle / in-context hero | `images[0]` or `[1]` |
| `<slug>-pdp-04.webp` | HF Shots set, shot-04 = canonical front 3/4 | gallery |
| `<slug>-pdp-01..09.webp` | HF Shots gallery angles | gallery 2+ |
| `<slug>-scale-01..09.webp` | HF Shots lifestyle gallery | gallery 2+ |
| `<slug>-macro-01..09.webp` | Detail crops (stitch, brass, grain) | gallery 2+ |
| `<slug>-pdp-alt-NN.webp` | Alt lighting / styling variant | gallery fallback |
| `<slug>-supplier-*.webp` | Original supplier raw — **BANNED** in `images[]` | archived only |
| `<slug>-pdp-hero.webp` | Legacy naming — **BANNED** by audit | replace with `pdp-white` |
| `<slug>-scale-hero.webp` | Legacy naming — **BANNED** by audit | replace with `scale` |

Hero priority order applied by the manifest builder:
1. `pdp-white` 2. `pdp-hero` 3. `scale-hero` 4. `scale` 5. `hero` 6. `pdp-04` 7. `scale-04` 8. `pdp-01` 9. `scale-01` 10. `macro-04` (last resort) 11. `macro-01` 12. `archive-1`

---

## Status summary

| Status | Count | Meaning |
|---|---|---|
| READY | 12 | Live on site, canonical hero + ≥3 gallery shots |
| PARTIAL | 1 | Live but thin gallery (≤3 shots) — generate more HF shots |
| NO-HERO | 9 | Hidden by `lib/hidden-skus.ts` — only supplier raws, needs HF run |

---

## READY (live on site)

### `atlas-kilim-duffle`

- **Storage files:** 40 (37 usable, 3 supplier-raw / banned)
- **Hero:** `atlas-kilim-duffle-pdp-white.webp`

Wired to `products.images[]`:

0. `drop-02/atlas-kilim-duffle-pdp-white.webp`
1. `drop-02/atlas-kilim-duffle-pdp-04.webp`
2. `drop-02/atlas-kilim-duffle-pdp-05.webp`
3. `drop-02/atlas-kilim-duffle-pdp-06.webp`
4. `drop-02/atlas-kilim-duffle-pdp-07.webp`
5. `drop-02/atlas-kilim-duffle-pdp-08.webp`
6. `drop-02/atlas-kilim-duffle-pdp-09.webp`
7. `drop-02/atlas-kilim-duffle-pdp-01.webp`
8. `drop-02/atlas-kilim-duffle-pdp-02.webp`

### `atlas-messenger-laptop`

- **Storage files:** 21 (19 usable, 2 supplier-raw / banned)
- **Hero:** `atlas-messenger-laptop-pdp-white.webp`
- **Drive source:** `usable product pics/atlas-messenger-laptop/`

Wired to `products.images[]`:

0. `drop-02/atlas-messenger-laptop-pdp-white.webp`
1. `drop-02/atlas-messenger-laptop-scale.webp`
2. `drop-02/atlas-messenger-laptop-pdp-04.webp`
3. `drop-02/atlas-messenger-laptop-pdp-05.webp`
4. `drop-02/atlas-messenger-laptop-pdp-06.webp`
5. `drop-02/atlas-messenger-laptop-pdp-07.webp`
6. `drop-02/atlas-messenger-laptop-pdp-08.webp`
7. `drop-02/atlas-messenger-laptop-pdp-01.webp`
8. `drop-02/atlas-messenger-laptop-pdp-02.webp`

### `black-stitched-backpack`

- **Storage files:** 5 (5 usable, 0 supplier-raw / banned)
- **Hero:** `black-stitched-backpack-pdp-white.webp`

Wired to `products.images[]`:

0. `drop-01/black-stitched-backpack-pdp-white.webp`
1. `drop-01/black-stitched-backpack-archive-1.webp`
2. `drop-01/black-stitched-backpack-archive-2.webp`
3. `drop-01/black-stitched-backpack-archive-3.webp`
4. `drop-01/black-stitched-backpack-archive-4.webp`

### `classic-cognac-satchel`

- **Storage files:** 4 (4 usable, 0 supplier-raw / banned)
- **Hero:** `classic-cognac-satchel-pdp-white.webp`

Wired to `products.images[]`:

0. `drop-01/classic-cognac-satchel-pdp-white.webp`
1. `drop-01/classic-cognac-satchel-archive-1.webp`
2. `drop-01/classic-cognac-satchel-archive-2.webp`
3. `drop-01/classic-cognac-satchel-archive-3.webp`

### `cognac-brogue-backpack`

- **Storage files:** 3 (3 usable, 0 supplier-raw / banned)
- **Hero:** `cognac-brogue-backpack-pdp-white.webp`

Wired to `products.images[]`:

0. `drop-01/cognac-brogue-backpack-pdp-white.webp`
1. `drop-01/cognac-brogue-backpack-archive-1.webp`
2. `drop-01/cognac-brogue-backpack-archive-2.webp`

### `explorer-rolltop-cognac`

- **Storage files:** 32 (29 usable, 3 supplier-raw / banned)
- **Hero:** `explorer-rolltop-cognac-pdp-white.webp`
- **Drive source:** `usable product pics/explorer-rolltop-cognac/` (+ 1 more)

Wired to `products.images[]`:

0. `drop-02/explorer-rolltop-cognac-pdp-white.webp`
1. `drop-02/explorer-rolltop-cognac-scale.webp`
2. `drop-02/explorer-rolltop-cognac-pdp-04.webp`
3. `drop-02/explorer-rolltop-cognac-pdp-05.webp`
4. `drop-02/explorer-rolltop-cognac-pdp-06.webp`
5. `drop-02/explorer-rolltop-cognac-pdp-07.webp`
6. `drop-02/explorer-rolltop-cognac-pdp-08.webp`
7. `drop-02/explorer-rolltop-cognac-pdp-09.webp`
8. `drop-02/explorer-rolltop-cognac-pdp-01.webp`

### `heritage-rucksack`

- **Storage files:** 17 (15 usable, 2 supplier-raw / banned)
- **Hero:** `heritage-rucksack-pdp-white.webp`
- **Drive source:** `usable product pics/heritage-rucksack/`

Wired to `products.images[]`:

0. `drop-02/heritage-rucksack-pdp-white.webp`
1. `drop-01/heritage-rucksack-scale.webp`
2. `drop-02/heritage-rucksack-pdp-04.webp`
3. `drop-02/heritage-rucksack-pdp-05.webp`
4. `drop-02/heritage-rucksack-pdp-06.webp`
5. `drop-02/heritage-rucksack-pdp-07.webp`
6. `drop-02/heritage-rucksack-pdp-08.webp`
7. `drop-02/heritage-rucksack-pdp-09.webp`
8. `drop-02/heritage-rucksack-pdp-01.webp`

### `marrakech-tote-cognac`

- **Storage files:** 21 (19 usable, 2 supplier-raw / banned)
- **Hero:** `marrakech-tote-cognac-pdp-white.webp`
- **Drive source:** `usable product pics/marrakech-tote-cognac/`

Wired to `products.images[]`:

0. `drop-02/marrakech-tote-cognac-pdp-white.webp`
1. `drop-02/marrakech-tote-cognac-scale.webp`
2. `drop-02/marrakech-tote-cognac-pdp-04.webp`
3. `drop-02/marrakech-tote-cognac-pdp-05.webp`
4. `drop-02/marrakech-tote-cognac-pdp-06.webp`
5. `drop-02/marrakech-tote-cognac-pdp-07.webp`
6. `drop-02/marrakech-tote-cognac-pdp-08.webp`
7. `drop-02/marrakech-tote-cognac-pdp-01.webp`
8. `drop-02/marrakech-tote-cognac-pdp-02.webp`

### `medina-crossbody-envelope`

- **Storage files:** 12 (10 usable, 2 supplier-raw / banned)
- **Hero:** `medina-crossbody-envelope-pdp-white.webp`
- **Drive source:** `usable product pics/medina-crossbody-envelope/`

Wired to `products.images[]`:

0. `drop-02/medina-crossbody-envelope-pdp-white.webp`
1. `drop-02/medina-crossbody-envelope-pdp-04.webp`
2. `drop-02/medina-crossbody-envelope-pdp-05.webp`
3. `drop-02/medina-crossbody-envelope-pdp-06.webp`
4. `drop-02/medina-crossbody-envelope-pdp-07.webp`
5. `drop-02/medina-crossbody-envelope-pdp-08.webp`
6. `drop-02/medina-crossbody-envelope-pdp-09.webp`
7. `drop-02/medina-crossbody-envelope-pdp-01.webp`
8. `drop-02/medina-crossbody-envelope-pdp-02.webp`

### `medina-duffle`

- **Storage files:** 46 (40 usable, 6 supplier-raw / banned)
- **Hero:** `medina-duffle-pdp-white.webp`
- **Drive source:** `usable product pics/medina-duffle-scale/` (+ 1 more)

Wired to `products.images[]`:

0. `drop-02/medina-duffle-pdp-white.webp`
1. `drop-02/medina-duffle-scale.webp`
2. `drop-02/medina-duffle-pdp-04.webp`
3. `drop-02/medina-duffle-pdp-05.webp`
4. `drop-02/medina-duffle-pdp-06.webp`
5. `drop-02/medina-duffle-pdp-07.webp`
6. `drop-02/medina-duffle-pdp-08.webp`
7. `drop-02/medina-duffle-pdp-01.webp`
8. `drop-02/medina-duffle-pdp-02.webp`

### `medina-rucksack-drawstring`

- **Storage files:** 42 (40 usable, 2 supplier-raw / banned)
- **Hero:** `medina-rucksack-drawstring-pdp-white.webp`
- **Drive source:** `usable product pics/medina-rucksack-drawstring/` (+ 2 more)

Wired to `products.images[]`:

0. `drop-02/medina-rucksack-drawstring-pdp-white.webp`
1. `drop-02/medina-rucksack-drawstring-scale.webp`
2. `drop-02/medina-rucksack-drawstring-pdp-04.webp`
3. `drop-02/medina-rucksack-drawstring-pdp-05.webp`
4. `drop-02/medina-rucksack-drawstring-pdp-06.webp`
5. `drop-02/medina-rucksack-drawstring-pdp-07.webp`
6. `drop-02/medina-rucksack-drawstring-pdp-08.webp`
7. `drop-02/medina-rucksack-drawstring-pdp-09.webp`
8. `drop-02/medina-rucksack-drawstring-pdp-01.webp`

### `vintage-buckle-backpack`

- **Storage files:** 54 (51 usable, 3 supplier-raw / banned)
- **Hero:** `vintage-buckle-backpack-pdp-white.webp`
- **Drive source:** `usable product pics/vintage-buckle-backpack-pdp-alt/` (+ 2 more)

Wired to `products.images[]`:

0. `drop-02/vintage-buckle-backpack-pdp-white.webp`
1. `drop-02/vintage-buckle-backpack-scale.webp`
2. `drop-02/vintage-buckle-backpack-pdp-04.webp`
3. `drop-02/vintage-buckle-backpack-pdp-05.webp`
4. `drop-02/vintage-buckle-backpack-pdp-06.webp`
5. `drop-02/vintage-buckle-backpack-pdp-07.webp`
6. `drop-02/vintage-buckle-backpack-pdp-08.webp`
7. `drop-02/vintage-buckle-backpack-pdp-09.webp`
8. `drop-02/vintage-buckle-backpack-pdp-01.webp`

## PARTIAL (live but thin)

### `woven-leather-backpack`

- **Storage files:** 2 (2 usable, 0 supplier-raw / banned)
- **Hero:** `woven-leather-backpack-pdp-white.webp`

Wired to `products.images[]`:

0. `drop-01/woven-leather-backpack-pdp-white.webp`
1. `drop-01/woven-leather-backpack-archive-1.webp`

## NO-HERO (hidden, needs HF shots)

### `atlas-briefcase-vintage`

- **Storage files:** 3 (0 usable, 3 supplier-raw / banned)
- **Hero:** _none — needs HF generation_

### `atlas-kilim-rucksack`

- **Storage files:** 1 (0 usable, 1 supplier-raw / banned)
- **Hero:** _none — needs HF generation_

### `explorer-rolltop-noir`

- **Storage files:** 13 (11 usable, 2 supplier-raw / banned)
- **Hero:** _none — needs HF generation_
- **Drive source:** `usable product pics/explorer-rolltop-noir-macro/`

### `marrakech-tote-bordeaux`

- **Storage files:** 2 (0 usable, 2 supplier-raw / banned)
- **Hero:** _none — needs HF generation_

### `marrakech-tote-noir`

- **Storage files:** 1 (0 usable, 1 supplier-raw / banned)
- **Hero:** _none — needs HF generation_

### `medina-crossbody-cognac`

- **Storage files:** 5 (0 usable, 5 supplier-raw / banned)
- **Hero:** _none — needs HF generation_

### `medina-crossbody-tassel`

- **Storage files:** 1 (0 usable, 1 supplier-raw / banned)
- **Hero:** _none — needs HF generation_

### `medina-crossbody-tooled-walnut`

- **Storage files:** 25 (22 usable, 3 supplier-raw / banned)
- **Hero:** _none — needs HF generation_
- **Drive source:** `usable product pics/medina-crossbody-tooled-walnut-macro/`

### `vintage-satchel-light-brown`

- **Storage files:** 1 (0 usable, 1 supplier-raw / banned)
- **Hero:** _none — needs HF generation_

---

## How to add a new shot

### 1. Generate the shot
Use the `maison-tanneurs-product-shots` skill (in `~/.claude/skills/`). It locks the brand register, gives you the prompt, and the model order (nano_banana_2 → seedream_v5_pro → flux_2_pro).

### 2. Re-encode to WebP q=82
```bash
cwebp -q 82 -resize 3840 0 ~/Downloads/<raw>.png -o /tmp/<slug>-<kind>.webp
```

Canonical kinds: `pdp-white`, `scale`, `pdp-NN`, `scale-NN`, `macro-NN`, `pdp-alt-NN`.

### 3. Upload to Supabase Storage `drop-02/`
```bash
export SRK=$(cat ~/.rocco/maisontanneurs-supabase.json | python3 -c "import json,sys; print(json.load(sys.stdin)['service_role_key'])")
curl -X POST \
  -H "Authorization: Bearer $SRK" \
  -H "Content-Type: image/webp" \
  --data-binary @/tmp/<slug>-<kind>.webp \
  "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/products/drop-02/<slug>-<kind>.webp"
```

### 4. Rebuild + apply the manifest
```bash
cd ~/maisontanneurs
SRK=$(cat ~/.rocco/maisontanneurs-supabase.json | python3 -c "import json,sys; print(json.load(sys.stdin)['service_role_key'])")
SRK=$SRK python3 scripts/build-images-manifest.py > /tmp/manifest.json
SRK=$SRK python3 scripts/patch-products-from-manifest.py
SRK=$SRK python3 scripts/write-images-manifest-md.py
```

### 5. Remove the slug from `lib/hidden-skus.ts` if it was hidden

### 6. Commit + push (Vercel auto-deploys)

---

## Build pipeline scripts

| Script | Reads | Writes |
|---|---|---|
| `scripts/build-images-manifest.py` | Supabase Storage `drop-02/` + `drop-01/` | `/tmp/manifest.json` |
| `scripts/patch-products-from-manifest.py` | `/tmp/manifest.json` | Supabase `products.images[]` rows |
| `scripts/write-images-manifest-md.py` | `/tmp/manifest.json` + Drive folder | `docs/PRODUCT-IMAGES-MANIFEST.md` (this file) |

All three are idempotent. Run them in order any time you add or change Storage files.

