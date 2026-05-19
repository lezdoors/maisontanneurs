import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { generateOrderNumber } from "@/lib/utils";
import { sendOrderConfirmation, sendAdminNotification } from "@/lib/email";
import { sendPurchaseToCAPI } from "@/lib/meta-capi";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type CartItem = {
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
};

// Reads cart items from Stripe metadata. Supports two shapes:
//   New (per-item keys):  { item_count: "3", item_0: "{...}", item_1: "{...}" }
//   Legacy (single key):  { items: "[{...}, {...}]" }
// We had to switch to per-item keys to stay under Stripe's 500-char-per-value
// metadata limit (image URLs + titles for 3+ items overflowed).
function parseItemsFromMetadata(
  metadata: Stripe.Metadata | null | undefined,
): CartItem[] {
  if (!metadata) return [];

  // Legacy single-field shape — old sessions still in flight at deploy time.
  if (metadata.items) {
    try {
      return JSON.parse(metadata.items);
    } catch {
      return [];
    }
  }

  // New per-item shape.
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

type Address = {
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  line1?: string;
  line2?: string;
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Legacy Stripe Checkout Session (hosted) path
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const items: CartItem[] = parseItemsFromMetadata(session.metadata);
    const customerEmail = session.customer_details?.email || "";
    const customerName = session.customer_details?.name || "";
    const shippingAddress: Address =
      (session.collected_information?.shipping_details?.address as Address) ||
      {};
    const subtotal = session.amount_subtotal || 0;
    const shippingCost = session.total_details?.amount_shipping || 0;
    const total = session.amount_total || 0;
    const currency = (session.currency || "usd").toUpperCase();

    await persistOrder({
      stripeSessionId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id || null,
      items,
      customerEmail,
      customerName,
      shippingAddress,
      subtotal,
      shippingCost,
      total,
      currency,
      eventSourcePath: `/checkout/success?session_id=${session.id}`,
    });
  }

  // New custom on-domain checkout — Payment Element path
  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const items: CartItem[] = parseItemsFromMetadata(intent.metadata);
    const customerEmail =
      intent.receipt_email ||
      intent.metadata?.email ||
      "";
    const customerName = intent.shipping?.name || "";
    const shippingAddress: Address =
      (intent.shipping?.address as Address) || {};
    const total = intent.amount_received || intent.amount || 0;
    const currency = intent.currency.toUpperCase();

    await persistOrder({
      stripeSessionId: intent.id, // store PI id in session field for compat
      stripePaymentIntentId: intent.id,
      items,
      customerEmail,
      customerName,
      shippingAddress,
      subtotal: total,
      shippingCost: 0,
      total,
      currency,
      eventSourcePath: `/checkout/success?payment_intent=${intent.id}`,
    });
  }

  return NextResponse.json({ received: true });
}

interface PersistArgs {
  stripeSessionId: string;
  stripePaymentIntentId: string | null;
  items: CartItem[];
  customerEmail: string;
  customerName: string;
  shippingAddress: Address;
  subtotal: number;
  shippingCost: number;
  total: number;
  currency: string;
  eventSourcePath: string;
}

async function persistOrder(args: PersistArgs) {
  const {
    stripeSessionId,
    items,
    customerEmail,
    customerName,
    shippingAddress,
    subtotal,
    shippingCost,
    total,
    currency,
    eventSourcePath,
  } = args;

  // Idempotency: if an order with this session id already exists, skip
  const { data: existing } = await supabase
    .from("orders")
    .select("order_number")
    .eq("stripe_session_id", stripeSessionId)
    .maybeSingle();

  let orderNumber = existing?.order_number;
  if (!orderNumber) {
    orderNumber = generateOrderNumber();
    const { error } = await supabase.from("orders").insert({
      order_number: orderNumber,
      sales_channel: "direct",
      stripe_session_id: stripeSessionId,
      customer_email: customerEmail,
      customer_name: customerName,
      shipping_address: shippingAddress,
      items,
      subtotal,
      shipping_cost: shippingCost,
      total,
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

  // Emails (non-blocking)
  try {
    await sendOrderConfirmation({
      to: customerEmail,
      orderNumber,
      customerName,
      items,
      total,
    });
    await sendAdminNotification({
      orderNumber,
      customerName,
      customerEmail,
      items,
      total,
      shippingAddress,
    });
  } catch (emailErr) {
    console.error("Failed to send emails:", emailErr);
  }

  // Meta CAPI Purchase (non-blocking)
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
        id: i.product_id,
        quantity: i.quantity,
        price: i.price / 100,
      })),
      eventSourceUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.kechken.com"}${eventSourcePath}`,
    });
  } catch (capiErr) {
    console.error("Failed to send CAPI Purchase event:", capiErr);
  }
}
