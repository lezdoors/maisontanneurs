// One-shot: render app/icon.png → app/favicon.ico (16/32/48) + app/apple-icon.png (180).
// Run: pnpm tsx scripts/gen-favicon.ts
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = process.cwd();
const SOURCE_PATH = join(ROOT, "app/icon.png");
const ICO_PATH = join(ROOT, "app/favicon.ico");
const APPLE_PATH = join(ROOT, "app/apple-icon.png");

function pngToIco(pngBuffers: Buffer[], sizes: number[]): Buffer {
  // Minimal ICO container (BMP/PNG image header) — modern browsers accept PNG inside ICO.
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  const dirEntries: Buffer[] = [];
  const imageDataOffsets: number[] = [];
  let offset = 6 + count * 16;

  for (let i = 0; i < count; i++) {
    const png = pngBuffers[i];
    const size = sizes[i];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size === 256 ? 0 : size, 0); // width
    entry.writeUInt8(size === 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(png.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    dirEntries.push(entry);
    imageDataOffsets.push(offset);
    offset += png.length;
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers]);
}

async function main() {
  const source = await readFile(SOURCE_PATH);

  const icoSizes = [16, 32, 48];
  const icoPngs = await Promise.all(
    icoSizes.map((s) => sharp(source).resize(s, s).png().toBuffer()),
  );
  const ico = pngToIco(icoPngs, icoSizes);
  await writeFile(ICO_PATH, ico);
  console.log(`Wrote ${ICO_PATH} (${ico.length} bytes, ${icoSizes.join("x, ")}x)`);

  const applePng = await sharp(source).resize(180, 180).png().toBuffer();
  await writeFile(APPLE_PATH, applePng);
  console.log(`Wrote ${APPLE_PATH} (${applePng.length} bytes, 180x180)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
