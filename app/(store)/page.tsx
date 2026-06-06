import Hero from "@/components/store/Hero";
import ArchitecturalGrid from "@/components/store/ArchitecturalGrid";
import FieldLoop from "@/components/store/FieldLoop";
import ArtisanDossier from "@/components/store/ArtisanDossier";
import BatchGuarantee from "@/components/store/BatchGuarantee";
import AtelierOrigin from "@/components/store/AtelierOrigin";
import HousePromises from "@/components/store/HousePromises";
import HeritageJournal from "@/components/store/HeritageJournal";

export default async function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <Hero />
      <ArchitecturalGrid variant="featured" />
      <AtelierOrigin />
      <ArtisanDossier />
      <BatchGuarantee />
      <ArchitecturalGrid variant="full" />
      <FieldLoop />
      <HousePromises />
      <HeritageJournal />
    </main>
  );
}
