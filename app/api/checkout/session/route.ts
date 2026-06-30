import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { createPaymentIntent } from "@/lib/checkout/stripe";
import { HIDDEN_SKUS } from "@/lib/hidden-skus";
import { getRates, convertUSDCents } from "@/lib/checkout/fx";
import { applyPromoMinor, normalizePromo } from "@/lib/checkout/promo";
import {
  CURRENCY_COOKIE,
  DEFAULT_CURRENCY,
  isCurrency,
  type Currency,
} from "@/lib/checkout/currency";
import { computeTax } from "@/lib/checkout/tax";
import { STATIC_PRODUCTS } from "@/lib/products";
import type { Product } from "@/lib/supabase/types";

// Creates a Stripe PaymentIntent for the cart. Returns the client_secret that
// @stripe/react-stripe-js binds to <PaymentElement>. The visitor stays on
// maisontanneurs.com — Stripe only renders its PCI-safe card iframes; our
// chrome surrounds it. payment_intent.succeeded → /api/webhooks/stripe →
// confirmAndPersistOrder(pi_*), idempotent on the PaymentIntent id.
//
// Ported from mt-lestanneurs (Revolut → Stripe). Adapted: loadProducts falls
// back to STATIC_PRODUCTS when Supabase env is absent, so the test checkout
// validates carts offline. Prices are USD-cents in BOTH repos (verified).

export const dynamic = "force-dynamic";

type CartItem = {
  product_id?: string;
  slug?: string;
  title?: string;
  price?: number;
  quantity: number;
  image?: string;
};

type MetaTrackingParams = { fbp?: string; fbc?: string };

type CustomerParams = {
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  zip?: string;
  country?: string;
  state?: string;
};

type ProductRow = {
  id: string;
  title: string;
  slug: string;
  price: number;
  images: string[] | null;
  status: string;
  featured: boolean | null;
  available_quantity: number | null;
};

type ValidatedItem = {
  product_id: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
};

class CartValidationError extends Error {}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function normalizeQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1;
  return Math.max(1, Math.min(9, Math.floor(quantity)));
}

function staticRows(items: CartItem[]): ProductRow[] {
  const slugs = new Set(items.map((i) => i.slug).filter(Boolean) as string[]);
  const ids = new Set(items.map((i) => i.product_id).filter(Boolean) as string[]);
  return (STATIC_PRODUCTS as Product[])
    .filter((p) => slugs.has(p.slug) || ids.has(p.id))
    .map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      price: p.price,
      images: p.images ?? null,
      status: p.status,
      featured: (p as { featured?: boolean | null }).featured ?? null,
      available_quantity:
        (p as { available_quantity?: number | null }).available_quantity ?? null,
    }));
}

async function loadProducts(items: CartItem[]): Promise<ProductRow[]> {
  const supabase = getSupabase();
  if (supabase) {
    const ids = items
      .map((i) => i.product_id)
      .filter((id): id is string => typeof id === "string" && UUID_RE.test(id));
    const slugs = items.map((i) => i.slug).filter(Boolean) as string[];
    if (ids.length > 0 || slugs.length > 0) {
      const filters = [
        ids.length > 0 ? `id.in.(${ids.join(",")})` : null,
        slugs.length > 0 ? `slug.in.(${slugs.join(",")})` : null,
      ].filter(Boolean);
      const { data, error } = await supabase
        .from("products")
        .select("id,title,slug,price,images,status,featured,available_quantity")
        .or(filters.join(","));
      if (!error && data && data.length > 0) return data as ProductRow[];
    }
  }
  // No Supabase (or empty) → validate against the static catalogue.
  return staticRows(items);
}

function aggregateItems(items: CartItem[]): CartItem[] {
  const byKey = new Map<string, CartItem>();
  for (const item of items) {
    const key = item.product_id || item.slug || "";
    const prev = byKey.get(key);
    if (prev) {
      prev.quantity = (prev.quantity || 1) + (item.quantity || 1);
    } else {
      byKey.set(key, { ...item });
    }
  }
  return Array.from(byKey.values());
}

async function validateCart(rawItems: CartItem[]): Promise<ValidatedItem[]> {
  const items = aggregateItems(rawItems);
  const products = await loadProducts(items);
  const byId = new Map(products.map((p) => [p.id, p]));
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  return items.map((item) => {
    const product =
      (item.product_id ? byId.get(item.product_id) : undefined) ||
      (item.slug ? bySlug.get(item.slug) : undefined);
    if (!product) {
      throw new CartValidationError(
        `Product not found: ${item.slug || item.product_id}`,
      );
    }
    if (product.status !== "available" || HIDDEN_SKUS.has(product.slug)) {
      throw new CartValidationError(`Product unavailable: ${product.slug}`);
    }
    const quantity = normalizeQuantity(item.quantity);
    const available =
      typeof product.available_quantity === "number"
        ? product.available_quantity
        : quantity;
    if (available <= 0 || quantity > available) {
      throw new CartValidationError(`Insufficient stock: ${product.slug}`);
    }
    const image = (product.images || []).find(Boolean);
    return {
      product_id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity,
      image,
    };
  });
}

async function getRequestCurrency(): Promise<Currency> {
  try {
    const store = await cookies();
    const value = store.get(CURRENCY_COOKIE)?.value;
    return isCurrency(value) ? value : DEFAULT_CURRENCY;
  } catch {
    return DEFAULT_CURRENCY;
  }
}

export async function POST(request: NextRequest) {
  let body: {
    items?: CartItem[];
    tracking?: MetaTrackingParams;
    customer?: CustomerParams;
    promoCode?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const items = body.items;
  if (!items || items.length === 0) {
    return NextResponse.json({ error: "No items" }, { status: 400 });
  }

  try {
    const validated = await validateCart(items);

    const currency = await getRequestCurrency();
    const rates = await getRates();
    const toMinor = (usdCents: number) =>
      Math.round(convertUSDCents(usdCents, currency, rates) / 100) * 100;

    const converted = validated.map((i) => ({
      ...i,
      unitMinor: toMinor(i.price),
      totalMinor: toMinor(i.price * i.quantity),
    }));
    const totalMinor = converted.reduce((acc, i) => acc + i.totalMinor, 0);

    const promoResult = applyPromoMinor(totalMinor, body.promoCode);
    const chargeMinor = promoResult.totalMinor;

    const c = body.customer || {};
    const custEmail = String(c.email || "").trim();
    const custName = `${String(c.firstName || "").trim()} ${String(
      c.lastName || "",
    ).trim()}`.trim();

    // Sales tax: US = state base rate from the shipping address; non-US = flat 20%.
    const taxCountry = String(
      c.country || request.headers.get("x-vercel-ip-country") || "",
    );
    const tax = computeTax({ country: taxCountry, state: c.state }, chargeMinor);
    const finalMinor = chargeMinor + tax.taxMinor;

    const metadata: Record<string, string> = {
      item_count: String(converted.length),
      display_currency: currency,
      subtotal_minor: String(chargeMinor),
      tax_minor: String(tax.taxMinor),
      tax_rate: String(tax.ratePct),
      tax_label: tax.label,
    };
    if (custName) metadata.customer_name = custName.slice(0, 120);
    if (c.address) metadata.ship_line1 = String(c.address).slice(0, 180);
    if (c.city) metadata.ship_city = String(c.city).slice(0, 80);
    if (c.zip) metadata.ship_postcode = String(c.zip).slice(0, 32);
    if (c.state) metadata.ship_state = String(c.state).slice(0, 80);
    const inferredCountry = request.headers.get("x-vercel-ip-country") || "";
    const shipCountry = String(c.country || inferredCountry || "").slice(0, 80);
    if (shipCountry) metadata.ship_country = shipCountry;
    if (body.tracking?.fbp) metadata.meta_fbp = body.tracking.fbp;
    if (body.tracking?.fbc) metadata.meta_fbc = body.tracking.fbc;
    if (promoResult.promo) {
      metadata.promo_code = normalizePromo(body.promoCode);
      metadata.discount_minor = String(promoResult.discountMinor);
    }
    converted.forEach((i, idx) => {
      metadata[`item_${idx}`] = JSON.stringify({
        product_id: i.product_id,
        slug: i.slug,
        title: i.title.slice(0, 80),
        price: i.unitMinor,
        usd_price: i.price,
        quantity: i.quantity,
      });
    });

    const intent = await createPaymentIntent({
      amount: finalMinor,
      currency: currency.toLowerCase(),
      description: `Maison Tanneurs · ${converted.length} item${
        converted.length > 1 ? "s" : ""
      }`,
      customerEmail: custEmail || undefined,
      metadata,
    });

    // Abandoned-cart row (best-effort, only if Supabase is configured).
    if (custEmail) {
      try {
        const supabase = getSupabase();
        await supabase?.from("abandoned_checkouts").insert({
          email: custEmail,
          customer_name: custName || null,
          items: converted.map((i) => ({
            slug: i.slug,
            title: i.title,
            image: i.image,
            price: i.unitMinor,
            quantity: i.quantity,
          })),
          amount_minor: finalMinor,
          currency,
          promo_code: promoResult.promo ? normalizePromo(body.promoCode) : null,
          stripe_payment_intent_id: intent.id,
          status: "pending",
        });
      } catch (e) {
        console.error("[abandoned] intent log failed:", e);
      }
    }

    return NextResponse.json({
      orderId: intent.id,
      clientSecret: intent.clientSecret,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (err instanceof CartValidationError) {
      return NextResponse.json(
        { error: "Cart needs review", detail: message },
        { status: 400 },
      );
    }
    console.error("Stripe createPaymentIntent failed:", message);
    return NextResponse.json(
      { error: "Failed to create payment intent", detail: message },
      { status: 500 },
    );
  }
}
