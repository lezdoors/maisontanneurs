# Missing assets — Maison Tanneurs

> **2026-06-09 hard stop:** this file is historical only. Do not follow any
> older instruction below that suggests generating product shots, using
> supplier references, saving products to Downloads, putting `scale` first, or
> treating existing Supabase images as source of truth. The active product
> image contract is `docs/PRODUCT-IMAGE-SOURCE-OF-TRUTH.md`: use only Google
> Drive `Maison Tanneurs/usable product pics`, and keep each SKU's `Hero-*`
> first as `{slug}-pdp-white.webp` in Supabase/Airtable/storefront/feeds.
>
> **2026-05-28 launch note:** this file is historical and not the active
> Maison Tanneurs product-media source of truth. Use
> `docs/HF-9SHOT-REQUESTS-2026-05-28.md`,
> `docs/PRODUCT-MEDIA-AUDIT-2026-05-28.md`, and
> `docs/ROCCO-PRODUCT-MEDIA-HANDOFF-2026-05-28.md` for current launch work.
> The launch scope is bags and small leather goods only. Finished HF/Drive
> product sets in `Maison Tanneurs/usable product pics` are canonical; raw
> screenshots, Oussam uploads, and supplier/source folders are references only.

The HF work list. Every asset referenced by the site but not yet generated lives here. One row per shot to fire.

## Brand imagery slots — `public/brand/`

French editorial luxury × Moroccan craft register (Loewe / Bottega / Hermès tier). Quiet luxury, restrained, model-led when a human is present. Settings: Parisian interiors, Marrakech riads, Marrakech rooftops, sun-dappled palm groves, golden-hour soft light. **NEVER** desert / camel / dune / souk / lantern. Palette anchors: cream, oxblood, cognac, whiskey-brown, charcoal, brass-gold, dove-grey. See [`public/brand/README.md`](public/brand/README.md) for full conventions.

Encoding: WebP q=82, 2400px long edge minimum (4K supported), no baked-in typography.

### Hero slots (`public/brand/hero/`)

| File | Where | Aspect | Status |
|---|---|---|---|
| `home-hero.webp` | `components/store/Hero.tsx` | 16:9 desktop, 4:5 mobile | **MISSING** — currently falls back to `/hero/hero-leather-campaign.webp` (legacy). Generate: Mediterranean-featured woman in a sun-dappled Marrakech riad courtyard, cognac satchel slung across her shoulder, soft golden-hour light, generous negative space upper-third. |
| `atelier-hero.webp` | `app/(store)/about/page.tsx` | 21:9 cinematic | placeholder — currently legacy supplier wide. Generate: wide interior of a Marrakech leather atelier — limestone arches, soft daylight through arched window, brass tools on workbench, no model. |
| `shop-hero.webp` | `app/(store)/products/page.tsx` (header) | 21:9 banner | not wired yet — when hero is added to /products, generate: editorial top-down on a walnut writing desk with three or four cognac leather pieces arranged in flat-lay, soft daylight, no model. |
| `editorial-rooftop.webp` | optional hero slot, future homepage variant | 16:9 | optional. Generate: Mediterranean-featured woman in cream linen on a Marrakech medina rooftop at golden hour, cognac duffle at her feet, distant minarets soft in the background. |

### Section slots (`public/brand/section/`)

| File | Where | Aspect | Status |
|---|---|---|---|
| `home-feature.webp` | `components/store/FeaturedDrop.tsx` background | 16:9 | placeholder until provided |
| `home-atelier.webp` | `components/store/AtelierFocus.tsx` | 4:5 portrait | placeholder until provided |
| `home-editorial.webp` | `components/store/EditorialStrip.tsx` | 4:5 portrait | placeholder until provided |
| `home-brand-story.webp` | `components/store/BrandStoryEditorial.tsx` | 5:6 portrait | placeholder until provided |

When wiring new files: drop them into the matching folder slug-named, then bump the `src=` in the component. No DB change needed — these aren't products.

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

### Historical note

This file predates the May 28 launch media audit. Current Maison Tanneurs
launch scope is bags and small leather goods only. Do not treat clothing,
jackets, outerwear, or apparel copy as part of the launch catalogue.

Ryan flagged a possible Drive folder for `cognac-brogue-backpack` at:

`/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/usable product pics/cognac-brogue-backpack`

The 9 PNGs have been encoded and staged at:

`/Users/ryanz/brand-assets/maison-tanneurs/_upload-ready/2026-05-28-cognac-brogue-backpack`

2026-05-28 correction: Ryan confirmed the finished Drive folder
`usable product pics/cognac-brogue-backpack` as the correct product source for
the launch row. The current active audit treats that SKU as resolved. Do not
revive older raw/supplier mismatch notes from this historical section.

### Legacy production catalogue — 6 visible + 1 draft

| Slug | hero | scale exists? | price | status |
|---|---|---|---|---|
| `heritage-rucksack` | scale (lifestyle, man in alley) | ✓ | $325 | live |
| `black-stitched-backpack` | pdp-white | grandfathered | $245 | live, awaiting scale |
| `cognac-brogue-backpack` | pdp-white | resolved by 2026-05-28 audit | $265 | live, finished Drive 9-shot set wired |
| `classic-cognac-satchel` | pdp-white | grandfathered | $285 | live, awaiting scale |
| `woven-leather-backpack` | pdp-white | grandfathered | $295 | live, awaiting scale |
| `vintage-buckle-backpack` | pdp-white | grandfathered | $225 | live, awaiting scale |
| `rolltop-daypack` | — | NEEDS RESHOOT | $245 | **draft** (legacy heroes were supplier-pile raws) |

Plus `test-e2e` ($0.30, `featured=false`, hidden) for the Revolut checkout test path.

### Grandfathered SKUs — generate scale (lifestyle) shots to remove warnings

Use the [`higgsfield-product-photoshoot`](~/.claude/skills/higgsfield-product-photoshoot/) skill with **`lifestyle_scene`** mode. Reference image is each SKU's existing `-pdp-white.webp` Supabase URL (or the current `-01.webp` until Storage rename runs). Output: **2400×3200 portrait** WebP q=82. Save as `<slug>-scale.webp`, upload to Storage `products/drop-01/`, then remove the slug from `AWAITING_SCALE_SHOTS` in `scripts/audit-catalogue.ts`.

Same skeleton intent across all 5 (per skill brief — backend assembles the actual prompt). Vary only the silhouette + colorway phrase per SKU.

**Skill brief — copy-paste into the `higgsfield-product-photoshoot` skill prompt:**

```
mode=lifestyle_scene
brand context=Maison Tanneurs · heritage Moroccan leather atelier
aspect=4:5 portrait (2400×3200 final)
reference image=<paste pdp-white URL here>
intent=editorial lifestyle hero for catalogue tile. Bag is sitting on a sun-warmed limestone bench inside a calm Marrakech atelier interior, late-afternoon side light catching the leather grain. Generous negative space, soft uncluttered composition, no people in frame, no props except optional cream linen folded beside. Calm flat-saturation editorial register. No logos, no monograms, no typography, no signage, no text.
```

Per-SKU silhouette context (append to intent if the reference image alone needs reinforcement):

| Slug | Silhouette context |
|---|---|
| `black-stitched-backpack` | black full-grain leather backpack, cream contrast zigzag stitching |
| `cognac-brogue-backpack` | live product is buckled flap backpack; staged Drive folder currently shows different zip backpack |
| `classic-cognac-satchel` | cognac briefcase satchel, dual brass buckles, top handle |
| `woven-leather-backpack` | dark-chocolate hand-woven leather backpack, diamond lattice |
| `vintage-buckle-backpack` | cognac safari-classic backpack, three buckled exterior pockets |

### `rolltop-daypack` — needs full re-shoot

Three legacy heroes (`-01.webp`, `-02.webp`, `-03.webp`) were all supplier-pile / souk-worn raws. SKU is `status='draft'` until a clean white-bg `-pdp-white.webp` + lifestyle `-scale.webp` arrive.

**Skill briefs — fire BOTH in `higgsfield-product-photoshoot`:**

Brief 1 — `product_shot` mode for the white-bg PDP plate (1200×1200 square):
```
mode=product_shot
brand context=Maison Tanneurs · heritage Moroccan leather atelier
aspect=1:1 square (1200×1200 final)
reference image=<one of the legacy -01.webp / -02.webp supplier raws as silhouette ref>
intent=clean white-bg catalogue front. Cognac full-grain leather roll-top daypack, single front pocket, X-strap closure, leather top handle, adjustable padded shoulder straps. Camera straight-on front view, bag centered, straps tucked neutrally behind. Soft even front-key light, no directional shadows, very subtle contact shadow. Generous white margin on all sides. Calm editorial PDP register. No logos, no monograms, no typography, no text.
```

Brief 2 — `lifestyle_scene` mode for the scale (lifestyle hero), 2400×3200 portrait. Use the brief from the grandfathered SKUs block above (atelier limestone bench), substituting the silhouette text:
> *Silhouette: cognac full-grain leather roll-top daypack, single front pocket, X-strap closure*

After both shots land:
1. Save as `rolltop-daypack-pdp-white.webp` + `rolltop-daypack-scale.webp` at q=82
2. Upload to Supabase Storage `products/drop-01/`
3. Update `lib/products.ts` SKU #2: `status: "available"`, `featured: true`, `images: [scale_url, pdp_white_url]`
4. Apply DB UPDATE flipping status + images[]
5. Re-run `pnpm audit:catalogue` — should pass with rolltop-daypack now live

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

Tentative leather goods to add post-launch. Need Oussama's inventory list + photo upload before any of these can ship.

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
