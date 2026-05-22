# Maison Tanneurs · Brand imagery

Canonical Next.js-served brand imagery for the storefront. Slug-named, WebP, 2K minimum (4K supported). 16:9 desktop, 4:5 mobile variants.

## Folder map

```
public/brand/
├── hero/                ← top-of-page hero stills, 16:9 desktop / 4:5 mobile
│   ├── home-hero.webp           ← homepage hero (Hero.tsx)
│   ├── home-hero-mobile.webp    ← homepage hero mobile crop (optional)
│   ├── atelier-hero.webp        ← /about hero
│   ├── shop-hero.webp           ← /products hero
│   └── ...
├── section/             ← mid-page editorial section plates, 16:9 or 4:5
│   ├── home-feature.webp        ← FeaturedDrop background
│   ├── home-atelier.webp        ← AtelierFocus
│   ├── home-editorial.webp      ← EditorialStrip
│   └── ...
└── maison-tanneurs.png  ← brand mark (existing)
```

## Brand visual register

French editorial luxury × Moroccan craft (Hermès playbook). Quality benchmark: Loewe, Bottega Veneta, Hermès editorial. Quiet luxury, restrained, model-led when human is present, object-led otherwise.

- Settings: Parisian interiors, Marrakech riads, Marrakech rooftops, sun-dappled palm groves, golden-hour soft light
- Model imagery: Mediterranean-featured woman, editorial portrait register
- Palette anchors: cream, oxblood, cognac, whiskey-brown, charcoal, brass-gold, dove-grey
- **NEVER:** desert / camel / dune / souk / lantern tropes. NEVER stock-Morocco scenery.

## Encoding

- Format: WebP, quality 82
- Long edge: 2400px minimum (4K — 3840px — accepted for large heroes)
- `object-cover` with adjustable `object-position` per slide
- No baked-in text/typography in the image (composite all text in CSS or Canva post)

## Naming

Slug-named, lowercase-kebab-case. Example: `home-hero.webp`, `atelier-hero.webp`, `home-feature-rooftop.webp`. Mobile variants suffix `-mobile.webp`.

Track every gap in [`MISSING-ASSETS.md`](../../MISSING-ASSETS.md).
