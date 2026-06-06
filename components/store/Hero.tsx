"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLocalizedHref, useT } from "@/lib/i18n-client";

type Slide =
  | {
      kind: "image";
      src: string;
      alt: string;
      durationMs: number;
      objectPos: string;
      mobileObjectPos?: string;
    }
  | {
      kind: "video";
      src: string;
      poster: string;
      alt: string;
      durationMs: number;
      objectPos: string;
      mobileObjectPos?: string;
    };

const SLIDES: Slide[] = [
  {
    kind: "image",
    src: "/brand/hero/mt-hero-train.webp",
    alt: "Atop the Marrakech Express — model with cognac shoulder bag against the Atlas sky",
    durationMs: 7000,
    objectPos: "50% 30%",
    mobileObjectPos: "74% 42%",
  },
  {
    kind: "video",
    src: "/videos/mt-hero-medina.mp4",
    poster: "/videos/mt-hero-medina-poster.jpg",
    alt: "Traveler in white linen walking the dunes with a cognac bag at golden hour",
    durationMs: 8000,
    objectPos: "50% 40%",
  },
  {
    kind: "image",
    src: "/brand/hero/mt-hero-berber.webp",
    alt: "Berber traveler in indigo on the dune crest, cognac briefcase at sundown",
    durationMs: 7000,
    objectPos: "50% 50%",
  },
];

const FADE_MS = 900;

export default function Hero() {
  const t = useT();
  const href = useLocalizedHref();
  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const duration = SLIDES[index].durationMs;
    const id = window.setTimeout(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, duration);
    return () => window.clearTimeout(id);
  }, [index]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (SLIDES[index].kind === "video") {
      v.currentTime = 0;
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } else {
      v.pause();
    }
  }, [index]);

  return (
    <section
      id="top"
      className="relative w-full min-h-[100svh] overflow-hidden bg-[#1a0e07] text-white"
      aria-label="Maison Tanneurs — hand-stitched leather, Marrakech to the road"
    >
      <div className="absolute inset-0">
        {SLIDES.map((slide, i) => {
          const active = i === index;
          const style = {
            opacity: active ? 1 : 0,
            transition: `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            "--hero-object-position": slide.mobileObjectPos ?? slide.objectPos,
            "--hero-object-position-desktop": slide.objectPos,
          } as React.CSSProperties;
          if (slide.kind === "image") {
            return (
              <Image
                key={slide.src}
                src={slide.src}
                alt={slide.alt}
                fill
                priority={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                sizes="100vw"
                className="absolute inset-0 object-cover [object-position:var(--hero-object-position)] md:[object-position:var(--hero-object-position-desktop)]"
                style={style}
              />
            );
          }
          return (
            <video
              key={slide.src}
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover [object-position:var(--hero-object-position)] md:[object-position:var(--hero-object-position-desktop)]"
              style={style}
              poster={slide.poster}
              preload="metadata"
              muted
              loop
              playsInline
              aria-label={slide.alt}
            >
              <source src={slide.src} type="video/mp4" />
            </video>
          );
        })}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(5,5,4,0.55) 0%, rgba(5,5,4,0.18) 38%, rgba(5,5,4,0) 62%), linear-gradient(to top, rgba(5,5,4,0.48) 0%, rgba(5,5,4,0.14) 42%, rgba(5,5,4,0) 72%)",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-5 pb-[clamp(108px,15vh,160px)] pt-28 sm:px-8 md:px-12 md:pb-24">
        <div className="mx-auto w-full max-w-[1580px]">
          <div className="max-w-[min(820px,94vw)]">
            <h1
              className="max-w-[11ch]"
              style={{
                color: "#ffffff",
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "clamp(58px, 10vw, 148px)",
                letterSpacing: "-0.025em",
                lineHeight: 0.84,
                margin: 0,
                textWrap: "balance",
              }}
            >
              Carried from the bench.
            </h1>

            <p
              className="mt-8 max-w-[44ch]"
              style={{
                color: "rgba(255,255,255,0.88)",
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(17px, 1.45vw, 22px)",
                lineHeight: 1.4,
                letterSpacing: "0.005em",
              }}
            >
              {t("hero.copy")}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link href={href("/products")} className="mt-luxury-button mt-luxury-button--light">
                {t("hero.primary")}
              </Link>
              <Link href={href("/about")} className="mt-luxury-link text-white/82">
                {t("hero.secondary")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-5 z-10 px-6 text-center md:bottom-7"
        aria-hidden
      >
        <p
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Hand-stitched in Marrakech · DHL Express worldwide
        </p>
      </div>
    </section>
  );
}
