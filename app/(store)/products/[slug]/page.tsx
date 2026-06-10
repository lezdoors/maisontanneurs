import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { Product } from "@/lib/supabase/types";
import { STATIC_PRODUCTS } from "@/lib/products";
import { HIDDEN_SKUS, HIDDEN_SKUS_ARRAY } from "@/lib/hidden-skus";
import { normalizeProductFamilies, withProductFamily } from "@/lib/product-taxonomy";
import { formatPrice } from "@/lib/utils";
import ProductGallery from "@/components/product/ProductGallery";
import ProductDetails from "@/components/product/ProductDetails";
import CraftStory from "@/components/product/CraftStory";
import ProductCard from "@/components/store/ProductCard";
import {
  orderProductGalleryImages,
  selectProductHeroImage,
} from "@/lib/product-image-presentation";
import { productHoverImage } from "@/lib/landing-product-curation";
import { SITE_URL, absoluteUrl, jsonLdScript } from "@/lib/site";

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

      if (!error && data) return withProductFamily(data as Product);
    }
  } catch {
    // Supabase unavailable
  }

  // Fallback to static
  const fallback =
    STATIC_PRODUCTS.find(
      (p) => p.slug === slug && p.status === "available" && !HIDDEN_SKUS.has(p.slug),
    ) || null;

  return fallback ? withProductFamily(fallback as Product) : null;
}

async function getRelatedProducts(
  category: string,
  excludeSlug: string,
): Promise<Product[]> {
  const TARGET = 3;

  try {
    const supabase = await createServerSupabase();

    if (supabase) {
      const hiddenList = `(${HIDDEN_SKUS_ARRAY.join(",")})`;
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "available")
        .neq("slug", excludeSlug)
        .not("slug", "in", hiddenList)
        .order("created_at", { ascending: false })
        .limit(24);

      if (!error && data && data.length > 0) {
        const all = normalizeProductFamilies(data as Product[]);
        const sameCategory = all.filter((p) => p.category === category);
        const otherCategory = all.filter((p) => p.category !== category);
        return [...sameCategory, ...otherCategory].slice(0, TARGET);
      }
    }
  } catch {
    // Supabase unavailable
  }

  // Fallback to static
  const staticAll = normalizeProductFamilies(STATIC_PRODUCTS as Product[]).filter(
    (p) =>
      p.slug !== excludeSlug &&
      p.status === "available" &&
      p.featured &&
      !HIDDEN_SKUS.has(p.slug),
  );
  const sameCategory = staticAll.filter((p) => p.category === category);
  const otherCategory = staticAll.filter((p) => p.category !== category);
  return [...sameCategory, ...otherCategory].slice(0, TARGET);
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
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: product.title,
      description: product.description || `${product.title}. Handcrafted in Marrakech.`,
      url: `/products/${product.slug}`,
      images: selectProductHeroImage(product) ? [selectProductHeroImage(product)!] : [],
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
  const galleryImages = orderProductGalleryImages(product);

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description:
      product.description || `${product.title}. Handcrafted in Marrakech.`,
    image: galleryImages.slice(0, 5).map((image) => absoluteUrl(image)),
    sku: product.slug,
    brand: { "@type": "Brand", name: "Maison Tanneurs" },
    category: product.category,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${product.slug}`,
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
      <script
        id={`product-ld-${product.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(productLd),
        }}
      />
      {/* Product layout: gallery + details */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] pt-[clamp(88px,10vw,116px)]">
        {/* Gallery — left */}
        <ProductGallery images={galleryImages} title={product.title} />

        {/* Details — right */}
        <ProductDetails product={product} />
      </div>

      {/* Craft story */}
      <CraftStory craftsman={product.craftsmen} />

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
                image={selectProductHeroImage(p) || "/products/product-04.png"}
                hoverImage={productHoverImage(p)}
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
