import HeritageHero from "@/components/store/HeritageHero";
import HeritageEdition from "@/components/store/HeritageEdition";

export default async function Home() {
  return (
    <main className="min-h-screen bg-[#f2eee5] text-[#24211f]">
      <HeritageHero />
      <HeritageEdition />
    </main>
  );
}
