import Hero from "@/components/store/Hero";
import Marquee from "@/components/store/Marquee";
import ArchitecturalGrid from "@/components/store/ArchitecturalGrid";
import BatchGuarantee from "@/components/store/BatchGuarantee";
import ArtisanDossier from "@/components/store/ArtisanDossier";

export default async function Home() {
  return (
    <main className="min-h-screen bg-white text-[#0f0f0f]">
      <Hero />
      <Marquee />
      <ArchitecturalGrid />
      <BatchGuarantee />
      <ArtisanDossier />
    </main>
  );
}
