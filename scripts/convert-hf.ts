// One-shot HF PNG → WebP converter.
// Run: pnpm tsx scripts/convert-hf.ts
import sharp from "sharp";

async function main() {
  const jobs = [
    { src: "/tmp/hf-preview/67a48ee3.png", dst: "public/hero/hero-leather-campaign.webp", width: 2400 },
    { src: "/tmp/hf-preview/bee58013.png", dst: "public/products/drop-01/leather-goods-tile.webp", width: 1600 },
    { src: "/tmp/hf-preview/897e51b3.png", dst: "public/hero/material-leather-macro.webp", width: 1600 },
    { src: "/tmp/hf-preview/b3c5ceb5.png", dst: "public/hero/atelier-arch-rucksack.webp", width: 1600 },
  ];

  for (const job of jobs) {
    await sharp(job.src).resize(job.width).webp({ quality: 82 }).toFile(job.dst);
    console.log(`Wrote ${job.dst}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
