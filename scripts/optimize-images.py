#!/usr/bin/env python3
"""
Generates web-sized copies of the source photographs for use in the site.

Originals in src/assets/images/<category>/ are never modified, renamed, or
overwritten. This script only ever writes into src/assets/images-web/, and
also writes src/data/imageDimensions.generated.json so components can
reserve the correct aspect ratio before an image loads (no layout shift).

Run again any time a photo is added or removed:
    python3 scripts/optimize-images.py
"""
import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src/assets/images"
DEST = ROOT / "src/assets/images-web"
MANIFEST = ROOT / "src/data/imageDimensions.generated.json"

MAX_DIMENSION = 1800
QUALITY = 78
EXTS = {".jpg", ".jpeg", ".png", ".webp"}


def optimize(src_path: Path, dest_path: Path) -> tuple[int, int]:
    with Image.open(src_path) as im:
        im = ImageOps.exif_transpose(im)
        im = im.convert("RGB")
        w, h = im.size
        if max(w, h) > MAX_DIMENSION:
            scale = MAX_DIMENSION / max(w, h)
            im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
        dest_path.parent.mkdir(parents=True, exist_ok=True)
        im.save(dest_path, "JPEG", quality=QUALITY, optimize=True, progressive=True)
        return im.size


def main() -> None:
    manifest: dict[str, dict[str, int]] = {}
    if not SRC.exists():
        print(f"No source directory at {SRC}")
        return

    for category_dir in sorted(SRC.iterdir()):
        if not category_dir.is_dir():
            continue
        category = category_dir.name
        for src_file in sorted(category_dir.iterdir()):
            if src_file.suffix.lower() not in EXTS:
                continue
            dest_file = DEST / category / (src_file.stem + ".jpg")
            w, h = optimize(src_file, dest_file)
            manifest[f"{category}/{src_file.stem}.jpg"] = {"width": w, "height": h}
            print(f"{category}/{src_file.name} -> {dest_file.relative_to(ROOT)} ({w}x{h})")

    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n")
    print(f"\nWrote {len(manifest)} entries to {MANIFEST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
