import AdminShell from "@/components/admin/AdminShell";
import { getAdminSupabase } from "@/lib/admin-auth";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import type { Order } from "@/lib/supabase/types";
import { isCurrency, type Currency } from "@/lib/currency";

const asCurrency = (v?: string): Currency =>
  isCurrency(v) ? v : "USD";

export default async function DashboardPage() {
  const supabase = getAdminSupabase();

  // Fetch stats in parallel
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [ordersRes, productsRes, recentOrdersRes] = await Promise.all([
    supabase.from("orders").select("total, currency, status, created_at"),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("status", "available"),
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const allOrders = (ordersRes.data || []) as {
    total: number;
    currency?: string;
    status: string;
    created_at: string;
  }[];

  const paidOrders = allOrders.filter(
    (o) => o.status === "paid" || o.status === "shipped" || o.status === "delivered"
  );

  // Mixed-currency revenue: bucket each currency separately, render the
  // top-line value as a stacked "$X · €Y · £Z" string when more than one
  // currency has activity. Simpler than wiring server-side FX into the
  // dashboard, and lossless for the back-office.
  const revenueByCurrency = paidOrders.reduce<Record<string, number>>(
    (acc, o) => {
      const cur = (o.currency || "USD").toUpperCase();
      acc[cur] = (acc[cur] ?? 0) + o.total;
      return acc;
    },
    {},
  );
  const monthOrders = allOrders.filter(
    (o) => o.created_at >= monthStart
  );

  const availableProducts = productsRes.count || 0;
  const recentOrders = (recentOrdersRes.data || []) as Order[];

  const stats = [
    {
      label: "Total Revenue",
      value: Object.entries(revenueByCurrency)
        .filter(([, v]) => v > 0)
        .map(([cur, v]) => formatPrice(v, asCurrency(cur)))
        .join(" · ") || formatPrice(0, "USD"),
    },
    {
      label: "Orders This Month",
      value: monthOrders.length.toString(),
    },
    {
      label: "Total Orders",
      value: allOrders.length.toString(),
    },
    {
      label: "Products Available",
      value: availableProducts.toString(),
    },
  ];

  return (
    <AdminShell active="/admin/dashboard">
      <div className="space-y-8">
        <div>
          <p className="eyebrow mb-2">Overview</p>
          <h1 className="font-display text-2xl text-ink">Dashboard</h1>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border border-rule p-5 bg-paper"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
                {stat.label}
              </p>
              <p className="font-serif text-2xl text-ink italic">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              Recent Orders
            </p>
            <Link
              href="/admin/orders"
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-bronze hover:text-ink transition-colors"
            >
              View All
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-muted text-sm py-8 text-center border border-rule">
              No orders yet
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
                  {recentOrders.map((order) => (
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
                      <td className="px-4 py-3 text-sm text-ink-soft">
                        {order.customer_name}
                      </td>
                      <td className="px-4 py-3">
                        <ChannelBadge channel={order.sales_channel} />
                      </td>
                      <td className="px-4 py-3 text-sm text-ink text-right font-mono">
                        {formatPrice(order.total, asCurrency(order.currency))}
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

function ChannelBadge({ channel }: { channel: string }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${
        channel === "etsy"
          ? "bg-terra/10 text-terra"
          : "bg-bronze/10 text-bronze"
      }`}
    >
      {channel}
    </span>
  );
}
