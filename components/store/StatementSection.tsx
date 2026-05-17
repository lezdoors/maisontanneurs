"use client";

import Image from "next/image";
import { useScrollReveal } from "@/lib/useScrollReveal";

export default function StatementSection() {
  useScrollReveal();

  return (
    <section className="relative h-[80vh] w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/products/leather-poufs/leather-poufs-collection-hero-alt.webp"
          alt="Hand-embroidered Moroccan pouf in natural setting"
          fill
          className="object-cover"
        />
      </div>

      {/* Subtle veil */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,.3) 0%, rgba(0,0,0,0) 40%, rgba(26,18,11,.55) 100%)",
        }}
      />

      {/* Quote */}
      <div className="absolute inset-0 flex items-center justify-center p-8 md:p-16">
        <div className="max-w-[800px] text-center">
          <blockquote className="font-serif italic font-light text-[clamp(32px,4.5vw,68px)] leading-[1.15] tracking-[-0.01em] text-[var(--color-bone)] reveal">
            &ldquo;A table will sit on the bench for a hundred hours. When it
            leaves, it leaves with a name — the maker&apos;s, not ours.&rdquo;
          </blockquote>
          <p className="mt-8 text-[11px] font-mono tracking-[0.24em] uppercase text-[var(--color-sand)] reveal reveal-delay-1">
            — Youssef Berrada &middot; Cedar carving &middot; Meknes
          </p>
        </div>
      </div>
    </section>
  );
}
