#!/usr/bin/env python3
"""Verify a product hero/landing/hover image has a clean white background.

Called by scripts/audit-image-contract.ts on every file referenced by
DRIVE_HERO_BY_SLUG / HOVER_BY_SLUG / LIST_IMAGE_OVERRIDES.

Samples 4 corner pixels at 12px inset. Every corner must have all three
RGB channels >= 240 (effectively white). Exits 0 on pass, 1 on fail.
On fail, prints the offending corner(s) to stderr so the TS audit can
include them in its violation report.

This is what would have caught the black-plate regression that Ryan
flagged 2026-06-08 — three product cards (heritage-rucksack,
cognac-brogue-backpack, classic-cognac-satchel) had been shipping on
pure black plates for weeks because the audit only checked file
existence.

Usage:
    python3 scripts/lib/check-bg-white.py <path-to-webp>
"""
from __future__ import annotations

import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    # Defer the import error so the audit can report it cleanly.
    print("PIL_MISSING", file=sys.stderr)
    sys.exit(2)


INSET = 12
# Allow a small tolerance for WebP lossy compression artifacts on the
# corner pixels (true white can show up as 238-242 after encode). The
# real failure modes we want to catch are pure black (0,0,0), mid-gray
# (~127), and light-gray (~194-234) — all comfortably below 235.
MIN_CHANNEL = 235


def check(path: Path) -> int:
    try:
        im = Image.open(path).convert("RGB")
    except Exception as exc:
        print(f"OPEN_FAIL {exc}", file=sys.stderr)
        return 2

    w, h = im.size
    if w <= INSET * 2 or h <= INSET * 2:
        print(f"TOO_SMALL {w}x{h}", file=sys.stderr)
        return 2

    corners = {
        "TL": im.getpixel((INSET, INSET)),
        "TR": im.getpixel((w - INSET - 1, INSET)),
        "BL": im.getpixel((INSET, h - INSET - 1)),
        "BR": im.getpixel((w - INSET - 1, h - INSET - 1)),
    }

    bad = {name: rgb for name, rgb in corners.items() if min(rgb) < MIN_CHANNEL}
    if bad:
        for name, rgb in bad.items():
            print(f"FAIL corner={name} rgb={rgb[0]},{rgb[1]},{rgb[2]}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("usage: check-bg-white.py <path-to-webp>", file=sys.stderr)
        sys.exit(2)
    sys.exit(check(Path(sys.argv[1])))
