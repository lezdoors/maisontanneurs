import type { Metadata } from "next";
import LemaireHero from "@/components/store/lemaire/LemaireHero";
import EditionGrid from "@/components/store/lemaire/EditionGrid";
import Lookbook from "@/components/store/lemaire/Lookbook";
import CraftCinema from "@/components/store/lemaire/CraftCinema";
import MaterialDivider from "@/components/store/lemaire/MaterialDivider";
import CinematicCarousel from "@/components/store/lemaire/CinematicCarousel";
import ClosingSignature from "@/components/store/lemaire/ClosingSignature";
import { loadHomeProducts } from "@/lib/landing-edition";

export const metadata: Metadata = {
  title: "Maison Tanneurs — Hand-cut, saddle-stitched leather goods",
  description:
    "An edition of full-grain leather bags, hand-cut and saddle-stitched in a small Marrakech atelier. The house signature is the Atlas Weekender.",
};

export default async function Home() {
  const { hero, grid, carousel } = await loadHomeProducts();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F5F2EE] text-[#1C1A17]">
      {/* SEO/a11y page heading — the editorial sections use h2; the ad landing
          page still needs a single h1. Visually hidden, screen-reader present. */}
      <h1 className="sr-only">
        Maison Tanneurs — hand-cut, saddle-stitched full-grain leather bags, made
        in Marrakech
      </h1>
      <LemaireHero signature={hero} />
      <EditionGrid items={grid} />
      <Lookbook />
      <CraftCinema />
      <MaterialDivider />
      <CinematicCarousel items={carousel} />
      <ClosingSignature />
    </main>
  );
}
