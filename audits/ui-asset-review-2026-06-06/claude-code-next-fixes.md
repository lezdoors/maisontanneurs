# Claude Code next fixes — /about atelier + product grid double-plate

> **RESOLVED 2026-06-08** — both fixes shipped.
> - `/about` was renamed to `/atelier` with permanent 308 redirects and a
>   slow editorial hero carousel (AtelierHero component).
> - Product grid square-within-square was killed via `9692af8` (inline
>   padding=0) and verified clean on live.
> See `docs/LAUNCH-STATE-2026-06-08.md` for current launch state.

Repo: `/Users/ryanz/kechken`
Branch: `claude/hero-section-trim-2026-06-06`
Local dev: `http://localhost:3027`

## Fix 1 — product grid square-within-square

Reference screenshots from Ryan:

- `/var/folders/58/50q7q6153cz7jnstq5s7_2jw0000gn/T/TemporaryItems/NSIRD_screencaptureui_OQx8NX/Screenshot 2026-06-06 at 12.58.10 PM.png`
- `/var/folders/58/50q7q6153cz7jnstq5s7_2jw0000gn/T/TemporaryItems/NSIRD_screencaptureui_39yaGs/Screenshot 2026-06-06 at 12.58.19 PM.png`

Problem:

The product grid currently reads as a cream/warm outer square with a smaller white product image square inside it. Visually it looks like:

- warm cream product card/plate
- white image background pasted inside
- bag inside that white square

Ryan wants it clean: just the bag on its white background square. No cream square behind a smaller white square.

Likely files:

- `components/store/ArchitecturalGrid.tsx`
- `app/globals.css`
- `lib/product-image-presentation.ts` only if class choice needs adjustment

Current relevant code:

- `ArchitecturalGrid.tsx` ProductCell uses `className="mt-product-frame mt-ratio-portrait relative"`
- `Image` uses `fill` and `className={productImageClass(hero)}`
- `globals.css` has `.mt-product-frame`, `.mt-ratio-portrait`, `.mt-product-img-standard`

Fix intent:

- Make the card image area visually one clean white product plate.
- Remove the visible outer cream block surrounding the white image square.
- Do not change product image order, sources, catalogue data, or Hero-* source-of-truth behavior.
- Do not crop into products.
- Keep object-contain.
- Keep catalogue grid untouched semantically; this is CSS/layout only.

Possible implementation options:

1. Make `.mt-product-frame` / relevant ArchitecturalGrid wrapper pure `#fff`, not `var(--color-paper-alt)` / cream.
2. Remove extra vertical/horizontal padding that reveals the cream backing around the image if the image already includes a white background.
3. If `padding` on `.mt-product-img-standard` is creating the visible smaller white square, reduce/remove the image padding for catalogue tiles while preserving product breathing room through the source image itself.
4. If needed, add a scoped class for ArchitecturalGrid product cells rather than changing PDP behavior globally.

Acceptance:

- Refresh homepage.
- In “The departure” grid and the full catalogue grid area, product cards should read as one clean white product plate.
- No cream square behind a smaller white square.
- Bag remains contained, centered, not cropped.
- N° label may remain if it still looks clean; otherwise place it above/inside the same white plate without creating a second background.
- Run typecheck + catalogue audit after.

## Fix 2 — /about atelier media refresh

Ryan’s note:

Use these videos in `/about#atelier` with the existing good atelier images:

- `/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/Maison Tanneurs videos/Traveler_and_artisan_in_alleys_202606051727.mp4`
- `/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/Maison Tanneurs videos/Bag-terrace-light-shift-9x16.mp4`
- `/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/Maison Tanneurs videos/Hands at Work.mp4`

Current page inspected:

- `/about#atelier` is the active page, not `/atelier` (that route 404s).
- The top “In Their Hands” video is strong and should remain unless Ryan says otherwise.
- The Atelier gallery contains a mix of good craft proof and weaker world/lifestyle images.

Weak/replacement targets in the Atelier gallery:

- Man/model walking with backpack / forest/white alley image: feels generic and less craft-proof. Replace.
- Berber/desert seated image: too tourism/desert cliché for atelier page. Replace.
- Sofa model image: reads lifestyle showroom, not atelier proof. Replace.
- Olive courtyard walking model image: okay as world-building but weak for an atelier section; replace if enough better media.

Strong/current images to keep in atelier page:

- leather table / stacked hides / cut panels
- hand stitching / awl detail
- actual workshop/bench/cutting scenes
- B&W handwork plate in ArtisanDossier

How to use the requested videos:

1. `Hands at Work.mp4`
   - Best use: replace one weak static gallery tile with a craft-proof looping video tile.
   - It is hand/tool/leather proof, directly relevant to atelier.
   - Check/crop any lower-right generated mark if present.

2. `Bag-terrace-light-shift-9x16.mp4`
   - Best use: vertical/mobile-friendly product-handling tile in the atelier gallery.
   - Use as a product handling/bench detail, not hero.
   - Check/crop any lower-right generated mark if present.

3. `Traveler_and_artisan_in_alleys_202606051727.mp4`
   - Use carefully: it may work as a contextual atelier/medina transition tile if clean, but do not let it become generic alley content.
   - Prefer it over the current man-walking-backpack still only if the video shows artisan/context/product more clearly.
   - Crop/export clean and verify no watermark/artifact.

Candidate replacement image Ryan mentioned:

- `/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/Maisom TanneursLifestyle images/Model-tenniscourt-clouds-hd.png`

Assessment:

- Good luxury/world-building image, but NOT atelier/craft proof.
- Use only if the about page needs one “world of the bag” break or lifestyle tile.
- Do not use as the atelier hero or craft proof replacement.
- Better on homepage/world/field/tennis section than `/about#atelier`.

Preferred /about media direction:

- More bench, hands, cutting, leather piles, tools.
- Less model lifestyle, less desert, less generic walking/backpack.
- If adding videos, use them as embedded tiles in the Atelier gallery with the same strict composition and no rounded corners.

Implementation requirements:

- Encode/copy videos into a semantic public folder, e.g. `public/brand/atelier/`.
- Use `<video muted loop playsInline autoPlay preload="metadata">` with a poster if needed.
- Keep layout sharp, editorial, zero-radius.
- Verify locally with actual viewport; do not rely only on DOM.
- Run typecheck/audit after.
