import type { MetadataRoute } from "next";
import { createServerSupabase } from "@/lib/supabase/server";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kechken.com";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/legal/privacy`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE}/legal/terms`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE}/legal/returns`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE}/legal/shipping`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE}/legal/care`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE}/legal/faq`, changeFrequency: "monthly", priority: 0.5 },
  ];

  let productPaths: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data } = await supabase
        .from("products")
        .select("slug, updated_at")
        .eq("status", "available");
      if (data) {
        productPaths = data.map((p: { slug: string; updated_at: string | null }) => ({
          url: `${SITE}/products/${p.slug}`,
          lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }));
      }
    }
  } catch {
    // Fall back to static paths only if Supabase fails
  }

  return [...staticPaths, ...productPaths];
}
