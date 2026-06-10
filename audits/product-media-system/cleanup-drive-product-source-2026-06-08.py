#!/usr/bin/env python3
"""Safe cleanup pass for Maison Tanneurs Drive product source folders.

Principles:
- Only operates inside Google Drive Maison Tanneurs/usable product pics.
- No deletes.
- Alias folders are copied into canonical folder, then moved under _merged/.
- Product folders remain flat: direct child images only.
"""
from __future__ import annotations

import json
import shutil
from datetime import datetime
from pathlib import Path
from PIL import Image

ROOT = Path('/Users/ryanz/Library/CloudStorage/GoogleDrive-ryanaoufal@gmail.com/My Drive/Maison Tanneurs/usable product pics')
MERGED = ROOT / '_merged'
LOG_PATH = Path('/Users/ryanz/kechken/audits/product-media-system/drive-cleanup-log-2026-06-08.json')
IMG_EXT = {'.png', '.jpg', '.jpeg', '.webp', '.avif'}

log: list[dict] = []


def event(action: str, **kwargs):
    row = {'action': action, **{k: str(v) for k, v in kwargs.items()}}
    log.append(row)
    print(row)


def images(folder: Path):
    if not folder.exists():
        return []
    return [p for p in sorted(folder.iterdir()) if p.is_file() and p.suffix.lower() in IMG_EXT]


def next_name(folder: Path, slug: str, role: str, ext: str, start: int = 1) -> Path:
    i = start
    while True:
        p = folder / f'{slug}-{role}-{i:02d}{ext.lower()}'
        if not p.exists():
            return p
        i += 1


def first_free_hero(folder: Path, slug: str, ext: str) -> Path:
    base = folder / f'Hero-{slug}{ext.lower()}'
    if not base.exists():
        return base
    i = 2
    while True:
        p = folder / f'Hero-{slug}-{i:02d}{ext.lower()}'
        if not p.exists():
            return p
        i += 1


def archive_folder(folder: Path):
    MERGED.mkdir(exist_ok=True)
    dst = MERGED / folder.name
    if dst.exists():
        stamp = datetime.now().strftime('%Y%m%d-%H%M%S')
        dst = MERGED / f'{folder.name}-{stamp}'
    shutil.move(str(folder), str(dst))
    event('archive-folder', src=folder, dst=dst)


def rename_folder(old: str, new: str):
    src = ROOT / old
    dst = ROOT / new
    if not src.exists():
        event('skip-missing-folder', folder=src)
        return
    if dst.exists():
        raise RuntimeError(f'target exists: {dst}')
    tmp = ROOT / f'.__mt_tmp__{old}__to__{new}'
    if tmp.exists():
        raise RuntimeError(f'temp exists: {tmp}')
    shutil.move(str(src), str(tmp))
    shutil.move(str(tmp), str(dst))
    event('rename-folder', src=src, dst=dst)


def normalize_folder_files(slug: str, *, primary_strategy: str = 'unsuffixed-or-first-hero'):
    folder = ROOT / slug
    if not folder.exists():
        event('skip-normalize-missing', folder=folder)
        return
    imgs = images(folder)
    if not imgs:
        return
    heroes = [p for p in imgs if p.name.startswith('Hero-')]
    primary: Path | None = None
    if heroes:
        unsuffixed = [p for p in heroes if p.stem == f'Hero-{slug}']
        if primary_strategy == 'largest-hero':
            def area(p: Path) -> int:
                try:
                    im = Image.open(p); return (im.width or 0) * (im.height or 0)
                except Exception:
                    return 0
            primary = max(heroes, key=area)
        elif unsuffixed:
            primary = unsuffixed[0]
        else:
            primary = heroes[0]
    # two-phase rename all image files
    temp_map=[]
    for idx,p in enumerate(imgs):
        tmp = folder / f'.__mt_tmp_{idx:03d}{p.suffix.lower()}'
        if tmp.exists():
            raise RuntimeError(f'temp file exists {tmp}')
        p.rename(tmp)
        temp_map.append((p,tmp))
    pdp_i=1; macro_i=1; scale_i=1
    for original,tmp in temp_map:
        ext = original.suffix.lower()
        lower = original.name.lower()
        if primary and original.name == primary.name:
            dst = folder / f'Hero-{slug}{ext}'
        else:
            # retain obvious role labels by old name/folder slug
            if 'macro' in lower:
                dst = folder / f'{slug}-macro-{macro_i:02d}{ext}'; macro_i += 1
            elif 'scale' in lower:
                dst = folder / f'{slug}-scale-{scale_i:02d}{ext}'; scale_i += 1
            else:
                dst = folder / f'{slug}-pdp-{pdp_i:02d}{ext}'; pdp_i += 1
        if dst.exists():
            # do not overwrite a non-temp file
            if dst.name.startswith('Hero-'):
                dst = first_free_hero(folder, slug, ext)
            else:
                role = 'pdp'
                if '-macro-' in dst.name: role = 'macro'
                if '-scale-' in dst.name: role = 'scale'
                dst = next_name(folder, slug, role, ext)
        tmp.rename(dst)
        if original.name != dst.name:
            event('rename-file', folder=folder, src=original.name, dst=dst.name)


def merge_alias(alias: str, target: str, *, default_role: str = 'pdp', hero_as_role: bool = True):
    src = ROOT / alias
    dst = ROOT / target
    if not src.exists():
        event('skip-missing-alias', alias=src)
        return
    if not dst.exists():
        raise RuntimeError(f'target missing: {dst}')
    for p in images(src):
        role = default_role
        lower = p.name.lower()
        if 'macro' in lower:
            role = 'macro'
        elif 'scale' in lower:
            role = 'scale'
        elif default_role:
            role = default_role
        out = next_name(dst, target, role, p.suffix)
        shutil.copy2(p, out)
        event('copy-alias-image', src=p, dst=out)
    archive_folder(src)


def ensure_no_tmp_files():
    leftovers = list(ROOT.rglob('.__mt_tmp*'))
    if leftovers:
        raise RuntimeError('temp leftovers: ' + ', '.join(map(str, leftovers)))


def main():
    assert ROOT.exists(), ROOT
    MERGED.mkdir(exist_ok=True)

    # 1. Medina duffle family: restore actual weekender to medina-duffle.
    rename_folder('medina-duffle', 'medina-zip-sling-cognac')
    normalize_folder_files('medina-zip-sling-cognac')
    rename_folder('medina-duffle-scale', 'medina-duffle')
    normalize_folder_files('medina-duffle', primary_strategy='largest-hero')
    rename_folder('medina-duffle-alt', 'medina-soft-crossbody-walnut')
    normalize_folder_files('medina-soft-crossbody-walnut')

    # 2. Vintage buckle: merge light PDP into cognac/honey; split dark scale as chocolate colorway.
    merge_alias('vintage-buckle-backpack-light-pdp', 'vintage-buckle-backpack', default_role='pdp')
    normalize_folder_files('vintage-buckle-backpack')
    rename_folder('vintage-buckle-backpack-scale', 'vintage-buckle-backpack-chocolate')
    normalize_folder_files('vintage-buckle-backpack-chocolate', primary_strategy='largest-hero')

    # 3. Same-product duplicate/role folders.
    merge_alias('medina-crossbody-envelope-alt', 'medina-crossbody-envelope', default_role='pdp')
    normalize_folder_files('medina-crossbody-envelope')

    merge_alias('atlas-kilim-duffle-alt', 'atlas-kilim-duffle', default_role='pdp')
    normalize_folder_files('atlas-kilim-duffle')

    merge_alias('explorer-rolltop-cognac-scale', 'explorer-rolltop-cognac', default_role='scale')
    normalize_folder_files('explorer-rolltop-cognac')

    # 4. Macro/role folders: split real walnut cutout product; merge dark-brown alias material into dark-brown product.
    rename_folder('medina-crossbody-walnut-macro', 'medina-crossbody-tooled-walnut')
    normalize_folder_files('medina-crossbody-tooled-walnut')
    merge_alias('medina-crossbody-tooled-walnut-macro', 'medina-crossbody-tooled-dark-brown', default_role='macro')
    normalize_folder_files('medina-crossbody-tooled-dark-brown')

    # 5. Kilim backpack duplicate: atlas-kilim-backpack is the dark/brown/orange product; rucksack remains red product.
    merge_alias('atlas-kilim-rucksack-alt', 'atlas-kilim-backpack', default_role='pdp')
    normalize_folder_files('atlas-kilim-backpack')
    normalize_folder_files('atlas-kilim-rucksack')

    # 6. Multi-hero same-folder normalization only.
    for slug in [
        'atlas-messenger-laptop',
        'classic-cognac-satchel',
        'cognac-brogue-backpack',
        'le-nomade',
        'marrakech-tote-cognac',
        'medina-cargo-rucksack-moutarde',
    ]:
        normalize_folder_files(slug, primary_strategy='unsuffixed-or-first-hero')

    ensure_no_tmp_files()
    LOG_PATH.write_text(json.dumps(log, indent=2), encoding='utf-8')
    print(f'WROTE {LOG_PATH}')


if __name__ == '__main__':
    main()
