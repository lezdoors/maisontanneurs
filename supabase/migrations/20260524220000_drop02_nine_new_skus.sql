-- Drop 02 expansion — 9 new SKUs from the May 2026 HF storyboard batches.
-- Naming register: Moroccan with French flavor (Saharienne, Médersa, Babouche,
-- Kilim ×2, Cèdre, Tadelakt, Safran, Rif). Files uploaded to Supabase Storage
-- bucket `products` under `drop-02/<slug>/<slug>-<kind>.webp`.
--
-- IMAGE FILES must be uploaded to Storage before this migration runs.
-- Use scripts/wire-batch-9.ts to upload + insert in one pass.

DO $$
DECLARE
  storage_url text := 'https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02';
BEGIN

INSERT INTO products (slug, title, price, category, status, featured, description, materials, dimensions, images, available_quantity, weight_lbs)
VALUES
  (
    'saharienne-saddle-cognac',
    'Saharienne Saddle · Cognac',
    24500,
    'Leather Goods',
    'available',
    true,
    'Small structured saddle bag in cognac full-grain leather, finished with a single brass push-lock catch and clean centerline seam. Day-to-evening crossbody scale. Patinas warm with wear.',
    ARRAY['Full-grain Moroccan leather','Solid brass push-lock catch','Structured saddle silhouette','Hand saddle-stitched in Marrakech']::text[],
    '{"size":"22cm × 18cm × 10cm · single flap closure"}'::jsonb,
    ARRAY[
      storage_url||'/saharienne-saddle-cognac/saharienne-saddle-cognac-pdp-white.webp',
      storage_url||'/saharienne-saddle-cognac/saharienne-saddle-cognac-archive-1.webp',
      storage_url||'/saharienne-saddle-cognac/saharienne-saddle-cognac-archive-2.webp',
      storage_url||'/saharienne-saddle-cognac/saharienne-saddle-cognac-archive-3.webp',
      storage_url||'/saharienne-saddle-cognac/saharienne-saddle-cognac-archive-4.webp',
      storage_url||'/saharienne-saddle-cognac/saharienne-saddle-cognac-archive-5.webp',
      storage_url||'/saharienne-saddle-cognac/saharienne-saddle-cognac-archive-6.webp',
      storage_url||'/saharienne-saddle-cognac/saharienne-saddle-cognac-archive-7.webp',
      storage_url||'/saharienne-saddle-cognac/saharienne-saddle-cognac-archive-8.webp'
    ]::text[],
    18,
    1.2
  ),
  (
    'medersa-rucksack-cognac',
    'Médersa Rucksack · Cognac',
    32500,
    'Leather Goods',
    'available',
    true,
    'Travel-grade utility rucksack in cognac full-grain leather. Four brass zippers with leather tassel pulls open onto a padded main, a top-zip dopp compartment, and a side flap pocket. Built for long carry days, softens with wear.',
    ARRAY['Full-grain Moroccan leather','Solid brass YKK zippers (×4)','Leather tassel zipper pulls','Padded laptop sleeve interior','Hand saddle-stitched in Marrakech']::text[],
    '{"size":"42cm × 30cm × 16cm · multi-compartment utility"}'::jsonb,
    ARRAY[
      storage_url||'/medersa-rucksack-cognac/medersa-rucksack-cognac-pdp-white.webp',
      storage_url||'/medersa-rucksack-cognac/medersa-rucksack-cognac-archive-1.webp',
      storage_url||'/medersa-rucksack-cognac/medersa-rucksack-cognac-archive-2.webp',
      storage_url||'/medersa-rucksack-cognac/medersa-rucksack-cognac-archive-3.webp',
      storage_url||'/medersa-rucksack-cognac/medersa-rucksack-cognac-archive-4.webp',
      storage_url||'/medersa-rucksack-cognac/medersa-rucksack-cognac-archive-5.webp',
      storage_url||'/medersa-rucksack-cognac/medersa-rucksack-cognac-archive-6.webp',
      storage_url||'/medersa-rucksack-cognac/medersa-rucksack-cognac-archive-7.webp',
      storage_url||'/medersa-rucksack-cognac/medersa-rucksack-cognac-archive-8.webp'
    ]::text[],
    14,
    3.2
  ),
  (
    'babouche-crossbody-cognac',
    'Babouche Crossbody · Cognac',
    18500,
    'Leather Goods',
    'available',
    true,
    'Soft pebbled-grain crossbody in cognac, with a quiet twin-stud brass closure. Day daily-carry scale — phone, wallet, keys. The smallest piece in the maison, the most personal.',
    ARRAY['Pebbled-grain Moroccan leather','Solid brass twin-stud closure','Adjustable shoulder strap','Hand saddle-stitched in Marrakech']::text[],
    '{"size":"20cm × 16cm × 7cm · soft crossbody"}'::jsonb,
    ARRAY[
      storage_url||'/babouche-crossbody-cognac/babouche-crossbody-cognac-pdp-white.webp',
      storage_url||'/babouche-crossbody-cognac/babouche-crossbody-cognac-archive-1.webp',
      storage_url||'/babouche-crossbody-cognac/babouche-crossbody-cognac-archive-2.webp',
      storage_url||'/babouche-crossbody-cognac/babouche-crossbody-cognac-archive-3.webp',
      storage_url||'/babouche-crossbody-cognac/babouche-crossbody-cognac-archive-4.webp',
      storage_url||'/babouche-crossbody-cognac/babouche-crossbody-cognac-archive-5.webp',
      storage_url||'/babouche-crossbody-cognac/babouche-crossbody-cognac-archive-6.webp',
      storage_url||'/babouche-crossbody-cognac/babouche-crossbody-cognac-archive-7.webp',
      storage_url||'/babouche-crossbody-cognac/babouche-crossbody-cognac-archive-8.webp'
    ]::text[],
    24,
    0.9
  ),
  (
    'kilim-duffle-polychrome',
    'Kilim Duffle · Polychrome',
    46500,
    'Leather Goods',
    'available',
    true,
    'Statement barrel duffle in cognac leather framing handwoven polychrome kilim panels — red, green, ochre and cream stripes with woven diamond accents. Every piece is unique to its panel. The kilim register of the maison.',
    ARRAY['Full-grain cognac leather frame','Handwoven polychrome kilim wool panels','Solid brass end fittings','Dual rolled leather handles','Hand saddle-stitched in Marrakech']::text[],
    '{"size":"48cm × 26cm × 24cm · barrel duffle"}'::jsonb,
    ARRAY[
      storage_url||'/kilim-duffle-polychrome/kilim-duffle-polychrome-pdp-white.webp',
      storage_url||'/kilim-duffle-polychrome/kilim-duffle-polychrome-archive-1.webp',
      storage_url||'/kilim-duffle-polychrome/kilim-duffle-polychrome-archive-2.webp',
      storage_url||'/kilim-duffle-polychrome/kilim-duffle-polychrome-archive-3.webp',
      storage_url||'/kilim-duffle-polychrome/kilim-duffle-polychrome-archive-4.webp',
      storage_url||'/kilim-duffle-polychrome/kilim-duffle-polychrome-archive-5.webp',
      storage_url||'/kilim-duffle-polychrome/kilim-duffle-polychrome-archive-6.webp',
      storage_url||'/kilim-duffle-polychrome/kilim-duffle-polychrome-archive-7.webp',
      storage_url||'/kilim-duffle-polychrome/kilim-duffle-polychrome-archive-8.webp'
    ]::text[],
    8,
    3.4
  ),
  (
    'kilim-duffle-amber',
    'Kilim Duffle · Amber',
    46500,
    'Leather Goods',
    'available',
    true,
    'Sister piece to the Polychrome — same barrel duffle silhouette with handwoven kilim panels in an amber palette: orange, terracotta, cream and chocolate diamond motifs. Berber geometric tradition, French maison register.',
    ARRAY['Full-grain cognac leather frame','Handwoven amber kilim wool panels','Solid brass end fittings','Dual rolled leather handles','Hand saddle-stitched in Marrakech']::text[],
    '{"size":"48cm × 26cm × 24cm · barrel duffle"}'::jsonb,
    ARRAY[
      storage_url||'/kilim-duffle-amber/kilim-duffle-amber-pdp-white.webp',
      storage_url||'/kilim-duffle-amber/kilim-duffle-amber-archive-1.webp',
      storage_url||'/kilim-duffle-amber/kilim-duffle-amber-archive-2.webp',
      storage_url||'/kilim-duffle-amber/kilim-duffle-amber-archive-3.webp',
      storage_url||'/kilim-duffle-amber/kilim-duffle-amber-archive-4.webp',
      storage_url||'/kilim-duffle-amber/kilim-duffle-amber-archive-5.webp',
      storage_url||'/kilim-duffle-amber/kilim-duffle-amber-archive-6.webp',
      storage_url||'/kilim-duffle-amber/kilim-duffle-amber-archive-7.webp',
      storage_url||'/kilim-duffle-amber/kilim-duffle-amber-archive-8.webp'
    ]::text[],
    8,
    3.4
  ),
  (
    'cedre-crossbody-chocolate',
    'Cèdre Crossbody · Chocolate',
    21500,
    'Leather Goods',
    'available',
    true,
    'Medium-weight crossbody in deep chocolate distressed leather with cream contrast saddle-stitch and a brass push-lock. The most worn-in colorway in the drop. Cedar-wood tonality.',
    ARRAY['Distressed-finish chocolate Moroccan leather','Solid brass push-lock catch','Cream contrast saddle-stitching','Adjustable shoulder strap','Hand saddle-stitched in Marrakech']::text[],
    '{"size":"26cm × 22cm × 8cm · flap crossbody"}'::jsonb,
    ARRAY[
      storage_url||'/cedre-crossbody-chocolate/cedre-crossbody-chocolate-pdp-white.webp',
      storage_url||'/cedre-crossbody-chocolate/cedre-crossbody-chocolate-archive-1.webp',
      storage_url||'/cedre-crossbody-chocolate/cedre-crossbody-chocolate-archive-2.webp',
      storage_url||'/cedre-crossbody-chocolate/cedre-crossbody-chocolate-archive-3.webp',
      storage_url||'/cedre-crossbody-chocolate/cedre-crossbody-chocolate-archive-4.webp',
      storage_url||'/cedre-crossbody-chocolate/cedre-crossbody-chocolate-archive-5.webp',
      storage_url||'/cedre-crossbody-chocolate/cedre-crossbody-chocolate-archive-6.webp',
      storage_url||'/cedre-crossbody-chocolate/cedre-crossbody-chocolate-archive-7.webp',
      storage_url||'/cedre-crossbody-chocolate/cedre-crossbody-chocolate-archive-8.webp'
    ]::text[],
    16,
    1.3
  ),
  (
    'tadelakt-rucksack-cognac',
    'Tadelakt Rucksack · Cognac',
    29500,
    'Leather Goods',
    'available',
    true,
    'Refined commuter rucksack in cognac full-grain leather with a vertical brass front zipper, leather tassel pull, and cream saddle-stitched edge. Tadelakt-smooth surface, finished by hand.',
    ARRAY['Full-grain Moroccan leather','Solid brass front zipper','Leather tassel pull','Cream contrast saddle-stitching','Hand saddle-stitched in Marrakech']::text[],
    '{"size":"38cm × 32cm × 14cm · vertical-zip rucksack"}'::jsonb,
    ARRAY[
      storage_url||'/tadelakt-rucksack-cognac/tadelakt-rucksack-cognac-pdp-white.webp',
      storage_url||'/tadelakt-rucksack-cognac/tadelakt-rucksack-cognac-archive-1.webp',
      storage_url||'/tadelakt-rucksack-cognac/tadelakt-rucksack-cognac-archive-2.webp',
      storage_url||'/tadelakt-rucksack-cognac/tadelakt-rucksack-cognac-archive-3.webp',
      storage_url||'/tadelakt-rucksack-cognac/tadelakt-rucksack-cognac-archive-4.webp',
      storage_url||'/tadelakt-rucksack-cognac/tadelakt-rucksack-cognac-archive-5.webp',
      storage_url||'/tadelakt-rucksack-cognac/tadelakt-rucksack-cognac-archive-6.webp',
      storage_url||'/tadelakt-rucksack-cognac/tadelakt-rucksack-cognac-archive-7.webp',
      storage_url||'/tadelakt-rucksack-cognac/tadelakt-rucksack-cognac-archive-8.webp'
    ]::text[],
    14,
    2.4
  ),
  (
    'safran-tote-cognac',
    'Safran Tote · Cognac',
    24500,
    'Leather Goods',
    'available',
    true,
    'East-west day tote in saffron-warm cognac leather. Two parallel rolled handles, a single center spine seam, open top. Carries a 13" laptop and a slim book. Softens into the body over months of carry.',
    ARRAY['Full-grain Moroccan leather','Dual parallel rolled handles','Center spine seam (front + back)','Hand saddle-stitched in Marrakech']::text[],
    '{"size":"38cm × 32cm × 12cm · east-west tote"}'::jsonb,
    ARRAY[
      storage_url||'/safran-tote-cognac/safran-tote-cognac-pdp-white.webp',
      storage_url||'/safran-tote-cognac/safran-tote-cognac-archive-1.webp',
      storage_url||'/safran-tote-cognac/safran-tote-cognac-archive-2.webp',
      storage_url||'/safran-tote-cognac/safran-tote-cognac-archive-3.webp',
      storage_url||'/safran-tote-cognac/safran-tote-cognac-archive-4.webp',
      storage_url||'/safran-tote-cognac/safran-tote-cognac-archive-5.webp',
      storage_url||'/safran-tote-cognac/safran-tote-cognac-archive-6.webp',
      storage_url||'/safran-tote-cognac/safran-tote-cognac-archive-7.webp',
      storage_url||'/safran-tote-cognac/safran-tote-cognac-archive-8.webp'
    ]::text[],
    20,
    1.8
  ),
  (
    'rif-rucksack-tan',
    'Rif Heritage Rucksack · Tan',
    28500,
    'Leather Goods',
    'available',
    true,
    'Heritage classic rucksack in soft tan full-grain leather. Twin buckled front pockets, drawstring inner closure under a flap, cream contrast saddle-stitch throughout. Built like field gear, finished like maison goods.',
    ARRAY['Full-grain tan Moroccan leather','Twin front buckled pockets','Drawstring closure under flap','Cream contrast saddle-stitch','Hand saddle-stitched in Marrakech']::text[],
    '{"size":"40cm × 32cm × 16cm · classic flap rucksack"}'::jsonb,
    ARRAY[
      storage_url||'/rif-rucksack-tan/rif-rucksack-tan-pdp-white.webp',
      storage_url||'/rif-rucksack-tan/rif-rucksack-tan-archive-1.webp',
      storage_url||'/rif-rucksack-tan/rif-rucksack-tan-archive-2.webp',
      storage_url||'/rif-rucksack-tan/rif-rucksack-tan-archive-3.webp',
      storage_url||'/rif-rucksack-tan/rif-rucksack-tan-archive-4.webp',
      storage_url||'/rif-rucksack-tan/rif-rucksack-tan-archive-5.webp',
      storage_url||'/rif-rucksack-tan/rif-rucksack-tan-archive-6.webp',
      storage_url||'/rif-rucksack-tan/rif-rucksack-tan-archive-7.webp',
      storage_url||'/rif-rucksack-tan/rif-rucksack-tan-archive-8.webp'
    ]::text[],
    16,
    2.8
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  materials = EXCLUDED.materials,
  dimensions = EXCLUDED.dimensions,
  images = EXCLUDED.images,
  available_quantity = EXCLUDED.available_quantity,
  weight_lbs = EXCLUDED.weight_lbs,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured,
  updated_at = NOW();

END $$;
