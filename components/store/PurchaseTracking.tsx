"use client";

import { useEffect } from "react";
import { trackGA4Event } from "@/components/store/GA4";
import { trackPixelEvent } from "@/components/store/MetaPixel";

type PurchaseItem = {
  slug?: string;
  title?: string;
  price?: number;
  quantity?: number;
};

interface PurchaseTrackingProps {
  orderId: string;
  total: number; // in cents
  currency?: string;
  items?: PurchaseItem[];
}

// Fires GA4 purchase + Pixel Purchase on the checkout/success page.
// Server-side CAPI in lib/meta-capi.ts already sends Purchase from the Stripe
// webhook with the same event_id — Meta dedupes the two.
export default function PurchaseTracking({
  orderId,
  total,
  currency = "USD",
  items = [],
}: PurchaseTrackingProps) {
  useEffect(() => {
    const value = total / 100;
    const gaItems = items
      .filter((i) => i.slug)
      .map((i) => ({
        item_id: i.slug,
        item_name: i.title,
        price: (i.price ?? 0) / 100,
        quantity: i.quantity ?? 1,
      }));

    trackGA4Event("purchase", {
      transaction_id: orderId,
      value,
      currency,
      items: gaItems,
    });

    trackPixelEvent("Purchase", {
      value,
      currency,
      content_ids: items.filter((i) => i.slug).map((i) => i.slug),
      content_type: "product",
      num_items: items.reduce((s, i) => s + (i.quantity ?? 1), 0),
    });
  }, [orderId, total, currency, items]);

  return null;
}
