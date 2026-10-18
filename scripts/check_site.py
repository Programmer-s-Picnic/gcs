#!/usr/bin/env python3
"""Validate relative links and duplicate IDs across all folder index pages."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, unquote
import sys

root = Path(__file__).resolve().parents[1]
pages = sorted(root.rglob("index.html"))
errors = []

class Inspector(HTMLParser):
    def __init__(self, page):
        super().__init__(convert_charrefs=True)
        self.page = page
        self.ids = set()

    def handle_starttag(self, tag, attrs):
        props = dict(attrs)
        element_id = props.get("id")
        if element_id:
            if element_id in self.ids:
                errors.append(f"{self.page.relative_to(root)}: duplicate id {element_id}")
            self.ids.add(element_id)
        for key in ("href", "src"):
            url = props.get(key, "")
            if not url or url.startswith(("#", "//", "mailto:", "tel:", "data:")):
                continue
            parts = urlparse(url)
            if parts.scheme or not parts.path:
                continue
            target = (self.page.parent / unquote(parts.path)).resolve()
            if not target.is_relative_to(root):
                errors.append(f"{self.page.relative_to(root)}: link escapes repository: {url}")
                continue
            if target.is_dir():
                target = target / "index.html"
            if not target.is_file():
                errors.append(f"{self.page.relative_to(root)}: broken {key}: {url}")

for page in pages:
    parser = Inspector(page)
    parser.feed(page.read_text(encoding="utf-8"))
    if not parser.ids:
        errors.append(f"{page.relative_to(root)}: expected an identifiable page")
if len(pages) < 10:
    errors.append(f"Expected at least 10 pages; found {len(pages)}")
print(f"Checked {len(pages)} folder-based HTML pages")
if errors:
    print("\n".join(errors))
    sys.exit(1)
print("OK: all local links resolved and IDs are unique.")
