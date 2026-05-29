"use client";

import Image from "next/image";
import { useCart } from "@/components/store/CartProvider";
import { formatPrice } from "@/lib/utils";

export default function OrderSummary() {
  const { items, subtotal } = useCart();

  return (
    <aside className="bg-pearl/40 border border-stone/30 p-7 md:p-9">
      <p className="eye mb-6">Order Summary</p>

      <ul className="flex flex-col gap-5 mb-7 max-h-[420px] overflow-y-auto pr-1">
        {items.map((item) => (
          <li
            key={item.product_id}
            className="flex gap-4 pb-5 border-b border-stone/20 last:border-0"
          >
            <div className="relative w-16 h-16 bg-pearl flex-shrink-0">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-sans text-ink leading-tight">
                {item.title}
              </p>
              <p className="text-[11px] font-mono tracking-[0.16em] text-mineral mt-2">
                QTY {String(item.quantity).padStart(2, "0")}
              </p>
            </div>
            <p className="text-[13px] font-sans text-ink shrink-0">
              {formatPrice(item.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <div className="space-y-3 pt-1 border-t border-stone/40">
        <Row label="Subtotal" value={formatPrice(subtotal)} />
        <Row label="Shipping" value="Free worldwide" italic />
        <Row label="Duties &amp; taxes" value="Shown where applicable" italic />
      </div>

      <div className="flex items-baseline justify-between mt-6 pt-5 border-t border-ink/15">
        <span className="eye">Total</span>
        <span
          className="font-display text-[26px] tracking-[-0.01em]"
          style={{ color: "var(--color-ink)" }}
        >
          {formatPrice(subtotal)}
        </span>
      </div>

      <p className="text-[11px] font-sans font-light text-mineral leading-relaxed mt-6">
        Each piece is inspected at the atelier before dispatch. Tracking is
        sent by email as soon as the parcel leaves Marrakech.
      </p>
    </aside>
  );
}

function Row({
  label,
  value,
  italic = false,
}: {
  label: string;
  value: string;
  italic?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between text-[13px]">
      <span className="font-sans text-graphite">{label}</span>
      <span
        className={italic ? "font-serif italic text-mineral" : "font-sans text-ink"}
      >
        {value}
      </span>
    </div>
  );
}
