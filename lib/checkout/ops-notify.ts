// Order ops fan-out: forward every paid order to the Akal CRM (crm.akalds.com)
// and post a Slack notification. Both are BEST-EFFORT and NON-BLOCKING — they
// run inside confirm-order's first-persistence guard (so exactly once per
// order) and never throw into the checkout path. If the env vars are absent
// they no-op silently, so the storefront still takes payment before the CRM /
// Slack wiring is finalised.

export type OpsOrder = {
  orderNumber: string;
  intentId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    product_id: string;
    slug?: string;
    title: string;
    price: number; // charge-currency minor units
    quantity: number;
  }>;
  total: number; // charge-currency minor units
  currency: string;
  shippingAddress: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
};

const TIMEOUT_MS = 6000;

function money(minor: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(minor / 100);
  } catch {
    return `${(minor / 100).toFixed(2)} ${currency}`;
  }
}

async function postJson(
  url: string,
  body: unknown,
  headers: Record<string, string> = {},
): Promise<void> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${text.slice(0, 200)}`);
    }
  } finally {
    clearTimeout(t);
  }
}

// POST the order to the Akal CRM order-intake endpoint. Auth scheme is
// configurable: defaults to `Authorization: Bearer <CRM_API_KEY>` and also
// sends `x-api-key` so either convention on the CRM side works.
export async function sendOrderToCrm(order: OpsOrder): Promise<void> {
  const url = process.env.CRM_INTAKE_URL;
  if (!url) {
    console.warn("[ops-notify] CRM_INTAKE_URL unset — skipping CRM forward");
    return;
  }
  const key = process.env.CRM_API_KEY || "";
  await postJson(
    url,
    {
      source: "maisontanneurs.com",
      brand: "Maison Tanneurs",
      order_number: order.orderNumber,
      stripe_payment_intent_id: order.intentId,
      status: "paid",
      placed_at: new Date().toISOString(),
      customer: { name: order.customerName, email: order.customerEmail },
      shipping_address: order.shippingAddress,
      currency: order.currency,
      total_minor: order.total,
      total_display: money(order.total, order.currency),
      items: order.items.map((i) => ({
        slug: i.slug,
        product_id: i.product_id,
        title: i.title,
        quantity: i.quantity,
        unit_price_minor: i.price,
      })),
    },
    key ? { authorization: `Bearer ${key}`, "x-api-key": key } : {},
  );
}

// Post a new-order notification to a Slack incoming webhook. Honors the
// existing prod var name (SLACK_ORDERS_WEBHOOK_URL) first, then a generic
// fallback, so this is drop-in against the configured mt-lestanneurs env.
export async function notifySlackNewOrder(order: OpsOrder): Promise<void> {
  const url =
    process.env.SLACK_ORDERS_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL;
  if (!url) {
    console.warn(
      "[ops-notify] SLACK_ORDERS_WEBHOOK_URL/SLACK_WEBHOOK_URL unset — skipping Slack notify",
    );
    return;
  }
  const mention = process.env.SLACK_FULFILMENT_MENTION
    ? `${process.env.SLACK_FULFILMENT_MENTION} `
    : "";
  const lines = order.items
    .map((i) => `• ${i.quantity}× ${i.title}`)
    .join("\n");
  const ship = order.shippingAddress;
  const dest = [ship.city, ship.state, ship.country].filter(Boolean).join(", ");
  const total = money(order.total, order.currency);
  await postJson(url, {
    text: `${mention}New order ${order.orderNumber} — ${total} — ${order.customerName}`,
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: `New order — ${total}`, emoji: true },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Order:*\n${order.orderNumber}` },
          { type: "mrkdwn", text: `*Customer:*\n${order.customerName}` },
          { type: "mrkdwn", text: `*Email:*\n${order.customerEmail}` },
          { type: "mrkdwn", text: `*Ship to:*\n${dest || "—"}` },
        ],
      },
      { type: "section", text: { type: "mrkdwn", text: `*Items:*\n${lines}` } },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `maisontanneurs.com · ${order.intentId}`,
          },
        ],
      },
    ],
  });
}
