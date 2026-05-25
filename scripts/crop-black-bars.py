#!/usr/bin/env python3
"""
Auto-crop Higgsfield letterbox black bars from every product .webp in
Supabase Storage (drop-02/ + drop-01/).

HF Shots exports often render with 25-50px of pure-black margin on all four
sides — a ~1% letterbox baked into the file. The CSS workaround
(transform: scale(1.04)) crops past them but the source files still ship
the black. This re-encodes the source.

Safety rails:
- Black threshold: each channel < 12/255
- Only crop a bar if it's a uniform pure-black band ≤ 120px (≤ 3.2% of 3840).
  Anything thicker is treated as legitimate dark content (e.g. a noir-leather
  bag photographed against a dark backdrop) and skipped.
- Re-encode at WebP q=82 (matches existing pipeline).
- Upload via upsert — URLs stay the same so no DB changes needed.
- Dry-run by default; pass --apply to actually upload.

Usage:
    export SRK=$(cat ~/.rocco/maisontanneurs-supabase.json | python3 -c "import json,sys; print(json.load(sys.stdin)['service_role_key'])")
    SRK=$SRK python3 scripts/crop-black-bars.py            # dry run
    SRK=$SRK python3 scripts/crop-black-bars.py --apply    # apply
"""

import io
import json
import os
import sys
import urllib.request
from PIL import Image

SRK = os.environ.get("SRK") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
if not SRK:
    sys.exit("SRK env var required")

URL = "https://xbtabpurfavngwmwtawc.supabase.co"
APPLY = "--apply" in sys.argv

BLACK_TOLERANCE = 12       # each channel must be < this to count as black
MAX_BAR_PX = 120           # don't crop bars thicker than this (legit dark content)
SAMPLE_STEP = 20           # check every Nth pixel along a row/col
WEBP_QUALITY = 82


def list_bucket(folder):
    """Returns paths INCLUDING the folder prefix (Supabase list returns names
    relative to the prefix, so we prepend it ourselves)."""
    req = urllib.request.Request(
        f"{URL}/storage/v1/object/list/products",
        data=json.dumps({"prefix": f"{folder}/", "limit": 1000, "offset": 0}).encode(),
        headers={
            "apikey": SRK,
            "Authorization": f"Bearer {SRK}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req) as r:
        return [f"{folder}/{f['name']}" for f in json.loads(r.read())]


def is_black(px):
    return px[0] < BLACK_TOLERANCE and px[1] < BLACK_TOLERANCE and px[2] < BLACK_TOLERANCE


def detect_bar(im, side):
    """Return px depth of pure-black bar on given side (0 if none, -1 if too thick)."""
    w, h = im.size
    if side == "top":
        for y in range(h):
            row = [im.getpixel((x, y)) for x in range(0, w, max(1, w // SAMPLE_STEP))]
            if not all(is_black(p) for p in row):
                return y if y <= MAX_BAR_PX else -1
        return -1
    if side == "bottom":
        for y in range(h - 1, -1, -1):
            row = [im.getpixel((x, y)) for x in range(0, w, max(1, w // SAMPLE_STEP))]
            if not all(is_black(p) for p in row):
                bar = h - 1 - y
                return bar if bar <= MAX_BAR_PX else -1
        return -1
    if side == "left":
        for x in range(w):
            col = [im.getpixel((x, y)) for y in range(0, h, max(1, h // SAMPLE_STEP))]
            if not all(is_black(p) for p in col):
                return x if x <= MAX_BAR_PX else -1
        return -1
    if side == "right":
        for x in range(w - 1, -1, -1):
            col = [im.getpixel((x, y)) for y in range(0, h, max(1, h // SAMPLE_STEP))]
            if not all(is_black(p) for p in col):
                bar = w - 1 - x
                return bar if bar <= MAX_BAR_PX else -1
        return -1
    return 0


def upload(storage_path, bytes_data):
    req = urllib.request.Request(
        f"{URL}/storage/v1/object/products/{storage_path}",
        data=bytes_data,
        headers={
            "Authorization": f"Bearer {SRK}",
            "Content-Type": "image/webp",
            "x-upsert": "true",
        },
        method="PUT",
    )
    try:
        with urllib.request.urlopen(req) as r:
            return r.status < 300
    except urllib.error.HTTPError as e:
        # Try POST as fallback (initial upload semantics)
        req2 = urllib.request.Request(
            f"{URL}/storage/v1/object/products/{storage_path}",
            data=bytes_data,
            headers={
                "Authorization": f"Bearer {SRK}",
                "Content-Type": "image/webp",
                "x-upsert": "true",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(req2) as r:
                return r.status < 300
        except Exception:
            print(f"    upload failed: {e}")
            return False


def fetch(url):
    with urllib.request.urlopen(url, timeout=30) as r:
        return r.read()


def process(folder, name):
    url = f"{URL}/storage/v1/object/public/products/{name}"
    base = name.replace(f"{folder}/", "")
    try:
        data = fetch(url)
    except Exception as e:
        print(f"  SKIP  {name} — fetch failed: {e}")
        return None

    try:
        im = Image.open(io.BytesIO(data)).convert("RGB")
    except Exception as e:
        print(f"  SKIP  {name} — decode failed: {e}")
        return None

    w, h = im.size
    t = detect_bar(im, "top")
    b = detect_bar(im, "bottom")
    l = detect_bar(im, "left")
    r = detect_bar(im, "right")

    # -1 means bar was over MAX_BAR_PX — treat as no crop (legit dark content)
    t = max(t, 0)
    b = max(b, 0)
    l = max(l, 0)
    r = max(r, 0)

    if t + b + l + r == 0:
        return ("noop", base, (w, h), None)

    cropped = im.crop((l, t, w - r, h - b))
    cw, ch = cropped.size

    buf = io.BytesIO()
    cropped.save(buf, format="WEBP", quality=WEBP_QUALITY, method=4)
    new_bytes = buf.getvalue()

    if APPLY:
        ok = upload(name, new_bytes)
        status = "OK   " if ok else "FAIL "
    else:
        status = "DRY  "

    print(
        f"  {status} {base:55s} {w}x{h} → {cw}x{ch}  "
        f"(T{t} B{b} L{l} R{r}, {len(data)//1024}KB → {len(new_bytes)//1024}KB)"
    )
    return ("cropped" if APPLY else "would-crop", base, (cw, ch), (t, b, l, r))


def main():
    mode = "APPLY" if APPLY else "DRY-RUN"
    print(f"=== Crop black bars from product .webp ({mode}) ===\n")

    total = 0
    cropped = 0
    noop = 0
    failed = 0

    for folder in ("drop-02", "drop-01"):
        files = list_bucket(folder)
        files = [f for f in files if f.endswith(".webp")]
        print(f"--- {folder}/  ({len(files)} files) ---")
        for name in sorted(files):
            res = process(folder, name)
            total += 1
            if res is None:
                failed += 1
            elif res[0] == "noop":
                noop += 1
            else:
                cropped += 1
        print()

    print("=== Summary ===")
    print(f"  Total scanned:    {total}")
    print(f"  Cropped:          {cropped}")
    print(f"  No bars (skip):   {noop}")
    print(f"  Failed:           {failed}")
    if not APPLY:
        print(f"\n  Dry run. Re-run with --apply to upload.")


if __name__ == "__main__":
    main()
