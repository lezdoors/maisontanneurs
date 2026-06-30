"use client";

import Image from "next/image";
import Link from "next/link";
import SaddleStitchReveal from "@/components/store/lemaire/SaddleStitchReveal";
import Price from "@/components/store/lemaire/Price";

type ProductVM = {
  slug: string;
  title: string;
  priceCents: number;
  image: string;
  material: string;
};

export default function CinematicCarousel({ items }: { items: ProductVM[] }) {
  return (
    <section className="w-full py-[clamp(100px,14vw,180px)]">
      {/* Header — left-aligned in the gutter, with a quiet scroll hint */}
      <div className="px-[clamp(24px,6vw,96px)] flex items-end justify-between gap-8">
        <div>
          <p className="text-[9px] tracking-[0.3em] font-sans uppercase text-stone-400">
            Continued — the rest of the edition
          </p>
          <h2 className="font-display font-light text-[clamp(28px,4vw,56px)] leading-[0.95] tracking-[-0.02em] text-[#1C1A17] mt-4">
            One object at a time.
          </h2>
        </div>
        <p className="shrink-0 text-[9px] tracking-[0.3em] uppercase text-stone-400 pb-2">
          Scroll →
        </p>
      </div>

      {/* Track — horizontal snap scroller */}
      <div className="mt-[clamp(48px,8vw,96px)] flex gap-[clamp(24px,5vw,80px)] overflow-x-auto snap-x snap-mandatory px-[clamp(24px,6vw,96px)] pb-6 [scrollbar-width:none] [-ms-overflow-style:none] mt-carousel-track">
        <style jsx>{`
          .mt-carousel-track::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {items.map((vm, i) => (
          <article
            key={vm.slug}
            className="snap-center shrink-0 w-[86vw] sm:w-[62vw] lg:w-[46vw]"
          >
            <SaddleStitchReveal stitch={true}>
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={vm.image}
                  alt={vm.title}
                  fill
                  sizes="(min-width:1024px) 46vw, (min-width:640px) 62vw, 86vw"
                  className="mix-blend-multiply object-contain"
                />
              </div>
            </SaddleStitchReveal>

            {/* Index block — hung left under the image */}
            <div className="mt-5">
              <p className="text-[9px] tracking-[0.3em] font-sans uppercase text-stone-400">
                N° 0{i + 1}
              </p>
              <p className="text-sm font-display font-light text-[#1C1A17] mt-1">
                {vm.title}
              </p>
              <p className="text-[11px] font-sans tracking-wide text-stone-500 max-w-xs mt-2 leading-relaxed">
                {vm.material}
              </p>
              <div className="mt-3 flex items-center gap-6">
                <Price
                  cents={vm.priceCents}
                  className="text-[11px] tracking-wide font-sans text-[#1C1A17]"
                />
                <Link
                  href={`/products/${vm.slug}`}
                  className="p-4 -m-4 text-[10px] tracking-[0.25em] uppercase font-sans text-[#1C1A17] hover:opacity-60"
                >
                  Inspect →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
