import assert from "node:assert/strict";
import crypto from "node:crypto";

process.env.REVOLUT_API_BASE = "https://mock-revolut.test/api";
process.env.REVOLUT_SECRET_KEY = "sk_test_revolut";
process.env.REVOLUT_WEBHOOK_SECRET = "whsec_test";
process.env.META_PIXEL_ID = "26891834623830253";
process.env.META_CAPI_ACCESS_TOKEN = "test-access-token";
process.env.NEXT_PUBLIC_SITE_URL = "https://www.maisontanneurs.com";
delete process.env.NEXT_PUBLIC_SUPABASE_URL;
delete process.env.SUPABASE_SERVICE_ROLE_KEY;
delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let capturedMetaBody: unknown;

globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = String(input);

  if (url === "https://mock-revolut.test/api/orders/rev-webhook-test") {
    return new Response(
      JSON.stringify({
        id: "rev-webhook-test",
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
          display_currency: "USD",
          meta_fbp: "fb.1.1770000000000.111222333",
          meta_fbc: "fb.1.1770000000000.test-click-id",
          item_0: JSON.stringify({
            product_id: "internal-product-id",
            slug: "atlas-weekender-cognac",
            title: "Atlas Weekender · Cognac",
            price: 32500,
            usd_price: 32500,
            quantity: 1,
          }),
        },
        customer: {
          email: "buyer@example.com",
          full_name: "Meta Buyer",
        },
        shipping_address: {
          city: "New York",
          region: "NY",
          country_code: "US",
          postcode: "10001",
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  if (url.startsWith("https://graph.facebook.com/")) {
    capturedMetaBody = init?.body ? JSON.parse(String(init.body)) : undefined;
    return new Response(JSON.stringify({ events_received: 1 }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: `unexpected fetch: ${url}` }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });
}) as typeof fetch;

const rawBody = JSON.stringify({
  event: "ORDER_COMPLETED",
  timestamp: "2026-05-29T00:01:00Z",
  order_id: "rev-webhook-test",
});
const timestamp = String(Date.now());
const signature = crypto
  .createHmac("sha256", process.env.REVOLUT_WEBHOOK_SECRET!)
  .update(`v1.${timestamp}.${rawBody}`)
  .digest("hex");

async function main() {
  const { POST } = await import("../app/api/webhooks/revolut/route");

  const response = await POST(
    new Request("https://www.maisontanneurs.com/api/webhooks/revolut", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "revolut-request-timestamp": timestamp,
        "revolut-signature": `v1=${signature}`,
      },
      body: rawBody,
    }) as any,
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { received: true });

  const body = capturedMetaBody as {
    data: Array<{
      event_name: string;
      event_id: string;
      event_source_url: string;
      user_data: Record<string, string>;
      custom_data: {
        content_ids: string[];
        contents: Array<{ id: string; quantity: number; item_price: number }>;
      };
    }>;
  };

  assert.equal(body.data.length, 1);
  const event = body.data[0];
  assert.equal(event.event_name, "Purchase");
  assert.equal(event.event_id, "rev-webhook-test");
  assert.equal(
    event.event_source_url,
    "https://www.maisontanneurs.com/checkout/success?revolut_order_id=rev-webhook-test",
  );
  assert.deepEqual(event.custom_data.content_ids, ["atlas-weekender-cognac"]);
  assert.deepEqual(event.custom_data.contents, [
    {
      id: "atlas-weekender-cognac",
      quantity: 1,
      item_price: 325,
    },
  ]);
  assert.equal(event.user_data.fbp, "fb.1.1770000000000.111222333");
  assert.equal(event.user_data.fbc, "fb.1.1770000000000.test-click-id");
  assert.match(event.user_data.em, /^[a-f0-9]{64}$/);
  assert.match(event.user_data.fn, /^[a-f0-9]{64}$/);
  assert.match(event.user_data.ln, /^[a-f0-9]{64}$/);

  console.log("Revolut webhook to Meta CAPI Purchase verified");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
