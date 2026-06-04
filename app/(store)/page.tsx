import Hero from "@/components/store/Hero";
import AtelierOrigin from "@/components/store/AtelierOrigin";
import ObjectOfTheEdition from "@/components/store/ObjectOfTheEdition";
import ArchitecturalGrid from "@/components/store/ArchitecturalGrid";
import EditorialWorlds from "@/components/store/EditorialWorlds";
import FieldLoop from "@/components/store/FieldLoop";
import ArtisanDossier from "@/components/store/ArtisanDossier";
import BatchGuarantee from "@/components/store/BatchGuarantee";

// Amghar UI/UX pass: keep the real commerce/admin/checkout base, but move the
// homepage toward an editorial Maison Tanneurs launch page — hero → atelier
// proof → object → collection → worlds → process → guarantee.
export default async function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <Hero />
      <AtelierOrigin />
      <ObjectOfTheEdition />
      <ArchitecturalGrid />
      <EditorialWorlds />
      <FieldLoop />
      <ArtisanDossier />
      <BatchGuarantee />
    </main>
  );
}
