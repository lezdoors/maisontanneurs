"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocalizedHref, useT } from "@/lib/i18n-client";

const HERO_IMAGE = "/brand/hero/mt-hero-weekender-desert-product-first-16x9.webp";

export default function Hero() {
  const t = useT();
  const href = useLocalizedHref();

  return (
    <section
      id="top"
      className="relative w-full min-h-[100svh] overflow-hidden bg-[#1a0e07] text-white"
      aria-label="Maison Tanneurs — hand-stitched leather, Marrakech to the road"
    >
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="Atlas Weekender duffle on Saharan flagstone, traveler in the distance"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[92%_45%] md:object-[62%_50%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(5,5,4,0.55) 0%, rgba(5,5,4,0.18) 38%, rgba(5,5,4,0) 62%), linear-gradient(to top, rgba(5,5,4,0.42) 0%, rgba(5,5,4,0.10) 42%, rgba(5,5,4,0) 72%)",
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
                color: "rgba(255,255,255,0.86)",
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
