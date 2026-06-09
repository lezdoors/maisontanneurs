"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useInView } from "framer-motion";

type Cell = {
  kind?: "image" | "video";
  src: string;
  alt: string;
  ratio: string;
  poster?: string;
};

type Chapter = {
  number: string;
  title: string;
  lead: Cell;
  support: [Cell, Cell];
};

const CHAPTERS: Chapter[] = [
  {
    number: "01",
    title: "The Hides",
    lead: {
      src: "/atelier/atelier-wide-light-beams.webp",
      alt: "Marrakech atelier — light shafts through arched windows, two artisans at work",
      ratio: "21 / 9",
    },
    support: [
      {
        src: "/atelier/atelier-hides-stack.webp",
        alt: "Stacked full-grain hides in cognac and caramel tones, artisans at work behind",
        ratio: "4 / 5",
      },
      {
        src: "/atelier/atelier-zellige-cutting.webp",
        alt: "Leather pattern pieces laid across a long wooden table in a zellige-tiled atelier",
        ratio: "4 / 5",
      },
    ],
  },
  {
    number: "02",
    title: "The Bench",
    lead: {
      kind: "video",
      src: "/brand/atelier/atelier-hands-at-work.mp4",
      poster: "/brand/atelier/atelier-hands-at-work-poster.jpg",
      alt: "Artisan hand-stitching cognac leather with a brass awl and waxed thread, atelier bench",
      ratio: "21 / 9",
    },
    support: [
      {
        src: "/atelier/atelier-awl-hand-macro.webp",
        alt: "Close-up of an artisan's weathered hand piercing leather with a brass awl",
        ratio: "4 / 5",
      },
      {
        kind: "video",
        src: "/brand/atelier/atelier-medina-handover.mp4",
        poster: "/brand/atelier/atelier-medina-handover-poster.jpg",
        alt: "Two artisans packing a cognac travel bag together in a Marrakech medina interior",
        ratio: "4 / 5",
      },
    ],
  },
  {
    number: "03",
    title: "The Road",
    lead: {
      kind: "video",
      src: "/brand/atelier/atelier-bag-terrace.mp4",
      poster: "/brand/atelier/atelier-bag-terrace-poster.jpg",
      alt: "Hand placing a cognac leather bag on a sunlit terrace with brass weighing scales beside it",
      ratio: "21 / 9",
    },
    support: [
      {
        src: "/atelier/lifestyle-tennis-court.webp",
        alt: "Model seated on rattan deck chair on a red clay tennis court at golden hour with kilim-trim backpack",
        ratio: "4 / 5",
      },
      {
        src: "/atelier/lifestyle-olive-courtyard.webp",
        alt: "Model walking through an olive-tree courtyard in white linen carrying a tan shoulder bag",
        ratio: "4 / 5",
      },
    ],
  },
];

export default function AtelierGallery() {
  return (
    <section
      id="atelier-gallery"
      aria-label="Atelier"
      className="w-full bg-[var(--color-bg)] text-[var(--color-ink)] border-t border-[#e5e5e5]"
    >
      <div className="border-b border-[#e5e5e5]">
        <div className="px-6 py-5 flex flex-wrap items-end justify-between gap-y-4">
          <div className="flex items-end gap-6">
            <span className="tech-label opacity-60">§05.5</span>
            <h2
              className="leading-none font-medium"
              style={{
                fontSize: "clamp(28px, 3.6vw, 36px)",
                letterSpacing: "-0.03em",
              }}
            >
              Atelier
            </h2>
          </div>
          <span className="tech-meta opacity-70 hidden md:inline">
            FOURTEEN DAYS · SEVEN HANDS · MARRAKECH
          </span>
        </div>
      </div>

      <div className="px-6 md:px-10 py-[clamp(56px,8vw,112px)]">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-[clamp(64px,9vw,128px)]">
          {CHAPTERS.map((chapter) => (
            <div key={chapter.number} className="flex flex-col gap-5 md:gap-6">
              <div className="flex items-baseline gap-5">
                <span className="tech-label opacity-60">{chapter.number}</span>
                <h3
                  className="leading-none font-medium"
                  style={{
                    fontSize: "clamp(22px, 2.4vw, 28px)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {chapter.title}
                </h3>
              </div>
              <Frame cell={chapter.lead} />
              <div className="grid grid-cols-2 gap-5 md:gap-6">
                {chapter.support.map((cell) => (
                  <Frame key={cell.src} cell={cell} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Frame({ cell }: { cell: Cell }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const inView = useInView(ref, { margin: "-10% 0px -10% 0px" });

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (inView && !mq.matches) {
      v.play().catch(() => undefined);
    } else {
      v.pause();
    }
  }, [inView]);

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden bg-[var(--color-bg-alt)]"
      style={{ aspectRatio: cell.ratio }}
    >
      {cell.kind === "video" ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster={cell.poster}
          preload="metadata"
          muted
          loop
          playsInline
          aria-label={cell.alt}
        >
          <source src={cell.src} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={cell.src}
          alt={cell.alt}
          fill
          sizes={
            cell.ratio === "21 / 9"
              ? "(min-width: 1480px) 1400px, 100vw"
              : "(min-width: 1480px) 690px, 50vw"
          }
          className="object-cover"
        />
      )}
    </div>
  );
}
