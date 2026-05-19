import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, destroySession } from "@/lib/admin-auth";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
];

export default async function AdminShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active: string;
}) {
  const session = await getSession();
  if (!session) redirect("/admin");

  async function logout() {
    "use server";
    await destroySession();
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Top nav bar */}
      <header className="border-b border-rule bg-paper/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-8">
              <Link
                href="/admin/dashboard"
                className="font-display text-lg text-ink tracking-tight"
              >
                Kechken Admin
              </Link>
              <nav className="hidden sm:flex items-center gap-1">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                      active === item.href
                        ? "text-ink bg-paper-2"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] text-muted hidden sm:block">
                {session.email}
              </span>
              <form action={logout}>
                <button
                  type="submit"
                  className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted hover:text-terra transition-colors"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <nav className="sm:hidden border-b border-rule px-4 py-2 flex gap-1 overflow-x-auto">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
              active === item.href
                ? "text-ink bg-paper-2"
                : "text-muted hover:text-ink"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
