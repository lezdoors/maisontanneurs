// Rename existing HF archive files using the improved slugifyPrompt detector.
// Reads sidecar .json for each archived asset, recomputes the slug from the prompt,
// renames both the asset and its sidecar to the new name.
//
// Safe: only renames within the same Drive folder; preserves timestamp prefix.
// Idempotent: skips files whose computed slug matches the current name.
//
// Run: pnpm tsx scripts/hf-rerename.ts

import fs from "fs";
import path from "path";

const ARCHIVE_DIR =
  process.env.HF_ARCHIVE_DIR ||
  "/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/HF Archive/maison-izem";

// Import the slugifier from hf-archive
import { fileURLToPath } from "url";
// Dynamic import is finicky — replicate the function inline.

const PRODUCT_KEYWORDS: [RegExp, string][] = [
  [/five .{0,40}?poufs|cluster of five poufs|5 poufs|five hand-(stitched|embroidered)/i, "5poufs"],
  [/three .{0,40}?poufs|cluster of three poufs|3 poufs/i, "3poufs"],
  [/two .{0,40}?(tobacco|caramel|leather).{0,20}?poufs|two .{0,30}?poufs/i, "2poufs"],
  [/single .*?(sabra|silk).*?pouf/i, "sabra-pouf"],
  [/single .*?leather pouf/i, "leather-pouf"],
  [/floor cushion|sahara cushion|mguild cushion/i, "cushion"],
  [/three .*?octagonal coffee tables|cluster of three .*?coffee tables/i, "octogonale-cluster"],
  [/two-tier .*?coffee table|tiered coffee table/i, "mop-coffee-table"],
  [/octagonal coffee table|brass.inlay glass.top/i, "octogonale-coffee-table"],
  [/silver.*?octagonal|fadda.*?octogonale/i, "fadda-octogonale"],
  [/octagonal side table|side table.*?inlay/i, "octogonale-side-table"],
  [/dining table|outdoor dining|long blackened-cedar/i, "dining-table"],
  [/cluster of .*?pendant lanterns|pendant lanterns at staggered/i, "pendant-cluster"],
  [/pierced-brass moroccan pendant|brass pendant/i, "pendant"],
  [/lantern .*?pedestal|moroccan lantern/i, "lantern"],
  [/throne chair|arsh.*?throne/i, "arsh-throne"],
  [/painted chest|nakch.*?commode/i, "nakch-commode"],
  [/painted dresser|silver-embossed/i, "painted-dresser"],
  [/silver vanity|nakch.*?coiffeuse/i, "nakch-coiffeuse"],
  [/silver chest|fadda.*?commode/i, "fadda-commode"],
  [/hammam fountain|saqayah/i, "saqayah-cuivre"],
  [/throne|banquette|sedari/i, "banquette"],
  [/hand-thrown moroccan ceramics|tableware/i, "ceramics"],
  [/tagine/i, "tagine"],
  [/beldi (cup|glass)/i, "beldi"],
  [/spa courtyard|water channel|reflective.*?channel/i, "spa-courtyard"],
  [/riad salon|moroccan salon|salon at/i, "salon"],
  [/atelier|workshop/i, "atelier"],
  [/villa terrace|cliff-top.*?terrace|cliff.top terrace/i, "villa-terrace"],
  [/(canvas|painting) .*?(tuareg|camel|hooded|figure|alley)/i, "art-canvas"],
];
const TIME_KEYWORDS: [RegExp, string][] = [
  [/blue hour/i, "blue-hour"],
  [/golden hour|sunset|warm amber/i, "golden-hour"],
  [/dusk|twilight/i, "dusk"],
  [/midday|noon|high midday/i, "midday"],
  [/morning|dawn|sunrise/i, "morning"],
  [/dusk-to-night|to dusk/i, "dusk-to-night"],
];
const COMPOSITION_KEYWORDS: [RegExp, string][] = [
  [/dolly.in|push.in/i, "dolly-in"],
  [/dolly.back|pull.back|pull.out/i, "dolly-back"],
  [/wide cinematic|wide establishing|ultra wide/i, "wide"],
  [/macro|close.up|extreme close/i, "macro"],
  [/horseshoe arch|arched opening|keyhole arch/i, "arch"],
  [/pdp.white|cream backdrop|cyclorama/i, "pdp-white"],
  [/scale shot|in-room|lifestyle/i, "scale"],
];
function detectKeywords(prompt: string, table: [RegExp, string][]): string[] {
  const hits = new Set<string>();
  for (const [re, slug] of table) {
    if (re.test(prompt)) hits.add(slug);
  }
  return Array.from(hits);
}
function slugifyPrompt(prompt: string): string {
  if (!prompt) return "untitled";
  const products = detectKeywords(prompt, PRODUCT_KEYWORDS).slice(0, 2);
  const times = detectKeywords(prompt, TIME_KEYWORDS).slice(0, 1);
  const compositions = detectKeywords(prompt, COMPOSITION_KEYWORDS).slice(0, 1);
  const parts = [...products, ...times, ...compositions].filter(Boolean);
  if (parts.length === 0) {
    const STOP = new Set(["a","an","the","of","in","on","at","to","for","with","and","or","is","are","was","were","this","that"]);
    return prompt.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((w) => w && !STOP.has(w) && w.length > 2).slice(0, 5).join("-").slice(0, 60) || "untitled";
  }
  return parts.join("_").slice(0, 60);
}

function main() {
  if (!fs.existsSync(ARCHIVE_DIR)) {
    console.error(`Archive dir not found: ${ARCHIVE_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(ARCHIVE_DIR);
  // Match the existing naming pattern: <ISO-ts>_<model>_<slug>.<ext>
  const pattern = /^(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2})_(.+?)_(.+)\.(png|mp4|webp|jpg)$/;

  let renamed = 0;
  let alreadyOk = 0;
  let skipped = 0;

  for (const fname of files) {
    if (fname.endsWith(".json") || fname.startsWith(".") || fname.endsWith(".part")) continue;
    const m = fname.match(pattern);
    if (!m) {
      skipped++;
      continue;
    }
    const [, ts, model, _oldSlug, ext] = m;
    const sidecarPath = path.join(ARCHIVE_DIR, fname + ".json");
    if (!fs.existsSync(sidecarPath)) {
      skipped++;
      continue;
    }
    let prompt = "";
    try {
      const sidecar = JSON.parse(fs.readFileSync(sidecarPath, "utf8"));
      prompt = sidecar.prompt || "";
    } catch {
      skipped++;
      continue;
    }

    const newSlug = slugifyPrompt(prompt);
    const newName = `${ts}_${model}_${newSlug}.${ext}`;
    if (newName === fname) {
      alreadyOk++;
      continue;
    }
    const oldAsset = path.join(ARCHIVE_DIR, fname);
    const newAsset = path.join(ARCHIVE_DIR, newName);
    const newSidecar = path.join(ARCHIVE_DIR, newName + ".json");

    if (fs.existsSync(newAsset)) {
      console.log(`  ⚠ collision: ${newName} already exists, skipping ${fname}`);
      skipped++;
      continue;
    }
    fs.renameSync(oldAsset, newAsset);
    fs.renameSync(sidecarPath, newSidecar);
    console.log(`  ${fname.slice(0, 60)}... → ${newName}`);
    renamed++;
  }

  console.log("");
  console.log(`Renamed: ${renamed}, Already-correct: ${alreadyOk}, Skipped: ${skipped}`);
}

main();
