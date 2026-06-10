<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Workflow Discipline (apply BEFORE any asset/folder work)

This rule applies to every agent and every machine in the fleet (Turbo, Rocco,
Fury). It exists because we kept rebuilding `find`/`ls`/Python orientation
pipelines from scratch every time we hit a messy asset folder, and that ad-hoc
discovery is what shipped the wrong-product / wrong-background images.

The sequence — non-negotiable on asset/folder work:

1. **`/graphify <path>`** — first move. Builds a knowledge graph of the folder
   in one pass. Surfaces naming patterns, SKU prefixes, file format mix,
   variants vs canonicals. Use this before you grep, before you write a
   Python loop, before you assume folder structure. If `graphify-out/` already
   exists in CWD, `/graphify query "<question>"` reuses the cache.
2. **Contact sheet** — for any image batch (one frame per file laid out so
   the eye can compare). Don't decide which file is canonical from filenames
   alone.
3. **Inspect pixels** — sample corners + center; check alpha channels;
   verify the bag matches the slug visually.
4. **Map** — `source file → visual product → canonical slug → role/surface
   → notes`. Required for non-trivial batches.
5. **Edit surgically** — smallest safe change; preserve originals; never
   destructive-move source.
6. **Verify** — local audit (`pnpm audit:image-contract` for image work),
   typecheck, browser-check after deploy.
7. **Handoff** — concise note of what was inspected, changed, verified,
   blocked. So the next agent on the next machine doesn't rediscover state.

## Graphify install (run once per machine)

```bash
# Clone the canonical repo + install CLI via pipx
git clone https://github.com/safishamsi/graphify.git ~/graphify
brew install pipx 2>/dev/null
pipx install ~/graphify          # local path — avoids the PyPI typosquat flag
pipx ensurepath                  # adds ~/.local/bin to PATH

# Register the slash command in Claude Code
~/.local/bin/graphify install    # writes ~/.claude/skills/graphify/SKILL.md
                                 #   + ~/.claude/CLAUDE.md trigger
```

Verify with `which graphify` → `~/.local/bin/graphify`, and `/graphify --help`
in Claude Code.

## When NOT to run /graphify

- Single-line CSS/copy tweaks, typo fixes.
- Familiar repo work where the structure is already in head/memory.
- Image generation (use Higgsfield), background removal (use rembg/remove.bg),
  PDF/article writing (Graphify reads & maps, doesn't author).

# Maison Tanneurs Operating Rules

This repo is Maison Tanneurs. Keep the work scoped to Maison Tanneurs unless the user explicitly redirects.

Canonical asset folder:

`/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs`

Primary product image source:

`/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/usable product pics`

Meta launch asset folder:

`/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/Maison-Tanneurs-Meta`

HARD PRODUCT IMAGE SOURCE RULE:

- Full durable contract: `docs/PRODUCT-IMAGE-SOURCE-OF-TRUTH.md`.
- For any commerce/product surface, the ONLY allowed source of real product photography is:
  `/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/usable product pics`
- Product cards, PDP heroes, PDP galleries, marketplace feeds, launch catalogues, and product ads must trace back to a file inside the matching product folder there.
- The approved `Hero-*` file inside each product folder is mandatory primary media. It must remain first everywhere: Supabase `products.images[0]`, Airtable `Products.Images[0]`, storefront product cards, PDP first image, feeds, and marketplace main image.
- Do not choose a `scale`, `macro`, `pdp-04`, generated lifestyle shot, old Supabase object, Downloads file, prototype/public asset, supplier screenshot, Higgsfield scratch output, `_merged` file, or any non-Drive image ahead of `Hero-*`.
- Supabase Storage is a derived delivery/cache layer only. If Supabase conflicts with Drive `Hero-*`, fix Supabase to match Drive; do not treat the existing Supabase image as source of truth.
- If no matching Drive folder or `Hero-*` exists, report the SKU as blocked/ambiguous instead of filling the gap from old assets.

Media decision rule: never choose, rename, reorder, publish, or reject an image/video without inspecting the actual pixels/frames first. If you cannot view the asset, say that directly and stop before making visual claims. Use contact sheets for image batches and video frame sheets / direct video analysis for videos.

Treat folders named `dont use`, old Downloads mirrors, supplier-style images, and cross-brand assets as suspect. Do not use them for storefront, PDP, catalog, or ad launch work without explicit confirmation.

PRODUCT NAMING CONTRACT (2026-06-10, root-cause fix for the early rename mess):

- One physical product = one slug = one Drive folder `MT-XX-NNN__<slug>` (allowlist exception: `vintage-buckle-backpack-chocolate`).
- `-pdp` / `-scale` / `-macro` / `-hd` filename suffixes are FILE ROLES, never product identities. Never create a slug, Airtable record, or Supabase row from a role-suffixed filename.
- Product identity is decided from pixels (contact sheet / `/graphify`), never from filenames.
- Supabase is derived: rows exist only via Airtable → `scripts/sync-airtable.ts`. A Supabase-only row is a bug. Never seed or edit Supabase product rows directly.
- Full contract: Obsidian `00-Hermes/Maison Tanneurs Product Media Contract.md`.

# Product / Image / Video Organization System

For any task involving products, images, folders, product videos, ad creatives, or generated media:

1. Start from `usable product pics` above for product commerce images, not the broader Drive folder, Downloads mirrors, public assets, Supabase URLs, generated batches, or cross-brand folders.
2. Build an inventory before changing anything: product folder, candidate `Hero-*`, gallery images, video files, dimensions/duration when relevant, and suspected destination surface.
3. Inspect visually before deciding. For image batches, create a contact sheet or open representative files. For videos, extract/inspect key frames or run video analysis before judging quality or placement.
4. Group by visible product identity: silhouette, material, construction, colorway, hardware, and textile/kilim panels. Filenames are only hints.
5. Keep one canonical product folder per sellable product. Same product angles stay together; true separately sellable colorways get separate slugs.
6. Preserve originals. Copy/rename into clean working folders; do not destructively move or delete source assets.
7. Maintain a mapping table for non-trivial batches: `source file -> visual product -> canonical slug -> role/surface -> decision/notes`.
8. `Hero-*` is mandatory primary media. It stays first for homepage product modules, product cards, PDP, feeds, Airtable, and Supabase. A non-Hero first image is a bug, not a design option.
9. Videos must be assigned to a real surface and purpose: hero, PDP support, atelier proof, Meta ad, or reference-only. Do not dump generic AI clips into production.
10. Before claiming readiness, verify both asset state and rendered state: Drive/source folder, Supabase/catalogue row when relevant, repo wiring, and browser/live page.

Maison Tanneurs media vocabulary:

- `kilim` / `pattern` means leather-framed woven textile panel bags, not decorative embossing on plain leather.
- Prefer restrained architectural/editorial luxury: white commerce backgrounds for PDP/listing assets; warm Moroccan atelier/ryad/tennis/train world-building only for editorial/video/ad slots.
- Avoid fake boutique/showroom, generic AI luxury, tourist decor, malformed handles, duplicate straps, watermarks, baked gray/cream/blue squares, and stock-footage craft filler.

Agent handoff rule: if the task is not completed in one pass, leave a concise handoff in the repo or audit folder with what was inspected, what was changed, what was verified, and what remains blocked. Do not make the next agent rediscover visual/product state from scratch.

For launch readiness, verify the actual source of truth before making readiness claims: rendered storefront, Supabase/catalog state when relevant, Meta/account-side state when relevant, and live asset folders. Passing one gate does not clear the others.

# Vercel Cost / Production Deploy Rule

Vercel build minutes are expensive. Do not deploy to production, push to `main`, merge a PR that triggers production, or run `vercel deploy --prod` unless Ryan explicitly approves that specific production deploy. Default to preview branches/deployments for UI experiments and QA. Batch micro-fixes into one reviewed deploy instead of shipping every small hero/image/CSS/audit-script change separately. Keep alternate UI repos/projects preview-only unless Ryan says they should be production. Local verification and preview URLs are preferred until the final release window.

Do not run broad searches from `/Users/ryanz`. For repo code use `/Users/ryanz/kechken`; for assets use the canonical Maison Tanneurs Drive folder.

# Execution Style

Act as a senior software architect and launch operator.

Priorities:

1. Preserve working infrastructure.
2. Improve conversion and product quality.
3. Make the smallest safe change that moves launch forward.
4. Keep code modular, readable, and production-ready.
5. Avoid unnecessary rewrites, dependencies, and abstractions.

Before code changes:

- Understand the current structure and relevant files.
- Use the existing stack and local patterns.
- Do not replace checkout, catalog, tracking, Supabase, feeds, or launch scripts unless explicitly asked.
- For complex changes, provide a brief 2-3 step technical plan before editing.

UI standards:

- Premium luxury ecommerce.
- Mobile-first.
- Product-visible.
- Minimal, editorial, high-trust.
- Elegant typography and spacing.
- No generic AI design, gimmicks, excessive gradients, or visual noise.
- Custom assets should serve a specific section: hero, product, atelier proof, trust, or conversion.

Code standards:

- Edit only what is needed.
- Keep components modular.
- Do not reprint unchanged files.
- Prefer targeted patches over broad rewrites.
- Keep UI copy professional and concise.
- No emojis or casual UI text.

Architecture:

- Frontend: Next.js / React / Vercel.
- Backend and data: Supabase where applicable.
- Styling: Tailwind CSS / existing global design tokens.
- Product data, checkout, analytics, feeds, and launch validation are core infrastructure. Treat them as protected.

Current objective:

- Upgrade Maison Tanneurs UI/UX using the existing repo as the base.
- Improve homepage, collection page, and PDP for luxury feel, mobile experience, conversion, and customer trust.
- Borrow proven ecommerce patterns from strong reference sites without cloning blindly.

Known launch risks:

- Cookie banner blocks mobile experience.
- Homepage is too editorial before becoming shoppable.
- Hero needs stronger product visibility on mobile.
- Collection filters need mobile polish.
- Product sections need tighter hierarchy and faster purchase path.
