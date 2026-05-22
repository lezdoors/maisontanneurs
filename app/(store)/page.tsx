import Hero from "@/components/store/Hero";
import Marquee from "@/components/store/Marquee";
import FeaturedDrop from "@/components/store/FeaturedDrop";
import CategoryTiles from "@/components/store/CategoryTiles";
import ProductPreview from "@/components/store/ProductPreview";
import Fulfillment from "@/components/store/Fulfillment";

export default async function Home() {
  return (
    <main className="bg-[var(--color-bg)]">
      <Hero />
      <Marquee />
      <FeaturedDrop />
      <CategoryTiles />
      <ProductPreview />
      <Fulfillment />
    </main>
  );
}
