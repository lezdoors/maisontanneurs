"use client";

import { useState } from "react";
import Image from "next/image";
import { bust } from "@/lib/image-url";
import { productImageClass } from "@/lib/product-image-presentation";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const gallery = images.length > 0 ? images : ["/products/product-04.png"];
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3 px-[clamp(16px,3vw,40px)] lg:pt-8">
      <div className="mt-product-frame mt-product-frame--hero mt-product-frame--catalogue mt-ratio-square relative aspect-square">
        <Image
          src={bust(gallery[active])}
          alt={`${title}${gallery.length > 1 ? ` — view ${active + 1}` : ""}`}
          fill
          sizes="(max-width: 768px) 100vw, 55vw"
          className={productImageClass(gallery[active])}
          loading="eager"
          priority
        />
      </div>

      {gallery.length > 1 && (
        <div className="grid grid-flow-col auto-cols-[16%] sm:auto-cols-[12%] gap-2 overflow-x-auto pb-1">
          {gallery.map((src, i) => {
            const isActive = i === active;
            return (
              <button
                key={src + i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View ${i + 1}`}
                aria-current={isActive}
                className={`mt-product-frame mt-product-frame--catalogue mt-ratio-square relative aspect-square transition-colors ${
                  isActive
                    ? "border-[color:var(--color-ink)]"
                    : "border-transparent hover:border-[color:var(--color-ink)]/30"
                }`}
              >
                <Image
                  src={bust(src)}
                  alt=""
                  fill
                  sizes="120px"
                  loading={isActive ? "eager" : "lazy"}
                  className={productImageClass(src)}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
