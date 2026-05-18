# Nitra · Photography Reference Register

_Locked 2026-05-17. The visual target for every Higgsfield generation, every campaign shoot, every lookbook still._

## North star

**Everline Studio editorial mood × Maison Izem painterly figurative.**

The campaign register is **moody warm-light editorial**. Not bright DTC catalog. Not Marrakech tourism. Not festival-streetwear-flat.

| In | Out |
|---|---|
| Soft natural light, golden hour or window light | Bright studio softboxes / flash |
| Earth-tone palette (cream, terracotta, indigo, onyx, brass) | Saturated digital primaries |
| Single figure in negative space | Crowded compositions |
| Cinematic chiaroscuro — one warm key light, deep shadow side | Flat front-lit DTC look |
| Medium-format film feel, slight grain, soft falloff | Hyper-sharp digital catalog |
| Atmospheric, contemplative — the subject is *in* a place | Garment hovering on no background |
| Generous whitespace, edge-to-edge breathing room | Cropped tight, no air |
| Painterly oil-on-canvas register (Izem language) for art-print SKUs | Vector flatness, illustration-software look |

## Reference brands to match in mood

- **Everline Studio** — editorial warm light, founder narrative voice
- **Aimé Leon Dore** — editorial menswear restraint, NY-rooted
- **Casablanca Paris** — luxe Mediterranean palette, tennis-club calm
- **Daily Paper** — African-pattern register, lookbook editorial cadence
- **Maison Izem** — painterly Moroccan figurative on canvas (already in our shared visual library)

## Reference brands NOT to match

- Generic dropship Shopify lookbooks (overlit, oversaturated)
- Festival/boho streetwear (cluttered, vintage-clipart vibes)
- "Made in Morocco" tourism aesthetic — souks, mint tea piles, stock-photo-feel
- DTC-bright-pastel (Allbirds, Cuts, Vuori register — wrong lane)

## Higgsfield model recommendations

For Nitra Drop 01 stills:

| Use case | Model | Notes |
|---|---|---|
| Hero campaign still (one image, max quality) | `nano_banana_2` (Pro, 2 credits) | Best skin/fur/fabric detail. Toggle Unlimited. |
| Product-on-model lookbook variations | `nano_banana` (1 credit) | Volume-friendly. Same prompts, cheaper iterations. |
| Editorial-mood scene stills (no product focus) | `FLUX.2 Pro` | Best for atmosphere + cinematic falloff |
| Painterly art-graphic generation (for tee/hoodie prints) | `Seedream` or `nano_banana_2` | When generating the actual zellige/figurative art that gets printed |

**Reminder**: every model meters despite "Unlimited" badges. Preflight cost via `get_cost`. Never default to Pro tier when 1-credit nano_banana works for iteration.

## Aspect ratios

| Surface | Ratio |
|---|---|
| Homepage hero (full-bleed) | 16:9 landscape, or 4:5 if vertical hero treatment |
| PDP main image | 4:5 portrait |
| PDP detail crops | 1:1 square |
| IG editorial | 4:5 portrait |
| TikTok / IG Stories | 9:16 vertical |

## Composition rules

1. **One figure, one accent.** Inherited from the Maison Izem language. The figure carries the frame; one tiny element (a sprig, a small object, a bird, a hand) adds tension.
2. **Light comes from outside the frame.** Window light, low sun, lamp-glow visible at edge. Never flat fill light.
3. **Wardrobe restricted to the brand palette.** Cream + indigo + terracotta + onyx + brass. Black is allowed but as ink, not as void.
4. **No typography in the image itself.** All wordmarks, labels, prices are composited in Canva or rendered by `/brand/wordmark`. Models hallucinate garbled text; we don't ship it.
5. **No brand names in the prompt.** Translate "Aimé Leon Dore mood" into attribute language ("editorial menswear restraint, soft golden-hour key light, cream wool sweater, urban brick texture in shallow depth-of-field background").

---

_See `docs/brand/HF-PROMPTS-DROP-01.md` for the actual prompts to fire when ready._
