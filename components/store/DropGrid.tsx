import Image from "next/image";
import Link from "next/link";
import { STATIC_PRODUCTS } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

export default function DropGrid() {
  const pieces = STATIC_PRODUCTS.filter((p) => p.featured);

  return (
    <section id="drop" className="rb-section bg-[var(--color-bg)]">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-end justify-between gap-6 mb-10 px-1">
          <div>
            <div className="rb-eyebrow mb-3">Drop 01</div>
            <h2 className="rb-h2">Three pieces. June 2026.</h2>
          </div>
          <Link href="/products" className="rb-more hidden md:inline-flex">
            All pieces
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {pieces.map((p) => {
            const primary = p.images[0];
            return (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="rb-product-card group block"
              >
                <div className="rb-card-img-wrap aspect-[4/5] bg-[var(--rb-card-bg)] overflow-hidden">
                  <Image
                    src={primary}
                    alt={p.title}
                    width={1200}
                    height={1500}
                    className="rb-card-img w-full h-full object-cover"
                  />
                </div>
                <div className="pt-4 pb-2 px-1">
                  <div className="rb-card-title">{p.title}</div>
                  <div className="rb-meta mt-1 text-[var(--color-mineral)]">
                    {p.category}
                  </div>
                  <div className="rb-price mt-3">{formatPrice(p.price)}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
