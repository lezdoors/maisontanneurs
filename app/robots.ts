import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.maisontanneurs.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/_admin", "/api/", "/checkout"] },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
