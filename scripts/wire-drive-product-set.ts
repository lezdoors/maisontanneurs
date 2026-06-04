// Wire a finished Maison Tanneurs Drive/HF product folder into Supabase.
//
// Example:
//   SUPABASE_SERVICE_ROLE_KEY=... pnpm tsx scripts/wire-drive-product-set.ts \
//     --slug atlas-field-briefcase \
//     --source "/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/usable product pics/atlas-field-briefcase"
//
// Rules:
// - Source folder must be a finished HF/Drive product set, not supplier/raw screenshots.
// - PNG/JPG/WebP inputs are re-encoded to WebP before upload.
// - A source filename beginning with Hero- is the human-curated primary image.
//   It must become {slug}-pdp-white.webp and remain first everywhere.
//   Remaining shots become {slug}-pdp-02.webp ... up to {slug}-pdp-11.webp.

import { createClient } from "@supabase/supabase-js";
import { mkdtemp, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import { basename, join } from "node:path";
import sharp from "sharp";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://xbtabpurfavngwmwtawc.supabase.co";
const BUCKET = "products";
const STORAGE_FOLDER = "drop-02";

type Args = {
  slug: string;
  source: string;
  dryRun: boolean;
};

function usage(): never {
  console.error(
    'Usage: pnpm tsx scripts/wire-drive-product-set.ts --slug <slug> --source "<finished-folder>" [--dry-run]',
  );
  process.exit(2);
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const get = (flag: string) => {
    const idx = argv.indexOf(flag);
    return idx >= 0 ? argv[idx + 1] : undefined;
  };
  const slug = get("--slug");
  const source = get("--source");
  if (!slug || !source) usage();
  return { slug, source, dryRun: argv.includes("--dry-run") };
}

function sourcePriority(slug: string, filename: string): number {
  const lower = filename.toLowerCase();
  // Human-curated product folders use Hero-* as the mandatory primary image.
  // Do not let generic "white"/"hero" substrings outrank that explicit signal.
  if (lower.startsWith("hero-")) return 0;
  if (lower.includes("white")) return 1;
  if (lower.includes("hero")) return 2;

  const escaped = slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pdpMatch = lower.match(new RegExp(`${escaped}-pdp-(\\d+)\\.webp$`));
  if (pdpMatch) return 10 + Number(pdpMatch[1]);

  const looseNumber = lower.match(/(?:^|[\s_-])(\d+)\.(png|jpe?g|webp)$/);
  if (looseNumber) return 20 + Number(looseNumber[1]);

  return 999;
}

async function getSourceFiles(slug: string, source: string): Promise<string[]> {
  const dir = await stat(source).catch(() => null);
  if (!dir?.isDirectory()) {
    throw new Error(`Source folder not found: ${source}`);
  }

  const files = (await readdir(source))
    .filter((file) => /\.(png|jpe?g|webp)$/i.test(file))
    .filter((file) => !/screenshot|supplier|ouss?am|raw/i.test(file))
    .sort((a, b) => sourcePriority(slug, a) - sourcePriority(slug, b) || a.localeCompare(b));

  if (files.length === 0) {
    throw new Error(`No finished image files found in ${source}`);
  }

  return files.slice(0, 11).map((file) => join(source, file));
}

function destinationName(slug: string, index: number): string {
  if (index === 0) return `${slug}-pdp-white.webp`;
  return `${slug}-pdp-${String(index + 1).padStart(2, "0")}.webp`;
}

async function encodeToWebp(input: string, output: string) {
  await sharp(input)
    .rotate()
    .resize({
      width: 2400,
      height: 2400,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 84, effort: 5 })
    .toFile(output);
}

async function serviceRoleKey(): Promise<string> {
  const fromEnv = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SRK || "";
  if (fromEnv.trim()) return fromEnv.trim();

  const roccoPath =
    process.env.MT_SUPABASE_KEY_FILE ||
    join(homedir(), ".rocco", "maisontanneurs-supabase.json");
  try {
    const parsed = JSON.parse(await readFile(roccoPath, "utf8")) as Record<string, unknown>;
    const key =
      typeof parsed.service_role_key === "string"
        ? parsed.service_role_key
        : typeof parsed.SUPABASE_SERVICE_ROLE_KEY === "string"
          ? parsed.SUPABASE_SERVICE_ROLE_KEY
          : typeof parsed.srk === "string"
            ? parsed.srk
            : "";
    return key.trim();
  } catch {
    return "";
  }
}

async function main() {
  const args = parseArgs();
  const sourceFiles = await getSourceFiles(args.slug, args.source);
  const tempDir = await mkdtemp(join(tmpdir(), `mt-${args.slug}-`));

  try {
    const encoded = [];
    for (let i = 0; i < sourceFiles.length; i++) {
      const src = sourceFiles[i];
      const storageName = destinationName(args.slug, i);
      const out = join(tempDir, storageName);
      await encodeToWebp(src, out);
      const bytes = await readFile(out);
      encoded.push({
        source: src,
        storageName,
        storagePath: `${STORAGE_FOLDER}/${storageName}`,
        publicUrl: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${STORAGE_FOLDER}/${storageName}`,
        bytes,
      });
    }

    const manifest = encoded.map((item) => ({
      source: basename(item.source),
      storagePath: item.storagePath,
      publicUrl: item.publicUrl,
      bytes: item.bytes.length,
    }));

    if (args.dryRun) {
      console.log(JSON.stringify({ slug: args.slug, dryRun: true, manifest }, null, 2));
      return;
    }

    const key = await serviceRoleKey();
    if (!key) {
      await writeFile(join(tempDir, "manifest.json"), JSON.stringify(manifest, null, 2));
      throw new Error(
        "Supabase service-role key is required. Set SUPABASE_SERVICE_ROLE_KEY or SRK, or restore ~/.rocco/maisontanneurs-supabase.json.",
      );
    }

    const supabase = createClient(SUPABASE_URL, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    for (const item of encoded) {
      const { error } = await supabase.storage.from(BUCKET).upload(item.storagePath, item.bytes, {
        contentType: "image/webp",
        upsert: true,
        cacheControl: "31536000, immutable",
      });
      if (error) throw new Error(`Upload failed for ${item.storagePath}: ${error.message}`);
      console.log(`uploaded ${item.storagePath}`);
    }

    const nextImages = encoded.map((item) => item.publicUrl);
    const { error: updateError } = await supabase
      .from("products")
      .update({ images: nextImages })
      .eq("slug", args.slug);
    if (updateError) throw new Error(`DB update failed for ${args.slug}: ${updateError.message}`);

    console.log(JSON.stringify({ slug: args.slug, images: nextImages }, null, 2));
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
