# Claude Code handoff — Maison Tanneurs asset takeover

You are working in `/Users/ryanz/kechken` on Maison Tanneurs.

Coordination context:

- Claude Code on this machine is working on `https://github.com/lezdoors/maisontanneurs`.
- Claude Code on the Mac mini is working on `https://github.com/lezdoors/Maison-Tanneurs-luxury`.
- The strategic idea is the same across both: Maison Tanneurs premium leather commerce with restrained luxury, craft proof, product clarity, Moroccan world-building.
- The expected differences are selected pictures/videos, some layout choices, and UI design. Do not assume both repos must be identical.
- Use the asset decision map below as the visual source of truth for this machine’s implementation pass.

Primary reference file:

- `/Users/ryanz/kechken/audits/ui-asset-review-2026-06-06/asset-placement-map.md`

Supporting review artifacts:

- `/Users/ryanz/kechken/audits/ui-asset-review-2026-06-06/asset-inventory.csv`
- `/Users/ryanz/kechken/audits/ui-asset-review-2026-06-06/contact-sheets/lifestyle-all-contact.jpg`
- `/Users/ryanz/kechken/audits/ui-asset-review-2026-06-06/contact-sheets/atelier-all-contact.jpg`
- `/Users/ryanz/kechken/audits/ui-asset-review-2026-06-06/contact-sheets/videos-midframes-contact.jpg`
- `/Users/ryanz/kechken/audits/ui-asset-review-2026-06-06/contact-sheets/lifestyle-shortlist.jpg`
- `/Users/ryanz/kechken/audits/ui-asset-review-2026-06-06/contact-sheets/atelier-shortlist.jpg`
- `/Users/ryanz/kechken/audits/ui-asset-review-2026-06-06/contact-sheets/videos-candidate-3frames.jpg`

Drive source folders:

- `/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/Maisom TanneursLifestyle images`
- `/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/Maison tanneurs Atelier assets `
- `/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/Maison Tanneurs videos`

Non-negotiables:

1. Do not alter product source-of-truth hero order. `Hero-*` product imagery stays first for catalogue/PDP.
2. Preserve originals in Google Drive; copy/encode selected public assets into the repo only.
3. Avoid public use of clips with visible lower-right Veo/generated marks unless you crop/export cleanly and verify in browser.
4. Avoid helicopter/yacht, balloons, camel/desert-only, generic souk/alley, fake boutique/showroom, and product-light tourist content.
5. Product clarity first; Moroccan world-building second.

Recommended implementation pass:

## A. Add selected assets to public

Create a clean folder such as:

- `public/brand/maison-tanneurs/home/`

Encode selected stills as WebP, preserving useful aspect ratio/crop. Suggested names:

- `hero-product-weekender-desert.webp` from `Maison tanneurs Atelier assets /61 mt-hero-weekender-desert-product-first-HD-16x9.png`
- `hero-duffle-stone-plinth.webp` from `Maisom TanneursLifestyle images/14 Hero-duffle-cognac-stone-plinth-warm-wall.png`
- `product-duffle-dark-beam.webp` from `Maisom TanneursLifestyle images/13 Hero-duffle-cognac-light-beam-dark.png`
- `product-messenger-peeling-wall.webp` from `Maisom TanneursLifestyle images/24 Hero-messenger-cognac-peeling-wall.png`
- `product-shoulder-window.webp` from `Maisom TanneursLifestyle images/31 Hero-shoulder-bag-cognac-weathered-window.png`
- `product-tote-studio.webp` from `Maisom TanneursLifestyle images/33 Hero-tote-cognac-black-drape-studio.png`
- `craft-atelier-wide.webp` from `Maison tanneurs Atelier assets /01 Atelier scene.png`
- `craft-leather-table.webp` from `Maison tanneurs Atelier assets /52 leather-table-atelier.png`
- `craft-hands-stitching.webp` from `Maison tanneurs Atelier assets /50 hands-leather work-HD.png`
- `world-train.webp` from `Maison tanneurs Atelier assets /30 Hero-model-train-HD.png`
- `world-tennis.webp` from `Maisom TanneursLifestyle images/45 Model-bag-tennis-practice.png`
- `world-rooftop.webp` from `Maison tanneurs Atelier assets /42 Model-rooftop-table-HD.png`

Video candidates:

- `home-product-opening.mp4` from `Maison Tanneurs videos/4-products page opening — transition into the Edition.mp4`
- `craft-atelier-making.mp4` from `Maison Tanneurs videos/2-Atelier cinematic break — Act IV · The Making.mp4`
- `world-train-window.mp4` from `Maison Tanneurs videos/Marrakech Train Window : Traveler.mp4`

Only ship videos if the encoded public file is visibly clean. If the generated mark remains visible, use still fallback.

## B. Homepage composition

Preferred order:

1. Hero
   - Video: `home-product-opening.mp4`, muted loop, product-first, with still fallback `hero-duffle-stone-plinth.webp` or `hero-product-weekender-desert.webp`.
   - Copy should remain short and commercial; avoid over-explaining.

2. Product / Edition rail
   - Use the stills: duffle stone, messenger wall, shoulder window, tote studio, briefcase studio if needed.
   - Keep it commerce-oriented and clickable.

3. Craft / Atelier proof
   - Use `craft-atelier-making.mp4` as the wide break if clean.
   - Pair with stills `craft-atelier-wide.webp`, `craft-leather-table.webp`, `craft-hands-stitching.webp`.
   - Copy should emphasize leather selection, handwork, atelier, durability, and provenance.

4. World / Usage
   - Use train, tennis, rooftop/ryad assets as secondary story.
   - Keep world-building controlled; do not let it become a travel moodboard.

5. CTA/product close
   - Return to clear products, not lifestyle abstraction.

## C. QA requirements

After implementation:

- Run lint/build/audit commands already used in this repo.
- Start local dev and browser-check desktop + mobile.
- Verify images decode (`naturalWidth > 0`) and videos display cleanly.
- Inspect actual viewport, not only DOM.
- Confirm no video watermark/artifact is visible in public viewport.
- Confirm product hero order did not change.

## D. Suggested first Claude Code task prompt

Implement the Maison Tanneurs homepage media refresh using `/Users/ryanz/kechken/audits/ui-asset-review-2026-06-06/asset-placement-map.md` as the source of truth. Copy/encode only the approved selected assets into a new semantic public folder. Update the homepage sections conservatively: product-first hero, commerce rail, atelier proof, then restrained world-building. Do not modify product catalogue hero ordering. Do not use any rejected/caution assets unless explicitly needed as fallback. Avoid public video use if a lower-right generated watermark remains visible. Run lint/build/audit and then start local dev for browser QA.
