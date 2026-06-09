import type { Craftsman } from "@/lib/supabase/types";

interface CraftStoryProps {
  craftsman?: Craftsman | null;
}

export default function CraftStory({ craftsman }: CraftStoryProps) {
  const benchName = craftsman?.name || "Built at one bench in Marrakech.";

  return (
    <section className="border-t border-stone">
      <div className="px-[clamp(24px,4vw,72px)] py-[clamp(80px,10vw,160px)]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-24">
          {/* Left */}
          <div>
            <span className="eye block mb-6">The Craft</span>
            <h2 className="disp text-[clamp(32px,4vw,56px)] max-w-[18ch]">
              {benchName}
            </h2>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-6 lg:pt-12">
            <p className="body-copy max-w-[52ch]">
              Each bag is cut, skived, saddle-stitched, edge-burnished, lined,
              and fitted by the same pair of hands, start to finish. The saddle
              stitch is sewn with two needles and locked at every pass; if one
              thread wears through, the seam holds.
            </p>
            <p className="body-copy max-w-[52ch]">
              It leaves the bench structured, softens with use, and takes on a
              patina specific to the person carrying it.
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
