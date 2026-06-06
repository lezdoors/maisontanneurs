"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/store/CartProvider";
import { useLocalizedHref, useT } from "@/lib/i18n-client";
import { useCurrency } from "@/components/store/CurrencyProvider";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCart();
  const { format } = useCurrency();
  const t = useT();
  const href = useLocalizedHref();
  const router = useRouter();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    closeCart();
    router.push(href("/checkout/pay"));
  };

  return (
    <>
      <div
        className={`cart-scrim ${isOpen ? "open" : ""}`}
        onClick={() => closeCart()}
        aria-hidden="true"
      />

      {isOpen && (
        <aside
          className="cart-drawer open"
          aria-modal="true"
          role="dialog"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-stone/30">
            <h3 className="text-[11px] font-sans font-normal tracking-[0.22em] uppercase text-ink">
              {t("cart.title")}
            </h3>
            <button
              onClick={() => closeCart()}
              aria-label={t("cart.close")}
              className="text-[11px] font-sans tracking-[0.22em] uppercase text-graphite hover:text-ink transition-colors"
            >
              {t("cart.close")}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {items.length === 0 ? (
              <div className="mt-6 space-y-4">
                <p className="font-serif italic text-mineral text-[15px]">{t("cart.empty")}</p>
                <button
                  onClick={() => closeCart()}
                  className="rb-cta-outline"
                  style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", padding: "12px 16px" }}
                >
                  {t("cart.continue")}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.product_id} className="flex gap-4 pb-6 border-b border-stone/20 last:border-0">
                    <div className="relative w-20 h-20 bg-white border border-stone/20 flex-shrink-0 overflow-hidden">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="80px"
                          className="object-contain p-2"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 pr-2">
                      <h4 className="max-w-[18ch] text-[13px] font-sans font-normal leading-snug text-ink sm:max-w-none">
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
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="w-6 h-6 border border-stone/40 text-graphite text-[12px] flex items-center justify-center hover:border-ink transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="shrink-0 text-[13px] font-sans text-ink">
                      {format(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="px-6 py-6 border-t border-stone/30">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] font-sans tracking-[0.2em] uppercase text-graphite">
                  {t("cart.subtotal")}
                </span>
                <span className="text-[15px] font-sans text-ink">{format(total)}</span>
              </div>
              <p className="text-[11px] font-sans font-light text-mineral leading-relaxed mb-4">
                {t("cart.note")}
              </p>
              <button
                onClick={handleCheckout}
                className="rb-cta w-full"
                style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.16em", padding: "16px 18px" }}
              >
                {t("cart.checkout")}
              </button>
              <button
                onClick={() => closeCart()}
                className="mt-3 w-full text-center text-[10px] font-mono tracking-[0.16em] uppercase text-graphite hover:text-ink transition-colors"
              >
                {t("cart.continue")}
              </button>
            </div>
          )}
        </aside>
      )}
    </>
  );
}
