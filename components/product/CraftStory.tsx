import type { Craftsman } from "@/lib/supabase/types";

interface CraftStoryProps {
  craftsman?: Craftsman | null;
  materials: string[];
}

export default function CraftStory({ craftsman, materials }: CraftStoryProps) {
  const artisanName = craftsman?.name || "Master Artisans of Marrakech";
  const materialsText =
    materials.length > 0
      ? materials.join(", ").toLowerCase()
      : "traditional materials";

  return (
    <section className="border-t border-stone">
      <div className="px-[clamp(24px,4vw,72px)] py-[clamp(80px,10vw,160px)]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-24">
          {/* Left */}
          <div>
            <span className="eye block mb-6">The Craft</span>
            <h2 className="disp text-[clamp(32px,4vw,56px)] max-w-[18ch]">
              {artisanName}
            </h2>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-6 lg:pt-12">
            <p className="body-copy max-w-[52ch]">
              Every piece in our collection is the product of generations of
              accumulated knowledge, passed from master to apprentice in the
              workshops of Marrakech. Working with {materialsText}, our artisans
              employ techniques that have remained unchanged for centuries --
              hand-hammering, hand-carving, and hand-setting each element with
              extraordinary precision.
            </p>
            <p className="body-copy max-w-[52ch]">
              The result is furniture that carries the warmth and imperfection of
              the human hand -- subtle variations that no machine could replicate
              and that make each piece genuinely one of a kind.
            </p>

            {craftsman?.bio && (
              <div className="border-t border-stone/20 pt-6 mt-2">
                <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-mineral block mb-3">
                  About the Artisan
                </span>
                <p className="body-copy max-w-[52ch]">{craftsman.bio}</p>
                {craftsman.location && (
                  <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-mineral block mt-3">
                    {craftsman.location}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
