// One-off reconciliation cleanup, 2026-06-10. Run from /Users/ryanz/kechken.
//   node scripts/cleanup-2026-06-10.mjs inspect
//   node scripts/cleanup-2026-06-10.mjs delete-ghosts
//   node scripts/cleanup-2026-06-10.mjs airtable-images <slug> <url1> <url2> ...
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { join } from "node:path";
import { homedir } from "node:os";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: join(homedir(), "Downloads", "airtable-hermes.env") });

const SUPABASE_URL = "https://xbtabpurfavngwmwtawc.supabase.co";
const sb = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const AT_KEY = process.env.AIRTABLE_API_KEY;
const AT_BASE = process.env.AIRTABLE_BASE_ID;

const GHOSTS = [
  "black-stitched-backpack",
  "marrakech-tote-bordeaux",
  "marrakech-tote-noir",
  "medina-crossbody-tassel",
  "rolltop-daypack",
];

async function atFetch(path, init) {
  const res = await fetch(`https://api.airtable.com/v0/${AT_BASE}/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${AT_KEY}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`Airtable ${res.status}: ${await res.text()}`);
  return res.json();
}

async function atRecordBySlug(slug) {
  const q = encodeURIComponent(`{Slug}="${slug}"`);
  const data = await atFetch(`Products?filterByFormula=${q}&maxRecords=2`);
  return data.records?.[0] ?? null;
}

const cmd = process.argv[2];

if (cmd === "inspect") {
  for (const slug of [...GHOSTS, "medina-crossbody-clasp-teal", "vintage-buckle-backpack-chocolate"]) {
    const { data } = await sb.from("products").select("slug,status,featured,images").eq("slug", slug);
    const at = await atRecordBySlug(slug);
    console.log(
      slug,
      "| SB:", data?.length ? `${data[0].status}/${data[0].featured ? "featured" : "-"}/${(data[0].images || []).length}img` : "NO-ROW",
      "| AT:", at ? `rec=${at.id} status=${at.fields["Status"] ?? "?"} site=${at.fields["Site Status"] ?? "?"} copy=${at.fields["Copy Status"] ?? "?"} img=${at.fields["Image Status"] ?? "?"} launch=${at.fields["Launch Ready"] ?? false}` : "NO-RECORD",
    );
  }
} else if (cmd === "delete-ghosts") {
  for (const slug of GHOSTS) {
    const at = await atRecordBySlug(slug);
    if (at) {
      console.log(`SKIP ${slug}: Airtable record exists (${at.id}) — not a ghost, resolve manually`);
      continue;
    }
    const { data, error } = await sb.from("products").delete().eq("slug", slug).select("slug");
    if (error) console.log(`ERROR ${slug}: ${error.message}`);
    else console.log(`DELETED ${slug} (${data.length} row)`);
  }
} else if (cmd === "airtable-images") {
  const slug = process.argv[3];
  const urls = process.argv.slice(4);
  if (!slug || urls.length === 0) throw new Error("usage: airtable-images <slug> <url...>");
  const at = await atRecordBySlug(slug);
  if (!at) throw new Error(`No Airtable record for ${slug}`);
  await atFetch(`Products/${at.id}`, {
    method: "PATCH",
    body: JSON.stringify({ fields: { Images: urls.join("\n"), "Image Status": "Approved" } }),
  });
  console.log(`Airtable ${slug} (${at.id}): Images=${urls.length} lines, Image Status=Approved`);
} else {
  console.error("usage: inspect | delete-ghosts | airtable-images <slug> <url...>");
  process.exit(2);
}
