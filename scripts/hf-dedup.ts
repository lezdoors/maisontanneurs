// Dedupe HF archive — groups gens by scene slug, keeps the best variant in the
// main folder, moves duplicates to _variants/. Nothing deleted.
//
// Selection priority (highest wins):
//   1. seedream_v5_lite at 5K (ultra) — best quality, native widescreen
//   2. seedream_v4_5 — high quality fallback
//   3. nano_banana_2 — strong tight-prompt adherence
//   4. nano_banana_flash — faster/cheaper variant
//   5. kling models — second-tier image quality
//   6. seedance — videos kept separately (mp4)
//
// Usage:
//   pnpm tsx scripts/hf-dedup.ts --report      # list groups, no changes
//   pnpm tsx scripts/hf-dedup.ts --apply       # move non-best variants to _variants/

import fs from "fs";
import path from "path";

const ARCHIVE_DIR =
  process.env.HF_ARCHIVE_DIR ||
  "/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/HF Archive/maison-izem";
const VARIANTS_DIR = path.join(ARCHIVE_DIR, "_variants");

const APPLY = process.argv.includes("--apply");
const REPORT = process.argv.includes("--report") || !APPLY;

// Higher score = better. Used to rank within a duplicate group.
function modelScore(model: string): number {
  if (model.includes("seedream_v5") || model.includes("seedream")) return 100;
  if (model.includes("seedream_v4")) return 90;
  if (model.includes("flux")) return 85;
  if (model.includes("nano_banana_2")) return 80;
  if (model.includes("nano_banana_flash") || model.includes("nano")) return 70;
  if (model.includes("kling3")) return 65;
  if (model.includes("kling")) return 60;
  if (model.includes("seedance")) return 95; // videos — high priority
  if (model.includes("cinematic_studio")) return 75;
  return 50;
}

// Bigger file size = higher resolution = ultra mode usually. Tiebreaker.
function sizeBonus(filePath: string): number {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return 0;
  }
}

interface FileEntry {
  name: string;
  ts: string;
  model: string;
  slug: string;
  ext: string;
}

function parseFilename(name: string): FileEntry | null {
  // <ISO-ts>_<model>_<slug>.<ext>
  const m = name.match(/^(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2})_(.+?)_(.+)\.(png|mp4|webp|jpg)$/);
  if (!m) return null;
  return { name, ts: m[1], model: m[2], slug: m[3], ext: m[4] };
}

function main() {
  if (!fs.existsSync(ARCHIVE_DIR)) {
    console.error(`Archive dir not found: ${ARCHIVE_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(ARCHIVE_DIR)
    .filter((f) => !f.startsWith(".") && !f.endsWith(".json") && !f.endsWith(".part"))
    .map(parseFilename)
    .filter((e): e is FileEntry => e !== null);

  // Group by slug + extension (images and videos as separate groups)
  const groups = new Map<string, FileEntry[]>();
  for (const f of files) {
    const key = `${f.slug}.${f.ext}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(f);
  }

  // Filter to groups with > 1 file (actual duplicates)
  const dupGroups = Array.from(groups.entries())
    .filter(([_, files]) => files.length > 1)
    .sort((a, b) => b[1].length - a[1].length); // largest groups first

  console.log(`Total files: ${files.length}`);
  console.log(`Unique slugs: ${groups.size}`);
  console.log(`Duplicate groups: ${dupGroups.length}`);
  console.log(`Files to move to _variants/: ${dupGroups.reduce((s, [, fs]) => s + fs.length - 1, 0)}`);
  console.log("");

  let moved = 0;

  for (const [key, members] of dupGroups) {
    // Rank: model score primary, file size secondary (bigger = higher res usually)
    const ranked = members
      .map((f) => ({
        f,
        score: modelScore(f.model),
        bytes: sizeBonus(path.join(ARCHIVE_DIR, f.name)),
      }))
      .sort((a, b) => b.score - a.score || b.bytes - a.bytes);

    const winner = ranked[0];
    const losers = ranked.slice(1);

    console.log(`[${key}] — ${members.length} variants`);
    console.log(`  KEEP: ${winner.f.name} (${winner.f.model}, ${(winner.bytes / 1024 / 1024).toFixed(1)}MB)`);
    for (const l of losers) {
      console.log(`  move: ${l.f.name} (${l.f.model}, ${(l.bytes / 1024 / 1024).toFixed(1)}MB)`);
      if (APPLY) {
        fs.mkdirSync(VARIANTS_DIR, { recursive: true });
        const oldAsset = path.join(ARCHIVE_DIR, l.f.name);
        const newAsset = path.join(VARIANTS_DIR, l.f.name);
        const oldSidecar = oldAsset + ".json";
        const newSidecar = newAsset + ".json";
        fs.renameSync(oldAsset, newAsset);
        if (fs.existsSync(oldSidecar)) fs.renameSync(oldSidecar, newSidecar);
        moved++;
      }
    }
    console.log("");
  }

  if (REPORT && !APPLY) {
    console.log(`Report mode. Run with --apply to move ${dupGroups.reduce((s, [, fs]) => s + fs.length - 1, 0)} variants to _variants/`);
  } else {
    console.log(`Moved ${moved} variants to _variants/`);
  }
}

main();
