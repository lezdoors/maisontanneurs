import Image from "next/image";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { STATIC_PRODUCTS } from "@/lib/products";
import { HIDDEN_SKUS, HIDDEN_SKUS_ARRAY } from "@/lib/hidden-skus";
import type { Product } from "@/lib/supabase/types";

function firstVisibleStatic(): Product | null {
  for (const p of STATIC_PRODUCTS as Product[]) {
    if (!HIDDEN_SKUS.has(p.slug)) return p;
  }
  return null;
}

async function loadFeatured(): Promise<Product | null> {
  try {
    const supabase = await createServerSupabase();
    if (!supabase) return firstVisibleStatic();

    const hiddenList = `(${HIDDEN_SKUS_ARRAY.join(",")})`;

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("status", "available")
      .eq("featured", true)
      .not("slug", "in", hiddenList)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return (data as Product) ?? firstVisibleStatic();
  } catch {
    return firstVisibleStatic();
  }
}

export default async function ObjectOfTheEdition() {
  const p = await loadFeatured();
  if (!p) return null;

  const hero = p.images?.[0];
  const material = p.materials?.[0] ?? "Full-Grain Bovine";
  const skuTag = p.slug.toUpperCase();

  return (
    <section
      aria-label="Object of the edition"
      className="w-full bg-[var(--color-paper)] text-[var(--color-ink)] border-b border-[var(--color-rule)] py-[clamp(56px,8vw,128px)]"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 border-t border-[#e5e5e5]">
        {/* IMAGE — left 6 cols, full-bleed vitrine, source-respecting */}
        <Link
          href={`/products/${p.slug}`}
          className="md:col-span-6 relative bg-white block group overflow-hidden"
          style={{ aspectRatio: "1 / 1" }}
        >
          {hero ? (
            <Image
              src={hero}
              alt={p.title}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-[1200ms]"
              style={{
                transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
                // Crop past the ~25-46px Higgsfield letterbox bars baked into
                // the source webps. See docs/PRODUCT-IMAGES-MANIFEST.md.
                transform: "scale(1.04)",
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[#0f0f0f]/40 tech-meta">
              PLATE PENDING
            </div>
          )}
        </Link>

        {/* SPECS — right 6 cols */}
        <div className="md:col-span-6 md:border-l border-[#e5e5e5] px-6 py-10 md:py-14 flex flex-col justify-center">
          <div className="flex items-center gap-4">
            <span className="tech-label opacity-60">§02</span>
            <span className="h-px w-10 bg-[#0f0f0f]/30" />
            <span className="tech-label">Object of the Edition</span>
          </div>

          <h2
            className="display-xxl mt-8"
            style={{ fontSize: "clamp(40px, 5.2vw, 88px)" }}
          >
            {p.title}
            <span className="opacity-40">.</span>
          </h2>

          <p
            className="mt-6 leading-relaxed text-[#0f0f0f]/75"
            style={{ fontSize: "14px", letterSpacing: "-0.01em", maxWidth: "44ch" }}
          >
            {p.description ??
              "The cornerstone of the current edition. Hand-cut, saddle-stitched, edge-burnished in the Marrakech Medina. Numbered, signed, never restocked."}
          </p>

          {/* Aether-style spec block: single inset hairline top + bottom,
              breathing space between rows instead of dividers. */}
          <dl className="mt-10 relative">
            <div className="h-px bg-[#e5e5e5] mx-2" aria-hidden />
            <SpecRow k="SKU" v={skuTag} />
            <SpecRow k="Material" v={material} />
            <SpecRow
              k="Edition"
              v={`04 / ${String(p.available_quantity).padStart(3, "0")}`}
            />
            <SpecRow k="Cycle" v="14 Days / Object" />
            <div className="h-px bg-[#e5e5e5] mx-2" aria-hidden />
          </dl>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href={`/products/${p.slug}`}
              className="inline-flex h-12 items-center justify-center px-7 hover:opacity-80"
              style={{
                background: "#0f0f0f",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Acquire →
            </Link>
            <Link
              href="/about"
              className="inline-flex h-12 items-center justify-center border border-[#0f0f0f] px-7 text-[#0f0f0f] hover:opacity-60"
              style={{
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Read the Dossier
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SpecRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between py-3.5">
      <dt className="tech-label opacity-60">{k}</dt>
      <dd className="tech-meta">{v}</dd>
    </div>
  );
}
