import Image from "next/image";
import Link from "next/link";

const JEWELRY_HERO: string | null = "/hero/jewelry-focus.webp";

export default function JewelryFocus() {
  return (
    <section className="ed-section bg-[var(--color-bg-dark)] text-white">
      <div className="max-w-[1480px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="order-2 lg:order-1 max-w-[460px] reveal">
          <div className="ed-eyebrow text-white/55 mb-6">Jewelry</div>
          <h2 className="ed-h2 text-white max-w-[14ch]">
            Modern pieces from Moroccan form.
          </h2>
          <p className="ed-body-lg mt-7 max-w-[40ch] text-white/75">
            Sterling silver, hand-finished. Metalwork, symbol, and line —
            distilled from the Maghreb craft tradition into pieces made for
            today.
          </p>
          <div className="mt-10">
            <Link
              href="/products?category=Jewelry"
              className="ed-cta-light"
            >
              See the Jewelry
            </Link>
          </div>
        </div>

        <div className="order-1 lg:order-2 relative aspect-square lg:aspect-[4/5] overflow-hidden bg-[var(--color-bg-dark-soft)]">
          {JEWELRY_HERO ? (
            <Image
              src={JEWELRY_HERO}
              alt="Nitra jewelry"
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
