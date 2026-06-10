// Audit Maison Tanneurs Hero-* source images against Airtable and Supabase ordering.
//
// Hard invariant: when an approved Drive product folder has a Hero-* file,
// the published product image order must keep that hero-derived image first.
// In Supabase Storage this is normally represented as:
//   products/drop-02/{slug}-pdp-white.webp
// because the Drive Hero-* source is encoded/upserted into that canonical object.
//
// This script is read-only. It writes audit artifacts under audits/product-media-system/.

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { join, basename } from "node:path";
import { homedir } from "node:os";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: join(homedir(), "Downloads", "airtable-hermes.env") });

const SUPABASE_URL = "https://xbtabpurfavngwmwtawc.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY ?? "";
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID ?? "appaynUdHhSKiK76i";
const AIRTABLE_TABLE = "Products";
const DRIVE_ROOT =
  process.env.MT_USABLE_PRODUCT_PICS ||
  "/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/usable product pics";
const OUT_DIR = join(process.cwd(), "audits", "product-media-system");
const TODAY = new Date().toISOString().slice(0, 10);

const IMAGE_EXT = /\.(webp|png|jpe?g|avif|heic|tiff?)$/i;
const HERO_RE = /^hero(?:[-_\s]|$)/i;
const STORAGE_BASE = `${SUPABASE_URL}/storage/v1/object/public/products/drop-02`;

type SupabaseProduct = {
  slug: string;
  title: string | null;
  status: string | null;
  featured: boolean | null;
  images: string[] | null;
};

type AirtableProduct = {
  slug: string;
  images: string[];
  imageStatus: string;
  launchReady: boolean;
  siteStatus: string;
};

type HeroSource = {
  folder: string;
  heroFiles: string[];
  allImages: string[];
};

type AuditRow = {
  slug: string;
  title: string;
  status: string;
  featured: string;
  driveFolder: string;
  heroFiles: string[];
  expectedFirst: string;
  supabaseFirst: string;
  airtableFirst: string;
  verdict: "PASS" | "WARN" | "FAIL";
  notes: string[];
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/^hero[-_\s]*/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^mt-[a-z]{2}-\d{3}-+/, "")
    .replace(/-hd$/, "")
    .replace(/^-|-$/g, "");
}

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function splitLines(value: unknown): string[] {
  if (typeof value !== "string") return [];
  return value.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asBoolean(value: unknown): boolean {
  return typeof value === "boolean" ? value : false;
}

async function listDriveHeroSources(): Promise<Map<string, HeroSource>> {
  const out = new Map<string, HeroSource>();
  const entries = await readdir(DRIVE_ROOT, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const folder = entry.name;
    const files = await readdir(join(DRIVE_ROOT, folder), { withFileTypes: true }).catch(() => []);
    const images = files
      .filter((f) => f.isFile() && IMAGE_EXT.test(f.name))
      .map((f) => f.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    const heroFiles = images.filter((name) => HERO_RE.test(name));
    if (heroFiles.length === 0) continue;
    const folderSlug = normalize(folder);
    out.set(folderSlug, { folder, heroFiles, allImages: images });
    for (const hero of heroFiles) {
      const heroSlug = normalize(hero);
      if (!out.has(heroSlug)) out.set(heroSlug, { folder, heroFiles, allImages: images });
    }
  }
  return out;
}

async function fetchSupabaseProducts(): Promise<SupabaseProduct[]> {
  if (!SERVICE_ROLE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const { data, error } = await supabase
    .from("products")
    .select("slug,title,status,featured,images")
    .order("slug", { ascending: true });
  if (error) throw new Error(`Supabase read failed: ${error.message}`);
  return (data ?? []) as SupabaseProduct[];
}

async function fetchAirtableProducts(): Promise<Map<string, AirtableProduct>> {
  const out = new Map<string, AirtableProduct>();
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) return out;
  let offset = "";
  do {
    const params = new URLSearchParams({ pageSize: "100" });
    if (offset) params.set("offset", offset);
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}?${params}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` } });
    if (!res.ok) throw new Error(`Airtable ${res.status}: ${await res.text()}`);
    const body = await res.json() as { records: { fields: Record<string, unknown> }[]; offset?: string };
    for (const rec of body.records) {
      const slug = asString(rec.fields["Slug"]);
      if (!slug) continue;
      out.set(slug, {
        slug,
        images: splitLines(rec.fields["Images"]),
        imageStatus: asString(rec.fields["Image Status"]),
        launchReady: asBoolean(rec.fields["Launch Ready"]),
        siteStatus: asString(rec.fields["Site Status"]),
      });
    }
    offset = body.offset ?? "";
  } while (offset);
  return out;
}

function classify(product: SupabaseProduct, source: HeroSource | undefined, airtable: AirtableProduct | undefined): AuditRow {
  const slug = product.slug;
  const expectedFirst = `${STORAGE_BASE}/${slug}-pdp-white.webp`;
  const supabaseFirst = product.images?.[0] ?? "";
  const airtableFirst = airtable?.images[0] ?? "";
  const publishable = product.status === "available" && product.featured === true;
  const notes: string[] = [];
  let verdict: AuditRow["verdict"] = "PASS";

  if (!source) {
    verdict = "WARN";
    notes.push("no matching Drive Hero-* source found");
  }
  if (source && source.heroFiles.length > 1) {
    verdict = "WARN";
    notes.push(`multiple Hero-* files: ${source.heroFiles.join("; ")}`);
  }
  if (source && supabaseFirst !== expectedFirst) {
    verdict = publishable ? "FAIL" : "WARN";
    notes.push("Supabase images[0] is not canonical hero-derived pdp-white URL");
  }
  if (source && airtable && airtableFirst && airtableFirst !== expectedFirst) {
    verdict = publishable ? "FAIL" : "WARN";
    notes.push("Airtable Images first line is not canonical hero-derived pdp-white URL");
  }
  if (!supabaseFirst) {
    verdict = publishable ? "FAIL" : "WARN";
    notes.push("Supabase images array is empty");
  }
  if (!airtable) {
    if (verdict !== ("FAIL" as AuditRow["verdict"])) verdict = "WARN";
    notes.push("no Airtable Products record found");
  }

  return {
    slug,
    title: product.title ?? "",
    status: product.status ?? "",
    featured: String(product.featured ?? ""),
    driveFolder: source?.folder ?? "",
    heroFiles: source?.heroFiles ?? [],
    expectedFirst,
    supabaseFirst,
    airtableFirst,
    verdict,
    notes,
  };
}

async function main() {
  const [sources, products, airtable] = await Promise.all([
    listDriveHeroSources(),
    fetchSupabaseProducts(),
    fetchAirtableProducts(),
  ]);

  const rows = products.map((p) => classify(p, sources.get(p.slug), airtable.get(p.slug)));
  const pass = rows.filter((r) => r.verdict === "PASS").length;
  const warn = rows.filter((r) => r.verdict === "WARN").length;
  const fail = rows.filter((r) => r.verdict === "FAIL").length;

  await mkdir(OUT_DIR, { recursive: true });
  const csvPath = join(OUT_DIR, `hero-source-of-truth-${TODAY}.csv`);
  const mdPath = join(OUT_DIR, `hero-source-of-truth-${TODAY}.md`);
  const jsonPath = join(OUT_DIR, `hero-source-of-truth-${TODAY}.json`);

  const csv = [
    ["verdict", "slug", "title", "status", "featured", "driveFolder", "heroFiles", "expectedFirst", "supabaseFirst", "airtableFirst", "notes"].map(csvCell).join(","),
    ...rows.map((r) => [
      r.verdict,
      r.slug,
      r.title,
      r.status,
      r.featured,
      r.driveFolder,
      r.heroFiles.join("; "),
      r.expectedFirst,
      r.supabaseFirst,
      r.airtableFirst,
      r.notes.join("; "),
    ].map(csvCell).join(",")),
  ].join("\n") + "\n";

  const md: string[] = [];
  md.push("# Maison Tanneurs — Hero Source of Truth Audit");
  md.push("");
  md.push(`Generated: ${new Date().toISOString()}`);
  md.push(`Drive root: ${DRIVE_ROOT}`);
  md.push("");
  md.push("## Hard rule");
  md.push("");
  md.push("If a product source folder contains `Hero-*`, that human-curated file is the product hero. It must be encoded/upserted as the canonical `{slug}-pdp-white.webp` object and that URL must be first in Airtable `Images` and Supabase `products.images`.");
  md.push("");
  md.push("## Summary");
  md.push("");
  md.push(`- Supabase products audited: ${rows.length}`);
  md.push(`- PASS: ${pass}`);
  md.push(`- WARN: ${warn}`);
  md.push(`- FAIL: ${fail}`);
  md.push("");
  md.push("## Detail");
  md.push("");
  md.push("| Verdict | Slug | Drive folder | Hero file(s) | Supabase first image | Airtable first image | Notes |");
  md.push("|---|---|---|---|---|---|---|");
  for (const r of rows) {
    md.push(`| ${r.verdict} | \`${r.slug}\` | ${r.driveFolder || "—"} | ${r.heroFiles.join("; ") || "—"} | ${r.supabaseFirst ? basename(r.supabaseFirst) : "—"} | ${r.airtableFirst ? basename(r.airtableFirst) : "—"} | ${r.notes.join("; ") || "—"} |`);
  }

  await writeFile(csvPath, csv);
  await writeFile(mdPath, md.join("\n") + "\n");
  await writeFile(jsonPath, JSON.stringify({ generatedAt: new Date().toISOString(), summary: { total: rows.length, pass, warn, fail }, rows }, null, 2) + "\n");

  console.log(`[done] ${mdPath}`);
  console.log(`[done] ${csvPath}`);
  console.log(`[done] ${jsonPath}`);
  console.log(`[summary] total=${rows.length} pass=${pass} warn=${warn} fail=${fail}`);
  if (fail > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
