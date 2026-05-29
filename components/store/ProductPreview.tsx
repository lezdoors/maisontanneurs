import Image from "next/image";
import Link from "next/link";
import { STATIC_PRODUCTS } from "@/lib/products";
import { HIDDEN_SKUS } from "@/lib/hidden-skus";
import { getServerPriceFormatter } from "@/lib/price-server";

export default async function ProductPreview() {
  const { format } = await getServerPriceFormatter();
  const pieces = STATIC_PRODUCTS.filter(
    (p) => p.featured && p.status === "available" && !HIDDEN_SKUS.has(p.slug),
  ).slice(0, 3);

  return (
    <section id="drop" className="ed-section bg-[var(--color-bg)]">
      <div className="max-w-[1480px] mx-auto">
        <div className="flex items-end justify-between gap-6 mb-12 px-1">
          <div>
            <div className="ed-eyebrow mb-4">Drop 01 · June 2026</div>
            <h2 className="ed-h2 max-w-[16ch]">
              Three pieces. Made for now.
            </h2>
          </div>
          <Link href="/products" className="ed-more hidden md:inline-flex">
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
                className="ed-card group block"
              >
                <div className="ed-card-img-wrap">
                  <Image
                    src={primary}
                    alt={p.title}
                    width={1200}
                    height={1500}
                    className="ed-card-img w-full h-full object-cover"
                  />
                </div>
                <div className="pt-5 px-1">
                  <div className="ed-card-title">{p.title}</div>
                  <div className="ed-meta mt-1.5 text-[var(--color-mineral)]">
                    {p.category}
                  </div>
                  <div className="ed-price mt-3">{format(p.price)}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
