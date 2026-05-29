import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  getOrder,
  verifyWebhookSignature,
  type RevolutOrder,
} from "@/lib/revolut";
import { generateOrderNumber } from "@/lib/utils";
import { sendOrderConfirmation, sendAdminNotification } from "@/lib/email";
import { sendPurchaseToCAPI } from "@/lib/meta-capi";

// Revolut webhook handler — persists orders, fires emails, mirrors Purchase
// to Meta CAPI. Mirrors the pattern from the Izem Stripe webhook (commit
// a666cd1 of the Izem repo) — different transport, same downstream actions.
//
// Registration is API-driven (not UI): see scripts/register-revolut-webhook.ts.
// The signing secret returned at registration time must be set as the
// REVOLUT_WEBHOOK_SECRET env var on Vercel for signature verification.

export const dynamic = "force-dynamic";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

type CartItem = {
  product_id: string;
  slug?: string;
  title: string;
  price: number;
  usd_price?: number;
  quantity: number;
  image?: string;
};

function getMetaAttributionFromMetadata(
  metadata: Record<string, string> | undefined,
): { fbp?: string; fbc?: string } {
  if (!metadata) return {};
  return {
    fbp: metadata.meta_fbp || undefined,
    fbc: metadata.meta_fbc || undefined,
  };
}

function parseItemsFromMetadata(
  metadata: Record<string, string> | undefined,
): CartItem[] {
  if (!metadata) return [];
  const count = parseInt(metadata.item_count || "0", 10);
  if (!count) return [];
  const items: CartItem[] = [];
  for (let i = 0; i < count; i++) {
    const raw = metadata[`item_${i}`];
    if (!raw) continue;
    try {
      items.push(JSON.parse(raw));
    } catch {
      /* skip malformed entry */
    }
  }
  return items;
}

interface WebhookPayload {
  event: string;
  timestamp: string;
  order_id: string;
  merchant_order_ext_ref?: string;
}

export async function POST(request: NextRequest) {
  const raw = await request.text();
  const signature = request.headers.get("revolut-signature");
  const timestamp = request.headers.get("revolut-request-timestamp");
  const secret = process.env.REVOLUT_WEBHOOK_SECRET || "";

  const verification = verifyWebhookSignature({
    rawBody: raw,
    signatureHeader: signature,
    timestampHeader: timestamp,
    secret,
  });

  if (!verification.valid) {
    console.error(
      `Revolut webhook signature invalid: ${verification.reason}`,
    );
    return NextResponse.json(
      { error: "Invalid signature", reason: verification.reason },
      { status: 400 },
    );
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(raw) as WebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // We mainly care about ORDER_COMPLETED (paid & captured). Other events
  // we acknowledge so Revolut stops retrying, but no-op for now.
  if (payload.event !== "ORDER_COMPLETED") {
    return NextResponse.json({ received: true, ignored: payload.event });
  }

  // Fetch the live order — webhook payload is intentionally thin, real data
  // lives behind the API.
  let order: RevolutOrder;
  try {
    order = await getOrder(payload.order_id);
  } catch (err) {
    console.error("Revolut getOrder failed in webhook:", err);
    return NextResponse.json(
      { error: "Could not load order" },
      { status: 500 },
    );
  }

  const items = parseItemsFromMetadata(order.metadata);
  const metaAttribution = getMetaAttributionFromMetadata(order.metadata);
  const customerEmail = order.customer?.email || "";
  const customerName = order.customer?.full_name || "";
  const shippingAddress = order.shipping_address
    ? {
        line1: order.shipping_address.street_line_1,
        line2: order.shipping_address.street_line_2,
        city: order.shipping_address.city,
        state: order.shipping_address.region,
        postal_code: order.shipping_address.postcode,
        country: order.shipping_address.country_code,
      }
    : {};
  const total = order.amount;
  const currency = order.currency.toUpperCase();

  await persistOrder({
    revolutOrderId: order.id,
    items,
    customerEmail,
    customerName,
    shippingAddress,
    subtotal: total,
    shippingCost: 0,
    total,
    currency,
    eventSourcePath: `/checkout/success?revolut_order_id=${order.id}`,
    metaAttribution,
  });

  return NextResponse.json({ received: true });
}

interface PersistArgs {
  revolutOrderId: string;
  items: CartItem[];
  customerEmail: string;
  customerName: string;
  shippingAddress: Record<string, string | undefined>;
  subtotal: number;
  shippingCost: number;
  total: number;
  currency: string;
  eventSourcePath: string;
  metaAttribution: { fbp?: string; fbc?: string };
}

async function persistOrder(args: PersistArgs) {
  const {
    revolutOrderId,
    items,
    customerEmail,
    customerName,
    shippingAddress,
    subtotal,
    shippingCost,
    total,
    currency,
    eventSourcePath,
    metaAttribution,
  } = args;

  const supabase = getSupabase();
  let orderNumber = revolutOrderId;
  if (!supabase) {
    console.warn("Supabase not configured — skipping order persistence");
  } else {
    // Idempotency by Revolut order id
    const { data: existing } = await supabase
      .from("orders")
      .select("order_number")
      .eq("revolut_order_id", revolutOrderId)
      .maybeSingle();

    orderNumber = (existing?.order_number as string | undefined) || "";
    if (!orderNumber) {
      orderNumber = generateOrderNumber();
      const { error } = await supabase.from("orders").insert({
        order_number: orderNumber,
        sales_channel: "direct",
        revolut_order_id: revolutOrderId,
        customer_email: customerEmail,
        customer_name: customerName,
        shipping_address: shippingAddress,
        items,
        subtotal,
        shipping_cost: shippingCost,
        total,
        currency,
        status: "paid",
      });
      if (error) console.error("Failed to create order:", error);

      for (const item of items) {
        await supabase
          .from("products")
          .update({ status: "sold", available_quantity: 0 })
          .eq("id", item.product_id);
      }
    }
  }

  // Customer + admin emails — non-blocking
  try {
    await sendOrderConfirmation({
      to: customerEmail,
      orderNumber: revolutOrderId,
      customerName,
      items,
      total,
      currency,
    });
    await sendAdminNotification({
      orderNumber: revolutOrderId,
      customerName,
      customerEmail,
      items,
      total,
      currency,
      shippingAddress,
    });
  } catch (emailErr) {
    console.error("Failed to send emails:", emailErr);
  }

  // Meta CAPI Purchase event — non-blocking. Use the Revolut order id as
  // Meta event_id because the browser success page can fire before Supabase
  // has the internal order_number persisted by this webhook.
  try {
    const [firstName, ...rest] = (customerName || "").split(" ");
    const lastName = rest.join(" ");
    await sendPurchaseToCAPI({
      email: customerEmail,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      city: shippingAddress.city,
      state: shippingAddress.state,
      zip: shippingAddress.postal_code,
      country: shippingAddress.country,
      value: total / 100,
      currency,
      orderNumber,
      items: items.map((i) => ({
        id: i.slug || i.product_id,
        quantity: i.quantity,
        price: i.price / 100,
      })),
      fbp: metaAttribution.fbp,
      fbc: metaAttribution.fbc,
      eventSourceUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.maisontanneurs.com"}${eventSourcePath}`,
    });
  } catch (capiErr) {
    console.error("Failed to send CAPI Purchase event:", capiErr);
  }
}
