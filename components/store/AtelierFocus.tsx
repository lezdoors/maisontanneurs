import Image from "next/image";
import Link from "next/link";

const ATELIER_HERO: string | null = "/hero/jewelry-focus.webp";

export default function AtelierFocus() {
  return (
    <section className="ed-section bg-[var(--color-bg-dark)] text-white">
      <div className="max-w-[1480px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="order-2 lg:order-1 max-w-[460px] reveal">
          <div className="ed-eyebrow text-white/55 mb-6">The Atelier</div>
          <h2 className="ed-h2 text-white max-w-[14ch]">
            Hand-stitched in Marrakech.
          </h2>
          <p className="ed-body-lg mt-7 max-w-[40ch] text-white/75">
            Full-grain leather, solid brass, contrast saddle-stitch. Every
            piece is finished by hand in a small Marrakech atelier — one
            artisan, one bag, signed and shipped.
          </p>
          <div className="mt-10">
            <Link
              href="/products?category=Leather%20Goods"
              className="ed-cta-light"
            >
              See the leather
            </Link>
          </div>
        </div>

        <div className="order-1 lg:order-2 relative aspect-square lg:aspect-[4/5] overflow-hidden bg-[var(--color-bg-dark-soft)]">
          {ATELIER_HERO ? (
            <Image
              src={ATELIER_HERO}
              alt="Inside the Marrakech atelier"
              fill
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 60% 40%, #5c4530 0%, #2a2622 55%, #0e0d0c 100%)",
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
