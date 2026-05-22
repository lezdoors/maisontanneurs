"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface CrossFadeShowcaseProps {
  eyebrow?: string;
  headline: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  images: { src: string; alt: string }[];
  /** ms between auto-advance. Default 4800. */
  interval?: number;
  /** Photo side at lg+. Default "left". */
  photoSide?: "left" | "right";
}

export default function CrossFadeShowcase({
  eyebrow,
  headline,
  body,
  ctaLabel,
  ctaHref,
  images,
  interval = 4800,
  photoSide = "left",
}: CrossFadeShowcaseProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % images.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [images.length, interval]);

  const photoOrder = photoSide === "right" ? "lg:order-2" : "lg:order-1";
  const textOrder = photoSide === "right" ? "lg:order-1" : "lg:order-2";
  const frameSide = photoSide === "right" ? "mt-frame--right" : "mt-frame--left";

  return (
    <section
      className={`relative mt-frame ${frameSide}`}
      style={{ background: "var(--color-paper)" }}
    >
      <div className="relative grid grid-cols-1 lg:grid-cols-2">
        <div
          className={`relative ${photoOrder} mt-xfade overflow-hidden`}
          style={{
            aspectRatio: "4 / 5",
            minHeight: "clamp(360px, 50vh, 640px)",
          }}
        >
          {images.map((img, i) => (
            <div
              key={img.src}
              className={`mt-xfade__slide ${i === active ? "is-active" : ""}`}
              aria-hidden={i !== active}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}
          {images.length > 1 && (
            <div className="mt-xfade__dots" role="tablist" aria-label="Showcase pagination">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`mt-xfade__dot ${i === active ? "is-active" : ""}`}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={i === active}
                  onClick={() => setActive(i)}
                />
              ))}
            </div>
          )}
        </div>

        <div
          className={`relative ${textOrder} flex flex-col justify-center`}
          style={{
            background: "var(--color-paper)",
            paddingLeft: "clamp(24px, 5vw, 88px)",
            paddingRight: "clamp(24px, 4vw, 64px)",
            paddingTop: "clamp(56px, 7vw, 120px)",
            paddingBottom: "clamp(56px, 7vw, 120px)",
          }}
        >
          {eyebrow && (
            <div
              className="mb-5 uppercase"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                letterSpacing: "0.22em",
                fontWeight: 500,
                color: "var(--color-bronze)",
              }}
            >
              {eyebrow}
            </div>
          )}
          <h2
            className="max-w-[18ch]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: "clamp(32px, 3.8vw, 56px)",
              letterSpacing: "-0.015em",
              lineHeight: 1.05,
              color: "var(--color-ink)",
              margin: 0,
            }}
          >
            {headline}
          </h2>
          <p
            className="mt-6 max-w-[44ch]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: 1.65,
              color: "var(--color-ink-soft)",
            }}
          >
            {body}
          </p>
          <div className="mt-8">
            <Link href={ctaHref} className="mt-cta mt-cta--ghost-dark">
              {ctaLabel}
            </Link>
          </div>
        </div>

        <span
          aria-hidden
          className="hidden lg:block absolute top-0 bottom-0 mt-rule-v"
          style={{ left: "50%" }}
        />
      </div>
    </section>
  );
}
