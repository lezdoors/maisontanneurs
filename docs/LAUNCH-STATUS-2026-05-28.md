# Maison Tanneurs Launch Status — 2026-05-28

> **SUPERSEDED 2026-06-08** — see `docs/LAUNCH-STATE-2026-06-08.md` for current
> verified launch state. References to `/about` are stale (route renamed to
> `/atelier`); Switzer font note is stale (wordmark uses Bodoni Moda SC);
> tracking, Revolut LIVE keys, Meta domain verification, and the real E2E
> purchase are confirmed completed.

## Current Deployment

- Production domain: `https://maisontanneurs.com`
- Latest production deployment verified: `dpl_2SLdGzepWPyNwjDQoaYPRYYonnHx`
- Latest production URL: `https://maisontanneurs-7gvoesots-haddaoui.vercel.app`
- Supabase project: `xbtabpurfavngwmwtawc`

## Verified This Pass

- 2026-05-28 live production refresh:
  - `vercel inspect maisontanneurs.com` resolves to production deployment
    `dpl_2SLdGzepWPyNwjDQoaYPRYYonnHx`.
  - Deployment status: `Ready`.
  - Aliases include `https://maisontanneurs.com`, `https://kechken.vercel.app`,
    `https://maisontanneurs-haddaoui.vercel.app`, and
    `https://maisontanneurs-lezdoors-haddaoui.vercel.app`.
  - `SITE_URL=https://maisontanneurs.com pnpm audit:launch` passes.
  - Checkout smoke passed without creating a Revolut order:
    `sessionRequested: true`, `hasConfigurationUnavailable: false`.
- `pnpm exec tsc --noEmit` passes.
- `pnpm build` passes locally.
  - Current local build uses `STATIC_PRODUCTS` because `.env.local` has no
    Supabase key.
  - `STATIC_PRODUCTS` now mirrors the 24 visible live storefront products, so
    local fallback QA no longer 404s current launch SKUs such as
    `atlas-kilim-rucksack`.
  - Local fallback catalogue audit: 25 audited SKUs, 0 hard failures, 13
    warnings for missing lifestyle `-scale` shots.
- Vercel production build passes with live Supabase catalogue audit:
  - 25 audited SKUs.
  - 6 drafts skipped.
  - 0 hard failures.
  - 13 warnings for missing lifestyle `-scale` shots.
- Production alias verified with `vercel inspect maisontanneurs.com`.
- `https://maisontanneurs.com` is aliased to deployment
  `dpl_2SLdGzepWPyNwjDQoaYPRYYonnHx`.
- `https://maisontanneurs.com` returns `200`.
- `https://maisontanneurs.com/products` returns `200`.
- `https://maisontanneurs.com/products/atlas-kilim-duffle` returns `200`.
- `https://maisontanneurs.com/checkout/pay` returns `200`.
- Production metadata now says "leather goods", avoiding accidental
  clothes/apparel implication.
- Product-family filters and footer collection links now expose every live
  family in the catalogue: Backpack, Briefcase, Crossbody, Duffle, Messenger,
  Rolltop, Saddlebag, Satchel, Tote, and Weekender.
- Supabase category values were cleaned from legacy `Leather Goods` to exact
  product families for visible and launch-hidden bag rows, so filters, feeds,
  and future handoffs no longer depend on frontend-only category normalization.
- Public About atelier record no longer shows a stale `04.2026` label.
- Rendered canonical tags verified on production:
  - `/products` -> `https://www.maisontanneurs.com/products`
  - `/products/atlas-weekender-cognac` -> `https://www.maisontanneurs.com/products/atlas-weekender-cognac`
  - `/about` -> `https://www.maisontanneurs.com/about`
  - `/contact` -> `https://www.maisontanneurs.com/contact`
  - `/legal/shipping` -> `https://www.maisontanneurs.com/legal/shipping`
  - `/checkout/pay` -> `noindex, nofollow` and canonical `/checkout/pay`
- Switzer local font is now the primary sans family; the previous root Inter
  variable override was removed.
- Public route response check passed:
  - `200`: `/`, `/products`, `/products?category=Backpack`,
    `/products?category=Crossbody`, `/products?category=Duffle`,
    `/products?category=Satchel`, `/about`, `/contact`,
    `/legal/shipping`, `/legal/returns`, `/legal/terms`,
    `/legal/privacy`, `/legal/care`, `/legal/faq`, `/checkout/pay`.
  - `307` intentional redirects: `/collection`, `/search`.
- Public site audit now exists and passes on production:
  - `pnpm audit:public`
  - Checks 13 public launch routes return `200`.
  - Checks 5 hidden/test product routes return `404`.
  - Checks no public leakage of hidden SKUs, clothes/jacket/outerwear overclaims, or
    stale atelier copy such as `Tannerie Chouara` / `Marrakech, MA`.
- Public link audit now exists and passes on production:
  - `pnpm audit:links`
  - Seed pages checked: 11.
  - Internal links checked: 73.
  - External links allowed: 1.
  - Catches broken internal links, malformed external links, and accidental
    off-site URLs while treating apex/www Maison Tanneurs URLs as same-site.
- Consolidated launch audit now exists and passes on production:
  - `SITE_URL=https://maisontanneurs.com pnpm audit:launch`
  - Runs public routes/content, public links, product media, and source-folder
    inventory in one pass.
  - Current result after deployment `dpl_2SLdGzepWPyNwjDQoaYPRYYonnHx`: launch
    audit passed, hard media priorities `0`.
- Product media audit now fails on raw/source gallery filenames anywhere in a
  visible product gallery, not only in the hero position.
- Product media audit now fails on visible product records that leak apparel
  scope (`jacket`, `outerwear`, `clothing`, `apparel`, etc.).
- Current production result: raw/source gallery images `0`; apparel scope leaks
  `0`.
- Checkout API rejects invalid/fake products before payment:
  - `POST /api/checkout/session` with fake product returns `400 Cart needs review`.
- Checkout API accepts stale client carts with a valid slug but non-UUID
  placeholder product id, then rebuilds the order from server product truth.
- Checkout session route now rebuilds title, price, image, status, and stock from server-side product truth before creating the Revolut order.
- Checkout configuration smoke now exists:
  - `SITE_URL=https://maisontanneurs.com pnpm dlx @playwright/test@1.51.1 test scripts/checkout-smoke.spec.js --reporter=line`
  - Adds a real live PDP item to cart, blocks `/api/checkout/session`, and
    expects the checkout page to request that endpoint. This verifies the live
    client has Revolut public configuration and the cart handoff works without
    creating a Revolut order or charging a card.
- Post-deploy visual smoke passed:
  - `SITE_URL=https://maisontanneurs.com VISUAL_AUDIT_DIR=/Users/ryanz/brand-assets/maison-tanneurs/_audits/2026-05-28-live-post-deploy pnpm dlx @playwright/test@1.51.1 test scripts/visual-smoke.spec.js --reporter=line`
  - 10/10 passed across homepage, collection, representative PDPs, and about
    on desktop/mobile.
- Checkout summary copy no longer claims sea freight or 8-14 week shipping.
- Legacy `/products?category=Leather%20Goods` links were removed from public
  UI components; category links now point to real product-family filters or
  the full collection.
- Visual QA pass in Chrome:
  - Mobile homepage: nav readable, full-bleed hero working, CTA visible after
    cookie banner accepted.
  - Mobile collection: headline/filter/product grid render without overlap.
  - Mobile PDP: product image, thumbnails, sticky add-to-cart, and trust links
    render without overlap.
  - Mobile cart/checkout: add-to-cart works, cart drawer opens, checkout page
    loads with persisted item, Revolut pay button becomes available, and order
    summary is readable.
  - Mobile first-session cookie banner is now a compact full-width legal bar
    with stacked actions at narrow widths, avoiding horizontal overflow. Local
    smoke screenshot:
    `/Users/ryanz/brand-assets/maison-tanneurs/_audits/2026-05-28-cookie-banner-local/home-mobile-compact-final.png`.
    Live smoke screenshot:
    `/Users/ryanz/brand-assets/maison-tanneurs/_audits/2026-05-28-cookie-banner-live/products-mobile-live.png`.
  - Mobile PDP cookie banner stays as a compact bottom legal bar instead of
    covering the top product image/header area.
  - Collection-grid LCP warning fixed by eagerly loading the first above-fold
    product card image.
  - PDP gallery LCP warning fixed by eagerly loading the hero gallery image and
    active thumbnail.
  - Closed cart drawer is not rendered in first-load page text; hidden cart
    drawer copy no longer leaks into `document.body.innerText`.
  - Live PDP cart smoke on `https://maisontanneurs.com/products/atlas-kilim-rucksack`
    passed: first load has no closed drawer text leak, Add to Cart opens the
    drawer, and mobile has no horizontal overflow. Screenshot:
    `/Users/ryanz/brand-assets/maison-tanneurs/_audits/2026-05-28-cart-drawer-live/pdp-mobile-cart-open-live.png`.
  - Desktop homepage: full-bleed cinematic hero, centered wordmark, nav, and
    hero copy are readable.
- Desktop collection: family filter row no longer clips the final Weekender
    filter; product count is hidden until extra-wide desktop to preserve room.
  - Desktop PDP: product-gallery layout is stable, but some product exports
    still contain baked-in black artboard/crop lines. Treat those as asset
    replacement needs, not site CSS bugs.
- Local PDP accessibility follow-up:
  - Closed cart drawer is no longer present in the accessibility tree.
  - Hidden "added to bag" toast is no longer focusable/readable until active.
  - Cart drawer thumbnails now use contained product shots instead of cropped
    square thumbnails.

## Product Media State

Use:

```bash
pnpm exec tsx scripts/audit-media-sources.ts
pnpm exec tsx scripts/audit-assets.ts
pnpm run audit:sources
pnpm run audit:drive-sets
```

Live Supabase products audited: 24.
Live image-scrape product slugs found on `/products`: 24.

Hard visible media blockers:

- Zero-image products: 0.
- Risky raw/supplier/macro heroes: 0.
- Missing clean PDP-white heroes on visible products: 0.
- Mixed-product gallery images: 0.
- Low-gallery visible products: 3.
- Drive/HF/source folders with 4+ direct images: 61.
- Likely complete 8/9-shot source folders: 54.

Do not broadly regenerate. Existing Drive/HF/local assets are enough for most
gallery improvements. The live asset audit now separates "select/wire existing"
from true generation priorities. See `docs/PRODUCT-MEDIA-AUDIT-2026-05-28.md`.

2026-05-28 continuation:

- Added `scripts/wire-drive-product-set.ts` to encode finished Drive/HF product
  folders to WebP, upload them to Supabase Storage `products/drop-02/`, and
  replace Supabase `products.images[]` for the SKU.
- Added `pnpm audit:drive-sets` to inventory Drive `usable product pics`
  against launch SKUs and print exact wiring commands.
- Dry-run wiring succeeded for:
  - `atlas-field-briefcase`
  - `atlas-kilim-rucksack`
  - `expedition-rolltop-cognac`
- Upload/wiring is blocked locally until a real `SUPABASE_SERVICE_ROLE_KEY` is
  restored. The helper also accepts `SRK` or
  `~/.rocco/maisontanneurs-supabase.json` (`MT_SUPABASE_KEY_FILE` can override
  the path). Current `.env.local` Supabase values are empty and
  `~/.rocco/maisontanneurs-supabase.json` is missing.
- Vercel production env names exist, but `vercel env pull --environment=production`
  returns empty values locally. Do not rely on pulled env for Storage wiring
  unless actual values are restored into local env or the Rocco key file.

## Remaining Blockers

- Scope correction from Ryan: Maison Tanneurs is not selling clothes. Do not add
  jacket/outerwear/clothing navigation, products, sections, or blockers.
- The current public launch scope is luxury leather bags and small leather
  goods.
- Checkout browser flow has been smoke-checked up to the Revolut order-token
  creation boundary. Do not enter card details unless running the planned
  refundable test SKU.
- Local fallback catalogue was synced from the live storefront on 2026-05-28:
  - 24 visible launch products.
  - Old draft/phantom fallback SKUs such as `saharienne-saddle-cognac`,
    `medersa-rucksack-cognac`, and `rif-rucksack-tan` were removed.
  - Current launch SKUs such as `atlas-kilim-rucksack`,
    `atlas-weekender-cognac`, and `medina-duffle` now exist in fallback mode.
- Some visible SKUs have thin galleries, but this is not a launch blocker:
  - `atlas-briefcase-vintage`
  - `medina-crossbody-cognac`
  - `vintage-satchel-light-brown`
- `black-stitched-backpack` and `classic-cognac-satchel` are
  launch-acceptable from live same-SKU gallery count, but their finished source
  folders should be archived when found.
- `cognac-brogue-backpack` Drive QA update:
  Ryan confirmed `usable product pics/cognac-brogue-backpack` is the correct
  SKU source. The folder files were renamed to
  `cognac-brogue-backpack-pdp-01.webp` through `-09.webp`, uploaded to
  Supabase Storage `products/drop-02/`, and wired to the live product row.
- Do not generate yet. Ryan confirmed complete HF/Drive 9-shot sets should
  exist for all bags, but names may be unreliable, so product media work now
  starts with visual mapping and download/sync, not new HF generation.
- Visual contact sheets are archived at:
  `/Users/ryanz/brand-assets/maison-tanneurs/_audits/2026-05-28-product-source-sheets`
- Source-folder inventory is archived at:
  `/Users/ryanz/brand-assets/maison-tanneurs/_audits/2026-05-28-product-source-folders.tsv`
- Select/wire exact existing shots before generating:
  - `atlas-briefcase-vintage`
  - `medina-crossbody-cognac`
  - `vintage-satchel-light-brown`
- `woven-leather-backpack` is resolved from Drive:
  `usable product pics/woven-leather-backpack` now contains canonical
  `woven-leather-backpack-pdp-01.webp` through `-09.webp` files, staged at
  `/Users/ryanz/brand-assets/maison-tanneurs/_upload-ready/2026-05-28-woven-leather-backpack`,
  uploaded to Supabase Storage `products/drop-02/`, and wired to the live row.
- `atlas-kilim-rucksack` is resolved from Drive:
  `usable product pics/atlas-kilim-rucksack` now contains canonical
  `atlas-kilim-rucksack-pdp-01.webp` through `-09.webp` files, staged at
  `/Users/ryanz/brand-assets/maison-tanneurs/_upload-ready/2026-05-28-atlas-kilim-rucksack-full`,
  uploaded to Supabase Storage `products/drop-02/`, and wired to the live row.
- `atlas-field-briefcase` was added as a separate product from
  `atlas-briefcase-vintage` after Ryan identified two different bags sharing the
  same naming family. Source:
  `usable product pics/atlas-field-briefcase`; staged at
  `/Users/ryanz/brand-assets/maison-tanneurs/_upload-ready/2026-05-28-atlas-field-briefcase`;
  uploaded to Supabase Storage `products/drop-02/`; live slug:
  `atlas-field-briefcase`.
- Stricter audit added:
  - `pnpm run audit:sources` lists all Drive/HF/supplier folders with 4+
    direct images.
  - `scripts/audit-assets.ts` now counts same-SKU PDP images from the actual
    gallery/JSON-LD instead of counting related-product card images.
  - `scripts/audit-assets.ts` now hard-fails raw/source gallery filenames and
    apparel-scope product catalogue leaks.
  - Supabase product image arrays were checked directly; mixed-product galleries
    are currently `0`.
- 2026-05-28 HF review: Ryan fixed several wrong-background single shots in HF.
  They are archived at
  `/Users/ryanz/brand-assets/maison-tanneurs/_hf-archive/review-2026-05-28-clean-bg-and-multishot`.
  Use them only after exact SKU mapping. They are mostly clean single fronts,
  not full multi-angle gallery packs.
- Upload-ready supplemental candidates were encoded and staged at:
  `/Users/ryanz/brand-assets/maison-tanneurs/_upload-ready/2026-05-28-thin-gallery`.
  They are not uploaded or wired yet because no real local Supabase service-role
  key was available for Storage upload:
  - `atlas-briefcase-vintage-pdp-03.webp`
  - `cognac-brogue-backpack-pdp-04.webp`
- Rejected this pass: agent-side fallback multishot generation for
  `medina-crossbody-cognac` produced collage/contact-sheet outputs, not separate
  PDP-safe angle images. Do not wire those files.
- Fixed this pass: `medina-crossbody-tooled-walnut` is now wired with 5 live
  PDP images after QA of existing Storage assets.
- Fixed this pass: collection filter overflow on desktop.
- Flagged this pass: several visible PDP/gallery black-frame artifacts are
  baked into exported product imagery. Replace those with clean finished HF
  exports instead of using raw/source files or heavy CSS masking.
- Fixed this pass: launch-facing atelier copy no longer misplaces Tannerie
  Chouara in Marrakech. Site copy now separates Moroccan/Fez tanning heritage
  from the Marrakech finishing atelier.
- Fixed this pass: atelier dossier now says `Marrakech, Morocco` instead of
  ambiguous `Marrakech, MA`.

## Next Fix

1. Visually map exact Drive/HF 9-shot folders for thin-gallery SKUs before
   generating anything.
2. Continue resolving the remaining thin-gallery SKUs from existing HF/Drive
   folders before generating anything new.
3. For any future multi-angle HF generation, require one separate output per
   angle. Reject grids/collages even if the product identity is correct.
