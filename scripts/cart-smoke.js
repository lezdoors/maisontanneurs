// Cart-flow smoke: load PDP → add-to-cart → drawer opens → drawer shows item →
// link to /checkout/pay is reachable. Reports console + page errors.
const { chromium } = require("playwright");
const SITE = process.env.SITE_URL || "https://maisontanneurs.com";
const PDP = "/products/cognac-brogue-backpack";

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  page.on("pageerror", (e) => pageErrors.push(e.message));

  console.log(`  Loading PDP: ${SITE}${PDP}`);
  await page.goto(`${SITE}${PDP}`, { waitUntil: "networkidle", timeout: 45000 });

  // Accept cookies if banner showing
  try {
    await page.locator('button:has-text("Accept"), button:has-text("ACCEPT")').first()
      .click({ timeout: 3000 });
    console.log("  Cookies accepted");
  } catch {
    console.log("  No cookie banner");
  }

  // Click Add to Cart
  const addBtn = page.locator('button:has-text("Add to Cart"), button:has-text("ADD TO CART")').first();
  await addBtn.waitFor({ state: "visible", timeout: 10000 });
  console.log("  Clicking Add to Cart…");
  await addBtn.click();

  // Drawer should open — look for typical drawer signals
  await page.waitForTimeout(1200);
  const drawerVisible = await page.evaluate(() => {
    const drawer = document.querySelector('[class*="cart-drawer"], [aria-label*="Cart"], [role="dialog"]');
    if (!drawer) return false;
    const style = getComputedStyle(drawer);
    return style.display !== "none" && style.visibility !== "hidden";
  });
  console.log(`  Cart drawer visible: ${drawerVisible}`);

  // Look for our PDP product title appearing in the drawer
  const productInDrawer = await page.locator('text=/Cognac Brogue/i').count();
  console.log(`  "Cognac Brogue" name occurrences in DOM after add: ${productInDrawer}`);

  // Look for a checkout CTA in the drawer
  const checkoutLink = await page.locator('a:has-text("Checkout"), button:has-text("Checkout"), a:has-text("CHECKOUT")').count();
  console.log(`  Checkout CTA count: ${checkoutLink}`);

  // Try clicking checkout
  if (checkoutLink > 0) {
    console.log("  Clicking Checkout CTA…");
    try {
      await page.locator('a:has-text("Checkout"), button:has-text("Checkout"), a:has-text("CHECKOUT")').first().click({ timeout: 5000 });
      await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
      console.log(`  After click URL: ${page.url()}`);
    } catch (e) {
      console.log(`  Checkout click error: ${e.message}`);
    }
  }

  console.log(`\n  consoleErrors: ${consoleErrors.length}`);
  consoleErrors.slice(0, 5).forEach((e) => console.log(`    - ${e}`));
  console.log(`  pageErrors: ${pageErrors.length}`);
  pageErrors.slice(0, 5).forEach((e) => console.log(`    - ${e}`));

  await browser.close();
  process.exit(consoleErrors.length === 0 && pageErrors.length === 0 ? 0 : 1);
}
main().catch((e) => { console.error("fatal:", e); process.exit(2); });
