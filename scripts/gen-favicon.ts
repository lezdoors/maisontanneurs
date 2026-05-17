// One-shot: render app/icon.svg → app/favicon.ico at 32x32 + 16x16.
// Run: pnpm tsx scripts/gen-favicon.ts
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = process.cwd();
const SVG_PATH = join(ROOT, "app/icon.svg");
const ICO_PATH = join(ROOT, "app/favicon.ico");

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
  const svg = await readFile(SVG_PATH);
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(
    sizes.map((s) => sharp(svg, { density: 512 }).resize(s, s).png().toBuffer()),
  );
  const ico = pngToIco(pngs, sizes);
  await writeFile(ICO_PATH, ico);
  console.log(`Wrote ${ICO_PATH} (${ico.length} bytes, ${sizes.join("x, ")}x)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
