"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const HEROES = [
  { src: "/brand/hero/home-hero-1-arches.webp", alt: "Heritage Duffle in Marrakech courtyard, sunset arches" },
  { src: "/brand/hero/home-hero-2-couple-atelier.webp", alt: "Cognac duffle in the atelier" },
  { src: "/brand/hero/home-hero-3-woman-arches.webp", alt: "Cognac duffle with model in arched gallery" },
  { src: "/brand/hero/home-hero-4-pool-tote.webp", alt: "Tobacco tote at a Moroccan riad pool" },
];

const HEADLINE = "Hand-shaped in Morocco.";
const ROTATE_MS = 6000;

export default function Hero() {
  const [active, setActive] = useState(0);
  const words = HEADLINE.split(" ");

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % HEROES.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      className="relative isolate overflow-hidden bg-[color:var(--color-near-black)] w-full mt-frame mt-frame--right mt-frame--on-dark"
      style={{ height: "92svh", minHeight: "640px" }}
    >
      {/* Rotating photo stack */}
      <div className="mt-hero-rotator">
        {HEROES.map((h, i) => (
          <div
            key={h.src}
            className={`mt-hero-rotator__slide ${i === active ? "is-active" : ""}`}
            aria-hidden={i !== active}
          >
            <Image
              src={h.src}
              alt={h.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "center 46%" }}
            />
          </div>
        ))}
      </div>

      {/* Subtle bottom scrim so the text panel reads on any of the four shots */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 pointer-events-none z-[1]"
        style={{
          height: "55%",
          background:
            "linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.18) 45%, rgba(10,10,10,0.62) 100%)",
        }}
      />

      {/* Top-left editorial block (Aether pattern) */}
      <div
        className="absolute inset-x-0 top-0 z-[2]"
        style={{
          paddingTop: "clamp(140px, 13vh, 200px)",
          paddingLeft: "clamp(24px, 5vw, 80px)",
          paddingRight: "clamp(24px, 5vw, 80px)",
        }}
      >
        <div className="max-w-[1600px] mx-auto">
          <div
            className="mb-5 uppercase"
            style={{
              fontSize: "11px",
              letterSpacing: "0.22em",
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.78)",
            }}
          >
            Drop 01 — June 2026
          </div>
          <h1
            className="max-w-[14ch]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: "clamp(44px, 5.4vw, 88px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.02,
              color: "#ffffff",
              margin: 0,
              textShadow: "0 1px 32px rgba(0,0,0,0.18)",
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
        </div>
      </div>

      {/* Bottom-left CTAs */}
      <div
        className="absolute inset-x-0 bottom-0 z-[2]"
        style={{
          paddingLeft: "clamp(24px, 5vw, 80px)",
          paddingRight: "clamp(24px, 5vw, 80px)",
          paddingBottom: "clamp(36px, 5vh, 72px)",
        }}
      >
        <div className="max-w-[1600px] mx-auto">
          <p
            className="max-w-[42ch] mb-7"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "clamp(13px, 0.95vw, 15px)",
              lineHeight: 1.6,
              color: "rgba(255, 255, 255, 0.86)",
            }}
          >
            Full-grain leather, hand-stitched in a small Marrakech atelier.
            Shipped worldwide in three to five days.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <Link href="#drop" className="mt-cta mt-cta--solid-light">
              Shop the Drop
            </Link>
            <Link href="/about" className="mt-cta mt-cta--ghost-light">
              The Atelier
            </Link>
          </div>

          {/* Pagination dots — Aether-style cluster bottom-right */}
          <div className="absolute right-[clamp(24px,5vw,80px)] bottom-[clamp(36px,5vh,72px)] hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-black/35 backdrop-blur-sm">
            {HEROES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show hero ${i + 1}`}
                aria-current={i === active}
                className="block w-1.5 h-1.5 rounded-full transition-colors"
                style={{
                  background:
                    i === active ? "#ffffff" : "rgba(255,255,255,0.4)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
