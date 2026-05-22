import Image from "next/image";
import Link from "next/link";

// Hero asset lives in public/brand/hero/. Slug-named, 16:9 desktop, 4:5
// mobile. Until the new brand hero lands, falls back to the existing
// campaign still. Track gaps in MISSING-ASSETS.md.
const HERO_IMAGE = "/hero/hero-leather-campaign.webp"; // TODO: /brand/hero/home-hero.webp

export default function Hero() {
  return (
    <section
      className="relative isolate flex items-end overflow-hidden bg-[color:var(--color-charcoal)] w-full"
      style={{ height: "100svh", minHeight: "100svh" }}
    >
      <Image
        src={HERO_IMAGE}
        alt="Maison Tanneurs"
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: "center" }}
      />

      {/* Scrim — gradient across lower 60% per spec. Ensures legibility on
          any hero brightness without crushing the upper image. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-b from-transparent via-black/15 to-black/40 pointer-events-none"
      />

      <div
        className="relative w-full text-[color:var(--color-cream)]"
        style={{
          paddingLeft: "clamp(20px, 5vw, 80px)",
          paddingRight: "clamp(20px, 5vw, 80px)",
          paddingBottom: "clamp(56px, 8vw, 112px)",
        }}
      >
        <div className="max-w-[1600px] mx-auto">
          <div
            className="mb-6 uppercase"
            style={{
              fontSize: "clamp(11px, 0.85vw, 13px)",
              letterSpacing: "0.08em",
              fontWeight: 500,
              color: "rgba(245, 239, 229, 0.9)",
              textShadow: "0 0 6px rgba(0, 0, 0, 0.6)",
            }}
          >
            Drop 01 · June 2026
          </div>

          <h1
            className="max-w-[14ch]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 800,
              fontSize: "clamp(48px, 8vw, 128px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              textShadow: "0 0 6px rgba(0, 0, 0, 0.8)",
            }}
          >
            Hand-shaped in Morocco.
          </h1>

          <p
            className="mt-7 max-w-[52ch]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "clamp(15px, 1.05vw, 18px)",
              lineHeight: 1.55,
              color: "rgba(245, 239, 229, 0.85)",
              textShadow: "0 0 6px rgba(0, 0, 0, 0.7)",
            }}
          >
            Full-grain leather, hand-stitched in a small Marrakech atelier.
            Editorial silhouettes, French register, shipped worldwide in
            three to five days.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
            <Link href="#drop" className="mt-cta mt-cta--solid-light">
              Shop the Drop
            </Link>
            <Link href="/about" className="mt-cta mt-cta--ghost-light">
              The Atelier
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
