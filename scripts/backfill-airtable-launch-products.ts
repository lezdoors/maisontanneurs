// One-shot launch backfill: create missing Airtable Products and Product
// Assets for Supabase products that are already live-ready.
//
// Usage:
//   pnpm tsx scripts/backfill-airtable-launch-products.ts --dry-run
//   pnpm tsx scripts/backfill-airtable-launch-products.ts

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { basename, join } from "node:path";
import { homedir } from "node:os";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: join(homedir(), "Downloads", "airtable-hermes.env") });

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xbtabpurfavngwmwtawc.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY ?? "";
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID ?? "";

const TARGET_SLUGS = [
  "medina-cargo-rucksack-cognac",
  "medina-crossbody-clasp-teal",
  "medina-market-tote-cognac",
  "medina-zigzag-tote-chocolate",
];

type AirtableRecord = {
  id: string;
  fields: Record<string, unknown>;
};

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
};

function requireEnv(): void {
  const missing: string[] = [];
  if (!SERVICE_ROLE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (!AIRTABLE_API_KEY) missing.push("AIRTABLE_API_KEY");
  if (!AIRTABLE_BASE_ID) missing.push("AIRTABLE_BASE_ID");
  if (missing.length > 0) throw new Error(`Missing env vars: ${missing.join(", ")}`);
}

function asString(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function dimensionText(dimensions: Record<string, string> | null): string {
  if (!dimensions) return "";
  const ordered = ["W", "H", "D"]
    .map((key) => (dimensions[key] ? `${key} ${dimensions[key]}` : ""))
    .filter(Boolean);
  return ordered.length > 0 ? ordered.join(" / ") : Object.values(dimensions).join(" / ");
}

function productFamily(category: string | null): string {
  const allowed = new Set([
    "Backpack",
    "Briefcase",
    "Crossbody",
    "Duffle",
    "Messenger",
    "Satchel",
    "Tote",
    "Wallet",
    "Weekender",
  ]);
  return category && allowed.has(category) ? category : "Other";
}

async function airtableGetAll(table: string): Promise<AirtableRecord[]> {
  const out: AirtableRecord[] = [];
  let offset: string | undefined;
  do {
    const params = new URLSearchParams({ pageSize: "100" });
    if (offset) params.set("offset", offset);
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(table)}?${params}`,
      { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` } },
    );
    if (!res.ok) throw new Error(`Airtable ${table} ${res.status}: ${await res.text()}`);
    const body = (await res.json()) as { records: AirtableRecord[]; offset?: string };
    out.push(...body.records);
    offset = body.offset;
  } while (offset);
  return out;
}

async function airtableCreate(
  table: string,
  records: { fields: Record<string, unknown> }[],
): Promise<AirtableRecord[]> {
  const out: AirtableRecord[] = [];
  for (let i = 0; i < records.length; i += 10) {
    const chunk = records.slice(i, i + 10);
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(table)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ records: chunk }),
      },
    );
    if (!res.ok) throw new Error(`Airtable create ${table} ${res.status}: ${await res.text()}`);
    const body = (await res.json()) as { records: AirtableRecord[] };
    out.push(...body.records);
  }
  return out;
}

function productFields(p: SbProduct, productNumber: number): Record<string, unknown> {
  return {
    "Product Name": p.title ?? p.slug,
    Slug: p.slug,
    Notes: p.description ?? "",
    Category: p.category ?? "Bag",
    "Product Family": productFamily(p.category),
    Status: "available",
    "Site Status": "Published",
    "Copy Status": "Approved",
    "Image Status": "Approved",
    "Hero Asset Status": "Approved",
    "Launch Priority": "P1",
    "Launch Ready": true,
    Featured: p.featured === true,
    Price: (p.price ?? 0) / 100,
    "Price Cents": p.price ?? 0,
    Images: (p.images ?? []).join("\n"),
    "Materials Text": (p.materials ?? []).join("\n"),
    "Dimensions Text": dimensionText(p.dimensions),
    "Available Quantity": p.available_quantity ?? 1,
    "Website URL": `https://maisontanneurs.com/products/${p.slug}`,
    "Product Number": productNumber,
  };
}

function assetFields(productId: string, p: SbProduct, url: string, index: number): Record<string, unknown> {
  const isHero = index === 0;
  return {
    Filename: basename(new URL(url).pathname),
    Product: [productId],
    "Asset Type": isHero ? "PDP white" : "PDP detail",
    Approved: true,
    Platform: ["Website", "Social"],
    "Asset URL": url,
    Usage: isHero ? "PDP white" : "PDP detail",
    "Quality Status": "Approved",
    Priority: isHero ? "P0" : "P1",
    Notes: "Backfilled from live Supabase product images for marketplace launch.",
    "Source Folder": `usable product pics/${p.slug}`,
    "Asset Version": index + 1,
  };
}

async function main(): Promise<void> {
  requireEnv();
  const dryRun = process.argv.includes("--dry-run");
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const [{ data, error }, atProducts, atAssets] = await Promise.all([
    supabase
      .from("products")
      .select(
        "slug,title,description,price,category,status,featured,images,materials,dimensions,available_quantity",
      )
      .in("slug", TARGET_SLUGS)
      .order("slug"),
    airtableGetAll("Products"),
    airtableGetAll("Product Assets"),
  ]);
  if (error) throw new Error(`Supabase read: ${error.message}`);
  const products = ((data ?? []) as SbProduct[]).filter((p) => p.status === "available");
  const atBySlug = new Map<string, AirtableRecord>();
  for (const record of atProducts) {
    const slug = asString(record.fields.Slug);
    if (slug) atBySlug.set(slug, record);
  }
  const assetUrlSet = new Set(
    atAssets.map((r) => asString(r.fields["Asset URL"])).filter((url) => url.length > 0),
  );

  const missingProducts = products.filter((p) => !atBySlug.has(p.slug));
  const maxProductNumber = Math.max(
    0,
    ...atProducts
      .map((record) => record.fields["Product Number"])
      .filter((value): value is number => typeof value === "number" && Number.isFinite(value)),
  );
  console.log(`[products] ${products.length} Supabase target rows, ${missingProducts.length} missing in Airtable`);
  for (const p of missingProducts) console.log(`  create Product: ${p.slug}`);

  let createdProducts: AirtableRecord[] = [];
  if (!dryRun && missingProducts.length > 0) {
    createdProducts = await airtableCreate(
      "Products",
      missingProducts.map((p, index) => ({
        fields: productFields(p, maxProductNumber + index + 1),
      })),
    );
    console.log(`[products] created ${createdProducts.length}`);
  }

  for (const rec of createdProducts) {
    const slug = asString(rec.fields.Slug);
    if (slug) atBySlug.set(slug, rec);
  }

  const assetsToCreate: { fields: Record<string, unknown> }[] = [];
  for (const p of products) {
    const atProduct = atBySlug.get(p.slug);
    if (!atProduct) continue;
    for (const [index, url] of (p.images ?? []).entries()) {
      if (assetUrlSet.has(url)) continue;
      assetsToCreate.push({ fields: assetFields(atProduct.id, p, url, index) });
    }
  }

  console.log(`[assets] ${assetsToCreate.length} missing Product Asset rows`);
  for (const a of assetsToCreate) {
    console.log(`  create Asset: ${a.fields.Filename}`);
  }
  if (!dryRun && assetsToCreate.length > 0) {
    const createdAssets = await airtableCreate("Product Assets", assetsToCreate);
    console.log(`[assets] created ${createdAssets.length}`);
  }

  console.log(`[done] ${dryRun ? "dry-run" : "backfill complete"}`);
}

main();
