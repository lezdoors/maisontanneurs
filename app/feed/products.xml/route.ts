// Meta Catalog product feed (RSS 2.0 with g: namespace).
// Used by Meta Advantage+ shopping + Dynamic Ads + Google Merchant Center.
//
// URL: https://www.maisontanneurs.com/feed/products.xml
//
// Pulls live data from Supabase products table. Filters to status=active.
// Caches at the edge for 1 hour — Meta polls hourly anyway.

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { STATIC_PRODUCTS } from "@/lib/products";
import { HIDDEN_SKUS, HIDDEN_SKUS_ARRAY } from "@/lib/hidden-skus";

export const revalidate = 3600; // 1 hour
export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.maisontanneurs.com";

// Defer client creation until request time so build-time env-var absence
// doesn't fail the build. Returns null when Supabase isn't configured —
// caller falls back to STATIC_PRODUCTS so Meta still gets a valid feed.
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function absoluteUrl(u: string): string {
  if (!u) return "";
  if (u.startsWith("http")) return u;
  return `${SITE_URL}${u.startsWith("/") ? "" : "/"}${u}`;
}

interface ProductRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  images: string[] | null;
  category: string | null;
  available_quantity: number | null;
  status: string;
  materials: string[] | null;
  weight_lbs: number | null;
}

export async function GET() {
  const supabase = getSupabase();
  let products: ProductRow[] = [];

  if (supabase) {
    const hiddenList = `(${HIDDEN_SKUS_ARRAY.join(",")})`;
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, title, slug, description, price, images, category, available_quantity, status, materials, weight_lbs",
      )
      .eq("status", "available")
      .not("slug", "in", hiddenList)
      .order("created_at", { ascending: false });

    if (error) {
      // Don't 500 — fall through to STATIC_PRODUCTS so Meta ingest still has
      // something valid to parse. Log the error in the XML as a comment.
      const fallbackProducts = (STATIC_PRODUCTS as unknown as ProductRow[]).filter(
        (p) => p.status === "available" && !HIDDEN_SKUS.has(p.slug),
      );
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- supabase error: ${xmlEscape(error.message)} — falling back to static -->
${renderFeed(fallbackProducts)}`;
      return new NextResponse(xml, {
        status: 200,
        headers: { "Content-Type": "application/xml; charset=utf-8" },
      });
    }
    products = (data || []).filter((p) => !HIDDEN_SKUS.has(p.slug));
  } else {
    // No Supabase configured (e.g., env vars missing on Vercel) — serve the
    // static catalogue. Maison Tanneurs Drop 01 lives in lib/products.ts so
    // the feed always returns the 2 leather SKUs regardless of DB state.
    products = (STATIC_PRODUCTS as unknown as ProductRow[]).filter(
      (p) => p.status === "available" && !HIDDEN_SKUS.has(p.slug),
    );
  }

  return renderResponse(renderFeed(products));
}

function renderResponse(xml: string): NextResponse {
  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

function renderFeed(products: ProductRow[]): string {
  const items = products
    .map((p) => {
      const imgs = (p.images || []).filter(Boolean);
      const heroImg = imgs[0] || "";
      if (!heroImg || !p.title || !p.price) return null; // skip incomplete

      const link = `${SITE_URL}/products/${p.slug}`;
      const priceStr = (p.price / 100).toFixed(2);
      const availability =
        (p.available_quantity ?? 0) > 0 ? "in stock" : "out of stock";
      const description = (p.description || p.title).slice(0, 4990);

      const additionalImages = imgs
        .slice(1, 11) // Meta accepts up to 10 extra
        .map((u) => `      <g:additional_image_link>${xmlEscape(absoluteUrl(u))}</g:additional_image_link>`)
        .join("\n");

      return `    <item>
      <g:id>${xmlEscape(p.slug)}</g:id>
      <title>${xmlEscape(p.title)}</title>
      <description>${xmlEscape(description)}</description>
      <link>${xmlEscape(link)}</link>
      <g:image_link>${xmlEscape(absoluteUrl(heroImg))}</g:image_link>
${additionalImages}
      <g:availability>${availability}</g:availability>
      <g:condition>new</g:condition>
      <g:price>${priceStr} USD</g:price>
      <g:brand>Maison Tanneurs</g:brand>
      <g:product_type>${xmlEscape(p.category || "Leather Goods")}</g:product_type>
      <g:identifier_exists>no</g:identifier_exists>
      <g:shipping_weight>${(p.weight_lbs ?? 5).toFixed(2)} lb</g:shipping_weight>
    </item>`;
    })
    .filter(Boolean)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Maison Tanneurs — Product Catalog</title>
    <link>${SITE_URL}</link>
    <description>Hand-stitched full-grain leather goods, made in Marrakech.</description>
${items}
  </channel>
</rss>`;
}
