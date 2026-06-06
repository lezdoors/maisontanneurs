import { redirect } from "next/navigation";
import { getSession, verifyCredentials, createSession } from "@/lib/admin-auth";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/admin/dashboard");

  async function login(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) return;

    const valid = await verifyCredentials(email, password);
    if (!valid) {
      redirect("/admin?error=invalid");
    }

    await createSession(email);
    redirect("/admin/dashboard");
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="eyebrow mb-3">Administration</p>
          <h1 className="font-display text-3xl text-ink tracking-tight">
            PERLE DE L&apos;ATLAS
          </h1>
        </div>

        <form action={login} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full px-4 py-3 bg-transparent border border-rule text-ink font-sans text-[15px] focus:outline-none focus:border-ink transition-colors"
              placeholder="admin@maisontanneurs.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 bg-transparent border border-rule text-ink font-sans text-[15px] focus:outline-none focus:border-ink transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-ink text-paper font-mono text-[11px] uppercase tracking-[0.22em] hover:bg-ink-soft transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
