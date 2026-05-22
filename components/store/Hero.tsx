import Image from "next/image";
import Link from "next/link";

const HERO_IMAGE = "/brand/hero/home-hero.webp";

export default function Hero() {
  return (
    <section
      className="relative isolate flex items-end overflow-hidden bg-[color:var(--color-near-black)] w-full"
      style={{ height: "100svh", minHeight: "100svh" }}
    >
      <Image
        src={HERO_IMAGE}
        alt="Maison Tanneurs Heritage Duffle"
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: "center 38%" }}
      />

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[72%] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.35) 38%, rgba(10,10,10,0.82) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-[28%] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0) 100%)",
        }}
      />

      <div
        className="relative w-full text-[color:var(--color-ivory)]"
        style={{
          paddingLeft: "clamp(20px, 5vw, 80px)",
          paddingRight: "clamp(20px, 5vw, 80px)",
          paddingBottom: "clamp(64px, 9vw, 120px)",
        }}
      >
        <div className="max-w-[1600px] mx-auto">
          <div
            className="mb-7 uppercase"
            style={{
              fontSize: "clamp(11px, 0.85vw, 13px)",
              letterSpacing: "0.22em",
              fontWeight: 500,
              color: "var(--color-bronze)",
            }}
          >
            Drop 01 · June 2026
          </div>

          <h1
            className="max-w-[16ch]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: "clamp(54px, 8.8vw, 144px)",
              letterSpacing: "-0.005em",
              lineHeight: 1.04,
              color: "var(--color-ivory)",
            }}
          >
            Hand-shaped in Morocco.
          </h1>

          <p
            className="mt-7 max-w-[52ch]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "clamp(15px, 1.05vw, 17px)",
              lineHeight: 1.6,
              color: "rgba(245, 239, 230, 0.82)",
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
