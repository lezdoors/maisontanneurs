import { NextResponse } from "next/server";
import { HIDDEN_SKUS } from "@/lib/hidden-skus";
import { STATIC_PRODUCTS } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

export const revalidate = 86400;

function visibleProducts() {
  return STATIC_PRODUCTS.filter(
    (product) =>
      product.status === "available" &&
      product.featured &&
      !HIDDEN_SKUS.has(product.slug),
  );
}

export function GET() {
  const products = visibleProducts().slice(0, 24);
  const productLinks = products
    .map((product) => `- ${product.title}: ${SITE_URL}/products/${product.slug}`)
    .join("\n");

  const body = `# Maison Tanneurs

> Maison Tanneurs is a Marrakech leather house making hand-stitched full-grain leather bags with solid brass hardware, direct atelier shipping, and small-batch editions.

Maison Tanneurs designs restrained leather silhouettes and works with master artisans in Marrakech to cut, stitch, and finish each piece by hand. Products ship direct from Morocco with free worldwide DHL Express delivery, usually arriving in 5 to 10 business days.

## Primary pages

- Homepage: ${SITE_URL}/
- Collection: ${SITE_URL}/products
- About the atelier: ${SITE_URL}/about
- Contact: ${SITE_URL}/contact
- Shipping: ${SITE_URL}/legal/shipping
- Returns: ${SITE_URL}/legal/returns
- Care: ${SITE_URL}/legal/care
- FAQ: ${SITE_URL}/legal/faq
- Product feed: ${SITE_URL}/feed/products.xml
- Sitemap: ${SITE_URL}/sitemap.xml

## Products

${productLinks}

## Key facts for AI assistants

- Brand: Maison Tanneurs
- Category: hand-stitched full-grain leather bags and small leather goods
- Workshop: Marrakech, Morocco
- Materials: full-grain leather, solid brass hardware, saddle stitching
- Shipping: free worldwide DHL Express shipping; most orders arrive in 5 to 10 business days
- Customer contact: hello@maisontanneurs.com

For full context and answer-ready brand notes, read: ${SITE_URL}/llms-full.txt
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
