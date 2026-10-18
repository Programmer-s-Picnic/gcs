#!/usr/bin/env python3
"""Verify 3D road integration without requiring a GPU or external CDN."""
from pathlib import Path
from html.parser import HTMLParser
root=Path(__file__).resolve().parents[1]
html=(root/"index.html").read_text(encoding="utf-8")
road=(root/"assets/circular-road-3d.js").read_text(encoding="utf-8")
css=(root/"assets/circular-road-3d.css").read_text(encoding="utf-8")
controller=(root/"assets/circular-journey.js").read_text(encoding="utf-8")
errors=[]
class Parser(HTMLParser):
 def __init__(self):
  super().__init__()
  self.ids=set()
  self.stops=[]
  self.scripts=[]
  self.styles=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if "id" in a:
   if a["id"] in self.ids:errors.append("Duplicate ID "+a["id"])
   self.ids.add(a["id"])
  if "data-road-stop" in a:
   if tag!="button":errors.append("3D checkpoint must be keyboard accessible button")
   self.stops.append(a["data-road-stop"])
  if tag=="script" and "src" in a:self.scripts.append(a["src"])
  if tag=="link" and a.get("rel")=="stylesheet":self.styles.append(a.get("href"))
page=Parser()
page.feed(html)
for name in ("road3d-canvas","road3d-view","road3d-top","road3d-perspective","road3d-focus","road3d-reset","cycle-orbit-scene","cycle-detail"):
 if name not in page.ids:errors.append("Missing "+name)
if page.stops!=list(map(str,range(8))):errors.append("Eight checkpoint controls missing or out of order")
if "./assets/circular-road-3d.js" not in page.scripts:errors.append("No 3D module entry")
if "./assets/circular-road-3d.css" not in page.styles:errors.append("No 3D CSS")
if "three@0.169.0" not in html:errors.append("Three.js import-map version missing")
if "classList.add('road3d-ready')" not in road:errors.append("3D should reveal only on successful initialization")
if "classList.remove('road3d-ready')" not in road:errors.append("Context-loss fallback absent")
if "OrbitControls" not in road or "requestAnimationFrame(tick)" not in road:errors.append("Interactive camera or render loop missing")
if "Raycaster" not in road:errors.append("Clickable 3D scene not configured")
if "cycle:choose" not in road or "cycle:selected" not in road:errors.append("No 3D/detail synchronization")
if "cycle:choose" not in controller or "cycle:selected" not in controller:errors.append("Existing stage controller not integrated")
if "prefers-reduced-motion" not in css:errors.append("Motion-reduced fallback missing")
if ".road3d-ready .cycle-orbit-scene" not in css:errors.append("Original diagram fallback hidden incorrectly")
if "@media(max-width:600px)" not in css:errors.append("Mobile styling absent")
if errors:raise SystemExit("\n".join(errors))
print("3D road: 8 controls, camera presets, WebGL fallback and synchronization verified.")
