import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { formatPrice } from "@/lib/utils";
import { ClearCart } from "@/components/store/ClearCart";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const sessionId = typeof sp.session_id === "string" ? sp.session_id : null;
  const paymentIntentId =
    typeof sp.payment_intent === "string" ? sp.payment_intent : null;

  if (!sessionId && !paymentIntentId) {
    return (
      <SuccessErrorState
        title="Invalid Session"
        body="We couldn't find your order details. Please contact us if you believe this is an error."
      />
    );
  }

  let items: Array<{ title: string; price: number; quantity: number }> = [];
  let customerName = "Friend";
  let customerEmail = "";
  let total = 0;

  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items"],
      });
      items = session.metadata?.items ? JSON.parse(session.metadata.items) : [];
      customerName = session.customer_details?.name || "Friend";
      customerEmail = session.customer_details?.email || "";
      total = session.amount_total || 0;
    } catch {
      return (
        <SuccessErrorState
          title="Session Not Found"
          body="This checkout session may have expired or is invalid."
        />
      );
    }
  } else if (paymentIntentId) {
    try {
      const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
      items = intent.metadata?.items ? JSON.parse(intent.metadata.items) : [];
      customerName = intent.shipping?.name || "Friend";
      customerEmail = intent.receipt_email || intent.metadata?.email || "";
      total = intent.amount_received || intent.amount || 0;
    } catch {
      return (
        <SuccessErrorState
          title="Payment Not Found"
          body="We couldn't retrieve your payment details. Please contact us."
        />
      );
    }
  }

  // Fetch the actual order from Supabase by either id (webhook stores PI id in
  // stripe_session_id field for both flows).
  const lookupId = sessionId || paymentIntentId;
  const { data: orderRow } = await supabase
    .from("orders")
    .select("order_number, customer_email")
    .eq("stripe_session_id", lookupId)
    .maybeSingle();

  customerEmail = customerEmail || orderRow?.customer_email || "";
  const orderNumber = orderRow?.order_number;

  return (
    <main className="min-h-screen px-6 py-16 md:py-24">
      <ClearCart />
      <div className="max-w-[640px] w-full mx-auto">
        {/* Eyebrow + title */}
        <p className="eye text-center mb-4">Order Confirmed</p>
        <h1 className="disp text-[clamp(40px,6vw,64px)] text-center mb-6 leading-[1.05]">
          Thank you, {customerName.split(" ")[0]}.
        </h1>

        {/* Confirmation message */}
        <p className="font-serif text-[clamp(17px,1.4vw,20px)] italic text-graphite text-center leading-relaxed mb-10">
          Your order has been placed. Each piece will be handcrafted by our artisans
          in Marrakech and carefully prepared for shipping.
        </p>

        {/* Order number — prominent */}
        {orderNumber && (
          <div className="border-y border-stone py-6 mb-10 text-center">
            <p className="eye mb-2">Order Number</p>
            <p
              className="font-mono tracking-[0.2em] text-[clamp(18px,2vw,24px)]"
              style={{ color: "var(--color-ink)" }}
            >
              {orderNumber}
            </p>
            {customerEmail && (
              <p className="text-[12px] text-mineral mt-3">
                A confirmation has been sent to {customerEmail}
              </p>
            )}
          </div>
        )}

        {/* Items ordered */}
        {items.length > 0 && (
          <div className="mb-10">
            <p className="eye mb-4">Items Ordered</p>
            <ul className="flex flex-col gap-3">
              {items.map(
                (
                  item: { title: string; price: number; quantity: number },
                  idx: number,
                ) => (
                  <li
                    key={idx}
                    className="flex items-baseline justify-between gap-4 pb-3 border-b border-stone/20 last:border-0"
                  >
                    <span className="font-sans text-[15px] text-graphite">
                      {item.title}
                      {item.quantity > 1 && (
                        <span className="font-mono text-[10px] tracking-[0.16em] text-mineral ml-2">
                          x{item.quantity}
                        </span>
                      )}
                    </span>
                    <span className="font-serif text-[16px] italic shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>
        )}

        {/* Total */}
        <div className="flex items-baseline justify-between border-t border-stone pt-4 mb-12">
          <span className="eye">Total</span>
          <span
            className="font-display text-[28px] tracking-[-0.01em]"
            style={{ color: "var(--color-ink)" }}
          >
            {formatPrice(total)}
          </span>
        </div>

        {/* What happens next — timeline */}
        <div className="mb-12">
          <p className="eye mb-6 text-center">What happens next</p>
          <ol className="space-y-6">
            <TimelineStep
              n="01"
              title="Crafted in Marrakech"
              body="Your piece enters production at the atelier. Expect 2–4 weeks for crafting."
            />
            <TimelineStep
              n="02"
              title="Inspected &amp; packed"
              body="Every piece is hand-inspected before being packed for the journey."
            />
            <TimelineStep
              n="03"
              title="Shipped &amp; tracked"
              body="You'll receive a tracking number by email once the parcel leaves the atelier."
            />
          </ol>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/products"
            className="rb-cta-outline flex-1 sm:flex-none text-center"
            style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.16em", padding: "16px 28px" }}
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="rb-cta flex-1 sm:flex-none text-center"
            style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.16em", padding: "16px 28px" }}
          >
            Back to Home
          </Link>
        </div>

        {/* Support note */}
        <p className="text-[12px] text-mineral text-center mt-12 leading-relaxed">
          Questions? Email{" "}
          <a
            href="mailto:hello@nitra.com"
            className="underline underline-offset-4"
            style={{ color: "var(--color-ink)" }}
          >
            hello@nitra.com
          </a>
          {orderNumber && <> with order number <strong style={{ color: "var(--color-ink)" }}>{orderNumber}</strong></>}.
        </p>
      </div>
    </main>
  );
}

function TimelineStep({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="flex gap-5">
      <span
        className="font-mono text-[11px] tracking-[0.2em] shrink-0 pt-1"
        style={{ color: "var(--color-mineral, #8a857c)" }}
      >
        {n}
      </span>
      <div>
        <h3
          className="font-serif text-[18px] leading-tight mb-1"
          style={{ color: "var(--color-ink)" }}
        >
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
        <Link
          href="/products"
          className="rb-cta"
          style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.16em", padding: "16px 28px" }}
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
