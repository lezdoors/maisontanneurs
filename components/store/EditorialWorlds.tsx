import Image from "next/image";

const WORLDS = [
  {
    src: "/brand/hero/home-hero-4-pool-tote.webp",
    alt: "Maison Tanneurs cognac bag beside a still Marrakech pool",
    number: "01",
    title: "Ryad light",
    meta: "Marrakech · midday stone",
  },
  {
    src: "/brand/hero/home-hero-5-courtyard-walk.webp",
    alt: "Cognac leather bag on a pale courtyard plinth as a woman walks through arches",
    number: "02",
    title: "Courtyard pace",
    meta: "Atelier · after cutting",
  },
  {
    src: "/brand/editorial/cinematic-bag-still.webp",
    alt: "Cognac leather crossbody in green window light",
    number: "03",
    title: "Evening grain",
    meta: "Object · before departure",
  },
];

export default function EditorialWorlds() {
  return (
    <section
      aria-label="Three settings, one object"
      className="border-y border-[var(--color-rule)] bg-white px-6 py-[clamp(82px,11vw,150px)] text-[var(--color-ink)] md:px-12"
    >
      <div className="mx-auto max-w-[1500px]">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="tech-meta text-[var(--color-ink-muted)]">§04 · carried across worlds</p>
          <h2
            className="mt-7 font-normal leading-[1.02] tracking-[-.01em]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(42px, 5.2vw, 86px)",
            }}
          >
            One object. Three settings. Same fourteen-day rhythm.
          </h2>
        </div>

        <div className="mt-[clamp(56px,8vw,100px)] grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
          {WORLDS.map((world) => (
            <figure key={world.src} className="group">
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-plate)]">
                <Image
                  src={world.src}
                  alt={world.alt}
                  fill
                  loading="eager"
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.025]"
                />
              </div>
              <figcaption className="mt-7 flex items-baseline gap-4">
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontSize: "clamp(24px, 2.6vw, 38px)",
                    color: "var(--color-ink-muted)",
                  }}
                >
                  {world.number}
                </span>
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontStyle: "italic",
                      fontSize: "clamp(22px, 2.2vw, 32px)",
                      lineHeight: 1.05,
                    }}
                  >
                    {world.title}
                  </h3>
                  <p className="mt-2 tech-meta text-[var(--color-ink-muted)]">{world.meta}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
