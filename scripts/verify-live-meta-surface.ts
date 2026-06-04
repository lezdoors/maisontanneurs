const SITE_URL = (process.env.SITE_URL || "https://maisontanneurs.com").replace(
  /\/$/,
  "",
);

export {};

const PIXEL_ID = "26891834623830253";
const DOMAIN_VERIFICATION = "l5rwxlj1ubuvwihf4omg2hpxip51ck";

const ROUTES = [
  "/",
  "/products/atlas-weekender-cognac",
  "/products/atlas-kilim-rucksack",
  "/products/medina-saddlebag-tooled-cognac",
  "/products/oasis-weekender-oxblood",
  "/products/expedition-rolltop-noir",
  "/products/atlas-field-briefcase",
  "/checkout/pay",
];

async function fetchHtml(path: string): Promise<{ status: number; html: string }> {
  const res = await fetch(`${SITE_URL}${path}`, { redirect: "follow" });
  const html = await res.text();
  return { status: res.status, html };
}

async function main() {
  const failures: string[] = [];

  for (const route of ROUTES) {
    const { status, html } = await fetchHtml(route);
    if (status !== 200) {
      failures.push(`${route} returned ${status}`);
      continue;
    }

    if (!html.includes(PIXEL_ID)) {
      failures.push(`${route} missing Meta Pixel ID ${PIXEL_ID}`);
    }

    if (!html.includes(DOMAIN_VERIFICATION)) {
      failures.push(`${route} missing Meta domain verification token`);
    }

    if (route.startsWith("/products/")) {
      const slug = route.split("/").pop() || "";
      if (!html.includes(slug)) {
        failures.push(`${route} missing slug marker ${slug}`);
      }
    }
  }

  if (failures.length > 0) {
    console.error("Live Meta surface verification failed");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log("Live Meta surface verified");
  console.log(`site=${SITE_URL}`);
  console.log(`routes=${ROUTES.length}`);
  console.log(`pixel=${PIXEL_ID}`);
  console.log("domainVerification=present");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
