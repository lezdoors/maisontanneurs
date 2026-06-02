const FEED_URL =
  process.env.FEED_URL || "https://maisontanneurs.com/feed/products.xml";

export {};

const PRIORITY_SKUS = [
  "atlas-weekender-cognac",
  "atlas-kilim-rucksack",
  "medina-saddlebag-tooled-cognac",
  "oasis-weekender-oxblood",
  "expedition-rolltop-noir",
  "atlas-field-briefcase",
];

function decodeXml(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&")
    .trim();
}

function getField(itemXml: string, name: string): string {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = itemXml.match(
    new RegExp(`<(?:g:)?${escaped}>([\\s\\S]*?)<\\/(?:g:)?${escaped}>`, "i"),
  );
  return match ? decodeXml(match[1]) : "";
}

async function headOk(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    if (res.ok) return true;
    const getRes = await fetch(url, { method: "GET", redirect: "follow" });
    return getRes.ok;
  } catch {
    return false;
  }
}

async function main() {
  const res = await fetch(FEED_URL, { redirect: "follow" });
  if (!res.ok) {
    throw new Error(`Feed returned ${res.status}: ${FEED_URL}`);
  }

  const xml = await res.text();
  const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g)).map(
    (match) => match[1],
  );
  const byId = new Map(items.map((item) => [getField(item, "id"), item]));
  const failures: string[] = [];

  if (items.length < 6) failures.push(`feed has only ${items.length} items`);

  for (const sku of PRIORITY_SKUS) {
    const item = byId.get(sku);
    if (!item) {
      failures.push(`missing priority SKU ${sku}`);
      continue;
    }

    const requiredFields = [
      "title",
      "description",
      "link",
      "image_link",
      "availability",
      "condition",
      "price",
      "brand",
      "product_type",
    ];
    for (const field of requiredFields) {
      if (!getField(item, field)) failures.push(`${sku} missing ${field}`);
    }

    if (getField(item, "availability") !== "in stock") {
      failures.push(`${sku} availability is ${getField(item, "availability")}`);
    }
    if (!/^\d+\.\d{2} USD$/.test(getField(item, "price"))) {
      failures.push(`${sku} price is malformed: ${getField(item, "price")}`);
    }
    if (getField(item, "brand") !== "Maison Tanneurs") {
      failures.push(`${sku} brand is ${getField(item, "brand")}`);
    }

    const image = getField(item, "image_link");
    if (image && !(await headOk(image))) {
      failures.push(`${sku} image not reachable: ${image}`);
    }
  }

  if (failures.length > 0) {
    console.error("Live feed verification failed");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log("Live feed verified");
  console.log(`url=${FEED_URL}`);
  console.log(`items=${items.length}`);
  console.log(`priority_skus=${PRIORITY_SKUS.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
