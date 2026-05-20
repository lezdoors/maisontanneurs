import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin -- Maison Tanneurs",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout wraps ALL /admin routes including the login page.
  // The inner layout at /admin/(panel)/layout.tsx handles the sidebar shell.
  return <>{children}</>;
}
