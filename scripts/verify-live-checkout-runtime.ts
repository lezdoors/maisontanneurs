const siteUrl = (
  process.env.SITE_URL || "https://maisontanneurs.com"
).replace(/\/$/, "");

export {};

function mask(value: string | undefined): string {
  if (!value) return "missing";
  if (value.length <= 12) return `${value.slice(0, 3)}...${value.slice(-3)}`;
  return `${value.slice(0, 8)}...${value.slice(-6)}`;
}

async function main() {
  const res = await fetch(`${siteUrl}/api/checkout/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: [
        {
          product_id: "static-05-atlas-weekender-cognac",
          slug: "atlas-weekender-cognac",
          title: "Atlas Weekender · Cognac",
          price: 32500,
          quantity: 1,
          image: "/products/landing/atlas-weekender-cognac-landing.webp",
        },
      ],
      tracking: {
        fbp: "fb.1.1770000000000.111222333",
        fbc: `fb.1.${Date.now()}.codex-live-checkout-runtime`,
      },
    }),
  });

  const text = await res.text();
  let json: Record<string, unknown> = {};
  try {
    json = JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error(`Expected JSON, got ${res.status}: ${text.slice(0, 240)}`);
  }

  if (!res.ok) {
    throw new Error(`Checkout session failed ${res.status}: ${JSON.stringify(json)}`);
  }

  const orderId = typeof json.orderId === "string" ? json.orderId : "";
  const token = typeof json.token === "string" ? json.token : "";
  const checkoutUrl = typeof json.checkoutUrl === "string" ? json.checkoutUrl : "";
  const publicKey = typeof json.publicKey === "string" ? json.publicKey : "";

  if (!orderId || !token || !checkoutUrl || !publicKey.startsWith("pk_")) {
    throw new Error(
      `Checkout response missing fields: ${JSON.stringify({
        hasOrderId: Boolean(orderId),
        hasToken: Boolean(token),
        hasCheckoutUrl: Boolean(checkoutUrl),
        publicKeyPrefixOk: publicKey.startsWith("pk_"),
      })}`,
    );
  }

  const successRes = await fetch(
    `${siteUrl}/checkout/success?revolut_order_id=${encodeURIComponent(orderId)}`,
    { redirect: "follow" },
  );
  const successHtml = await successRes.text();
  if (!successRes.ok || !successHtml.includes("Payment Pending")) {
    throw new Error(
      `Pending order success guard failed: status=${successRes.status}; hasPaymentPending=${successHtml.includes(
        "Payment Pending",
      )}`,
    );
  }
  if (successHtml.includes("Order Confirmed")) {
    throw new Error("Pending order rendered Order Confirmed");
  }

  console.log("Live checkout runtime verified");
  console.log(`site=${siteUrl}`);
  console.log(`orderId=${mask(orderId)}`);
  console.log(`token=${mask(token)}`);
  console.log(`checkoutUrlHost=${new URL(checkoutUrl).host}`);
  console.log(`publicKey=${mask(publicKey)}`);
  console.log("pendingSuccessGuard=Payment Pending");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
