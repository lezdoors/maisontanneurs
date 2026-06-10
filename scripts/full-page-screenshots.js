// Full-page screenshots of key routes for footer + mid-page eyeballing.
const { chromium } = require("playwright");
const { mkdir } = require("node:fs/promises");
const { join } = require("node:path");
const os = require("node:os");

const SITE = process.env.SITE_URL || "https://maisontanneurs.com";
const OUT = join(os.homedir(), "brand-assets/maison-tanneurs/_audits/visual-launch/full-page");

const ROUTES = [
  { name: "home", path: "/" },
  { name: "collection", path: "/products" },
  { name: "pdp-noir", path: "/products/expedition-rolltop-noir" },
  { name: "atelier", path: "/atelier" },
  { name: "boutique", path: "/boutique" },
  { name: "contact", path: "/contact" },
  { name: "legal-shipping", path: "/legal/shipping" },
];

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  for (const v of VIEWPORTS) {
    for (const r of ROUTES) {
      const ctx = await browser.newContext({ viewport: { width: v.width, height: v.height } });
      const page = await ctx.newPage();
      try {
        await page.goto(`${SITE}${r.path}`, { waitUntil: "networkidle", timeout: 45000 });
        // Trigger any lazy-loaded content
        await page.evaluate(async () => {
          const step = Math.max(window.innerHeight * 0.6, 400);
          for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise((res) => window.setTimeout(res, 120));
          }
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(800);
        const file = join(OUT, `${r.name}-${v.name}-full.png`);
        await page.screenshot({ path: file, fullPage: true });
        console.log(`  ${v.name.padEnd(7)} ${r.name.padEnd(18)} → ${file.split("/").slice(-2).join("/")}`);
      } catch (e) {
        console.log(`  ${v.name.padEnd(7)} ${r.name.padEnd(18)} FAIL ${e.message}`);
      } finally {
        await ctx.close();
      }
    }
  }
  await browser.close();
  console.log(`\n  Output: ${OUT}`);
}
main().catch((e) => { console.error("fatal:", e); process.exit(2); });
