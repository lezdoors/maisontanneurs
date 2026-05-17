// Higgsfield generation archiver
//
// Mirrors every HF generation we've fired into a Drive-synced backup folder,
// with proper slug-based filenames derived from the prompt. Solves three
// problems at once:
//   1. No more hf_*.png clutter — every file is meaningfully named on download
//   2. Full local backup against HF account loss
//   3. Sidecar JSON per asset preserves the full prompt + params for re-firing
//
// Usage:
//   pnpm tsx scripts/hf-archive.ts <path-to-generations-dump.json>
//
// The dump file is produced by saving the output of mcp__claude_ai_Higgsfield__show_generations
// (paginated). Each run is incremental — already-archived IDs are skipped via
// the state file at the archive root.

import fs from "fs";
import path from "path";
import https from "https";

const ARCHIVE_DIR =
  process.env.HF_ARCHIVE_DIR ||
  "/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/HF Archive/maison-izem";

const STATE_FILE = path.join(ARCHIVE_DIR, ".state.json");
const INPUT_JSON = process.argv[2];

interface Generation {
  id: string;
  type: "image" | "video" | string;
  status: string;
  model: string;
  params: { prompt?: string; [k: string]: unknown };
  results?: { rawUrl?: string; minUrl?: string };
  createdAt: number;
}

// Distinctive subject + scene detector. Looks for the SUBJECT of the image
// (product family, scene type, time of day), not the boilerplate opener
// shared across every wide-establishing prompt.

const PRODUCT_KEYWORDS: [RegExp, string][] = [
  // Pouf / cushion families (require explicit "poufs" word — "cluster of five" alone is ambiguous)
  [/five .{0,40}?poufs|cluster of five poufs|5 poufs|five hand-(stitched|embroidered)/i, "5poufs"],
  [/three .{0,40}?poufs|cluster of three poufs|3 poufs/i, "3poufs"],
  [/two .{0,40}?(tobacco|caramel|leather).{0,20}?poufs|two .{0,30}?poufs/i, "2poufs"],
  [/single .*?(sabra|silk).*?pouf/i, "sabra-pouf"],
  [/single .*?leather pouf/i, "leather-pouf"],
  [/floor cushion|sahara cushion|mguild cushion/i, "cushion"],
  // Tables / coffee tables
  [/three .*?octagonal coffee tables|cluster of three .*?coffee tables/i, "octogonale-cluster"],
  [/two-tier .*?coffee table|tiered coffee table/i, "mop-coffee-table"],
  [/octagonal coffee table|brass.inlay glass.top/i, "octogonale-coffee-table"],
  [/silver.*?octagonal|fadda.*?octogonale/i, "fadda-octogonale"],
  [/octagonal side table|side table.*?inlay/i, "octogonale-side-table"],
  [/dining table|outdoor dining|long blackened-cedar/i, "dining-table"],
  // Lanterns / pendants
  [/cluster of .*?pendant lanterns|pendant lanterns at staggered/i, "pendant-cluster"],
  [/pierced-brass moroccan pendant|brass pendant/i, "pendant"],
  [/lantern .*?pedestal|moroccan lantern/i, "lantern"],
  // Furniture
  [/throne chair|arsh.*?throne/i, "arsh-throne"],
  [/painted chest|nakch.*?commode/i, "nakch-commode"],
  [/painted dresser|silver-embossed/i, "painted-dresser"],
  [/silver vanity|nakch.*?coiffeuse/i, "nakch-coiffeuse"],
  [/silver chest|fadda.*?commode/i, "fadda-commode"],
  [/hammam fountain|saqayah/i, "saqayah-cuivre"],
  [/throne|banquette|sedari/i, "banquette"],
  // Ceramics
  [/hand-thrown moroccan ceramics|tableware/i, "ceramics"],
  [/tagine/i, "tagine"],
  [/beldi (cup|glass)/i, "beldi"],
  // Architectural scenes (no product anchor)
  [/spa courtyard|water channel|reflective.*?channel/i, "spa-courtyard"],
  [/riad salon|moroccan salon|salon at/i, "salon"],
  [/atelier|workshop/i, "atelier"],
  [/villa terrace|cliff-top.*?terrace|cliff.top terrace/i, "villa-terrace"],
  // Canvases / art
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

function slugifyPrompt(prompt: string, _maxWords = 8): string {
  if (!prompt) return "untitled";
  const products = detectKeywords(prompt, PRODUCT_KEYWORDS).slice(0, 2);
  const times = detectKeywords(prompt, TIME_KEYWORDS).slice(0, 1);
  const compositions = detectKeywords(prompt, COMPOSITION_KEYWORDS).slice(0, 1);
  const parts = [...products, ...times, ...compositions].filter(Boolean);
  if (parts.length === 0) {
    // Fallback: first 5 meaningful words
    const STOP = new Set(["a","an","the","of","in","on","at","to","for","with","and","or","is","are","was","were","this","that"]);
    const words = prompt
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter((w) => w && !STOP.has(w) && w.length > 2)
      .slice(0, 5);
    return words.join("-").slice(0, 60) || "untitled";
  }
  return parts.join("_").slice(0, 60);
}

function formatTimestamp(unixSeconds: number): string {
  const d = new Date(unixSeconds * 1000);
  return d.toISOString().replace(/[:.]/g, "-").slice(0, 19);
}

function downloadFile(url: string, dst: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const tmp = dst + ".part";
    const file = fs.createWriteStream(tmp);
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          file.close();
          fs.unlink(tmp, () => {});
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        res.pipe(file);
        file.on("finish", () => {
          file.close(() => {
            fs.renameSync(tmp, dst);
            resolve(fs.statSync(dst).size);
          });
        });
      })
      .on("error", (err) => {
        file.close();
        fs.unlink(tmp, () => {});
        reject(err);
      });
  });
}

interface State { done: string[] }

async function main() {
  if (!INPUT_JSON || !fs.existsSync(INPUT_JSON)) {
    console.error("Usage: pnpm tsx scripts/hf-archive.ts <generations-dump.json>");
    console.error("");
    console.error("The dump is the JSON output of mcp__claude_ai_Higgsfield__show_generations");
    console.error("(paginated via cursor to get all generations).");
    process.exit(1);
  }

  fs.mkdirSync(ARCHIVE_DIR, { recursive: true });

  let state: State = { done: [] };
  if (fs.existsSync(STATE_FILE)) {
    state = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  }
  const doneSet = new Set(state.done);

  const raw = fs.readFileSync(INPUT_JSON, "utf8");
  const parsed = JSON.parse(raw);
  // Accept either a raw items[] array or the full MCP response object
  const items: Generation[] = Array.isArray(parsed)
    ? parsed
    : (parsed.items || parsed.generations || []);

  console.log(`Archive dir: ${ARCHIVE_DIR}`);
  console.log(`Input: ${INPUT_JSON} — ${items.length} generations`);
  console.log(`Already archived: ${doneSet.size}`);
  console.log("");

  let archived = 0;
  let skipped = 0;
  let failed = 0;

  for (const gen of items) {
    if (doneSet.has(gen.id)) {
      skipped++;
      continue;
    }
    if (gen.status !== "completed") {
      continue;
    }
    if (!gen.results?.rawUrl) {
      continue;
    }

    const slug = slugifyPrompt((gen.params.prompt as string) || gen.model);
    const ts = formatTimestamp(gen.createdAt);
    const ext = gen.type === "video" ? "mp4" : "png";
    const filename = `${ts}_${gen.model}_${slug}.${ext}`;
    const dst = path.join(ARCHIVE_DIR, filename);
    const sidecarPath = dst + ".json";

    if (fs.existsSync(dst)) {
      // Already on disk but not in state — backfill state and continue
      doneSet.add(gen.id);
      skipped++;
      continue;
    }

    try {
      const sz = await downloadFile(gen.results.rawUrl, dst);
      fs.writeFileSync(
        sidecarPath,
        JSON.stringify(
          {
            id: gen.id,
            model: gen.model,
            createdAt: gen.createdAt,
            createdAtIso: new Date(gen.createdAt * 1000).toISOString(),
            type: gen.type,
            prompt: gen.params.prompt,
            params: gen.params,
            rawUrl: gen.results.rawUrl,
          },
          null,
          2,
        ),
      );
      doneSet.add(gen.id);
      archived++;
      console.log(`  ✓ ${filename} (${(sz / 1024).toFixed(0)}KB)`);
    } catch (e) {
      failed++;
      console.error(`  ✗ ${gen.id}: ${(e as Error).message}`);
    }
  }

  fs.writeFileSync(STATE_FILE, JSON.stringify({ done: Array.from(doneSet) }, null, 2));

  console.log("");
  console.log(`Archived: ${archived}, Skipped: ${skipped}, Failed: ${failed}, Total tracked: ${doneSet.size}`);
}

main().catch((e) => {
  console.error("Crashed:", e);
  process.exit(2);
});
