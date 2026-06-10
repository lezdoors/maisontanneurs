import Image from "next/image";
import Link from "next/link";

const STORIES = [
  {
    kicker: "Travel",
    title: "The object should hold shape before it goes anywhere.",
    image: "/brand/editorial/journal-travel-koutchi-carriage.webp",
    alt: "Cognac leather duffle holding its shape on the green seat of an antique Moroccan koutchi carriage",
  },
  {
    kicker: "Bench",
    title: "A hand check tells more than a slogan.",
    image: "/brand/editorial/journal-hand-clasp-check.webp",
    alt: "Close hand check of a brass clasp on cognac leather before the bag leaves the bench",
  },
  {
    kicker: "Edition",
    title: "Small runs make the catalogue easier to trust.",
    image: "/brand/editorial/journal-edition-plinth-duffle.webp",
    alt: "Single cognac leather duffle presented on a stone plinth under warm raking light",
  },
];

export default function HeritageJournal() {
  return (
    <section
      aria-label="Heritage journal"
      className="w-full bg-[var(--color-paper)] text-[var(--color-ink)]"
    >
      <div className="mx-auto max-w-[1500px] px-6 py-[clamp(80px,12vw,160px)]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="tech-label text-[var(--color-bronze)]">Heritage / Journal</p>
            <h2
              className="mt-8 max-w-[9ch]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(52px, 7vw, 104px)",
                fontWeight: 400,
                letterSpacing: "-0.018em",
                lineHeight: 0.94,
              }}
            >
              The object after purchase.
            </h2>
            <p
              className="mt-8 max-w-[34ch] text-[var(--color-ink-soft)]"
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(18px, 1.7vw, 24px)",
                lineHeight: 1.45,
              }}
            >
              Notes on leather, repair, travel, and the slow life of a handmade bag.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:col-span-8">
            {STORIES.map((story, index) => (
              <article key={story.title} className={index === 1 ? "sm:mt-16" : ""}>
                <div className="relative overflow-hidden bg-[var(--color-paper-alt)]" style={{ aspectRatio: "4 / 5" }}>
                  <Image
                    src={story.image}
                    alt={story.alt}
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 100vw"
                    priority
                    className="object-cover"
                  />
                </div>
                <p className="tech-label mt-6 text-[var(--color-bronze)]">{story.kicker}</p>
                <h3
                  className="mt-3"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(24px, 2.4vw, 36px)",
                    fontWeight: 400,
                    lineHeight: 1.08,
                  }}
                >
                  {story.title}
                </h3>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/atelier"
            className="inline-flex border-b border-[var(--color-ink)] pb-2 text-[11px] uppercase tracking-[0.22em] transition-opacity hover:opacity-60"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Read the atelier notes
          </Link>
        </div>
      </div>
    </section>
  );
}
