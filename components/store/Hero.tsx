"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocalizedHref, useT } from "@/lib/i18n-client";

// Curated still hero rotation. Keep the opening read controlled: visible object,
// Marrakech atmosphere, text-safe zones. Video moves lower on the page.

type Photo = { kind: "photo"; src: string; alt: string; objectPos?: string };
type Slide = Photo;

const SLIDES: Slide[] = [
  {
    kind: "photo",
    src: "/brand/hero/home-hero-2-couple-atelier.webp",
    alt: "Cognac leather bag in a sunlit Marrakech atelier with artisans behind it",
    objectPos: "center 48%",
  },
  {
    kind: "photo",
    src: "/brand/hero/home-hero-4-pool-tote.webp",
    alt: "Cognac leather tote beside still water in a restrained Marrakech courtyard",
    objectPos: "center 52%",
  },
  {
    kind: "photo",
    src: "/brand/hero/home-hero-5-courtyard-walk.webp",
    alt: "Maison Tanneurs cognac bag on a pale courtyard plinth as a woman walks through arches",
  },
];

const PHOTO_HOLD_MS = 6500;

export default function Hero() {
  const t = useT();
  const href = useLocalizedHref();
  const [idx, setIdx] = useState(0);
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = () => setReducedMotion(mediaQuery.matches);
    updateReducedMotion();
    mediaQuery.addEventListener("change", updateReducedMotion);
    return () => mediaQuery.removeEventListener("change", updateReducedMotion);
  }, []);

  // Advance the curated stills slowly. Reduced-motion users keep the opener.
  useEffect(() => {
    if (reducedMotion !== false) return;
    const timer = window.setTimeout(
      () => setIdx((i) => (i + 1) % SLIDES.length),
      PHOTO_HOLD_MS,
    );
    return () => window.clearTimeout(timer);
  }, [idx, reducedMotion]);

  return (
    <section
      id="top"
      className="relative w-full min-h-[100svh] overflow-hidden"
      style={{ background: "var(--color-warm-black)", color: "#ffffff" }}
      aria-label="Maison Tanneurs — hand-stitched leather from Marrakech"
    >
      {/* Media stack — all slides mounted, only active opacity:1 */}
      <div className="absolute inset-0">
        {SLIDES.map((s, i) => (
          <div
            key={s.src}
            className="absolute inset-0 transition-opacity"
            style={{
              opacity: i === idx ? 1 : 0,
              transitionDuration: "1100ms",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            aria-hidden={i !== idx}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: s.objectPos ?? "center 46%" }}
            />
          </div>
        ))}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(20,18,16,0.36) 0%, rgba(20,18,16,0.08) 32%, rgba(20,18,16,0) 58%), linear-gradient(to top, rgba(20,18,16,0.62) 0%, rgba(20,18,16,0.18) 38%, rgba(20,18,16,0) 68%)",
          }}
        />
      </div>

      {/* Headline block — bottom-left */}
      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-6 md:px-12 pb-36 sm:pb-28 md:pb-20">
        <div className="max-w-[1400px]">
          <p
            className="mb-8"
            style={{
              color: "rgba(255,255,255,0.78)",
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
            }}
          >
            {t("hero.kicker")}
          </p>

          <h1
            style={{
              color: "#ffffff",
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(46px, 10.8vw, 168px)",
              letterSpacing: "-0.02em",
              lineHeight: 0.95,
              margin: 0,
              textWrap: "balance",
            }}
          >
            Maison Tanneurs<span style={{ opacity: 0.45 }}>.</span>
          </h1>

          <p
            className="mt-8"
            style={{
              color: "rgba(255,255,255,0.88)",
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(16px, 1.4vw, 20px)",
              lineHeight: 1.5,
              letterSpacing: "0.005em",
              maxWidth: "56ch",
            }}
          >
            {t("hero.copy")}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href={href("/products")}
              className="inline-flex items-center gap-3 transition-opacity hover:opacity-85"
              style={{
                background: "#ffffff",
                color: "var(--color-ink)",
                borderRadius: 0,
                padding: "16px 32px",
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                letterSpacing: "0.02em",
              }}
            >
              {t("hero.primary")}
            </Link>
            <Link
              href={href("/about")}
              className="inline-flex items-center gap-3 transition-opacity hover:opacity-70"
              style={{
                color: "#ffffff",
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                letterSpacing: "0.02em",
                padding: "16px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.55)",
              }}
            >
              {t("hero.secondary")}
            </Link>
          </div>
        </div>
      </div>

      {/* Slide indicators — bottom right, tiny bars */}
      <div
        className="absolute right-8 bottom-8 z-10 hidden md:flex items-center gap-1.5"
        aria-hidden
      >
        {SLIDES.map((_, i) => (
          <span
            key={i}
            className="block h-px transition-all"
            style={{
              width: i === idx ? "24px" : "12px",
              background: i === idx ? "#ffffff" : "rgba(255,255,255,0.4)",
              transitionDuration: "500ms",
            }}
          />
        ))}
      </div>
    </section>
  );
}
