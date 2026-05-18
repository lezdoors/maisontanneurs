import Image from "next/image";
import Link from "next/link";

// Swap point: when the Drop 01 hero WebP lands, set this to the public path.
// While null, renders the warm-light gradient placeholder.
// See docs/brand/HF-PROMPTS-DROP-01.md prompt #1 for what to generate.
const HERO_IMAGE: string | null = null;

export default function Hero() {
  const hasImage = HERO_IMAGE !== null;

  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-[var(--color-bg)]">
      {hasImage ? (
        <Image
          src={HERO_IMAGE as string}
          alt="Nitra Drop 01"
          fill
          priority
          sizes="100vw"
          className="object-cover -z-10"
        />
      ) : (
        // Warm editorial gradient placeholder — references the Everline mood
        // (golden-hour key from camera-right, deep amber shadow on the left).
        // See docs/brand/PHOTOGRAPHY-REFERENCE.md.
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at 78% 38%, #f0e4d2 0%, #ecd9bb 22%, #e3c89e 42%, #2a1e16 95%)",
          }}
        />
      )}

      {/* Brass hairline at top */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-[var(--color-brass)] opacity-60"
      />

      <div
        className={`max-w-[1280px] w-full mx-auto px-6 md:px-12 py-32 md:py-44 ${
          hasImage ? "text-white" : "text-[var(--color-ink)]"
        }`}
      >
        <div className="max-w-[640px]">
          <div
            className={`rb-eyebrow mb-8 ${
              hasImage ? "text-white/80" : ""
            }`}
          >
            Drop 01 · June 2026
          </div>

          <h1
            className={`font-sans font-light tracking-[-0.012em] leading-[1.02] text-[clamp(44px,7.5vw,96px)] ${
              hasImage ? "text-white" : "text-[var(--color-ink)]"
            }`}
          >
            Clothing rooted
            <br />
            in the Maghreb.
          </h1>

          <p
            className={`serif-body italic mt-9 max-w-[42ch] ${
              hasImage ? "text-white/85" : "text-[var(--color-ink-soft)]"
            }`}
          >
            Hand-painted figurative graphics on heavyweight cotton. A clothing
            label born of Moroccan visual tradition — made for now, made for
            the world.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-start gap-5">
            <Link
              href="#drop"
              className={
                hasImage
                  ? "inline-flex items-center justify-center font-sans text-[12px] font-medium tracking-[0.1em] uppercase px-7 py-3.5 bg-white text-[var(--color-ink)] hover:bg-[var(--color-bg-alt)] transition"
                  : "rb-cta"
              }
            >
              See Drop 01
            </Link>
            <Link
              href="mailto:hello@nitra.com?subject=Nitra%20list"
              className={
                hasImage
                  ? "inline-flex items-center justify-center font-sans text-[12px] font-medium tracking-[0.1em] uppercase px-7 py-3.5 bg-transparent text-white border border-white hover:bg-white hover:text-[var(--color-ink)] transition"
                  : "rb-cta-outline"
              }
            >
              Join the list
            </Link>
          </div>

          <div
            className={`rb-meta mt-16 ${
              hasImage ? "text-white/65" : "text-[var(--color-mineral)]"
            }`}
          >
            Ships from US · POD-fulfilled · Worldwide delivery
          </div>
        </div>
      </div>
    </section>
  );
}
