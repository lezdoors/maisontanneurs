import type { MetadataRoute } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import { HIDDEN_SKUS, HIDDEN_SKUS_ARRAY } from "@/lib/hidden-skus";
import { LOCALES, withLocale } from "@/lib/i18n";

import { SITE_URL as SITE } from "@/lib/site";

function localizedUrl(path: string, locale: (typeof LOCALES)[number]) {
  return `${SITE}${withLocale(path, locale)}`;
}

function localizeEntries(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  return entries.flatMap((entry) =>
    LOCALES.map((locale) => ({
      ...entry,
      url: localizedUrl(new URL(entry.url).pathname, locale),
    })),
  );
}

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/atelier`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/contact`, changeFrequency: "monthly", priority: 0.5 },
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
      const hiddenList = `(${HIDDEN_SKUS_ARRAY.join(",")})`;
      const { data } = await supabase
        .from("products")
        .select("slug, updated_at")
        .eq("status", "available")
        .eq("featured", true)
        .not("slug", "in", hiddenList);
      if (data) {
        productPaths = data
          .filter((p: { slug: string }) => !HIDDEN_SKUS.has(p.slug))
          .map((p: { slug: string; updated_at: string | null }) => ({
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

  return localizeEntries([...staticPaths, ...productPaths]);
}
