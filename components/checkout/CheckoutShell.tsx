"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/store/CartProvider";
import { trackGA4Event } from "@/components/store/GA4";
import { trackPixelEvent } from "@/components/store/MetaPixel";
import OrderSummary from "./OrderSummary";

type Status = "loading" | "ready" | "empty" | "error" | "missing-key";
type RevolutMode = "prod" | "sandbox";

// Revolut Pay JS widget — loaded once per page lifecycle from the merchant
// CDN. The global `RevolutCheckout` factory is exposed on window.
const REVOLUT_EMBED_SRC = "https://merchant.revolut.com/embed.js";

declare global {
  interface Window {
    RevolutCheckout?: (
      token: string,
      mode?: "prod" | "sandbox" | { mode: "prod" | "sandbox"; publicToken?: string },
    ) => Promise<RevolutCheckoutInstance>;
  }
}

interface RevolutCheckoutInstance {
  payWithPopup: (options: PayWithPopupOptions) => void;
  destroy?: () => void;
}

interface PayWithPopupOptions {
  name?: string;
  email?: string;
  phone?: string;
  savePaymentMethodFor?: "merchant" | "customer";
  shippingAddress?: {
    streetLine1?: string;
    streetLine2?: string;
    region?: string;
    city?: string;
    countryCode?: string;
    postcode?: string;
  };
  onSuccess: () => void;
  onError: (error: { message?: string; code?: string }) => void;
  onCancel?: () => void;
}

function loadRevolutEmbed(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("server"));
  if (window.RevolutCheckout) return Promise.resolve();
  const existing = document.querySelector(
    `script[src="${REVOLUT_EMBED_SRC}"]`,
  );
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("embed load failed")));
    });
  }
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = REVOLUT_EMBED_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("embed load failed"));
    document.head.appendChild(s);
  });
}

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
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [token, setToken] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const initiatedCheckoutOrderRef = useRef<string | null>(null);
  const addPaymentInfoOrderRef = useRef<string | null>(null);

  const publicKey = process.env.NEXT_PUBLIC_REVOLUT_PUBLIC_KEY;
  const revolutMode: RevolutMode =
    process.env.NEXT_PUBLIC_REVOLUT_MODE === "sandbox" ? "sandbox" : "prod";
  const trackingItems = useMemo(
    () =>
      items.map((item) => ({
        item_id: item.slug,
        item_name: item.title,
        price: item.price / 100,
        quantity: item.quantity,
      })),
    [items],
  );
  const pixelContents = useMemo(
    () =>
      items.map((item) => ({
        id: item.slug,
        quantity: item.quantity,
        item_price: item.price / 100,
      })),
    [items],
  );

  useEffect(() => {
    if (items.length === 0) {
      setStatus("empty");
      return;
    }
    if (!publicKey) {
      setStatus("missing-key");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        await loadRevolutEmbed();
        const res = await fetch("/api/checkout/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, tracking: getMetaTrackingParams() }),
        });
        if (!res.ok) throw new Error("Failed to create checkout order");
        const data = (await res.json()) as { token: string; orderId: string };
        if (cancelled) return;
        setToken(data.token);
        setOrderId(data.orderId);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
    // Re-create order when the cart line-changes; quantity-only edits are
    // also reflected because subtotal changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length === 0, publicKey, subtotal]);

  useEffect(() => {
    if (status !== "ready" || !orderId || initiatedCheckoutOrderRef.current === orderId) {
      return;
    }

    initiatedCheckoutOrderRef.current = orderId;
    const value = subtotal / 100;
    trackGA4Event("begin_checkout", {
      currency: "USD",
      value,
      items: trackingItems,
    });
    trackPixelEvent("InitiateCheckout", {
      value,
      currency: "USD",
      content_ids: items.map((item) => item.slug),
      content_type: "product",
      contents: pixelContents,
      num_items: items.reduce((sum, item) => sum + item.quantity, 0),
    });
  }, [items, orderId, pixelContents, status, subtotal, trackingItems]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !orderId || !window.RevolutCheckout) return;
    setSubmitting(true);
    setErrorMessage(null);
    try {
      if (addPaymentInfoOrderRef.current !== orderId) {
        addPaymentInfoOrderRef.current = orderId;
        const value = subtotal / 100;
        trackGA4Event("add_payment_info", {
          currency: "USD",
          value,
          payment_type: "Revolut",
          items: trackingItems,
        });
        trackPixelEvent("AddPaymentInfo", {
          value,
          currency: "USD",
          content_ids: items.map((item) => item.slug),
          content_type: "product",
          contents: pixelContents,
          num_items: items.reduce((sum, item) => sum + item.quantity, 0),
        });
      }

      const RC = await window.RevolutCheckout(token, revolutMode);
      RC.payWithPopup({
        email,
        name,
        onSuccess: () => {
          router.push(`/checkout/success?revolut_order_id=${orderId}`);
        },
        onError: (err) => {
          setErrorMessage(
            err.message || "Payment did not complete. Please try again.",
          );
          setSubmitting(false);
        },
        onCancel: () => {
          setSubmitting(false);
        },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setErrorMessage(message);
      setSubmitting(false);
    }
  }

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
          We couldn&apos;t start your checkout.
        </h1>
        <p className="font-serif italic text-graphite text-[16px] leading-relaxed mb-10">
          Please refresh the page, or email{" "}
          <a
            href="mailto:hello@maisontanneurs.com"
            className="underline underline-offset-4"
            style={{ color: "var(--color-ink)" }}
          >
            hello@maisontanneurs.com
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
    <div className="grid lg:grid-cols-[1fr_460px] gap-10 lg:gap-16">
      <div>
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Contact */}
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
            <label
              htmlFor="name"
              className="text-[11px] font-sans tracking-[0.18em] uppercase text-mineral block mb-2 mt-6"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full border border-stone/40 focus:border-ink focus:outline-none transition-colors px-4 py-3.5 text-[15px] font-sans bg-white"
              style={{ borderRadius: 0 }}
            />
          </section>

          {/* Payment */}
          <section>
            <h2 className="eye mb-5">Payment</h2>
            <p className="text-[13px] font-sans text-graphite leading-relaxed">
              Card, Apple Pay, Google Pay, and Revolut Pay are all supported.
              Press <em>Pay</em> to open the secure Revolut payment window.
            </p>
          </section>

          {errorMessage && (
            <p
              className="font-serif italic text-[14px] leading-relaxed"
              style={{ color: "#9B2C2C" }}
            >
              {errorMessage}
            </p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={status !== "ready" || submitting || items.length === 0}
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
              Encrypted by Revolut Acquiring. Card details never touch our servers.
            </p>
          </div>
        </form>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <OrderSummary />
      </div>
    </div>
  );
}
