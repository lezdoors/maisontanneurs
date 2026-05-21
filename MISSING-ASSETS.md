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

That's the universal "shoot pending" graphic. Once the real shot lands, replace the src with `/products/drop-01/<slug>-<type>.webp`.

For slot-specific tracking (rare — usually you'd just use the universal placeholder), the convention is:

```
/placeholders/leather-{slug}-{type}-MISSING.svg
```

Example: `/placeholders/leather-saddle-belt-scale-MISSING.svg` — clearly identifies which SKU + which shot type still owes HF work.

## Current state (2026-05-21)

**Production catalogue has full coverage.** All SKUs in `lib/products.ts` render with real WebPs:

| Slug | hero (`images[0]`) | secondary | tertiary |
|---|---|---|---|
| `heritage-rucksack` | `heritage-rucksack-01-v2.webp` ✅ | `heritage-rucksack-02-v2.webp` ✅ | `heritage-rucksack-03.webp` ✅ |
| `rolltop-daypack` | `rolltop-daypack-01.webp` ✅ | `rolltop-daypack-02.webp` ✅ | `rolltop-daypack-03.webp` ✅ |

No production placeholders in flight. **The site is launch-ready on the asset front.**

## Drop 02 + post-launch HF work list

Below are shots we *want* but haven't fired yet. Not blocking launch, but tracked so future Ryan can run a clean HF pass.

### Site-level upgrades (nice-to-haves)

| Slot | Shot type | Aspect | Why |
|---|---|---|---|
| Homepage Hero | Animated 16:9 (Seedance i2v from `hero-leather-campaign.webp`) | 16:9 | Add subtle motion to current still — cinematic upgrade |
| AtelierFocus | 9:16 portrait of an artisan stitching | 9:16 | Mobile-first crop, currently uses landscape `atelier-arch-rucksack.webp` |
| FeaturedDrop | Macro variant 2 — different angle of saddle-stitch + brass | 5:6 | Diversify from `material-leather-macro.webp` (already used in FeaturedDrop) |
| BrandStoryEditorial | Hands working leather at workbench | 5:6 | Stronger craft signal than current bag-in-atelier (`atelier-messenger-portrait.webp`) |
| About page | Wide atelier exterior (medina alley + door) | 21:9 cinematic | Sets up "where the atelier sits" narrative |
| Product feed OG image | Branded 1200×630 with MT mark + tagline | 1200×630 | Currently uses hero-leather-campaign.webp; could be branded card |

### Per-SKU shots — current 2 SKUs

| Slug | Missing shot | Aspect | Description |
|---|---|---|---|
| `heritage-rucksack` | `lifestyle` | 4:5 | Bag worn in motion — walking shot, urban or atelier setting |
| `heritage-rucksack` | `detail-macro` | 1:1 | Close-up of buckled flap + brass + saddle-stitch |
| `rolltop-daypack` | `lifestyle` | 4:5 | Bag carried casually, X-strap visible |
| `rolltop-daypack` | `detail-macro` | 1:1 | Close-up of roll-top closure mechanism |

### Drop 02 SKUs (planning) — when these go live, add to lib/products.ts + fire HF

Tentative leather wearables Phase 2. None are committed yet — pending Oussama's inventory list.

| Tentative slug | Category | Shots needed |
|---|---|---|
| `saddle-belt-cognac` | Belts | hero + scale + pdp-white + detail-macro |
| `saddle-belt-walnut` | Belts | hero + scale + pdp-white + detail-macro |
| `bifold-wallet-cognac` | Wallets | hero + scale + pdp-white + interior-shot |
| `cardholder-cognac` | Wallets | hero + scale + pdp-white |
| `messenger-bag-cognac` | Bags | hero + scale + pdp-white + lifestyle |
| `babouches-cognac` | Babouches | hero + scale + pdp-white + worn-shot |

### Hero video assets (post-launch)

| Slot | Source still | Animation type |
|---|---|---|
| Homepage Hero | `hero-leather-campaign.webp` (67a48ee3) | Seedance i2v, 5s loop, gentle dolly + couple walks |
| AtelierFocus | `atelier-arch-rucksack.webp` (b3c5ceb5) | Kling start+end frame, light shifts across the doorway |
| FeaturedDrop | `material-leather-macro.webp` (897e51b3) | Seedance i2v, dust beam drifts, stitch in micro-focus shift |

## HF source archive

All HF originals are in `~/brand-assets/maison-tanneurs/_hf-archive/` organized by intent (heroes / atelier-interiors / model-bag-campaign / material-studies). Site WebPs in `public/hero/` and `public/products/` are downsampled WebP renders of those PNG masters.

To trace a site WebP → HF source: see the mapping table in `~/brand-assets/maison-tanneurs/README.md`.

## Adding a new missing-asset row

When a new SKU lands without a finished shoot:

1. Add the SKU to `lib/products.ts` with `images: ["/placeholders/leather-MISSING.svg"]`
2. Append a row to the "Per-SKU shots" table above
3. After firing HF + cropping: replace the src in `lib/products.ts`, remove the row here
4. Commit message: `Replace placeholder for <slug>` so the diff is easy to scan
