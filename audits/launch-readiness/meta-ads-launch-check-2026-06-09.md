# Maison Tanneurs Meta Ads Launch Check — 2026-06-09

## Verdict

Ready for a small validation campaign after one P0 production-copy fix is deployed: live homepage still says `14 Days · Unworn` while legal/checkout copy uses 30 days.

Not ready for scaled spend until Meta Commerce Manager / Events Manager are manually confirmed clean.

## Checked

- Live routes: `/`, `/products`, representative PDPs, `/legal/returns`, `/checkout/pay`, `/sitemap.xml`, `/robots.txt`, `/feed/products.xml` all returned 200.
- Live Meta surface: `node --import tsx scripts/verify-live-meta-surface.ts` passed; pixel `26891834623830253`; domain verification present.
- Live feed: `node --import tsx scripts/verify-live-feed.ts` passed; 22 items; 6 priority SKUs.
- Live checkout runtime: `node --import tsx scripts/verify-live-checkout-runtime.ts` passed; Revolut checkout host verified; purchase event route present.
- Success-page CAPI: `node --import tsx scripts/verify-success-page-capi.ts` passed; Meta returned `events_received=1`.
- Public links: `node --import tsx scripts/audit-public-links.ts` passed; 75 internal links checked.
- Public site audit: `node --import tsx scripts/audit-public-site.ts` passed; 13 200 routes, 7 hidden-product 404s, 7 expected unavailable internal routes.
- Local build: `pnpm build` passed.
- Diff whitespace: `git diff --check` passed.

## P0 before launching today

1. Deploy the 30-day returns consistency fix.
   - Live currently shows homepage House Promises as `14 Days · Unworn`.
   - Local `components/store/HousePromises.tsx` already says `30 Days · Unworn`.
   - Do not launch paid traffic until this is live; it is a customer-trust/legal ambiguity.

2. Manually confirm Meta UI state:
   - Campaign/ad sets exist or create them.
   - Catalog feed is connected in Commerce Manager.
   - Catalog diagnostics clean.
   - Events Manager Test Events sees PageView, ViewContent, AddToCart, InitiateCheckout, Purchase/CAPI dedup.

## P1 soon after launch

- Lint currently fails on pre-existing React lint rules in `AtelierHero.tsx`, `EditorialSlideshow.tsx`, and `NavTransitionIndicator.tsx`; build still passes. Fix before a broader cleanup/deploy cycle.
- Product page visual check is acceptable, but some below-fold lazy images appear blank in full-page screenshot until scrolled; not a live blocker.
- Two product heroes noted by previous audit remain lower-res/non-square: `explorer-rolltop-cognac`, `vintage-buckle-backpack`.

## Creative assets

Reviewed folder:
`/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/Maison-Tanneurs-Meta`

Found 31 usable image/video files: vertical 9:16 videos, 4:5 stills, square/detail images, one 16:9 horizontal asset.

Created ready-to-upload pack:
`/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/Maison-Tanneurs-Meta/Ready-To-Upload-2026-06-09`

Pack contents:
- `01_product-duffle-hero_1x1.jpg`
- `01_walking-carry-shot_9x16.mp4`
- `02_ryad-corridor-carry_4x5.jpg`
- `02_ryad-corridor-carry_9x16.mp4`
- `03_medina-threshold-carry_4x5.jpg`
- `03_medina-threshold-carry_9x16.mp4`
- `04_artisan-tactility_9x16.mp4`
- `04_train-platform-departure_4x5.jpg`
- `05_brass-buckle-detail_1x1.jpg`
- `05_monolithic-transit_16x9.mp4`
- `06_artisan-tactility_4x5.jpg`

First-wave recommendation:
- Use `01_walking-carry-shot_9x16.mp4`, `02_ryad-corridor-carry_9x16.mp4`, `03_medina-threshold-carry_9x16.mp4` for Reels/Stories/vertical placements.
- Use `02_ryad-corridor-carry_4x5.jpg`, `03_medina-threshold-carry_4x5.jpg`, `04_train-platform-departure_4x5.jpg` for feed static tests.
- Use `05_brass-buckle-detail_1x1.jpg` or `06_artisan-tactility_4x5.jpg` as craft/proof retargeting.
- Use `05_monolithic-transit_16x9.mp4` only where horizontal is useful; it appears to carry a visible generation watermark, so avoid as main paid creative if Meta/user-facing polish matters.

## Recommended launch shape

Small validation only:
- Budget: €10–20/day.
- Objective: Sales if Events Manager confirms Purchase path; otherwise Website traffic / landing-page views until events are clean.
- Structure: 1 campaign, 2 ad sets max.
- Creatives: 3 vertical videos + 2–3 feed stills from the ready pack.
- Landing: start with `/products` or top SKU PDPs (`atlas-weekender-cognac`, `expedition-rolltop-noir`, `oasis-weekender-oxblood`) depending creative.

## Not verified by tools

- I could not prove actual Meta Ads Manager campaign/ad set existence from local files; there are assets named by funnel/concept, but no campaign docs/export/API evidence in the folder.
- Manual Meta UI confirmation is still required before spend.
