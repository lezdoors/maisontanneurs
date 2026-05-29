const SITE = process.env.SITE_URL || "https://maisontanneurs.com";

const START_ROUTES = [
  "/",
  "/products",
  "/about",
  "/contact",
  "/legal/shipping",
  "/legal/returns",
  "/legal/terms",
  "/legal/privacy",
  "/legal/care",
  "/legal/faq",
  "/checkout/pay",
];

const ALLOWED_EXTERNAL_HOSTS = new Set([
  "instagram.com",
  "www.instagram.com",
  "maisontanneurs.com",
  "www.maisontanneurs.com",
]);
const IGNORED_PROTOCOLS = ["mailto:", "tel:", "sms:"];

type LinkRecord = {
  source: string;
  href: string;
};

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

async function fetchHtml(pathOrUrl: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const url = new URL(pathOrUrl, SITE);
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "MaisonTanneursLaunchAudit/1.0" },
    });
    const contentType = response.headers.get("content-type") || "";
    const text = contentType.includes("text/html") ? await response.text() : "";
    return { status: response.status, url: response.url, text };
  } finally {
    clearTimeout(timeout);
  }
}

function linksFromHtml(source: string, html: string): LinkRecord[] {
  return [...html.matchAll(/\s(?:href|action)=["']([^"']+)["']/gi)]
    .map((match) => decodeHtmlEntities(match[1].trim()))
    .filter((href) => href && !href.startsWith("#"))
    .map((href) => ({ source, href }));
}

function isIgnoredHref(href: string) {
  return IGNORED_PROTOCOLS.some((protocol) => href.startsWith(protocol));
}

function isMalformedExternal(href: string) {
  return /^(?:www\.|instagram\.com\/)/i.test(href);
}

function isInternalLink(href: string) {
  if (href.startsWith("/")) return true;
  try {
    const siteUrl = new URL(SITE);
    const hrefUrl = new URL(href);
    const siteHost = siteUrl.hostname.replace(/^www\./, "");
    const hrefHost = hrefUrl.hostname.replace(/^www\./, "");
    return hrefUrl.protocol === siteUrl.protocol && hrefHost === siteHost;
  } catch {
    return false;
  }
}

function normalizeInternalHref(href: string) {
  const url = new URL(href, SITE);
  return `${url.pathname}${url.search}`;
}

async function main() {
  const failures: string[] = [];
  const visitedPages = new Set<string>();
  const discoveredInternalLinks = new Map<string, Set<string>>();
  const externalLinks = new Map<string, Set<string>>();

  for (const route of START_ROUTES) {
    const { status, text } = await fetchHtml(route);
    visitedPages.add(route);
    if (status !== 200) {
      failures.push(`${route} returned ${status}, expected 200`);
      continue;
    }

    for (const link of linksFromHtml(route, text)) {
      if (isIgnoredHref(link.href)) continue;
      if (isMalformedExternal(link.href)) {
        failures.push(`${link.source} has malformed external href "${link.href}"`);
        continue;
      }

      if (isInternalLink(link.href)) {
        const normalized = normalizeInternalHref(link.href);
        if (!discoveredInternalLinks.has(normalized)) discoveredInternalLinks.set(normalized, new Set());
        discoveredInternalLinks.get(normalized)!.add(link.source);
        continue;
      }

      try {
        const url = new URL(link.href);
        if (!ALLOWED_EXTERNAL_HOSTS.has(url.hostname)) {
          failures.push(`${link.source} links to unapproved external host ${url.hostname}`);
        }
        const externalKey = url.toString();
        if (!externalLinks.has(externalKey)) externalLinks.set(externalKey, new Set());
        externalLinks.get(externalKey)!.add(link.source);
      } catch {
        failures.push(`${link.source} has invalid href "${link.href}"`);
      }
    }
  }

  const internalEntries = [...discoveredInternalLinks.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  );

  for (const [href, sources] of internalEntries) {
    if (href.startsWith("/_next/")) continue;
    const { status, url } = await fetchHtml(href);
    if (status < 200 || status >= 400) {
      failures.push(
        `${href} returned ${status}; linked from ${[...sources].sort().join(", ")}`,
      );
    }
    const resolved = new URL(url);
    const site = new URL(SITE);
    if (
      resolved.protocol !== site.protocol ||
      resolved.hostname.replace(/^www\./, "") !== site.hostname.replace(/^www\./, "")
    ) {
      failures.push(`${href} resolves off-site to ${url}`);
    }
  }

  if (failures.length > 0) {
    console.error("=== Public link audit failed ===");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log("=== Public link audit passed ===");
  console.log(`Site: ${SITE}`);
  console.log(`Seed pages checked: ${visitedPages.size}`);
  console.log(`Internal links checked: ${internalEntries.length}`);
  console.log(`External links allowed: ${externalLinks.size}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

export {};
