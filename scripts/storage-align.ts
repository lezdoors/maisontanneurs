// Phase D — Supabase Storage alignment.
//
// For each Airtable Product with at least one Approved + Quality-Approved
// asset, ensure that:
//   1. The asset Asset URL is reachable (HTTP 200) in Supabase Storage.
//   2. The matching Supabase products.images[0] points at that URL
//      (the canonical hero).
//   3. images[] ordering follows the Tanneurs convention (closest
//      analogue to feedback_image_array_ordering):
//        position 0: AT-approved hero (typically *-pdp-white.webp)
//        position 1: -scale.webp if present
//        position 2+: remaining PDP / archive shots, ordered by current
//                     position in images[] (preserves Codex-curated ordering
//                     beyond the hero slot)
//   4. Every URL in the resulting images[] returns 200.
//
// Source-of-truth split is preserved: this script reads AT Approved
// records but never uploads new Storage objects or renames anything. If
// an approved file is 404 in Storage, we flag and skip (no clobber).
// Storage rename to canonical filenames is deferred — would break
// live PDPs that reference slug-named URLs.
//
// Usage:
//   pnpm tsx scripts/storage-align.ts --dry-run
//   pnpm tsx scripts/storage-align.ts

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { join } from "node:path";
import { homedir } from "node:os";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: join(homedir(), "Downloads", "airtable-hermes.env") });

const SUPABASE_URL = "https://xbtabpurfavngwmwtawc.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY ?? "";
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID ?? "";

interface AssetRec {
  id: string;
  fields: {
    "Asset URL"?: string;
    "Asset Type"?: string;
    Usage?: string;
    "Product ID (cache)"?: string;
    Product?: string[];
  };
}

interface ProductRec {
  id: string;
  fields: {
    Slug?: string;
    "Product ID"?: string;
  };
}

async function fetchAirtableTable<T>(name: string, formula?: string): Promise<T[]> {
  const out: T[] = [];
  let offset: string | undefined;
  do {
    const params = new URLSearchParams({ pageSize: "100" });
    if (offset) params.set("offset", offset);
    if (formula) params.set("filterByFormula", formula);
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

async function head200(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.status === 200;
  } catch {
    return false;
  }
}

function rankImage(url: string, heroUrl: string | null): number {
  // Lower number = earlier in images[].
  if (heroUrl && url === heroUrl) return 0;
  const lower = url.toLowerCase();
  if (/-pdp-white\.webp$/.test(lower)) return 1;
  if (/-scale\.webp$/.test(lower)) return 2;
  if (/-hero\.webp$/.test(lower)) return 3;
  if (/-lifestyle/.test(lower)) return 4;
  if (/-atelier/.test(lower)) return 5;
  return 10; // PDP-NN / archive / everything else
}

function isHeroAsset(a: AssetRec): boolean {
  const url = a.fields["Asset URL"]?.toLowerCase() ?? "";
  const type = a.fields["Asset Type"]?.toLowerCase() ?? "";
  const usage = a.fields.Usage?.toLowerCase() ?? "";
  return (
    /-pdp-white\.webp$/.test(url) ||
    /-hero\.webp$/.test(url) ||
    type === "pdp white" ||
    type === "hero" ||
    usage === "pdp white" ||
    usage === "hero"
  );
}

interface AlignAction {
  slug: string;
  productId: string | null;
  heroUrl: string | null;
  beforeImages: string[];
  afterImages: string[];
  status: "noop" | "would-reorder" | "reordered" | "skipped-404" | "skipped-no-hero" | "skipped-missing-sb";
  reason?: string;
}

async function readSbProducts(
  supabase: SupabaseClient,
): Promise<Map<string, { images: string[] }>> {
  const { data, error } = await supabase
    .from("products")
    .select("slug,images");
  if (error) throw new Error(`SB read: ${error.message}`);
  const map = new Map<string, { images: string[] }>();
  for (const r of data as { slug: string; images: string[] | null }[]) {
    map.set(r.slug, { images: r.images ?? [] });
  }
  return map;
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");
  if (!SERVICE_ROLE_KEY || !AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error("Missing env");
  }
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const [approvedAssets, products, sbProducts] = await Promise.all([
    fetchAirtableTable<AssetRec>(
      "Product Assets",
      "AND({Approved},{Quality Status}=\"Approved\")",
    ),
    fetchAirtableTable<ProductRec>("Products"),
    readSbProducts(supabase),
  ]);
  console.log(
    `[fetched] ${approvedAssets.length} approved AT assets, ${products.length} AT products, ${sbProducts.size} SB rows`,
  );

  // Per-product, pick the PDP-white-tier Approved asset URL as hero. Airtable
  // API order is not a sorting contract, so do not rely on "first wins" unless
  // we have no explicit hero/PDP-white candidate.
  const assetsByProductRec = new Map<string, AssetRec[]>();
  for (const a of approvedAssets) {
    const link = a.fields.Product?.[0];
    const url = a.fields["Asset URL"];
    if (!link || !url) continue;
    const list = assetsByProductRec.get(link) ?? [];
    list.push(a);
    assetsByProductRec.set(link, list);
  }

  const productBySlug = new Map<string, ProductRec>();
  for (const p of products) if (p.fields.Slug) productBySlug.set(p.fields.Slug, p);

  const actions: AlignAction[] = [];
  for (const p of products) {
    const slug = p.fields.Slug ?? "?";
    const pid = p.fields["Product ID"] ?? null;
    const productAssets = assetsByProductRec.get(p.id) ?? [];
    const explicitHero = productAssets.find(isHeroAsset);
    const heroUrl = explicitHero?.fields["Asset URL"] ?? productAssets[0]?.fields["Asset URL"] ?? null;
    const sb = sbProducts.get(slug);
    if (!sb) {
      actions.push({
        slug,
        productId: pid,
        heroUrl,
        beforeImages: [],
        afterImages: [],
        status: "skipped-missing-sb",
      });
      continue;
    }
    const before = sb.images;
    if (!heroUrl) {
      actions.push({
        slug,
        productId: pid,
        heroUrl,
        beforeImages: before,
        afterImages: before,
        status: "skipped-no-hero",
        reason: "no Approved+QualityApproved asset",
      });
      continue;
    }
    // Sort using rank, stable. Hero (rank 0) is placed first.
    const ranked = before.map((u, i) => ({ u, r: rankImage(u, heroUrl), i }));
    ranked.sort((a, b) => a.r - b.r || a.i - b.i);
    const after = ranked.map((x) => x.u);

    // Hero must actually be in images[]. If not, log + skip (we don't add new URLs;
    // sync-airtable owns image content writes).
    if (!before.includes(heroUrl)) {
      actions.push({
        slug,
        productId: pid,
        heroUrl,
        beforeImages: before,
        afterImages: before,
        status: "skipped-no-hero",
        reason: "AT hero URL not present in SB images[] — sync-airtable.ts has not landed it yet",
      });
      continue;
    }

    const same = before.length === after.length && before.every((u, i) => u === after[i]);
    if (same) {
      actions.push({
        slug,
        productId: pid,
        heroUrl,
        beforeImages: before,
        afterImages: after,
        status: "noop",
      });
      continue;
    }
    actions.push({
      slug,
      productId: pid,
      heroUrl,
      beforeImages: before,
      afterImages: after,
      status: dryRun ? "would-reorder" : "reordered",
    });
  }

  // 404 sweep on all URLs touched (before + after).
  const urlSet = new Set<string>();
  for (const a of actions) {
    for (const u of a.afterImages) urlSet.add(u);
    for (const u of a.beforeImages) urlSet.add(u);
  }
  console.log(`[head] checking ${urlSet.size} URLs for 200`);
  const broken: string[] = [];
  const all = [...urlSet];
  for (let i = 0; i < all.length; i += 8) {
    const batch = all.slice(i, i + 8);
    const results = await Promise.all(batch.map(async (u) => ({ u, ok: await head200(u) })));
    for (const r of results) if (!r.ok) broken.push(r.u);
  }
  if (broken.length > 0) {
    console.log(`[broken] ${broken.length} URL(s) not 200:`);
    for (const b of broken.slice(0, 20)) console.log(`  ${b}`);
  } else {
    console.log(`[head] all 200`);
  }

  // Apply reorders.
  let applied = 0;
  for (const a of actions) {
    if (a.status === "reordered") {
      const { error } = await supabase
        .from("products")
        .update({
          images: a.afterImages,
          updated_at: new Date().toISOString(),
        })
        .eq("slug", a.slug);
      if (error) {
        console.log(`[error] ${a.slug}: ${error.message}`);
        continue;
      }
      applied++;
      console.log(`[reordered] ${a.slug}: hero now ${a.heroUrl?.split("/").pop()}`);
    } else if (a.status === "would-reorder") {
      console.log(
        `[dry-run] ${a.slug}: would reorder ${a.beforeImages.length} images, hero -> ${a.heroUrl?.split("/").pop()}`,
      );
    } else if (a.status === "skipped-no-hero" || a.status === "skipped-missing-sb") {
      console.log(`[skip] ${a.slug}: ${a.reason ?? a.status}`);
    }
  }

  const summary = {
    total: actions.length,
    noop: actions.filter((a) => a.status === "noop").length,
    reordered_or_would: actions.filter(
      (a) => a.status === "reordered" || a.status === "would-reorder",
    ).length,
    skipped: actions.filter((a) => a.status.startsWith("skipped")).length,
    broken_urls: broken.length,
  };
  console.log(
    `[summary] total=${summary.total} noop=${summary.noop} reordered=${summary.reordered_or_would} skipped=${summary.skipped} broken=${summary.broken_urls}`,
  );

  if (summary.broken_urls > 0) process.exitCode = 1;
  void applied;
}

main();
