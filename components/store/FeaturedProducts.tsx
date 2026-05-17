"use client";

import Image from "next/image";
import Link from "next/link";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { STATIC_PRODUCTS } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

export default function FeaturedProducts() {
  useScrollReveal();

  const featured = STATIC_PRODUCTS.filter((p) => p.featured);

  return (
    <section className="section-pad bg-[var(--color-umber)] text-[var(--color-bone)]">
      {/* Section header */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6 md:gap-16 mb-16 md:mb-24 max-w-[1200px] mx-auto px-6 md:px-10">
        <h2 className="font-serif text-[clamp(36px,5vw,76px)] leading-[1.08] tracking-[-0.015em] reveal">
          In the workshop <em className="italic text-[var(--color-clay)]">this season</em>.
        </h2>
        <div className="flex flex-col justify-end">
          <div className="flex items-center gap-3.5 mb-3 reveal reveal-delay-1">
            <div className="w-12 h-px bg-[var(--color-cedar)]" />
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-sand)]">
              02 &middot; Quarterly Selection
            </span>
          </div>
          <p className="text-[15px] font-sans font-light leading-relaxed text-[var(--color-bone)]/90 max-w-[44ch] reveal reveal-delay-2">
            Each piece exists in a single copy unless commissioned again. What
            leaves the workshop is not replaced — it is succeeded.
          </p>
          <Link
            href="/products"
            className="group mt-5 inline-flex items-center gap-3.5 text-[11px] font-mono tracking-[0.24em] uppercase text-[var(--color-bone)]/70 border-b border-[var(--color-line-bone)] pb-2.5 transition-all duration-400 hover:text-[var(--color-sand)] hover:border-[var(--color-sand)] w-fit reveal reveal-delay-3"
          >
            See the full catalogue
            <div className="relative w-8 h-px bg-current transition-all duration-500 ease-[var(--ease)] group-hover:w-12">
              <div className="absolute right-0 top-[-3px] w-[7px] h-[7px] border-t border-r border-current rotate-45" />
            </div>
          </Link>
        </div>
      </div>

      {/* Asymmetric mosaic grid */}
      <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-4 px-6 md:px-10">
        {featured.map((product, i) => {
          // Asymmetric grid classes for each position
          const gridClasses = [
            "md:col-span-7 md:row-span-2", // Large left
            "md:col-span-5",                // Top right
            "md:col-span-5",                // Bottom right
            "md:col-span-4",                // Bottom left
            "md:col-span-8",                // Bottom wide
          ][i] || "md:col-span-4";

          const aspectClasses = [
            "aspect-[4/5]",
            "aspect-square",
            "aspect-square",
            "aspect-[3/4]",
            "aspect-[16/9]",
          ][i] || "aspect-square";

          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className={`group relative overflow-hidden bg-[#1c1108] ${gridClasses} reveal`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className={`relative w-full ${aspectClasses}`}>
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 bg-gradient-to-t from-black/40 to-transparent">
                <div className="text-[13px] font-sans font-normal text-white">
                  {product.title}
                </div>
                <div className="text-[12px] font-mono tracking-wider text-white/60 mt-0.5">
                  {formatPrice(product.price)}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
