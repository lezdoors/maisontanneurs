// Etsy photo provenance audit.
//
// Etsy listing photos must be original product photos, not AI renders or stock.
// This audit does not try to "AI detect" images. It checks current launch SKUs
// against the approved Drive source folders and records whether the folder/file
// evidence proves original photography, is merely clean but unproven, or is
// high-risk for HF/generated/screenshot/source-mismatch provenance.

import { readdir, stat, writeFile, mkdir } from "node:fs/promises";
import { join, basename, extname } from "node:path";
import { HIDDEN_SKUS } from "../lib/hidden-skus";

const DRIVE_ROOT =
  process.env.MT_USABLE_PRODUCT_PICS ||
  "/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/usable product pics";
const OUT_DIR = join(process.cwd(), "audits");
const TODAY = new Date().toISOString().slice(0, 10);
const OUT_MD = join(OUT_DIR, `etsy-photo-provenance-${TODAY}.md`);
const META_EXPORT = join(process.cwd(), "exports", `meta-catalog-${TODAY}.csv`);

const IMAGE_EXT = /\.(webp|png|jpe?g|avif)$/i;
const CAMERA_EXT = /\.(jpe?g|heic|dng|tiff?)$/i;
const GENERATED_HINT = /\b(hf|higgsfield|seedance|storyboard|grid-images)\b|hf_\d|uuid/i;
const REFERENCE_HINT = /\b(screen ?shots?|screenshot|raw|supplier|ouss|reference)\b/i;

const FOLDER_ALIASES: Record<string, string[]> = {
  "atlas-messenger-laptop": ["atlas-messenger-laptop-strap"],
  "atlas-kilim-rucksack": ["Kilim Leather Duffle Bag"],
  "vintage-buckle-backpack": ["vintage-buckle-backpack-scale", "vintage-buckle-backpack-light-pdp"],
  "explorer-rolltop-cognac": ["explorer-rolltop-cognac-scale"],
  "medina-crossbody-tooled-walnut": [
    "medina-crossbody-tooled-walnut-macro",
    "medina-crossbody-walnut-macro",
  ],
  "medina-rucksack-drawstring": ["medina-rucksack-drawstring-scale"],
};

type Row = {
  slug: string;
  folders: FolderSummary[];
  status: "camera-source-proven" | "approved-folder-clean" | "high-risk" | "missing-source";
  reasons: string[];
};

type FolderSummary = {
  folder: string;
  images: string[];
  cameraLike: string[];
  generatedHints: string[];
  referenceOnly: boolean;
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function walkImages(root: string): Promise<string[]> {
  const out: string[] = [];
  async function walk(current: string) {
    const entries = await readdir(current, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      const full = join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
        continue;
      }
      if (IMAGE_EXT.test(entry.name)) out.push(full);
    }
  }
  await walk(root);
  return out;
}

async function driveFolders(): Promise<string[]> {
  const root = await stat(DRIVE_ROOT).catch(() => null);
  if (!root?.isDirectory()) throw new Error(`Drive folder not found: ${DRIVE_ROOT}`);
  const entries = await readdir(DRIVE_ROOT, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
}

function folderMatches(slug: string, folder: string): boolean {
  const folderSlug = normalize(folder);
  const aliases = [slug, ...(FOLDER_ALIASES[slug] ?? [])].map(normalize);
  return aliases.some((alias) => folderSlug === alias || folderSlug.includes(alias));
}

async function folderSummary(folder: string): Promise<FolderSummary> {
  const full = join(DRIVE_ROOT, folder);
  const images = await walkImages(full);
  const names = images.map((file) => basename(file));
  return {
    folder,
    images: names,
    cameraLike: names.filter((name) => CAMERA_EXT.test(name)),
    generatedHints: names.filter((name) => GENERATED_HINT.test(name)),
    referenceOnly: REFERENCE_HINT.test(folder),
  };
}

function isHero(name: string): boolean {
  return /^hero[-\s]/i.test(name) || /\bhero\b/i.test(name);
}

function isGallery(name: string, slug: string): boolean {
  const lower = normalize(name.replace(/\.[^.]+$/, ""));
  const nslug = normalize(slug);
  return lower.includes(nslug) && /(?:pdp|multishot|gallery)?-\d{1,2}$/.test(lower);
}

function folderScore(slug: string, folder: FolderSummary): number {
  const canonicalBonus = normalize(folder.folder) === normalize(slug) ? 100 : 0;
  const heroCount = folder.images.filter(isHero).length;
  const galleryCount = folder.images.filter((name) => !isHero(name) && isGallery(name, slug)).length;
  const riskPenalty = folder.referenceOnly || folder.generatedHints.length > 0 ? -100 : 0;
  return canonicalBonus + heroCount * 10 + galleryCount + riskPenalty;
}

function parseCsvIds(csv: string): string[] {
  const lines = csv.split(/\r?\n/).filter(Boolean);
  const ids = lines.slice(1).map((line) => line.split(",")[0]?.replace(/^"|"$/g, ""));
  return ids.filter((id) => id && !HIDDEN_SKUS.has(id));
}

function classify(slug: string, folders: FolderSummary[]): Row {
  const reasons: string[] = [];
  if (folders.length === 0) {
    return {
      slug,
      folders,
      status: "missing-source",
      reasons: ["no matching folder found under usable product pics"],
    };
  }

  const selected = [...folders].sort((a, b) => folderScore(slug, b) - folderScore(slug, a))[0];
  const imageCount = selected.images.length;
  const cameraCount = selected.cameraLike.length;
  const hintCount = selected.generatedHints.length;
  const hasReferenceOnly = selected.referenceOnly;

  if (hasReferenceOnly) reasons.push("matching folder is reference/screenshot/raw-marked");
  if (hintCount > 0) reasons.push(`${hintCount} image filename(s) look generated/renamed/HF-derived`);
  if (cameraCount === 0) reasons.push("no camera-source JPEG/HEIC/DNG/TIFF file evidence");
  if (imageCount < 5) reasons.push(`thin source folder evidence (${imageCount} image files)`);

  if (cameraCount >= 5 && hintCount === 0 && !hasReferenceOnly) {
    return { slug, folders: [selected], status: "camera-source-proven", reasons: ["camera-source file evidence present"] };
  }
  if (hasReferenceOnly || hintCount > 0 || imageCount < 5) {
    return { slug, folders: [selected], status: "high-risk", reasons };
  }
  return {
    slug,
    folders: [selected],
    status: "approved-folder-clean",
    reasons: ["approved usable product pics folder; no generated/reference filename risk"],
  };
}

async function main() {
  const csv = await import("node:fs/promises").then((fs) => fs.readFile(META_EXPORT, "utf8"));
  const slugs = parseCsvIds(csv);
  const folders = await driveFolders();
  const rows: Row[] = [];

  for (const slug of slugs) {
    const matches = folders.filter((folder) => folderMatches(slug, folder));
    const summaries = [];
    for (const folder of matches) summaries.push(await folderSummary(folder));
    rows.push(classify(slug, summaries));
  }

  await mkdir(OUT_DIR, { recursive: true });
  const counts = new Map<Row["status"], number>();
  for (const row of rows) counts.set(row.status, (counts.get(row.status) ?? 0) + 1);

  const lines: string[] = [];
  lines.push("# Maison Tanneurs — Etsy Photo Provenance Audit");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Drive root: ${DRIVE_ROOT}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Export launch SKUs audited: ${rows.length}`);
  lines.push(`- Camera-source proven folders: ${counts.get("camera-source-proven") ?? 0}`);
  lines.push(`- Approved clean usable-product-pics folders: ${counts.get("approved-folder-clean") ?? 0}`);
  lines.push(`- High-risk generated/reference evidence: ${counts.get("high-risk") ?? 0}`);
  lines.push(`- Missing source folders: ${counts.get("missing-source") ?? 0}`);
  lines.push("");
  lines.push("## Etsy Decision");
  lines.push("");
  if ((counts.get("high-risk") ?? 0) === 0 && (counts.get("missing-source") ?? 0) === 0) {
    lines.push(
      "All exported SKUs resolve to a clean approved folder under usable product pics. Etsy export can use these approved product photo sets.",
    );
  } else {
    lines.push(
      "Etsy photo provenance gate does not pass yet. Current approved folders do not prove original product photography for every exported SKU.",
    );
  }
  lines.push("");
  lines.push("## SKU Detail");
  lines.push("");
  lines.push("| Slug | Status | Evidence | Source folders |");
  lines.push("|---|---|---|---|");
  for (const row of rows) {
    const folderText =
      row.folders
        .map((folder) => `${folder.folder} (${folder.images.length} images)`)
        .join("; ") || "—";
    lines.push(
      `| \`${row.slug}\` | ${row.status} | ${row.reasons.join("; ")} | ${folderText} |`,
    );
  }
  lines.push("");
  lines.push("## Etsy Source Rule");
  lines.push("");
  if ((counts.get("high-risk") ?? 0) > 0 || (counts.get("missing-source") ?? 0) > 0) {
    lines.push(
      "For each high-risk or missing SKU, add original product photos to a clearly named Drive folder, then rebuild the Etsy photo set from those originals. Do not publish Etsy listings from HF/storyboard/screenshot/stock-derived files.",
    );
  } else {
    lines.push(
      "Use only the clean approved folders listed above from usable product pics for Etsy listing photos. Do not substitute raw, screenshot, supplier-reference, HF/storyboard, or stock-derived files.",
    );
  }

  await writeFile(OUT_MD, `${lines.join("\n")}\n`);
  console.log(`[done] ${OUT_MD}`);
  console.log(
    `[summary] total=${rows.length} camera_source=${counts.get("camera-source-proven") ?? 0} approved_clean=${counts.get("approved-folder-clean") ?? 0} high_risk=${counts.get("high-risk") ?? 0} missing=${counts.get("missing-source") ?? 0}`,
  );
  if ((counts.get("high-risk") ?? 0) > 0 || (counts.get("missing-source") ?? 0) > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
