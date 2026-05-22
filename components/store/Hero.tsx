import Image from "next/image";
import Link from "next/link";

const HERO_IMAGE = "/brand/hero/home-hero.webp";

export default function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden bg-[color:var(--color-near-black)] w-full"
      style={{ height: "92svh", minHeight: "640px" }}
    >
      <Image
        src={HERO_IMAGE}
        alt="Maison Tanneurs Heritage Duffle"
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: "center 42%" }}
      />

      {/* Bottom scrim — keep restrained, just enough to seat the small
          text block at bottom-left. No heavy washes. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[40%] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.45) 100%)",
        }}
      />

      {/* Editorial block, bottom-left, restrained — bag is the hero, not the type */}
      <div
        className="absolute inset-x-0 bottom-0 text-[color:var(--color-ivory)]"
        style={{
          paddingLeft: "clamp(24px, 5vw, 80px)",
          paddingRight: "clamp(24px, 5vw, 80px)",
          paddingBottom: "clamp(40px, 5vw, 72px)",
        }}
      >
        <div className="max-w-[1600px] mx-auto">
          <div
            className="mb-4 uppercase"
            style={{
              fontSize: "11px",
              letterSpacing: "0.22em",
              fontWeight: 500,
              color: "rgba(245, 239, 230, 0.78)",
            }}
          >
            Drop 01 — June 2026
          </div>

          <h1
            className="max-w-[18ch]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: "clamp(28px, 3.4vw, 56px)",
              letterSpacing: "-0.01em",
              lineHeight: 1.08,
              color: "var(--color-ivory)",
            }}
          >
            Hand-shaped in Morocco.
          </h1>

          <p
            className="mt-5 max-w-[46ch]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "clamp(13px, 0.95vw, 15px)",
              lineHeight: 1.6,
              color: "rgba(245, 239, 230, 0.78)",
            }}
          >
            Full-grain leather, hand-stitched in a small Marrakech atelier.
            Shipped worldwide in three to five days.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row items-start gap-3">
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
