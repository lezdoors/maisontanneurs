// Airtable -> Supabase product sync.
//
// Reads one or more Airtable Products records, maps each to the Supabase
// `products` shape, diffs against the current row, and writes only on real
// change. Idempotent: re-runs with no Airtable change write nothing.
//
// Modes:
//   --slug=<slug>          single SKU (canary / one-off)
//   --slugs=a,b,c          explicit list
//   --all                  every Airtable row that passes the launch gate
//   --dry-run              prints the diff; writes nothing
//
// Launch gate (--all + --slugs): Site Status IN (Published, Ready for site)
// AND Copy Status = Approved AND Image Status IN (Approved, Partial, blank)
// AND Launch Ready = true. --slug=<single> bypasses the launch-ready
// constraints so it can still be used as a canary tool for in-flight SKUs.
//
// Per-record JSONL line + a final session-summary line. Audit log at
// scripts/.sync-airtable.jsonl. Each Airtable call is concurrency-bounded
// at 3 because Airtable's per-PAT limit is 5 req/sec.
//
// Env (loaded from .env.local + ~/Downloads/airtable-hermes.env):
//   SUPABASE_SERVICE_ROLE_KEY  required
//   AIRTABLE_API_KEY           required
//   AIRTABLE_BASE_ID           required

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { appendFile } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: join(homedir(), "Downloads", "airtable-hermes.env") });

const SUPABASE_URL = "https://xbtabpurfavngwmwtawc.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY ?? "";
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID ?? "";
const AIRTABLE_TABLE = "Products";
const PRODUCT_STORAGE_BASE = `${SUPABASE_URL}/storage/v1/object/public/products/drop-02`;

const CONCURRENCY = 3;

const PUBLISHABLE_SITE_STATUSES = new Set(["Published", "Ready for site"]);
const PUBLISHABLE_IMAGE_STATUSES = new Set(["Approved", "Partial", ""]);

// The launch-gate formula used in --all and --slugs modes. Bypassed for
// single --slug runs so the canary tool still works on draft SKUs.
const LAUNCH_GATE_FORMULA = `AND(
  OR({Site Status}="Published",{Site Status}="Ready for site"),
  {Copy Status}="Approved",
  OR({Image Status}="Approved",{Image Status}="Partial",{Image Status}=""),
  {Launch Ready}
)`.replace(/\s+/g, " ");

const STATUS_MAP: Record<string, "available" | "sold" | "reserved" | "draft"> = {
  available: "available",
  active: "available",
  sold: "sold",
  reserved: "reserved",
  draft: "draft",
};

const PLACEHOLDER_PATTERNS = [
  /^see product page/i,
  /^tbd$/i,
  /^coming soon/i,
  /^placeholder/i,
];

function isPlaceholder(value: string): boolean {
  return PLACEHOLDER_PATTERNS.some((p) => p.test(value));
}

// JSONL audit log. Overridable via SYNC_AIRTABLE_LOG_PATH so the Mouha
// cron can write to /root/mouha/logs/sync-airtable.jsonl while local
// runs write next to the script.
const LOG_PATH =
  process.env.SYNC_AIRTABLE_LOG_PATH ??
  join(process.cwd(), "scripts", ".sync-airtable.jsonl");

type SyncAction = "noop" | "synced" | "skipped" | "error";

interface PerSkuLog {
  ts: string;
  slug: string;
  action: SyncAction;
  fields_changed: string[];
  errors: string[];
  dry_run: boolean;
  reason?: string;
}

interface SessionLog {
  ts: string;
  kind: "session";
  mode: string;
  dry_run: boolean;
  total: number;
  synced: number;
  noop: number;
  skipped: number;
  error: number;
  duration_ms: number;
}

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

interface ProductRow {
  title?: string;
  slug?: string;
  description?: string | null;
  price?: number;
  images?: string[];
  category?: string;
  dimensions?: Record<string, string>;
  materials?: string[];
  available_quantity?: number;
  status?: string;
  featured?: boolean;
  launch_priority?: string | null;
}

interface CliArgs {
  mode: "single" | "list" | "all";
  slugs: string[];
  dryRun: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  let slug = "";
  let slugsCsv = "";
  let all = false;
  let dryRun = false;
  for (const arg of argv.slice(2)) {
    if (arg === "--dry-run") dryRun = true;
    else if (arg === "--all") all = true;
    else if (arg.startsWith("--slug=")) slug = arg.slice("--slug=".length);
    else if (arg.startsWith("--slugs=")) slugsCsv = arg.slice("--slugs=".length);
  }
  const modes = [all, slug.length > 0, slugsCsv.length > 0].filter(Boolean).length;
  if (modes === 0) {
    throw new Error(
      "Must pass one of --slug=<slug>, --slugs=a,b,c, or --all.",
    );
  }
  if (modes > 1) {
    throw new Error("Pass only one of --slug, --slugs, --all.");
  }
  if (all) return { mode: "all", slugs: [], dryRun };
  if (slugsCsv) {
    const list = slugsCsv
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (list.length === 0) throw new Error("--slugs= was empty.");
    return { mode: "list", slugs: list, dryRun };
  }
  return { mode: "single", slugs: [slug], dryRun };
}

function requireEnv(): void {
  const missing: string[] = [];
  if (!SERVICE_ROLE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (!AIRTABLE_API_KEY) missing.push("AIRTABLE_API_KEY");
  if (!AIRTABLE_BASE_ID) missing.push("AIRTABLE_BASE_ID");
  if (missing.length > 0) {
    throw new Error(`Missing env vars: ${missing.join(", ")}`);
  }
}

async function airtableGet(
  params: Record<string, string>,
): Promise<AirtableResponse> {
  const qs = new URLSearchParams(params).toString();
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
    AIRTABLE_TABLE,
  )}?${qs}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
  });
  if (!res.ok) {
    throw new Error(`Airtable ${res.status}: ${await res.text()}`);
  }
  return (await res.json()) as AirtableResponse;
}

async function fetchAirtableBySlug(slug: string): Promise<AirtableRecord | null> {
  const body = await airtableGet({
    filterByFormula: `{Slug}="${slug.replace(/"/g, '\\"')}"`,
    maxRecords: "1",
  });
  return body.records[0] ?? null;
}

async function fetchAirtableLaunchGated(): Promise<AirtableRecord[]> {
  const out: AirtableRecord[] = [];
  let offset: string | undefined;
  do {
    const params: Record<string, string> = {
      filterByFormula: LAUNCH_GATE_FORMULA,
      pageSize: "100",
    };
    if (offset) params.offset = offset;
    const body = await airtableGet(params);
    out.push(...body.records);
    offset = body.offset;
  } while (offset);
  return out;
}

function splitLines(value: unknown): string[] {
  if (typeof value !== "string") return [];
  return value
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function asBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function canonicalHeroUrl(slug: string): string {
  return `${PRODUCT_STORAGE_BASE}/${slug}-pdp-white.webp`;
}

function normalizeHeroFirst(slug: string, images: string[]): string[] {
  const heroUrl = canonicalHeroUrl(slug);
  if (!images.includes(heroUrl)) return images;
  return [heroUrl, ...images.filter((url) => url !== heroUrl)];
}

function validateHeroFirst(slug: string, images: string[] | undefined): string | null {
  if (!images || images.length === 0) return null;
  const heroUrl = canonicalHeroUrl(slug);
  if (images[0] === heroUrl) return null;
  if (images.includes(heroUrl)) {
    return `Hero invariant failed: ${heroUrl} is present but not first in Airtable Images`;
  }
  return `Hero invariant failed: Airtable Images is missing canonical hero URL ${heroUrl}`;
}

function mapAirtableToProduct(fields: Record<string, unknown>): ProductRow {
  const row: ProductRow = {};

  const title = asString(fields["Product Name"]);
  if (title) row.title = title;

  const slug = asString(fields["Slug"]);
  if (slug) row.slug = slug;

  const description = asString(fields["Notes"]);
  if (description !== undefined) row.description = description;

  const price = asNumber(fields["Price Cents"]);
  if (price !== undefined) row.price = price;

  const images = splitLines(fields["Images"]);
  if (images.length > 0 && row.slug) row.images = normalizeHeroFirst(row.slug, images);

  const category = asString(fields["Category"]);
  if (category) row.category = category;

  const dimensionsText = asString(fields["Dimensions Text"]);
  if (dimensionsText && !isPlaceholder(dimensionsText)) {
    row.dimensions = { size: dimensionsText };
  }

  const materials = splitLines(fields["Materials Text"]);
  if (materials.length > 0) row.materials = materials;

  const qty = asNumber(fields["Available Quantity"]);
  if (qty !== undefined) row.available_quantity = qty;

  const status = asString(fields["Status"]);
  if (status) {
    const mapped = STATUS_MAP[status.toLowerCase()];
    if (mapped) row.status = mapped;
  }

  const featured = asBoolean(fields["Featured"]);
  if (featured !== undefined) row.featured = featured;

  const priority = asString(fields["Launch Priority"]);
  if (priority) row.launch_priority = priority;

  return row;
}

function valuesEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((x, i) => valuesEqual(x, b[i]));
  }
  if (typeof a === "object" && typeof b === "object") {
    const ak = Object.keys(a as object).sort();
    const bk = Object.keys(b as object).sort();
    if (ak.length !== bk.length) return false;
    if (!ak.every((k, i) => k === bk[i])) return false;
    return ak.every((k) =>
      valuesEqual(
        (a as Record<string, unknown>)[k],
        (b as Record<string, unknown>)[k],
      ),
    );
  }
  return false;
}

function diffRows(
  candidate: ProductRow,
  current: Record<string, unknown> | null,
): string[] {
  if (!current) return Object.keys(candidate);
  const changed: string[] = [];
  for (const key of Object.keys(candidate) as (keyof ProductRow)[]) {
    if (!valuesEqual(candidate[key], current[key])) changed.push(key);
  }
  return changed;
}

async function readSupabaseRow(
  supabase: SupabaseClient,
  slug: string,
): Promise<Record<string, unknown> | null> {
  const { data, error } = await supabase
    .from("products")
    .select(
      "slug,title,description,price,images,category,dimensions,materials,available_quantity,status,featured,launch_priority,last_synced_at",
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`Supabase read failed: ${error.message}`);
  return data;
}

async function writeSupabaseRow(
  supabase: SupabaseClient,
  slug: string,
  patch: ProductRow,
  exists: boolean,
): Promise<void> {
  const nowIso = new Date().toISOString();
  if (exists) {
    const { error } = await supabase
      .from("products")
      .update({ ...patch, last_synced_at: nowIso, updated_at: nowIso })
      .eq("slug", slug);
    if (error) throw new Error(`Supabase update failed: ${error.message}`);
    return;
  }
  const { error } = await supabase.from("products").insert({
    ...patch,
    slug,
    last_synced_at: nowIso,
    updated_at: nowIso,
  });
  if (error) throw new Error(`Supabase insert failed: ${error.message}`);
}

async function writeLog(line: PerSkuLog | SessionLog): Promise<void> {
  await appendFile(LOG_PATH, JSON.stringify(line) + "\n");
}

interface SyncContext {
  supabase: SupabaseClient;
  dryRun: boolean;
  enforceLaunchGate: boolean;
}

async function syncOne(
  ctx: SyncContext,
  slug: string,
  record: AirtableRecord | null,
): Promise<PerSkuLog> {
  const log: PerSkuLog = {
    ts: new Date().toISOString(),
    slug,
    action: "noop",
    fields_changed: [],
    errors: [],
    dry_run: ctx.dryRun,
  };
  try {
    if (!record) {
      log.action = "skipped";
      log.reason = "airtable record not found";
      console.log(`[skip] ${slug}: not found in Airtable`);
      return log;
    }
    const fields = record.fields;
    const siteStatus = asString(fields["Site Status"]);
    if (
      ctx.enforceLaunchGate &&
      (!siteStatus || !PUBLISHABLE_SITE_STATUSES.has(siteStatus))
    ) {
      log.action = "skipped";
      log.reason = `site status '${siteStatus ?? "missing"}' not publishable`;
      console.log(`[skip] ${slug}: Site Status=${siteStatus ?? "(empty)"}`);
      return log;
    }
    const candidate = mapAirtableToProduct(fields);
    if (candidate.slug && candidate.slug !== slug) {
      log.action = "error";
      log.errors.push(`slug mismatch: airtable=${candidate.slug} arg=${slug}`);
      console.error(log.errors[0]);
      return log;
    }
    const heroError = validateHeroFirst(slug, candidate.images);
    if (heroError) {
      log.action = "error";
      log.errors.push(heroError);
      console.error(`[error] ${slug}: ${heroError}`);
      return log;
    }
    const current = await readSupabaseRow(ctx.supabase, slug);
    const changed = diffRows(candidate, current);
    log.fields_changed = changed;
    if (changed.length === 0) {
      console.log(`[noop] ${slug}`);
      return log;
    }
    if (ctx.dryRun) {
      log.action = "noop";
      log.reason = "dry-run";
      console.log(
        `[dry-run] ${slug}: ${changed.length} field(s): ${changed.join(", ")}`,
      );
      return log;
    }
    const patch: ProductRow = {};
    for (const k of changed) {
      (patch as Record<string, unknown>)[k] = (
        candidate as Record<string, unknown>
      )[k];
    }
    await writeSupabaseRow(ctx.supabase, slug, patch, current !== null);
    log.action = "synced";
    console.log(
      `[synced] ${slug}: ${changed.length} field(s): ${changed.join(", ")}`,
    );
    return log;
  } catch (err) {
    log.action = "error";
    log.errors.push(err instanceof Error ? err.message : String(err));
    console.error(`[error] ${slug}: ${log.errors[0]}`);
    return log;
  }
}

// Bounded-parallel map: at most `limit` promises in-flight.
async function mapWithLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const idx = cursor++;
      if (idx >= items.length) return;
      results[idx] = await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return results;
}

async function fetchListBySlugs(slugs: string[]): Promise<Map<string, AirtableRecord>> {
  // Single filterByFormula(OR(...)) call so we only burn one quota.
  const escaped = slugs.map((s) => `{Slug}="${s.replace(/"/g, '\\"')}"`);
  const formula = `OR(${escaped.join(",")})`;
  const out = new Map<string, AirtableRecord>();
  let offset: string | undefined;
  do {
    const params: Record<string, string> = {
      filterByFormula: formula,
      pageSize: "100",
    };
    if (offset) params.offset = offset;
    const body = await airtableGet(params);
    for (const r of body.records) {
      const s = asString(r.fields["Slug"]);
      if (s) out.set(s, r);
    }
    offset = body.offset;
  } while (offset);
  return out;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv);
  requireEnv();
  const startedAt = Date.now();

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  let records: { slug: string; record: AirtableRecord | null }[];
  if (args.mode === "single") {
    const r = await fetchAirtableBySlug(args.slugs[0]);
    records = [{ slug: args.slugs[0], record: r }];
  } else if (args.mode === "list") {
    const map = await fetchListBySlugs(args.slugs);
    records = args.slugs.map((s) => ({ slug: s, record: map.get(s) ?? null }));
  } else {
    const fetched = await fetchAirtableLaunchGated();
    records = fetched
      .map((r) => ({ slug: asString(r.fields["Slug"]) ?? "", record: r }))
      .filter((x) => x.slug.length > 0)
      .sort((a, b) => a.slug.localeCompare(b.slug));
    console.log(`[--all] ${records.length} record(s) passed launch gate`);
  }

  const ctx: SyncContext = {
    supabase,
    dryRun: args.dryRun,
    enforceLaunchGate: args.mode !== "single",
  };

  const perSku = await mapWithLimit(records, CONCURRENCY, ({ slug, record }) =>
    syncOne(ctx, slug, record),
  );

  for (const log of perSku) await writeLog(log);

  const session: SessionLog = {
    ts: new Date().toISOString(),
    kind: "session",
    mode: args.mode,
    dry_run: args.dryRun,
    total: perSku.length,
    synced: perSku.filter((l) => l.action === "synced").length,
    noop: perSku.filter((l) => l.action === "noop").length,
    skipped: perSku.filter((l) => l.action === "skipped").length,
    error: perSku.filter((l) => l.action === "error").length,
    duration_ms: Date.now() - startedAt,
  };
  await writeLog(session);
  console.log(
    `[session] mode=${session.mode} dry_run=${session.dry_run} total=${session.total} synced=${session.synced} noop=${session.noop} skipped=${session.skipped} error=${session.error} ${session.duration_ms}ms`,
  );

  if (session.error > 0) process.exitCode = 1;
}

main();
