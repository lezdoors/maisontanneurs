// Marketplace launch export for Meta Shop + Etsy prep.
//
// Reads real Supabase products plus Airtable Products/Product Assets, writes:
// - audits/marketplace-launch-YYYY-MM-DD.md
// - exports/meta-catalog-YYYY-MM-DD.csv
// - exports/etsy-listing-prep-YYYY-MM-DD.csv
//
// This is audit/export only. It does not write to Supabase, Airtable, Drive, or Storage.

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";
import { HIDDEN_SKUS } from "../lib/hidden-skus";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: join(homedir(), "Downloads", "airtable-hermes.env") });

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xbtabpurfavngwmwtawc.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY ?? "";
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID ?? "";
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.maisontanneurs.com").replace(
  /\/$/,
  "",
);
const TODAY = new Date().toISOString().slice(0, 10);
const OUT_DIR = join(process.cwd(), "exports");
const AUDIT_DIR = join(process.cwd(), "audits");

const LAUNCH_GATE_FORMULA = `AND(
  OR({Site Status}="Published",{Site Status}="Ready for site"),
  {Copy Status}="Approved",
  OR({Image Status}="Approved",{Image Status}="Partial",{Image Status}=""),
  {Launch Ready}
)`.replace(/\s+/g, " ");

type SbProduct = {
  slug: string;
  title: string | null;
  description: string | null;
  price: number | null;
  category: string | null;
  status: string | null;
  featured: boolean | null;
  images: string[] | null;
  materials: string[] | null;
  dimensions: Record<string, string> | null;
  available_quantity: number | null;
  launch_priority?: string | null;
  family_slug?: string | null;
  variant_attribute?: unknown;
  weight_lbs?: number | null;
  last_synced_at?: string | null;
};

type AirtableRecord = {
  id: string;
  createdTime?: string;
  fields: Record<string, unknown>;
};

type AssetRec = {
  id: string;
  fields: {
    Product?: string[];
    "Asset URL"?: string;
    Filename?: string;
    "Asset Type"?: string;
    Approved?: boolean;
    "Quality Status"?: string;
    Platform?: string[];
    Usage?: string;
  };
};

type Row = Record<string, string | number | boolean | null | undefined>;

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function bool(v: unknown): boolean {
  return v === true;
}

function csvEscape(v: unknown): string {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(rows: Row[], columns: string[]): string {
  return [
    columns.join(","),
    ...rows.map((row) => columns.map((c) => csvEscape(row[c])).join(",")),
  ].join("\n") + "\n";
}

function priceUsd(cents: number | null): string {
  return `${((cents ?? 0) / 100).toFixed(2)} USD`;
}

function pricePlain(cents: number | null): string {
  return ((cents ?? 0) / 100).toFixed(2);
}

function productUrl(slug: string): string {
  return `${SITE_URL}/products/${slug}`;
}

function hasHeroFirst(images: string[] | null): boolean {
  const first = images?.[0] ?? "";
  return /(?:pdp-white|hero)/i.test(first);
}

function sortedImageRuleOk(images: string[] | null): boolean {
  if (!images || images.length === 0) return false;
  if (!hasHeroFirst(images)) return false;
  return true;
}

function etsyTags(product: SbProduct): string {
  const base = [
    "leather bag",
    "moroccan leather",
    "handmade bag",
    product.category ?? "",
    product.slug.replace(/-/g, " "),
    "artisan made",
    "full grain leather",
    "marrakech",
    "gift for her",
    "gift for him",
    "travel bag",
    "boho leather",
    "luxury leather",
  ];
  return [...new Set(base.map((x) => x.toLowerCase()).filter(Boolean))]
    .slice(0, 13)
    .join(", ");
}

async function fetchAirtableTable(name: string, formula?: string): Promise<AirtableRecord[]> {
  const out: AirtableRecord[] = [];
  let offset: string | undefined;
  do {
    const params = new URLSearchParams({ pageSize: "100" });
    if (offset) params.set("offset", offset);
    if (formula) params.set("filterByFormula", formula);
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(name)}?${params}`,
      { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` } },
    );
    if (!res.ok) throw new Error(`Airtable ${name} ${res.status}: ${await res.text()}`);
    const body = (await res.json()) as { records: AirtableRecord[]; offset?: string };
    out.push(...body.records);
    offset = body.offset;
  } while (offset);
  return out;
}

async function main() {
  if (!SERVICE_ROLE_KEY || !AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY, AIRTABLE_API_KEY, or AIRTABLE_BASE_ID");
  }
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(AUDIT_DIR, { recursive: true });

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const [productsRes, atProducts, launchGatedAtProducts, atAssetsRaw] = await Promise.all([
    supabase
      .from("products")
      .select(
        "slug,title,description,price,category,status,featured,images,materials,dimensions,available_quantity,launch_priority,weight_lbs,last_synced_at",
      )
      .order("slug"),
    fetchAirtableTable("Products"),
    fetchAirtableTable("Products", LAUNCH_GATE_FORMULA),
    fetchAirtableTable("Product Assets"),
  ]);
  if (productsRes.error) throw new Error(productsRes.error.message);

  const sbProducts = (productsRes.data ?? []) as SbProduct[];
  const realProducts = sbProducts.filter(
    (p) => p.status === "available" && p.featured !== false && !HIDDEN_SKUS.has(p.slug),
  );
  const hiddenAvailableProducts = sbProducts.filter(
    (p) => p.status === "available" && p.featured !== false && HIDDEN_SKUS.has(p.slug),
  );
  const atBySlug = new Map(atProducts.map((r) => [str(r.fields.Slug), r]));
  const launchGatedSlugs = new Set(launchGatedAtProducts.map((r) => str(r.fields.Slug)).filter(Boolean));
  const approvedAssets = (atAssetsRaw as AssetRec[]).filter(
    (a) => bool(a.fields.Approved) && a.fields["Quality Status"] === "Approved",
  );
  const assetsByProduct = new Map<string, AssetRec[]>();
  for (const asset of approvedAssets) {
    const productId = asset.fields.Product?.[0];
    if (!productId) continue;
    const list = assetsByProduct.get(productId) ?? [];
    list.push(asset);
    assetsByProduct.set(productId, list);
  }

  const missingFieldRows: string[] = [];
  const imageRows: string[] = [];
  const blockers: string[] = [];
  const warnings: string[] = [];

  for (const p of realProducts) {
    const missing: string[] = [];
    if (!p.title) missing.push("title");
    if (!p.description || p.description.trim().length < 40) missing.push("description");
    if (!p.price || p.price <= 0) missing.push("price");
    if (!p.category) missing.push("category");
    if (!p.materials || p.materials.length === 0) missing.push("materials");
    if (!p.dimensions || Object.keys(p.dimensions).length === 0) missing.push("dimensions");
    if (p.available_quantity === null || p.available_quantity === undefined) missing.push("inventory");
    if (!p.images || p.images.length === 0) missing.push("images");
    const at = atBySlug.get(p.slug);
    if (!at) missing.push("airtable_product");
    if (!launchGatedSlugs.has(p.slug)) missing.push("airtable_launch_gate");
    if (missing.length > 0) missingFieldRows.push(`| \`${p.slug}\` | ${missing.join(", ")} |`);

    const productAssets = at ? assetsByProduct.get(at.id) ?? [] : [];
    const first = p.images?.[0] ?? "";
    const imageProblems: string[] = [];
    if (!sortedImageRuleOk(p.images)) imageProblems.push("main image is not hero/PDP-white first");
    if (productAssets.length === 0) imageProblems.push("no Approved + Quality Approved Airtable asset");
    if ((p.images?.length ?? 0) < 5) imageProblems.push(`thin gallery (${p.images?.length ?? 0})`);
    if (imageProblems.length > 0) {
      imageRows.push(`| \`${p.slug}\` | ${p.images?.length ?? 0} | ${first || "missing"} | ${imageProblems.join("; ")} |`);
    }
  }

  const sbSlugs = new Set(realProducts.map((p) => p.slug));
  const atSlugs = new Set(atProducts.map((r) => str(r.fields.Slug)).filter(Boolean));
  const launchGatedMissingInSb = [...launchGatedSlugs].filter(
    (s) => !sbSlugs.has(s) && !HIDDEN_SKUS.has(s),
  );
  const realSbMissingInAt = [...sbSlugs].filter((s) => !atSlugs.has(s));
  const realSbNotLaunchGated = [...sbSlugs].filter((s) => !launchGatedSlugs.has(s));
  for (const s of launchGatedMissingInSb) blockers.push(`Airtable launch-gated product missing from Supabase: ${s}`);
  for (const s of realSbMissingInAt) blockers.push(`Supabase available product missing Airtable Product: ${s}`);
  for (const s of realSbNotLaunchGated) warnings.push(`Supabase available product not passing Airtable launch gate: ${s}`);

  const exportProducts = realProducts.filter((p) => {
    const enoughImages = (p.images?.length ?? 0) >= 1;
    const heroOk = sortedImageRuleOk(p.images);
    return enoughImages && heroOk;
  });

  const omittedProducts = realProducts.filter((p) => !exportProducts.some((e) => e.slug === p.slug));

  const metaRows: Row[] = exportProducts.map((p) => ({
    id: p.slug,
    title: p.title ?? "",
    description: p.description ?? "",
    availability: (p.available_quantity ?? 0) > 0 ? "in stock" : "out of stock",
    condition: "new",
    price: priceUsd(p.price),
    link: productUrl(p.slug),
    image_link: p.images?.[0] ?? "",
    additional_image_link: (p.images ?? []).slice(1, 11).join(","),
    brand: "Maison Tanneurs",
    product_type: p.category ?? "Leather Goods",
    google_product_category: "Apparel & Accessories > Handbags, Wallets & Cases > Handbags",
    inventory: p.available_quantity ?? 0,
    custom_label_0: p.launch_priority ?? "",
    custom_label_1: p.category ?? "",
    item_group_id: p.family_slug ?? "",
  }));

  const etsyRows: Row[] = exportProducts.map((p) => ({
    sku: p.slug,
    title: p.title ?? "",
    description: [
      p.description ?? "",
      "",
      p.materials?.length ? `Materials: ${p.materials.join(", ")}` : "",
      p.dimensions?.size ? `Dimensions: ${p.dimensions.size}` : "",
      "Shipping: Free worldwide tracked express courier. Ships from Morocco.",
      "Returns and repairs: See Maison Tanneurs shop policies.",
    ].filter(Boolean).join("\n"),
    price: pricePlain(p.price),
    currency_code: "USD",
    quantity: p.available_quantity ?? 0,
    category: p.category ?? "Bags & Purses",
    materials: (p.materials ?? []).join(", "),
    tags: etsyTags(p),
    image_urls: (p.images ?? []).slice(0, 10).join(","),
    production_partner: "Maison Tanneurs atelier, Marrakech",
    who_made: "i_did",
    when_made: "made_to_order",
    is_supply: "false",
    personalization: "No",
  }));

  const metaColumns = [
    "id",
    "title",
    "description",
    "availability",
    "condition",
    "price",
    "link",
    "image_link",
    "additional_image_link",
    "brand",
    "product_type",
    "google_product_category",
    "inventory",
    "custom_label_0",
    "custom_label_1",
    "item_group_id",
  ];
  const etsyColumns = [
    "sku",
    "title",
    "description",
    "price",
    "currency_code",
    "quantity",
    "category",
    "materials",
    "tags",
    "image_urls",
    "production_partner",
    "who_made",
    "when_made",
    "is_supply",
    "personalization",
  ];

  const metaPath = join(OUT_DIR, `meta-catalog-${TODAY}.csv`);
  const etsyPath = join(OUT_DIR, `etsy-listing-prep-${TODAY}.csv`);
  const auditPath = join(AUDIT_DIR, `marketplace-launch-${TODAY}.md`);

  await writeFile(metaPath, toCsv(metaRows, metaColumns));
  await writeFile(etsyPath, toCsv(etsyRows, etsyColumns));

  const lines: string[] = [];
  lines.push(`# Maison Tanneurs Marketplace Launch Audit`);
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push("");
  lines.push(`## Product Count Validation`);
  lines.push("");
  lines.push(`- Supabase products total: ${sbProducts.length}`);
  lines.push(`- Supabase real launch products (status=available, not hidden): ${realProducts.length}`);
  lines.push(`- Supabase available products suppressed by HIDDEN_SKUS: ${hiddenAvailableProducts.length}`);
  lines.push(`- Export-approved products: ${exportProducts.length}`);
  lines.push(`- Supabase products omitted from exports: ${omittedProducts.length}`);
  lines.push(`- Airtable Products total: ${atProducts.length}`);
  lines.push(`- Airtable launch-gated Products: ${launchGatedAtProducts.length}`);
  lines.push(`- Approved Airtable Product Assets: ${approvedAssets.length}`);
  lines.push(`- Meta export rows: ${metaRows.length}`);
  lines.push(`- Etsy prep rows: ${etsyRows.length}`);
  if (omittedProducts.length > 0) {
    lines.push("");
    lines.push(`### Omitted from exports`);
    lines.push("");
    lines.push(`| Slug | Reason |`);
    lines.push(`|---|---|`);
    for (const p of omittedProducts) {
      const reasons: string[] = [];
      if (!sortedImageRuleOk(p.images)) reasons.push("main image not approved hero/PDP-white");
      if ((p.images?.length ?? 0) === 0) reasons.push("no images");
      lines.push(`| \`${p.slug}\` | ${reasons.join(", ")} |`);
    }
  }
  lines.push("");
  lines.push(`## Missing Field Report`);
  lines.push("");
  if (missingFieldRows.length === 0) lines.push(`No missing required storefront/marketplace fields found on real launch products.`);
  else {
    lines.push(`| Slug | Missing / needs review |`);
    lines.push(`|---|---|`);
    lines.push(...missingFieldRows);
  }
  lines.push("");
  lines.push(`## Image Readiness Report`);
  lines.push("");
  if (imageRows.length === 0) lines.push(`All real launch products have a hero/PDP-white first image, approved Airtable asset coverage, and 5+ images.`);
  else {
    lines.push(`| Slug | Image Count | First Image | Issue |`);
    lines.push(`|---|---:|---|---|`);
    lines.push(...imageRows);
  }
  lines.push("");
  lines.push(`## Meta Catalog Export`);
  lines.push("");
  lines.push(`- File: \`${metaPath}\``);
  lines.push(`- Format: CSV for Commerce Manager data feed upload.`);
  lines.push(`- ID policy: product slug; matches Pixel/CAPI content_ids.`);
  lines.push(`- Main image: Supabase images[0], filtered to approved hero/PDP-white-ready rows only.`);
  lines.push(`- Additional images: Supabase images[1..10].`);
  lines.push("");
  lines.push(`## Etsy Listing Prep Export`);
  lines.push("");
  lines.push(`- File: \`${etsyPath}\``);
  lines.push(`- Etsy does not provide native new-listing CSV import in Shop Manager; use this as a listing worksheet or input for Etsy API / a trusted bulk-listing tool.`);
  lines.push(`- Etsy photo rule: manually verify each row uses original product photos before publishing. Do not publish AI renders or stock-derived images to Etsy.`);
  lines.push("");
  lines.push(`## Production Blockers`);
  lines.push("");
  const allBlockers = [...blockers];
  if (allBlockers.length === 0) lines.push(`No hard data/export blockers found.`);
  else for (const b of allBlockers) lines.push(`- ${b}`);
  if (warnings.length > 0) {
    lines.push("");
    lines.push(`## Warnings`);
    lines.push("");
    for (const w of warnings) lines.push(`- ${w}`);
  }

  await writeFile(auditPath, lines.join("\n") + "\n");
  console.log(`[done] ${auditPath}`);
  console.log(`[done] ${metaPath}`);
  console.log(`[done] ${etsyPath}`);
  console.log(`[summary] sb_total=${sbProducts.length} real=${realProducts.length} at_total=${atProducts.length} at_launch_gated=${launchGatedAtProducts.length} blockers=${blockers.length} warnings=${warnings.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
