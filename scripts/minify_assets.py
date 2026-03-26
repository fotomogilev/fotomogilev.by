#!/usr/bin/env python3
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / ".pydeps"))

import rcssmin  # type: ignore
import rjsmin  # type: ignore


def minify_css(src_name: str, dst_name: str) -> None:
    src = ROOT / src_name
    dst = ROOT / dst_name
    css = src.read_text(encoding="utf-8")
    dst.write_text(rcssmin.cssmin(css), encoding="utf-8")


def minify_js(src_name: str, dst_name: str) -> None:
    src = ROOT / src_name
    dst = ROOT / dst_name
    js = src.read_text(encoding="utf-8")
    dst.write_text(rjsmin.jsmin(js), encoding="utf-8")


def main() -> None:
    minify_css("styles.css", "styles.min.css")
    minify_js("script.js", "script.min.js")
    minify_js("form.js", "form.min.js")
    print("Minified styles.css -> styles.min.css")
    print("Minified script.js -> script.min.js")
    print("Minified form.js -> form.min.js")


if __name__ == "__main__":
    main()
