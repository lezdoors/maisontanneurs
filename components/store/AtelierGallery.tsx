import InteractiveBentoGallery from "@/components/ui/interactive-bento-gallery";

// Mix of the new atelier stills (public/atelier/new-batch/*) and the existing
// atelier videos already in public/videos/. Includes the raw "In Their Hands"
// clip that plays elsewhere on the page.
const mediaItems = [
  {
    id: 1,
    type: "image",
    title: "The Cognac Tote",
    desc: "Full-grain cognac, carried in a white look.",
    url: "/atelier/new-batch/mt-atelier-cognac-tote-white-look-portrait.webp",
    span: "row-span-5 sm:col-span-1 sm:row-span-3 md:col-span-1 md:row-span-6",
  },
  {
    id: 2,
    type: "video",
    title: "Colonnade Walk",
    desc: "Through the arches, object in hand.",
    url: "/videos/maison-film-colonnade-walk.mp4",
    span: "row-span-4 sm:col-span-2 sm:row-span-3 md:col-span-2 md:row-span-3",
  },
  {
    id: 3,
    type: "image",
    title: "Arched Door",
    desc: "A robed figure at a carved Marrakech doorway.",
    url: "/atelier/new-batch/mt-atelier-arched-door-robed-figure-portrait.webp",
    span: "row-span-4 sm:col-span-1 sm:row-span-3 md:col-span-1 md:row-span-3",
  },
  {
    id: 4,
    type: "video",
    title: "In Their Hands",
    desc: "Eleven seconds, unscripted, at the bench.",
    url: "/videos/atelier-in-their-hands.mp4",
    span: "row-span-5 sm:col-span-1 sm:row-span-4 md:col-span-1 md:row-span-5",
  },
  {
    id: 5,
    type: "image",
    title: "Kilim Duffle",
    desc: "Leather-framed kilim against a red door.",
    url: "/atelier/new-batch/mt-atelier-kilim-duffle-red-door-landscape.webp",
    span: "row-span-3 sm:col-span-2 sm:row-span-2 md:col-span-2 md:row-span-3",
  },
  {
    id: 6,
    type: "image",
    title: "Red Wall",
    desc: "Tailored cream, a mini bag, a wall of ochre.",
    url: "/atelier/new-batch/mt-atelier-red-wall-model-mini-bag-portrait.webp",
    span: "row-span-4 sm:col-span-1 sm:row-span-3 md:col-span-1 md:row-span-5",
  },
  {
    id: 7,
    type: "video",
    title: "The White Suit",
    desc: "Object and tailoring, one frame.",
    url: "/videos/hero-model-white-suit-bag.mp4",
    span: "row-span-4 sm:col-span-2 sm:row-span-3 md:col-span-2 md:row-span-3",
  },
  {
    id: 8,
    type: "image",
    title: "Cloaked Artisan",
    desc: "At the bench, hooded against the light.",
    url: "/atelier/new-batch/mt-atelier-cloaked-artisan-bench-landscape.webp",
    span: "row-span-3 sm:col-span-1 sm:row-span-2 md:col-span-2 md:row-span-3",
  },
  {
    id: 9,
    type: "image",
    title: "Red Desert",
    desc: "A horseman, smoke, the far south.",
    url: "/atelier/new-batch/mt-atelier-red-desert-horseman-smoke-portrait.webp",
    span: "row-span-4 sm:col-span-1 sm:row-span-3 md:col-span-1 md:row-span-4",
  },
  {
    id: 10,
    type: "video",
    title: "Atelier Loop",
    desc: "The workshop, on a quiet loop.",
    url: "/videos/atelier-loop.mp4",
    span: "row-span-3 sm:col-span-1 sm:row-span-2 md:col-span-1 md:row-span-3",
  },
];

export default function AtelierGallery() {
  return (
    <section
      id="atelier-gallery"
      aria-label="Atelier"
      className="w-full bg-[var(--color-bg)] text-[var(--color-ink)] border-t border-[#e5e5e5]"
    >
      <div className="border-b border-[#e5e5e5]">
        <div className="px-6 py-5 flex flex-wrap items-end justify-between gap-y-4">
          <div className="flex items-end gap-6">
            <span className="tech-label opacity-60">§05.5</span>
            <h2
              className="leading-none font-medium"
              style={{ fontSize: "clamp(28px, 3.6vw, 36px)", letterSpacing: "-0.03em" }}
            >
              Atelier
            </h2>
          </div>
          <span className="tech-meta opacity-70 hidden md:inline">
            FOURTEEN DAYS · SEVEN HANDS · MARRAKECH
          </span>
        </div>
      </div>

      <InteractiveBentoGallery
        title="Inside the Atelier"
        description="Drag to rearrange · tap any frame to expand."
        mediaItems={mediaItems}
      />
    </section>
  );
}
