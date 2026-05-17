"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/products";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  productCount: number;
}

export default function CategoryFilter({ productCount }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";

  function handleClick(category: string) {
    if (category === "All") {
      router.push("/products", { scroll: false });
    } else {
      router.push(
        `/products?category=${encodeURIComponent(category.toLowerCase())}`,
        { scroll: false },
      );
    }
  }

  return (
    <div className="sticky top-[69px] z-30 bg-chalk border-b border-stone">
      <div className="flex items-center justify-between px-[clamp(24px,4vw,72px)] py-4">
        {/* Filter chips */}
        <div className="flex items-center gap-6 overflow-x-auto">
          {CATEGORIES.map((category) => {
            const isActive =
              category === "All"
                ? activeCategory === "All"
                : activeCategory.toLowerCase() === category.toLowerCase();

            return (
              <button
                key={category}
                onClick={() => handleClick(category)}
                className={cn(
                  "font-mono text-[11px] tracking-[0.2em] uppercase whitespace-nowrap pb-0.5 transition-colors duration-200",
                  isActive
                    ? "text-ink border-b border-ink"
                    : "text-mineral hover:text-graphite",
                )}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Product count */}
        <span className="font-mono text-[11px] tracking-[0.16em] text-mineral whitespace-nowrap ml-6">
          {productCount} {productCount === 1 ? "piece" : "pieces"}
        </span>
      </div>
    </div>
  );
}
