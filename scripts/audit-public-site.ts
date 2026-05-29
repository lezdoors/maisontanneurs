const SITE = process.env.SITE_URL || "https://maisontanneurs.com";

export {};

const ROUTES = [
  "/",
  "/products",
  "/about",
  "/contact",
  "/legal/shipping",
  "/legal/returns",
  "/legal/terms",
  "/legal/privacy",
  "/legal/care",
  "/legal/faq",
  "/checkout/pay",
  "/collection",
  "/search",
];

const HIDDEN_PRODUCT_ROUTES = [
  "/products/test-e2e",
  "/products/marrakech-tote-bordeaux",
  "/products/marrakech-tote-noir",
  "/products/medina-crossbody-tassel",
  "/products/medina-duffle",
  "/products/black-stitched-backpack",
  "/products/explorer-rolltop-noir",
];

const INTERNAL_ROUTES = [
  "/_admin",
  "/_admin/dashboard",
  "/_admin/orders",
  "/_admin/products",
  "/admin/dashboard",
  "/admin/orders",
  "/admin/products",
];

const BAD_PUBLIC_PATTERNS = [
  /test-e2e/i,
  /marrakech-tote-bordeaux/i,
  /marrakech-tote-noir/i,
  /medina-crossbody-tassel/i,
  /medina-duffle/i,
  /black-stitched-backpack/i,
  /Black Stitched Backpack/i,
  /explorer-rolltop-noir/i,
  /jacket|outerwear|clothes|clothing|wearables/i,
  /Tannerie Chouara/i,
  /Hand-cut in Fes/i,
  /Marrakech,\s*MA\b/i,
];

async function fetchText(path: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(new URL(path, SITE), {
      redirect: "follow",
      signal: controller.signal,
    });
    const contentType = res.headers.get("content-type") || "";
    const text = contentType.includes("text/html") ? await res.text() : "";
    return { status: res.status, text };
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const failures: string[] = [];

  for (const route of ROUTES) {
    const { status, text } = await fetchText(route);
    if (status !== 200) {
      failures.push(`${route} returned ${status}, expected 200`);
      continue;
    }

    for (const pattern of BAD_PUBLIC_PATTERNS) {
      if (pattern.test(text)) {
        failures.push(`${route} contains blocked public pattern ${pattern}`);
      }
    }
  }

  for (const route of HIDDEN_PRODUCT_ROUTES) {
    const { status } = await fetchText(route);
    if (status !== 404) {
      failures.push(`${route} returned ${status}, expected 404 hidden/not found`);
    }
  }

  for (const route of INTERNAL_ROUTES) {
    const { status, text } = await fetchText(route);
    if (status === 200) {
      failures.push(`${route} returned 200, expected internal route to be unavailable to public`);
    }
    for (const pattern of [/Administration/i, /Add Etsy Order/i, /Total Revenue/i]) {
      if (pattern.test(text)) {
        failures.push(`${route} leaked internal admin content matching ${pattern}`);
      }
    }
  }

  if (failures.length > 0) {
    console.error("=== Public site audit failed ===");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log("=== Public site audit passed ===");
  console.log(`Site: ${SITE}`);
  console.log(`200 routes: ${ROUTES.length}`);
  console.log(`Hidden product 404 routes: ${HIDDEN_PRODUCT_ROUTES.length}`);
  console.log(`Internal routes unavailable: ${INTERNAL_ROUTES.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
