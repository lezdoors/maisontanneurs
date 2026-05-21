// ONE-SHOT admin endpoint — performs the Storage rename + DB migration to
// canonical hero naming (<slug>-scale.webp / -pdp-white.webp / -archive-N.webp).
// Gated by X-Admin-Token header matching env ADMIN_RENAME_TOKEN.
//
// THIS ROUTE IS REMOVED IN THE FOLLOWUP COMMIT. Do not extend or reuse.

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BUCKET = "products";

const MOVES: Array<[string, string]> = [
  ["drop-01/heritage-rucksack-01-v2.webp", "drop-01/heritage-rucksack-scale.webp"],
  ["drop-01/heritage-rucksack-02-v2.webp", "drop-01/heritage-rucksack-archive-1.webp"],
  ["drop-01/heritage-rucksack-03.webp", "drop-01/heritage-rucksack-archive-2.webp"],
  ["drop-01/black-stitched-backpack-01.webp", "drop-01/black-stitched-backpack-pdp-white.webp"],
  ["drop-01/black-stitched-backpack-02.webp", "drop-01/black-stitched-backpack-archive-1.webp"],
  ["drop-01/black-stitched-backpack-03.webp", "drop-01/black-stitched-backpack-archive-2.webp"],
  ["drop-01/black-stitched-backpack-04.webp", "drop-01/black-stitched-backpack-archive-3.webp"],
  ["drop-01/black-stitched-backpack-05.webp", "drop-01/black-stitched-backpack-archive-4.webp"],
  ["drop-01/cognac-brogue-backpack-01.webp", "drop-01/cognac-brogue-backpack-pdp-white.webp"],
  ["drop-01/cognac-brogue-backpack-02.webp", "drop-01/cognac-brogue-backpack-archive-1.webp"],
  ["drop-01/cognac-brogue-backpack-03.webp", "drop-01/cognac-brogue-backpack-archive-2.webp"],
  ["drop-01/classic-cognac-satchel-01.webp", "drop-01/classic-cognac-satchel-pdp-white.webp"],
  ["drop-01/classic-cognac-satchel-02.webp", "drop-01/classic-cognac-satchel-archive-1.webp"],
  ["drop-01/classic-cognac-satchel-03.webp", "drop-01/classic-cognac-satchel-archive-2.webp"],
  ["drop-01/classic-cognac-satchel-04.webp", "drop-01/classic-cognac-satchel-archive-3.webp"],
  ["drop-01/woven-leather-backpack-01.webp", "drop-01/woven-leather-backpack-pdp-white.webp"],
  ["drop-01/woven-leather-backpack-02.webp", "drop-01/woven-leather-backpack-archive-1.webp"],
  ["drop-01/vintage-buckle-backpack-01.webp", "drop-01/vintage-buckle-backpack-pdp-white.webp"],
  ["drop-01/vintage-buckle-backpack-02.webp", "drop-01/vintage-buckle-backpack-archive-1.webp"],
];

const STORAGE_BASE_PATH = "storage/v1/object/public/products/";

const DB_UPDATES: Array<{ slug: string; images: string[]; statusUpdate?: { status: string; featured: boolean } }> = [
  {
    slug: "heritage-rucksack",
    images: [
      "drop-01/heritage-rucksack-scale.webp",
      "drop-01/heritage-rucksack-archive-1.webp",
      "drop-01/heritage-rucksack-archive-2.webp",
    ],
  },
  {
    slug: "rolltop-daypack",
    images: [],
    statusUpdate: { status: "draft", featured: false },
  },
  {
    slug: "black-stitched-backpack",
    images: [
      "drop-01/black-stitched-backpack-pdp-white.webp",
      "drop-01/black-stitched-backpack-archive-1.webp",
      "drop-01/black-stitched-backpack-archive-2.webp",
      "drop-01/black-stitched-backpack-archive-3.webp",
      "drop-01/black-stitched-backpack-archive-4.webp",
    ],
  },
  {
    slug: "cognac-brogue-backpack",
    images: [
      "drop-01/cognac-brogue-backpack-pdp-white.webp",
      "drop-01/cognac-brogue-backpack-archive-1.webp",
      "drop-01/cognac-brogue-backpack-archive-2.webp",
    ],
  },
  {
    slug: "classic-cognac-satchel",
    images: [
      "drop-01/classic-cognac-satchel-pdp-white.webp",
      "drop-01/classic-cognac-satchel-archive-1.webp",
      "drop-01/classic-cognac-satchel-archive-2.webp",
      "drop-01/classic-cognac-satchel-archive-3.webp",
    ],
  },
  {
    slug: "woven-leather-backpack",
    images: [
      "drop-01/woven-leather-backpack-pdp-white.webp",
      "drop-01/woven-leather-backpack-archive-1.webp",
    ],
  },
  {
    slug: "vintage-buckle-backpack",
    images: [
      "drop-01/vintage-buckle-backpack-pdp-white.webp",
      "drop-01/vintage-buckle-backpack-archive-1.webp",
    ],
  },
];

export async function POST(req: Request) {
  const token = req.headers.get("x-admin-token");
  const expected = process.env.ADMIN_RENAME_TOKEN;
  if (!expected || token !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "supabase env missing on runtime" }, { status: 500 });
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  // Extend status enum to allow 'draft' before the DB update can set it.
  // SQL execution via Supabase requires either a DB-level pg call or RPC;
  // here we use the .from('').rpc('exec_sql', ...) pattern when available.
  // If exec_sql isn't installed, the rolltop status flip will fail — fall
  // back to setting status='reserved' which is already in the enum.
  let draftEnumOk = false;
  try {
    const alterSql =
      "alter table products drop constraint if exists products_status_check; " +
      "alter table products add constraint products_status_check check (status in ('available','sold','reserved','draft'));";
    const r = await supabase.rpc("exec_sql", { sql: alterSql });
    draftEnumOk = !r.error;
  } catch {
    draftEnumOk = false;
  }

  const storageResults: Array<{ from: string; to: string; status: string }> = [];
  for (const [from, to] of MOVES) {
    const { error } = await supabase.storage.from(BUCKET).move(from, to);
    if (error) {
      const lowerMsg = error.message.toLowerCase();
      const benign = lowerMsg.includes("not found") || lowerMsg.includes("already exists");
      storageResults.push({ from, to, status: benign ? "skipped:" + error.message : "fail:" + error.message });
    } else {
      storageResults.push({ from, to, status: "moved" });
    }
  }

  const dbResults: Array<{ slug: string; status: string }> = [];
  for (const u of DB_UPDATES) {
    const fullUrls = u.images.map((p) => `${url}/${STORAGE_BASE_PATH}${p}`);
    const patch: Record<string, unknown> = { images: fullUrls };
    if (u.statusUpdate) {
      patch.status = draftEnumOk ? u.statusUpdate.status : "reserved";
      patch.featured = u.statusUpdate.featured;
    }
    const { error } = await supabase.from("products").update(patch).eq("slug", u.slug);
    if (error) dbResults.push({ slug: u.slug, status: "fail:" + error.message });
    else dbResults.push({ slug: u.slug, status: "updated" });
  }

  return NextResponse.json({
    ok: true,
    draftEnumExtended: draftEnumOk,
    storageMoves: storageResults,
    dbUpdates: dbResults,
  });
}
