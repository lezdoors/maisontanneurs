// Launch-readiness report — per-Product pass/fail across the launch
// checklist. Outputs Markdown to audits/launch-readiness-<date>.md plus
// a console "X/24 ready" summary.
//
// Checks per Product:
//   1. Title present
//   2. Slug present (lowercase-kebab-case)
//   3. Price > 0
//   4. Description >= 40 chars
//   5. Category present and in known storefront list
//   6. >=1 Approved + QualityApproved PDP/Scale/PDP-white asset
//   7. >=1 Approved + QualityApproved Lifestyle asset
//   8. >=1 Approved + QualityApproved Meta variant (4x5 or 1x1) — checked
//      via Asset Type=Meta + Notes hint
//   9. Hero is HF-cinematic, not supplier raw (heuristic: filename
//      contains supplier-pool path OR "raw-"/"benisouk"/"workshop")
//  10. Alt text — Supabase doesn't store alt explicitly; check title
//      length >= 10 (used as alt on the storefront)
//
// Usage: pnpm tsx scripts/launch-readiness.ts

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";
import { HIDDEN_SKUS } from "../lib/hidden-skus";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: join(homedir(), "Downloads", "airtable-hermes.env") });

const SUPABASE_URL = "https://xbtabpurfavngwmwtawc.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY ?? "";
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID ?? "";

const OUT_DIR = join(process.cwd(), "audits");
const TODAY = new Date().toISOString().slice(0, 10);
const OUT_MD = join(OUT_DIR, `launch-readiness-${TODAY}.md`);

const STOREFRONT_CATEGORIES = new Set([
  "Backpack",
  "Crossbody",
  "Weekender",
  "Tote",
  "Briefcase",
  "Messenger",
  "Duffle",
  "Satchel",
  "Saddlebag",
  "Wallet",
  // Legacy values still permitted because old rows shipped under them.
  "Leather Goods",
  "Bags",
]);

const SUPPLIER_RAW_HINTS = [
  "_supplier-pool",
  "benisouk",
  "workshop",
  "raw-new",
  "etsy-1x1",
];

interface SbProduct {
  slug: string;
  title: string | null;
  description: string | null;
  price: number | null;
  category: string | null;
  images: string[] | null;
  status: string | null;
  featured: boolean | null;
}

interface AssetRec {
  fields: {
    "Asset Type"?: string;
    Approved?: boolean;
    "Quality Status"?: string;
    Filename?: string;
    Notes?: string;
    Usage?: string;
    Platform?: string[];
    Product?: string[];
  };
}

interface ProductRec {
  id: string;
  fields: {
    Slug?: string;
    "Product ID"?: string;
    "Product Name"?: string;
    "Site Status"?: string;
    "Launch Ready"?: boolean;
  };
}

interface Check { name: string; pass: boolean; detail?: string; gating: boolean }
interface ProductReadiness {
  productId: string;
  slug: string;
  ready: boolean;
  blockers: string[];
  warnings: string[];
  checks: Check[];
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

async function readSbProducts(supabase: SupabaseClient): Promise<Map<string, SbProduct>> {
  const { data, error } = await supabase
    .from("products")
    .select("slug,title,description,price,category,images,status,featured");
  if (error) throw new Error(error.message);
  const map = new Map<string, SbProduct>();
  for (const r of data as SbProduct[]) map.set(r.slug, r);
  return map;
}

function looksLikeSupplierRaw(url: string): boolean {
  const lower = url.toLowerCase();
  return SUPPLIER_RAW_HINTS.some((h) => lower.includes(h));
}

function evaluate(
  product: ProductRec,
  sb: SbProduct | undefined,
  approvedAssets: AssetRec[],
): ProductReadiness {
  const checks: Check[] = [];
  const pid = product.fields["Product ID"] ?? "?";
  const slug = product.fields.Slug ?? "?";

  if (!sb) {
    return {
      productId: pid,
      slug,
      ready: false,
      blockers: ["no Supabase row"],
      warnings: [],
      checks: [{ name: "supabase_row", pass: false, gating: true }],
    };
  }

  const title = sb.title ?? "";
  checks.push({
    name: "title",
    gating: true,
    pass: title.length > 0,
    detail: title.length === 0 ? "missing" : undefined,
  });

  checks.push({
    name: "slug_kebab",
    gating: true,
    pass: /^[a-z0-9]+(-[a-z0-9]+)*$/.test(sb.slug),
    detail: !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(sb.slug) ? sb.slug : undefined,
  });

  checks.push({
    name: "price",
    gating: true,
    pass: (sb.price ?? 0) > 0,
    detail: (sb.price ?? 0) === 0 ? "0 or null" : undefined,
  });

  const descLen = (sb.description ?? "").trim().length;
  checks.push({
    name: "description_>=40",
    gating: true,
    pass: descLen >= 40,
    detail: descLen < 40 ? `${descLen} chars` : undefined,
  });

  const category = sb.category ?? "";
  checks.push({
    name: "category_known",
    gating: true,
    pass: STOREFRONT_CATEGORIES.has(category),
    detail: !STOREFRONT_CATEGORIES.has(category) ? `${category || "missing"}` : undefined,
  });

  // Asset-driven checks: scan assets linked to this AT Product record.
  const ours = approvedAssets.filter((a) => a.fields.Product?.[0] === product.id);
  const types = new Set(ours.map((a) => a.fields["Asset Type"] ?? ""));

  const hasPdpTier = types.has("PDP white") || types.has("Scale") || types.has("PDP");
  checks.push({
    name: "approved_pdp_or_scale",
    gating: true,
    pass: hasPdpTier,
    detail: hasPdpTier ? undefined : "no Approved PDP/Scale asset",
  });

  // Lifestyle + Meta are NOT gating: Tanneurs is launching with PDP-tier
  // assets only and Lifestyle/Meta variants are roadmap. Surface as
  // warnings so the gap is visible without blocking launch.
  const hasLifestyle = types.has("Lifestyle");
  checks.push({
    name: "approved_lifestyle",
    gating: false,
    pass: hasLifestyle,
    detail: hasLifestyle ? undefined : "no Approved Lifestyle asset",
  });

  const hasMeta =
    types.has("Meta") ||
    ours.some((a) => (a.fields.Platform ?? []).some((p) => /social/i.test(p)));
  checks.push({
    name: "approved_meta_variant",
    gating: false,
    pass: hasMeta,
    detail: hasMeta ? undefined : "no Approved Meta or Social asset",
  });

  // Hero not supplier raw — check images[0].
  const hero = sb.images?.[0];
  const heroOk = !hero || !looksLikeSupplierRaw(hero);
  checks.push({
    name: "hero_not_supplier_raw",
    gating: true,
    pass: heroOk,
    detail: heroOk ? undefined : `images[0] looks like supplier raw: ${hero}`,
  });

  // Alt-text proxy — title length is used as default alt by ProductCard.
  checks.push({
    name: "title_long_enough_for_alt",
    gating: true,
    pass: title.length >= 10,
    detail: title.length < 10 ? `${title.length} chars` : undefined,
  });

  const blockers = checks
    .filter((c) => !c.pass && c.gating)
    .map((c) => `${c.name}: ${c.detail ?? ""}`.trim());
  const warnings = checks
    .filter((c) => !c.pass && !c.gating)
    .map((c) => `${c.name}: ${c.detail ?? ""}`.trim());
  return {
    productId: pid,
    slug,
    ready: blockers.length === 0,
    blockers,
    warnings,
    checks,
  };
}

async function main(): Promise<void> {
  if (!SERVICE_ROLE_KEY || !AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error("Missing env");
  }
  await mkdir(OUT_DIR, { recursive: true });

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const [products, approvedAssets, sb] = await Promise.all([
    fetchAirtableTable<ProductRec>("Products"),
    (async () => {
      const all = await fetchAirtableTable<AssetRec>("Product Assets");
      return all.filter(
        (a) => a.fields.Approved === true && a.fields["Quality Status"] === "Approved",
      );
    })(),
    readSbProducts(supabase),
  ]);

  const suppressed = products.filter((p) => {
    const slug = p.fields.Slug ?? "";
    return HIDDEN_SKUS.has(slug) || p.fields["Site Status"] === "Hidden" || p.fields["Launch Ready"] !== true;
  });
  const launchProducts = products.filter((p) => !suppressed.includes(p));

  const reports = launchProducts
    .map((p) => evaluate(p, sb.get(p.fields.Slug ?? ""), approvedAssets))
    .sort((a, b) => a.productId.localeCompare(b.productId));

  const ready = reports.filter((r) => r.ready).length;
  const total = reports.length;

  const lines: string[] = [];
  lines.push(`# Maison Tanneurs — Launch Readiness`);
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push("");
  lines.push(`## Summary — ${ready} / ${total} SKUs ready`);
  lines.push("");
  lines.push(`Launch-scope Airtable Products: ${launchProducts.length}`);
  lines.push(`Suppressed/non-launch Airtable Products: ${suppressed.length}`);
  lines.push("");
  lines.push(`| Product ID | Slug | Status | Blockers | Warnings |`);
  lines.push(`|---|---|---|---|---|`);
  for (const r of reports) {
    const status = r.ready ? "READY" : "BLOCKED";
    const bl = r.blockers.length > 0 ? r.blockers.join("; ") : "—";
    const wn = r.warnings.length > 0 ? r.warnings.join("; ") : "—";
    lines.push(`| ${r.productId} | \`${r.slug}\` | ${status} | ${bl} | ${wn} |`);
  }
  lines.push("");
  lines.push(`## Blocker breakdown`);
  lines.push("");
  const counts = new Map<string, number>();
  for (const r of reports) {
    for (const b of r.blockers) {
      const key = b.split(":")[0];
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  if (ranked.length === 0) lines.push(`_No blockers — every SKU is launch-ready._`);
  else for (const [k, v] of ranked) lines.push(`- ${k}: ${v} SKU(s)`);
  lines.push("");
  lines.push(`## Warning breakdown (non-gating)`);
  lines.push("");
  const wcounts = new Map<string, number>();
  for (const r of reports) {
    for (const w of r.warnings) {
      const key = w.split(":")[0];
      wcounts.set(key, (wcounts.get(key) ?? 0) + 1);
    }
  }
  const wranked = [...wcounts.entries()].sort((a, b) => b[1] - a[1]);
  if (wranked.length === 0) lines.push(`_No warnings._`);
  else for (const [k, v] of wranked) lines.push(`- ${k}: ${v} SKU(s)`);

  await writeFile(OUT_MD, lines.join("\n") + "\n");
  console.log(`[done] ${OUT_MD}`);
  console.log(`[summary] ${ready} / ${total} SKUs ready`);
}

main();
