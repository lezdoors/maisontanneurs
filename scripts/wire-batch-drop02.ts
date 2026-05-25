// One-shot uploader for the Drop 02 batch.
// Uploads all WebP files from public/products/<slug>/ to Supabase Storage
// under products/drop-02/<slug>/, then runs the SQL migration to insert
// the 9 new SKU rows.
//
// Run:
//   SUPABASE_SERVICE_ROLE_KEY=eyJ... pnpm tsx scripts/wire-batch-drop02.ts
//
// Idempotent: re-uploads overwrite existing Storage files, and the SQL
// migration uses ON CONFLICT (slug) DO UPDATE so re-running is safe.

import { createClient } from "@supabase/supabase-js";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://xbtabpurfavngwmwtawc.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error("SUPABASE_SERVICE_ROLE_KEY env var is required.");
  process.exit(1);
}

const SLUGS = [
  "saharienne-saddle-cognac",
  "medersa-rucksack-cognac",
  "babouche-crossbody-cognac",
  "kilim-duffle-polychrome",
  "kilim-duffle-amber",
  "cedre-crossbody-chocolate",
  "tadelakt-rucksack-cognac",
  "safran-tote-cognac",
  "rif-rucksack-tan",
];

const BUCKET = "products";
const FOLDER = "drop-02";
const PRODUCTS_DIR = join(process.cwd(), "public", "products");

type AnySupabase = ReturnType<typeof createClient<any, any, any>>;

async function uploadOne(
  supabase: AnySupabase,
  localPath: string,
  storagePath: string,
): Promise<boolean> {
  const file = await readFile(localPath);
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, {
      contentType: "image/webp",
      upsert: true,
      cacheControl: "31536000, immutable",
    });
  if (error) {
    console.error(`  FAIL ${storagePath}: ${error.message}`);
    return false;
  }
  return true;
}

async function main() {
  const supabase: AnySupabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`Uploading ${SLUGS.length} product folders to ${SUPABASE_URL}/${BUCKET}/${FOLDER}/`);
  let uploaded = 0;
  let failed = 0;

  for (const slug of SLUGS) {
    const dir = join(PRODUCTS_DIR, slug);
    console.log(`\n==> ${slug}`);
    let files: string[];
    try {
      files = (await readdir(dir)).filter((f) => f.endsWith(".webp"));
    } catch {
      console.error(`  SKIP — directory not found: ${dir}`);
      failed++;
      continue;
    }
    for (const file of files) {
      const localPath = join(dir, file);
      const storagePath = `${FOLDER}/${slug}/${file}`;
      const ok = await uploadOne(supabase, localPath, storagePath);
      if (ok) {
        uploaded++;
        process.stdout.write(".");
      } else {
        failed++;
      }
    }
    console.log(` (${files.length} files)`);
  }

  console.log(`\n\nUpload summary: ${uploaded} ok, ${failed} failed.`);

  // Run the SQL migration to insert/update product rows
  console.log("\nRunning SQL migration via Supabase REST API…");
  const sqlPath = join(
    process.cwd(),
    "supabase",
    "migrations",
    "20260524220000_drop02_nine_new_skus.sql",
  );
  const sql = (await readFile(sqlPath, "utf-8"))
    // Rewrite storage_url to point at drop-02 since lib/products.ts uses local paths
    // but the SQL needs Supabase Storage URLs. The migration already targets drop-02.
    .toString();

  // Supabase JS client doesn't expose raw SQL execution from REST,
  // so we use the pg meta endpoint via fetch.
  const resp = await fetch(`${SUPABASE_URL}/pg/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  });
  if (!resp.ok) {
    console.error(`\nSQL migration HTTP ${resp.status}: ${await resp.text()}`);
    console.error(
      "Run the SQL manually in Supabase Studio:",
      "supabase/migrations/20260524220000_drop02_nine_new_skus.sql",
    );
    process.exit(1);
  }
  console.log("\nMigration applied.");
  console.log("\n9 new SKUs are now live on Supabase.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
