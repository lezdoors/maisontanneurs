import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/revolut";
import { createServerSupabase } from "@/lib/supabase/server";
import { STATIC_PRODUCTS } from "@/lib/products";
import { HIDDEN_SKUS } from "@/lib/hidden-skus";
import type { Product } from "@/lib/supabase/types";
import { getRequestCurrency } from "@/lib/i18n-server";
import { getRates, convertUSDCents } from "@/lib/fx";
import { type Currency } from "@/lib/currency";

// Creates a Revolut Acquiring order and returns the public token for the
// embedded payment widget. Webhook fires ORDER_COMPLETED on success →
// app/api/webhooks/revolut handles persistence + emails + Meta CAPI.

type CartItem = {
  product_id: string;
  slug?: string;
  title: string;
  price: number; // minor units (cents)
  quantity: number;
  image?: string;
};

type MetaTrackingParams = {
  fbp?: string;
  fbc?: string;
};

type ValidatedCartItem = {
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

function normalizeQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1;
  return Math.max(1, Math.min(9, Math.floor(quantity)));
}

async function loadProductsForCart(items: CartItem[]): Promise<Product[]> {
  const ids = items
    .map((item) => item.product_id)
    .filter((id): id is string => Boolean(id) && UUID_RE.test(id));
  const slugs = items.map((item) => item.slug).filter(Boolean) as string[];
  const supabase = await createServerSupabase();

  if (supabase && (ids.length > 0 || slugs.length > 0)) {
    const filters = [
      ids.length > 0 ? `id.in.(${ids.join(",")})` : null,
      slugs.length > 0 ? `slug.in.(${slugs.join(",")})` : null,
    ].filter(Boolean);

    const { data, error } = await supabase
      .from("products")
      .select("id,title,slug,price,images,status,featured,available_quantity")
      .or(filters.join(","));

    if (!error && data) return data as Product[];
  }

  return (STATIC_PRODUCTS as Product[]).filter(
    (product) =>
      ids.includes(product.id) || (product.slug && slugs.includes(product.slug)),
  );
}

async function validateCart(items: CartItem[]): Promise<ValidatedCartItem[]> {
  const products = await loadProductsForCart(items);
  const byId = new Map(products.map((product) => [product.id, product]));
  const bySlug = new Map(products.map((product) => [product.slug, product]));

  return items.map((item) => {
    const product = byId.get(item.product_id) || (item.slug ? bySlug.get(item.slug) : undefined);
    if (!product) {
      throw new CartValidationError(`Product not found: ${item.slug || item.product_id}`);
    }
    if (
      product.status !== "available" ||
      product.featured === false ||
      HIDDEN_SKUS.has(product.slug)
    ) {
      throw new CartValidationError(`Product unavailable: ${product.slug}`);
    }

    const quantity = normalizeQuantity(item.quantity);
    const availableQuantity =
      typeof product.available_quantity === "number"
        ? product.available_quantity
        : quantity;
    if (availableQuantity <= 0 || quantity > availableQuantity) {
      throw new CartValidationError(`Insufficient stock: ${product.slug}`);
    }

    return {
      product_id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity,
      image: Array.isArray(product.images) ? product.images[0] : undefined,
    };
  });
}

export async function POST(request: NextRequest) {
  let body: { items?: CartItem[]; tracking?: MetaTrackingParams };
  try {
    body = (await request.json()) as { items?: CartItem[] };
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const items = body.items;
  if (!items || items.length === 0) {
    return NextResponse.json({ error: "No items" }, { status: 400 });
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.maisontanneurs.com";

  try {
    const validatedItems = await validateCart(items);

    // Resolve the customer's display currency from the cookie-driven proxy
    // header, then fetch the daily-cached FX rates and convert USD-canonical
    // line items to the charge currency. Revolut sees the same number the
    // user saw on the PDP.
    const currency: Currency = await getRequestCurrency();
    const rates = await getRates();
    const linePriceMinor = (usdCents: number) =>
      convertUSDCents(usdCents, currency, rates);

    const convertedItems = validatedItems.map((i) => ({
      ...i,
      unitMinor: linePriceMinor(i.price),
      totalMinor: linePriceMinor(i.price * i.quantity),
    }));

    const totalMinor = convertedItems.reduce(
      (acc, i) => acc + i.totalMinor,
      0,
    );

    // Revolut metadata values are limited per field. Mirror the Stripe-era
    // approach: store item_count + item_N to reconstruct the cart later.
    // Keep USD-canonical price in metadata so post-hoc analytics aren't
    // FX-dependent. Revolut's order.currency is the source of truth for what
    // we actually charged.
    const itemMetadata: Record<string, string> = {
      item_count: String(convertedItems.length),
      display_currency: currency,
    };
    if (body.tracking?.fbp) itemMetadata.meta_fbp = body.tracking.fbp;
    if (body.tracking?.fbc) itemMetadata.meta_fbc = body.tracking.fbc;
    convertedItems.forEach((i, idx) => {
      itemMetadata[`item_${idx}`] = JSON.stringify({
        product_id: i.product_id,
        slug: i.slug,
        title: i.title.slice(0, 80),
        price: i.unitMinor,
        usd_price: i.price,
        quantity: i.quantity,
      });
    });

    const order = await createOrder({
      amount: totalMinor,
      currency,
      capture_mode: "automatic",
      // Static redirect_url — Revolut does NOT substitute template
      // placeholders like {ORDER_ID}. The embedded popup is the primary
      // flow; on success the client redirects to
      // /checkout/success?revolut_order_id=<actual id> from JS.
      // The static URL below is only the hosted-checkout fallback.
      redirect_url: `${siteUrl}/checkout/success`,
      description: `Maison Tanneurs · ${convertedItems.length} item${convertedItems.length > 1 ? "s" : ""}`,
      metadata: itemMetadata,
      line_items: convertedItems.map((i) => ({
        name: i.title,
        type: "physical",
        quantity: { value: i.quantity, unit: "piece" },
        unit_price_amount: i.unitMinor,
        total_amount: i.totalMinor,
        external_id: i.product_id,
        image_urls: i.image
          ? [i.image.startsWith("http") ? i.image : `${siteUrl}${i.image}`]
          : undefined,
      })),
    });

    return NextResponse.json({
      orderId: order.id,
      token: order.token,
      checkoutUrl: order.checkout_url,
      publicKey: process.env.NEXT_PUBLIC_REVOLUT_PUBLIC_KEY,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (err instanceof CartValidationError) {
      return NextResponse.json(
        { error: "Cart needs review", detail: message },
        { status: 400 },
      );
    }
    console.error("Revolut createOrder failed:", message);
    return NextResponse.json(
      { error: "Failed to create checkout order", detail: message },
      { status: 500 },
    );
  }
}
