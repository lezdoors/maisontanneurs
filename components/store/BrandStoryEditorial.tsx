import Image from "next/image";
import Link from "next/link";

const STORY_IMAGE: string | null = "/hero/brand-story-v2.webp";

export default function BrandStoryEditorial() {
  return (
    <section className="ed-section bg-[var(--color-bg-alt)]">
      <div className="max-w-[1480px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="relative aspect-[5/6] overflow-hidden bg-[var(--color-bg-tinted)]">
          {STORY_IMAGE ? (
            <Image
              src={STORY_IMAGE}
              alt="Between worlds"
              fill
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, #d8a47a 0%, #b59874 35%, #6b5640 80%, #2a2622 100%)",
              }}
            />
          )}
        </div>

        <div className="max-w-[460px] reveal">
          <div className="ed-eyebrow mb-6">Between Worlds</div>
          <h2 className="ed-h2 max-w-[16ch]">
            From Morocco, recut for today.
          </h2>
          <p className="ed-body-lg mt-7 max-w-[44ch]">
            Kechken is built around modern Moroccan identity — streetwear,
            jewelry, and limited drops shaped by Maghreb form, metalwork,
            colour, and line. Every piece is designed in-house, printed and
            finished when you place the order, and shipped to you within
            three to five days from a vetted fulfillment partner.
          </p>
          <p className="ed-body-lg mt-4 max-w-[44ch]">
            No deadstock. No overproduction. A label for people who carry
            culture into the room.
          </p>
          <div className="mt-10">
            <Link href="/story" className="ed-cta-outline">
              Read the story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
