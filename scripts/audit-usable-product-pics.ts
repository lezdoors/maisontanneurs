// Audit the approved Google Drive "usable product pics" folder for the exact
// launch-export SKU set.
//
// Checks:
// - one matching source folder per exported SKU
// - at least one Hero-* image for the product main image
// - numbered gallery/multishot images after hero
// - risk hints such as screenshots/raw/storyboard/HF filenames

import { readdir, stat, writeFile, mkdir } from "node:fs/promises";
import { join, basename } from "node:path";
import { HIDDEN_SKUS } from "../lib/hidden-skus";

const DRIVE_ROOT =
  process.env.MT_USABLE_PRODUCT_PICS ||
  "/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/usable product pics";
const OUT_DIR = join(process.cwd(), "audits");
const TODAY = new Date().toISOString().slice(0, 10);
const META_EXPORT = join(process.cwd(), "exports", `meta-catalog-${TODAY}.csv`);
const OUT_MD = join(OUT_DIR, `usable-product-pics-audit-${TODAY}.md`);

const IMAGE_EXT = /\.(webp|png|jpe?g|avif|heic|dng|tiff?)$/i;
const RISK_HINT = /\b(screen ?shots?|screenshot|raw|supplier|storyboard|hf_|higgsfield|seedance|reference)\b/i;

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

type FolderAudit = {
  slug: string;
  status: "ready" | "review" | "blocked";
  folder: string;
  heroCount: number;
  galleryCount: number;
  imageCount: number;
  risks: string[];
  notes: string[];
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseCsvIds(csv: string): string[] {
  return csv
    .split(/\r?\n/)
    .filter(Boolean)
    .slice(1)
    .map((line) => line.split(",")[0]?.replace(/^"|"$/g, ""))
    .filter((id) => id && !HIDDEN_SKUS.has(id));
}

async function topLevelFolders(): Promise<string[]> {
  const root = await stat(DRIVE_ROOT).catch(() => null);
  if (!root?.isDirectory()) throw new Error(`Drive folder not found: ${DRIVE_ROOT}`);
  const entries = await readdir(DRIVE_ROOT, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
}

async function listImages(folder: string): Promise<string[]> {
  const entries = await readdir(join(DRIVE_ROOT, folder), { withFileTypes: true }).catch(() => []);
  return entries
    .filter((entry) => entry.isFile() && IMAGE_EXT.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function folderMatches(slug: string, folder: string): boolean {
  const folderSlug = normalize(folder);
  const aliases = [slug, ...(FOLDER_ALIASES[slug] ?? [])].map(normalize);
  return aliases.some((alias) => folderSlug === alias || folderSlug.includes(alias));
}

function isHero(name: string): boolean {
  return /^hero[-\s]/i.test(name) || /\bhero\b/i.test(name);
}

function isGallery(name: string, slug: string): boolean {
  const lower = normalize(name.replace(/\.[^.]+$/, ""));
  const nslug = normalize(slug);
  return lower.includes(nslug) && /(?:pdp|multishot|gallery)?-\d{1,2}$/.test(lower);
}

async function auditSlug(slug: string, folders: string[]): Promise<FolderAudit> {
  const matches = folders.filter((folder) => folderMatches(slug, folder));
  const notes: string[] = [];
  const risks: string[] = [];

  if (matches.length === 0) {
    return {
      slug,
      status: "blocked",
      folder: "—",
      heroCount: 0,
      galleryCount: 0,
      imageCount: 0,
      risks: ["no matching folder in usable product pics"],
      notes,
    };
  }

  const candidates = [];
  for (const match of matches) {
    const images = await listImages(match);
    const heroCount = images.filter(isHero).length;
    const galleryCount = images.filter((name) => !isHero(name) && isGallery(name, slug)).length;
    const canonicalBonus = normalize(match) === normalize(slug) ? 100 : 0;
    candidates.push({ folder: match, images, heroCount, galleryCount, score: canonicalBonus + heroCount * 10 + galleryCount });
  }
  candidates.sort((a, b) => b.score - a.score || a.folder.localeCompare(b.folder));
  const selected = candidates[0];
  const folder = selected.folder;
  if (matches.length > 1) notes.push(`multiple matching folders: ${matches.join("; ")}`);
  if (RISK_HINT.test(folder)) risks.push("folder name has raw/reference/generated hint");

  const images = selected.images;
  const heroImages = images.filter(isHero);
  const galleryImages = images.filter((name) => !isHero(name) && isGallery(name, slug));
  const riskyImages = images.filter((name) => RISK_HINT.test(name));
  if (riskyImages.length > 0) risks.push(`${riskyImages.length} image filename(s) have raw/reference/generated hint`);
  if (heroImages.length === 0) risks.push("missing Hero-* image");
  if (galleryImages.length < 5) risks.push(`thin numbered gallery (${galleryImages.length})`);
  if (images.length < 6) risks.push(`thin folder image count (${images.length})`);

  const status = heroImages.length > 0 && galleryImages.length >= 5 && risks.length === 0
    ? "ready"
    : heroImages.length > 0 && galleryImages.length >= 5
      ? "review"
      : "blocked";

  return {
    slug,
    status,
    folder,
    heroCount: heroImages.length,
    galleryCount: galleryImages.length,
    imageCount: images.length,
    risks,
    notes,
  };
}

async function main() {
  const csv = await import("node:fs/promises").then((fs) => fs.readFile(META_EXPORT, "utf8"));
  const slugs = parseCsvIds(csv);
  const folders = await topLevelFolders();
  const rows: FolderAudit[] = [];
  for (const slug of slugs) rows.push(await auditSlug(slug, folders));

  const ready = rows.filter((row) => row.status === "ready").length;
  const review = rows.filter((row) => row.status === "review").length;
  const blocked = rows.filter((row) => row.status === "blocked").length;

  await mkdir(OUT_DIR, { recursive: true });
  const lines: string[] = [];
  lines.push("# Maison Tanneurs — Usable Product Pics Audit");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Drive root: ${DRIVE_ROOT}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Launch SKUs audited: ${rows.length}`);
  lines.push(`- Ready folders: ${ready}`);
  lines.push(`- Review folders: ${review}`);
  lines.push(`- Blocked folders: ${blocked}`);
  lines.push("");
  lines.push("## SKU Detail");
  lines.push("");
  lines.push("| Slug | Status | Folder | Hero images | Gallery images | Total images | Risks / notes |");
  lines.push("|---|---|---|---:|---:|---:|---|");
  for (const row of rows) {
    const detail = [...row.risks, ...row.notes].join("; ") || "—";
    lines.push(
      `| \`${row.slug}\` | ${row.status} | ${row.folder} | ${row.heroCount} | ${row.galleryCount} | ${row.imageCount} | ${detail} |`,
    );
  }
  await writeFile(OUT_MD, `${lines.join("\n")}\n`);
  console.log(`[done] ${OUT_MD}`);
  console.log(`[summary] total=${rows.length} ready=${ready} review=${review} blocked=${blocked}`);
  if (blocked > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
