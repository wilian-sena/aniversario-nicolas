"""Converte os PNGs pesados em WebP e redimensiona para 1200px de largura max."""
from PIL import Image
from pathlib import Path

IMG_DIR = Path(__file__).parent / "images"
MAX_WIDTH = 1200
QUALITY = 86

targets = [
    ("astro-main.png",    "astro-main.webp"),
    ("astro-penguin.png", "astro-penguin.webp"),
    ("astro-heroes.png",  "astro-heroes.webp"),
    ("astro-sitting.png", "astro-sitting.webp"),
]

for src_name, dst_name in targets:
    src = IMG_DIR / src_name
    dst = IMG_DIR / dst_name
    if not src.exists():
        print(f"SKIP {src_name} (not found)")
        continue
    before = src.stat().st_size
    img = Image.open(src).convert("RGBA")
    w, h = img.size
    if w > MAX_WIDTH:
        new_h = int(h * MAX_WIDTH / w)
        img = img.resize((MAX_WIDTH, new_h), Image.LANCZOS)
        print(f"  resized {src_name} {w}x{h} -> {MAX_WIDTH}x{new_h}")
    img.save(dst, "WEBP", quality=QUALITY, method=6)
    after = dst.stat().st_size
    pct = 100 * (1 - after / before)
    print(f"{src_name:22s} {before/1024:8.1f} KB -> {dst_name:24s} {after/1024:8.1f} KB  (-{pct:.0f}%)")

print("\nDone.")
