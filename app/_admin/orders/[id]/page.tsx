import { redirect, notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getAdminSupabase } from "@/lib/admin-auth";
import { formatPrice } from "@/lib/utils";
import { sendShippingNotification } from "@/lib/email";
import type { Order } from "@/lib/supabase/types";

const ORDER_STATUSES = ["pending", "paid", "shipped", "delivered"] as const;

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getAdminSupabase();

  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();

  const order = data as Order;

  async function updateOrder(formData: FormData) {
    "use server";

    const status = formData.get("status") as Order["status"];
    const tracking_number = (formData.get("tracking_number") as string) || null;
    const notes = (formData.get("notes") as string) || null;

    const supabase = getAdminSupabase();

    // Check if tracking number is being added (for shipping notification)
    const shouldSendShippingEmail =
      tracking_number &&
      tracking_number !== order.tracking_number &&
      order.customer_email;

    const { error } = await supabase
      .from("orders")
      .update({
        status,
        tracking_number,
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Failed to update order:", error);
      redirect(`/admin/orders/${id}?error=update_failed`);
    }

    // Send shipping notification if tracking was added
    if (shouldSendShippingEmail) {
      try {
        await sendShippingNotification({
          to: order.customer_email,
          orderNumber: order.order_number,
          customerName: order.customer_name,
          trackingNumber: tracking_number,
        });
      } catch (err) {
        console.error("Failed to send shipping email:", err);
      }
    }

    redirect(`/admin/orders/${id}?saved=true`);
  }

  const addr = order.shipping_address || {};

  return (
    <AdminShell active="/admin/orders">
      <div className="max-w-3xl space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="eyebrow mb-2">
              Order Detail
            </p>
            <h1 className="font-display text-2xl text-ink">
              {order.order_number}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-block px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${
                order.sales_channel === "etsy"
                  ? "bg-terra/10 text-terra"
                  : "bg-bronze/10 text-bronze"
              }`}
            >
              {order.sales_channel}
            </span>
            <StatusBadge status={order.status} />
          </div>
        </div>

        {/* Customer info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="border border-rule p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
              Customer
            </p>
            <p className="text-sm text-ink font-medium">
              {order.customer_name}
            </p>
            <p className="font-mono text-[12px] text-muted mt-1">
              {order.customer_email}
            </p>
          </div>
          <div className="border border-rule p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
              Shipping Address
            </p>
            <div className="text-sm text-ink-soft leading-relaxed">
              {addr.line1 && <p>{addr.line1}</p>}
              {addr.line2 && <p>{addr.line2}</p>}
              {(addr.city || addr.state || addr.postal_code) && (
                <p>
                  {[addr.city, addr.state, addr.postal_code]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
              {addr.country && <p>{addr.country}</p>}
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="border border-rule">
          <div className="px-5 py-3 border-b border-rule">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              Items
            </p>
          </div>
          <table className="w-full">
            <tbody>
              {(order.items || []).map((item, i) => (
                <tr
                  key={i}
                  className="border-b border-rule-soft last:border-b-0"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <div className="w-10 h-10 bg-paper-2 border border-rule-soft flex-shrink-0 overflow-hidden">
                          <img
                            src={item.image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-ink">{item.title}</p>
                        <p className="font-mono text-[10px] text-muted">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-sm text-ink">
                    {formatPrice(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              {order.subtotal !== order.total && (
                <>
                  <tr className="border-t border-rule">
                    <td className="px-5 py-2 font-mono text-[11px] text-muted uppercase tracking-[0.12em]">
                      Subtotal
                    </td>
                    <td className="px-5 py-2 text-right font-mono text-sm text-muted">
                      {formatPrice(order.subtotal)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-2 font-mono text-[11px] text-muted uppercase tracking-[0.12em]">
                      Shipping
                    </td>
                    <td className="px-5 py-2 text-right font-mono text-sm text-muted">
                      {formatPrice(order.shipping_cost)}
                    </td>
                  </tr>
                </>
              )}
              <tr className="border-t border-rule">
                <td className="px-5 py-3 font-mono text-[11px] text-ink uppercase tracking-[0.12em] font-medium">
                  Total
                </td>
                <td className="px-5 py-3 text-right font-serif text-lg text-ink italic">
                  {formatPrice(order.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Update form */}
        <form action={updateOrder} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="status"
                className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-2"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={order.status}
                className="w-full px-4 py-2.5 bg-transparent border border-rule text-ink font-sans text-[15px] focus:outline-none focus:border-ink transition-colors"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="tracking_number"
                className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-2"
              >
                Tracking Number
              </label>
              <input
                id="tracking_number"
                name="tracking_number"
                type="text"
                defaultValue={order.tracking_number || ""}
                placeholder="Enter tracking number"
                className="w-full px-4 py-2.5 bg-transparent border border-rule text-ink font-sans text-[15px] focus:outline-none focus:border-ink transition-colors"
              />
              {!order.tracking_number && (
                <p className="font-mono text-[10px] text-muted mt-1">
                  Adding a tracking number sends a shipping notification email
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-2"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              defaultValue={order.notes || ""}
              placeholder="Internal notes about this order..."
              className="w-full px-4 py-2.5 bg-transparent border border-rule text-ink font-sans text-[15px] focus:outline-none focus:border-ink transition-colors resize-y"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-rule">
            <button
              type="submit"
              className="px-6 py-2.5 bg-ink text-paper font-mono text-[11px] uppercase tracking-[0.22em] hover:bg-ink-soft transition-colors"
            >
              Save Changes
            </button>
            <a
              href="/admin/orders"
              className="px-6 py-2.5 border border-rule text-muted font-mono text-[11px] uppercase tracking-[0.22em] hover:text-ink hover:border-ink transition-colors"
            >
              Back to Orders
            </a>
          </div>
        </form>

        {/* Metadata */}
        <div className="pt-6 border-t border-rule">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
            Metadata
          </p>
          <div className="grid grid-cols-2 gap-2 text-[12px] font-mono text-muted">
            <p>Created: {new Date(order.created_at).toLocaleString()}</p>
            <p>Updated: {new Date(order.updated_at).toLocaleString()}</p>
            {order.stripe_session_id && (
              <p className="col-span-2">
                Stripe: {order.stripe_session_id}
              </p>
            )}
            {order.etsy_order_id && (
              <p className="col-span-2">
                Etsy: {order.etsy_order_id}
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-stone/20 text-bronze-deep",
    paid: "bg-bronze/10 text-bronze",
    shipped: "bg-terra/10 text-terra",
    delivered: "bg-ink/10 text-ink",
  };

  return (
    <span
      className={`inline-block px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${styles[status] || "bg-rule-soft text-muted"}`}
    >
      {status}
    </span>
  );
}
