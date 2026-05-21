// Catalogue health audit — validates every product has launch-ready assets.
// Run: pnpm tsx scripts/audit-catalogue.ts
//
// Source resolution:
//   1. If NEXT_PUBLIC_SUPABASE_URL + an anon/service key are set, audit the
//      live products table directly (truth source on deployed targets).
//   2. Otherwise fall back to STATIC_PRODUCTS in lib/products.ts (the same
//      fallback the storefront uses when Supabase is unreachable). Both
//      paths run the identical rule set.
//
// What it checks per SKU:
//   1. images[] not empty
//   2. Position-0 image is a `-scale.webp` / `/scale/` or `-pdp-white.webp`
//      / `/pdp-white/` URL (canonical hero rule)
//   3. No banned source prefixes in any image URL
//   4. All image URLs return HTTP 200
//   5. Featured products have at least one `-scale.webp` image
//   6. Slug pattern is lowercase-kebab-case
//
// Drafts (status="draft") and image-less reserved SKUs skip image rules.
// Exit code: 0 if all green, 1 if any hard failure (blocks deploy).

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { STATIC_PRODUCTS } from "../lib/products";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

// Tanneurs-specific source-trail blocklist. Hits at any position in the URL
// fail the SKU. Covers: raw HF outputs, supplier/dealer originals, gen-tool
// scratch filenames, archive paths, and OS junk.
const BANNED_PATH_PARTS = [
  "hf_",
  "GPT-",
  "Untitled",
  "/_archived/",
  "-benisouk-",
  "-supplier-",
  "-dealer-",
  "-tannery-raw-",
  "-tanneur-raw-",
  "pexels-",
];

// Grandfathered SKUs that are LIVE on cyclorama-only catalogue shots without
// a separate lifestyle scale shot. featured-no-scale issues warn (not fail)
// for these slugs while their lifestyle gens are still in the HF pipeline.
// Remove a slug from this set the moment its <slug>-scale.webp lands.
const AWAITING_SCALE_SHOTS = new Set<string>([
  "black-stitched-backpack",
  "cognac-brogue-backpack",
  "classic-cognac-satchel",
  "woven-leather-backpack",
  "vintage-buckle-backpack",
]);

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type Product = {
  slug: string;
  title: string;
  category?: string | null;
  images: string[];
  featured?: boolean | null;
  status?: string | null;
};

type Issue = { sev: "fail" | "warn"; rule: string; detail: string };
type Row = { slug: string; title: string; issues: Issue[] };

async function head(url: string): Promise<number> {
  try {
    const r = await fetch(url, { method: "HEAD" });
    return r.status;
  } catch {
    return 0;
  }
}

async function loadProducts(): Promise<{ products: Product[]; source: string }> {
  if (SUPABASE_URL && SUPABASE_KEY) {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data, error } = await supabase
      .from("products")
      .select("slug, title, category, images, featured, status")
      .order("category", { ascending: true })
      .order("slug", { ascending: true });
    if (error) {
      console.error("Supabase error:", error.message);
      process.exit(2);
    }
    if (!data) {
      console.error("No products returned from Supabase.");
      process.exit(2);
    }
    return { products: data as Product[], source: `Supabase (${SUPABASE_URL})` };
  }
  // Offline fallback — same data the storefront serves when Supabase is down.
  const sorted = [...STATIC_PRODUCTS].sort((a, b) =>
    a.category === b.category ? a.slug.localeCompare(b.slug) : a.category.localeCompare(b.category),
  );
  return {
    products: sorted.map((p) => ({
      slug: p.slug,
      title: p.title,
      category: p.category,
      images: p.images,
      featured: p.featured,
      status: p.status,
    })),
    source: "STATIC_PRODUCTS (lib/products.ts fallback — no Supabase env vars set)",
  };
}

async function audit(): Promise<void> {
  // Temporary escape hatch — set via Vercel env during the one-shot
  // canonical-rename deploy. Removed in the cleanup commit immediately after.
  if (process.env.SKIP_AUDIT === "1") {
    console.log("SKIP_AUDIT=1 — audit bypassed for this build.");
    process.exit(0);
  }
  const { products, source } = await loadProducts();

  const rows: Row[] = [];
  let totalFails = 0;
  let totalWarns = 0;
  let skippedDrafts = 0;

  for (const p of products) {
    const imgs = (p.images ?? []) as string[];

    if (p.status === "draft" || (p.status === "reserved" && imgs.length === 0)) {
      skippedDrafts++;
      continue;
    }

    const issues: Issue[] = [];

    if (!SLUG_REGEX.test(p.slug)) {
      issues.push({ sev: "warn", rule: "slug", detail: `slug "${p.slug}" not lowercase-kebab` });
    }

    if (imgs.length === 0) {
      issues.push({ sev: "fail", rule: "images-empty", detail: "no images" });
    } else {
      const hero = imgs[0];
      const heroOk =
        /\/scale\//.test(hero) ||
        /-scale\.webp$/.test(hero) ||
        /\/pdp-white\//.test(hero) ||
        /-pdp-white\.webp$/.test(hero);
      if (!heroOk) {
        issues.push({
          sev: "fail",
          rule: "hero-not-canonical",
          detail: `position 0 = ${hero.split("/").pop()} (must end -scale.webp or -pdp-white.webp)`,
        });
      }

      for (const u of imgs) {
        for (const bad of BANNED_PATH_PARTS) {
          if (u.includes(bad)) {
            issues.push({
              sev: "fail",
              rule: "banned-source",
              detail: `${bad} in ${u.split("/").pop()}`,
            });
          }
        }
      }

      if (p.featured) {
        const hasScale = imgs.some(
          (u) => /\/scale\//.test(u) || /-scale\.webp$/.test(u),
        );
        if (!hasScale) {
          const grandfathered = AWAITING_SCALE_SHOTS.has(p.slug);
          issues.push({
            sev: grandfathered ? "warn" : "fail",
            rule: "featured-no-scale",
            detail: grandfathered
              ? "grandfathered — lifestyle gen pending in HF pipeline"
              : "featured product without a scale lifestyle shot",
          });
        }
      }

      const unique = [...new Set(imgs)];
      const codes = await Promise.all(unique.map(head));
      unique.forEach((u, i) => {
        if (codes[i] !== 200) {
          issues.push({
            sev: "fail",
            rule: "image-404",
            detail: `${codes[i] || "ERR"} on ${u.split("/").slice(-2).join("/")}`,
          });
        }
      });
    }

    if (issues.length) {
      rows.push({ slug: p.slug, title: p.title, issues });
      totalFails += issues.filter((i) => i.sev === "fail").length;
      totalWarns += issues.filter((i) => i.sev === "warn").length;
    }
  }

  console.log(`\n=== Tanneurs catalogue audit ===`);
  console.log(`Source: ${source}`);
  console.log(`Audited: ${products.length - skippedDrafts} SKUs (${skippedDrafts} drafts skipped)\n`);

  if (rows.length === 0) {
    console.log("All green. No issues found.");
    process.exit(0);
  }

  for (const r of rows) {
    console.log(`[${r.slug}] ${r.title}`);
    for (const i of r.issues) {
      const icon = i.sev === "fail" ? "FAIL" : "warn";
      console.log(`  ${icon}  ${i.rule.padEnd(20)} ${i.detail}`);
    }
    console.log("");
  }

  console.log(`Summary: ${totalFails} hard failures, ${totalWarns} warnings, ${rows.length} SKUs with issues.`);
  if (totalFails > 0) {
    console.log("Exit 1 — blocks deploy.");
    process.exit(1);
  }
  console.log("Exit 0 — warnings only, deploy allowed.");
  process.exit(0);
}

audit().catch((e) => {
  console.error("audit crashed:", e);
  process.exit(2);
});
