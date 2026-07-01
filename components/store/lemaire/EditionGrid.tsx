import Image from "next/image";
import Link from "next/link";
import Price from "@/components/store/lemaire/Price";

type ProductVM = {
  slug: string;
  title: string;
  priceCents: number;
  image: string;
  material: string;
};

export default function EditionGrid({ items }: { items: ProductVM[] }) {
  const cells = items.slice(0, 6);

  return (
    <section className="w-full py-[clamp(72px,10vw,130px)] px-[clamp(24px,6vw,80px)] bg-white">
      <div className="max-w-[46ch] mx-auto text-center">
        <p className="text-[9px] tracking-[0.3em] font-sans uppercase text-stone-400">
          Volume I — The Edition
        </p>
        <h2 className="font-display font-light text-[clamp(34px,4.5vw,60px)] leading-[1.05] tracking-[-0.01em] text-[#1C1A17] mt-4">
          Objects, kept few.
        </h2>
        <p className="text-[13px] font-sans text-stone-500 mt-4 max-w-[52ch] mx-auto">
          Hand-cut and saddle-stitched in Marrakech. Kept few, made to last.
        </p>
      </div>

      <div className="mt-[clamp(48px,7vw,88px)] grid grid-cols-2 gap-x-[clamp(16px,3vw,40px)] gap-y-[clamp(40px,6vw,72px)] md:grid-cols-3">
        {cells.map((vm, i) => (
          <Link
            key={vm.slug}
            href={`/products/${vm.slug}`}
            className="group block"
          >
            <div className="relative w-full aspect-[4/5] bg-[#FAFAF9] overflow-hidden">
              <Image
                src={vm.image}
                alt={vm.title}
                fill
                sizes="(min-width:768px) 30vw, 50vw"
                className="object-contain p-[8%] transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.04]"
              />
            </div>

            <div className="mt-4 text-left">
              <p className="text-[9px] tracking-[0.3em] font-sans uppercase text-stone-400">
                N° 0{i + 1}
              </p>
              <p className="text-sm font-display font-light text-[#1C1A17] mt-1">
                {vm.title}
              </p>
              <p className="text-[11px] font-sans tracking-wide text-stone-500 mt-1">
                {vm.material}
              </p>
              <p className="text-[11px] font-sans tracking-wide text-stone-500 mt-1">
                <Price cents={vm.priceCents} />
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-[clamp(56px,8vw,96px)]">
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
