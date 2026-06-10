// Standalone visual launch audit — uses core `playwright` library (no test runner).
// Captures screenshots, console errors, page errors, broken images, horizontal
// overflow per route × viewport. Writes a JSON summary + screenshots.
//
// Run: node scripts/visual-launch-audit.js
// Override site: SITE_URL=https://... node scripts/visual-launch-audit.js

const { chromium } = require("playwright");
const { mkdir, writeFile } = require("node:fs/promises");
const { join } = require("node:path");
const os = require("node:os");

const SITE_URL = process.env.SITE_URL || "https://maisontanneurs.com";
const OUT_DIR =
  process.env.VISUAL_AUDIT_DIR ||
  join(os.homedir(), "brand-assets/maison-tanneurs/_audits/visual-launch");

const ROUTES = [
  { name: "home", path: "/" },
  { name: "collection", path: "/products" },
  { name: "pdp-backpack", path: "/products/cognac-brogue-backpack" },
  { name: "pdp-briefcase", path: "/products/atlas-field-briefcase" },
  { name: "pdp-noir", path: "/products/expedition-rolltop-noir" },
  { name: "pdp-tote", path: "/products/marrakech-tote-cognac" },
  { name: "pdp-rucksack", path: "/products/heritage-rucksack" },
  { name: "atelier", path: "/atelier" },
  { name: "boutique", path: "/boutique" },
  { name: "bespoke", path: "/bespoke" },
  { name: "trade", path: "/trade" },
  { name: "contact", path: "/contact" },
  { name: "checkout", path: "/checkout/pay" },
  { name: "legal-shipping", path: "/legal/shipping" },
  { name: "legal-privacy", path: "/legal/privacy" },
  { name: "legal-terms", path: "/legal/terms" },
];

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 1100 },
  { name: "mobile", width: 390, height: 844 },
];

async function auditRoute(browser, route, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 MaisonTanneursLaunchAudit",
  });
  const page = await context.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  page.on("pageerror", (e) => pageErrors.push(e.message));

  const url = new URL(route.path, SITE_URL).toString();
  let status = "unknown";
  try {
    const resp = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    status = resp ? resp.status() : "no-response";
  } catch (err) {
    return {
      route: route.name,
      viewport: viewport.name,
      url,
      ok: false,
      error: `nav-fail: ${err.message}`,
    };
  }

  // Scroll to trigger lazy-loaded content.
  try {
    await page.evaluate(async () => {
      const step = Math.max(window.innerHeight * 0.75, 400);
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => window.setTimeout(r, 150));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState("networkidle", { timeout: 12000 }).catch(() => {});
  } catch {}

  const metrics = await page.evaluate(() => ({
    bodyText: document.body.innerText.trim().length,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    title: document.title,
    images: [...document.images].map((i) => ({
      src: i.currentSrc || i.src,
      loading: i.loading,
      complete: i.complete,
      nw: i.naturalWidth,
      nh: i.naturalHeight,
    })),
  }));

  const brokenImages = metrics.images.filter(
    (i) =>
      i.src &&
      i.loading !== "lazy" &&
      (!i.complete || i.nw === 0 || i.nh === 0),
  );

  // Screenshot above-the-fold (not full page — speed)
  const shotPath = join(OUT_DIR, `${route.name}-${viewport.name}.png`);
  await page.screenshot({ path: shotPath, fullPage: false });

  await context.close();

  const overflow = metrics.scrollWidth - metrics.clientWidth;
  const ok =
    status >= 200 &&
    status < 400 &&
    metrics.bodyText > 250 &&
    overflow <= 2 &&
    brokenImages.length === 0 &&
    consoleErrors.length === 0 &&
    pageErrors.length === 0;

  return {
    route: route.name,
    viewport: viewport.name,
    url,
    status,
    title: metrics.title,
    bodyText: metrics.bodyText,
    overflow,
    brokenImages: brokenImages.slice(0, 3),
    consoleErrors: consoleErrors.slice(0, 3),
    pageErrors: pageErrors.slice(0, 3),
    screenshot: shotPath,
    ok,
  };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const results = [];

  for (const viewport of VIEWPORTS) {
    for (const route of ROUTES) {
      process.stdout.write(`  ${viewport.name.padEnd(7)} ${route.name.padEnd(18)} ${route.path} … `);
      const r = await auditRoute(browser, route, viewport);
      results.push(r);
      const tag = r.ok ? "PASS" : "FAIL";
      const detail = r.ok
        ? ""
        : ` (${[
            r.error,
            r.overflow > 2 ? `overflow=${r.overflow}` : null,
            r.brokenImages.length ? `broken=${r.brokenImages.length}` : null,
            r.consoleErrors.length ? `console=${r.consoleErrors.length}` : null,
            r.pageErrors.length ? `pageerr=${r.pageErrors.length}` : null,
            r.bodyText <= 250 ? `text=${r.bodyText}` : null,
          ]
            .filter(Boolean)
            .join(", ")})`;
      console.log(`${tag}${detail}`);
    }
  }

  await browser.close();
  await writeFile(join(OUT_DIR, "summary.json"), JSON.stringify(results, null, 2));

  const passes = results.filter((r) => r.ok).length;
  const fails = results.length - passes;
  console.log(`\n  Total: ${passes}/${results.length} PASS, ${fails} FAIL`);
  console.log(`  Screenshots + summary: ${OUT_DIR}`);

  if (fails > 0) process.exit(1);
}

main().catch((err) => {
  console.error("fatal:", err);
  process.exit(2);
});
