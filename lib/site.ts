export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://maisontanneurs.com";

export const BRAND_NAME = "Maison Tanneurs";
export const BRAND_DESCRIPTION =
  "Maison Tanneurs is a Marrakech leather house making hand-stitched full-grain leather bags with solid brass hardware, direct atelier shipping, and small-batch editions.";

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}

export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
