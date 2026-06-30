"use client";

import Image from "next/image";
import Link from "next/link";
import Price from "@/components/store/lemaire/Price";

type ProductVM = {
  slug: string;
  title: string;
  priceCents: number;
  image: string;
  material: string;
};

export default function LemaireHero({
  signature,
}: {
  signature: ProductVM | null;
}) {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-[#1C1A17]">
      {/* Full-bleed atelier film */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/film/maison-reel-v3.mp4"
        poster="/film/maison-reel-v3-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />

      {/* Legibility wash — soft radial glow at bottom-right, no hard edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(62%_52%_at_86%_88%,rgba(245,242,238,0.62),rgba(245,242,238,0)_72%)]"
      />

      {/* Bottom-left quiet house line */}
      <p
        className="absolute bottom-[clamp(28px,5vw,56px)] left-[clamp(24px,6vw,96px)] text-[9px] tracking-[0.3em] font-sans uppercase text-[#F5EFE6]"
        style={{ textShadow: "0 1px 12px rgba(0,0,0,0.45)" }}
      >
        Maison Tanneurs — Le Départ · Film N° I
      </p>

      {/* Bottom-right floating commerce card */}
      {signature && (
        <div className="absolute bottom-[clamp(28px,5vw,64px)] right-[clamp(24px,6vw,96px)] max-w-[260px] text-left">
          <div className="mb-4 h-px w-10 bg-[#1C1A17]/20" />
          <p className="text-[9px] tracking-[0.3em] font-sans uppercase text-[#1C1A17]/70">
            N° 01 — Signature
          </p>
          <p className="mt-1 font-display font-light text-base text-[#1C1A17]">
            {signature.title}
          </p>
          <Price
            cents={signature.priceCents}
            className="text-[11px] font-sans tracking-wide text-[#1C1A17]/70 mt-1 block"
          />
          <Link
            href={`/products/${signature.slug}`}
            className="inline-flex items-center gap-2 mt-3 p-4 -m-4 text-[10px] tracking-[0.25em] uppercase font-sans text-[#1C1A17] transition-opacity hover:opacity-60"
          >
            Inspect <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </section>
  );
}
