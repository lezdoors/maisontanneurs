// Catalogue health audit — validates every product has launch-ready assets.
// Run: pnpm tsx scripts/audit-catalogue.ts
// Requires SUPABASE_SERVICE_ROLE_KEY (or anon) in .env.local.
//
// What it checks per SKU:
//   1. images[] not empty
//   2. Position-0 image is a `scale` or `pdp-white` slug (canonical hero rule)
//   3. No banned source prefixes in any image URL
//   4. All image URLs return HTTP 200
//   5. Featured products have at least one `scale` image
//   6. Slug pattern is lowercase-kebab-case
//
// Exit code: 0 if all green, 1 if any hard failure (blocks deploy).

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const BANNED_PATH_PARTS = [
  "hf_",
  "-benisouk-",
  "pexels-",
  "/_archived/",
  "/lion-",
  "/lioness-",
  "Untitled",
  "GPT-livingroom",
];

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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

async function audit(): Promise<void> {
  const { data: products, error } = await supabase
    .from("products")
    .select("slug, title, category, images, featured, status")
    .order("category", { ascending: true })
    .order("slug", { ascending: true });

  if (error) {
    console.error("Supabase error:", error.message);
    process.exit(2);
  }
  if (!products) {
    console.error("No products returned.");
    process.exit(2);
  }

  const rows: Row[] = [];
  let totalFails = 0;
  let totalWarns = 0;

  for (const p of products) {
    const issues: Issue[] = [];
    const imgs = (p.images ?? []) as string[];

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
          detail: `position 0 = ${hero.split("/").pop()} (must be scale/ or pdp-white/)`,
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
          issues.push({
            sev: "fail",
            rule: "featured-no-scale",
            detail: "featured product without a scale lifestyle shot",
          });
        }
      }

      // HEAD-check unique URLs (cap at 60 concurrent for fairness)
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

  console.log(`\n=== Catalogue audit — ${products.length} products ===\n`);

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

  console.log(`Summary: ${totalFails} hard failures, ${totalWarns} warnings, ${rows.length} SKUs with issues out of ${products.length}.`);
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
