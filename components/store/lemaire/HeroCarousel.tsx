"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type SlideLink = { label: string; href: string };
type Slide = {
  kind: "video" | "image";
  src: string;
  poster?: string;
  kicker: string;
  title: string;
  body: string;
  links: SlideLink[];
};

const SLIDES: Slide[] = [
  {
    kind: "video",
    src: "/film/hero-departure.mp4",
    poster: "/film/hero-departure-poster.jpg",
    kicker: "Le Départ · Film N° I",
    title: "Carried from the bench.",
    body: "An edition of full-grain leather, hand-cut and saddle-stitched in a small Marrakech atelier.",
    links: [
      { label: "Shop the Edition", href: "/products" },
      { label: "The Atelier", href: "/atelier" },
    ],
  },
  {
    kind: "image",
    src: "/lookbook/lookbook-medina-door.webp",
    kicker: "Marrakech · Atelier",
    title: "Made by one pair of hands.",
    body: "Cut, skived, saddle-stitched, edge-burnished and lined by the same artisan, start to finish.",
    links: [
      { label: "Savoir-Faire", href: "/savoir-faire" },
      { label: "The Atelier", href: "/atelier" },
    ],
  },
  {
    kind: "image",
    src: "/lookbook/lookbook-country.webp",
    kicker: "Voyage",
    title: "Objects, kept few.",
    body: "A tight collection built to travel — and to age into the shape of the person who carries it.",
    links: [{ label: "Shop the Edition", href: "/products" }],
  },
];

const AUTO_MS = 6500;
const EASE = "cubic-bezier(0.25,1,0.5,1)";

export default function HeroCarousel() {
  const [i, setI] = useState(0);
  const [reduced, setReduced] = useState(false);
  const pausedRef = useRef(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const next = useCallback(() => setI((v) => (v + 1) % SLIDES.length), []);
  const prev = useCallback(
    () => setI((v) => (v - 1 + SLIDES.length) % SLIDES.length),
    []
  );

  // prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // auto-advance (paused on hover / reduced-motion); resets on i change
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      if (!pausedRef.current) setI((v) => (v + 1) % SLIDES.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [i, reduced]);

  // only the active slide's video plays
  useEffect(() => {
    videoRefs.current.forEach((v, idx) => {
      if (!v) return;
      if (idx === i) {
        const p = v.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [i]);

  return (
    <section
      className="relative w-full min-h-[100svh] overflow-hidden bg-[#1C1A17]"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      aria-roledescription="carousel"
    >
      {SLIDES.map((slide, idx) => {
        const active = idx === i;
        return (
          <div
            key={idx}
            className="absolute inset-0"
            style={{
              opacity: active ? 1 : 0,
              transition: reduced
                ? "none"
                : `opacity 1200ms ${EASE}`,
              pointerEvents: active ? "auto" : "none",
            }}
            aria-hidden={!active}
          >
            {/* Media */}
            {slide.kind === "video" ? (
              <video
                ref={(el) => {
                  videoRefs.current[idx] = el;
                }}
                className="absolute inset-0 h-full w-full object-cover"
                poster={slide.poster}
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src={slide.src} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover"
              />
            )}

            {/* Scrim for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/20" />

            {/* Text block */}
            <div
              className="absolute bottom-[clamp(96px,16vh,160px)] left-[clamp(24px,6vw,96px)] max-w-[30ch] text-left"
              style={{
                color: "#F5EFE6",
                opacity: active ? 1 : 0,
                transform: active ? "translateY(0)" : "translateY(16px)",
                transition: reduced
                  ? "none"
                  : `opacity 900ms ${EASE} 120ms, transform 900ms ${EASE} 120ms`,
              }}
            >
              <p className="text-[9px] tracking-[0.3em] uppercase font-sans opacity-80">
                {slide.kicker}
              </p>
              <h1 className="font-display font-light text-[clamp(40px,6vw,84px)] leading-[1.02] mt-3">
                {slide.title}
              </h1>
              <p className="text-[13px] font-sans leading-relaxed opacity-85 mt-4 max-w-[42ch]">
                {slide.body}
              </p>
              <div className="mt-6 flex gap-6">
                {slide.links.map((l) => (
                  <Link
                    key={l.href + l.label}
                    href={l.href}
                    tabIndex={active ? 0 : -1}
                    className="text-[10px] tracking-[0.25em] uppercase font-sans border-b border-white/50 pb-1 hover:opacity-70 transition-opacity"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* Prev / Next arrows */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-[clamp(12px,3vw,40px)] top-1/2 -translate-y-1/2 h-12 w-12 flex items-center justify-center text-[#F5EFE6] text-3xl leading-none opacity-70 hover:opacity-100 transition-opacity z-10"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-[clamp(12px,3vw,40px)] top-1/2 -translate-y-1/2 h-12 w-12 flex items-center justify-center text-[#F5EFE6] text-3xl leading-none opacity-70 hover:opacity-100 transition-opacity z-10"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-[clamp(40px,7vh,72px)] left-[clamp(24px,6vw,96px)] flex gap-2 z-10">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setI(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            aria-current={idx === i}
            className={`h-[2px] w-6 transition-colors duration-500 ${
              idx === i ? "bg-[#F5EFE6]" : "bg-white/35"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
