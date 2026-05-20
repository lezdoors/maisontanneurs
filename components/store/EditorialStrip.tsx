import Image from "next/image";
import Link from "next/link";

type EditorialItem = {
  eyebrow: string;
  title: string;
  href: string;
  image: string | null;
  gradient: string;
};

const ITEMS: EditorialItem[] = [
  {
    eyebrow: "The Material",
    title: "Full-grain leather, hand-cured in Marrakech",
    href: "/about",
    image: null,
    gradient: "linear-gradient(140deg, #d8a47a 0%, #8c6b3a 60%, #4a3625 100%)",
  },
  {
    eyebrow: "The Atelier",
    title: "Hand-stitched, one bag at a time",
    href: "/about",
    image: "/hero/editorial-atelier.webp",
    gradient: "linear-gradient(140deg, #1e4a6b 0%, #2a2622 100%)",
  },
];

export default function EditorialStrip() {
  return (
    <section className="ed-section-tight bg-[var(--color-bg)]">
      <div className="max-w-[1480px] mx-auto">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <div className="ed-eyebrow mb-4">The Journal</div>
            <h2 className="ed-h2 max-w-[20ch]">
              Stories from inside the studio.
            </h2>
          </div>
          <Link href="/about" className="ed-more hidden md:inline-flex">
            All stories
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {ITEMS.map((item, idx) => (
            <Link
              key={item.title}
              href={item.href}
              className="group block"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-bg-tinted)]">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-[1100ms] ease-[var(--ease)] group-hover:scale-105"
                  />
                ) : (
                  <div
                    aria-hidden
                    className="absolute inset-0 transition-transform duration-[1100ms] ease-[var(--ease)] group-hover:scale-105"
                    style={{ background: item.gradient }}
                  />
                )}
              </div>
              <div className="pt-5">
                <div className="ed-meta text-[var(--color-mineral)] mb-2">
                  {item.eyebrow}
                </div>
                <h3 className="ed-card-headline max-w-[22ch]">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
