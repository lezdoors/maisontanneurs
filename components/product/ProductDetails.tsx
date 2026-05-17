"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/store/CartProvider";
import { productToCartItem } from "@/lib/cart";
import type { Product } from "@/lib/supabase/types";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addItem } = useCart();

  function handleAddToCart() {
    addItem(productToCartItem(product));
  }

  const sku = `AKL-${product.id.slice(0, 6).toUpperCase().padStart(6, "0")}`;

  return (
    <div className="sticky top-0 self-start max-h-screen overflow-y-auto">
      <div className="px-[40px] pt-[clamp(48px,8vw,96px)] pb-[120px]">
        <div className="flex flex-col gap-10">
          {/* Breadcrumbs */}
          <nav className="font-mono text-[10px] tracking-[0.16em] uppercase text-mineral">
            <Link href="/" className="hover:text-graphite transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/products?category=${product.category.toLowerCase()}`}
              className="hover:text-graphite transition-colors"
            >
              {product.category}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-graphite">{product.title}</span>
          </nav>

          {/* Product name */}
          <h1 className="disp text-[clamp(32px,3.5vw,48px)]">
            {product.title}
          </h1>

          {/* Price + SKU */}
          <div className="flex items-baseline justify-between border-b border-stone pb-6">
            <span className="font-serif italic text-[28px] text-ink">
              {formatPrice(product.price)}
            </span>
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-mineral">
              {sku}
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <p className="body-copy">{product.description}</p>
          )}

          {/* Materials */}
          {product.materials.length > 0 && (
            <div>
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-mineral block mb-3">
                Materials
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
                  Dimensions
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

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="rb-cta w-full"
            style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.18em", padding: "18px 28px" }}
          >
            Add to Cart
          </button>

          {/* Shipping note */}
          <p className="font-serif italic text-[14px] text-mineral leading-[1.6]">
            Handcrafted in Marrakech. Allow 2–4 weeks for delivery.
          </p>
        </div>
      </div>
    </div>
  );
}
