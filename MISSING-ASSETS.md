# Missing assets — Maison Tanneurs

The HF work list. Every asset referenced by the site but not yet generated lives here. One row per shot to fire.

## How to grep for missing assets

```bash
# Find every code reference to a placeholder
grep -rn 'placeholders/leather' --include="*.tsx" --include="*.ts" .

# Find every site-rendered placeholder path
grep -rn 'leather-MISSING' --include="*.tsx" --include="*.ts" .
```

If `grep` returns rows, those slots are still using placeholder art and need HF generation before launch.

## Placeholder convention

When wiring a new SKU before its HF assets land, point the image src at:

```
/placeholders/leather-MISSING.svg
```

That's the universal "shoot pending" graphic. Once the real shot lands, replace the src with the Supabase Storage URL.

## Current state (2026-05-21)

### Canonical hero naming — enforced by `scripts/audit-catalogue.ts`

Every SKU's `images[]` MUST follow:
- `[0]` = `<slug>-scale.webp` (lifestyle) **or** `<slug>-pdp-white.webp` (cyclorama)
- `[2+]` = `<slug>-archive-N.webp` (gallery, alts, supplier raws)

Featured SKUs SHOULD have a `-scale.webp` lifestyle shot. Grandfathered list (warn, not fail) is maintained in `scripts/audit-catalogue.ts` → `AWAITING_SCALE_SHOTS`.

Run the audit before every deploy: `pnpm audit:catalogue` (also auto-runs as `prebuild`).

### Production catalogue — 6 visible + 1 draft

| Slug | hero | scale exists? | price | status |
|---|---|---|---|---|
| `heritage-rucksack` | scale (lifestyle, man in alley) | ✓ | $325 | live |
| `black-stitched-backpack` | pdp-white | grandfathered | $245 | live, awaiting scale |
| `cognac-brogue-backpack` | pdp-white | grandfathered | $265 | live, awaiting scale |
| `classic-cognac-satchel` | pdp-white | grandfathered | $285 | live, awaiting scale |
| `woven-leather-backpack` | pdp-white | grandfathered | $295 | live, awaiting scale |
| `vintage-buckle-backpack` | pdp-white | grandfathered | $225 | live, awaiting scale |
| `rolltop-daypack` | — | NEEDS RESHOOT | $245 | **draft** (legacy heroes were supplier-pile raws) |

Plus `test-e2e` ($0.30, `featured=false`, hidden) for the Revolut checkout test path.

### Grandfathered SKUs — generate scale (lifestyle) shots to remove warnings

Use the [`higgsfield-product-photoshoot`](~/.claude/skills/higgsfield-product-photoshoot/) skill with `lifestyle_scene` mode. Reference image is each SKU's existing `-pdp-white.webp` Supabase URL. Save as `<slug>-scale.webp`, upload to Storage, then remove the slug from `AWAITING_SCALE_SHOTS` in the audit script.

- `black-stitched-backpack`
- `cognac-brogue-backpack`
- `classic-cognac-satchel`
- `woven-leather-backpack`
- `vintage-buckle-backpack`

### `rolltop-daypack` — needs full re-shoot

Three legacy heroes (`-01.webp`, `-02.webp`, `-03.webp`) were all supplier-pile / souk-worn raws. SKU is `status='draft'` until a clean white-bg `-pdp-white.webp` + lifestyle `-scale.webp` arrive. Fire the storyboard pipeline:
1. White-bg storyboard via `higgsfield-product-photoshoot` (mode: `product_shot`)
2. Lifestyle scale via `lifestyle_scene` mode
3. Upload + reseed + flip `status` back to `available` + `featured` to `true`.

## Deferred SKUs — slugs locked, shots pending

Supplier reference photos live in `~/brand-assets/maison-tanneurs/_unsorted/leather-bags-supplier-pool/`. Backgrounds are cream-wall, Berber linen, or in-souk phone snaps — not clean white. Each SKU below has a locked Marrakech-anchored slug. **These slugs are final — do not rename them again.**

| Final slug | Title | Anchor | Source references | Status |
|---|---|---|---|---|
| `mellah-tote-noir` | Mellah Tote · Noir | Marrakech Jewish quarter | image_4b5ea538, image_8ed7f752, image_b9024dfd | needs main pic |
| `mellah-tote-bordeaux` | Mellah Tote · Bordeaux | same line, colour variant | image_3028860e, image_7842a5d3, image_a5c51ba1 | needs main pic |
| `ourika-crossbody-cognac` | Ourika Crossbody · Cognac | river valley south of Marrakech | brown-leather-bag-small, Morocco0044 | needs main pic |
| `ourika-crossbody-jade` | Ourika Crossbody · Jade | same line, colour variant | 0cf6e4_e7b3984a64fd4a79a057f99d4e3ce414_mv2 | needs main pic |
| `ourika-crossbody-bordeaux` | Ourika Crossbody · Bordeaux | same line, colour variant | Morocco0026 | needs main pic |
| `hivernage-duffle` | Hivernage Duffle | Marrakech palm-tree district | 01fd3484-0349-4c88-895c-71b609cddbf2 | needs main pic |
| `tinmel-rucksack` | Tinmel Rucksack | Almohad imperial capital, High Atlas | 86b8c4fb-064d-40eb-9685-e3cf3f9b6e3c, 32e97985 | needs main pic |
| `tichka-rolltop` | Tichka Roll-Top | High Atlas mountain pass | 9-shot HF storyboard 2026-05-21 22:47 | shots ready, awaiting upscale on hero + close-up |

### Why these names

- **Mellah** — old Jewish quarter; reads heritage + old-city. Untouched by luxury bag houses.
- **Ourika** — green river valley below the High Atlas; softness, terrain. Untouched.
- **Hivernage** — Marrakech's palm-lined upscale district. Luxe-tier French-Arabic. Untouched.
- **Tinmel** — Almohad capital + mosque ruins, austere monumental history. Untouched.
- **Tichka** — High Atlas pass between Marrakech and the Sahara; travel-anchored rugged register, fits utility roll-top silhouettes. Untouched.

Verified clear of luxury bag trademarks 2026-05-21 — see WebSearch run in commit history. (Avoided: Kasbah, Saadi, Zellige, Majorelle, Bahia, Sahara — all claimed.)

## Workflow — main pic per SKU via the skill, then HF app handles the rest

We follow the `higgsfield-product-photoshoot` skill (global, at `~/.claude/skills/higgsfield-product-photoshoot/`). **Don't hand-write prompts here.** The skill is the canonical source.

**Per deferred SKU:**

1. Pick the strongest reference file from the source list above.
2. Invoke the skill with the slug + reference file. The skill outputs the canonical main pic prompt (white-bg cyclorama hero) calibrated to the Maison Tanneurs register.
3. Fire that prompt in HF UI → Image tab → `nano_banana_2` (2 credits, toggle Unlimited). Reference image attached. 1:1 aspect.
4. Pick the strongest of 2–4 generations as the **main pic** (`<slug>-01.webp`).
5. From that main pic, drive the HF app's "multishot" feature for additional angles (`-02`, `-03`, `-04`).
6. For lifestyle (`-05`, 4:5 portrait), fire a fresh skill prompt with lifestyle context.
7. Save chosen WebPs to `~/Downloads/`.

When all 7 SKUs are shot, ping me with **"renders ready in ~/Downloads"** — I'll batch-upload to Supabase Storage, seed the SKUs into `lib/products.ts` + a migration, and strike the row from this table.

### Some bags already have HF shots that don't follow the skill

Source folder may contain prior HF generations that pre-date the skill (off-register lighting, wrong background tone, gibberish stitching). **Don't reuse them.** Regenerate through the skill so the whole catalogue stays one studio look. The supplier reference photo is what carries the product — the prompt only describes the environment.

## Output naming convention when you save HF results

Save the chosen WebP from each batch to `~/Downloads/` with this exact filename pattern:

```
<slug>-<NN>.webp
```

Where `NN` is `01` for hero white-bg, `02-04` for additional angles, `05` for lifestyle. Examples:

```
mellah-tote-noir-01.webp           ← white-bg hero
mellah-tote-noir-05.webp           ← lifestyle 4:5
ourika-crossbody-cognac-01.webp    ← white-bg hero
ourika-crossbody-cognac-02.webp    ← open interior
ourika-crossbody-cognac-05.webp    ← lifestyle 4:5
```

When all 7 SKUs are shot, ping me with "renders ready in ~/Downloads" and I'll batch-upload to Supabase Storage + seed the SKUs into the catalog + remove the corresponding row from the deferred table above.

## HF work list — lifestyle + scale shots for current 7 SKUs

These shots are NOT blockers (every SKU has a hero already) but would lift the PDPs significantly. Prompt suggestions assume the current Le Tanneur / Loewe register locked elsewhere on the site.

### Per-SKU lifestyle shots (4:5 portrait)

For each live SKU, fire the `higgsfield-product-photoshoot` skill in **lifestyle** mode with the SKU's existing white-bg hero (`<slug>-01.webp` in Supabase Storage `products/drop-01/`) as the reference image. Save the chosen WebP as `<slug>-05.webp`.

Slugs to lifestyle:

- `heritage-rucksack`
- `rolltop-daypack`
- `black-stitched-backpack`
- `cognac-brogue-backpack`
- `classic-cognac-satchel`
- `woven-leather-backpack`
- `vintage-buckle-backpack`

Not launch-blocking — every live SKU already has a white-bg hero. Lifestyle lifts the PDP, doesn't gate it.

### Catalogue tile / category landing shots

Already covered by `hero-leather-campaign.webp` + `leather-goods-tile.webp` for now. Replace if Drop 02 introduces new categories (Small Leather Goods, Wallets, Belts).

## Drop 02 SKU roadmap (planning)

Tentative wearables to add post-launch. Need Oussama's inventory list + photo upload before any of these can ship.

| Tentative slug | Category | Shots needed |
|---|---|---|
| `saddle-belt-cognac` | Belts | hero + scale + pdp-white + detail-macro |
| `saddle-belt-walnut` | Belts | hero + scale + pdp-white + detail-macro |
| `bifold-wallet-cognac` | Wallets | hero + scale + pdp-white + interior-shot |
| `cardholder-cognac` | Wallets | hero + scale + pdp-white |
| `messenger-bag-cognac` | Bags | hero + scale + pdp-white + lifestyle |
| `babouches-cognac` | Babouches | hero + scale + pdp-white + worn-shot |

## Site-level upgrades (nice-to-haves)

| Slot | Shot type | Aspect | Why |
|---|---|---|---|
| Homepage Hero | Animated 16:9 (Seedance i2v from `hero-leather-campaign.webp`) | 16:9 | Add subtle motion to current still — cinematic upgrade |
| About page | Wide atelier exterior (medina alley + door) | 21:9 cinematic | Sets up "where the atelier sits" narrative |
| Product feed OG image | Branded 1200×630 with MT mark + tagline | 1200×630 | Currently uses hero-leather-campaign.webp; could be branded card |

## HF source archive

All HF originals are in `~/brand-assets/maison-tanneurs/_hf-archive/` organized by intent (heroes / atelier-interiors / model-bag-campaign / material-studies). Site WebPs in Supabase Storage `products` bucket are downsampled WebP renders of those PNG masters.

To trace a site WebP → HF source: see the mapping table in `~/brand-assets/maison-tanneurs/README.md`.

## Adding a new missing-asset row

When a new SKU lands without a finished shoot:

1. Add the SKU to `lib/products.ts` + `supabase/migrations/*.sql` with `images: ["/placeholders/leather-MISSING.svg"]`
2. Append a row to the "Deferred SKUs" table above
3. After firing HF + uploading: replace the Supabase URL, remove the row here
4. Commit message: `Replace placeholder for <slug>` so the diff is easy to scan
