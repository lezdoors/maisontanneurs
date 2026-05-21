-- Catalogue audit reform — migrate all drop-01 SKUs to canonical hero naming.
-- Apply AFTER running scripts/rename-storage-assets.ts so the Storage rename
-- completes before the DB references the new URLs.
--
-- Naming canon (matches scripts/audit-catalogue.ts):
--   <slug>-scale.webp       lifestyle hero, position [0] when present
--   <slug>-pdp-white.webp   cyclorama hero, position [0] fallback
--   <slug>-archive-N.webp   supplier raws + gallery + alts, position [2+]
--
-- rolltop-daypack is demoted to status='draft' here because all 3 of its
-- legacy heroes were supplier-pile / souk-worn raws — not catalogue grade.
-- Re-publish after HF re-shoot lands by reversing status + featured flips.

begin;

-- Extend products.status enum to allow 'draft' (covers SKUs awaiting a clean
-- re-shoot — see rolltop-daypack below). Required before the rolltop UPDATE.
alter table products drop constraint if exists products_status_check;
alter table products
  add constraint products_status_check
  check (status in ('available', 'sold', 'reserved', 'draft'));

-- heritage-rucksack — lifestyle hero exists, becomes scale
update products
set images = array[
  'https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-01/heritage-rucksack-scale.webp',
  'https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-01/heritage-rucksack-archive-1.webp',
  'https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-01/heritage-rucksack-archive-2.webp'
]
where slug = 'heritage-rucksack';

-- rolltop-daypack — demote until clean HF heroes land
update products
set images = array[]::text[],
    status = 'draft',
    featured = false
where slug = 'rolltop-daypack';

-- black-stitched-backpack — cyclorama only (awaiting scale shot)
update products
set images = array[
  'https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-01/black-stitched-backpack-pdp-white.webp',
  'https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-01/black-stitched-backpack-archive-1.webp',
  'https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-01/black-stitched-backpack-archive-2.webp',
  'https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-01/black-stitched-backpack-archive-3.webp',
  'https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-01/black-stitched-backpack-archive-4.webp'
]
where slug = 'black-stitched-backpack';

-- cognac-brogue-backpack — cyclorama only (awaiting scale shot)
update products
set images = array[
  'https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-01/cognac-brogue-backpack-pdp-white.webp',
  'https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-01/cognac-brogue-backpack-archive-1.webp',
  'https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-01/cognac-brogue-backpack-archive-2.webp'
]
where slug = 'cognac-brogue-backpack';

-- classic-cognac-satchel — cyclorama only (awaiting scale shot)
update products
set images = array[
  'https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-01/classic-cognac-satchel-pdp-white.webp',
  'https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-01/classic-cognac-satchel-archive-1.webp',
  'https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-01/classic-cognac-satchel-archive-2.webp',
  'https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-01/classic-cognac-satchel-archive-3.webp'
]
where slug = 'classic-cognac-satchel';

-- woven-leather-backpack — cyclorama only (awaiting scale shot)
update products
set images = array[
  'https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-01/woven-leather-backpack-pdp-white.webp',
  'https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-01/woven-leather-backpack-archive-1.webp'
]
where slug = 'woven-leather-backpack';

-- vintage-buckle-backpack — cyclorama only (awaiting scale shot)
update products
set images = array[
  'https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-01/vintage-buckle-backpack-pdp-white.webp',
  'https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-01/vintage-buckle-backpack-archive-1.webp'
]
where slug = 'vintage-buckle-backpack';

commit;
