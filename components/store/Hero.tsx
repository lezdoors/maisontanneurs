import Image from "next/image";
import Link from "next/link";

// Swap point: when the Drop 01 hero WebP lands, set this to the public path.
// While null, renders the warm editorial gradient placeholder.
// See docs/brand/HF-PROMPTS-DROP-01.md prompt #1 for what to generate.
const HERO_IMAGE: string | null = "/hero/featured-drop-v2.webp";

export default function Hero() {
  const hasImage = HERO_IMAGE !== null;

  return (
    <section
      className="relative flex items-end overflow-hidden"
      style={{
        minHeight: "100svh",
        background: hasImage
          ? undefined
          : "linear-gradient(180deg, #f0e6d2 0%, #e8dcc2 28%, #d9c8a3 52%, #b59874 80%, #5c4530 100%)",
      }}
    >
      {hasImage && (
        <Image
          src={HERO_IMAGE as string}
          alt="Kechken Drop 01"
          fill
          priority
          sizes="100vw"
          className="object-cover kenburns"
        />
      )}

      {/* Subtle vignette to lift text contrast */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 45%, rgba(28,26,24,0.22) 100%)",
        }}
      />

      <div
        className="relative w-full"
        style={{
          paddingLeft: "clamp(20px, 5vw, 80px)",
          paddingRight: "clamp(20px, 5vw, 80px)",
          paddingTop: "clamp(120px, 15vw, 200px)",
          paddingBottom: "clamp(60px, 8vw, 120px)",
        }}
      >
        <div className="max-w-[1600px] mx-auto">
          <div className="ed-eyebrow mb-6 text-[var(--color-ink-soft)]">
            Drop 01 · June 2026
          </div>

          <h1 className="ed-display max-w-[12ch] text-[var(--color-ink)]">
            kechken.
          </h1>

          <p
            className="mt-8 max-w-[36ch] font-sans font-light uppercase text-[var(--color-ink-soft)]"
            style={{ fontSize: "clamp(13px, 1.1vw, 16px)", letterSpacing: "0.18em" }}
          >
            Modern Moroccan Identity
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-start gap-5">
            <Link href="#drop" className="ed-cta">
              Shop the Drop
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
