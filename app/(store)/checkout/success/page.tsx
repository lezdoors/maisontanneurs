import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { getOrder, type RevolutOrder } from "@/lib/revolut";
import { formatPrice } from "@/lib/utils";
import { isCurrency } from "@/lib/currency";
import { ClearCart } from "@/components/store/ClearCart";
import PurchaseTracking from "@/components/store/PurchaseTracking";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

type CartItem = {
  product_id?: string;
  slug?: string;
  title: string;
  price: number;
  usd_price?: number;
  quantity: number;
};

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
      /* skip */
    }
  }
  return items;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const revolutOrderId =
    typeof sp.revolut_order_id === "string" ? sp.revolut_order_id : null;

  if (!revolutOrderId) {
    return (
      <SuccessErrorState
        title="Invalid Session"
        body="We couldn't find your order details. Please contact us if you believe this is an error."
      />
    );
  }

  let order: RevolutOrder;
  try {
    order = await getOrder(revolutOrderId);
  } catch {
    return (
      <SuccessErrorState
        title="Order Not Found"
        body="This order may have expired or is invalid. Email us with your reference if you completed payment."
      />
    );
  }

  if (order.state !== "COMPLETED") {
    return (
      <SuccessErrorState
        title="Payment Pending"
        body="We haven't received payment confirmation for this order yet. If your card was charged, email us with your payment reference and we'll verify it."
      />
    );
  }

  const items = parseItemsFromMetadata(order.metadata);
  let customerName = order.customer?.full_name || "";
  let customerEmail = order.customer?.email || "";
  const total = order.amount;
  const orderCurrency = isCurrency(order.currency.toUpperCase())
    ? (order.currency.toUpperCase() as "USD" | "EUR" | "GBP")
    : "USD";

  // Cross-reference with our orders table — the webhook persists order_number
  // here. May not exist yet if the customer beats the webhook to /success,
  // in which case we render the Revolut order details directly.
  const supabase = getSupabase();
  const orderRow = supabase
    ? (
        await supabase
          .from("orders")
          .select("order_number, customer_email, customer_name")
          .eq("revolut_order_id", revolutOrderId)
          .maybeSingle()
      ).data
    : null;

  customerEmail = customerEmail || orderRow?.customer_email || "";
  customerName = customerName || orderRow?.customer_name || "Friend";
  const orderNumber = orderRow?.order_number;

  return (
    <main className="min-h-screen px-6 py-16 md:py-24">
      <ClearCart />
      {/* Keep Meta eventID aligned with server CAPI, which also uses the Revolut order id. */}
      <PurchaseTracking
        orderId={revolutOrderId}
        total={total}
        currency={orderCurrency}
        items={items.map((i) => ({
          slug: i.slug || i.product_id,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
        }))}
      />
      <div className="max-w-[640px] w-full mx-auto">
        {/* Eyebrow + title */}
        <p className="eye text-center mb-4">Order Confirmed</p>
        <h1 className="disp text-[clamp(40px,6vw,64px)] text-center mb-6 leading-[1.05]">
          Thank you, {customerName.split(" ")[0]}.
        </h1>

        <p className="font-serif text-[clamp(17px,1.4vw,20px)] italic text-graphite text-center leading-relaxed mb-10">
          Your order has been placed. Each piece is hand-stitched in our
          Marrakech atelier and shipped worldwide via DHL Express —
          most orders arrive in 5 to 10 business days.
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

        {!orderNumber && (
          <div className="border-y border-stone py-6 mb-10 text-center">
            <p className="eye mb-2">Payment Reference</p>
            <p
              className="font-mono tracking-[0.2em] text-[clamp(14px,1.6vw,18px)]"
              style={{ color: "var(--color-ink)" }}
            >
              {revolutOrderId.slice(0, 8)}…{revolutOrderId.slice(-4)}
            </p>
            <p className="text-[12px] text-mineral mt-3">
              We&apos;re finalising your order. Your confirmation email
              will arrive in a few moments.
            </p>
          </div>
        )}

        {items.length > 0 && (
          <div className="mb-10">
            <p className="eye mb-4">Items Ordered</p>
            <ul className="flex flex-col gap-3">
              {items.map((item, idx) => (
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
                    {formatPrice(item.price * item.quantity, orderCurrency)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-baseline justify-between border-t border-stone pt-4 mb-12">
          <span className="eye">Total</span>
          <span
            className="font-display text-[28px] tracking-[-0.01em]"
            style={{ color: "var(--color-ink)" }}
          >
            {formatPrice(total, orderCurrency)}
          </span>
        </div>

        <div className="mb-12">
          <p className="eye mb-6 text-center">What happens next</p>
          <ol className="space-y-6">
            <TimelineStep
              n="01"
              title="Hand-finished in Marrakech"
              body="Your bag is signed inside by the artisan who completed it."
            />
            <TimelineStep
              n="02"
              title="Inspected &amp; packed"
              body="Every piece is hand-inspected before being packed in the dust bag."
            />
            <TimelineStep
              n="03"
              title="Shipped — free worldwide"
              body="Tracked express courier, direct from Marrakech. You'll receive a tracking number by email the moment the parcel leaves the atelier. Duty-free to the US and EU."
            />
          </ol>
        </div>

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

        <p className="text-[12px] text-mineral text-center mt-12 leading-relaxed">
          Questions? Email{" "}
          <a
            href="mailto:hello@maisontanneurs.com"
            className="underline underline-offset-4"
            style={{ color: "var(--color-ink)" }}
          >
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
