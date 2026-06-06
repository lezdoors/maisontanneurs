<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Maison Tanneurs Operating Rules

This repo is Maison Tanneurs. Keep the work scoped to Maison Tanneurs unless the user explicitly redirects.

Canonical asset folder:

`/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs`

Primary product image source:

`/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/usable product pics`

Meta launch asset folder:

`/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/Maison-Tanneurs-Meta`

Use the approved `Hero-*` file inside each product's `usable product pics` folder when product imagery is needed, unless a current audit or user instruction says otherwise.

Media decision rule: never choose, rename, reorder, publish, or reject an image/video without inspecting the actual pixels/frames first. If you cannot view the asset, say that directly and stop before making visual claims. Use contact sheets for image batches and video frame sheets / direct video analysis for videos.

Treat folders named `dont use`, old Downloads mirrors, supplier-style images, and cross-brand assets as suspect. Do not use them for storefront, PDP, catalog, or ad launch work without explicit confirmation.

# Product / Image / Video Organization System

For any task involving products, images, folders, product videos, ad creatives, or generated media:

1. Start from the canonical asset folder above, not Downloads mirrors or cross-brand folders.
2. Build an inventory before changing anything: product folder, candidate `Hero-*`, gallery images, video files, dimensions/duration when relevant, and suspected destination surface.
3. Inspect visually before deciding. For image batches, create a contact sheet or open representative files. For videos, extract/inspect key frames or run video analysis before judging quality or placement.
4. Group by visible product identity: silhouette, material, construction, colorway, hardware, and textile/kilim panels. Filenames are only hints.
5. Keep one canonical product folder per sellable product. Same product angles stay together; true separately sellable colorways get separate slugs.
6. Preserve originals. Copy/rename into clean working folders; do not destructively move or delete source assets.
7. Maintain a mapping table for non-trivial batches: `source file -> visual product -> canonical slug -> role/surface -> decision/notes`.
8. `Hero-*` is mandatory primary media. It stays first for homepage/product cards/PDP unless Ryan explicitly overrides it.
9. Videos must be assigned to a real surface and purpose: hero, PDP support, atelier proof, Meta ad, or reference-only. Do not dump generic AI clips into production.
10. Before claiming readiness, verify both asset state and rendered state: Drive/source folder, Supabase/catalogue row when relevant, repo wiring, and browser/live page.

Maison Tanneurs media vocabulary:

- `kilim` / `pattern` means leather-framed woven textile panel bags, not decorative embossing on plain leather.
- Prefer restrained architectural/editorial luxury: white commerce backgrounds for PDP/listing assets; warm Moroccan atelier/ryad/tennis/train world-building only for editorial/video/ad slots.
- Avoid fake boutique/showroom, generic AI luxury, tourist decor, malformed handles, duplicate straps, watermarks, baked gray/cream/blue squares, and stock-footage craft filler.

Agent handoff rule: if the task is not completed in one pass, leave a concise handoff in the repo or audit folder with what was inspected, what was changed, what was verified, and what remains blocked. Do not make the next agent rediscover visual/product state from scratch.

For launch readiness, verify the actual source of truth before making readiness claims: rendered storefront, Supabase/catalog state when relevant, Meta/account-side state when relevant, and live asset folders. Passing one gate does not clear the others.

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
