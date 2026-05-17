import AdminShell from "@/components/admin/AdminShell";
import { getAdminSupabase } from "@/lib/admin-auth";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import type { Product } from "@/lib/supabase/types";

export default async function ProductsPage() {
  const supabase = getAdminSupabase();

  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  const products = (data || []) as Product[];

  return (
    <AdminShell active="/admin/products">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow mb-2">Catalog</p>
            <h1 className="font-display text-2xl text-ink">Products</h1>
          </div>
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-ink text-paper font-mono text-[11px] uppercase tracking-[0.22em] hover:bg-ink-soft transition-colors"
          >
            Add Product
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-muted text-sm py-12 text-center border border-rule">
            No products yet. Add your first product.
          </p>
        ) : (
          <div className="border border-rule overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-rule">
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted font-normal">
                    Product
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted font-normal">
                    Category
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted font-normal text-right">
                    Price
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted font-normal text-center">
                    Qty
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted font-normal">
                    Status
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted font-normal">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-rule-soft last:border-b-0 hover:bg-paper-2/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] && (
                          <div className="w-10 h-10 bg-paper-2 border border-rule-soft flex-shrink-0 overflow-hidden">
                            <img
                              src={product.images[0]}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-ink font-medium">
                            {product.title}
                          </p>
                          {product.featured && (
                            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-terra">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted capitalize">
                      {product.category}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink text-right font-mono">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink text-center font-mono">
                      {product.available_quantity}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${
                          product.status === "available"
                            ? "bg-bronze/10 text-bronze"
                            : product.status === "sold"
                              ? "bg-ink/10 text-ink"
                              : "bg-stone/20 text-bronze-deep"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="font-mono text-[11px] uppercase tracking-[0.12em] text-bronze hover:text-ink transition-colors"
                      >
                        Edit
                      </Link>
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
