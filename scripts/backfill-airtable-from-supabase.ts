// One-shot hygiene: pre-Phase-B back-fill of Airtable Products with the
// current Supabase truth for fields where Supabase has been the working
// source. Without this, the first --all sync would clobber curated
// materials lists, real inventory counts, and HF gallery URLs.
//
// Push-back rules (Airtable <- Supabase) per field:
//   Materials Text    if Airtable is empty OR has fewer lines than Supabase
//   Available Quantity if Airtable differs from Supabase
//   Dimensions Text   if Airtable is a placeholder OR Supabase has a value
//   Images            if Airtable is empty OR doesn't list all Supabase URLs
//   Category          if Airtable is empty (never overwrite real choices)
//   Price Cents       if Airtable is empty OR null (never overwrite real)
//   Notes (descr.)    NEVER overwrite — description is editorial
//
// After this script runs, `sync-airtable.ts --all --dry-run` should only
// show launch_priority writes for ~23 SKUs (the new column) plus any
// intentional editorial diffs.
//
// Usage:
//   pnpm tsx scripts/backfill-airtable-from-supabase.ts --dry-run
//   pnpm tsx scripts/backfill-airtable-from-supabase.ts

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { join } from "node:path";
import { homedir } from "node:os";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: join(homedir(), "Downloads", "airtable-hermes.env") });

const SUPABASE_URL = "https://xbtabpurfavngwmwtawc.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY ?? "";
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID ?? "";

const PLACEHOLDER_PATTERNS = [
  /^see product page/i,
  /^tbd$/i,
  /^coming soon/i,
  /^placeholder/i,
];

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

interface SbRow {
  slug: string;
  title: string | null;
  description: string | null;
  price: number | null;
  images: string[] | null;
  category: string | null;
  dimensions: Record<string, string> | null;
  materials: string[] | null;
  available_quantity: number | null;
  status: string | null;
  featured: boolean | null;
}

async function airtableGetAll(): Promise<AirtableRecord[]> {
  const out: AirtableRecord[] = [];
  let offset: string | undefined;
  do {
    const params = new URLSearchParams({ pageSize: "100" });
    if (offset) params.set("offset", offset);
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Products?${params}`,
      { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` } },
    );
    if (!res.ok) throw new Error(`Airtable ${res.status}: ${await res.text()}`);
    const body = (await res.json()) as { records: AirtableRecord[]; offset?: string };
    out.push(...body.records);
    offset = body.offset;
  } while (offset);
  return out;
}

async function airtablePatch(records: { id: string; fields: Record<string, unknown> }[]) {
  if (records.length === 0) return;
  // Airtable max 10 records per PATCH.
  for (let i = 0; i < records.length; i += 10) {
    const chunk = records.slice(i, i + 10);
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Products`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ records: chunk }),
      },
    );
    if (!res.ok) {
      throw new Error(`Airtable PATCH ${res.status}: ${await res.text()}`);
    }
  }
}

function isPlaceholder(s: string): boolean {
  return PLACEHOLDER_PATTERNS.some((p) => p.test(s));
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : undefined;
}

function asNumber(v: unknown): number | undefined {
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

function splitLines(v: unknown): string[] {
  if (typeof v !== "string") return [];
  return v.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
}

interface FieldPatch {
  field: string;
  reason: string;
  from: unknown;
  to: unknown;
}

function buildPatch(at: AirtableRecord, sb: SbRow): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const log: FieldPatch[] = [];

  // Materials Text
  const atMaterials = splitLines(at.fields["Materials Text"]);
  const sbMaterials = sb.materials ?? [];
  if (sbMaterials.length > atMaterials.length) {
    out["Materials Text"] = sbMaterials.join("\n");
    log.push({
      field: "Materials Text",
      reason: `${atMaterials.length} < ${sbMaterials.length} lines`,
      from: atMaterials,
      to: sbMaterials,
    });
  }

  // Available Quantity
  const atQty = asNumber(at.fields["Available Quantity"]);
  if (sb.available_quantity !== null && atQty !== sb.available_quantity) {
    out["Available Quantity"] = sb.available_quantity;
    log.push({
      field: "Available Quantity",
      reason: "AT differs from SB truth",
      from: atQty ?? null,
      to: sb.available_quantity,
    });
  }

  // Dimensions Text
  const atDim = asString(at.fields["Dimensions Text"]);
  const sbDim = sb.dimensions?.size ?? null;
  if (sbDim && (!atDim || isPlaceholder(atDim))) {
    out["Dimensions Text"] = sbDim;
    log.push({
      field: "Dimensions Text",
      reason: atDim ? "AT is placeholder" : "AT empty",
      from: atDim ?? null,
      to: sbDim,
    });
  }

  // Images — Airtable stores as \n-joined URL list. Replace if AT is
  // missing any URL SB currently ships.
  const atImages = splitLines(at.fields["Images"]);
  const sbImages = sb.images ?? [];
  const atSet = new Set(atImages);
  const sbMissingInAt = sbImages.filter((u) => !atSet.has(u));
  if (sbImages.length > 0 && sbMissingInAt.length > 0) {
    out["Images"] = sbImages.join("\n");
    log.push({
      field: "Images",
      reason: `AT missing ${sbMissingInAt.length} SB url(s)`,
      from: atImages.length,
      to: sbImages.length,
    });
  }

  // Category — only if AT empty.
  if (!asString(at.fields["Category"]) && sb.category) {
    out["Category"] = sb.category;
    log.push({
      field: "Category",
      reason: "AT empty",
      from: null,
      to: sb.category,
    });
  }

  // Price Cents — only if AT empty.
  if (asNumber(at.fields["Price Cents"]) === undefined && sb.price !== null) {
    out["Price Cents"] = sb.price;
    log.push({
      field: "Price Cents",
      reason: "AT empty",
      from: null,
      to: sb.price,
    });
  }

  if (log.length > 0) {
    const slug = asString(at.fields["Slug"]) ?? "?";
    console.log(`[patch] ${slug}: ${log.map((l) => l.field).join(", ")}`);
  }
  return out;
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");
  if (!SERVICE_ROLE_KEY || !AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error(
      "Missing one of SUPABASE_SERVICE_ROLE_KEY, AIRTABLE_API_KEY, AIRTABLE_BASE_ID.",
    );
  }
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const [{ data: sbRows, error }, atRecords] = await Promise.all([
    supabase
      .from("products")
      .select(
        "slug,title,description,price,images,category,dimensions,materials,available_quantity,status,featured",
      ),
    airtableGetAll(),
  ]);
  if (error) throw new Error(`Supabase read: ${error.message}`);
  if (!sbRows) throw new Error("Supabase returned no rows");

  const sbBySlug = new Map<string, SbRow>();
  for (const r of sbRows as SbRow[]) sbBySlug.set(r.slug, r);

  const patches: { id: string; fields: Record<string, unknown> }[] = [];
  for (const at of atRecords) {
    const slug = asString(at.fields["Slug"]);
    if (!slug) continue;
    const sb = sbBySlug.get(slug);
    if (!sb) {
      console.log(`[skip] ${slug}: no Supabase row`);
      continue;
    }
    const patch = buildPatch(at, sb);
    if (Object.keys(patch).length > 0) patches.push({ id: at.id, fields: patch });
  }

  console.log(
    `\n[summary] ${atRecords.length} AT records, ${patches.length} need ${dryRun ? "(would) " : ""}backfill`,
  );
  if (!dryRun && patches.length > 0) {
    await airtablePatch(patches);
    console.log(`[done] patched ${patches.length} AT records`);
  }
}

main();
