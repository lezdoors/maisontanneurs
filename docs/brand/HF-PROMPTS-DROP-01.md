# Higgsfield Prompts · Kechken Drop 01 + Homepage Imagery

_Updated 2026-05-17 to the locked brief: Lemaire restraint × Jacquemus Mediterranean warmth × Fear of God scale × Aigle daylight clarity. Modern luxury fashion house · Moroccan identity, but subtle. NOT tourist, NOT souvenir, NOT bazaar._

**Models to use** (in order of preference, pick whichever is still unlimited in your UI window):
1. `seedream_v5_lite` or `seedream_v5_pro` (Seedream) — strong on atmosphere + natural light
2. `nano_banana_2` (Nano Banana Pro) — costs 2 credits when unlimited window closes; best skin/fabric detail
3. `flux_2_pro` (FLUX.2 Pro) — sharp textile rendering

**Visual direction (from `Drive/art examples/` folder):**
- Take BACKGROUNDS from: `blue-mediterranean-arch-canvas`, `mosque-arcade-pool-reflection`, `kasbah-mud-fortress`, `beige-nested-arches-potted-trees`, `blush-carved-arches-corridor`, `tableau-decoratif-la-porte-bleue-marocaine`
- Take PALETTE / MOOD from: `chefchaouen-elder-yellow-djellaba` (the Chefchaouen blue-and-ochre Mediterranean register)
- Do NOT borrow the figurative subjects (camels, Tuareg, Gnawa, fantasia horsemen) — those are wall-art language, wrong for apparel photography per brief
- AVOID: souk overload, lantern overload, generic desert, camels, tourist clichés

**Universal style anchors to repeat in every prompt:**
- Bright natural daylight (Aigle register) — golden hour OK, but NEVER moody-dark editorial
- Moroccan architecture as backdrop, not as theme
- Earth-tone palette only: bone / sand / limestone / washed-black / bronze / terracotta sparingly / Moroccan-blue + mineral-green as occasional accents
- North African or Mediterranean young model, mid-twenties, restrained styling
- Heavyweight cotton / mid-weight fleece textile feel — visible weave
- Medium-format film, 80mm lens equivalent, slight natural grain, photorealistic
- NO typography in the image, NO logos, NO brand names

---

## How to fire

```bash
higgsfield product-photoshoot create --mode <mode> --count 4 "<brief intent>"
```

Skill assembles photography vocabulary on its backend. Toggle Unlimited in your UI window if firing direct via the Higgsfield app instead of the CLI.

---

## SECTION 1 · Homepage hero (16:9, full-bleed)

**Use**: `components/store/Hero.tsx` — set `HERO_IMAGE = "/products/drop-01/hero-drop-01.webp"`
**Mode**: `hero_banner` · **Aspect**: 16:9 · **Count**: 4

```
A young man, mid-twenties, North African features, calm direct presence,
photographed on a Casablanca rooftop at golden hour. Behind him: bone-cream
limestone walls, a pale-blue Mediterranean arched window in shallow focus,
warm sky catching the upper edge of the frame. He wears a heavyweight cream
cotton tee, oversized boxy cut, dropped shoulder, with a small bronze foil
'kechken' wordmark across the chest in a refined modern sans serif. Plain
washed-black wide-leg trousers. Lighting: low warm sun from camera-right,
honey-coloured key, soft natural shadow across the chest. Generous negative
space, three-quarter framing, the figure occupies the right half. Editorial
heritage menswear restraint — Aigle daylight clarity, Lemaire quietness.
NO text, no logos, no Moroccan tourist clichés.
```

---

## SECTION 2 · Featured Drop campaign (4:5 portrait split-layout)

**Use**: `FeaturedDrop.tsx` — set `FEATURED_IMAGE`
**Mode**: `hero_banner` or `lifestyle_scene` · **Aspect**: 4:5 · **Count**: 4

```
Editorial fashion still, 4:5 vertical. A young woman, mid-twenties,
Mediterranean features, photographed against a sun-washed beige carved arch
corridor — nested arches in soft focus, gentle bronze and bone tones. She
wears a charcoal mid-weight cotton fleece hoodie, dropped shoulder, oversized,
with a small embroidered bronze atlas-line patch at the chest. Plain washed
black trousers. Lighting: bright midday natural daylight bouncing off the
limestone walls, warm cream-honey overall tone, soft shadow on the camera-left
side of her body. Three-quarter framing. Restrained, editorial, Jacquemus
Mediterranean warmth meets Lemaire calm. Bone, sand, charcoal, bronze palette.
NO text, no logos.
```

---

## SECTION 3 · Category tiles (4 tiles, 5:6 portrait each)

**Use**: `CategoryTiles.tsx` — set each tile's `image`
**Mode**: `lifestyle_scene` (tiles 1, 3) · `closeup_product_with_person` (tile 2) · `lifestyle_scene` (tile 4)
**Aspect**: 5:6 · **Count**: 3 per tile

### 3A · Streetwear tile
```
A young man, mid-twenties, North African features, photographed three-quarter
turn against a warm cream limestone wall in bright Mediterranean midday light.
He wears an oversized cream heavyweight cotton tee with a small bronze foil
chest wordmark. Plain black wide-leg trousers. Editorial menswear restraint,
generous architectural negative space. Bone + bronze + black palette. 5:6
vertical. NO text, no logos.
```

### 3B · Jewelry tile
```
Close-up portrait, 5:6 vertical, of a young woman's collarbone and hand — soft
natural daylight from the side. She wears a sterling silver pendant on a long
chain, an abstract line silhouette of the Atlas Mountains. Cream linen shirt
just visible at the edge. Warm cream-grey limestone wall in soft-focus
background. Hand-finished metal catches a single warm highlight. Mineral palette:
silver, cream, soft shadow. NO text.
```

### 3C · Limited Drops tile
```
A young man, mid-twenties, Mediterranean features, sitting on a low stone
ledge in front of a pale-blue Mediterranean arched window. Bright midday light
falls across his charcoal cotton fleece. He looks past the camera, calm.
Limestone steps in soft focus below. The image is grounded, editorial,
heritage. Cream + Moroccan-blue + charcoal palette. 5:6 vertical. NO text.
```

### 3D · The Atelier tile
```
Editorial still of a workspace detail — a clean linen-covered table with a
folded heavyweight cream cotton tee, a sterling silver pendant resting on a
square of indigo linen, a brass tailor's measure, soft midday window light
from the left. No human in frame. Generous negative space, restrained
composition. Bone, indigo, bronze palette. 5:6 vertical. Lemaire still-life
discipline. NO text.
```

---

## SECTION 4 · Jewelry focus (4:5, darker, dramatic)

**Use**: `JewelryFocus.tsx` — set `JEWELRY_HERO`
**Mode**: `closeup_product_with_person` · **Aspect**: 4:5 · **Count**: 4

```
4:5 vertical close-up. A young woman's neck and chest, photographed at a quiet
angle, lit by a single warm window-light from camera-right against a deep
washed-black backdrop. Around her neck: a sterling silver pendant, an abstract
line silhouette of the Atlas Mountains, hanging long against a cream silk
shirt. Hand-finished silver catches the warm key light, deep shadow falls to
the camera-left. Skin tone soft and warm. The composition is reverent,
luxury-watch-photography register — quiet, deliberate, no spectacle. Onyx +
bone + brass-warm-light palette. NO text, no logos.
```

---

## SECTION 5 · Editorial strip (3 cards, 4:5 each)

**Use**: `EditorialStrip.tsx` — set `image` on each item
**Mode**: `lifestyle_scene` · **Aspect**: 4:5 · **Count**: 3 per card

### 5A · "The Campaign — Drop 01"
```
Editorial fashion campaign still, 4:5. A young man in cream heavyweight tee
walking past a sun-bleached Casablanca-style limestone wall, partial shadow
of an arched window cast across his shoulder, late afternoon honey light.
Motion-blurred slightly, mid-stride. Bone + bronze + warm shadow. NO text.
```

### 5B · "The Material — On heavyweight cotton and bronze foil"
```
Studio still life, 4:5. A folded heavyweight cream cotton tee on a textured
limestone slab, a small bronze foil swatch beside it, soft daylight from a
window above. Restrained Jacquemus still-life composition. Bone + bronze
+ stone palette. NO text.
```

### 5C · "The Atelier — Print-to-order"
```
Documentary still, 4:5. A pair of hands smoothing a printed garment on a clean
work surface, soft natural workshop daylight, the garment's bronze chest
wordmark visible in soft focus. Hands and process only, no face. Bone + skin
+ warm wood tones. Restrained, honest. NO text other than the bronze wordmark
on the garment (single word, sans-serif lowercase).
```

---

## SECTION 6 · Brand Story · "Between Worlds" (5:6 portrait)

**Use**: `BrandStoryEditorial.tsx` — set `STORY_IMAGE`
**Mode**: `lifestyle_scene` · **Aspect**: 5:6 · **Count**: 4

```
Editorial portrait, 5:6 vertical. A young man, mid-twenties, North African
features, photographed in three-quarter profile against a deep Moroccan-blue
painted wall (matte chalky finish, like a Chefchaouen surface) at the
transition between bright daylight and shadow. He wears a cream heavyweight
cotton tee and a sterling silver pendant on a long chain. Calm, contemplative
gaze just past the camera. Lighting: warm midday daylight from camera-left
catching one side of his face, deep Moroccan-blue shadow on the right. The
composition reads 'between worlds' — Mediterranean light meets Maghreb pigment.
Bone + Moroccan-blue + silver palette. NO text, no logos.
```

---

## SECTION 7 · Product PDP mains (3 SKUs)

**Mode for all**: `virtual_model_tryout` · **Aspect**: 4:5 · **Count**: 4 each

### 7A · Wordmark Cotton Tee
```
Editorial product-on-model, 4:5 vertical. Young man, mid-twenties, North
African features, wearing an oversized cream heavyweight cotton boxy tee with
a single small bronze foil 'kechken' wordmark in modern lowercase sans across
the chest. Plain black wide-leg trousers. Warm-cream seamless studio backdrop,
soft Mediterranean daylight key from upper-right, three-quarter framing
waist-up. Restrained Aigle product register. Bone + bronze + black palette.
NO text other than the chest wordmark.
```

### 7B · Heritage Hoodie
```
Editorial product-on-model, 4:5 vertical. Same young man wearing an oversized
charcoal mid-weight cotton fleece hoodie, dropped shoulder, with a small
embroidered bronze atlas-mountain-line patch at the chest. Hood lying flat
across the upper back. Plain black wide-leg trousers. Warm-cream seamless
studio backdrop, bright soft daylight key from upper-right. Three-quarter
framing waist-up. Restrained Aigle product register. Charcoal + bronze + bone
palette. NO text.
```

### 7C · Atlas Line Pendant
```
Editorial product-on-model close-up, 4:5 vertical. Young woman's neck and
collarbone, three-quarter angle, wearing a sterling silver pendant — an
abstract Atlas-Mountains line silhouette — on a long delicate chain against a
plain cream silk shirt. Warm soft natural daylight from camera-right. Plain
limestone-cream seamless backdrop in soft focus. Hand-finished silver, single
warm highlight catching the pendant. Quiet luxury jewelry register. Cream +
silver + soft shadow palette. NO text.
```

---

## Variation prompts (PDP detail crops — 1:1)

For each SKU, generate a 1:1 detail crop AFTER the main shot lands:

```bash
higgsfield product-photoshoot create --mode product_shot --count 3 \
  "1:1 square close-up of [the chest wordmark detail / the embroidered atlas patch / the silver pendant], textile or metal texture filling the frame, soft natural daylight, slight grain, restrained editorial register, bone or charcoal background."
```

Adjust subject per SKU.

---

## Naming + wire-up

Save outputs into `public/products/drop-01/` (PDPs) and `public/hero/` (homepage sections):

```
public/hero/hero-drop-01.webp                 → Hero.tsx HERO_IMAGE
public/hero/featured-drop.webp                → FeaturedDrop.tsx FEATURED_IMAGE
public/hero/category-streetwear.webp          → CategoryTiles.tsx tile[0].image
public/hero/category-jewelry.webp             → tile[1].image
public/hero/category-limited.webp             → tile[2].image
public/hero/category-atelier.webp             → tile[3].image
public/hero/jewelry-focus.webp                → JewelryFocus.tsx JEWELRY_HERO
public/hero/editorial-campaign.webp           → EditorialStrip.tsx items[0].image
public/hero/editorial-material.webp           → items[1].image
public/hero/editorial-atelier.webp            → items[2].image
public/hero/brand-story.webp                  → BrandStoryEditorial.tsx STORY_IMAGE
public/products/drop-01/wordmark-tee-01.webp  → lib/products.ts (swap .svg → .webp)
public/products/drop-01/heritage-hoodie-01.webp
public/products/drop-01/atlas-pendant-01.webp
```

Once images land, swap each placeholder constant from `null` to the path. All gradient placeholders disappear automatically.

---

## Order of operations (for your unlimited window)

If you have a few hours, prioritise in this order — the highest-impact assets first:

1. **Homepage hero** (Section 1) — single most visible image
2. **Brand Story "Between Worlds"** (Section 6) — defines the brand emotionally
3. **Jewelry Focus** (Section 4) — proves the jewelry category is real, not afterthought
4. **PDP main shots** (Section 7A, 7B, 7C) — replaces SVG placeholders, makes catalogue feel real
5. **Featured Drop campaign** (Section 2) — second editorial moment
6. **Category tiles** (Section 3) — 4 images, lower priority since each is small
7. **Editorial strip** (Section 5) — defer until other sections land

Total ~17 images. At 4 variations per prompt (free in unlimited window) = ~68 generations. Pick the strongest from each set.

When the unlimited window closes, anything left switches to 2 credits/image on nano_banana_2.
