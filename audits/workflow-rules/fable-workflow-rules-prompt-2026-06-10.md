# Claude Fable 5 Prompt — Improve Maison Tanneurs Workflow Rules

You are Claude Fable 5. You are being used because your judgment is expensive but higher-quality, so spend it carefully. Do not wander into redesigning the website. Your job is to improve the workflow rules/instructions that govern future agents working on Maison Tanneurs, especially product images, Drive cleanup, Supabase/Airtable sync, launch checks, and preventing repeated wrong-image mistakes.

Repository:
`/Users/ryanz/kechken`

Production site:
`https://maisontanneurs.com`

Read first:
- `AGENTS.md`
- `docs/PRODUCT-IMAGE-SOURCE-OF-TRUTH.md`
- `scripts/audit-hero-source-of-truth.ts`
- `scripts/audit-catalogue.ts`
- recent audit output: `audits/product-media-system/hero-source-of-truth-2026-06-10.md`

Context:
Maison Tanneurs product photography has been cleaned up. Ryan removed duplicate bags that had different names, cleaned the product folders, and upscaled hero/product images. The current canonical product source is now the Google Drive folder:

`/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/usable product pics`

Cleaned product folders may use product-ID prefixes such as:
`MT-MS-002__atlas-field-briefcase`

Upscaled hero files may use `-HD`, such as:
`Hero-atlas-field-briefcase-HD.png`

Treat those as canonical when they live inside `usable product pics`. Do not fall back to old duplicate aliases, old prototype folders, Downloads, old public assets, supplier screenshots, Higgsfield scratch outputs, `_merged`, or random Supabase objects.

Hard product-image rule:
- Real commerce product photography must come only from `usable product pics`.
- Each sellable product maps to one cleaned product folder there.
- The approved `Hero-*` file is mandatory first image.
- Drive `Hero-*` must become/validate against Supabase Storage `products/drop-02/{slug}-pdp-white.webp`.
- That URL must be first in Supabase `products.images[0]`, Airtable `Products.Images[0]`, product cards, PDP, feed, and marketplace main image.
- Supabase Storage is delivery/cache only, not source truth.
- If Supabase conflicts with Drive, rules should tell agents to fix Supabase/Airtable to Drive, not choose the existing Supabase image.
- If a folder has no Hero, multiple active Heroes, unclear product identity, or missing Airtable/Supabase mapping, report it as blocked/ambiguous; do not guess.

Brand/operating standard:
Maison Tanneurs is a European luxury leather house with Marrakech atelier provenance. Keep rules launch-operator focused: product accuracy, conversion, trust, clean white commerce, no AI-looking drift. Avoid Moroccan tourist/souk clichés, generic AI luxury, fake boutique imagery, cream product mats, and random generated product replacements.

Your task:
Improve the workflow rules so future agents stop repeating mistakes and can work faster without Ryan correcting them.

Specifically:
1. Audit `AGENTS.md` for ambiguity, contradiction, stale language, or instructions that still let agents choose wrong images.
2. Audit `docs/PRODUCT-IMAGE-SOURCE-OF-TRUTH.md` for missing edge cases now that folders are cleaned/upscaled.
3. Audit the hero/catalogue audit scripts conceptually: do the rules they enforce match the written rules? If not, propose precise small patches.
4. Find any older docs that could mislead future agents into using old/generated/supplier/Downloads assets. Do not rewrite the whole repo. Add top-of-file hard-stop warnings only where truly high-risk.
5. Improve instructions for expensive-model handoffs: what should Fable/Claude/Codex read first, what they must not touch, what checks they must run, and when they must stop instead of guessing.
6. Make the smallest useful edits. Prefer clear, durable rules over long prose.

Constraints:
- Do not modify product images.
- Do not rename, move, delete, or overwrite Google Drive assets.
- Do not push, deploy, merge, or run production deployment.
- Do not touch checkout, tracking, feeds, legal, or Supabase schema unless only documenting rules.
- Do not broaden into redesigning the storefront.
- Avoid creating a huge policy document that nobody will read. Improve the existing instruction graph.

Recommended changes to consider:
- Add a short “Current cleaned Drive naming” section to agent rules.
- Make product-ID prefixes and `-HD` heroes first-class in the rules.
- Add an explicit “do not resurrect old aliases” rule.
- Add an “expensive model preflight” checklist.
- Clarify the difference between commerce product images vs editorial/atelier/ad creative.
- Clarify that audit warnings for reserved/test rows should not block launch, but warnings for available/featured products need resolution or explicit Ryan acceptance.
- Ensure `pnpm audit:hero`, `pnpm audit:image-contract`, `pnpm audit:catalogue`, `pnpm exec tsc --noEmit --pretty false`, and `git diff --check` are the standard verification set.

Verification to run after edits:
```bash
cd /Users/ryanz/kechken
pnpm audit:hero
pnpm audit:image-contract
pnpm audit:catalogue
pnpm exec tsc --noEmit --pretty false
git diff --check
```

Output/report format:
- Files changed
- Exact rules improved
- Any stale docs quarantined
- Commands run and pass/fail results
- Remaining risks or decisions Ryan must make
- Do not claim the website is launch-ready unless you also browser-QA `/`, `/products`, and one PDP.

Remember: the goal is not more bureaucracy. The goal is to make future agents choose the right product images, respect the cleaned Drive source, and stop wasting expensive model time rediscovering the same rules.
