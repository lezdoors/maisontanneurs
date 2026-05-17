import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

// Stripe Checkout Sessions API with ui_mode: "elements" — recommended pattern
// for embedded Payment Element. Returns a `client_secret` that the client uses
// with <CheckoutElementsProvider> from @stripe/react-stripe-js/checkout.
//
// The Session fires `checkout.session.completed` to our existing webhook on
// success — no new event types needed.

export async function POST(request: NextRequest) {
  const { items } = await request.json();
  if (!items || items.length === 0) {
    return NextResponse.json({ error: "No items" }, { status: 400 });
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.nitra.com";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "elements",
      line_items: items.map(
        (item: {
          product_id: string;
          title: string;
          price: number;
          quantity: number;
          image?: string;
        }) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.title,
              images: item.image
                ? [item.image.startsWith("http") ? item.image : `${siteUrl}${item.image}`]
                : [],
              metadata: { product_id: item.product_id },
            },
            unit_amount: item.price,
          },
          quantity: item.quantity,
        }),
      ),
      shipping_address_collection: {
        allowed_countries: [
          "US","CA","GB","FR","DE","IT","ES","AU","JP","AE",
          "CH","BE","NL","SE","DK","NO","FI","IE","AT","PT","MA",
        ],
      },
      phone_number_collection: { enabled: true },
      automatic_tax: { enabled: false },
      return_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        // Stripe caps each metadata value at 500 chars, so we can't put the
        // full items array in one field. Split per item and drop image URLs
        // (only needed in line_items for Stripe's UI, not in our order record).
        // Webhook reads item_count + item_N to reconstruct the cart.
        item_count: String(items.length),
        ...Object.fromEntries(
          items.map(
            (
              i: {
                product_id: string;
                title: string;
                price: number;
                quantity: number;
              },
              idx: number,
            ) => [
              `item_${idx}`,
              JSON.stringify({
                product_id: i.product_id,
                title: i.title.slice(0, 80),
                price: i.price,
                quantity: i.quantity,
              }),
            ],
          ),
        ),
      },
    });

    return NextResponse.json({
      clientSecret: session.client_secret,
      sessionId: session.id,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe Checkout Session error:", message);
    return NextResponse.json(
      { error: "Failed to create checkout session", detail: message },
      { status: 500 },
    );
  }
}
