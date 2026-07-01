"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

type SplitProps = {
  side?: "text-left" | "text-right";
  kicker: string;
  title: string;
  body: string;
  markers?: string[];
  media: { kind: "video" | "image"; src: string; poster?: string; alt?: string };
  cta?: { label: string; href: string };
};

export default function CraftSplit({
  side = "text-left",
  kicker,
  title,
  body,
  markers,
  media,
  cta,
}: SplitProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (media.kind !== "video") return;
    const el = videoRef.current;
    if (!el) return;

    const safePlay = () => {
      const p = el.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) safePlay();
          else el.pause();
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [media.kind]);

  const textRight = side === "text-right";

  const MediaPanel = (
    <div
      className={`relative overflow-hidden bg-[#F4F3F1] min-h-[52vh] md:min-h-full ${
        textRight ? "md:order-1" : ""
      }`}
    >
      {media.kind === "image" ? (
        <Image
          src={media.src}
          alt={media.alt ?? title}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsInline
          poster={media.poster}
          preload="metadata"
        >
          <source src={media.src} />
        </video>
      )}
    </div>
  );

  const TextPanel = (
    <div
      className={`flex items-center px-[clamp(24px,6vw,90px)] py-[clamp(64px,10vw,120px)] ${
        textRight ? "md:order-2" : ""
      }`}
    >
      <div className="max-w-[46ch]">
        <p className="text-[9px] tracking-[0.3em] uppercase text-stone-400 font-sans">
          {kicker}
        </p>
        <h2 className="font-display font-light text-[clamp(30px,4vw,56px)] leading-[1.05] text-[#1C1A17] mt-4">
          {title}
        </h2>
        <p className="text-[14px] font-sans leading-relaxed text-stone-600 mt-6 max-w-[42ch]">
          {body}
        </p>

        {markers && markers.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
            {markers.map((m, i) => (
              <span
                key={i}
                className="text-[9px] tracking-[0.3em] uppercase text-stone-400 font-sans"
              >
                {m}
              </span>
            ))}
          </div>
        )}

        {cta && (
          <Link
            href={cta.href}
            className="mt-8 inline-block text-[10px] tracking-[0.25em] uppercase text-[#1C1A17] border-b border-[#1C1A17] pb-1"
          >
            {cta.label}
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <section className="w-full bg-white grid grid-cols-1 md:grid-cols-2 md:items-stretch min-h-[clamp(60vh,72vh,86vh)]">
      {MediaPanel}
      {TextPanel}
    </section>
  );
}
