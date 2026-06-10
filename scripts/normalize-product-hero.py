#!/usr/bin/env python3
"""Normalize Maison Tanneurs product hero images onto one consistent square plate.

This is intentionally deterministic: one source product cutout/white-background hero in,
one 2400x2400 white-background WebP out. It does NOT magically fix bad source images
with black/complex backgrounds; those should go through a real background-removal tool
first, then this script standardizes scale/canvas.
"""
from __future__ import annotations

import argparse
from pathlib import Path
from PIL import Image, ImageChops, ImageOps

WHITE = (255, 255, 255, 255)
PAPER = (255, 255, 255, 255)


def foreground_bbox(im: Image.Image, threshold: int = 18):
    """Detect foreground using alpha if present, else difference from white."""
    rgba = im.convert("RGBA")
    alpha = rgba.getchannel("A")
    alpha_min, _alpha_max = alpha.getextrema()
    if int(alpha_min) < 250:
        mask = alpha.point(lambda px: 255 if int(px) > 8 else 0)
        return mask.getbbox(), mask

    white = Image.new("RGBA", rgba.size, WHITE)
    diff = ImageChops.difference(rgba, white).convert("L")
    mask = diff.point(lambda px: 255 if int(px) > threshold else 0)
    return mask.getbbox(), mask


def normalize(
    src: Path,
    dst: Path,
    canvas: int = 2400,
    target_max: int = 1780,
    bottom_margin: int = 210,
    threshold: int = 18,
    quality: int = 92,
):
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGBA")
    bbox, mask = foreground_bbox(im, threshold=threshold)
    if not bbox:
        raise SystemExit(f"No foreground detected: {src}")

    crop = im.crop(bbox)
    mask_crop = mask.crop(bbox)
    bw, bh = crop.size

    scale = min(target_max / bw, target_max / bh)
    new_size = (max(1, round(bw * scale)), max(1, round(bh * scale)))
    crop = crop.resize(new_size, Image.Resampling.LANCZOS)
    mask_crop = mask_crop.resize(new_size, Image.Resampling.LANCZOS)

    plate = Image.new("RGBA", (canvas, canvas), PAPER)
    x = (canvas - new_size[0]) // 2
    y = canvas - bottom_margin - new_size[1]
    # If very tall item would touch top, center it with a small top safety margin.
    y = max(150, y)
    plate.alpha_composite(crop, (x, y))

    dst.parent.mkdir(parents=True, exist_ok=True)
    if dst.suffix.lower() in {".jpg", ".jpeg"}:
        plate.convert("RGB").save(dst, quality=quality, optimize=True)
    else:
        plate.convert("RGB").save(dst, quality=quality, method=6)

    return {
        "src": str(src),
        "dst": str(dst),
        "source_size": im.size,
        "bbox": bbox,
        "crop_size": (bw, bh),
        "output_size": (canvas, canvas),
        "placed_size": new_size,
        "position": (x, y),
    }


def main():
    p = argparse.ArgumentParser()
    p.add_argument("src", type=Path)
    p.add_argument("dst", type=Path)
    p.add_argument("--canvas", type=int, default=2400)
    p.add_argument("--target-max", type=int, default=1780, help="max product bbox dimension on final canvas")
    p.add_argument("--bottom-margin", type=int, default=210)
    p.add_argument("--threshold", type=int, default=18)
    p.add_argument("--quality", type=int, default=92)
    args = p.parse_args()
    info = normalize(**vars(args))
    for k, v in info.items():
        print(f"{k}: {v}")


if __name__ == "__main__":
    main()
