# Higgsfield Prompts · Drop 01

_Fire from Higgsfield UI when ready. Toggle Unlimited on Pro models. Do not run via MCP — Ryan owns asset creation._

Reference register: `docs/brand/PHOTOGRAPHY-REFERENCE.md` — Everline editorial mood × Maison Izem painterly figurative.

---

## 1 · Homepage hero · "Drop 01 announcement"

**Use**: Replaces the gradient placeholder in `components/store/Hero.tsx`.
**Model**: `nano_banana_2` (Pro) · **Aspect**: 16:9 landscape · **Resolution**: 4K
**Reference image**: none (text-to-image)

```
Editorial fashion photograph, 16:9 landscape composition, generous negative space
on the left third of the frame. A young man in his mid-twenties, North African
features, close-cropped dark hair, neutral confident gaze directed past the camera
to the right. He stands centered in the right two-thirds of the frame against a
warm cream stucco wall lit by late-afternoon golden-hour sun raking from camera-right.
The wall texture catches the low light: soft amber and ivory tones, deep shadow
falling away to the left where the frame breathes empty.

He wears an oversized boxy cotton t-shirt in undyed natural cream, mid-weight
heavyweight jersey with visible textile grain. The tee carries a large all-over
painterly graphic across the chest — a tan Moroccan camel and an indigo-robed
Tuareg figure rendered as if oil-on-canvas, deep cobalt-ultramarine palette,
hand-painted edge softness rather than digital sharpness. The graphic dominates
the front of the garment edge-to-edge. No typography, no logos.

Paired with washed black wide-leg trousers, slight pooling at the ankle.

Lighting: single warm key from camera-right at low angle (sun-through-window
quality), shallow fill from a bounced cream surface, deep amber-shadow on the
left side of the figure. Color palette restricted to cream, indigo, terracotta,
warm shadow black.

Shot on medium-format film, 80mm lens equivalent, shallow depth of field with
the figure in sharp focus and the wall texture going soft at the frame edges.
Slight natural film grain. Editorial menswear register — moody warm-light
contemplative composition, the figure inhabits the frame rather than poses
for it. Photorealistic, no digital-illustration sheen.

ABSOLUTELY NO text, letters, numbers, words, labels, logos, brand marks, or
typography of any kind anywhere in the image.
```

---

## 2 · Atlas Caravan Tee · PDP main shot

**Use**: `public/products/drop-01/atlas-caravan-tee-01.svg` → replace with this WebP.
**Model**: `nano_banana_2` (Pro) · **Aspect**: 4:5 portrait · **Resolution**: 4K
**Reference image**: none

```
Editorial product-on-model photograph, 4:5 vertical composition. A young man in
his mid-twenties wearing the same oversized cream boxy cotton tee from the
hero campaign — the Atlas Caravan painterly graphic visible full-front. He
stands centered against a softly-lit warm-cream seamless studio backdrop with
subtle gradient falloff. Three-quarter body framing from waist up.

The tee graphic — a tan Moroccan camel and indigo-robed Tuareg figure in
cobalt-ultramarine oil-painted style — fills the chest edge-to-edge. Hand-printed
imperfection: slight edge softness, dye bleed at color intersections.

Paired with washed black wide-leg trousers. Plain dark leather sneakers visible
at frame edge.

Lighting: warm soft key from upper-right, gentle bounce fill, falloff to warm
shadow on left. Cream, indigo, terracotta palette. No props.

Medium-format film, 80mm lens, sharp focus on the garment graphic, slight grain.
Editorial menswear register — restrained, contemplative, photographed as if for
a luxury menswear lookbook.

NO text, letters, numbers, words, or typography anywhere in the image.
```

**Variation 02 (PDP detail)**: same prompt, 1:1 square, close-up framing on the
chest graphic only (chest-to-collarbone visible).

---

## 3 · Onyx Caravan Hoodie · PDP main shot

**Use**: `public/products/drop-01/onyx-caravan-hoodie-01.svg` → replace.
**Model**: `nano_banana_2` (Pro) · **Aspect**: 4:5 portrait
**Reference image**: none

```
Editorial product-on-model photograph, 4:5 vertical composition. A young man in
his mid-twenties shown from behind, standing centered against a deep warm-onyx
studio backdrop lit by a single low side key from camera-right. Three-quarter
body framing.

He wears an oversized black mid-weight cotton fleece hoodie, dropped shoulder
cut, hood lying flat across the upper back. The full back panel of the hoodie
carries a large painterly graphic — a silhouetted caravan of three Tuareg
riders on camels crossing a single dune ridge, enormous full moon low on the
horizon, deep indigo sky, amber dune below — rendered in oil-painted register
with cinematic chiaroscuro, edge softness, hand-painted texture.

Hands rest at sides. Black wide-leg trousers, plain black leather sneakers.

Lighting: warm low-angle key from camera-right catching the texture of the
fleece and the edges of the printed graphic, deep shadow on the camera-left
side, falloff to nearly-black background. Color palette: onyx, indigo, amber,
warm shadow. No props.

Medium-format film, 80mm lens, sharp focus on the back-panel print, slight
grain. Editorial menswear register, contemplative back-turned composition.

NO text, letters, numbers, words, or typography anywhere in the image.
```

**Variation 02 (PDP detail)**: 1:1 square close-up on the back-panel caravan
graphic, no figure visible — just the textured printed surface filling the frame.

---

## 4 · Atlas Lion Cap · PDP main shot

**Use**: `public/products/drop-01/atlas-lion-cap-01.svg` → replace.
**Model**: `nano_banana_2` (Pro) · **Aspect**: 4:5 portrait
**Reference image**: none

```
Editorial portrait photograph, 4:5 vertical composition. A young man in his
mid-twenties, North African features, photographed from chest-up, head slightly
tilted three-quarters away from camera so the side profile of the cap is
visible against the warm cream backdrop.

He wears a black brushed cotton five-panel cap, low profile, with a small
embroidered Atlas Lion silhouette on the front panel — the embroidery in
matte brass-gold thread, visible but understated. The cap's curved brim
catches a small warm highlight from the upper-right.

He wears a plain cream knit underneath, just visible at the collarbone.

Lighting: soft warm window light from camera-right, gentle bounce fill from
camera-left, deep amber-warm shadow under the cap brim, painterly falloff at
frame edges. Cream backdrop, brass embroidery, ink-black cap.

Medium-format film, 80mm lens, sharp focus on the cap embroidery, slight grain.
Editorial menswear register — quiet portrait, contemplative.

NO text, letters, numbers, words, or typography anywhere in the image — the
embroidered lion silhouette is the only graphic element.
```

---

## Naming convention for outputs

Save each generated WebP as:

```
public/products/drop-01/atlas-caravan-tee-01.webp        ← replaces SVG
public/products/drop-01/atlas-caravan-tee-02.webp        ← detail
public/products/drop-01/onyx-caravan-hoodie-01.webp
public/products/drop-01/onyx-caravan-hoodie-02.webp
public/products/drop-01/atlas-lion-cap-01.webp
public/products/drop-01/hero-drop-01.webp                ← homepage hero
```

Then in `lib/products.ts`, swap each `.svg` path → `.webp`. The site auto-picks them up via the existing `next/image` pipeline (compression, lazy load, responsive sizes all handled).

For the homepage hero, edit `components/store/Hero.tsx` and set the `HERO_IMAGE` constant at the top of the file from `null` to the WebP path. The gradient placeholder disappears and the full-bleed image takes over.
