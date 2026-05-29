import assert from "node:assert/strict";

process.env.META_PIXEL_ID = "26891834623830253";
process.env.META_CAPI_ACCESS_TOKEN = "test-access-token";

let capturedUrl = "";
let capturedBody: unknown;

globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  capturedUrl = String(input);
  capturedBody = init?.body ? JSON.parse(String(init.body)) : undefined;
  return new Response(JSON.stringify({ events_received: 1 }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}) as typeof fetch;

async function main() {
  const { sendPurchaseToCAPI } = await import("../lib/meta-capi");

  await sendPurchaseToCAPI({
    email: "buyer@example.com",
    firstName: "Meta",
    lastName: "Buyer",
    value: 325,
    currency: "USD",
    orderNumber: "MT-TEST-001",
    items: [
      {
        id: "atlas-weekender-cognac",
        quantity: 1,
        price: 325,
      },
    ],
    fbp: "fb.1.1770000000000.111222333",
    fbc: "fb.1.1770000000000.test-click-id",
    eventSourceUrl:
      "https://www.maisontanneurs.com/checkout/success?revolut_order_id=rev-test",
  });

  assert.match(
    capturedUrl,
    /^https:\/\/graph\.facebook\.com\/v22\.0\/26891834623830253\/events\?access_token=test-access-token$/,
  );

  const body = capturedBody as {
    data: Array<{
      event_name: string;
      event_id: string;
      action_source: string;
      event_source_url: string;
      user_data: Record<string, string>;
      custom_data: {
        currency: string;
        value: number;
        content_ids: string[];
        content_type: string;
        num_items: number;
        contents: Array<{ id: string; quantity: number; item_price: number }>;
      };
    }>;
  };

  assert.equal(body.data.length, 1);
  const event = body.data[0];

  assert.equal(event.event_name, "Purchase");
  assert.equal(event.event_id, "MT-TEST-001");
  assert.equal(event.action_source, "website");
  assert.equal(
    event.event_source_url,
    "https://www.maisontanneurs.com/checkout/success?revolut_order_id=rev-test",
  );
  assert.equal(event.user_data.fbp, "fb.1.1770000000000.111222333");
  assert.equal(event.user_data.fbc, "fb.1.1770000000000.test-click-id");
  assert.match(event.user_data.em, /^[a-f0-9]{64}$/);
  assert.match(event.user_data.fn, /^[a-f0-9]{64}$/);
  assert.match(event.user_data.ln, /^[a-f0-9]{64}$/);

  assert.deepEqual(event.custom_data.content_ids, ["atlas-weekender-cognac"]);
  assert.equal(event.custom_data.content_type, "product");
  assert.equal(event.custom_data.currency, "USD");
  assert.equal(event.custom_data.value, 325);
  assert.equal(event.custom_data.num_items, 1);
  assert.deepEqual(event.custom_data.contents, [
    {
      id: "atlas-weekender-cognac",
      quantity: 1,
      item_price: 325,
    },
  ]);

  console.log("Meta CAPI Purchase payload verified");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
