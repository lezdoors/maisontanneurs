import AdminShell from "@/components/admin/AdminShell";
import { getAdminSupabase } from "@/lib/admin-auth";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import type { Order } from "@/lib/supabase/types";

const STATUSES = ["all", "pending", "paid", "shipped", "delivered"] as const;

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: filterStatus } = await searchParams;
  const supabase = getAdminSupabase();

  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (filterStatus && filterStatus !== "all") {
    query = query.eq("status", filterStatus);
  }

  const { data } = await query;
  const orders = (data || []) as Order[];
  const activeFilter = filterStatus || "all";

  return (
    <AdminShell active="/admin/orders">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow mb-2">Management</p>
            <h1 className="font-display text-2xl text-ink">Orders</h1>
          </div>
          <Link
            href="/admin/orders/new"
            className="px-4 py-2.5 bg-ink text-paper font-mono text-[11px] uppercase tracking-[0.22em] hover:bg-ink-soft transition-colors"
          >
            Add Etsy Order
          </Link>
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-1 border-b border-rule pb-px">
          {STATUSES.map((s) => (
            <Link
              key={s}
              href={s === "all" ? "/admin/orders" : `/admin/orders?status=${s}`}
              className={`px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors border-b-2 -mb-px ${
                activeFilter === s
                  ? "border-ink text-ink"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {s}
            </Link>
          ))}
        </div>

        {orders.length === 0 ? (
          <p className="text-muted text-sm py-12 text-center border border-rule">
            No orders found
          </p>
        ) : (
          <div className="border border-rule overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-rule">
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted font-normal">
                    Order
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted font-normal">
                    Customer
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted font-normal">
                    Channel
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted font-normal text-right">
                    Total
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted font-normal">
                    Status
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted font-normal">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-rule-soft last:border-b-0 hover:bg-paper-2/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-mono text-xs text-ink hover:text-bronze transition-colors"
                      >
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm text-ink">{order.customer_name}</p>
                        <p className="font-mono text-[10px] text-muted">
                          {order.customer_email}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${
                          order.sales_channel === "etsy"
                            ? "bg-terra/10 text-terra"
                            : "bg-bronze/10 text-bronze"
                        }`}
                      >
                        {order.sales_channel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-ink text-right font-mono">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-muted">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
      className={`inline-block px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${styles[status] || "bg-rule-soft text-muted"}`}
    >
      {status}
    </span>
  );
}
