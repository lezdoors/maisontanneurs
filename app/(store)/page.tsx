import Hero from "@/components/store/Hero";
import TrustRibbon from "@/components/store/TrustRibbon";
import FeaturedDrop from "@/components/store/FeaturedDrop";
import CategoryTiles from "@/components/store/CategoryTiles";
import AtelierFocus from "@/components/store/AtelierFocus";
import EditorialStrip from "@/components/store/EditorialStrip";
import ProductPreview from "@/components/store/ProductPreview";
import BrandStoryEditorial from "@/components/store/BrandStoryEditorial";
import Fulfillment from "@/components/store/Fulfillment";

export default async function Home() {
  return (
    <main className="bg-[var(--color-bg)]">
      <Hero />
      <TrustRibbon />
      <FeaturedDrop />
      <CategoryTiles />
      <AtelierFocus />
      <EditorialStrip />
      <ProductPreview />
      <BrandStoryEditorial />
      <Fulfillment />
    </main>
  );
}
