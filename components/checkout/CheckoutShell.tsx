"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/store/CartProvider";
import StripeProvider from "./StripeProvider";
import CheckoutForm from "./CheckoutForm";
import OrderSummary from "./OrderSummary";

export default function CheckoutShell() {
  const { items, subtotal } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "empty" | "error" | "missing-key">(
    "loading",
  );

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  useEffect(() => {
    if (items.length === 0) {
      setStatus("empty");
      return;
    }
    if (!publishableKey) {
      setStatus("missing-key");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/checkout/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
        if (!res.ok) throw new Error("Failed to create checkout session");
        const data = await res.json();
        if (cancelled) return;
        setClientSecret(data.clientSecret);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
    // Create one Checkout Session when the cart first has items at this total.
    // Quantity edits are reflected via Stripe's line items so re-creation on
    // every change would just create orphaned sessions in the dashboard.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length === 0, publishableKey, subtotal]);

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
            href="mailto:atelier@nitra.com"
            className="underline underline-offset-4"
            style={{ color: "var(--color-ink)" }}
          >
            atelier@nitra.com
          </a>
          {" "}to place your order directly.
        </p>
        <Link
          href="/products"
          className="rb-cta-outline"
          style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.18em", padding: "16px 28px" }}
        >
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
          We couldn't start your checkout.
        </h1>
        <p className="font-serif italic text-graphite text-[16px] leading-relaxed mb-10">
          Please refresh the page, or email{" "}
          <a
            href="mailto:atelier@nitra.com"
            className="underline underline-offset-4"
            style={{ color: "var(--color-ink)" }}
          >
            atelier@nitra.com
          </a>
          {" "}if the problem persists.
        </p>
        <Link
          href="/products"
          className="rb-cta-outline"
          style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.18em", padding: "16px 28px" }}
        >
          Back to Catalogue
        </Link>
      </div>
    );
  }

  return (
    <StripeProvider clientSecret={clientSecret}>
      <div className="grid lg:grid-cols-[1fr_460px] gap-10 lg:gap-16">
        {/* Form column */}
        <div>
          {status === "loading" ? <FormSkeleton /> : <CheckoutForm />}
        </div>

        {/* Summary column */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <OrderSummary />
        </div>
      </div>
    </StripeProvider>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      <div>
        <div className="h-3 w-24 bg-stone/30 mb-5" />
        <div className="h-12 bg-stone/20" />
      </div>
      <div>
        <div className="h-3 w-32 bg-stone/30 mb-5" />
        <div className="h-12 bg-stone/20 mb-3" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-12 bg-stone/20" />
          <div className="h-12 bg-stone/20" />
        </div>
      </div>
      <div>
        <div className="h-3 w-20 bg-stone/30 mb-5" />
        <div className="h-32 bg-stone/20" />
      </div>
    </div>
  );
}
