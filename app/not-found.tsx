import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6 py-24">
      <div className="max-w-[520px] text-center">
        <div className="font-mono text-[10px] tracking-[0.32em] uppercase text-[var(--color-mineral)] mb-8">
          404 — Not Found
        </div>

        <h1 className="text-[clamp(36px,5vw,56px)] font-light leading-[1.05] tracking-[-0.015em] text-[var(--color-ink)] mb-6">
          This page is not in our catalogue.
        </h1>

        <p className="text-[15px] leading-[1.7] text-[var(--color-graphite)] mb-12 max-w-[42ch] mx-auto">
          Some pieces leave us. Some pages move. The atelier is still here — and so is the work.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-10 py-4 bg-[var(--color-ink)] text-[var(--color-chalk)] text-[11px] tracking-[0.22em] uppercase font-medium hover:bg-[var(--color-graphite)] transition-colors min-w-[200px]"
          >
            Return home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-10 py-4 border border-[var(--color-ink)] text-[var(--color-ink)] text-[11px] tracking-[0.22em] uppercase font-medium hover:bg-[var(--color-ink)] hover:text-[var(--color-chalk)] transition-colors min-w-[200px]"
          >
            Browse the catalogue
          </Link>
        </div>

        <p className="text-[12px] text-[var(--color-mineral)] mt-12 leading-[1.7]">
          Looking for something specific? Write to{" "}
          <a
            href="mailto:atelier@nitra.com"
            className="underline underline-offset-2 text-[var(--color-graphite)] hover:text-[var(--color-ink)]"
          >
            atelier@nitra.com
          </a>
        </p>
      </div>
    </main>
  );
}
