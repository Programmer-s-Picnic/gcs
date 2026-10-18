#!/usr/bin/env python3
"""Regression checks for the eight-step interactive home-page hero."""
from pathlib import Path
from html.parser import HTMLParser
import re

root = Path(__file__).resolve().parents[1]
page = (root / "index.html").read_text(encoding="utf-8")
script = (root / "assets/circular-journey.js").read_text(encoding="utf-8")
style = (root / "assets/circular-journey.css").read_text(encoding="utf-8")
issues = []

class Probe(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.steps = []
        self.buttons = []
        self.svgs = 0
    def handle_starttag(self, tag, attrs):
        attr = dict(attrs)
        if attr.get("id"): self.ids.append(attr["id"])
        if "data-cycle-step" in attr:
            self.steps.append(attr["data-cycle-step"])
            if tag != "button": issues.append("Interactive stage is not a button")
            if not attr.get("aria-label"): issues.append("Stage missing accessible name")
        if tag == "svg": self.svgs += 1

parser = Probe()
parser.feed(page)
if parser.steps != [str(n) for n in range(8)]:
    issues.append("Expected stage buttons numbered 0 through 7")
if len(parser.ids) != len(set(parser.ids)):
    issues.append("Duplicate IDs on homepage")
for ident in (
  "cycle-orbit-scene", "cycle-arrows", "cycle-detail",
  "cycle-detail-title", "cycle-detail-description",
  "cycle-detail-impact", "cycle-detail-tags",
  "cycle-prev", "cycle-next", "cycle-tour"
):
    if ident not in parser.ids: issues.append("Missing stage UI: " + ident)
for asset in ("assets/circular-journey.css", "assets/circular-journey.js"):
    if not (root / asset).is_file(): issues.append("Missing asset: " + asset)
if "@media(max-width:600px)" not in style:
    issues.append("Missing mobile stage-grid layout")
if "prefers-reduced-motion" not in style:
    issues.append("Missing reduced-motion alternative")
if script.count("name:'") != 8:
    issues.append("Descriptions must cover all 8 stages")
if "aria-pressed" not in script or "visibilitychange" not in script:
    issues.append("Accessible interaction or visibility handling missing")
if issues:
    raise SystemExit("\n".join(issues))
print("Circular journey hero: 8 accessible stages, explanations, assets and mobile controls verified.")
