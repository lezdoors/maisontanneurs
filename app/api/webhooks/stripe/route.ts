import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent } from "@/lib/checkout/stripe";
import { confirmAndPersistOrder } from "@/lib/checkout/confirm-order";

// Stripe webhook — the durable, server-authoritative path to order
// persistence. The success page also calls confirmAndPersistOrder on load, but
// a customer who closes the tab before /checkout/success renders would
// otherwise never have their paid order recorded. Both paths funnel through
// the same idempotent confirmAndPersistOrder (ON CONFLICT DO NOTHING on the
// PaymentIntent id), so whichever fires first wins and the other no-ops —
// emails / CAPI / CRM / Slack are sent exactly once.
//
// Setup (Stripe Dashboard → Developers → Webhooks):
//   endpoint  https://www.maisontanneurs.com/api/webhooks/stripe
//   events    payment_intent.succeeded  (payment_intent.payment_failed optional)
//   then set STRIPE_WEBHOOK_SECRET (whsec_...) in the environment.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;
  try {
    event = constructWebhookEvent(rawBody, signature);
  } catch (err) {
    const message = err instanceof Error ? err.message : "invalid signature";
    console.error("[stripe-webhook] signature verification failed:", message);
    // 400 → Stripe will retry with backoff; a bad signature is never retried
    // into a success, but the status is correct for an unverifiable payload.
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object as { id: string };
      await confirmAndPersistOrder(intent.id, {
        eventSourceUrl: `${
          process.env.NEXT_PUBLIC_SITE_URL || "https://www.maisontanneurs.com"
        }/checkout/success`,
      });
    }
    // Acknowledge all other event types so Stripe stops resending them.
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(
      `[stripe-webhook] handler error for ${event.type}:`,
      err instanceof Error ? err.message : err,
    );
    // 500 → Stripe retries; confirmAndPersistOrder is idempotent so retries
    // are safe.
    return NextResponse.json({ error: "handler failed" }, { status: 500 });
  }
}
