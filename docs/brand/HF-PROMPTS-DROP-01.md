# Higgsfield Prompts · Drop 01

_Updated 2026-05-17 to skill-CLI format. The `higgsfield-product-photoshoot` skill assembles editorial photography vocabulary on its backend — give it mode + brief directional intent, never freehand the full prompt._

**Model**: gpt_image_2 (skill default — paid, ~consistent style across runs)
**Account**: ultra plan · check `higgsfield account status` for credits
**Reference register**: see `PHOTOGRAPHY-REFERENCE.md` — Aigle bright daylight × Maison Izem painterly figurative × urban Moroccan-cultural subjects

---

## How to fire (skill workflow)

The `higgsfield-product-photoshoot` skill is installed at `~/.claude/skills/higgsfield-product-photoshoot`. Trigger it by intent in any Claude Code session, or run the CLI directly. Each invocation generates `--count N` variations; pick the strongest, save as WebP to `public/products/drop-01/`.

```bash
higgsfield product-photoshoot create --mode <mode> --count 4 "<brief directional prompt>"
```

Skill UX rule: be concise. Mode + intent + brand context — the backend handles photography vocabulary, lighting, composition, palette discipline.

---

## 1 · Homepage hero · "Drop 01 announcement"

**Mode**: `hero_banner` · **Aspect**: 16:9 landscape · **Count**: 4
**Output target**: `public/products/drop-01/hero-drop-01.webp`

```
Young man, mid-twenties, North African features, wearing an oversized cream
cotton tee with a large hand-painted Tuareg-and-camel figurative graphic on
the chest (cobalt indigo, tan, ultramarine — oil-on-canvas register). Standing
on a Brooklyn brownstone stoop. Bright midday natural daylight. Negative space
left of frame. Editorial heritage menswear restraint — Aigle daylight clarity,
no editorial darkness. Palette: cream, indigo, terracotta, warm stone gray.
```

---

## 2 · Atlas Caravan Tee · PDP main

**Mode**: `virtual_model_tryout` · **Aspect**: 4:5 portrait · **Count**: 4
**Output target**: `atlas-caravan-tee-01.webp`

```
Same young man wearing the same oversized cream cotton tee with painterly
cobalt Tuareg-and-camel chest graphic. Clean warm-cream seamless studio
backdrop, soft daylight key from upper-right, three-quarter framing waist-up.
Heritage menswear product register. Palette: cream, indigo, terracotta, black.
```

**Variation 02 (PDP detail)**:

```bash
higgsfield product-photoshoot create --mode product_shot --count 3 \
  "1:1 square. Tight close-up on the cobalt Tuareg-and-camel painterly tee
  graphic — chest-to-collarbone visible, hand-painted texture sharp, soft
  daylight. Cream + cobalt + tan palette."
```

Save: `atlas-caravan-tee-02.webp`

---

## 3 · Onyx Caravan Hoodie · PDP main

**Mode**: `virtual_model_tryout` · **Aspect**: 4:5 portrait · **Count**: 4
**Output target**: `onyx-caravan-hoodie-01.webp`

```
Young man shown from behind in oversized black cotton fleece hoodie, back
panel carrying a large painterly graphic of three Tuareg riders on camels
crossing a single dune with a low full moon (deep indigo sky, amber dune,
oil-on-canvas register). Clean cream-gray architectural urban wall background,
bright midday daylight. Heritage menswear product register. Palette: onyx,
indigo, amber, cream-gray.
```

**Variation 02 (back-panel detail)**:

```bash
higgsfield product-photoshoot create --mode product_shot --count 3 \
  "1:1 square. Close-up on the Tuareg-caravan-under-full-moon painterly back-panel
  graphic — textured cotton fleece surface filling the frame. Deep indigo sky,
  amber dune, three rider silhouettes, oil-on-canvas register."
```

Save: `onyx-caravan-hoodie-02.webp`

---

## 4 · Atlas Lion Cap · PDP main

**Mode**: `closeup_product_with_person` · **Aspect**: 4:5 portrait · **Count**: 4
**Output target**: `atlas-lion-cap-01.webp`

```
Young man chest-up portrait, North African features, head tilted three-quarters
away so the side profile of a low-profile black five-panel cap is visible.
Small embroidered Atlas Lion silhouette on the front panel in matte brass-gold
thread. Plain cream knit underneath. Bright cream architectural backdrop, soft
daylight from camera-right. Heritage menswear restraint, contemplative.
Palette: cream, ink-black, brass.
```

---

## Phase 2 modes (defer until WC tailwind)

When Drop 01 is live and Morocco's WC matches start producing organic content:

### Pinterest pin asset
```bash
higgsfield product-photoshoot create --mode moodboard_pin --count 6 \
  "Drop 01 Atlas Caravan Tee in a Moroccan-cultural urban editorial moodboard
  composition. Cream + cobalt palette. Pinterest-native vertical 2:3."
```

### Social carousel (3–10 slides)
```bash
higgsfield product-photoshoot create --mode social_carousel --count 1 \
  "Drop 01 launch carousel: 6 slides connecting hero portrait → tee close-up
  → hoodie back panel → cap detail → palette swatch → Drop 02 teaser. Heritage
  menswear cadence, bright daylight, Aigle register."
```

### Ad creative pack (Meta + TikTok variants)
```bash
higgsfield product-photoshoot create --mode ad_creative_pack --count 1 \
  "Drop 01 Atlas Caravan Tee ad pack — 1:1, 4:5, 9:16 variants. North African
  young man on Brooklyn brownstone stoop. Bright midday daylight. Heritage
  menswear, Aigle register. Variants for Meta feed + Stories + TikTok feed."
```

---

## File naming + repo wire-up

Save outputs into `public/products/drop-01/` with these exact names:

```
hero-drop-01.webp                ← Hero.tsx HERO_IMAGE constant
atlas-caravan-tee-01.webp        ← lib/products.ts (replaces .svg)
atlas-caravan-tee-02.webp
onyx-caravan-hoodie-01.webp
onyx-caravan-hoodie-02.webp
atlas-lion-cap-01.webp
```

Then in `lib/products.ts`, swap each `.svg` → `.webp`. The Hero.tsx swap is a single line: set `HERO_IMAGE = "/products/drop-01/hero-drop-01.webp"` and the gradient placeholder disappears.

---

## Cost note

The skill submits to `gpt_image_2`, which meters against your account regardless of the nano_banana free-credit window. Each `--count 4` run is roughly 4 generations. For Drop 01 hero + 3 SKUs × ~2 variations each = ~24 generations.

If you want to preserve nano_banana_2 free credits, fire from the Higgsfield UI directly using freehand prompts adapted from these — the skill consistency is the trade-off you accepted.
