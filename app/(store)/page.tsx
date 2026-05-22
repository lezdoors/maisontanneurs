import Hero from "@/components/store/Hero";
import Marquee from "@/components/store/Marquee";
import FeaturedDrop from "@/components/store/FeaturedDrop";
import CrossFadeShowcase from "@/components/store/CrossFadeShowcase";
import EditorialSplit from "@/components/store/EditorialSplit";
import AtmosphereVideo from "@/components/store/AtmosphereVideo";
import CategoryTiles from "@/components/store/CategoryTiles";
import ProductPreview from "@/components/store/ProductPreview";
import Fulfillment from "@/components/store/Fulfillment";

const STORAGE =
  "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-01";

export default async function Home() {
  return (
    <main className="bg-[var(--color-bg)]">
      <Hero />
      <Marquee />
      <FeaturedDrop />
      <CrossFadeShowcase
        eyebrow="Heritage Rucksack"
        headline="Drop 01, hand-stitched."
        body="The Heritage Rucksack — full-grain cognac leather, three buckled exterior pockets, roll-top compartment. Hand-stitched by Marrakech artisans, finished with solid brass hardware. Patinas with wear."
        ctaLabel="Shop Heritage"
        ctaHref="/products/heritage-rucksack"
        images={[
          { src: `${STORAGE}/heritage-rucksack-scale.webp`, alt: "Heritage Rucksack — scale" },
          { src: `${STORAGE}/heritage-rucksack-archive-1.webp`, alt: "Heritage Rucksack — archive view" },
          { src: `${STORAGE}/heritage-rucksack-archive-2.webp`, alt: "Heritage Rucksack — atelier" },
        ]}
        photoSide="left"
      />
      <AtmosphereVideo
        eyebrow="The Atelier"
        headline="Built where it's worn."
        body="Every piece is cut, stitched, and finished by hand in our Marrakech atelier. Full-grain leather, solid brass, no glue — the way it's been done for a century."
        ctaLabel="Visit the Atelier"
        ctaHref="/about"
        videoSrc="/videos/ryad-entrance.mp4"
        videoSide="right"
      />
      <EditorialSplit
        eyebrow="The House"
        headline="A small atelier, deliberately."
        body="We make a small number of pieces each season, in cognac and bordeaux. No drops chasing trend cycles. The Heritage Rucksack and the Roll-Top Daypack — that's it, until winter."
        ctaLabel="Read the Story"
        ctaHref="/about"
        image={`${STORAGE}/leather-goods-tile.webp`}
        imageAlt="Maison Tanneurs atelier"
        photoSide="left"
      />
      <CategoryTiles />
      <ProductPreview />
      <Fulfillment />
    </main>
  );
}
