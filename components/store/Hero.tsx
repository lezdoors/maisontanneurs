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

const HEADLINE = "Field-Tested in Morocco.\nBuilt For Anywhere.";
const ROTATE_MS = 6000;

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % HEROES.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      className="relative isolate overflow-hidden w-full"
      style={{
        height: "92svh",
        minHeight: "640px",
        background: "#ffffff",
        borderBottom: "1px solid #E5E5E5",
      }}
      aria-label="Hero"
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

      {/* Aether-style light wash — desaturates + lifts the photo so dark type reads */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.30) 38%, rgba(255,255,255,0.20) 100%)",
        }}
      />

      {/* Top-left editorial block */}
      <div
        className="absolute inset-x-0 top-0 z-[2]"
        style={{
          paddingTop: "clamp(140px, 13vh, 200px)",
          paddingLeft: "clamp(24px, 5vw, 80px)",
          paddingRight: "clamp(24px, 5vw, 80px)",
        }}
      >
        <div className="max-w-[1600px] mx-auto">
          <h1
            className="max-w-[16ch]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "clamp(48px, 6vw, 104px)",
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
              color: "#0F0F0F",
              margin: 0,
              whiteSpace: "pre-line",
            }}
          >
            {HEADLINE}
          </h1>
          <p
            className="max-w-[42ch]"
            style={{
              marginTop: "clamp(20px, 2.2vh, 32px)",
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "clamp(14px, 1vw, 16px)",
              lineHeight: 1.55,
              color: "#0F0F0F",
              opacity: 0.78,
            }}
          >
            Hand-cut full-grain leather, saddle-stitched in a small Marrakech atelier. Shipped worldwide in three to five days.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-3 mt-7">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full transition-colors"
              style={{
                background: "#0F0F0F",
                color: "#FFFFFF",
                padding: "14px 28px",
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Shop the Drop
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full transition-colors"
              style={{
                background: "transparent",
                color: "#0F0F0F",
                padding: "13px 27px",
                border: "1px solid #0F0F0F",
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              The Atelier
            </Link>
          </div>
        </div>
      </div>

      {/* Pagination dots — Aether-style cluster bottom-right */}
      <div
        className="absolute right-[clamp(24px,5vw,80px)] bottom-[clamp(36px,5vh,72px)] z-[2] hidden md:flex items-center gap-2 px-3 py-2 rounded-full"
        style={{ background: "rgba(255,255,255,0.78)", border: "1px solid #E5E5E5" }}
      >
        {HEROES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show hero ${i + 1}`}
            aria-current={i === active}
            className="block w-1.5 h-1.5 rounded-full transition-colors"
            style={{ background: i === active ? "#0F0F0F" : "rgba(15,15,15,0.30)" }}
          />
        ))}
      </div>
    </section>
  );
}
