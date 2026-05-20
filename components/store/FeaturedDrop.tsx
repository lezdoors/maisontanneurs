import Image from "next/image";
import Link from "next/link";

// Swap point: when the featured-drop campaign WebP lands, set this path.
const FEATURED_IMAGE: string | null = "/hero/material-leather-macro.webp";

export default function FeaturedDrop() {
  return (
    <section className="ed-section bg-[var(--color-bg)]">
      <div className="max-w-[1480px] mx-auto grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 items-center">
        <div className="relative aspect-[4/5] lg:aspect-[5/6] bg-[var(--color-bg-alt)] overflow-hidden">
          {FEATURED_IMAGE ? (
            <Image
              src={FEATURED_IMAGE}
              alt="Drop 01 campaign"
              fill
              sizes="(min-width: 1024px) 56vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #ddd1b9 0%, #c8b89a 50%, #8c6b3a 100%)",
              }}
            />
          )}
        </div>

        <div className="max-w-[440px] reveal">
          <div className="ed-eyebrow mb-6">The Featured Drop</div>
          <h2 className="ed-h2 max-w-[14ch]">
            Full-grain leather, hand-finished.
          </h2>
          <p className="ed-body-lg mt-7 max-w-[40ch]">
            Bags and small leather goods, hand-stitched in a small
            Marrakech atelier. Solid brass hardware, contrast
            saddle-stitch, patinas with wear.
          </p>
          <div className="mt-10">
            <Link href="/products" className="ed-cta">
              Shop the leather
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
