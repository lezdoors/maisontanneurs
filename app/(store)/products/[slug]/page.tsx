import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { Product } from "@/lib/supabase/types";
import { STATIC_PRODUCTS } from "@/lib/products";
import { HIDDEN_SKUS, HIDDEN_SKUS_ARRAY } from "@/lib/hidden-skus";
import { formatPrice } from "@/lib/utils";
import ProductGallery from "@/components/product/ProductGallery";
import ProductDetails from "@/components/product/ProductDetails";
import CraftStory from "@/components/product/CraftStory";
import ProductCard from "@/components/store/ProductCard";

async function getProduct(slug: string): Promise<Product | null> {
  if (HIDDEN_SKUS.has(slug)) return null;

  try {
    const supabase = await createServerSupabase();

    if (supabase) {
      const { data, error } = await supabase
        .from("products")
        .select("*, craftsmen(*)")
        .eq("slug", slug)
        .eq("status", "available")
        .single();

      if (!error && data) return data as Product;
    }
  } catch {
    // Supabase unavailable
  }

  // Fallback to static
  return (
    STATIC_PRODUCTS.find(
      (p) => p.slug === slug && p.status === "available" && !HIDDEN_SKUS.has(p.slug),
    ) || null
  );
}

async function getRelatedProducts(
  category: string,
  excludeSlug: string,
): Promise<Product[]> {
  try {
    const supabase = await createServerSupabase();

    if (supabase) {
      const hiddenList = `(${HIDDEN_SKUS_ARRAY.join(",")})`;
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "available")
        .eq("category", category)
        .neq("slug", excludeSlug)
        .not("slug", "in", hiddenList)
        .order("created_at", { ascending: false })
        .limit(3);

      if (!error && data && data.length > 0) return data as Product[];
    }
  } catch {
    // Supabase unavailable
  }

  // Fallback to static
  return STATIC_PRODUCTS.filter(
    (p) =>
      p.category === category &&
      p.slug !== excludeSlug &&
      p.status === "available" &&
      p.featured &&
      !HIDDEN_SKUS.has(p.slug),
  ).slice(0, 3);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.title,
    description:
      product.description ||
      `${product.title}. Handcrafted in Marrakech. ${formatPrice(product.price)}.`,
    openGraph: {
      title: product.title,
      description: product.description || `${product.title}. Handcrafted in Marrakech.`,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

export async function generateStaticParams() {
  return STATIC_PRODUCTS.filter(
    (p) => p.status === "available" && p.featured && !HIDDEN_SKUS.has(p.slug),
  ).map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const related = await getRelatedProducts(product.category, product.slug);

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description:
      product.description || `${product.title}. Handcrafted in Marrakech.`,
    image: product.images?.slice(0, 5) ?? [],
    sku: product.slug,
    brand: { "@type": "Brand", name: "Maison Tanneurs" },
    category: product.category,
    offers: {
      "@type": "Offer",
      url: `https://www.maisontanneurs.com/products/${product.slug}`,
      priceCurrency: "USD",
      price: (product.price / 100).toFixed(2),
      availability:
        product.status === "available"
          ? "https://schema.org/InStock"
          : product.status === "sold"
            ? "https://schema.org/OutOfStock"
            : "https://schema.org/PreOrder",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <main>
      <Script
        id={`product-ld-${product.slug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
      >
        {JSON.stringify(productLd)}
      </Script>
      {/* Product layout: gallery + details */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] pt-[120px]">
        {/* Gallery — left */}
        <ProductGallery images={product.images} title={product.title} />

        {/* Details — right */}
        <ProductDetails product={product} />
      </div>

      {/* Craft story */}
      <CraftStory
        craftsman={product.craftsmen}
        materials={product.materials}
      />

      {/* Related products */}
      {related.length > 0 && (
        <section className="border-t border-stone px-[clamp(24px,4vw,72px)] py-[clamp(80px,10vw,160px)]">
          <div className="mb-[clamp(48px,6vw,80px)]">
            <span className="eye block mb-4">You May Also Like</span>
            <h2 className="disp text-[clamp(32px,4vw,56px)]">
              Related Works
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-9 gap-y-[72px]">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                title={p.title}
                price={p.price}
                image={p.images[0] || "/products/product-04.png"}
                slug={p.slug}
                category={p.category}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
