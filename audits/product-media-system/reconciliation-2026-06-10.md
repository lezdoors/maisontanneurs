# Drive ↔ Supabase ↔ Airtable Reconciliation — 2026-06-10

Context: early Claude Code sessions invented product identities from filenames —
the same bag got multiple names, and `-scale` / `-pdp` / `-macro` file-role
suffixes were treated as *different products*. Supabase was seeded from that
mess. The 2026-06-08 cleanup plan resolved the alias groups into the current
`MT-XX-NNN__<slug>` Drive structure. This report reconciles the three surfaces
against today's state and lists the remaining fixes.

Inputs:
- Drive inventory (full file listing, 41 MT folders + 1 confirmed extra), 2026-06-10
- `audits/hero-source-of-truth/hero-source-of-truth-2026-06-10.md` (13:22Z): 35 Supabase rows — 26 PASS / 9 WARN / 0 FAIL
- `lib/hidden-skus.ts`
- `audits/product-media-system/product-source-of-truth-cleanup-plan-2026-06-08.md`

## STATUS — Applied 2026-06-10 PT 08:50

Ryan-approved fixes executed in order, each gated as specified:

**1. medina-crossbody-clasp-teal — WIRED.** Drive `MT-CB-003__` refreshed by Ryan (single Hero-HD + 8 HD gallery + 4 pdp); visually verified 5 frames. `wire-drive-product-set.ts` uploaded Hero→`drop-02/medina-crossbody-clasp-teal-pdp-white.webp` + 8 HD shots → pdp-02..09. Supabase `products.images[]` updated (9 URLs, hero first). Airtable record `recFyLzynnUgkLawN` patched: `Images=9 lines hero-first`, `Image Status=Approved`. Removed from `lib/hidden-skus.ts`. Airtable `Status` remains `reserved` — flip to `available` is the publish step, held for Ryan.

**2. Ghost rows — DELETED.** `cleanup-2026-06-10.mjs delete-ghosts` confirmed no-Airtable-record then deleted from Supabase: `black-stitched-backpack`, `marrakech-tote-bordeaux`, `marrakech-tote-noir`, `medina-crossbody-tassel`, `rolltop-daypack`. Pruned from `lib/hidden-skus.ts`.

**3. vintage-buckle-backpack-chocolate — STAGED, NOT WIRED.** Black-bar crop applied to 8 of 9 scale shots (~140-180px bars; Hero + scale-01 had none); output at `/tmp/vintage-buckle-prep/`. Drive originals untouched. Wire + create Supabase row + create Airtable record held per Ryan's price gate.

**Re-audit results (post-fix):**
- `pnpm audit:hero`: total=**30 pass=26 warn=4 fail=0** (was 35/26/9/0).
  Remaining WARNs:
  - `expedition-rolltop-noir` — multiple Hero-* files (HD + standard). HD wins via script; non-HD archive needs Ryan-approved Drive touch.
  - `explorer-rolltop-noir` — no Airtable record. Ruled 2026-06-09 permanent-hidden duplicate; still in HIDDEN_SKUS.
  - `medina-rucksack-flap-chocolate` — has AT + SB row, no Drive Hero. Decision pending: shoot/source imagery OR delete row.
  - `test-e2e` — QA fixture, keep.
- `pnpm audit:catalogue`: 0 hard failures, 14 warnings (all pre-existing `featured-no-scale` lifestyle-gen debt, unrelated to today's work). Deploy allowed.
- `pnpm tsx scripts/sync-airtable.ts --all --dry-run`: total=26 synced=0 noop=26 skipped=0 error=0. Zero drift.

**Open Ryan decisions:**
- Flip clasp-teal Airtable `Status` reserved→available to publish.
- Provide vintage-buckle-backpack-chocolate price → wire from `/tmp/vintage-buckle-prep/`, create Airtable record, run sync.
- Production deploy of clasp-teal visibility — gated on explicit approval.

## STATUS — Applied 2026-06-10 PT 09:00 (Ryan's second-pass cleanup)

Ryan's directives: "delete the unusable bags and use the hd ofcourse medina-rucksack-flap-chocolate looks like tis MT-BP-009/MT-BP-012/vintage-buckle-backpack-chocolate" — i.e. medina-rucksack-flap-chocolate is the same physical bag as those three (duplicate identity → delete).

**1. explorer-rolltop-noir — DELETED.** Supabase row removed (no Airtable record existed). Drive folder `MT-BP-007__explorer-rolltop-noir` moved to `usable product pics/_archive/MT-BP-007__explorer-rolltop-noir/` (preserved, invisible to audits — audit scans `f.isFile()` at top level only). Removed from `lib/hidden-skus.ts`.

**2. medina-rucksack-flap-chocolate — DELETED.** Supabase row removed AND Airtable record `recqkdXEeZa0mISWH` deleted. Removed from `lib/hidden-skus.ts`. (Duplicate identity per Ryan's visual ID with MT-BP-009/012 + vintage-buckle-chocolate.)

**3. MT-BP-005 HD-twin — RESOLVED.** Non-HD `Hero-expedition-rolltop-noir.png` (17.8MB) moved to `MT-BP-005__expedition-rolltop-noir/_archive/` subfolder. HD `Hero-expedition-rolltop-noir-HD.png` (1.1MB) is now the only Hero at folder root. WARN cleared.

**Re-audit results:**
- `pnpm audit:hero`: total=**28 pass=27 warn=1 fail=0** (was 30/26/4/0; single remaining WARN is the `test-e2e` QA fixture as expected).
- `pnpm audit:catalogue`: 0 hard failures, 15 warnings (lifestyle debt, unrelated).
- `pnpm tsx scripts/sync-airtable.ts --all --dry-run`: total=25 synced=0 noop=25 skipped=0 error=0.

The Supabase↔Drive↔Airtable mess is **fully reconciled**. Only outstanding work is the publish flips Ryan controls (clasp-teal status, vintage-buckle price/wire).

## Verdict

The catastrophic phase is over: **0 FAIL** — every visible product traces to a
Drive `Hero-*`. What remains is ghost rows, one missing forward-wiring, two
dual-hero folders, and cosmetic Drive residue.

## A. Ghost Supabase rows — no Drive folder, no Airtable record

These slugs exist only as Supabase rows. They are relics of the
filename-as-identity era (or early seeding). All are already in
`HIDDEN_SKUS`, so nothing leaks to the storefront.

| slug | proposed disposition |
|---|---|
| `black-stitched-backpack` | DELETE row (relic; no source imagery, no AT record) |
| `marrakech-tote-bordeaux` | DELETE row (same) |
| `marrakech-tote-noir` | DELETE row (same) |
| `medina-crossbody-tassel` | DELETE row (same) |
| `rolltop-daypack` | DELETE row (empty `images[]`, no source, no AT record) |
| `test-e2e` | KEEP — QA fixture, stays hidden |

Deletion is DB-destructive → **requires Ryan's explicit approval**. Safe
alternative: leave them `reserved` + hidden forever; cost is permanent
HIDDEN_SKUS noise and recurring WARNs in every audit. Recommendation: delete
the five relics in one approved pass, then remove them from `hidden-skus.ts`.

NOTE: rows must be deleted in Supabase directly *and* absent from Airtable
(they already are), otherwise the cron would not recreate them — sync is
Airtable→Supabase additive/update, deletion of Supabase-only rows is manual.

## B. Ryan-ruled duplicates / special cases

| slug | state | disposition |
|---|---|---|
| `explorer-rolltop-noir` | Ruled 2026-06-09: same physical bag as `expedition-rolltop-noir`; permanently hidden. Drive folder `MT-BP-007__explorer-rolltop-noir` exists; no AT record. | Keep row reserved+hidden (per ruling) OR delete row with the batch above. Drive folder: mark as duplicate in folder README, do not feed any pipeline from it. |
| `expedition-rolltop-noir` | PASS but `MT-BP-005` holds 2 heroes (standard + HD). | Encode/audit prefer `-HD`; non-HD hero should be archived inside Drive (needs Ryan approval to touch Drive). Until then, scripts pick HD deterministically. |
| `medina-rucksack-flap-chocolate` | Supabase row + Airtable record exist; **no Drive folder at all**. | Ryan decision: if the bag physically exists → shoot/collect imagery into a new `MT-BP-0XX__medina-rucksack-flap-chocolate` folder; if not → delete AT record + Supabase row. Stays hidden meanwhile. |

## C. Missing forward wiring — Drive product not yet sellable

| slug | state | fix |
|---|---|---|
| `vintage-buckle-backpack-chocolate` | Ryan ruled canonical 2026-06-10 (folder name = slug; no MT prefix). Drive folder has Hero + gallery. **No Airtable record, no Supabase row.** | Create Airtable Products record (Images[0] = encoded Hero) → run `sync-airtable.ts` → row appears → product live. Additive, non-destructive. Optionally assign an `MT-BP-0NN` SKU in Airtable even though the folder stays unprefixed (folder rename needs approval; encode script already allowlists it via `EXTRA_SKU_DIRS`). |

## D. Drive cosmetic residue — flag only (Drive is touch-with-approval)

None of these affect the pipeline (encode script filters by image extension +
naming), but they are confusing breadcrumbs of the old mess:

- `MT-CB-009__medina-soft-crossbody-walnut/`: `medina-duffle-alt.zip`, `medina-duffle-alt-02.zip` — rename lineage from old alias `medina-duffle-alt`. Suggest delete or move to an `_archive/` once approved.
- `MT-CB-010__medina-zip-sling-cognac/`: `medina-duffle.zip` — lineage of the old misnamed sling. Same suggestion.
- `MT-CB-003`: dual heroes (standard + HD) — same handling as MT-BP-005 (HD wins; archive non-HD when approved).
- Non-convention gallery names in several folders (`Side-*`, `Model-*`, `Top-*`, `Bottom-*`, `Back-*`, bare `-HD-NN`): encoded but sorted last in gallery order. Optional batch-rename to `<slug>-pdp-NN` later.
- `MT-BP-001__atlas-kilim-backpack`: gallery files lack role token (`atlas-kilim-backpack-01.png`) — works, sorts as "other".
- `MT-BP-016`: one `.jpg` among `.png` — fine, encoder accepts it.
- `MT-BP-018`: SKU number gap in the BP sequence — harmless; do NOT renumber.

## E. Root cause + the rule that prevents recurrence

Root cause: **product identity was inferred from filenames** instead of
pixels, and file-role suffixes (`-scale`, `-pdp`, `-macro`) were read as
distinct products. Everything downstream (Supabase seeding, hero picks,
launch blockers) inherited that.

Naming contract to codify in ops docs (task: ops-rules update):

1. **One physical product = one slug = one Drive folder** (`MT-XX-NNN__<slug>`; exceptions only via explicit allowlist).
2. `-pdp` / `-scale` / `-macro` / `-hd` are **file roles**, never product identities. A new "product" may only be created after visual inspection (contact sheet) confirms a distinct physical bag.
3. Identity decisions come from pixels, not filenames. `/graphify` + contact sheet before any folder reorganization.
4. Supabase is derived: rows are created/updated only via Airtable → `sync-airtable.ts`. Supabase-only rows are bugs.
5. `Hero-<slug>.*` is the single mandatory primary; if two heroes exist, `-HD` wins and the loser gets archived (with approval).

## Next actions (in order)

1. Ryan approves/edits: A-batch deletion (5 rows), B dispositions, C go-live for vintage-buckle-backpack-chocolate.
2. Apply approved fixes via Airtable + manual Supabase deletes; prune `hidden-skus.ts` accordingly.
3. Re-run `pnpm audit:hero` + `pnpm audit:catalogue` — target: 0 WARN besides test-e2e.
4. Update ops docs: Obsidian Product Media Contract (stale `<slug>/` folder convention → `MT-XX-NNN__<slug>` + allowlist), Agent Workflow naming contract, repo AGENTS.md restatement, dated Drive Ops note, Handoff Log.
