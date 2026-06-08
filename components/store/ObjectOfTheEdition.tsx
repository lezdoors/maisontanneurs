import Image from "next/image";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { STATIC_PRODUCTS, mergeWithStatic } from "@/lib/products";
import { HIDDEN_SKUS, HIDDEN_SKUS_ARRAY } from "@/lib/hidden-skus";
import { bust } from "@/lib/image-url";
import { productImageClass } from "@/lib/product-image-presentation";
import { productListImage, selectObjectOfEdition } from "@/lib/landing-product-curation";
import type { Product } from "@/lib/supabase/types";

// LT2 register: F5F5F5 plate frame, no chrome borders, serif italic eyebrow,
// massive serif title, italic poetic subhead, just 2 spec rows (no SKU
// fingerprint, no §02 prefix, no full-width corner-to-corner lines).

function firstVisibleStatic(): Product | null {
  return selectObjectOfEdition(
    (STATIC_PRODUCTS as Product[]).filter(
      (p) => !HIDDEN_SKUS.has(p.slug) && p.status === "available",
    ),
  );
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
      .limit(24);
    const merged = mergeWithStatic((data ?? []) as Product[]).filter(
      (p) => !HIDDEN_SKUS.has(p.slug) && p.status === "available",
    );
    return selectObjectOfEdition(merged) ?? firstVisibleStatic();
  } catch {
    return firstVisibleStatic();
  }
}

export default async function ObjectOfTheEdition() {
  const p = await loadFeatured();
  if (!p) return null;

  const hero = productListImage(p);
  const material = p.materials?.[0] ?? "Full-Grain Bovine";

  return (
    <section
      id="object-of-the-edition"
      aria-label="Object of the edition"
      className="w-full bg-[var(--color-paper)] text-[var(--color-ink)]"
    >
      <div
        className="mx-auto max-w-[1480px] grid grid-cols-1 md:grid-cols-12 items-center"
        style={{
          padding: "clamp(72px,10vw,136px) clamp(24px,6vw,80px)",
          gap: "clamp(44px,6vw,88px)",
        }}
      >
        <Link
          href={`/products/${p.slug}`}
          className="mt-product-frame mt-product-frame--hero md:col-span-7 group block"
          style={{
            aspectRatio: "5 / 4",
            position: "relative",
          }}
        >
          {hero ? (
            <Image
              src={bust(hero)}
              alt={p.title}
              fill
              priority
              sizes="(min-width: 768px) 58vw, 100vw"
              className={productImageClass(hero)}
              style={{
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                color: "var(--color-ink-soft)",
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                letterSpacing: "0.18em",
              }}
            >
              PLATE PENDING
            </div>
          )}
        </Link>

        <div className="md:col-span-5 flex flex-col">
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "12px",
              letterSpacing: "0.02em",
              color: "var(--color-ink-soft)",
              marginBottom: "32px",
            }}
          >
            Object of the Edition
          </p>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(40px, 5vw, 80px)",
              lineHeight: 1.04,
              letterSpacing: "-0.005em",
              color: "var(--color-ink)",
              margin: 0,
              textWrap: "balance",
            }}
          >
            {p.title}
            <span style={{ fontStyle: "italic", opacity: 0.5 }}>.</span>
          </h2>

          <p
            style={{
              marginTop: "28px",
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(16px, 1.4vw, 19px)",
              lineHeight: 1.6,
              color: "var(--color-ink-soft)",
              maxWidth: "44ch",
            }}
          >
            {p.description ??
              "The cornerstone of the current edition. Hand-cut, saddle-stitched, edge-burnished in the Marrakech atelier."}
          </p>

          <div className="mt-11 space-y-3 border-y border-[color:var(--color-rule)] py-5">
            <SpecRow k="Material" v={material} />
            <SpecRow
              k="Edition"
              v={`${String(p.available_quantity).padStart(2, "0")} available`}
            />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={`/products/${p.slug}`}
              className="inline-flex items-center gap-3 transition-opacity hover:opacity-80"
              style={{
                background: "var(--color-ink)",
                color: "var(--color-paper)",
                padding: "15px 30px",
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              See the piece →
            </Link>
            <Link
              href="/atelier"
              className="inline-flex items-center gap-3 transition-opacity hover:opacity-60"
              style={{
                color: "var(--color-ink)",
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                padding: "15px 4px",
                borderBottom: "1px solid var(--color-ink)",
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
    <div className="flex items-baseline justify-between gap-6">
      <dt
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "11px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--color-ink-soft)",
        }}
      >
        {k}
      </dt>
      <dd
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "16px",
          color: "var(--color-ink)",
        }}
      >
        {v}
      </dd>
    </div>
  );
}
