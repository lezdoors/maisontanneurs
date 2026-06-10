# Codex Final Launch Audit - Maison Tanneurs - 2026-06-08

## Verdict

NOT READY.

This is not a claim that production is broken. It is a strict launch-gate verdict against the tree I audited: the local working tree is dirty, the requested build/launch commands could not be reproduced through the package scripts in this sandbox, browser/cart visual checks could not run, and there is a real public policy inconsistency on returns.

## Tree Audited

- Repo: `/Users/ryanz/kechken`
- Branch: `main`
- HEAD: `406b202 Add Workflow Discipline section: /graphify first on any asset/folder work`
- Remote tracking: `main...origin/main`
- Dirty state: yes
- Audited state: dirty local working tree, not clean `main`

Modified files present before this report:

- `components/store/AtelierOrigin.tsx` - public homepage visual/copy change. Risk: medium, affects homepage proof section.
- `components/store/Navbar.tsx` - public header/nav change. Risk: high, affects desktop/mobile nav, cart access, search, locale display.
- `docs/LAUNCH-STATE-2026-06-08.md` - internal doc. Risk: low for public site.
- `lib/email.ts` - transactional email plumbing. Risk: medium, affects order/customer trust flows.
- `scripts/test-email.ts` - verification script. Risk: low for public site.
- `scripts/visual-smoke.spec.js` - verification script. Risk: low for public site, but impacts audit confidence.

Untracked state was large, including `audits/launch-readiness/`, product-media audit files, new scripts (`scripts/cart-smoke.js`, `scripts/visual-launch-audit.js`, `scripts/full-page-screenshots.js`, `scripts/normalize-product-hero.py`), `public/brand/editorial/model-red-bg-hd.webp`, and `test-results/`. Risk: medium because launch evidence and source assets are not cleanly separated from uncommitted work.

## Commands Run

Evidence logs are under `audits/launch-readiness/codex-final-audit-2026-06-08/`.

| Check | Result | Notes |
| --- | --- | --- |
| `git status --short --branch` | FAIL for launch cleanliness | Dirty local tree and many untracked files. |
| `git log --oneline -n 20 --decorate` | PASS | HEAD confirmed at `406b202` on `main`. |
| `git diff --check` | PASS | Exit 0, no whitespace errors. |
| `pnpm build` | FAIL | Fails in `prebuild` because `tsx` cannot create IPC pipe: `listen EPERM ... tsx-501/*.pipe`. |
| `pnpm tsc --noEmit` | INVALID | Did not run real compiler; pnpm printed "Already up to date". |
| `./node_modules/.bin/tsc --noEmit` | PASS | Exit 0, empty log. |
| `pnpm audit:public` | FAIL/blocked | `tsx` IPC `EPERM` before script execution. |
| `node --import tsx scripts/audit-public-site.ts` | FAIL/blocked | Shell DNS failed: `getaddrinfo ENOTFOUND maisontanneurs.com`. |
| `pnpm audit:links` | FAIL/blocked | `tsx` IPC `EPERM` before script execution. |
| `node --import tsx scripts/audit-public-links.ts` | FAIL/blocked | Shell DNS failed: `getaddrinfo ENOTFOUND maisontanneurs.com`. |
| `pnpm audit:image-contract` | FAIL/blocked | `tsx` IPC `EPERM` before script execution. |
| `node --import tsx scripts/audit-image-contract.ts` | PASS | 23 Drive heroes, 0 hover entries, 6 landing overrides audited; contract intact. |
| `pnpm verify:launch-gate` | FAIL/blocked | `tsx` IPC `EPERM`. |
| `node --import tsx scripts/verify-launch-gate.ts` | FAIL/blocked | It calls `pnpm -s build`, which fails on `tsx` IPC `EPERM`. |
| `node scripts/cart-smoke.js` | FAIL/blocked | Chromium launch blocked by macOS sandbox Mach-port permission. |
| `node scripts/visual-launch-audit.js` | FAIL/blocked | Same Chromium launch failure. No screenshots generated. |
| `node --import tsx scripts/audit-catalogue.ts` | FAIL | Reported 175 hard image failures across 22 SKUs from static fallback. Because shell network/DNS is restricted, treat as unresolved until rerun in normal network context. |
| `graphify <Drive product path>` | FAIL/blocked | Tried to write `graphify-out` inside Google Drive source folder; sandbox denied. |
| `graphify extract <Drive product path> --out ...` | FAIL/blocked | Still tried to write cache under Drive folder; sandbox denied. It did identify 683 images before failing. |

## Routes Checked

Source-reviewed:

- `/`
- `/products`
- `/products/cognac-brogue-backpack`
- `/products/atlas-field-briefcase`
- `/products/expedition-rolltop-noir`
- `/products/marrakech-tote-cognac`
- `/products/heritage-rucksack`
- `/atelier`
- `/boutique`
- `/bespoke`
- `/trade`
- `/contact`
- `/checkout/pay`
- `/legal/privacy`
- `/legal/terms`
- `/legal/shipping`
- `/legal/returns`
- `/llms.txt`
- `/llms-full.txt`
- `/feed/products.xml`
- `/sitemap.xml`
- `/robots.txt`

Public HTML verified through web fetch:

- `https://maisontanneurs.com/` returned public homepage content with title `Maison Tanneurs - Hand-stitched leather from Marrakech`.

Blocked:

- Deep public route fetches from shell failed due DNS/network restriction.
- Browser automation failed due Chromium sandbox permission failure.

## Visual Evidence

No browser screenshots were generated. Both shell Playwright and Node REPL Playwright failed at Chromium launch with:

`FATAL: base/apple/mach_port_rendezvous_mac.cc ... Permission denied (1100)`

Local image evidence generated:

- `product-hero-local-audit.log`
- `product-hero-dimensions.log`
- `node-audit-image-contract.log`

## Launch Blockers

1. Public return policy conflict.

   - Homepage `HousePromises` says `14 Days - Unworn`.
   - Legal returns, legal terms, FAQ, checkout page, atelier page, and llms copy say 30 days.
   - Files: `components/store/HousePromises.tsx`, `app/(store)/legal/returns/page.tsx`, `app/(store)/legal/terms/page.tsx`, `app/(store)/checkout/pay/page.tsx`, `app/(store)/atelier/page.tsx`, `app/llms-full.txt/route.ts`.
   - This is a customer-trust/legal ambiguity at purchase. It should be corrected before launch.

2. Launch gates were not independently reproducible from the requested commands.

   - Exact `pnpm build` failed.
   - Exact `pnpm verify:launch-gate` failed.
   - Exact `pnpm audit:public`, `pnpm audit:links`, and `pnpm audit:image-contract` failed through the package script path.
   - Root cause appears environment-specific (`tsx` IPC pipe blocked), but a hostile audit cannot mark launch ready when the required commands do not run.

3. Cart and visual smoke were not verified.

   - `node scripts/cart-smoke.js` and `node scripts/visual-launch-audit.js` both failed before navigation because Chromium could not launch.
   - This leaves add-to-cart, checkout drawer state, console errors, mobile header clipping, horizontal overflow, and rendered product card backgrounds unverified in this run.

4. Dirty local tree contains public source changes.

   - `Navbar.tsx` and `AtelierOrigin.tsx` are modified but uncommitted.
   - This means the audit is not against clean `origin/main`; it is against a local dirty launch candidate.

## Non-Blocking Polish

- `explorer-rolltop-cognac.webp` and `vintage-buckle-backpack.webp` are 1600x2000 while most hero files are 2400x2400. They should be re-exported/upscaled to the same 2400 square hero standard if possible.
- The desktop nav now uses an account-style icon linking to contact. This may be elegant, but it hides "Contact" behind an icon and should be visually verified on mobile/desktop before launch.
- Homepage `AtelierOrigin` changed from sketch/product-proof language to a red-wall model image. This may improve editorial feel, but it changes the proof section and was not browser-verified.

## Product Image Findings

- `DRIVE_HERO_BY_SLUG` has 23 entries.
- All 23 mapped `/products/hero/*.webp` files exist locally.
- Required named PDP slugs exist in the hero map:
  - `cognac-brogue-backpack`
  - `atlas-field-briefcase`
  - `expedition-rolltop-noir`
  - `marrakech-tote-cognac`
  - `heritage-rucksack`
- `node --import tsx scripts/audit-image-contract.ts` passed:
  - `DRIVE_HERO_BY_SLUG: 23 entries audited`
  - `HOVER_BY_SLUG: 0 entries audited`
  - `LIST_IMAGE_OVERRIDES: 6 entries audited`
  - `PASS - image override contract is intact`
- Product card code uses pure white catalogue frames:
  - `ProductCard` frame: `mt-product-frame mt-product-frame--catalogue`
  - `globals.css` comments explicitly state the old cream gradient/hairline plate was removed.
- Local pixel samples show white/near-white corners for hero assets.
- Need visual/browser confirmation for product card continuous white plate and image sizing; not verified due browser block.

Products needing image polish:

- `explorer-rolltop-cognac`: hero is 1600x2000, not 2400x2400.
- `vintage-buckle-backpack`: hero is 1600x2000, not 2400x2400.
- Static fallback Supabase gallery URLs need re-audit in a network-enabled environment because `node --import tsx scripts/audit-catalogue.ts` reported 175 image failures. I cannot classify those as true production 404s from this sandbox.

## Public/Private Info Findings

No public app/component/lib/public hits for:

- `ryanaoufal@gmail.com`
- `haddaoui.ops@gmail.com`
- `naoufal.h@gmail.com`
- `gmail.com`
- `@gmail`
- `@outlook`
- `ryanz`
- `/Users/ryanz`
- `Mouha`
- `Amghar`

Other findings:

- `Rocco` appears only in an internal comment in `lib/image-url.ts`, not public copy.
- `Supabase`, `Revolut`, and `Resend` appear in code and public legal/checkout disclosure contexts. This is acceptable for privacy/payment disclosure, not a private leak.
- `Airtable` did not appear in `app/components/lib/public`.
- Public contact emails are domain emails: `hello@maisontanneurs.com`, `wholesale@maisontanneurs.com`, `repair@maisontanneurs.com`.

## Product Catalogue Findings

- Static catalogue parsed: 24 products.
- 23 are `available` and `featured=true`.
- `medina-duffle` is `reserved` and `featured=false`.
- `HIDDEN_SKUS` includes `medina-duffle` plus other known suppressed SKUs.
- Collection, PDP, sitemap, feed, and llms routes all apply hidden/available filtering in source.
- Live Supabase state could not be independently verified from shell due network restriction.

## Metadata, Feed, Sitemap, Robots

- Root metadata is sane: title and description match Maison Tanneurs, with OG/Twitter image `/brand/editorial/cinematic-bag-still.webp`.
- `robots.ts` allows `/` and disallows `/_admin`, `/api/`, and `/checkout`. It does not block launch pages.
- `sitemap.ts` includes core pages and product paths from Supabase when available.
- `feed/products.xml` filters hidden SKUs and falls back to static products when Supabase is unavailable.
- `llms.txt` and `llms-full.txt` contain no private/operator info, but they repeat the 30-day returns policy, increasing the policy conflict with homepage `HousePromises`.
- Public shell checks for `og:image`, sitemap URL status, and feed URL status were blocked by DNS/network restriction.

## Cart/Checkout Findings

Source check:

- PDP `ProductDetails` has add-to-cart button.
- Cart drawer state is managed by `CartProvider`.
- `/checkout/pay` renders `CheckoutShell`.
- Checkout supports empty-cart, missing-key, error, and ready states.
- Checkout displays public domain fallback email `hello@maisontanneurs.com`, not personal email.
- Payment copy says Revolut/Apple Pay/Google Pay supported and card details do not touch servers.

Blocked:

- Add-to-cart runtime smoke not verified because Chromium could not launch.
- Checkout API/session creation not verified because shell network/environment is restricted.

## Header/Nav/Mobile Findings

Source check:

- Header is fixed and cart button is visible in source.
- Mobile drawer exists with primary links.
- Desktop primary nav links: Collection, Savoir-faire, Boutique, Bespoke, Trade.
- Contact is not in primary nav; desktop contact is an account-style icon linking to `/contact`.
- Mobile drawer does not include Contact in its primary list. Contact remains reachable through footer/source routes, but mobile nav discoverability is reduced.

Blocked:

- Header clipping, wordmark stability, cart usability, mobile overflow, and hero/header interaction were not visually verified because browser automation failed.

## Diff Risk Assessment

Current diff risk is medium-high for launch:

- `Navbar.tsx` changed substantially and is exactly the kind of file where mobile regressions hide.
- `AtelierOrigin.tsx` swaps a product sketch/proof image for `model-red-bg-hd.webp`, which is untracked and needs visual confirmation.
- `lib/email.ts` changed transactional email behavior; no live email verification was completed here.
- Verification scripts changed while this audit depends on verification.

## Can This Be Merged/Deployed Tomorrow?

No, not from this exact local state.

Minimum before deploy:

1. Resolve the returns policy conflict so all public surfaces say the same return window.
2. Commit or intentionally discard/ignore the dirty source changes so the launch tree is explicit.
3. Rerun `pnpm build`, `pnpm verify:launch-gate`, public/link/image audits, cart smoke, and visual launch audit in an environment where `tsx`, DNS, and Chromium are not blocked.
4. Visually verify mobile header/nav, product cards, one PDP, contact, atelier, and checkout/pay.

If those pass after the policy fix, the site can be reconsidered for launch.
