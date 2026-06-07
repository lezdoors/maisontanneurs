import type { MetadataRoute } from "next";
import { SITE_URL as SITE } from "@/lib/site";

const DISALLOW = ["/_admin", "/api/", "/checkout"];
const AI_CRAWLERS = [
  "Googlebot",
  "GoogleOther",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "CCBot",
  "Applebot",
  "Applebot-Extended",
  "FacebookBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
