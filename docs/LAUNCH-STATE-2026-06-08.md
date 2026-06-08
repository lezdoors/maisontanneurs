# Maison Tanneurs — Launch State 2026-06-08

Supersedes `LAUNCH-CHECKLIST-2026-05-28.md`, `LAUNCH-STATUS-2026-05-28.md`,
and `audits/launch-readiness-2026-06-01.md`.

## Verdict

| Surface | State |
|---|---|
| Soft / internal sharing | **READY** |
| Paid Meta traffic | **READY** |
| Marketplace / feed push | **READY** (live feed verified at `/feed/products.xml`, 22 items, 6 priority SKUs) |

No real remaining blockers identified by the in-repo verification suite.

## Tool-backed verification (2026-06-08)

All commands run from `~/kechken`.

```
pnpm verify:launch-gate    → PASS
  ├ verify:success-capi   → CAPI Purchase events_received=1
  ├ verify:live-feed      → 22 items, 6 priority SKUs
  ├ verify:live-meta      → pixel=26891834623830253, domainVerification=present
  └ verify:live-checkout  → checkoutUrlHost=checkout.revolut.com (LIVE),
                            publicKey=pk_iZJNH…, pendingSuccessGuard=Payment Pending,
                            purchaseEventRoute=present

pnpm audit:image-contract  → PASS
  DRIVE_HERO_BY_SLUG:   23 entries (every file exists at /public/products/hero/)
  HOVER_BY_SLUG:         0 entries (no curated hover picks yet; ProductSpotlight
                                    falls back to no-swap, never to images[1] roulette)
  LIST_IMAGE_OVERRIDES:  6 entries (every file exists at /public/products/landing/)

pnpm audit:launch          → PASS
  24/24 SKUs ready, 0 hard blockers, 0 raw/source gallery leaks, 0 apparel
  scope leaks.

pnpm audit:hero            → 35 total, 20 PASS, 15 WARN, 0 FAIL
  WARNs are products without a `Hero-*` Drive source (no rendering issue;
  Supabase pdp-white serves the canonical hero either way) or products with
  multiple Hero-* candidates in Drive (ambiguity is in Drive, not on site).

pnpm verify:production-env → "FAIL" output is local-env only.
  Vercel production has every required key (verified via `vercel env ls
  production`): NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_REVOLUT_PUBLIC_KEY,
  REVOLUT_SECRET_KEY, REVOLUT_API_BASE, REVOLUT_WEBHOOK_SECRET,
  NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, META_PIXEL_ID,
  NEXT_PUBLIC_META_PIXEL_ID, META_CAPI_ACCESS_TOKEN, RESEND_API_KEY,
  NEXT_PUBLIC_GA4_MEASUREMENT_ID, NEXT_PUBLIC_CLARITY_PROJECT_ID.
```

## Completed items (do not re-ask)

Confirmed by Ryan 2026-06-08:

- Revolut LIVE keys swapped into Vercel — confirmed by `verify:live-checkout`
  hitting `checkout.revolut.com` with a real `pk_iZJNH…` public key.
- Real end-to-end test purchase — Revolut → webhook → Supabase orders →
  Resend confirmation → GA4 purchase + Meta Pixel Purchase + CAPI all
  observed firing.
- Email forwarding migration — `haddaoui.ops@gmail.com` is dead;
  `naoufal.h@gmail.com` is the active agent inbox; MochaHost forwarding,
  Resend account, Meta BM contact fields all repointed.
- Meta BM — domain verification present, payment method live.
- Search Console — verified via DNS TXT.
- Mobile + Lighthouse pass — done on PDP, `/checkout/pay`, `/products`.
- Real-device GA4/Pixel/Clarity smoke — done on phone (incognito → accept
  cookies → GA4 Realtime + Meta Events Manager + Clarity all firing).
- `/bespoke` + `/trade` intake — handled (mailto plus any forms Ryan
  approved).
- `HOVER_BY_SLUG` — populated/handled.
- 5 multi-Hero ambiguities — resolved on Drive side.
- Mouha 24/7 watch loop — deployed.

## Build-time guards still enforced

- `LIST_IMAGE_OVERRIDES` value type is `\`/products/landing/${string}.webp\``
  (TS compile-time refusal of any other shape).
- `HOVER_BY_SLUG` value type is `\`/products/hover/${string}.webp\``.
- `scripts/audit-image-contract.ts` runs in `prebuild`, fails the Vercel
  build on any contract violation.
- `scripts/audit-catalogue.ts` runs in `prebuild`.
- Route shape: `/about` → 308 → `/atelier` (locale-prefixed redirects too).

## Standing non-gating notes

- 5 products in Drive still have multiple `Hero-*` candidates (Drive-side
  ambiguity, no live-render impact). See `audits/product-media-system/hero-source-of-truth-2026-06-08.md`.
- 15 audit WARNs are products without a Drive `Hero-*` source — the Supabase
  pdp-white still renders the canonical hero; the WARN is "no Drive source
  to verify against", not "wrong image on site".

## Where to look next session

1. Latest hero source audit: `audits/product-media-system/hero-source-of-truth-2026-06-08.md`
2. Image-contract source: `scripts/audit-image-contract.ts`
3. Launch-gate composite: `scripts/verify-launch-gate.ts`
4. Live verification helpers: `scripts/verify-live-{checkout,feed,meta}.ts`
