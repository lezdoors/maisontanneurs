"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/store/CartProvider";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCart();
  const router = useRouter();
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout/pay");
  };

  return (
    <>
      {/* Scrim */}
      <div
        className={`cart-scrim ${isOpen ? "open" : ""}`}
        onClick={() => closeCart()}
      />

      {/* Drawer */}
      <aside className={`cart-drawer ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone/30">
          <h3 className="text-[11px] font-sans font-normal tracking-[0.22em] uppercase text-ink">
            Your Selection
          </h3>
          <button
            onClick={() => closeCart()}
            className="text-[11px] font-sans tracking-[0.22em] uppercase text-graphite hover:text-ink transition-colors"
          >
            Close
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <p className="font-serif italic text-mineral text-[15px] mt-6">
              Nothing chosen yet. Your selection rests here.
            </p>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.product_id}
                  className="flex gap-4 pb-6 border-b border-stone/20 last:border-0"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 bg-pearl flex-shrink-0">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-sans font-normal text-ink truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() =>
                          item.quantity <= 1
                            ? removeItem(item.product_id)
                            : updateQuantity(item.product_id, item.quantity - 1)
                        }
                        className="w-6 h-6 border border-stone/40 text-graphite text-[12px] flex items-center justify-center hover:border-ink transition-colors"
                      >
                        &minus;
                      </button>
                      <span className="text-[12px] font-mono tracking-wider text-graphite">
                        {String(item.quantity).padStart(2, "0")}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product_id, item.quantity + 1)
                        }
                        className="w-6 h-6 border border-stone/40 text-graphite text-[12px] flex items-center justify-center hover:border-ink transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-[13px] font-sans text-ink">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-stone/30">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] font-sans tracking-[0.2em] uppercase text-graphite">
                Subtotal
              </span>
              <span className="text-[15px] font-sans text-ink">
                {formatPrice(total)}
              </span>
            </div>
            <p className="text-[11px] font-sans font-light text-mineral leading-relaxed mb-5">
              White-glove delivery and customs duties calculated at checkout.
              Lead time 8-14 weeks, by sea.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => closeCart()}
                className="rb-cta-outline flex-1"
                style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", padding: "16px 18px" }}
              >
                Continue Shopping
              </button>
              <button
                onClick={handleCheckout}
                className="rb-cta flex-1"
                style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", padding: "16px 18px" }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
