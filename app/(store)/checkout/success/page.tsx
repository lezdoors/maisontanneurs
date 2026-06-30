import Link from "next/link";
import { headers } from "next/headers";
import { formatPrice } from "@/lib/utils";
import { isCurrency } from "@/lib/currency";
import { ClearCart } from "@/components/store/ClearCart";
import PurchaseTracking from "@/components/store/PurchaseTracking";
import {
  confirmAndPersistOrder,
  parseItemsFromMetadata,
  type OrderItem,
} from "@/lib/checkout/confirm-order";
import { getPaymentIntent } from "@/lib/checkout/stripe";

export const dynamic = "force-dynamic";

type ViewOrder = {
  orderNumber?: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number; // minor units
  currency: "USD" | "EUR" | "GBP";
  finalizing: boolean; // payment ok but our record isn't confirmed yet
};

function toViewCurrency(c: string): "USD" | "EUR" | "GBP" {
  const up = (c || "USD").toUpperCase();
  return isCurrency(up) ? (up as "USD" | "EUR" | "GBP") : "USD";
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  // Stripe appends these to the return_url after confirmPayment.
  const paymentIntentId =
    typeof sp.payment_intent === "string" ? sp.payment_intent : null;
  const redirectStatus =
    typeof sp.redirect_status === "string" ? sp.redirect_status : null;

  if (!paymentIntentId) {
    return (
      <SuccessErrorState
        title="Invalid Session"
        body="We couldn't find your order details. Please contact us if you believe this is an error."
      />
    );
  }

  if (redirectStatus && redirectStatus !== "succeeded") {
    return (
      <SuccessErrorState
        title="Payment Pending"
        body="We haven't received payment confirmation for this order yet. If your card was charged, email us with your payment reference and we'll verify it."
      />
    );
  }

  // Primary path: confirm + persist (idempotent). This also fires the
  // confirmation email, Meta CAPI, CRM forward and Slack notice exactly once.
  const h = await headers();
  const client = {
    ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined,
    userAgent: h.get("user-agent") || undefined,
    eventSourceUrl: `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.maisontanneurs.com"
    }/checkout/success`,
  };

  let view: ViewOrder | null = null;
  try {
    const confirmed = await confirmAndPersistOrder(paymentIntentId, client);
    if (confirmed.state !== "COMPLETED") {
      return (
        <SuccessErrorState
          title="Payment Pending"
          body="We haven't received payment confirmation for this order yet. If your card was charged, email us with your payment reference and we'll verify it."
        />
      );
    }
    view = {
      orderNumber: confirmed.orderNumber,
      customerName: confirmed.customerName || "Friend",
      customerEmail: confirmed.customerEmail,
      items: confirmed.items,
      total: confirmed.total,
      currency: toViewCurrency(confirmed.currency),
      finalizing: !confirmed.orderNumber,
    };
  } catch (err) {
    // Persistence failed (e.g. DB not yet provisioned) — DO NOT show the
    // customer an error after a real charge. Read the PaymentIntent straight
    // from Stripe and render a "finalizing" confirmation. The webhook will
    // record it once the data layer is ready.
    console.error(
      `[checkout/success] confirmAndPersistOrder failed for ${paymentIntentId}:`,
      err instanceof Error ? err.message : err,
    );
    try {
      const intent = await getPaymentIntent(paymentIntentId);
      if (intent.status !== "succeeded") {
        return (
          <SuccessErrorState
            title="Payment Pending"
            body="If your card was charged, email us with your payment reference and we'll verify it."
          />
        );
      }
      const charge =
        typeof intent.latest_charge === "object" ? intent.latest_charge : null;
      view = {
        orderNumber: undefined,
        customerName: charge?.billing_details?.name || "Friend",
        customerEmail:
          intent.receipt_email || charge?.billing_details?.email || "",
        items: parseItemsFromMetadata(intent.metadata),
        total: intent.amount,
        currency: toViewCurrency(intent.currency),
        finalizing: true,
      };
    } catch {
      return (
        <SuccessErrorState
          title="Order Received"
          body="Your payment went through. We're finalising the order record — your confirmation email will arrive shortly. Email hello@maisontanneurs.com if you don't hear from us."
        />
      );
    }
  }

  const { orderNumber, customerName, customerEmail, items, total, currency, finalizing } =
    view;
  const trackingId = orderNumber || paymentIntentId;

  return (
    <main className="min-h-screen px-6 py-16 md:py-24">
      <ClearCart />
      {/* event_id must equal the server CAPI event_id (orderNumber) for dedup. */}
      <PurchaseTracking
        orderId={trackingId}
        total={total}
        currency={currency}
        items={items.map((i) => ({
          slug: i.slug || i.product_id,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
        }))}
      />
      <div className="max-w-[640px] w-full mx-auto">
        <p className="eye text-center mb-4">Order Confirmed</p>
        <h1 className="disp text-[clamp(40px,6vw,64px)] text-center mb-6 leading-[1.05]">
          Thank you, {customerName.split(" ")[0]}.
        </h1>

        <p className="font-serif text-[clamp(17px,1.4vw,20px)] italic text-graphite text-center leading-relaxed mb-10">
          Your order has been placed. Each piece is hand-stitched in our
          Marrakech atelier and shipped direct by tracked express courier —
          free worldwide, 3 to 5 business days to your door.
        </p>

        {orderNumber && (
          <div className="border-y border-stone py-6 mb-10 text-center">
            <p className="eye mb-2">Order Number</p>
            <p className="font-mono tracking-[0.2em] text-[clamp(18px,2vw,24px)]" style={{ color: "var(--color-ink)" }}>
              {orderNumber}
            </p>
            {customerEmail && (
              <p className="text-[12px] text-mineral mt-3">
                A confirmation has been sent to {customerEmail}
              </p>
            )}
          </div>
        )}

        {!orderNumber && (
          <div className="border-y border-stone py-6 mb-10 text-center">
            <p className="eye mb-2">Payment Reference</p>
            <p className="font-mono tracking-[0.2em] text-[clamp(14px,1.6vw,18px)]" style={{ color: "var(--color-ink)" }}>
              {paymentIntentId.slice(0, 11)}…{paymentIntentId.slice(-4)}
            </p>
            <p className="text-[12px] text-mineral mt-3">
              {finalizing
                ? "We're finalising your order. Your confirmation email will arrive in a few moments."
                : "Payment received."}
            </p>
          </div>
        )}

        {items.length > 0 && (
          <div className="mb-10">
            <p className="eye mb-4">Items Ordered</p>
            <ul className="flex flex-col gap-3">
              {items.map((item, idx) => (
                <li key={idx} className="flex items-baseline justify-between gap-4 pb-3 border-b border-stone/20 last:border-0">
                  <span className="font-sans text-[15px] text-graphite">
                    {item.title}
                    {item.quantity > 1 && (
                      <span className="font-mono text-[10px] tracking-[0.16em] text-mineral ml-2">
                        x{item.quantity}
                      </span>
                    )}
                  </span>
                  <span className="font-serif text-[16px] italic shrink-0">
                    {formatPrice(item.price * item.quantity, currency)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-baseline justify-between border-t border-stone pt-4 mb-12">
          <span className="eye">Total</span>
          <span className="font-display text-[28px] tracking-[-0.01em]" style={{ color: "var(--color-ink)" }}>
            {formatPrice(total, currency)}
          </span>
        </div>

        <div className="mb-12">
          <p className="eye mb-6 text-center">What happens next</p>
          <ol className="space-y-6">
            <TimelineStep n="01" title="Hand-finished in Marrakech" body="Your bag is signed inside by the artisan who completed it." />
            <TimelineStep n="02" title="Inspected &amp; packed" body="Every piece is hand-inspected before being packed in the dust bag." />
            <TimelineStep n="03" title="Shipped — free worldwide" body="DHL Express, direct from Marrakech. You'll receive a tracking number by email the moment the parcel leaves the atelier. Most orders arrive in 5–10 business days." />
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/products" className="rb-cta-outline flex-1 sm:flex-none text-center" style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.16em", padding: "16px 28px" }}>
            Continue Shopping
          </Link>
          <Link href="/" className="rb-cta flex-1 sm:flex-none text-center" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.16em", padding: "16px 28px" }}>
            Back to Home
          </Link>
        </div>

        <p className="text-[12px] text-mineral text-center mt-12 leading-relaxed">
          Questions? Email{" "}
          <a href="mailto:hello@maisontanneurs.com" className="underline underline-offset-4" style={{ color: "var(--color-ink)" }}>
            hello@maisontanneurs.com
          </a>
          {orderNumber && (
            <>
              {" "}with order number{" "}
              <strong style={{ color: "var(--color-ink)" }}>{orderNumber}</strong>
            </>
          )}
          .
        </p>
      </div>
    </main>
  );
}

function TimelineStep({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="flex gap-5">
      <span className="font-mono text-[11px] tracking-[0.2em] shrink-0 pt-1" style={{ color: "var(--color-mineral, #8a857c)" }}>
        {n}
      </span>
      <div>
        <h3 className="font-serif text-[18px] leading-tight mb-1" style={{ color: "var(--color-ink)" }}>
          {title}
        </h3>
        <p className="font-sans text-[14px] text-graphite leading-relaxed">{body}</p>
      </div>
    </li>
  );
}

function SuccessErrorState({ title, body }: { title: string; body: string }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-[480px]">
        <p className="eye mb-4">Error</p>
        <h1 className="disp text-[clamp(32px,5vw,48px)] mb-6">{title}</h1>
        <p className="lede mb-8">{body}</p>
        <Link href="/products" className="rb-cta" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.16em", padding: "16px 28px" }}>
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
