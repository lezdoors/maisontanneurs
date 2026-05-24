import Hero from "@/components/store/Hero";
import ArchitecturalGrid from "@/components/store/ArchitecturalGrid";
import ArtisanDossier from "@/components/store/ArtisanDossier";

export default async function Home() {
  return (
    <main className="min-h-screen bg-white text-[#0f0f0f]">
      <Hero />
      <ArchitecturalGrid />
      <ArtisanDossier />
    </main>
  );
}
