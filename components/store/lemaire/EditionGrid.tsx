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

// Deliberately uneven slots: spans, column starts, aspect ratios, and top
// offsets so no two neighbours share a baseline and centre columns are left
// as intentional voids. On mobile everything is full width, no offsets.
// `placement` lands on the link cell; `aspect` lands on the image box only,
// so the index block below the image is never clipped.
const SLOTS = [
  { placement: "md:col-start-1 md:col-span-6", aspect: "aspect-[4/5]" },
  { placement: "md:col-start-9 md:col-span-4 md:mt-[clamp(120px,18vw,260px)]", aspect: "aspect-[3/4]" },
  { placement: "md:col-start-2 md:col-span-3 md:mt-[clamp(40px,6vw,120px)]", aspect: "aspect-[1/1]" },
  { placement: "md:col-start-7 md:col-span-5 md:mt-[clamp(160px,20vw,300px)]", aspect: "aspect-[5/6]" },
  { placement: "md:col-start-3 md:col-span-4 md:mt-[clamp(60px,8vw,150px)]", aspect: "aspect-[4/5]" },
];

export default function EditionGrid({ items }: { items: ProductVM[] }) {
  const cells = items.slice(0, SLOTS.length);

  return (
    <section className="w-full py-[clamp(100px,14vw,180px)] px-[clamp(24px,6vw,96px)]">
      <div className="max-w-[14ch]">
        <p className="text-[9px] tracking-[0.3em] font-sans uppercase text-stone-400">
          Volume I — The Edition
        </p>
        <h2 className="mt-6 font-display font-light text-[clamp(40px,6vw,92px)] leading-[0.95] tracking-[-0.02em] text-[#1C1A17]">
          Objects, kept few.
        </h2>
      </div>

      <div className="mt-[clamp(72px,14vw,180px)] grid-cols-1 space-y-[clamp(64px,12vw,120px)] md:grid md:grid-cols-12 md:gap-x-[clamp(24px,4vw,64px)] md:space-y-0 md:items-start">
        {cells.map((vm, i) => (
          <Link
            key={vm.slug}
            href={`/products/${vm.slug}`}
            className={`group block ${SLOTS[i].placement}`}
          >
            <SaddleStitchReveal>
              {/* Parchment bg so mix-blend-multiply always composites against
                  the canvas (no white-box flash inside the reveal's stacking
                  context). */}
              <div
                className={`relative w-full ${SLOTS[i].aspect} bg-[#F5F2EE] overflow-hidden`}
              >
                <Image
                  src={vm.image}
                  alt={vm.title}
                  fill
                  sizes="(min-width:768px) 40vw, 100vw"
                  className="mix-blend-multiply object-contain transition-transform duration-[900ms] ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform group-hover:scale-[1.035]"
                />
              </div>
            </SaddleStitchReveal>

            <div className="mt-5">
              <p className="text-[9px] tracking-[0.3em] font-sans uppercase text-stone-400">
                N° 0{i + 1}
              </p>
              <p className="text-sm font-display font-light text-[#1C1A17] mt-1">
                {vm.title}
              </p>
              <p className="text-[11px] font-sans tracking-wide text-stone-500 max-w-xs mt-2 leading-relaxed">
                {vm.material} · <Price cents={vm.priceCents} />
              </p>
              {/* caption reveal — fades + rises on card hover */}
              <span
                className="mt-3 inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase font-sans text-[#1C1A17] opacity-0 translate-y-2 transition-[opacity,transform] duration-[700ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-100 group-hover:translate-y-0"
              >
                Inspect <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-[clamp(100px,16vw,220px)]">
        <Link
          href="/products"
          className="text-[10px] tracking-[0.25em] uppercase font-sans text-[#1C1A17] border-b border-[#1C1A17] pb-1 inline-block"
        >
          View the full edition →
        </Link>
      </div>
    </section>
  );
}
