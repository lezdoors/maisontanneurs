import Image from "next/image";
import Link from "next/link";

const STORY_IMAGE: string | null = "/hero/atelier-messenger-portrait.webp";

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
            From the Marrakech atelier.
          </h2>
          <p className="ed-body-lg mt-7 max-w-[44ch]">
            Maison Tanneurs is a small leather house working out of a Marrakech
            atelier. Each bag is cut, stitched, and finished by hand —
            full-grain leather, solid brass hardware, contrast saddle-stitch.
            Shipped direct to you within three to five days via DHL or FedEx.
          </p>
          <p className="ed-body-lg mt-4 max-w-[44ch]">
            No middlemen. No inventory we didn&apos;t make. A leather house
            for people who want the maker&apos;s mark on the bag they carry.
          </p>
          <div className="mt-10">
            <Link href="/about" className="ed-cta-outline">
              Read the story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
