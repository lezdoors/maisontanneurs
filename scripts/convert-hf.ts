// HF PNG → WebP converter for site assets.
// Run: pnpm tsx scripts/convert-hf.ts
import sharp from "sharp";

interface Job {
  src: string;
  dst: string;
  width: number;
  /** Optional cover-crop to exact aspect ratio (use w/h). Falls back to source aspect when omitted. */
  height?: number;
}

async function main() {
  const ARCHIVE = `${process.env.HOME}/brand-assets/maison-tanneurs/_hf-archive`;

  const jobs: Job[] = [
    // Brand-story portrait (5:6) for BrandStoryEditorial "From the Marrakech atelier."
    {
      src: `${ARCHIVE}/atelier-interiors/2026-05-20_23-07-31_4d43d6c3_messenger-portrait-9x16.png`,
      dst: "public/hero/atelier-messenger-portrait.webp",
      width: 1024,
      height: 1228, // 5:6 portrait
    },
    // Lookbook card portrait (4:5) for EditorialStrip "The Lookbook"
    {
      src: `${ARCHIVE}/heroes/2026-05-20_23-28-27_22882b69_brunette-seated-walnut-limestone.png`,
      dst: "public/hero/lookbook-brunette-seated.webp",
      width: 1024,
      height: 1280, // 4:5 portrait
    },
  ];

  for (const job of jobs) {
    const pipeline = sharp(job.src);
    if (job.height) {
      // Cover-crop to exact aspect, attention-based crop to keep subject in frame
      await pipeline
        .resize(job.width, job.height, { fit: "cover", position: sharp.strategy.attention })
        .webp({ quality: 82 })
        .toFile(job.dst);
    } else {
      await pipeline.resize(job.width).webp({ quality: 82 }).toFile(job.dst);
    }
    console.log(`Wrote ${job.dst}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
