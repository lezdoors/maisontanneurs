// One-shot migration — renames drop-01 hero/gallery WebPs to canonical
// scale / pdp-white / archive-N naming. Idempotent: if a source object is
// already gone (already renamed), it skips that line and continues.
//
// Run: SUPABASE_SERVICE_ROLE_KEY=... pnpm tsx scripts/rename-storage-assets.ts
//
// After this completes successfully, run `pnpm audit:catalogue` to confirm
// every URL HEAD-checks at 200 and the catalogue passes deploy gate.

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://xbtabpurfavngwmwtawc.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error("SUPABASE_SERVICE_ROLE_KEY is required.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const BUCKET = "products";

// Each row: [oldPath, newPath]. Paths are inside the bucket.
// Order: hero first (scale or pdp-white), then archive frames in original order.
const MOVES: Array<[string, string]> = [
  // heritage-rucksack — lifestyle hero at -01-v2
  ["drop-01/heritage-rucksack-01-v2.webp", "drop-01/heritage-rucksack-scale.webp"],
  ["drop-01/heritage-rucksack-02-v2.webp", "drop-01/heritage-rucksack-archive-1.webp"],
  ["drop-01/heritage-rucksack-03.webp", "drop-01/heritage-rucksack-archive-2.webp"],

  // black-stitched-backpack — cyclorama hero at -01, 4 alt frames
  ["drop-01/black-stitched-backpack-01.webp", "drop-01/black-stitched-backpack-pdp-white.webp"],
  ["drop-01/black-stitched-backpack-02.webp", "drop-01/black-stitched-backpack-archive-1.webp"],
  ["drop-01/black-stitched-backpack-03.webp", "drop-01/black-stitched-backpack-archive-2.webp"],
  ["drop-01/black-stitched-backpack-04.webp", "drop-01/black-stitched-backpack-archive-3.webp"],
  ["drop-01/black-stitched-backpack-05.webp", "drop-01/black-stitched-backpack-archive-4.webp"],

  // cognac-brogue-backpack — cyclorama hero
  ["drop-01/cognac-brogue-backpack-01.webp", "drop-01/cognac-brogue-backpack-pdp-white.webp"],
  ["drop-01/cognac-brogue-backpack-02.webp", "drop-01/cognac-brogue-backpack-archive-1.webp"],
  ["drop-01/cognac-brogue-backpack-03.webp", "drop-01/cognac-brogue-backpack-archive-2.webp"],

  // classic-cognac-satchel — cyclorama hero
  ["drop-01/classic-cognac-satchel-01.webp", "drop-01/classic-cognac-satchel-pdp-white.webp"],
  ["drop-01/classic-cognac-satchel-02.webp", "drop-01/classic-cognac-satchel-archive-1.webp"],
  ["drop-01/classic-cognac-satchel-03.webp", "drop-01/classic-cognac-satchel-archive-2.webp"],
  ["drop-01/classic-cognac-satchel-04.webp", "drop-01/classic-cognac-satchel-archive-3.webp"],

  // woven-leather-backpack — cyclorama hero
  ["drop-01/woven-leather-backpack-01.webp", "drop-01/woven-leather-backpack-pdp-white.webp"],
  ["drop-01/woven-leather-backpack-02.webp", "drop-01/woven-leather-backpack-archive-1.webp"],

  // vintage-buckle-backpack — cyclorama hero
  ["drop-01/vintage-buckle-backpack-01.webp", "drop-01/vintage-buckle-backpack-pdp-white.webp"],
  ["drop-01/vintage-buckle-backpack-02.webp", "drop-01/vintage-buckle-backpack-archive-1.webp"],

  // rolltop-daypack — all 3 originals were supplier-pile/souk-worn raws,
  // not catalogue-grade. SKU demoted to status=draft in DB. Leave the
  // legacy files in place under their old names for ops reference; they
  // won't be referenced anywhere after the DB migration.
];

async function exists(path: string): Promise<boolean> {
  const dir = path.split("/").slice(0, -1).join("/");
  const name = path.split("/").pop();
  const { data, error } = await supabase.storage.from(BUCKET).list(dir, {
    limit: 1000,
    search: name,
  });
  if (error) return false;
  return (data ?? []).some((f) => f.name === name);
}

async function main() {
  let moved = 0;
  let skipped = 0;
  let failed = 0;

  for (const [from, to] of MOVES) {
    const srcExists = await exists(from);
    const dstExists = await exists(to);

    if (!srcExists && dstExists) {
      console.log(`SKIP  ${from}  →  ${to}  (already renamed)`);
      skipped++;
      continue;
    }
    if (!srcExists && !dstExists) {
      console.log(`MISS  ${from}  →  ${to}  (neither exists — investigate)`);
      failed++;
      continue;
    }
    if (srcExists && dstExists) {
      console.log(`WARN  ${from}  →  ${to}  (both exist — manual cleanup of source)`);
      skipped++;
      continue;
    }

    const { error } = await supabase.storage.from(BUCKET).move(from, to);
    if (error) {
      console.log(`FAIL  ${from}  →  ${to}  (${error.message})`);
      failed++;
    } else {
      console.log(`✓     ${from}  →  ${to}`);
      moved++;
    }
  }

  console.log(`\nDone. moved=${moved} skipped=${skipped} failed=${failed}`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
