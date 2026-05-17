import Hero from "@/components/store/Hero";
import DropGrid from "@/components/store/DropGrid";

export default async function Home() {
  return (
    <main className="bg-white">
      <Hero />
      <DropGrid />
    </main>
  );
}
