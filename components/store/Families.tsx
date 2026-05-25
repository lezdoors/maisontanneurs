import Link from "next/link";

type Family = {
  code: string;
  name: string;
  count: string;
  href: string;
};

const FAMILIES: Family[] = [
  { code: "F.01", name: "Backpack", count: "11 Objects", href: "/products?category=Backpack" },
  { code: "F.02", name: "Crossbody", count: "04 Objects", href: "/products?category=Crossbody" },
  { code: "F.03", name: "Weekender", count: "03 Objects", href: "/products?category=Weekender" },
  { code: "F.04", name: "Tote", count: "01 Object", href: "/products?category=Tote" },
];

export default function Families() {
  return (
    <section
      aria-label="Families"
      className="w-full bg-white text-[#0f0f0f]"
    >
      <div className="border-y border-[#e5e5e5]">
        <div className="px-6 py-5 flex flex-wrap items-end justify-between gap-y-4">
          <div className="flex items-end gap-6">
            <span className="tech-label opacity-60">§03</span>
            <h2
              className="leading-none font-medium"
              style={{
                fontSize: "clamp(28px, 3.6vw, 36px)",
                letterSpacing: "-0.03em",
              }}
            >
              Families — Browse by Form
            </h2>
          </div>
          <span className="tech-meta opacity-70 hidden md:inline">
            04 Families · 19 Objects
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 border-l border-[#e5e5e5]">
        {FAMILIES.map((f) => (
          <FamilyCell key={f.code} family={f} />
        ))}
      </div>
    </section>
  );
}

function FamilyCell({ family }: { family: Family }) {
  return (
    <Link
      href={family.href}
      className="group relative border-r border-b border-[#e5e5e5] bg-white px-5 py-10 md:py-14 flex flex-col justify-between min-h-[260px] hover:bg-[#f9f9f9] transition-colors"
    >
      <span className="tech-meta opacity-50">{family.code}</span>

      <div className="mt-10">
        <h3
          className="font-medium leading-[1.0]"
          style={{
            fontSize: "clamp(32px, 3.4vw, 56px)",
            letterSpacing: "-0.03em",
          }}
        >
          {family.name}
        </h3>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#e5e5e5] pt-3">
          <span className="tech-meta opacity-70">{family.count}</span>
          <span className="tech-label opacity-80 group-hover:opacity-100 group-hover:underline underline-offset-4">
            Browse →
          </span>
        </div>
      </div>
    </Link>
  );
}
