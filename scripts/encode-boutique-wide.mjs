import sharp from "sharp";

const src = "public/brand/editorial/boutique-wide.png";
const out = "public/brand/editorial/boutique-wide.webp";

const info = await sharp(src).webp({ quality: 85 }).toFile(out);
console.log(`encoded ${out}: ${info.width}x${info.height} ${info.size} bytes`);
