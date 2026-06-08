# Maison Tanneurs Létrange-Direction Rebuild Plan

> For implementation agents: work only in this branch/worktree. Do not touch `/Users/ryanz/kechken` main worktree. Use this as the source brief for Antigravity CLI once `agy` is available.

## Scope

Branch: `amghar/letrange-rebuild-home-collection-pdp`

Worktree: `/Users/ryanz/kechken-worktrees/letrange-rebuild`

Canonical production repo: `/Users/ryanz/kechken` / `lezdoors/maisontanneurs`

Reference/prototype repo: `/Users/ryanz/Maison-Tanneurs-luxury` is a technical/visual reference only. Do not copy commerce, env, deployment, or data-layer assumptions from it.

Rebuild these surfaces only:

1. Homepage `/`
2. Collection page `/products`
3. Product page `/products/[slug]`

Protected surfaces:

- Checkout/cart runtime
- Supabase/Airtable catalogue logic
- Product feed/sitemap/audit scripts
- Deployment config
- Billing/payment config
- Hidden SKU gates
- Hero image ordering contract

Stop before deleting files, changing deployment config, touching billing, or rewriting full architecture.

## Brand direction

Use Létrange Paris as a structural reference only:

- disciplined header/navigation hierarchy
- quiet editorial whitespace
- precise hairlines
- high confidence product presentation
- restrained motion
- luxury page rhythm

Do not copy Létrange brand language, Paris positioning, logo layout verbatim, or decorative luxury clichés.

Maison Tanneurs identity:

- Marrakech leather atelier
- provenance, bench, batch, material, road/world-building
- sharp zero-radius commerce
- white product surfaces
- editorial but shoppable
- calm, premium, conversion-safe

## Non-negotiable visual constraints

1. Product cards and PDP primary image must stay on continuous pure white `#fff`.
2. No cream gradient, no warm gray plate, no 1px polaroid/card frame around catalogue product photos.
3. Inspect both layers before claiming product image issues are fixed:
   - actual product image/export background
   - CSS wrapper/frame around the image
4. `Hero-*` product image contract stays mandatory. Do not reorder/crop/replace primary product media.
5. `kilim` / `pattern` means leather-framed woven textile panel bags, not plain leather motifs.
6. Mobile must make products visible quickly; do not make homepage purely editorial before commerce.
7. Avoid rounded SaaS cards, blobs, glassmorphism, bouncy effects, generic AI luxury copy, fake boutique/showroom imagery.

## Current key files to inspect

Homepage:

- `app/(store)/page.tsx`
- `components/store/Hero.tsx`
- `components/store/ArchitecturalGrid.tsx`
- `components/store/AtelierOrigin.tsx`
- `components/store/ArtisanDossier.tsx`
- `components/store/BatchGuarantee.tsx`
- `components/store/HousePromises.tsx`
- `components/store/HeritageJournal.tsx`

Collection:

- `app/(store)/products/page.tsx`
- `components/store/ProductCard.tsx`
- `components/store/CategoryFilter.tsx`
- `app/globals.css` product-frame rules

PDP:

- `app/(store)/products/[slug]/page.tsx`
- `components/product/ProductGallery.tsx`
- `components/product/ProductDetails.tsx`
- `components/product/CraftStory.tsx`
- `components/store/ProductCard.tsx` for related products

Header/shared shell:

- `components/store/Navbar.tsx`
- `components/store/Footer.tsx`
- `components/store/CookieBanner.tsx`
- `components/store/NavTransitionIndicator.tsx`

Reference/prototype to inspect, not blindly copy:

- `/Users/ryanz/Maison-Tanneurs-luxury/components/site-header.tsx`
- `/Users/ryanz/Maison-Tanneurs-luxury/components/site-hero.tsx`
- `/Users/ryanz/Maison-Tanneurs-luxury/components/hero-carousel.tsx`
- `/Users/ryanz/Maison-Tanneurs-luxury/app/globals.css`

## Implementation slices

### Slice 1 — Homepage rhythm and above-the-fold commerce

Goal: Make homepage feel editorial-luxury while still clearly shoppable.

Change only homepage-specific components unless a shared style token is unavoidable.

Target changes:

- Keep hero cinematic, but strengthen immediate route to collection.
- Reverse any aggressive endless zoom; prefer slow settle from `scale(1.02)` to `1.0`.
- Create a Létrange-like rhythm: hero → concise product edit → craft/provenance → product grid → trust/fulfillment → journal.
- Preserve existing real assets and alt text quality.
- Avoid adding new dependencies.

Verify:

- `/` desktop and mobile
- no console errors
- products visible by first meaningful scroll
- header/hero overlap remains stable

Commit message:

`feat: refine homepage editorial commerce rhythm`

### Slice 2 — Collection page discipline

Goal: Make `/products` feel like a luxury catalogue, not a template grid.

Target changes:

- Improve top collection intro hierarchy and whitespace.
- Preserve product visibility and filters/search.
- Keep card image surfaces pure white, no borders/cream frames.
- Tighten metadata: product family, Marrakech atelier, price/inspect affordance.
- Improve mobile filter rhythm without hiding purchase intent.

Verify:

- `/products` desktop and mobile
- DOM computed styles for `.mt-product-frame--catalogue` are `#fff`/transparent border where intended
- lazy images decoded after scroll
- no cream peeking around product photos

Commit message:

`feat: refine collection catalogue presentation`

### Slice 3 — PDP conversion hierarchy

Goal: Product page should feel premium and easier to buy.

Target changes:

- Keep gallery on pure white.
- Move product name, price, trust, CTA into a clearer hierarchy.
- Keep add-to-cart prominent on desktop and mobile.
- Simplify spec/craft sections into a luxury dossier rhythm.
- Preserve analytics events and cart behavior.

Verify:

- at least one representative PDP, e.g. `/products/atlas-weekender-cognac` or current available slug
- add-to-cart opens/updates cart
- sticky mobile CTA does not fight footer/cookie banner
- no JS console errors

Commit message:

`feat: refine product detail purchase hierarchy`

## Required verification after each slice

Run:

```bash
pnpm build
git diff --check
```

Browser QA routes:

- `/`
- `/products`
- one PDP from current product list
- mobile around 390px
- desktop around 1440px

For product image surfaces, run DOM checks before visual claims:

```js
(() => {
  const frame = document.querySelector('.mt-product-frame--catalogue');
  const body = document.body;
  return {
    bodyBg: getComputedStyle(body).backgroundColor,
    frameBg: frame ? getComputedStyle(frame).backgroundColor : null,
    frameBorder: frame ? getComputedStyle(frame).borderColor : null,
    img: frame?.querySelector('img') && {
      complete: frame.querySelector('img').complete,
      naturalWidth: frame.querySelector('img').naturalWidth,
      currentSrc: frame.querySelector('img').currentSrc,
      objectFit: getComputedStyle(frame.querySelector('img')).objectFit,
      opacity: getComputedStyle(frame.querySelector('img')).opacity,
    },
  };
})()
```

## Agent coordination rules

- One implementation agent per slice.
- Do not run another modifying agent while Antigravity is editing files.
- Human review/visual QA may happen in Antigravity IDE after a slice is committed.
- GitHub remains source of truth: branch, commit, PR/preview, then review.
- Report changed files, visual impact, risks, and next step after each slice.
