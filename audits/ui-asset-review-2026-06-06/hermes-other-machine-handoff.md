# Maison Tanneurs Hermes handoff — other machine

> **STATE NOTE 2026-06-08** — this handoff was a point-in-time snapshot. The
> claim "`/atelier` route 404s" is no longer true (atelier is the canonical
> route as of 2026-06-07; `/about` is the redirect). Editorial decisions
> recorded here remain useful context for the other machine. See
> `docs/LAUNCH-STATE-2026-06-08.md` for current launch verdict.

Date: 2026-06-06
Prepared from Ryan’s active Hermes session on `/Users/ryanz/kechken`.

Use this as the starting context for Hermes/Claude Code on the other machine.

## Who / operating style

- User: Ryan Naoufal Haddaoui, founder/CEO in Morocco.
- Assistant role/nickname: Amghar, Ryan’s bras droit for supervising Codex/Mouha/Claude Code and recurring failures.
- Ryan prefers concise, structured, calm, technical responses. No fluff after misses; propose corrective action.
- Priorities: revenue, conversion, product quality, customer trust, automation, reliability, scalability, speed.
- Cost-conscious: prefer cheap/free ops.
- Ping Ryan in Telegram when a deploy completes.

## Brand boundaries

Ryan currently runs multiple brands; keep them separate.

### Maison Tanneurs

- Active business for this task.
- Leather bags.
- Default active brand in `/Users/ryanz` workspace.
- Canonical storefront repo on this machine: `/Users/ryanz/kechken`.
- GitHub workstream on this machine: `https://github.com/lezdoors/maisontanneurs`.
- Other-machine/Mac mini workstream: `https://github.com/lezdoors/Maison-Tanneurs-luxury`.
- Strategic idea is shared across both repos: premium leather commerce, restrained luxury, craft proof, product clarity, Moroccan world-building.
- The repos do not need to be identical. Differences are expected in selected pictures/videos, layout, and UI design.

### Maison Izem / Maison Chapuis

- Maison Izem is a separate consumer brand: Moroccan home goods, live at `https://www.maisonizem.com`.
- Do not mix Izem assets/work into Tanneurs unless Ryan explicitly says so.
- Maison Chapuis is a separate ceramics-led brand. Do not push to legacy alternates.
- Rugs are the only legitimate cross-list between Izem and Chapuis.

## Canonical Maison Tanneurs paths

On Ryan’s main Mac:

- Storefront repo: `/Users/ryanz/kechken`
- Drive asset folder: `/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs`
- Product image source of truth: `/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/usable product pics`
- Meta launch assets: `/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/Maison-Tanneurs-Meta`

Do not scan all of `/Users/ryanz`, `~/Library`, `~/Downloads`, or Google Drive root. Narrow immediately to `/Users/ryanz/kechken` and the Maison Tanneurs Drive folder.

## Product media invariants

Critical:

- For product imagery, filename prefix `Hero-` is the mandatory primary image everywhere.
- PDP first image and catalogue card hero must remain the product source-of-truth hero.
- Never auto-select/reorder/crop/replace a product hero with a lifestyle/campaign image because it looks prettier.
- `kilim` / `pattern` means leather-framed woven textile panel bags, not embossed leather motifs.
- Product media decisions must be based on actual pixels/frames, not filenames.
- Preserve originals.
- Maintain source path → slug → role/surface handoff mapping.
- Avoid baked gray/cream/blue squares, wrong products, malformed handles, duplicate straps, watermarks, black/gray edge bars, stock/generic AI filler.

## Maison Tanneurs aesthetic direction

Target:

- QP editorial luxury + Aether architectural restraint.
- White `#FFF`, zero radius, quiet clear commerce.
- Marrakech craft/provenance.
- Product clarity first.
- Videos should feel like one commissioned film, not generic AI/stock.
- Preferred world-building: tennis, ryad, atelier, train/Moroccan route.
- Avoid fake boutique/showroom, generic souk, desert tourism, helicopter/yacht, Cappadocia balloons, camels unless Ryan explicitly wants a more campaign/travel direction.

Do not use Lemaire/Loewe names publicly; describe the attributes instead.

## Airtable / data pipeline

Maison Tanneurs Airtable:

- Base: `appaynUdHhSKiK76i`
- Token lives in env as `AIRTABLE_API_KEY`; do not print/share secrets.
- Sync path: Airtable → `scripts/sync-airtable.ts` cron on Mouha every 15m → Supabase → `maisontanneurs.com`.

## Current local repo state on this machine

Repo: `/Users/ryanz/kechken`
Branch: `claude/hero-section-trim-2026-06-06`
Local dev was running at: `http://localhost:3027`

Recent commits on branch:

- `2868438 feat(about): atelier gallery — 3 craft-proof videos replace weak tiles`
- `9692af8 fix(grid): kill catalogue-tile square-within-square via inline padding=0`
- `48f0056 fix(about): remove black wrapper around InTheirHands portrait video`
- `187d441 feat(homepage): ArtisanDossier plate → BLK&white atelier HD per Hermes`
- `2a532d0 feat(homepage): replace AtelierOrigin 3 images per Hermes Section 3`
- `dcebcc7 feat(homepage): replace duplicate HeritageJournal images per Hermes asset map`
- `d7910bf feat(hero): 3-asset rotator (train → medina → berber)`
- `4f30c11 feat(storefront): hero still, mobile cookie stacking, clean product frames`

Untracked audit folders on this machine:

- `/Users/ryanz/kechken/audits/product-media-system/`
- `/Users/ryanz/kechken/audits/ui-asset-review-2026-06-06/`

Important: the branch is local unless Ryan/Claude pushes it. Confirm before push/deploy.

## Asset review artifacts created in this session

Primary review directory:

`/Users/ryanz/kechken/audits/ui-asset-review-2026-06-06/`

Important files:

- `asset-placement-map.md` — main placement decision map.
- `claude-code-handoff.md` — initial Claude Code homepage implementation handoff.
- `claude-code-next-fixes.md` — follow-up fixes for product grid and `/about#atelier`.
- `asset-inventory.csv` — original 145-asset inventory.
- `material-asset-inventory.csv` — newer materials inventory.
- `hermes-other-machine-handoff.md` — this file.

Contact sheets:

- `contact-sheets/lifestyle-all-contact.jpg`
- `contact-sheets/atelier-all-contact.jpg`
- `contact-sheets/videos-midframes-contact.jpg`
- `contact-sheets/lifestyle-shortlist.jpg`
- `contact-sheets/atelier-shortlist.jpg`
- `contact-sheets/videos-candidate-3frames.jpg`
- `contact-sheets/full-grain-leather-contact.jpg`
- `contact-sheets/waxed-linen-thread-contact.jpg`

New material folders Ryan added in Google Drive:

- `/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/Full-grain leather`
- `/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/Waxed linen thread`

These were inventoried and contact sheets were generated, but final placement decisions may still need to be written into the map.

## Homepage editorial state after recent Claude Code passes

Claude reported final homepage editorial slots:

- Hero slide 1: `30 Hero-model-train-HD.png` — accepted.
- Hero slide 2: `Traveler_and_artisan_in_medina_…mp4` — cropped clean, accepted.
- Hero slide 3: `Berber-dunes-bag-HD.png` — accepted by Ryan/Claude, though earlier Hermes map treated desert as caution; use Ryan’s latest acceptance as current for this branch.
- AtelierOrigin main: `52 leather-table-atelier.png` — material proof.
- AtelierOrigin small 1 / small 2: `50 hands-leather work-HD.png` or related craft close-ups — cutting/hand-stitch proof.
- ArtisanDossier plate: `02 BLK&white atelier HD.png` — accepted.
- FieldLoop video: `Marrakech Train Window : Traveler.mp4` — cropped, accepted.
- HeritageJournal Travel: `Model-rooftop-table-HD.png` — accepted.
- HeritageJournal Bench: `Detail-hands-brass-clasp-cognac-handbag.png` — accepted.
- HeritageJournal Edition: `atelier-lineup.webp` — unchanged/accepted.

Catalogue grid untouched semantically.

## /about and atelier page notes

`/atelier` route 404s in this repo. The active atelier/about page is:

- `http://localhost:3027/about#atelier`

Ryan requested using these videos on `/about#atelier` with existing good atelier images:

- `/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/Maison Tanneurs videos/Traveler_and_artisan_in_alleys_202606051727.mp4`
- `/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/Maison Tanneurs videos/Bag-terrace-light-shift-9x16.mp4`
- `/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/Maison Tanneurs videos/Hands at Work.mp4`

Claude committed this as:

- `2868438 feat(about): atelier gallery — 3 craft-proof videos replace weak tiles`

Weak/about-gallery targets Ryan wanted replaced:

- man/model walking with backpack
- Berber/desert seated image
- sofa model image
- olive courtyard walking model if needed

Keep/use:

- leather table / stacked hides / cut panels
- hand stitching / awl detail
- real workshop/bench/cutting scenes
- B&W ArtisanDossier plate

Candidate Ryan mentioned:

- `/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/Maisom TanneursLifestyle images/Model-tenniscourt-clouds-hd.png`

Assessment:

- Good luxury/world-building image.
- Not atelier/craft proof.
- Better for homepage/world/tennis, not `/about#atelier` craft proof.

## Product grid square-within-square issue

Ryan noticed product cards had:

- cream outer square
- white product image square inside
- bag inside that

Ryan wanted clean bag-on-white only.

Fix committed:

- `9692af8 fix(grid): kill catalogue-tile square-within-square via inline padding=0`

Relevant files/classes:

- `components/store/ArchitecturalGrid.tsx`
- `app/globals.css`
- `.mt-product-frame`
- `.mt-ratio-portrait`
- `.mt-product-img-standard`
- `lib/product-image-presentation.ts`

Acceptance: product cards should read as one clean white plate, no cream rectangle behind a smaller white image square, while object-contain and product hero ordering stay intact.

## Video/artifact cautions

Some videos showed lower-right Veo/generated marks in contact sheets. Crop/export clean before public use, then browser-verify. Do not rely only on file names.

Caution clips from earlier review included:

- `Hands at Work.mp4`
- `Leather_grain_texture_slow_rake_202606051331.mp4`
- `Here_s_what_I_m_using_This_wa.mp4`
- `model-tennis-leather bag.mp4`
- `Woman_with_leather_bag_mountains_202606051120.mp4`

Use only if clean in rendered viewport.

## Recommended verification before push/deploy

From `/Users/ryanz/kechken`:

1. `git status --short`
2. `pnpm lint` or targeted eslint if full lint is slow.
3. Typecheck command used in repo, e.g. `pnpm tsc --noEmit` if script exists.
4. `pnpm tsx scripts/audit-catalogue.ts`
5. Start dev: `pnpm dev -p 3027`
6. Browser-check:
   - homepage hero slides
   - “The departure” grid for product plate cleanliness
   - full catalogue grid if applicable
   - `/about#atelier` videos and gallery
   - mobile viewport
7. Check actual image/video decoding, not just DOM. Scroll target cards into view; verify `complete`, `naturalWidth`, `naturalHeight`, `currentSrc`, and visual viewport.

Do not push/deploy without Ryan’s explicit approval.

## What to tell Hermes/Claude on other machine

Do not ask the other repo to blindly copy this repo. Ask it to absorb the direction:

- same brand idea
- same asset quality bar
- same product hero invariant
- same craft/world-building hierarchy
- but allow different UI/layout/images as long as it stays restrained, product-clear, and conversion-oriented.

Best other-machine prompt:

“Read this handoff. Use the Maison Tanneurs visual system and product invariants, but don’t force your repo to match `/Users/ryanz/kechken` exactly. Keep product Hero-* images as source-of-truth. Use real pixels/contact sheets for image decisions. Prioritize product clarity, craft proof, and restrained Moroccan world-building. Avoid fake boutique/showroom, generic desert/souk, watermarks, and double-background product plates. Verify in browser before claiming done.”
