import Hero from "@/components/store/Hero";
import ObjectOfTheEdition from "@/components/store/ObjectOfTheEdition";
import ArchitecturalGrid from "@/components/store/ArchitecturalGrid";
import FieldLoop from "@/components/store/FieldLoop";
import ArtisanDossier from "@/components/store/ArtisanDossier";
import BatchGuarantee from "@/components/store/BatchGuarantee";

// 6 sections (was 9). Polène-tier density. Dropped:
// - Marquee   (announcement strip — duplicates TopStrip in (store)/layout)
// - Families  (category overview — redundant with ArchitecturalGrid grid)
// - HousePromises (3-promise strip — duplicates BatchGuarantee)
export default async function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <Hero />
      <ObjectOfTheEdition />
      <ArchitecturalGrid />
      <FieldLoop />
      <ArtisanDossier />
      <BatchGuarantee />
    </main>
  );
}
