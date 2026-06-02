"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PRODUCT_FILTERS } from "@/lib/product-taxonomy";
import { cn } from "@/lib/utils";
import { useLocalizedHref, useT } from "@/lib/i18n-client";

interface CategoryFilterProps {
  productCount: number;
}

export default function CategoryFilter({ productCount }: CategoryFilterProps) {
  const router = useRouter();
  const t = useT();
  const href = useLocalizedHref();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";

  function handleClick(category: string) {
    if (category === "All") {
      router.push(href("/products"), { scroll: false });
    } else {
      router.push(
        href(`/products?category=${encodeURIComponent(category.toLowerCase())}`),
        { scroll: false },
      );
    }
  }

  return (
    <div className="sticky top-[56px] md:top-[76px] z-30 bg-white/95 backdrop-blur border-b border-[color:var(--color-rule)]">
      <div className="flex items-center justify-between px-[clamp(20px,4vw,72px)] py-4">
        {/* Filter chips */}
        <div className="flex min-w-0 flex-1 flex-nowrap items-center gap-4 overflow-x-auto pr-6 md:flex-wrap md:overflow-visible md:pr-0 lg:gap-x-5 lg:gap-y-3 2xl:gap-x-6">
          {PRODUCT_FILTERS.map((category) => {
            const isActive =
              category === "All"
                ? activeCategory === "All"
                : activeCategory.toLowerCase() === category.toLowerCase();

            return (
              <button
                key={category}
                onClick={() => handleClick(category)}
                className={cn(
                  "font-mono text-[10.5px] tracking-[0.18em] uppercase whitespace-nowrap pb-0.5 transition-colors duration-200 lg:text-[11px]",
                  isActive
                    ? "text-[color:var(--color-ink)] border-b border-[color:var(--color-ink)]"
                    : "text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)]",
                )}
              >
                {category === "All" ? t("products.all") : category}
              </button>
            );
          })}
        </div>

        {/* Product count */}
        <span className="hidden 2xl:inline font-mono text-[11px] tracking-[0.16em] text-[color:var(--color-ink-muted)] whitespace-nowrap ml-6">
          {productCount} {t("products.pieces")}
        </span>
      </div>
    </div>
  );
}
