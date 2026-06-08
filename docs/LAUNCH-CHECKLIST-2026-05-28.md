# Maison Tanneurs Launch Checklist — 2026-05-28

> **SUPERSEDED 2026-06-08** — see `docs/LAUNCH-STATE-2026-06-08.md`. The
> verdict is now READY for soft, paid Meta, and feed/marketplace. References
> to `/about` are stale (renamed to `/atelier`). The "thin galleries"
> non-blockers listed below were either filled or are out-of-scope for
> launch.

Current production:

- Domain: `https://maisontanneurs.com`
- Deployment: `dpl_2SLdGzepWPyNwjDQoaYPRYYonnHx`
- Production URL: `https://maisontanneurs-7gvoesots-haddaoui.vercel.app`
- Supabase project: `xbtabpurfavngwmwtawc`

Scope correction from Ryan: launch is bags and small leather goods only. Do not
add jacket, clothing, outerwear, apparel navigation, or apparel campaign copy.

## Launch Checklist Status

| Requirement | Status | Evidence |
| --- | --- | --- |
| Homepage complete | Pass | Full-bleed cinematic hero, featured product/editorial sections, craft/story sections, newsletter/footer. Mobile and desktop smoke screenshots checked. |
| Product catalogue complete enough for launch | Pass with non-blocking gallery polish | Live storefront has 24 visible products, 0 zero-image products, 0 risky hero images, 0 raw/source gallery images, 0 apparel scope leaks, 0 missing PDP-white/clean product heroes, 0 mixed-product galleries. |
| Navigation working | Pass | `SITE_URL=https://maisontanneurs.com pnpm audit:links` checks 73 internal links. |
| Product family filters working | Pass | Public filters expose Backpack, Briefcase, Crossbody, Duffle, Messenger, Rolltop, Saddlebag, Satchel, Tote, Weekender. Supabase categories were cleaned from legacy `Leather Goods`. |
| PDP quality | Pass | PDPs use large imagery, thumbnail gallery, product details, materials, dimensions, shipping/returns, related products, and add-to-cart. LCP hero image priority warnings addressed. |
| Cart/checkout path | Pass to payment-token boundary | Add-to-cart, cart drawer, checkout page, server-side product validation, and Revolut order-token flow smoke-checked. Do not enter card details without a planned test SKU. |
| Mobile QA | Pass | Hero headline no longer clips, cookie banner no longer overflows, collection/product/PDP/cart views render without horizontal overflow in checked smoke tests. |
| SEO metadata | Pass | Canonicals, product metadata, product JSON-LD, sitemap/robots, favicon/logo verified in build/public checks. |
| Legal/footer links | Pass | Shipping, returns, terms, privacy, care, FAQ, contact routes return 200. |
| No public test/debug content | Pass | `audit:public` checks hidden SKUs, internal admin routes, stale copy, and clothes/jacket overclaims. `audit-assets` also checks visible product records for apparel-scope leakage. |
| No broken links | Pass | Public link audit passes against production. |
| Performance baseline | Pass | Production build passes; LCP image priority fixes applied to collection/PDP; no current hard audit failure. |
| Product media consistency | Launch-pass, improve next | Main product heroes and galleries are clean from raw/source filenames. Three visible products have thin galleries but no hard media blocker. |

## Current Verification Commands

```bash
SITE_URL=https://maisontanneurs.com pnpm audit:launch
pnpm build
```

Latest known `audit:launch` result:

- Public routes/content: passed.
- Public links: passed.
- Product media: hard media priorities `0`.
- Product media guardrails: raw/source gallery images `0`; apparel scope leaks `0`.
- Product source inventory: 61 folders with 4+ direct images, 54 likely
  complete 8/9-shot folders.

## Remaining Product Media Polish

Do not generate by default. First search Google Drive and Higgsfield visually.
Folder names are not product truth.

Raw screenshots, Oussam uploads, and supplier/source files are reference-only.
They are useful for matching the bag, but they are not launch PDP images. Wire
only HF-improved final product shots or confirmed finished Drive multishots.
If a raw/source file is accidentally staged, move it to
`/Users/ryanz/brand-assets/maison-tanneurs/_rejected-reference/raw-screenshot-sources/<slug>-<date>/`.

Thin visible galleries:

- `atlas-briefcase-vintage` — 2 live same-SKU images. Need exact existing
  HF/Drive 9-shot set or targeted fallback generation only after visual search fails.
- `medina-crossbody-cognac` — 2 live same-SKU images. Need exact plain
  HF-improved crossbody shots; reject raw screenshots, tooled, tassel,
  extra-pocket, or changed-closure variants.
- `vintage-satchel-light-brown` — 2 live same-SKU images. Need exact vertical
  satchel shots; reject structured buckle satchels, briefcases, or messengers.
- `black-stitched-backpack` and `classic-cognac-satchel` — launch-acceptable
  live galleries. Archive exact finished source folders when found.

Resolved and do not regenerate:

- `atlas-field-briefcase`
- `atlas-kilim-rucksack`
- `cognac-brogue-backpack`
- `woven-leather-backpack`
- Any product already reporting 9 same-SKU live PDP images unless visual QA
  rejects a specific shot.

## Assets Needed From Ryan/Rocco

Only if not already found in Drive/HF:

1. Exact 9-shot set for `atlas-briefcase-vintage`.
2. Exact 9-shot set for `medina-crossbody-cognac`.
3. Exact 9-shot set for `vintage-satchel-light-brown`.
4. Optional source-folder archive match for `black-stitched-backpack`.
5. Optional source-folder archive match for `classic-cognac-satchel`.

Use HF's bundled 9-shot product option when generation is truly required. Do
not generate one angle at a time, and do not accept grids/contact sheets as PDP
images.

## Launch Decision

The public website is launchable from a UI/UX, route/link, category, checkout
path, and hard product-media standpoint. The remaining work is catalogue polish:
deepen a few PDP galleries from existing HF/Drive assets without wasting
credits or mixing wrong products.
