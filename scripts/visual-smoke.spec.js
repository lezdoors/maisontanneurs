const { expect, test } = require("@playwright/test");
const { mkdir } = require("node:fs/promises");
const { join } = require("node:path");

const SITE_URL = process.env.SITE_URL || "https://maisontanneurs.com";
const OUT_DIR =
  process.env.VISUAL_AUDIT_DIR ||
  "/Users/ryanz/brand-assets/maison-tanneurs/_audits/visual-smoke";

const ROUTES = [
  { name: "home", path: "/" },
  { name: "collection", path: "/products" },
  { name: "pdp-backpack", path: "/products/cognac-brogue-backpack" },
  { name: "pdp-briefcase", path: "/products/atlas-field-briefcase" },
  { name: "pdp-noir", path: "/products/expedition-rolltop-noir" },
  { name: "pdp-tote", path: "/products/marrakech-tote-cognac" },
  { name: "atelier", path: "/atelier" },
  { name: "boutique", path: "/boutique" },
  { name: "bespoke", path: "/bespoke" },
  { name: "trade", path: "/trade" },
  { name: "contact", path: "/contact" },
  { name: "checkout", path: "/checkout/pay" },
  { name: "legal-shipping", path: "/legal/shipping" },
  { name: "legal-privacy", path: "/legal/privacy" },
];

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 1100 },
  { name: "mobile", width: 390, height: 844 },
];

test.describe("Maison Tanneurs visual launch smoke", () => {
  for (const viewport of VIEWPORTS) {
    for (const route of ROUTES) {
      test(`${route.name} ${viewport.name}`, async ({ page }) => {
        await mkdir(OUT_DIR, { recursive: true });
        await page.setViewportSize({ width: viewport.width, height: viewport.height });

        const consoleErrors = [];
        const pageErrors = [];

        page.on("console", (message) => {
          if (message.type() === "error") consoleErrors.push(message.text());
        });
        page.on("pageerror", (error) => pageErrors.push(error.message));

        const response = await page.goto(new URL(route.path, SITE_URL).toString(), {
          waitUntil: "networkidle",
          timeout: 45_000,
        });

        expect(response?.ok(), `${route.path} should return 2xx/3xx`).toBeTruthy();
        await expect(page.locator("body")).toBeVisible();

        await page.evaluate(async () => {
          const step = Math.max(window.innerHeight * 0.75, 400);
          for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise((resolve) => window.setTimeout(resolve, 120));
          }
          window.scrollTo(0, 0);
        });
        await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => undefined);

        const metrics = await page.evaluate(() => ({
          bodyTextLength: document.body.innerText.trim().length,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          images: [...document.images].map((image) => ({
            src: image.currentSrc || image.src,
            loading: image.loading,
            complete: image.complete,
            naturalWidth: image.naturalWidth,
            naturalHeight: image.naturalHeight,
          })),
        }));

        expect(metrics.bodyTextLength, `${route.path} should not render blank`).toBeGreaterThan(250);
        expect(
          metrics.scrollWidth,
          `${route.path} should not have horizontal overflow at ${viewport.name}`,
        ).toBeLessThanOrEqual(metrics.clientWidth + 2);

        const brokenImages = metrics.images.filter(
          (image) =>
            image.src &&
            image.loading !== "lazy" &&
            (!image.complete || image.naturalWidth === 0 || image.naturalHeight === 0),
        );
        expect(brokenImages, `${route.path} should not have broken rendered images`).toEqual([]);
        expect(pageErrors, `${route.path} should not throw page errors`).toEqual([]);
        expect(consoleErrors, `${route.path} should not log console errors`).toEqual([]);

        await page.screenshot({
          path: join(OUT_DIR, `${route.name}-${viewport.name}.png`),
          fullPage: false,
        });

        if (route.name === "home") {
          await page.locator("#collection").scrollIntoViewIfNeeded();
          await page.waitForTimeout(250);
          await page.screenshot({
            path: join(OUT_DIR, `home-collection-${viewport.name}.png`),
            fullPage: false,
          });
        }

        if (route.name === "collection") {
          await page.evaluate(() => window.scrollTo(0, Math.min(window.innerHeight * 0.55, 560)));
          await page.waitForTimeout(250);
          await page.screenshot({
            path: join(OUT_DIR, `collection-grid-${viewport.name}.png`),
            fullPage: false,
          });
        }
      });
    }
  }
});
