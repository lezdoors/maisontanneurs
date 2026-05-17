"use client";

import Image from "next/image";
import { useScrollReveal } from "@/lib/useScrollReveal";

export default function ProvenanceSection() {
  useScrollReveal();

  const materials = [
    { image: "/products/leather-poufs/leather-pouf-black-scale.webp", label: "Full-Grain Leather" },
    { image: "/products/kilim-poufs/kilim-pouf-red-stripe-02.webp", label: "Kilim Weave" },
    { image: "/products/wood-furniture/moroccan-mother-of-pearl-side-table-scale.webp", label: "Bone Inlay" },
    { image: "/products/pendant-lights/alhambra-pendant-scale.webp", label: "Pierced Brass" },
    { image: "/products/ceramics/tagine-green-decorated-lifestyle-01.webp", label: "Fez Ceramics" },
  ];

  return (
    <section className="py-10 md:py-16 bg-[var(--color-bone)]">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3 px-6 md:px-10">
        {materials.map((mat, i) => (
          <div
            key={mat.label}
            className="relative aspect-square overflow-hidden bg-[var(--color-bone-2)] reveal"
            style={{ transitionDelay: `${i * 0.1}s` }}
          >
            <Image
              src={mat.image}
              alt={mat.label}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[rgba(26,18,11,.6)] to-transparent">
              <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[var(--color-bone)]/80">
                {mat.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
