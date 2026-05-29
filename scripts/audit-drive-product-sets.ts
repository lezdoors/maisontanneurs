import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { STATIC_PRODUCTS } from "../lib/products";
import { HIDDEN_SKUS } from "../lib/hidden-skus";

const DRIVE_ROOT =
  process.env.MT_USABLE_PRODUCT_PICS ||
  "/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/usable product pics";

const IMAGE_EXT = /\.(webp|png|jpe?g|avif)$/i;

const FOLDER_ALIASES: Record<string, string[]> = {
  "atlas-kilim-duffle": ["Kilim-duffle-alt", "Kilim Leather Duffle Bag"],
  "medina-duffle": ["Classic Leather Duffle Bag – Handcrafted Weekend Travel Essential"],
};

const NEEDS_FINISHED_HF_EXPORT = new Set([
  "atlas-briefcase-vintage",
  "medina-crossbody-cognac",
  "vintage-satchel-light-brown",
]);

const LIVE_GALLERY_ACCEPTABLE = new Set<string>();

type FolderEvidence = {
  folder: string;
  imageCount: number;
  webpCount: number;
  pngCount: number;
  referenceOnly: boolean;
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function isReferenceOnly(folder: string): boolean {
  const name = folder.toLowerCase();
  return (
    name.includes("screen shot") ||
    name.includes("screenshot") ||
    name.includes("ouss") ||
    name.includes("supplier") ||
    /(?:^|[\/\s._-])raw(?:$|[\/\s._-])/.test(name)
  );
}

async function countImages(path: string) {
  const entries = await readdir(path, { withFileTypes: true });
  let imageCount = 0;
  let webpCount = 0;
  let pngCount = 0;

  for (const entry of entries) {
    const full = join(path, entry.name);
    if (entry.isDirectory()) {
      const nested = await countImages(full);
      imageCount += nested.imageCount;
      webpCount += nested.webpCount;
      pngCount += nested.pngCount;
      continue;
    }
    if (!IMAGE_EXT.test(entry.name)) continue;
    imageCount++;
    if (/\.webp$/i.test(entry.name)) webpCount++;
    if (/\.png$/i.test(entry.name)) pngCount++;
  }

  return { imageCount, webpCount, pngCount };
}

async function driveFolders(): Promise<string[]> {
  const root = await stat(DRIVE_ROOT).catch(() => null);
  if (!root?.isDirectory()) {
    throw new Error(`Drive usable product pics folder not found: ${DRIVE_ROOT}`);
  }
  const entries = await readdir(DRIVE_ROOT, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
}

function folderMatches(slug: string, folder: string): boolean {
  const folderSlug = normalize(folder);
  const aliases = [slug, ...(FOLDER_ALIASES[slug] || []).map(normalize)];
  return aliases.some((alias) => folderSlug === alias || folderSlug.includes(alias));
}

async function evidenceFor(slug: string, folders: string[]): Promise<FolderEvidence[]> {
  const matches = folders.filter((folder) => folderMatches(slug, folder));
  const rows = [];
  for (const folder of matches) {
    const counts = await countImages(join(DRIVE_ROOT, folder));
    rows.push({
      folder,
      ...counts,
      referenceOnly: isReferenceOnly(folder),
    });
  }
  return rows;
}

function statusFor(evidence: FolderEvidence[]): string {
  const finished = evidence.filter((row) => !row.referenceOnly);
  const finishedImages = finished.reduce((sum, row) => sum + row.imageCount, 0);
  if (finishedImages >= 9) return "ready-9shot";
  if (finishedImages >= 5) return "ready-partial";
  if (finishedImages > 0) return "needs-more-finished";
  if (evidence.some((row) => row.referenceOnly)) return "reference-only";
  return "missing-drive-folder";
}

function sameSkuImageCount(product: { slug: string; images?: string[] | null }): number {
  return (product.images || []).filter((image) => image.includes(`/${product.slug}-`)).length;
}

function actionFor(
  product: { slug: string; images?: string[] | null },
  status: string,
  primaryFolder: string,
): string {
  if (primaryFolder) return "wire-finished-drive-set";
  if (NEEDS_FINISHED_HF_EXPORT.has(product.slug)) {
    return "download-exact-finished-hf-9shot-to-drive";
  }
  if (LIVE_GALLERY_ACCEPTABLE.has(product.slug) && sameSkuImageCount(product) >= 4) {
    return "launch-acceptable-but-archive-finished-set-when-found";
  }
  if (status === "reference-only") return "reference-only-find-finished-hf-output";
  return "visual-search-before-generation";
}

async function main() {
  const folders = await driveFolders();
  const products = STATIC_PRODUCTS.filter(
    (product) => product.status === "available" && product.featured && !HIDDEN_SKUS.has(product.slug),
  );

  console.log("=== Maison Tanneurs Drive product-set audit ===");
  console.log(`Drive root: ${DRIVE_ROOT}`);
  console.log("");
  console.log(
    ["slug", "status", "live_same_sku_images", "finished_images", "webp", "png", "folders", "action", "wire_command"].join(
      "\t",
    ),
  );

  const rows: Array<{
    slug: string;
    status: string;
    liveSameSkuImages: number;
    action: string;
  }> = [];

  for (const product of products) {
    const evidence = await evidenceFor(product.slug, folders);
    const status = statusFor(evidence);
    const finished = evidence.filter((row) => !row.referenceOnly);
    const finishedImages = finished.reduce((sum, row) => sum + row.imageCount, 0);
    const webp = finished.reduce((sum, row) => sum + row.webpCount, 0);
    const png = finished.reduce((sum, row) => sum + row.pngCount, 0);
    const primaryFolder = finished[0]?.folder || "";
    const action = actionFor(product, status, primaryFolder);
    const liveSameSkuImages = sameSkuImageCount(product);
    const wireCommand = primaryFolder
      ? `pnpm tsx scripts/wire-drive-product-set.ts --slug ${product.slug} --source "${join(DRIVE_ROOT, primaryFolder)}"`
      : "-";
    rows.push({ slug: product.slug, status, liveSameSkuImages, action });

    console.log(
      [
        product.slug,
        status,
        liveSameSkuImages,
        finishedImages,
        webp,
        png,
        evidence.map((row) => `${row.referenceOnly ? "reference:" : "finished:"}${row.folder}(${row.imageCount})`).join("|") || "-",
        action,
        wireCommand,
      ].join("\t"),
    );
  }

  const ready = rows.filter((row) => row.status === "ready-9shot").length;
  const needsFinishedExport = rows.filter((row) => row.action === "download-exact-finished-hf-9shot-to-drive");
  const acceptableNoDriveSet = rows.filter((row) => row.action === "launch-acceptable-but-archive-finished-set-when-found");

  console.log("");
  console.log("Summary");
  console.log(`ready_9shot_drive_sets\t${ready}`);
  console.log(`needs_exact_finished_hf_export\t${needsFinishedExport.length}`);
  console.log(`launch_acceptable_no_drive_set\t${acceptableNoDriveSet.length}`);

  if (needsFinishedExport.length) {
    console.log("");
    console.log("Download these exact finished HF 9-shot exports into Drive before wiring:");
    for (const row of needsFinishedExport) {
      console.log(`- ${row.slug} -> ${join(DRIVE_ROOT, row.slug)}`);
    }
  }

  if (acceptableNoDriveSet.length) {
    console.log("");
    console.log("Launch-acceptable live galleries, but archive the finished source set when found:");
    for (const row of acceptableNoDriveSet) {
      console.log(`- ${row.slug} (${row.liveSameSkuImages} live same-SKU images)`);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
