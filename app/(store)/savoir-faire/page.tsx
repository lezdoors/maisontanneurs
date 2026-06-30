import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Savoir-Faire — Maison Tanneurs",
  description:
    "How the edition is made: full-grain leather, the saddle-stitch worked with two needles and waxed linen, and the hands of a small Marrakech atelier.",
};

type Chapter = {
  n: string;
  title: string;
  body: [string, string];
  image: { src: string; alt: string };
};

const CHAPTERS: Chapter[] = [
  {
    n: "N° 01",
    title: "Full-grain leather, chosen whole",
    body: [
      "We work only the top layer of the hide, the full grain, where the fibres are densest and the surface is left uncorrected. Nothing is sanded away to hide a scar or an insect bite; the leather is read, sorted, and cut around its own character.",
      "Cut whole and worked whole, the leather keeps its tension and its temper. It resists where a corrected, split leather would crease and tire. It is the slower, more honest material, and it is the only one the house will put its name to.",
    ],
    image: {
      src: "/brand/editorial/full-grain-leather-hd-01.webp",
      alt: "Macro of full-grain leather grain",
    },
  },
  {
    n: "N° 02",
    title: "The saddle-stitch, two needles, waxed linen",
    body: [
      "Every seam is a saddle-stitch, worked by hand with two needles passing through the same hole from opposite sides. The thread is waxed linen, drawn tight stitch after stitch, locking the seam so that a single broken thread can never unravel the line.",
      "A machine lays one thread and races. A pair of hands lays two and listens. It is unhurried work, the speed of the hand, and it is the reason these seams outlast the leather they bind.",
    ],
    image: {
      src: "/brand/editorial/atelier-hands-stitching.webp",
      alt: "Artisan hands saddle-stitching leather at the bench",
    },
  },
  {
    n: "N° 03",
    title: "A small Marrakech atelier",
    body: [
      "Everything is made in one small atelier in Marrakech, on the same cutting table, by the same few hands. The edition is deliberately small. We make what those hands can make well, and no more.",
      "There is no production line and no quota. A piece is finished when it is finished, signed by the maker who carried it from hide to handle, and only then does it leave the bench.",
    ],
    image: {
      src: "/brand/editorial/atelier-cutting-table.webp",
      alt: "The atelier cutting table in Marrakech",
    },
  },
  {
    n: "N° 04",
    title: "The finish, and the patina to come",
    body: [
      "Edges are bevelled, sanded, and burnished by hand until they close to a single dense line. The leather is fed, not coated, so the grain stays open and alive to the touch rather than sealed under plastic.",
      "Worn, the surface deepens and the corners soften into a patina that is yours alone. The bag is not finished the day it ships; it is only beginning the life it was cut to live.",
    ],
    image: {
      src: "/brand/editorial/waxed-linen-thread-hd-03.webp",
      alt: "Macro of waxed linen thread",
    },
  },
];

export default function SavoirFairePage() {
  return (
    <div className="bg-[#F5F2EE] text-[#1C1A17]">
      <header className="px-[clamp(24px,6vw,96px)] pt-[clamp(100px,14vw,180px)] pb-[clamp(48px,8vw,96px)]">
        <p className="text-[9px] font-sans uppercase tracking-[0.3em] text-stone-400">
          Savoir-Faire
        </p>
        <h1 className="mt-6 max-w-[18ch] font-display text-[clamp(40px,8vw,96px)] font-light leading-[0.95] tracking-[-0.02em]">
          Made by hand, at the speed of the hand.
        </h1>
      </header>

      {CHAPTERS.map((c) => (
        <section
          key={c.n}
          className="border-t border-[#1C1A17]/12 px-[clamp(24px,6vw,96px)] py-[clamp(64px,10vw,140px)]"
        >
          <div className="grid grid-cols-12 gap-x-[clamp(24px,5vw,80px)] gap-y-12">
            <div className="col-span-12 md:col-span-5">
              <p className="text-[9px] font-sans uppercase tracking-[0.3em] text-stone-400">
                {c.n}
              </p>
              <h2 className="mt-4 max-w-[16ch] font-display text-[clamp(28px,4vw,48px)] font-light leading-[1.02] tracking-[-0.02em]">
                {c.title}
              </h2>
              <div className="mt-8 space-y-5">
                {c.body.map((p, i) => (
                  <p
                    key={i}
                    className="max-w-[60ch] font-sans text-[13px] leading-relaxed text-stone-600 md:text-[15px]"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
            <div className="col-span-12 md:col-span-6 md:col-start-7">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={c.image.src}
                  alt={c.image.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      ))}

      <footer className="border-t border-[#1C1A17]/12 px-[clamp(24px,6vw,96px)] py-[clamp(64px,10vw,140px)]">
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-16">
          <Link
            href="/products"
            className="font-display text-[clamp(22px,3vw,34px)] font-light tracking-[-0.02em] text-[#1C1A17] transition-opacity hover:opacity-60"
          >
            See the edition →
          </Link>
          <Link
            href="/atelier"
            className="font-display text-[clamp(22px,3vw,34px)] font-light tracking-[-0.02em] text-[#1C1A17] transition-opacity hover:opacity-60"
          >
            Visit the Atelier →
          </Link>
        </div>
      </footer>
    </div>
  );
}
