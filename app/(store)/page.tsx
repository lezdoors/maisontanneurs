import Hero from "@/components/store/Hero";
import ArchitecturalGrid from "@/components/store/ArchitecturalGrid";
import ArtisanDossier from "@/components/store/ArtisanDossier";
import BatchGuarantee from "@/components/store/BatchGuarantee";
import AtelierOrigin from "@/components/store/AtelierOrigin";

// Six deliberate movements — a high-fashion exhibition, not a wall of content.
// Hero (canvas) → the asymmetric archive → the craft → the guarantee (the moat)
// → the full edition → one editorial close. Extra editorial (HeritageJournal,
// HousePromises) lives on /savoir-faire & /atelier; FieldLoop removed (its train
// clip duplicated the hero train still).
export default async function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <Hero />
      <ArchitecturalGrid variant="featured" />
      <ArtisanDossier />
      <BatchGuarantee />
      <ArchitecturalGrid variant="full" />
      <AtelierOrigin />
    </main>
  );
}
