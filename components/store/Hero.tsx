"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocalizedHref, useT } from "@/lib/i18n-client";

const HERO_VIDEO = "/videos/mt-departure-hero.mp4";
const HERO_POSTER = "/videos/mt-departure-hero-poster.jpg";
const HERO_PRODUCT = "/products/hero/atlas-weekender-cognac.webp";

const TRUST_ITEMS = [
  "DHL Express worldwide",
  "Marrakech atelier",
  "Numbered small batches",
  "Secure checkout",
];

const FIELD_NOTES = [
  ["Origin", "Marrakech"],
  ["Material", "Full-grain leather"],
  ["Finish", "Hand-cut · saddle-stitched"],
];

export default function Hero() {
  const t = useT();
  const href = useLocalizedHref();

  return (
    <section
      id="top"
      className="relative w-full min-h-[100svh] overflow-hidden bg-[#080807] text-white"
      aria-label="Maison Tanneurs — hand-stitched leather, Marrakech to the road"
    >
      <div className="absolute inset-0">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          poster={HERO_POSTER}
          preload="metadata"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(5,5,4,0.82) 0%, rgba(5,5,4,0.46) 42%, rgba(5,5,4,0.12) 68%, rgba(5,5,4,0.62) 100%), linear-gradient(to top, rgba(5,5,4,0.82) 0%, rgba(5,5,4,0.34) 42%, rgba(5,5,4,0.08) 72%)",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-5 pb-[clamp(132px,18vh,190px)] pt-28 sm:px-8 md:px-12 md:pb-28">
        <div className="mx-auto grid w-full max-w-[1580px] grid-cols-1 items-end gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="max-w-[min(820px,94vw)]">
            <div className="mb-8 flex flex-wrap items-center gap-3 text-white/72">
              <span className="h-px w-12 bg-white/55" aria-hidden />
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                }}
              >
                {t("hero.kicker")}
              </p>
            </div>

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

            <div className="mt-9 grid max-w-[820px] grid-cols-1 gap-8 md:grid-cols-[1fr_250px] md:items-end">
              <p
                style={{
                  color: "rgba(255,255,255,0.84)",
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "clamp(18px, 1.55vw, 24px)",
                  lineHeight: 1.42,
                  letterSpacing: "0.005em",
                  maxWidth: "46ch",
                }}
              >
                {t("hero.copy")}
              </p>

              <div className="hidden border-l border-white/24 pl-5 md:block">
                {FIELD_NOTES.map(([k, v]) => (
                  <div key={k} className="border-b border-white/13 py-3 last:border-b-0">
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">
                      {k}
                    </p>
                    <p className="mt-1 text-[13px] leading-tight text-white/84">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link href={href("/products")} className="mt-luxury-button mt-luxury-button--light">
                {t("hero.primary")}
              </Link>
              <Link href={href("/about")} className="mt-luxury-link text-white/90">
                {t("hero.secondary")}
              </Link>
            </div>
          </div>

          <Link
            href={href("/products/atlas-weekender-cognac")}
            className="group hidden border border-white/22 bg-white/[0.88] p-3 text-[var(--color-ink)] backdrop-blur-md transition-colors hover:bg-white lg:block"
            aria-label="View Atlas Weekender"
          >
            <div className="grid grid-cols-[128px_1fr] gap-4">
              <div className="mt-product-frame relative aspect-square bg-white">
                <Image
                  src={HERO_PRODUCT}
                  alt="Atlas Weekender · Cognac"
                  fill
                  sizes="128px"
                  className="object-contain p-3 transition-transform duration-700 group-hover:scale-[1.035]"
                />
              </div>
              <div className="flex min-w-0 flex-col justify-between py-1">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-bronze)]">
                    Object of departure
                  </p>
                  <h2 className="mt-3 font-display text-[25px] leading-[1.03] text-[var(--color-ink)]">
                    Atlas Weekender
                    <br />
                    Cognac
                  </h2>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-[var(--color-rule)] pt-3">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                    Full-grain leather
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink)]">
                    View
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="absolute inset-x-4 bottom-4 z-10 md:inset-x-12 md:bottom-8" aria-label="Maison Tanneurs launch assurances">
        <div className="grid grid-cols-2 gap-px border border-white/18 bg-white/12 backdrop-blur-md md:inline-grid md:grid-cols-4">
          {TRUST_ITEMS.map((item) => (
            <div
              key={item}
              className="px-3 py-3 text-center text-[10px] uppercase tracking-[0.14em] text-white/84 md:px-5 md:text-[10.5px]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
