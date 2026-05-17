"use client";

import { useState, FormEvent } from "react";
import {
  PaymentElement,
  ShippingAddressElement,
  useCheckoutElements,
} from "@stripe/react-stripe-js/checkout";
import { useCart } from "@/components/store/CartProvider";

export default function CheckoutForm() {
  const result = useCheckoutElements();
  const { items, subtotal } = useCart();

  const [email, setEmail] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (result.type !== "success") return;
    const checkout = result.checkout;

    setSubmitting(true);
    setErrorMessage(null);

    // Push the email onto the Checkout Session before confirming
    if (email) {
      try {
        await checkout.updateEmail(email);
      } catch {
        /* non-blocking */
      }
    }

    const confirmResult = await checkout.confirm();

    if (confirmResult?.type === "error") {
      setErrorMessage(
        confirmResult.error.message || "Payment failed. Please try again.",
      );
      setSubmitting(false);
      return;
    }
    // On success Stripe handles the redirect to return_url.
  }

  if (items.length === 0) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Email */}
      <section>
        <h2 className="eye mb-5">Contact</h2>
        <label
          htmlFor="email"
          className="text-[11px] font-sans tracking-[0.18em] uppercase text-mineral block mb-2"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full border border-stone/40 focus:border-ink focus:outline-none transition-colors px-4 py-3.5 text-[15px] font-sans bg-white"
          style={{ borderRadius: 0 }}
        />
        <label className="flex items-start gap-3 mt-4 cursor-pointer">
          <input
            type="checkbox"
            checked={marketingOptIn}
            onChange={(e) => setMarketingOptIn(e.target.checked)}
            className="mt-1 w-4 h-4 accent-[var(--color-ink)]"
            style={{ borderRadius: 0 }}
          />
          <span className="text-[12px] font-sans text-graphite leading-relaxed">
            Send me occasional letters from the atelier — new pieces, exhibitions,
            and field notes from Marrakech.
          </span>
        </label>
      </section>

      {/* Shipping address */}
      <section>
        <h2 className="eye mb-5">Shipping address</h2>
        <ShippingAddressElement />
      </section>

      {/* Payment */}
      <section>
        <h2 className="eye mb-5">Payment</h2>
        <PaymentElement />
      </section>

      {/* Error */}
      {errorMessage && (
        <p
          className="font-serif italic text-[14px] leading-relaxed"
          style={{ color: "#9B2C2C" }}
        >
          {errorMessage}
        </p>
      )}

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={result.type !== "success" || submitting || items.length === 0}
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
            : `Pay ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(subtotal / 100)}`}
        </button>
        <p className="text-[11px] font-sans font-light text-mineral leading-relaxed text-center mt-5">
          Encrypted by Stripe. Your card details never touch our servers.
        </p>
      </div>
    </form>
  );
}
