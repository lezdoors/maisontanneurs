const { test, expect } = require("@playwright/test");
const http = require("node:http");

const SITE_URL = process.env.SITE_URL || "http://127.0.0.1:3030";
const MOCK_REVOLUT_PORT = Number(process.env.MOCK_REVOLUT_PORT || 4040);

const cartItem = {
  product_id: "atlas-weekender-cognac",
  title: "Atlas Weekender · Cognac",
  price: 32500,
  quantity: 1,
  image: "/products/landing/atlas-weekender-cognac-landing.webp",
  slug: "atlas-weekender-cognac",
};

test("checkout fires Meta Pixel mid-funnel events with ecommerce payloads", async ({ page }) => {
  await page.route("https://connect.facebook.net/en_US/fbevents.js", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: "",
    }),
  );

  await page.route("https://merchant.revolut.com/embed.js", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: `
        window.RevolutCheckout = async function () {
          return {
            payWithPopup: function () {}
          };
        };
      `,
    }),
  );

  await page.route("**/api/checkout/session", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ token: "test-token", orderId: "rev-test-order-1" }),
    }),
  );

  await page.addInitScript((item) => {
    window.localStorage.setItem("mi-cookie-consent", "all");
    window.localStorage.setItem("perle-cart", JSON.stringify([item]));
    document.cookie = "_fbp=fb.1.1770000000000.111222333; path=/";
    document.cookie = "_fbc=fb.1.1770000000000.testclid; path=/";
  }, cartItem);

  const sessionRequestPromise = page.waitForRequest("**/api/checkout/session");
  await page.goto(`${SITE_URL}/checkout/pay`, { waitUntil: "networkidle" });

  await expect(page.getByRole("button", { name: /Pay \$325\.00/ })).toBeEnabled();

  const sessionRequest = await sessionRequestPromise;
  const queueAfterReady = await page.evaluate(() => window.fbq && window.fbq.queue);
  expect(sessionRequest.postDataJSON()).toEqual(
    expect.objectContaining({
      tracking: {
        fbp: "fb.1.1770000000000.111222333",
        fbc: "fb.1.1770000000000.testclid",
      },
    }),
  );

  expect(queueAfterReady).toEqual(
    expect.arrayContaining([
      ["init", "26891834623830253"],
      ["track", "PageView"],
      [
        "track",
        "InitiateCheckout",
        expect.objectContaining({
          value: 325,
          currency: "USD",
          content_ids: ["atlas-weekender-cognac"],
          content_type: "product",
          num_items: 1,
          contents: [
            {
              id: "atlas-weekender-cognac",
              quantity: 1,
              item_price: 325,
            },
          ],
        }),
        {},
      ],
    ]),
  );

  await page.getByRole("textbox", { name: "Email", exact: true }).fill("test@example.com");
  await page.getByRole("textbox", { name: "Full Name", exact: true }).fill("Meta Tracking Test");
  await page.getByRole("button", { name: /Pay \$325\.00/ }).click();

  const queueAfterPay = await page.evaluate(() => window.fbq && window.fbq.queue);
  expect(queueAfterPay).toEqual(
    expect.arrayContaining([
      [
        "track",
        "AddPaymentInfo",
        expect.objectContaining({
          value: 325,
          currency: "USD",
          content_ids: ["atlas-weekender-cognac"],
          content_type: "product",
          num_items: 1,
          contents: [
            {
              id: "atlas-weekender-cognac",
              quantity: 1,
              item_price: 325,
            },
          ],
        }),
        {},
      ],
    ]),
  );
});

test("checkout derives fbc from fbclid when fbc cookie is absent", async ({ page }) => {
  await page.route("https://connect.facebook.net/en_US/fbevents.js", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: "",
    }),
  );

  await page.route("https://merchant.revolut.com/embed.js", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: `
        window.RevolutCheckout = async function () {
          return {
            payWithPopup: function () {}
          };
        };
      `,
    }),
  );

  await page.route("**/api/checkout/session", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ token: "test-token", orderId: "rev-test-fbclid-1" }),
    }),
  );

  await page.addInitScript((item) => {
    window.localStorage.setItem("mi-cookie-consent", "all");
    window.localStorage.setItem("perle-cart", JSON.stringify([item]));
    document.cookie = "_fbp=fb.1.1770000000000.111222333; path=/";
  }, cartItem);

  const sessionRequestPromise = page.waitForRequest("**/api/checkout/session");
  await page.goto(`${SITE_URL}/checkout/pay?fbclid=test-click-id`, {
    waitUntil: "networkidle",
  });

  await expect(page.getByRole("button", { name: /Pay \$325\.00/ })).toBeEnabled();

  const sessionRequest = await sessionRequestPromise;
  const payload = sessionRequest.postDataJSON();
  expect(payload.tracking.fbp).toBe("fb.1.1770000000000.111222333");
  expect(payload.tracking.fbc).toMatch(/^fb\.1\.\d+\.test-click-id$/);
});

test("success page fires browser Purchase with product IDs and Meta eventID", async ({ page }) => {
  const orderId = "rev-test-purchase-1";
  const server = http.createServer((req, res) => {
    if (req.method === "GET" && req.url === `/orders/${orderId}`) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          id: orderId,
          token: "test-token",
          checkout_url: "https://merchant.revolut.com/test",
          type: "payment",
          state: "COMPLETED",
          amount: 32500,
          currency: "USD",
          created_at: "2026-05-29T00:00:00Z",
          updated_at: "2026-05-29T00:01:00Z",
          metadata: {
            item_count: "1",
            item_0: JSON.stringify({
              product_id: "atlas-weekender-cognac-id",
              slug: "atlas-weekender-cognac",
              title: "Atlas Weekender · Cognac",
              price: 32500,
              usd_price: 32500,
              quantity: 1,
            }),
          },
          customer: {
            email: "test@example.com",
            full_name: "Meta Tracking Test",
          },
        }),
      );
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "not found" }));
  });

  await new Promise((resolve) => server.listen(MOCK_REVOLUT_PORT, "127.0.0.1", resolve));

  try {
    await page.route("https://connect.facebook.net/en_US/fbevents.js", (route) =>
      route.fulfill({
        contentType: "application/javascript",
        body: "",
      }),
    );

    await page.addInitScript(() => {
      window.localStorage.setItem("mi-cookie-consent", "all");
    });

    await page.route("**/api/checkout/purchase-event", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ sent: true }),
      }),
    );

    const capiRequestPromise = page.waitForRequest("**/api/checkout/purchase-event");

    await page.goto(`${SITE_URL}/checkout/success?revolut_order_id=${orderId}`, {
      waitUntil: "networkidle",
    });

    await expect(page.getByRole("heading", { name: /Thank you/i })).toBeVisible();
    expect((await capiRequestPromise).postDataJSON()).toEqual({ orderId });

    const queue = await page.evaluate(() => window.fbq && window.fbq.queue);
    expect(queue).toEqual(
      expect.arrayContaining([
        [
          "track",
          "Purchase",
          expect.objectContaining({
            value: 325,
            currency: "USD",
            content_ids: ["atlas-weekender-cognac"],
            content_type: "product",
            num_items: 1,
          }),
          { eventID: orderId },
        ],
      ]),
    );
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("success page does not fire Purchase for a pending Revolut order", async ({ page }) => {
  const orderId = "rev-test-pending-1";
  const server = http.createServer((req, res) => {
    if (req.method === "GET" && req.url === `/orders/${orderId}`) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          id: orderId,
          token: "test-token",
          checkout_url: "https://merchant.revolut.com/test",
          type: "payment",
          state: "PENDING",
          amount: 32500,
          currency: "USD",
          created_at: "2026-05-29T00:00:00Z",
          updated_at: "2026-05-29T00:01:00Z",
          metadata: {
            item_count: "1",
            item_0: JSON.stringify({
              product_id: "atlas-weekender-cognac-id",
              slug: "atlas-weekender-cognac",
              title: "Atlas Weekender · Cognac",
              price: 32500,
              usd_price: 32500,
              quantity: 1,
            }),
          },
          customer: {
            email: "test@example.com",
            full_name: "Meta Tracking Test",
          },
        }),
      );
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "not found" }));
  });

  await new Promise((resolve) => server.listen(MOCK_REVOLUT_PORT, "127.0.0.1", resolve));

  try {
    await page.route("https://connect.facebook.net/en_US/fbevents.js", (route) =>
      route.fulfill({
        contentType: "application/javascript",
        body: "",
      }),
    );

    await page.addInitScript(() => {
      window.localStorage.setItem("mi-cookie-consent", "all");
    });

    let capiCalled = false;
    await page.route("**/api/checkout/purchase-event", (route) => {
      capiCalled = true;
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ sent: true }),
      });
    });

    await page.goto(`${SITE_URL}/checkout/success?revolut_order_id=${orderId}`, {
      waitUntil: "networkidle",
    });

    await expect(page.getByRole("heading", { name: /Payment Pending/i })).toBeVisible();
    expect(capiCalled).toBe(false);

    const queue = await page.evaluate(() => window.fbq && window.fbq.queue);
    expect(queue || []).not.toEqual(
      expect.arrayContaining([
        [
          "track",
          "Purchase",
          expect.anything(),
          expect.anything(),
        ],
      ]),
    );
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
