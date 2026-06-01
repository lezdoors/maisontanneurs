// One-shot: populate Asset Version on Airtable Product Assets so that
// every (Product, Asset Type) sibling group gets v1..vN. Without this,
// the Canonical Filename formula collapses every sibling to v01 and
// rename-to-canon.ts can't actually rename them (collisions).
//
// Ordering within a group: stable by record creation time (Airtable's
// implicit default). Existing non-null Asset Version values are kept.
//
// Run AFTER Phase A schema is in place. Idempotent.

import * as dotenv from "dotenv";
import { join } from "node:path";
import { homedir } from "node:os";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: join(homedir(), "Downloads", "airtable-hermes.env") });

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY ?? "";
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID ?? "";

interface AssetRec {
  id: string;
  createdTime?: string;
  fields: {
    Filename?: string;
    "Asset Type"?: string;
    "Asset Version"?: number;
    Product?: string[];
  };
}

async function getAll(): Promise<AssetRec[]> {
  const out: AssetRec[] = [];
  let offset: string | undefined;
  do {
    const params = new URLSearchParams({ pageSize: "100" });
    if (offset) params.set("offset", offset);
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Product%20Assets?${params}`,
      { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` } },
    );
    if (!res.ok) throw new Error(`Airtable ${res.status}: ${await res.text()}`);
    const body = (await res.json()) as { records: AssetRec[]; offset?: string };
    out.push(...body.records);
    offset = body.offset;
  } while (offset);
  return out;
}

async function patchChunked(
  records: { id: string; fields: Record<string, unknown> }[],
): Promise<void> {
  for (let i = 0; i < records.length; i += 10) {
    const chunk = records.slice(i, i + 10);
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Product%20Assets`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ records: chunk }),
      },
    );
    if (!res.ok) throw new Error(`Airtable PATCH ${res.status}: ${await res.text()}`);
  }
}

async function main(): Promise<void> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error("Missing env");
  }
  const dryRun = process.argv.includes("--dry-run");
  const all = await getAll();
  console.log(`[fetched] ${all.length} assets`);

  // Group by Product||Type
  const groups = new Map<string, AssetRec[]>();
  for (const a of all) {
    const product = a.fields.Product?.[0] ?? "_none";
    const type = a.fields["Asset Type"] ?? "_none";
    const key = `${product}||${type}`;
    const arr = groups.get(key) ?? [];
    arr.push(a);
    groups.set(key, arr);
  }

  const patches: { id: string; fields: Record<string, unknown> }[] = [];
  for (const [, members] of groups) {
    // Stable sort by createdTime (oldest first). Airtable returns createdTime on every record.
    members.sort((a, b) => (a.createdTime ?? "").localeCompare(b.createdTime ?? ""));
    members.forEach((m, idx) => {
      const wanted = idx + 1;
      if (m.fields["Asset Version"] !== wanted) {
        patches.push({ id: m.id, fields: { "Asset Version": wanted } });
      }
    });
  }

  console.log(
    `[plan] ${patches.length} records ${dryRun ? "would be" : "will be"} updated`,
  );
  if (dryRun || patches.length === 0) return;
  await patchChunked(patches);
  console.log(`[done] ${patches.length} versions assigned`);
}

main();
