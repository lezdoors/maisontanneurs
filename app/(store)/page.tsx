import type { Metadata } from "next";
import HeroCarousel from "@/components/store/lemaire/HeroCarousel";
import EditionGrid from "@/components/store/lemaire/EditionGrid";
import CraftSplit from "@/components/store/lemaire/CraftSplit";
import CinematicCarousel from "@/components/store/lemaire/CinematicCarousel";
import ClosingSignature from "@/components/store/lemaire/ClosingSignature";
import { loadHomeProducts } from "@/lib/landing-edition";

export const metadata: Metadata = {
  title: "Maison Tanneurs — Hand-cut, saddle-stitched leather goods",
  description:
    "An edition of full-grain leather bags, hand-cut and saddle-stitched in a small Marrakech atelier. The house signature is the Atlas Weekender.",
};

export default async function Home() {
  const { grid, carousel } = await loadHomeProducts();

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#1C1A17]">
      <h1 className="sr-only">
        Maison Tanneurs — hand-cut, saddle-stitched full-grain leather bags, made
        in Marrakech
      </h1>

      {/* 1 — Hero carousel (each slide its own media + text) */}
      <HeroCarousel />

      {/* 2 — The Edition (crisp uniform product grid) */}
      <EditionGrid items={grid} />

      {/* 3 — Craft split (film + text, left) */}
      <CraftSplit
        side="text-left"
        kicker="The Craft"
        title="Made at the speed of the hand."
        body="Each bag is cut, skived, saddle-stitched, edge-burnished, lined and fitted by the same pair of hands, start to finish. The saddle stitch is sewn with two needles and locked at every pass — if one thread wears, the seam holds."
        markers={["Full-grain", "Hand-stitched", "Saddle-finished"]}
        media={{
          kind: "video",
          src: "/film/craft-hands.mp4",
          poster: "/film/craft-hands-poster.jpg",
          alt: "An artisan saddle-stitching leather at the bench",
        }}
        cta={{ label: "Savoir-Faire", href: "/savoir-faire" }}
      />

      {/* 4 — Cinematic carousel (rest of the edition, one object per view) */}
      <CinematicCarousel items={carousel} />

      {/* 5 — Making split (film + text, right) — separated from the craft film */}
      <CraftSplit
        side="text-right"
        kicker="La Fabrication"
        title="One bench, one pair of hands."
        body="It leaves the bench structured, softens with use, and takes on a patina specific to the person who carries it. Made to order in Marrakech and shipped worldwide by tracked courier."
        media={{
          kind: "video",
          src: "/film/making-process.mp4",
          poster: "/film/making-process-poster.jpg",
          alt: "A cognac leather holdall being assembled by hand",
        }}
        cta={{ label: "The Atelier", href: "/atelier" }}
      />

      {/* 6 — Closing signature */}
      <ClosingSignature />
    </main>
  );
}
