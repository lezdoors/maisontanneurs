# Codex hostile final launch audit — Maison Tanneurs — 2026-06-08

You are Codex running a hostile launch audit for Maison Tanneurs. You are not here to be nice. You are trying to prove the site is NOT launch-ready before tomorrow.

Repository:
`/Users/ryanz/kechken`

Canonical product image source of truth:
`/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/usable product pics`

Public live domain:
`https://maisontanneurs.com`

Context to verify, not trust:
Claude reported launch-ready with 17 commits on main, 32/32 visual checks, green build, green launch gate, cart smoke clean, public audit clean, links audit clean, image contract clean, and no personal Gmail leaks. Do not believe it until you verify independently.

Hard rules:
- Do not change app/source code.
- Do not deploy.
- Do not push.
- Do not run destructive commands.
- You may run read-only commands, builds, tests, audits, browser/Playwright checks, curl, git inspection, and write exactly one final audit report file.
- You may create temporary files/screenshots under `audits/launch-readiness/codex-final-audit-2026-06-08/` if useful.
- Final report path must be:
  `audits/launch-readiness/codex-final-audit-2026-06-08.md`

Audit mission:
Find any real blocker that would embarrass Maison Tanneurs tomorrow: wrong images, broken checkout entry, bad mobile header, empty page, wrong/private email, placeholder copy, broken route, bad metadata, invisible products, inconsistent product cards, wrong hero image order, stale internal company info, or misleading launch claim.

Required checks:

1. Git/current-state sanity
- Confirm current branch and latest commits.
- Confirm dirty/untracked state and whether the report is auditing main as-is or a dirty local working tree.
- If dirty files are present, list them and classify risk.

2. Build and static verification
Run and record exact results for available relevant commands. At minimum:
- `pnpm build`
- `git diff --check`
- `pnpm tsc --noEmit` if available / valid
- `pnpm audit:public` if present
- `pnpm audit:links` if present
- `pnpm audit:image-contract` if present
- `pnpm verify:launch-gate` if present
- `node scripts/cart-smoke.js` if present
- `node scripts/visual-launch-audit.js` if present
Do not fake outputs. If a command is unavailable, say unavailable and show why.

3. Public/private info audit
Search source-visible app areas for personal/private/operator info.
Must include at least:
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
- `Rocco`
- `Supabase`
- `Airtable`
- `Revolut` in public copy contexts
- `Resend` in public copy contexts
Distinguish allowed internal scripts/docs/audits from public app/components/lib/public metadata pages. The launch risk is public exposure.

4. Route/content audit
Inspect rendered or source for these routes:
- `/`
- `/products`
- at least 5 representative PDPs, including the slugs Claude named: cognac brogue, atlas field, noir, marrakech tote, heritage if they exist
- `/atelier`
- `/boutique`
- `/bespoke`
- `/trade`
- `/contact`
- `/checkout/pay`
- privacy, terms, shipping, returns
For each: no placeholder, no empty important sections, no wrong brand, no broken link, no private email, no missing visible image, no horizontal overflow, no console/page errors.

5. Header/nav/mobile audit
Verify desktop and mobile visually or through browser automation:
- header not clipped
- wordmark/logo stable
- cart/nav usable
- no mobile overflow
- no jumpy broken header over hero
- routes linked correctly

6. Product image/hero audit
Independently verify visible products:
- Count visible product cards.
- For every visible product, find PDP route and primary image.
- Confirm Hero-first contract where possible against Drive `Hero-*` source.
- Confirm image paths are not random/legacy/supplier/DL/prototype sources.
- Confirm product cards have continuous clean white plate: no cream gradient, no dark hairline, no polaroid frame.
- Confirm product images are similarly sized/cropped. If inconsistent, name slug and issue.
- Identify every product still needing upscaling, re-export, background cleanup, or Drive canonical Hero cleanup. Include reason.

7. Metadata/feed/sitemap audit
Check:
- site title/description sane
- og:image/twitter image returns 200
- sitemap routes return 200
- product feed returns expected items and no hidden/test products
- robots does not block launch
- llms files if present do not contain stale/private info

8. Cart/checkout smoke
No real payment. Verify:
- add to cart works
- drawer or cart state shows correct product title/image/price
- checkout CTA exists
- checkout entry does not show wrong email/private info
- no console/page errors

9. Visual QA
Use screenshots or browser automation if available. At minimum inspect desktop and mobile for:
- home
- products
- one PDP
- atelier
- contact
- checkout/pay
Look specifically for product visibility, product card background, header, footer, empty content, obvious layout breaks.

Final report requirements:
Write `audits/launch-readiness/codex-final-audit-2026-06-08.md` with:

- Verdict: READY or NOT READY
- What exact tree was audited: branch, commit, dirty state
- Commands run + exact pass/fail summary
- Routes checked
- Evidence of visual checks/screenshots if any
- Launch blockers, if any
- Non-blocking polish
- Product images needing upscale/re-export/background cleanup/Drive Hero cleanup
- Public/private info findings
- Product catalogue findings
- Metadata/feed findings
- Cart/checkout findings
- Diff risk assessment
- Can this be merged/deployed tomorrow? yes/no and why

Be strict but fair. Do not invent blockers. Do not wave away real blockers. If all checks pass, say READY, but only after real verification.
