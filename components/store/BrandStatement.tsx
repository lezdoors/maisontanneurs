export default function BrandStatement() {
  return (
    <section className="bg-[var(--color-ink)] text-white">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7">
            <div className="text-[11px] tracking-[0.18em] uppercase text-white/55 font-medium mb-5">
              The Maison
            </div>
            <h2 className="font-sans font-light tracking-[-0.012em] text-[clamp(28px,3.4vw,46px)] leading-[1.1] text-white max-w-[20ch]">
              Celebrating Moroccan craft around the world.
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-[14px] leading-[1.7] text-white/75 font-light max-w-[44ch]">
              Nitra is a workshop of nine craftsmen off a narrow street in the
              old medina of Marrakech. We carve cedar, hammer brass, lay
              mother-of-pearl, and weave linen. Each piece carries the
              signature of its maker.
            </p>
            <div className="mt-7 flex items-center gap-8">
              <div>
                <div className="text-[28px] font-light tracking-tight">1974</div>
                <div className="rb-meta text-white/55 mt-1">Workshop founded</div>
              </div>
              <div className="w-px h-9 bg-white/15" />
              <div>
                <div className="text-[28px] font-light tracking-tight">09</div>
                <div className="rb-meta text-white/55 mt-1">Disciplines</div>
              </div>
              <div className="w-px h-9 bg-white/15" />
              <div>
                <div className="text-[28px] font-light tracking-tight">52</div>
                <div className="rb-meta text-white/55 mt-1">Countries shipped</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
