// Brand-asset audit — cross-reference ~/brand-assets/maison-tanneurs/
// against the Airtable Product Assets table. Output: a Markdown report
// at audits/brand-assets-audit-<YYYY-MM-DD>.md plus a JSON sidecar.
//
// Sections:
//   - Orphan files          on disk, no matching Airtable record
//   - Ghost records         in Airtable, file not on disk
//   - Convention violations actual filename != Canonical Filename
//   - Suspected duplicates  identical file body across multiple AT records
//   - Missing critical      per product: no approved Hero/PDP/Lifestyle/Meta
//   - Quality flags         AT Quality Status != Approved
//
// Scope: walks only the "live" subtrees — products/, _hf-archive/sku/,
// _upload-ready/. Skips _archive/, _rejected-reference/, _unsorted/,
// _supplier-pool/ (intake), _campaigns/ (output), _brand-assets/ (logos
// & typography — non-product), _hf-prompts/, fonts/. Image extensions
// only (webp/png/jpg/jpeg).
//
// Usage:
//   pnpm tsx scripts/audit-brand-assets.ts

import * as dotenv from "dotenv";
import { readdir, stat, writeFile, mkdir, readFile } from "node:fs/promises";
import { join, basename, relative, extname } from "node:path";
import { homedir } from "node:os";
import { createHash } from "node:crypto";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: join(homedir(), "Downloads", "airtable-hermes.env") });

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY ?? "";
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID ?? "";

const BRAND_ROOT = join(homedir(), "brand-assets", "maison-tanneurs");
const LIVE_SUBTREES = ["products", "_hf-archive/sku", "_upload-ready"];
const IMAGE_EXTS = new Set([".webp", ".png", ".jpg", ".jpeg"]);

const OUT_DIR = join(process.cwd(), "audits");
const TODAY = new Date().toISOString().slice(0, 10);
const OUT_MD = join(OUT_DIR, `brand-assets-audit-${TODAY}.md`);
const OUT_JSON = join(OUT_DIR, `brand-assets-audit-${TODAY}.json`);

const CRITICAL_ASSET_TYPES = ["PDP white", "Scale", "Hero", "Lifestyle"];

interface AirtableAssetRecord {
  id: string;
  fields: {
    Filename?: string;
    "Canonical Filename"?: string;
    "Local Path"?: string;
    "Asset URL"?: string;
    "Asset Type"?: string;
    Approved?: boolean;
    "Quality Status"?: string;
    "Product ID (cache)"?: string;
    Product?: string[];
  };
}

interface AirtableProductRecord {
  id: string;
  fields: {
    Slug?: string;
    "Product Name"?: string;
    "Product ID"?: string;
  };
}

interface DiskFile {
  abs: string;
  rel: string;
  name: string;
  size: number;
  sha?: string;
}

async function walk(root: string, base: string, out: DiskFile[]): Promise<void> {
  let entries;
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    const full = join(root, e.name);
    if (e.isDirectory()) {
      await walk(full, base, out);
    } else if (e.isFile() && IMAGE_EXTS.has(extname(e.name).toLowerCase())) {
      const st = await stat(full);
      out.push({ abs: full, rel: relative(base, full), name: e.name, size: st.size });
    }
  }
}

async function fetchAirtableTable<T>(name: string): Promise<T[]> {
  const out: T[] = [];
  let offset: string | undefined;
  do {
    const params = new URLSearchParams({ pageSize: "100" });
    if (offset) params.set("offset", offset);
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(name)}?${params}`,
      { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` } },
    );
    if (!res.ok) throw new Error(`Airtable ${res.status}: ${await res.text()}`);
    const body = (await res.json()) as { records: T[]; offset?: string };
    out.push(...body.records);
    offset = (body as unknown as { offset?: string }).offset;
  } while (offset);
  return out;
}

async function sha256(path: string): Promise<string> {
  const buf = await readFile(path);
  return createHash("sha256").update(buf).digest("hex");
}

interface AuditReport {
  generated_at: string;
  totals: {
    disk_files: number;
    airtable_records: number;
    products: number;
  };
  orphans: { path: string; size: number }[];
  ghosts: { record_id: string; filename: string; product_id?: string }[];
  convention_violations: {
    record_id: string;
    product_id?: string;
    on_disk: string;
    canonical: string;
  }[];
  suspected_duplicates: { sha: string; size: number; records: { id: string; filename: string }[] }[];
  missing_critical: { product_id: string; slug: string; missing: string[] }[];
  quality_flags: { record_id: string; filename: string; status: string; product_id?: string }[];
}

function isHeroVariantFile(name: string): boolean {
  return /pdp-white|scale|hero|lifestyle/i.test(name);
}

async function main(): Promise<void> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error("Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID");
  }
  await mkdir(OUT_DIR, { recursive: true });

  console.log(`[walk] scanning ${LIVE_SUBTREES.join(", ")} under ${BRAND_ROOT}`);
  const disk: DiskFile[] = [];
  for (const sub of LIVE_SUBTREES) {
    await walk(join(BRAND_ROOT, sub), BRAND_ROOT, disk);
  }
  console.log(`[walk] ${disk.length} image files`);

  console.log(`[airtable] fetching Product Assets + Products`);
  const [assets, products] = await Promise.all([
    fetchAirtableTable<AirtableAssetRecord>("Product Assets"),
    fetchAirtableTable<AirtableProductRecord>("Products"),
  ]);
  console.log(`[airtable] ${assets.length} assets, ${products.length} products`);

  // Build lookup: filename -> disk file
  const diskByName = new Map<string, DiskFile[]>();
  for (const f of disk) {
    const arr = diskByName.get(f.name) ?? [];
    arr.push(f);
    diskByName.set(f.name, arr);
  }

  // Build lookup: filename -> AT records that reference it
  const atRefsByFilename = new Map<string, AirtableAssetRecord[]>();
  for (const a of assets) {
    const fn = a.fields.Filename;
    if (!fn) continue;
    const arr = atRefsByFilename.get(fn) ?? [];
    arr.push(a);
    atRefsByFilename.set(fn, arr);
  }

  const productById = new Map<string, AirtableProductRecord>();
  const productBySlug = new Map<string, AirtableProductRecord>();
  for (const p of products) {
    productById.set(p.id, p);
    if (p.fields.Slug) productBySlug.set(p.fields.Slug, p);
  }

  // 1. Orphans = on disk, no AT record claims that filename
  const orphans = disk
    .filter((f) => !atRefsByFilename.has(f.name))
    .map((f) => ({ path: f.rel, size: f.size }));

  // 2. Ghosts = AT record with Filename, but no file on disk
  const ghosts: AuditReport["ghosts"] = [];
  for (const a of assets) {
    const fn = a.fields.Filename;
    if (!fn) continue;
    if (!diskByName.has(fn)) {
      ghosts.push({
        record_id: a.id,
        filename: fn,
        product_id: a.fields["Product ID (cache)"],
      });
    }
  }

  // 3. Convention violations = on disk under same name, but != Canonical
  const violations: AuditReport["convention_violations"] = [];
  for (const a of assets) {
    const fn = a.fields.Filename;
    const canon = a.fields["Canonical Filename"];
    if (!fn || !canon) continue;
    if (!diskByName.has(fn)) continue;
    if (fn !== canon) {
      violations.push({
        record_id: a.id,
        product_id: a.fields["Product ID (cache)"],
        on_disk: fn,
        canonical: canon,
      });
    }
  }

  // 4. Suspected duplicates = same SHA across multiple records.
  // Hash only files that are referenced by >=1 AT record (cheap-ish).
  const hashedByPath = new Map<string, string>();
  for (const [name, refs] of atRefsByFilename) {
    const candidates = diskByName.get(name) ?? [];
    for (const f of candidates) {
      if (!hashedByPath.has(f.abs)) {
        hashedByPath.set(f.abs, await sha256(f.abs));
      }
    }
    void refs;
  }
  const recordsByHash = new Map<string, { id: string; filename: string; size: number }[]>();
  for (const a of assets) {
    const fn = a.fields.Filename;
    if (!fn) continue;
    const candidates = diskByName.get(fn);
    if (!candidates || candidates.length === 0) continue;
    const file = candidates[0];
    const sha = hashedByPath.get(file.abs);
    if (!sha) continue;
    const arr = recordsByHash.get(sha) ?? [];
    arr.push({ id: a.id, filename: fn, size: file.size });
    recordsByHash.set(sha, arr);
  }
  const duplicates: AuditReport["suspected_duplicates"] = [];
  for (const [sha, records] of recordsByHash) {
    if (records.length > 1) {
      duplicates.push({ sha, size: records[0].size, records });
    }
  }

  // 5. Missing critical assets per product. "Critical" = at minimum one
  // Approved PDP-tier asset (PDP white or Scale) for every Product.
  const approvedTypesByProduct = new Map<string, Set<string>>();
  for (const a of assets) {
    const link = a.fields.Product?.[0];
    if (!link) continue;
    const type = a.fields["Asset Type"];
    if (!type) continue;
    if (a.fields.Approved !== true) continue;
    if (a.fields["Quality Status"] !== "Approved") continue;
    const set = approvedTypesByProduct.get(link) ?? new Set<string>();
    set.add(type);
    approvedTypesByProduct.set(link, set);
  }
  const missing: AuditReport["missing_critical"] = [];
  for (const p of products) {
    const slug = p.fields.Slug ?? "?";
    const pid = p.fields["Product ID"] ?? "?";
    const have = approvedTypesByProduct.get(p.id) ?? new Set<string>();
    const lacking: string[] = [];
    const pdpTier = have.has("PDP white") || have.has("Scale") || have.has("PDP");
    if (!pdpTier) lacking.push("PDP/Scale");
    if (!have.has("Hero")) lacking.push("Hero");
    if (!have.has("Lifestyle")) lacking.push("Lifestyle");
    if (!have.has("Meta")) lacking.push("Meta");
    if (lacking.length > 0) missing.push({ product_id: pid, slug, missing: lacking });
  }

  // 6. Quality flags
  const qualityFlags: AuditReport["quality_flags"] = [];
  for (const a of assets) {
    const status = a.fields["Quality Status"] ?? "Unreviewed";
    if (status !== "Approved") {
      qualityFlags.push({
        record_id: a.id,
        filename: a.fields.Filename ?? "?",
        status,
        product_id: a.fields["Product ID (cache)"],
      });
    }
  }

  const report: AuditReport = {
    generated_at: new Date().toISOString(),
    totals: {
      disk_files: disk.length,
      airtable_records: assets.length,
      products: products.length,
    },
    orphans,
    ghosts,
    convention_violations: violations,
    suspected_duplicates: duplicates,
    missing_critical: missing,
    quality_flags: qualityFlags,
  };

  await writeFile(OUT_JSON, JSON.stringify(report, null, 2));

  const md = renderMarkdown(report);
  await writeFile(OUT_MD, md);

  console.log(`[done] report: ${OUT_MD}`);
  console.log(
    `[summary] orphans=${orphans.length} ghosts=${ghosts.length} violations=${violations.length} dupes=${duplicates.length} missing_critical_products=${missing.length} quality_flags=${qualityFlags.length}`,
  );
}

function renderMarkdown(r: AuditReport): string {
  const L: string[] = [];
  L.push(`# Maison Tanneurs — Brand Assets Audit`);
  L.push("");
  L.push(`Generated: ${r.generated_at}`);
  L.push("");
  L.push(`## Totals`);
  L.push("");
  L.push(`- Image files on disk (live subtrees only): ${r.totals.disk_files}`);
  L.push(`- Airtable Product Assets records: ${r.totals.airtable_records}`);
  L.push(`- Airtable Products: ${r.totals.products}`);
  L.push("");

  L.push(`## Orphan files (${r.orphans.length})`);
  L.push("");
  L.push(`Files on disk in a live subtree with no matching Airtable Product Asset record.`);
  L.push("");
  if (r.orphans.length === 0) L.push(`_None._`);
  else {
    const sampled = r.orphans.slice(0, 60);
    for (const o of sampled) L.push(`- \`${o.path}\` (${(o.size / 1024).toFixed(1)}KB)`);
    if (r.orphans.length > sampled.length)
      L.push(`- ... ${r.orphans.length - sampled.length} more (see JSON sidecar)`);
  }
  L.push("");

  L.push(`## Ghost records (${r.ghosts.length})`);
  L.push("");
  L.push(`Airtable records with a Filename that doesn't exist on disk.`);
  L.push("");
  if (r.ghosts.length === 0) L.push(`_None._`);
  else for (const g of r.ghosts) L.push(`- ${g.product_id ?? "?"} \`${g.filename}\` (rec ${g.record_id})`);
  L.push("");

  L.push(`## Convention violations (${r.convention_violations.length})`);
  L.push("");
  L.push(`Filename on disk doesn't match Canonical Filename. Run scripts/rename-to-canon.ts to fix.`);
  L.push("");
  if (r.convention_violations.length === 0) L.push(`_None._`);
  else for (const v of r.convention_violations.slice(0, 80))
    L.push(`- ${v.product_id ?? "?"} \`${v.on_disk}\` → \`${v.canonical}\``);
  if (r.convention_violations.length > 80)
    L.push(`- ... ${r.convention_violations.length - 80} more (see JSON sidecar)`);
  L.push("");

  L.push(`## Suspected duplicates (${r.suspected_duplicates.length})`);
  L.push("");
  L.push(`Identical file body (sha256 match) referenced by >1 Airtable record.`);
  L.push("");
  if (r.suspected_duplicates.length === 0) L.push(`_None._`);
  else for (const d of r.suspected_duplicates) {
    L.push(`- ${(d.size / 1024).toFixed(1)}KB, sha ${d.sha.slice(0, 12)}…`);
    for (const r2 of d.records) L.push(`  - \`${r2.filename}\` (rec ${r2.id})`);
  }
  L.push("");

  L.push(`## Missing critical assets per product (${r.missing_critical.length})`);
  L.push("");
  L.push(`Each row = product lacking at least one Approved + Quality-Approved asset of the listed type(s).`);
  L.push("");
  if (r.missing_critical.length === 0) L.push(`_None._`);
  else for (const m of r.missing_critical) L.push(`- ${m.product_id} \`${m.slug}\`: missing ${m.missing.join(", ")}`);
  L.push("");

  L.push(`## Quality flags (${r.quality_flags.length})`);
  L.push("");
  L.push(`Airtable Product Asset records where Quality Status != Approved.`);
  L.push("");
  if (r.quality_flags.length === 0) L.push(`_None._`);
  else {
    const byStatus = new Map<string, AuditReport["quality_flags"]>();
    for (const q of r.quality_flags) {
      const arr = byStatus.get(q.status) ?? [];
      arr.push(q);
      byStatus.set(q.status, arr);
    }
    for (const [status, arr] of byStatus) {
      L.push(`### ${status} (${arr.length})`);
      for (const q of arr.slice(0, 40))
        L.push(`- ${q.product_id ?? "?"} \`${q.filename}\` (rec ${q.record_id})`);
      if (arr.length > 40) L.push(`- ... ${arr.length - 40} more`);
      L.push("");
    }
  }

  return L.join("\n");
}

main();
