#!/usr/bin/env python3
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / ".pydeps"))

from PIL import Image  # type: ignore


TARGETS = [
    ("banner.png", [720, 1240], "png"),
    ("hero-image.png", [720, 1200], "png"),
    # Лого в шапке ~258px по ширине при height 62px (800×192); для Retina 2× нужны кандидаты ≥516px
    ("logo.png", [400, 800], "png"),
    ("services/photo_place_camera.png", [720, 1200], "png"),
    ("services/passport.jpg", [560, 1040], "jpg"),
    ("services/restavration2.png", [560, 1040], "png"),
    ("services/restavration3.png", [560, 1040], "png"),
    ("services/sovm.jpeg", [560, 1040], "jpg"),
    ("services/print.jpeg", [560, 1040], "jpg"),
    ("services/5.jpg", [560, 1040], "jpg"),
    ("services/to_home.jpg", [560, 1040], "jpg"),
    *[(f"people2/{i}.png", [320, 640], "png") for i in range(1, 12)],
    ("people2/sophy.png", [320, 640], "png"),
    ("place/1.jpg", [420, 840], "jpg"),
    ("place/2.JPG", [420, 840], "jpg"),
    ("place/3.jpg", [420, 840], "jpg"),
    ("place/5.jpg", [420, 840], "jpg"),
    ("place/6.jpg", [420, 840], "jpg"),
    ("place/kak_dobratsya.png", [420, 840], "png"),
]


def to_mode_for_jpeg(image: Image.Image) -> Image.Image:
    if image.mode in ("RGBA", "LA", "P"):
        return image.convert("RGB")
    return image


def resize_keep_ratio(image: Image.Image, target_width: int) -> Image.Image:
    width, height = image.size
    new_width = min(width, target_width)
    if new_width == width:
        return image.copy()
    new_height = int(height * (new_width / width))
    return image.resize((new_width, new_height), Image.Resampling.LANCZOS)


def save_variants(src_rel: str, widths: list[int], fallback: str) -> None:
    src = ROOT / src_rel
    stem = src.stem
    base = src.parent

    with Image.open(src) as original:
        for width in widths:
            resized = resize_keep_ratio(original, width)

            webp_path = base / f"{stem}-w{width}.webp"
            resized.save(webp_path, format="WEBP", quality=82, method=6)

            if fallback == "jpg":
                fallback_path = base / f"{stem}-w{width}.jpg"
                to_mode_for_jpeg(resized).save(
                    fallback_path, format="JPEG", quality=84, optimize=True
                )
            else:
                fallback_path = base / f"{stem}-w{width}.png"
                resized.save(fallback_path, format="PNG", optimize=True)

            print(f"created: {webp_path.relative_to(ROOT)}")
            print(f"created: {fallback_path.relative_to(ROOT)}")


def main() -> None:
    for src_rel, widths, fallback in TARGETS:
        save_variants(src_rel, widths, fallback)


if __name__ == "__main__":
    main()
