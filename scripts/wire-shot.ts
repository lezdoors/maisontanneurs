// Wire a freshly-generated HF shot into the catalogue.
//
// Run: SUPABASE_SERVICE_ROLE_KEY=... pnpm tsx scripts/wire-shot.ts \
//        --slug <db-slug> \
//        --file <local-path-to-webp> \
//        --kind <scale|pdp-white|archive>
//
// What it does (idempotent):
//   1. Uploads <file> to Supabase Storage under products/drop-02/<slug>-<kind>.webp
//      (or -archive-N.webp where N is the next free index for that slug).
//   2. Updates products.images[] respecting the locked hero rule:
//      pdp-white/Drive Hero-derived image at [0], scale at [1], archives after.
//   3. If wiring a scale shot for a slug in AWAITING_SCALE_SHOTS, prints
//      a reminder to remove the slug from scripts/audit-catalogue.ts.
//   4. Re-runs `pnpm audit:catalogue` and exits non-zero if audit fails.
//
// Assumes the file is already encoded as WebP q=82 at the right resolution
// (1200×1200 for pdp-white, 2400×3200 for scale). This script does not
// re-encode — it expects the user to have run `cwebp -q 82 ...` first.

import { createClient } from "@supabase/supabase-js";
import { readFile, stat } from "node:fs/promises";
import { basename } from "node:path";
import { spawnSync } from "node:child_process";
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

const BUCKET = "products";

type Kind = "scale" | "pdp-white" | "archive";

function parseArgs(): { slug: string; file: string; kind: Kind } {
  const argv = process.argv.slice(2);
  const get = (flag: string): string | undefined => {
    const idx = argv.indexOf(flag);
    return idx >= 0 ? argv[idx + 1] : undefined;
  };
  const slug = get("--slug");
  const file = get("--file");
  const kind = get("--kind") as Kind | undefined;
  if (!slug || !file || !kind) {
    console.error(
      "Usage: pnpm tsx scripts/wire-shot.ts --slug <slug> --file <path.webp> --kind <scale|pdp-white|archive>",
    );
    process.exit(2);
  }
  if (!["scale", "pdp-white", "archive"].includes(kind)) {
    console.error(`Bad kind: ${kind}. Must be scale, pdp-white, or archive.`);
    process.exit(2);
  }
  return { slug, file, kind };
}

type AnySupabase = ReturnType<typeof createClient<any, any, any>>;

async function nextArchiveIndex(supabase: AnySupabase, slug: string): Promise<number> {
  const { data, error } = await supabase.storage.from(BUCKET).list("drop-02", {
    limit: 1000,
    search: `${slug}-archive-`,
  });
  if (error || !data) return 1;
  const indices = data
    .map((f) => {
      const m = f.name.match(new RegExp(`^${slug}-archive-(\\d+)\\.webp$`));
      return m ? parseInt(m[1], 10) : 0;
    })
    .filter((n) => n > 0);
  return indices.length ? Math.max(...indices) + 1 : 1;
}

async function main() {
  const { slug, file, kind } = parseArgs();

  const fileStat = await stat(file).catch(() => null);
  if (!fileStat || !fileStat.isFile()) {
    console.error(`File not found: ${file}`);
    process.exit(2);
  }
  if (!file.endsWith(".webp")) {
    console.error(`Only .webp accepted. Got ${basename(file)}.`);
    process.exit(2);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });

  let storageName: string;
  if (kind === "archive") {
    const idx = await nextArchiveIndex(supabase, slug);
    storageName = `${slug}-archive-${idx}.webp`;
  } else {
    storageName = `${slug}-${kind}.webp`;
  }
  const storagePath = `drop-02/${storageName}`;
  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`;

  const bytes = await readFile(file);
  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, bytes, { contentType: "image/webp", upsert: true });
  if (uploadErr) {
    console.error(`Storage upload failed: ${uploadErr.message}`);
    process.exit(1);
  }
  console.log(`✓ uploaded ${storagePath}`);

  const { data: row, error: fetchErr } = await supabase
    .from("products")
    .select("images, featured, status")
    .eq("slug", slug)
    .single();
  if (fetchErr || !row) {
    console.error(`Could not fetch product row for slug=${slug}: ${fetchErr?.message}`);
    process.exit(1);
  }

  const current = ((row as { images?: string[] }).images ?? []) as string[];
  const without = current.filter((u) => !u.endsWith(`/${storageName}`));

  let next: string[];
  if (kind === "scale") {
    const withoutScale = without.filter((u) => !u.endsWith(`-scale.webp`));
    const heroIndex = withoutScale.findIndex((u) => u.endsWith(`-pdp-white.webp`));
    next = heroIndex >= 0
      ? [withoutScale[heroIndex], publicUrl, ...withoutScale.filter((_, i) => i !== heroIndex)]
      : [publicUrl, ...withoutScale];
  } else if (kind === "pdp-white") {
    const withoutHero = without.filter((u) => !u.endsWith(`-pdp-white.webp`));
    const scaleIndex = withoutHero.findIndex((u) => u.endsWith(`-scale.webp`));
    next = scaleIndex >= 0
      ? [publicUrl, withoutHero[scaleIndex], ...withoutHero.filter((_, i) => i !== scaleIndex)]
      : [publicUrl, ...withoutHero];
  } else {
    next = [...without, publicUrl];
  }

  const patch: Record<string, unknown> = { images: next };
  if ((row as { status?: string }).status === "draft" && (kind === "scale" || kind === "pdp-white")) {
    patch.status = "available";
    patch.featured = true;
    console.log(`✓ flipping ${slug} from draft → available + featured`);
  }

  const { error: updateErr } = await supabase
    .from("products")
    .update(patch)
    .eq("slug", slug);
  if (updateErr) {
    console.error(`DB update failed: ${updateErr.message}`);
    process.exit(1);
  }
  console.log(`✓ products[${slug}].images[] = ${next.length} entries`);

  if (kind === "scale") {
    const auditSrc = await readFile("scripts/audit-catalogue.ts", "utf-8");
    if (auditSrc.includes(`"${slug}"`) && /AWAITING_SCALE_SHOTS/.test(auditSrc)) {
      console.log(
        `\nReminder: remove "${slug}" from AWAITING_SCALE_SHOTS in scripts/audit-catalogue.ts — its lifestyle shot is now live.`,
      );
    }
  }

  console.log("\n--- Re-running catalogue audit ---");
  const r = spawnSync("pnpm", ["audit:catalogue"], { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
