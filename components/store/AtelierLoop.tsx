// Aether "Engineered For Performance" pattern — half/half, video left, copy right.
// Replaces the old full-bleed video block for the airy Aether register.

import Link from "next/link";

export default function AtelierLoop() {
  return (
    <section
      className="w-full"
      style={{
        background: "#FFFFFF",
        borderTop: "1px solid #E5E5E5",
        borderBottom: "1px solid #E5E5E5",
      }}
      aria-label="Maison film — the atelier in motion"
    >
      <div
        className="mx-auto grid grid-cols-1 lg:grid-cols-2 items-center"
        style={{
          maxWidth: "1600px",
          paddingLeft: "clamp(16px, 3vw, 32px)",
          paddingRight: "clamp(16px, 3vw, 32px)",
          paddingTop: "clamp(48px, 7vw, 96px)",
          paddingBottom: "clamp(48px, 7vw, 96px)",
          gap: "clamp(28px, 4vw, 64px)",
        }}
      >
        {/* Video */}
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: "1100 / 620", background: "#F9F9F9" }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/brand/hero/home-hero-3-woman-arches.webp"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/atelier-loop.webm" type="video/webm" />
            <source src="/videos/atelier-loop.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Copy */}
        <div className="max-w-[44ch]">
          <div
            className="uppercase"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              letterSpacing: "0.18em",
              fontWeight: 500,
              color: "#8C4A26",
              marginBottom: "20px",
            }}
          >
            Maison Film
          </div>
          <h2
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "clamp(32px, 3.6vw, 56px)",
              letterSpacing: "-0.03em",
              lineHeight: 1.04,
              color: "#0F0F0F",
              margin: 0,
            }}
          >
            Engineered for daily wear.
          </h2>
          <p
            style={{
              marginTop: "20px",
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: 1.65,
              color: "#0F0F0F",
              opacity: 0.78,
            }}
          >
            Full-grain leather softens into your shape over weeks, then patinas
            warm over years. Saddle-stitched seams that outlast machine work,
            brass hardware that ages without flaking. Built to be worn — never
            stored.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center rounded-full mt-7"
            style={{
              background: "transparent",
              color: "#0F0F0F",
              padding: "13px 27px",
              border: "1px solid #0F0F0F",
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Explore the House
          </Link>
        </div>
      </div>
    </section>
  );
}
