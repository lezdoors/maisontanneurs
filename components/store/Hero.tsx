"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocalizedHref, useT } from "@/lib/i18n-client";

// Mixed-media hero rotation. Photos hold for ~6s each, videos play in full.
// Sequence opens cinematic, then moves through model-led editorial stills.

type Photo = { kind: "photo"; src: string; alt: string; objectPos?: string };
type Video = { kind: "video"; src: string; alt: string; poster: string };
type Slide = Photo | Video;

const SLIDES: Slide[] = [
  {
    kind: "video",
    src: "/videos/hero-cinematic-1-dunes.mp4",
    poster: "/brand/editorial/cinematic-bag-still.webp",
    alt: "Cognac bag on Marrakech dunes, golden hour",
  },
  {
    kind: "video",
    src: "/videos/hero-cinematic-2-paris.mp4",
    poster: "/brand/editorial/model-paris-night.webp",
    alt: "Model with bag walking Parisian cobblestones at blue hour",
  },
  {
    kind: "photo",
    src: "/brand/hero/home-hero-model-red-kilim.webp",
    alt: "Model with red kilim leather bag, Maison Tanneurs signature",
  },
  {
    kind: "photo",
    src: "/brand/hero/home-hero-black-woman-caftan.webp",
    alt: "Tall Black woman in cream caftan with cognac duffle, golden-hour Marrakech",
  },
  {
    kind: "photo",
    src: "/brand/hero/home-hero-black-man-leaning.webp",
    alt: "Black man in tailored cream, noir-leather bag, editorial light",
  },
];

const PHOTO_HOLD_MS = 6500;

export default function Hero() {
  const t = useT();
  const href = useLocalizedHref();
  const [idx, setIdx] = useState(0);
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = () => setReducedMotion(mediaQuery.matches);
    updateReducedMotion();
    mediaQuery.addEventListener("change", updateReducedMotion);
    return () => mediaQuery.removeEventListener("change", updateReducedMotion);
  }, []);

  // Advance based on slide type — photos use a timer, videos use 'ended'.
  useEffect(() => {
    if (reducedMotion !== false) return;
    const slide = SLIDES[idx];
    if (slide.kind === "photo") {
      timer.current = window.setTimeout(
        () => setIdx((i) => (i + 1) % SLIDES.length),
        PHOTO_HOLD_MS,
      );
      return () => {
        if (timer.current) window.clearTimeout(timer.current);
      };
    }
    // Video: play, advance on ended.
    const v = videoRefs.current[idx];
    if (v) {
      v.currentTime = 0;
      v.muted = true;
      v.playsInline = true;
      v.play().catch(() => undefined);
      const onEnd = () => setIdx((i) => (i + 1) % SLIDES.length);
      v.addEventListener("ended", onEnd);
      // Hard safety: if video stalls or doesn't fire 'ended', advance after 10s.
      timer.current = window.setTimeout(() => onEnd(), 10_000);
      return () => {
        v.removeEventListener("ended", onEnd);
        if (timer.current) window.clearTimeout(timer.current);
      };
    }
  }, [idx, reducedMotion]);

  return (
    <section
      id="top"
      className="relative w-full min-h-[100svh] overflow-hidden"
      style={{ background: "var(--color-warm-black)", color: "#ffffff" }}
      aria-label="Maison Tanneurs — hand-stitched leather, Marrakech to Paris"
    >
      {/* Media stack — all slides mounted, only active opacity:1 */}
      <div className="absolute inset-0">
        {SLIDES.map((s, i) => (
          <div
            key={s.src}
            className={`absolute inset-0 transition-opacity ${i === 0 ? "mt-hero-media-reveal" : ""}`}
            style={{
              opacity: i === idx ? 1 : 0,
              transitionDuration: "1100ms",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            aria-hidden={i !== idx}
          >
            {s.kind === "photo" ? (
              <Image
                src={s.src}
                alt={s.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: s.objectPos ?? "center 46%" }}
              />
            ) : (
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                className="absolute inset-0 w-full h-full object-cover"
                src={s.src}
                preload={i === idx ? "metadata" : "none"}
                poster={s.poster}
                playsInline
                muted
                aria-hidden
              />
            )}
          </div>
        ))}
        <div
          aria-hidden
          className="mt-hero-overlay-reveal absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(20,18,16,0.55) 0%, rgba(20,18,16,0.15) 38%, rgba(20,18,16,0) 65%)",
          }}
        />
      </div>

      {/* Headline block — bottom-left */}
      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-6 md:px-12 pb-36 sm:pb-28 md:pb-20">
        <div className="max-w-[1400px]">
          <p
            className="mt-hero-copy-reveal mb-8"
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
            className="mt-hero-title-reveal"
            style={{
              color: "#ffffff",
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(40px, 10.5vw, 160px)",
              letterSpacing: "-0.02em",
              lineHeight: 0.95,
              margin: 0,
              textWrap: "balance",
            }}
          >
            Maison
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> </span>
            Tanneurs<span style={{ opacity: 0.45 }}>.</span>
          </h1>

          <p
            className="mt-hero-copy-reveal mt-8"
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

          <div className="mt-hero-cta-reveal mt-10 flex flex-wrap items-center gap-3">
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
