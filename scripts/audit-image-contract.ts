// Build-time guard against the class of bug that put expedition-rolltop-cognac
// on a supplier-source pdp-05 file in /products listing for weeks.
//
// The contract this script enforces:
//
// 1. DRIVE_HERO_BY_SLUG (lib/product-image-presentation.ts) — every value
//    must be `/products/hero/{slug}.webp` AND the file must exist on disk.
//    This is the Hero-* source of truth for product cards & PDP.
//
// 2. LIST_IMAGE_OVERRIDES (lib/landing-product-curation.ts) — every value
//    must be `/products/landing/{slug}-landing.webp` AND the file must
//    exist on disk. This map is ONLY for homepage presentation overrides.
//    It must NEVER point at a Supabase URL fragment, a numbered pdp variant,
//    a macro, a scale, or any non-local path.
//
// 3. No other module in lib/ may declare an `_OVERRIDES` map keyed by slug.
//    If we ever need another override layer, add it here with a tight
//    type and a file-existence check.
//
// Run: pnpm tsx scripts/audit-image-contract.ts
// Exits non-zero on any contract violation so CI catches it.

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const PUBLIC_DIR = join(REPO_ROOT, "public");

type Violation = { rule: string; detail: string };
const violations: Violation[] = [];

function extractRecord(filePath: string, mapName: string): Record<string, string> {
  const src = readFileSync(filePath, "utf8");
  const re = new RegExp(
    "const\\s+" + mapName + "\\s*:?[^=]*=\\s*\\{([\\s\\S]*?)\\n\\}",
    "m",
  );
  const m = re.exec(src);
  if (!m) {
    violations.push({
      rule: "map-present",
      detail: mapName + " not found in " + filePath,
    });
    return {};
  }
  const body = m[1];
  const out: Record<string, string> = {};
  const entryRe = /"([^"]+)"\s*:\s*"([^"]+)"/g;
  let e;
  while ((e = entryRe.exec(body)) !== null) {
    out[e[1]] = e[2];
  }
  return out;
}

function verifyFile(rule: string, slug: string, webPath: string) {
  if (!webPath.startsWith("/")) {
    violations.push({
      rule,
      detail: slug + " -> " + webPath + " is not a local path (must start with /)",
    });
    return;
  }
  const onDisk = join(PUBLIC_DIR, webPath);
  if (!existsSync(onDisk)) {
    violations.push({
      rule,
      detail: slug + " -> " + webPath + " declared but file missing at public" + webPath,
    });
  }
}

// Rule 1
{
  const map = extractRecord(
    join(REPO_ROOT, "lib", "product-image-presentation.ts"),
    "DRIVE_HERO_BY_SLUG",
  );
  for (const [slug, value] of Object.entries(map)) {
    if (!value.startsWith("/products/hero/")) {
      violations.push({
        rule: "drive-hero-path-shape",
        detail: "DRIVE_HERO_BY_SLUG[" + slug + "] = " + value + " (must start with /products/hero/)",
      });
      continue;
    }
    verifyFile("drive-hero-file-exists", slug, value);
  }
  console.log("  DRIVE_HERO_BY_SLUG: " + Object.keys(map).length + " entries audited");
}

// Rule 2
{
  const map = extractRecord(
    join(REPO_ROOT, "lib", "landing-product-curation.ts"),
    "LIST_IMAGE_OVERRIDES",
  );
  for (const [slug, value] of Object.entries(map)) {
    if (!value.startsWith("/products/landing/")) {
      violations.push({
        rule: "landing-override-path-shape",
        detail: "LIST_IMAGE_OVERRIDES[" + slug + "] = " + value + " (must start with /products/landing/)",
      });
      continue;
    }
    if (!value.endsWith(".webp")) {
      violations.push({
        rule: "landing-override-extension",
        detail: "LIST_IMAGE_OVERRIDES[" + slug + "] = " + value + " (must end with .webp)",
      });
      continue;
    }
    verifyFile("landing-override-file-exists", slug, value);
  }
  console.log("  LIST_IMAGE_OVERRIDES: " + Object.keys(map).length + " entries audited");
}

// Rule 3
{
  const allowed = new Set(["DRIVE_HERO_BY_SLUG", "LIST_IMAGE_OVERRIDES"]);
  const libFiles = ["product-image-presentation.ts", "landing-product-curation.ts", "products.ts"];
  for (const fname of libFiles) {
    const src = readFileSync(join(REPO_ROOT, "lib", fname), "utf8");
    const declRe = /const\s+([A-Z][A-Z0-9_]*OVERRIDES?[A-Z0-9_]*)\s*[:=]/g;
    let m;
    while ((m = declRe.exec(src)) !== null) {
      const name = m[1];
      if (!allowed.has(name)) {
        violations.push({
          rule: "unauthorized-override-map",
          detail: "lib/" + fname + " declares " + name + "; only DRIVE_HERO_BY_SLUG and LIST_IMAGE_OVERRIDES are sanctioned image-override maps",
        });
      }
    }
  }
}

if (violations.length === 0) {
  console.log("\n  PASS - image override contract is intact.");
  process.exit(0);
} else {
  console.error("\n  FAIL - " + violations.length + " contract violation(s):");
  for (const v of violations) {
    console.error("    [" + v.rule + "] " + v.detail);
  }
  console.error("\n  Fix the violations or update the contract in scripts/audit-image-contract.ts.");
  process.exit(1);
}
