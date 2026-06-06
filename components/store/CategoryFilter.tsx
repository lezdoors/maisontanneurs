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
    <div className="sticky top-[56px] md:top-[76px] z-30 border-b border-[color:var(--color-rule)] bg-white/96 backdrop-blur">
      <div className="flex items-center justify-between px-[clamp(16px,4vw,72px)] py-3.5">
        {/* Filter chips */}
        <div className="mt-filter-scroll flex min-w-0 flex-1 flex-wrap items-center gap-x-1.5 gap-y-1.5 overflow-visible pr-0 md:gap-x-3 md:gap-y-2 lg:gap-x-5 lg:gap-y-3 2xl:gap-x-6">
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
                  "font-mono text-[9.5px] tracking-[0.13em] uppercase whitespace-nowrap border border-transparent px-2.5 py-2 transition-colors duration-200 md:text-[10px] md:tracking-[0.16em] md:px-3 lg:text-[10.5px]",
                  isActive
                    ? "border-[color:var(--color-ink)] text-[color:var(--color-ink)]"
                    : "text-[color:var(--color-ink-muted)] hover:border-[color:var(--color-rule)] hover:text-[color:var(--color-ink)]",
                )}
              >
                {category === "All" ? t("products.all") : category}
              </button>
            );
          })}
        </div>

        {/* Product count */}
        <span className="hidden md:inline font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-muted)] whitespace-nowrap ml-6">
          {productCount} {t("products.pieces")}
        </span>
      </div>
    </div>
  );
}
