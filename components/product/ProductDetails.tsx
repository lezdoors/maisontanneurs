"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCurrency } from "@/components/store/CurrencyProvider";
import { useCart } from "@/components/store/CartProvider";
import { useLocalizedHref, useT } from "@/lib/i18n-client";
import { productToCartItem } from "@/lib/cart";
import { trackGA4Event } from "@/components/store/GA4";
import { trackPixelEvent } from "@/components/store/MetaPixel";
import type { Product } from "@/lib/supabase/types";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addItem, openCart } = useCart();
  const { format } = useCurrency();
  const t = useT();
  const href = useLocalizedHref();
  const [justAdded, setJustAdded] = useState(false);

  // GA4 + Pixel: view_item / ViewContent on PDP mount
  useEffect(() => {
    const price = product.price / 100;
    trackGA4Event("view_item", {
      currency: "USD",
      value: price,
      items: [
        {
          item_id: product.slug,
          item_name: product.title,
          item_category: product.category,
          price,
          quantity: 1,
        },
      ],
    });
    trackPixelEvent("ViewContent", {
      content_ids: [product.slug],
      content_name: product.title,
      content_type: "product",
      content_category: product.category,
      currency: "USD",
      value: price,
    });
  }, [product.slug, product.title, product.price, product.category]);

  useEffect(() => {
    if (!justAdded) return;
    const timer = window.setTimeout(() => setJustAdded(false), 2500);
    return () => window.clearTimeout(timer);
  }, [justAdded]);

  function handleAddToCart() {
    addItem(productToCartItem(product));
    setJustAdded(true);
    const price = product.price / 100;
    trackGA4Event("add_to_cart", {
      currency: "USD",
      value: price,
      items: [
        {
          item_id: product.slug,
          item_name: product.title,
          item_category: product.category,
          price,
          quantity: 1,
        },
      ],
    });
    trackPixelEvent("AddToCart", {
      content_ids: [product.slug],
      content_name: product.title,
      content_type: "product",
      content_category: product.category,
      currency: "USD",
      value: price,
    });
  }

  const sku = `MT-${product.id.slice(0, 6).toUpperCase().padStart(6, "0")}`;
  const displayPrice = format(product.price);

  return (
    <>
      <div className="lg:sticky lg:top-0 lg:self-start lg:max-h-screen lg:overflow-y-auto">
        <div className="px-5 sm:px-8 lg:px-[40px] pt-8 sm:pt-10 lg:pt-8 pb-32 sm:pb-20 lg:pb-[120px]">
          <div className="flex flex-col gap-6 sm:gap-7 lg:gap-6">
          {/* Breadcrumbs */}
          <nav className="font-mono text-[10px] tracking-[0.16em] uppercase text-mineral">
            <Link href={href("/")} className="hover:text-graphite transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={href(`/products?category=${encodeURIComponent(product.category.toLowerCase())}`)}
              className="hover:text-graphite transition-colors"
            >
              {product.category}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-graphite">{product.title}</span>
          </nav>

          {/* Product name */}
          <h1 className="disp leading-[1.03] text-[clamp(28px,7.6vw,48px)]">
            {product.title}
          </h1>

          {/* Price + SKU */}
          <div className="flex items-baseline justify-between border-b border-stone pb-5 sm:pb-6">
            <span className="font-serif italic text-[24px] sm:text-[28px] text-ink">
              {format(product.price)}
            </span>
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-mineral">
              {sku}
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <p className="body-copy text-[15px] leading-[1.75] sm:text-base sm:leading-[1.8]">{product.description}</p>
          )}

          {/* Add to Cart — keep the commerce action above specs on desktop */}
          <div className="space-y-3 pt-1 sm:pt-2 hidden md:block">
            <button
              onClick={handleAddToCart}
              className="rb-cta w-full"
              style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.18em", padding: "17px 24px" }}
            >
              {t("product.addToCart")}
            </button>
            <p className="text-[11px] font-sans text-mineral leading-relaxed">
              {t("product.delivery")}
            </p>
            <div className="min-h-5">
              {justAdded && (
                <button
                  type="button"
                  onClick={openCart}
                  className="font-mono text-[10px] tracking-[0.14em] uppercase text-graphite hover:text-ink transition-colors"
                >
                  {t("product.added")}
                </button>
              )}
            </div>
          </div>

          {/* Materials */}
          {product.materials.length > 0 && (
            <div>
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-mineral block mb-3">
                {t("product.materials")}
              </span>
              <div className="flex flex-wrap gap-2">
                {product.materials.map((material) => (
                  <span
                    key={material}
                    className="font-mono text-[11px] tracking-[0.08em] text-graphite border border-stone px-3 py-1.5"
                  >
                    {material}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dimensions */}
          {product.dimensions &&
            Object.keys(product.dimensions).length > 0 && (
              <div>
                <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-mineral block mb-3">
                  {t("product.dimensions")}
                </span>
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.dimensions).map(([key, value]) => (
                      <tr key={key} className="border-b border-stone/20">
                        <td className="font-mono text-[11px] tracking-[0.08em] text-mineral uppercase py-2 pr-4 w-24">
                          {key}
                        </td>
                        <td className="font-sans text-[14px] text-graphite py-2">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          {/* Trust strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-y border-stone/40 py-4">
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-graphite">{t("product.secure")}</span>
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-graphite">{t("product.returns")}</span>
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-graphite">{t("product.worldwide")}</span>
          </div>

          {/* Shipping + care note */}
          <p className="font-serif italic text-[14px] text-mineral leading-[1.6]">
            Hand-stitched in Marrakech. Free worldwide shipping by tracked express courier, 3–5 days.
          </p>

          {/* Care + sizing links */}
          <div className="border-t border-stone/40 pt-6 flex flex-col gap-2.5">
            <Link
              href={href("/legal/care")}
              className="font-mono text-[10px] tracking-[0.18em] uppercase text-graphite hover:text-ink transition-colors flex items-center justify-between"
            >
              <span>{t("product.care").replace(" →", "")}</span>
              <span className="text-mineral">→</span>
            </Link>
            <Link
              href={href("/legal/shipping")}
              className="font-mono text-[10px] tracking-[0.18em] uppercase text-graphite hover:text-ink transition-colors flex items-center justify-between"
            >
              <span>{t("product.shipping").replace(" →", "")}</span>
              <span className="text-mineral">→</span>
            </Link>
            <Link
              href={href("/legal/returns")}
              className="font-mono text-[10px] tracking-[0.18em] uppercase text-graphite hover:text-ink transition-colors flex items-center justify-between"
            >
              <span>{t("product.returnsLink").replace(" →", "")}</span>
              <span className="text-mineral">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>

      <div className="md:hidden fixed inset-x-0 bottom-0 z-[68] border-t border-stone/40 bg-white/95 backdrop-blur px-4 pt-2.5 pb-[max(10px,env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-mineral">Ready to order</p>
            <p className="font-serif italic text-[17px] text-ink leading-none mt-1">{displayPrice}</p>
          </div>
          <button
            onClick={handleAddToCart}
            className="rb-cta flex-1"
            style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.16em", padding: "14px 16px" }}
          >
            {t("product.addToCart")}
          </button>
        </div>
        <p className="mt-2 text-[10px] font-sans text-mineral leading-relaxed">
          {t("product.delivery")}
        </p>
      </div>

      <div
        className={`fixed left-1/2 -translate-x-1/2 bottom-[88px] md:bottom-5 z-[70] px-4 py-2.5 bg-ink text-white border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-300 ${
          justAdded
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
        aria-hidden={!justAdded}
        inert={!justAdded}
      >
        <button
          type="button"
          onClick={openCart}
          className="font-mono text-[10px] tracking-[0.14em] uppercase"
        >
          {t("product.added")}
        </button>
      </div>
    </>
  );
}
