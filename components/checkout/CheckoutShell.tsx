"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  AddressElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCart } from "@/components/store/CartProvider";
import { useCurrency } from "@/components/store/CurrencyProvider";
import { trackGA4Event } from "@/components/store/GA4";
import { trackPixelEvent } from "@/components/store/MetaPixel";
import OrderSummary from "./OrderSummary";

// Stripe Elements — the entire payment surface renders on maisontanneurs.com
// inside our editorial chrome. The server creates a PaymentIntent
// (/api/checkout/session → { clientSecret, orderId }); <PaymentElement> binds
// to that client secret; confirmPayment redirects to /checkout/success?
// payment_intent=pi_... where confirmAndPersistOrder records the paid order.
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = PUBLISHABLE_KEY ? loadStripe(PUBLISHABLE_KEY) : null;

type Status = "loading" | "ready" | "empty" | "error" | "missing-key";

function getCookieValue(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const prefix = `${name}=`;
  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));
  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : undefined;
}

function getMetaTrackingParams() {
  const tracking: { fbp?: string; fbc?: string } = {};
  const fbp = getCookieValue("_fbp");
  const fbc =
    getCookieValue("_fbc") ||
    (() => {
      if (typeof window === "undefined") return undefined;
      const fbclid = new URLSearchParams(window.location.search).get("fbclid");
      return fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined;
    })();
  if (fbp) tracking.fbp = fbp;
  if (fbc) tracking.fbc = fbc;
  return Object.keys(tracking).length > 0 ? tracking : undefined;
}

export default function CheckoutShell() {
  const { items, subtotal } = useCart();
  const { currency, convert } = useCurrency();
  const [status, setStatus] = useState<Status>("loading");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const initiatedCheckoutOrderRef = useRef<string | null>(null);

  const trackingItems = useMemo(
    () =>
      items.map((item) => ({
        item_id: item.slug,
        item_name: item.title,
        price: convert(item.price) / 100,
        quantity: item.quantity,
      })),
    [convert, items],
  );
  const pixelContents = useMemo(
    () =>
      items.map((item) => ({
        id: item.slug,
        quantity: item.quantity,
        item_price: convert(item.price) / 100,
      })),
    [convert, items],
  );

  useEffect(() => {
    if (items.length === 0) {
      queueMicrotask(() => setStatus("empty"));
      return;
    }
    if (!stripePromise) {
      queueMicrotask(() => setStatus("missing-key"));
      return;
    }

    let cancelled = false;
    setStatus("loading");
    (async () => {
      try {
        const res = await fetch("/api/checkout/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, tracking: getMetaTrackingParams() }),
        });
        if (!res.ok) throw new Error("Failed to create payment intent");
        const data = (await res.json()) as {
          clientSecret: string;
          orderId: string;
        };
        if (cancelled) return;
        setClientSecret(data.clientSecret);
        setOrderId(data.orderId);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
    // Re-create the intent when the cart total changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length === 0, subtotal]);

  // begin_checkout / InitiateCheckout — once per created intent.
  useEffect(() => {
    if (status !== "ready" || !orderId || initiatedCheckoutOrderRef.current === orderId) {
      return;
    }
    initiatedCheckoutOrderRef.current = orderId;
    const value = convert(subtotal) / 100;
    trackGA4Event("begin_checkout", { currency, value, items: trackingItems });
    trackPixelEvent("InitiateCheckout", {
      value,
      currency,
      content_ids: items.map((item) => item.slug),
      content_type: "product",
      contents: pixelContents,
      num_items: items.reduce((sum, item) => sum + item.quantity, 0),
    });
  }, [convert, currency, items, orderId, pixelContents, status, subtotal, trackingItems]);

  if (status === "empty") {
    return (
      <div className="max-w-[520px] mx-auto text-center py-16">
        <p className="eye mb-4">Cart Empty</p>
        <h1 className="disp text-[clamp(32px,4vw,44px)] mb-6 leading-[1.05]">
          Your selection is empty.
        </h1>
        <p className="font-serif italic text-graphite text-[17px] leading-relaxed mb-10">
          Browse the catalogue and gather a few pieces before checking out.
        </p>
        <Link
          href="/products"
          className="rb-cta"
          style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", padding: "18px 32px" }}
        >
          Browse Products
        </Link>
      </div>
    );
  }

  if (status === "missing-key") {
    return (
      <div className="max-w-[640px] mx-auto py-16 text-center">
        <p className="eye mb-4">Configuration</p>
        <h1 className="disp text-[clamp(28px,4vw,40px)] mb-6">
          Checkout temporarily unavailable.
        </h1>
        <p className="font-serif italic text-graphite text-[16px] leading-relaxed mb-10">
          Our payment provider is being configured. Please try again shortly,
          or email{" "}
          <a
            href="mailto:hello@maisontanneurs.com"
            className="underline underline-offset-4"
            style={{ color: "var(--color-ink)" }}
          >
            hello@maisontanneurs.com
          </a>
          {" "}to place your order directly.
        </p>
        <Link href="/products" className="rb-cta-outline" style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.18em", padding: "16px 28px" }}>
          Back to Catalogue
        </Link>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="max-w-[520px] mx-auto text-center py-16">
        <p className="eye mb-4">Error</p>
        <h1 className="disp text-[clamp(28px,4vw,40px)] mb-6">
          We couldn&apos;t start your checkout.
        </h1>
        <p className="font-serif italic text-graphite text-[16px] leading-relaxed mb-10">
          Please refresh the page, or email{" "}
          <a href="mailto:hello@maisontanneurs.com" className="underline underline-offset-4" style={{ color: "var(--color-ink)" }}>
            hello@maisontanneurs.com
          </a>
          {" "}if the problem persists.
        </p>
        <Link href="/products" className="rb-cta-outline" style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.18em", padding: "16px 28px" }}>
          Back to Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1fr_460px] gap-10 lg:gap-16">
      <div>
        {clientSecret && stripePromise ? (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#1C1A17",
                  colorText: "#1C1A17",
                  colorBackground: "#ffffff",
                  borderRadius: "0px",
                  fontFamily: "Inter, system-ui, sans-serif",
                  spacingUnit: "4px",
                },
              },
            }}
          >
            <PaymentForm
              subtotal={subtotal}
              currency={currency}
              convert={convert}
              trackingItems={trackingItems}
              pixelContents={pixelContents}
              items={items}
              orderId={orderId}
            />
          </Elements>
        ) : (
          <div className="py-16 text-center">
            <p className="font-serif italic text-graphite text-[15px]">
              Preparing secure checkout…
            </p>
          </div>
        )}
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <OrderSummary />
      </div>
    </div>
  );
}

type PaymentFormProps = {
  subtotal: number;
  currency: string;
  convert: (cents: number) => number;
  trackingItems: Array<{ item_id?: string; item_name: string; price: number; quantity: number }>;
  pixelContents: Array<{ id?: string; quantity: number; item_price: number }>;
  items: Array<{ slug: string; quantity: number }>;
  orderId: string | null;
};

function PaymentForm({
  subtotal,
  currency,
  convert,
  trackingItems,
  pixelContents,
  items,
  orderId,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const addPaymentInfoOrderRef = useRef<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setErrorMessage(null);

    if (orderId && addPaymentInfoOrderRef.current !== orderId) {
      addPaymentInfoOrderRef.current = orderId;
      const value = convert(subtotal) / 100;
      trackGA4Event("add_payment_info", {
        currency,
        value,
        payment_type: "Stripe",
        items: trackingItems,
      });
      trackPixelEvent("AddPaymentInfo", {
        value,
        currency,
        content_ids: items.map((item) => item.slug),
        content_type: "product",
        contents: pixelContents,
        num_items: items.reduce((sum, item) => sum + item.quantity, 0),
      });
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
        payment_method_data: email
          ? { billing_details: { email } }
          : undefined,
      },
    });

    // If we reach here, confirmation failed (success path redirects away).
    if (error) {
      setErrorMessage(
        error.message || "Payment did not complete. Please try again.",
      );
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <section>
        <h2 className="eye mb-5">Contact</h2>
        <LinkAuthenticationElement
          onChange={(ev) => setEmail(ev.value.email)}
        />
      </section>

      <section>
        <h2 className="eye mb-5">Shipping</h2>
        <AddressElement
          options={{ mode: "shipping", fields: { phone: "auto" } }}
        />
      </section>

      <section>
        <h2 className="eye mb-5">Payment</h2>
        <PaymentElement options={{ layout: "tabs" }} />
      </section>

      {errorMessage && (
        <p className="font-serif italic text-[14px] leading-relaxed" style={{ color: "#9B2C2C" }}>
          {errorMessage}
        </p>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={!stripe || submitting}
          className="rb-cta w-full"
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.18em",
            padding: "20px 28px",
            opacity: submitting ? 0.65 : 1,
            cursor: submitting ? "wait" : "pointer",
          }}
        >
          {submitting
            ? "Processing…"
            : `Pay ${new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency || "USD",
              }).format(convert(subtotal) / 100)}`}
        </button>
        <p className="text-[11px] font-sans font-light text-mineral leading-relaxed text-center mt-5">
          Encrypted by Stripe. Card details never touch our servers.
        </p>
      </div>
    </form>
  );
}
