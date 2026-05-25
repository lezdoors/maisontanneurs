-- Re-categorize Drop 01 SKUs from "Leather Goods" into proper sub-families
-- so the products page filter (Backpack / Crossbody / Tote / Weekender /
-- Satchel) returns real results.
--
-- Aligns with the Families section on the homepage and the Footer
-- Collection links.

UPDATE products SET category = 'Backpack' WHERE slug IN (
  'heritage-rucksack',
  'rolltop-daypack',
  'black-stitched-backpack',
  'cognac-brogue-backpack',
  'woven-leather-backpack',
  'vintage-buckle-backpack',
  'explorer-rolltop-cognac',
  'medina-rucksack-drawstring'
);

UPDATE products SET category = 'Crossbody' WHERE slug IN (
  'medina-crossbody-envelope'
);

UPDATE products SET category = 'Weekender' WHERE slug IN (
  'atlas-kilim-duffle'
);

UPDATE products SET category = 'Satchel' WHERE slug IN (
  'classic-cognac-satchel'
);
