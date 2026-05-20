import Image from "next/image";
import Link from "next/link";

const HERO_IMAGE = "/hero/hero-kechken-atelier.webp";

export default function Hero() {
  return (
    <section
      className="relative flex items-end overflow-hidden bg-[#0e0d0c]"
      style={{ minHeight: "100svh" }}
    >
      <Image
        src={HERO_IMAGE}
        alt="Kechken Drop 01"
        fill
        priority
        sizes="100vw"
        className="object-cover kenburns"
      />

      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[180px] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,7,6,0.78) 0%, rgba(8,7,6,0.55) 45%, rgba(8,7,6,0) 100%)",
        }}
      />

      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-[58%] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(8,7,6,0.72) 0%, rgba(8,7,6,0.45) 45%, rgba(8,7,6,0) 100%)",
        }}
      />

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[360px] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,7,6,0) 0%, rgba(8,7,6,0.4) 45%, rgba(8,7,6,0.85) 100%)",
        }}
      />

      <div
        className="relative w-full text-[#f5f4f1]"
        style={{
          paddingLeft: "clamp(20px, 5vw, 80px)",
          paddingRight: "clamp(20px, 5vw, 80px)",
          paddingTop: "clamp(120px, 15vw, 200px)",
          paddingBottom: "clamp(60px, 8vw, 120px)",
        }}
      >
        <div className="max-w-[1600px] mx-auto">
          <div
            className="mb-6 uppercase"
            style={{
              fontSize: "clamp(10px, 0.85vw, 12px)",
              letterSpacing: "0.32em",
              color: "rgba(245,244,241,0.82)",
            }}
          >
            Drop 01 · June 2026
          </div>

          <h1
            className="font-serif max-w-[14ch] leading-[0.92]"
            style={{
              fontFamily:
                "var(--font-serif, 'Cormorant Garamond', 'Times New Roman', serif)",
              fontSize: "clamp(60px, 10vw, 168px)",
              letterSpacing: "-0.015em",
              fontWeight: 500,
              textShadow: "0 2px 24px rgba(0,0,0,0.4)",
            }}
          >
            Hand-shaped in Morocco.
          </h1>

          <p
            className="mt-8 max-w-[44ch] uppercase"
            style={{
              fontSize: "clamp(12px, 1vw, 14px)",
              letterSpacing: "0.22em",
              color: "rgba(245,244,241,0.85)",
            }}
          >
            Leather, jewelry, and heavyweight cotton — made by hand,
            shipped from Marrakech.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="#drop"
              className="inline-flex items-center bg-[#f5f4f1] text-[#0e0d0c] hover:bg-white transition-colors px-9 py-[18px] uppercase font-medium shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
              style={{ fontSize: "11px", letterSpacing: "0.22em" }}
            >
              Shop the Drop
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center text-[#f5f4f1] border border-[rgba(245,244,241,0.55)] px-9 py-[18px] uppercase font-medium hover:bg-[rgba(245,244,241,0.12)] transition-colors"
              style={{ fontSize: "11px", letterSpacing: "0.22em" }}
            >
              The Atelier
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
