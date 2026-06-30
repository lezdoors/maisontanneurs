import Image from "next/image";
import SaddleStitchReveal from "@/components/store/lemaire/SaddleStitchReveal";

// The House, in the world — three cinematic worlds (medina / atelier / street),
// full-bleed photographic (object-cover), never the boxed packshot treatment.
// Each asset is used once and appears nowhere else on the page.
const SHOTS = [
  {
    src: "/lookbook/lookbook-medina-door.webp",
    serial: "N° I — Marrakech",
    title: "At the medina door",
    note: "The Atlas Weekender, carried through the old town at first light.",
    box: "md:col-start-1 md:col-span-7",
    offset: "",
    ratio: "aspect-[16/10]",
    pos: "object-center",
  },
  {
    src: "/lookbook/lookbook-coast.webp",
    serial: "N° II — Mediterranean",
    title: "Sea-wall, slow morning",
    note: "Kilim and full-grain, carried down a whitewashed lane above the water.",
    box: "md:col-start-9 md:col-span-3",
    offset: "md:mt-[clamp(140px,20vw,300px)]",
    ratio: "aspect-[3/4]",
    pos: "object-center",
  },
  {
    src: "/lookbook/lookbook-country.webp",
    serial: "N° III — Open Country",
    title: "Field and rein",
    note: "The tote taken to open ground — leather that ages like the season.",
    box: "md:col-start-3 md:col-span-6",
    offset: "md:mt-[clamp(80px,12vw,200px)]",
    ratio: "aspect-[16/10]",
    pos: "object-center",
  },
];

export default function Lookbook() {
  return (
    <section className="w-full py-[clamp(100px,14vw,180px)] px-[clamp(24px,6vw,96px)]">
      <div className="max-w-[26ch]">
        <p className="text-[9px] tracking-[0.3em] font-sans uppercase text-stone-400">
          The House — Worn, not displayed
        </p>
        <h2 className="mt-4 font-display font-light text-[#1C1A17] leading-[0.95] tracking-[-0.02em] text-[clamp(40px,6vw,92px)]">
          In the world.
        </h2>
      </div>

      <div className="mt-[clamp(56px,9vw,120px)] grid grid-cols-1 gap-[clamp(64px,12vw,120px)] md:grid-cols-12 md:gap-x-[clamp(24px,4vw,64px)] md:items-start md:gap-y-0">
        {SHOTS.map((s, i) => (
          <figure key={s.src} className={`${s.box} ${s.offset}`}>
            <SaddleStitchReveal>
              <div className={`relative w-full ${s.ratio} overflow-hidden`}>
                <Image
                  src={s.src}
                  alt={s.title}
                  fill
                  sizes="(min-width:768px) 55vw, 100vw"
                  className={`object-cover ${s.pos}`}
                />
              </div>
            </SaddleStitchReveal>
            <figcaption className="mt-5 text-left">
              <p className="text-[9px] tracking-[0.3em] font-sans uppercase text-stone-400">
                {s.serial}
              </p>
              <p className="text-sm font-display font-light text-[#1C1A17] mt-1">
                {s.title}
              </p>
              <p className="text-[11px] font-sans tracking-wide text-stone-500 max-w-xs mt-2 leading-relaxed">
                {s.note}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
