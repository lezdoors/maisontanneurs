// Rename brand-assets files to Canonical Filename (Phase C — DAM canon).
//
// Reads audits/brand-assets-audit-<date>.json (run audit-brand-assets.ts
// first), takes the convention_violations[] list, and:
//   1. For each violation, locates the actual file on disk by basename
//      under ~/brand-assets/maison-tanneurs/.
//   2. Renames the file in place to its Canonical Filename.
//   3. Updates the matching Airtable Product Asset record:
//        - Filename                  -> canonical
//        - Filename (original)       -> original (backup, additive field)
//        - Local Path                -> absolute path of new file
//
// The "Filename (original)" field is created automatically on first run
// if missing. Backups are never overwritten — if the field already has a
// value (i.e. the file was renamed before), we keep the original.
//
// Usage:
//   pnpm tsx scripts/rename-to-canon.ts --dry-run                  (mandatory first)
//   pnpm tsx scripts/rename-to-canon.ts                            (all violations)
//   pnpm tsx scripts/rename-to-canon.ts --limit=5                  (first 5)
//   pnpm tsx scripts/rename-to-canon.ts --audit=path/to/file.json  (explicit input)

import * as dotenv from "dotenv";
import { readFile, rename, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { homedir } from "node:os";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: join(homedir(), "Downloads", "airtable-hermes.env") });

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY ?? "";
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID ?? "";

const BRAND_ROOT = join(homedir(), "brand-assets", "maison-tanneurs");
const AUDITS_DIR = join(process.cwd(), "audits");

interface Violation {
  record_id: string;
  product_id?: string;
  on_disk: string;
  canonical: string;
}

interface Audit {
  generated_at: string;
  convention_violations: Violation[];
}

function parseArgs(): { dryRun: boolean; limit: number; auditPath?: string } {
  let dryRun = false;
  let limit = Number.POSITIVE_INFINITY;
  let auditPath: string | undefined;
  for (const a of process.argv.slice(2)) {
    if (a === "--dry-run") dryRun = true;
    else if (a.startsWith("--limit=")) limit = Number(a.slice("--limit=".length));
    else if (a.startsWith("--audit=")) auditPath = a.slice("--audit=".length);
  }
  return { dryRun, limit, auditPath };
}

async function newestAudit(): Promise<string> {
  const entries = await readdir(AUDITS_DIR);
  const matches = entries
    .filter((e) => /^brand-assets-audit-\d{4}-\d{2}-\d{2}\.json$/.test(e))
    .sort()
    .reverse();
  if (matches.length === 0) {
    throw new Error(
      `No brand-assets-audit-*.json found in ${AUDITS_DIR}. Run audit-brand-assets.ts first.`,
    );
  }
  return join(AUDITS_DIR, matches[0]);
}

async function findFileByName(root: string, name: string): Promise<string | null> {
  let entries;
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch {
    return null;
  }
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    const full = join(root, e.name);
    if (e.isFile() && e.name === name) return full;
    if (e.isDirectory()) {
      const found = await findFileByName(full, name);
      if (found) return found;
    }
  }
  return null;
}

async function airtableGet(table: string, recordId: string) {
  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(table)}/${recordId}`,
    { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` } },
  );
  if (!res.ok) throw new Error(`Airtable GET ${res.status}: ${await res.text()}`);
  return (await res.json()) as { id: string; fields: Record<string, unknown> };
}

async function airtablePatchOne(
  table: string,
  recordId: string,
  fields: Record<string, unknown>,
): Promise<void> {
  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(table)}/${recordId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    },
  );
  if (!res.ok) throw new Error(`Airtable PATCH ${res.status}: ${await res.text()}`);
}

async function ensureBackupField(): Promise<void> {
  // Check if "Filename (original)" exists on Product Assets; create if not.
  const res = await fetch(
    `https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`,
    { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` } },
  );
  if (!res.ok) throw new Error(`Airtable schema GET ${res.status}: ${await res.text()}`);
  const body = (await res.json()) as {
    tables: { id: string; name: string; fields: { name: string }[] }[];
  };
  const table = body.tables.find((t) => t.name === "Product Assets");
  if (!table) throw new Error("Product Assets table not found");
  if (table.fields.some((f) => f.name === "Filename (original)")) return;
  console.log(`[schema] adding "Filename (original)" field to Product Assets`);
  const createRes = await fetch(
    `https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables/${table.id}/fields`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Filename (original)",
        type: "singleLineText",
        description: "Pre-rename filename, populated by scripts/rename-to-canon.ts. Never overwrite.",
      }),
    },
  );
  if (!createRes.ok)
    throw new Error(`Field create ${createRes.status}: ${await createRes.text()}`);
}

async function main(): Promise<void> {
  const { dryRun, limit, auditPath } = parseArgs();
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error("Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID");
  }
  const path = auditPath ?? (await newestAudit());
  const audit = JSON.parse(await readFile(path, "utf8")) as Audit;
  console.log(`[audit] ${path} — ${audit.convention_violations.length} violations`);

  const subset = audit.convention_violations.slice(0, limit);
  if (subset.length === 0) {
    console.log("[done] nothing to do");
    return;
  }

  if (!dryRun) await ensureBackupField();

  let renamed = 0;
  let skipped = 0;
  for (const v of subset) {
    const found = await findFileByName(BRAND_ROOT, v.on_disk);
    if (!found) {
      console.log(`[skip] ${v.on_disk} not found on disk`);
      skipped++;
      continue;
    }
    const target = join(dirname(found), v.canonical);
    if (existsSync(target)) {
      console.log(`[skip] target exists: ${v.canonical} in ${dirname(found)}`);
      skipped++;
      continue;
    }
    if (dryRun) {
      console.log(`[dry-run] ${found} -> ${v.canonical}`);
      continue;
    }
    // Read AT to preserve any existing backup.
    const existing = await airtableGet("Product Assets", v.record_id);
    const backupAlready = existing.fields["Filename (original)"] as string | undefined;
    await rename(found, target);
    await airtablePatchOne("Product Assets", v.record_id, {
      Filename: v.canonical,
      "Local Path": target,
      ...(backupAlready ? {} : { "Filename (original)": v.on_disk }),
    });
    console.log(`[renamed] ${v.on_disk} -> ${v.canonical}`);
    renamed++;
  }

  console.log(
    `\n[summary] ${dryRun ? "(dry-run) " : ""}renamed=${renamed} skipped=${skipped} of ${subset.length}`,
  );
}

main();
