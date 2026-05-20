"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface OrderItem {
  title: string;
  price: string;
}

export default function NewEtsyOrderPage() {
  const router = useRouter();
  const [items, setItems] = useState<OrderItem[]>([{ title: "", price: "" }]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function addItem() {
    setItems([...items, { title: "", price: "" }]);
  }

  function removeItem(index: number) {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof OrderItem, value: string) {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Build items array
    const orderItems = items
      .filter((item) => item.title && item.price)
      .map((item) => ({
        title: item.title,
        price: Math.round(parseFloat(item.price) * 100),
        quantity: 1,
        image: "",
        product_id: "",
      }));

    if (orderItems.length === 0) {
      setError("Add at least one item");
      setSubmitting(false);
      return;
    }

    const totalCents = orderItems.reduce((sum, item) => sum + item.price, 0);

    const body = {
      etsy_order_id: formData.get("etsy_order_id") as string,
      customer_name: formData.get("customer_name") as string,
      customer_email: formData.get("customer_email") as string,
      items: orderItems,
      total: totalCents,
      shipping_address: {
        line1: formData.get("address_line1") as string,
        line2: formData.get("address_line2") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        postal_code: formData.get("postal_code") as string,
        country: formData.get("country") as string,
      },
    };

    const res = await fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to create order");
      setSubmitting(false);
      return;
    }

    router.push("/admin/orders");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Minimal top bar for client component page */}
      <header className="border-b border-rule bg-paper/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <a
              href="/admin/dashboard"
              className="font-display text-lg text-ink tracking-tight"
            >
              Maison Tanneurs Admin
            </a>
            <a
              href="/admin/orders"
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink transition-colors"
            >
              Back to Orders
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div>
            <p className="eyebrow mb-2">Manual Entry</p>
            <h1 className="font-display text-2xl text-ink">Add Etsy Order</h1>
          </div>

          {error && (
            <div className="border border-terra bg-terra/5 px-4 py-3 font-mono text-[12px] text-terra">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-2">
                Etsy Order ID
              </label>
              <input
                name="etsy_order_id"
                type="text"
                required
                className="w-full px-4 py-2.5 bg-transparent border border-rule text-ink font-sans text-[15px] focus:outline-none focus:border-ink transition-colors"
                placeholder="e.g. 3215467890"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-2">
                  Customer Name
                </label>
                <input
                  name="customer_name"
                  type="text"
                  required
                  className="w-full px-4 py-2.5 bg-transparent border border-rule text-ink font-sans text-[15px] focus:outline-none focus:border-ink transition-colors"
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-2">
                  Customer Email
                </label>
                <input
                  name="customer_email"
                  type="email"
                  required
                  className="w-full px-4 py-2.5 bg-transparent border border-rule text-ink font-sans text-[15px] focus:outline-none focus:border-ink transition-colors"
                />
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  Items
                </p>
                <button
                  type="button"
                  onClick={addItem}
                  className="font-mono text-[11px] uppercase tracking-[0.12em] text-bronze hover:text-ink transition-colors"
                >
                  + Add Item
                </button>
              </div>
              <div className="space-y-3">
                {items.map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateItem(i, "title", e.target.value)}
                        placeholder="Item title"
                        required
                        className="w-full px-4 py-2.5 bg-transparent border border-rule text-ink font-sans text-[15px] focus:outline-none focus:border-ink transition-colors"
                      />
                    </div>
                    <div className="w-32">
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(i, "price", e.target.value)}
                        placeholder="Price ($)"
                        step="0.01"
                        min="0"
                        required
                        className="w-full px-4 py-2.5 bg-transparent border border-rule text-ink font-sans text-[15px] focus:outline-none focus:border-ink transition-colors"
                      />
                    </div>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(i)}
                        className="px-2 py-2.5 text-muted hover:text-terra transition-colors font-mono text-sm"
                      >
                        X
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping address */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
                Shipping Address
              </p>
              <div className="space-y-3">
                <input
                  name="address_line1"
                  type="text"
                  required
                  placeholder="Address line 1"
                  className="w-full px-4 py-2.5 bg-transparent border border-rule text-ink font-sans text-[15px] focus:outline-none focus:border-ink transition-colors"
                />
                <input
                  name="address_line2"
                  type="text"
                  placeholder="Address line 2 (optional)"
                  className="w-full px-4 py-2.5 bg-transparent border border-rule text-ink font-sans text-[15px] focus:outline-none focus:border-ink transition-colors"
                />
                <div className="grid grid-cols-3 gap-3">
                  <input
                    name="city"
                    type="text"
                    required
                    placeholder="City"
                    className="w-full px-4 py-2.5 bg-transparent border border-rule text-ink font-sans text-[15px] focus:outline-none focus:border-ink transition-colors"
                  />
                  <input
                    name="state"
                    type="text"
                    required
                    placeholder="State"
                    className="w-full px-4 py-2.5 bg-transparent border border-rule text-ink font-sans text-[15px] focus:outline-none focus:border-ink transition-colors"
                  />
                  <input
                    name="postal_code"
                    type="text"
                    required
                    placeholder="ZIP"
                    className="w-full px-4 py-2.5 bg-transparent border border-rule text-ink font-sans text-[15px] focus:outline-none focus:border-ink transition-colors"
                  />
                </div>
                <input
                  name="country"
                  type="text"
                  required
                  defaultValue="US"
                  placeholder="Country"
                  className="w-full px-4 py-2.5 bg-transparent border border-rule text-ink font-sans text-[15px] focus:outline-none focus:border-ink transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-rule">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-ink text-paper font-mono text-[11px] uppercase tracking-[0.22em] hover:bg-ink-soft transition-colors disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create Order"}
              </button>
              <a
                href="/admin/orders"
                className="px-6 py-2.5 border border-rule text-muted font-mono text-[11px] uppercase tracking-[0.22em] hover:text-ink hover:border-ink transition-colors"
              >
                Cancel
              </a>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
