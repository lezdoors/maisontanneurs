import Image from "next/image";
import Link from "next/link";

const HERO_IMAGE = "/brand/hero/home-hero.webp";
const HEADLINE = "Hand-shaped in Morocco.";

export default function Hero() {
  const words = HEADLINE.split(" ");
  return (
    <section
      className="relative isolate overflow-hidden bg-[color:var(--color-paper)] w-full mt-frame mt-frame--right"
      style={{ minHeight: "640px" }}
    >
      <div className="relative grid grid-cols-1 lg:grid-cols-12">
        {/* Left rail — text on paper, Aether-style */}
        <div className="relative lg:col-span-5 lg:order-1 order-2 flex flex-col justify-end lg:justify-center bg-[color:var(--color-paper)]"
          style={{
            paddingLeft: "clamp(24px, 4vw, 64px)",
            paddingRight: "clamp(24px, 3vw, 56px)",
            paddingTop: "clamp(36px, 4vw, 72px)",
            paddingBottom: "clamp(48px, 5vw, 88px)",
            minHeight: "clamp(320px, 40vh, 480px)",
          }}>
          <div
            className="mb-6 uppercase"
            style={{
              fontSize: "11px",
              letterSpacing: "0.22em",
              fontWeight: 500,
              color: "var(--color-bronze)",
            }}
          >
            Drop 01 — June 2026
          </div>

          <h1
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: "clamp(38px, 4.6vw, 72px)",
              letterSpacing: "-0.018em",
              lineHeight: 1.04,
              color: "var(--color-ink)",
              margin: 0,
            }}
          >
            {words.map((word, i) => (
              <span
                key={`${word}-${i}`}
                className="mt-reveal-word"
                style={{
                  animationDelay: `${i * 90}ms`,
                  marginRight: i < words.length - 1 ? "0.28em" : 0,
                }}
              >
                {word}
              </span>
            ))}
          </h1>

          <p
            className="mt-6 max-w-[42ch]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "clamp(14px, 0.95vw, 16px)",
              lineHeight: 1.65,
              color: "var(--color-ink-soft)",
            }}
          >
            Full-grain leather, hand-stitched in a small Marrakech atelier.
            Shipped worldwide in three to five days.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-start gap-3">
            <Link href="#drop" className="mt-cta mt-cta--solid-dark">
              Shop the Drop
            </Link>
            <Link href="/about" className="mt-cta mt-cta--ghost-dark">
              The Atelier
            </Link>
          </div>
        </div>

        {/* Right photo panel — Aether-style chiaroscuro framed by hairline */}
        <div
          className="relative lg:col-span-7 lg:order-2 order-1 overflow-hidden bg-[color:var(--color-near-black)]"
          style={{ aspectRatio: "16 / 11", minHeight: "clamp(360px, 60vh, 720px)" }}
        >
          <Image
            src={HERO_IMAGE}
            alt="Maison Tanneurs Heritage Duffle in Marrakech courtyard"
            fill
            priority
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover"
            style={{ objectPosition: "center 45%" }}
          />
        </div>

        {/* Vertical rule between the two columns on lg+ */}
        <span
          aria-hidden
          className="hidden lg:block absolute top-0 bottom-0 mt-rule-v"
          style={{ left: "calc(5/12 * 100%)" }}
        />
      </div>
    </section>
  );
}
