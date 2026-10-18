# GeoCirculus — GitHub Pages UX scaffold

A responsive static-site demonstration for **GeoCirculus Ecotech**, based on the company's 16 October 2026 venture pitch deck and client-provided waste-management reference books. **This is a design preview, not the official operational website.**

## Preview

Proposed URL (once GitHub Pages is enabled): https://programmer-s-picnic.github.io/gcs/

## Architecture

Each route has its own folder with an `index.html`. Shared files are only in `assets/`. No build tooling, package manager, server-side scripts, framework, or database.

```text
/
  index.html
  about/index.html
  solutions/index.html
  materials/index.html
  projects/index.html
  impact/index.html
  learn/index.html
  learn/foundations/index.html
  learn/plastics/index.html
  learn/lab/index.html
  insights/index.html
  contact/index.html
  privacy/index.html
  assets/styles.css
  assets/app.js
  assets/mark.svg
  scripts/check_site.py
  .github/workflows/pages.yml
  404.html
  sitemap.xml
  robots.txt
  .nojekyll
```

## What works

- Responsive top navigation and mobile menu.
- Folder-based routes, nested URLs and relative paths compatible with the /gcs/ GitHub Pages project path.
- Six site purposes: credibility, business development, solutions, thought leadership, impact, and deep interactive learning.
- Three browser-only exercises: adjustable waste calculation, 6-question segregation quiz, and 5-stage materials journey.
- Accessible navigation and live region feedback, reduced-motion preferences, SEO metadata, sitemap and a custom 404.
- Internal link validator run in GitHub Actions.
- Contact page transparently redirects users to the company's existing official contact route; it does **not** submit or store enquiries.
- Impact and pilot content distinguishes the 1.5–2 TPD *proposed* node from verified operations.

## Running locally

```sh
python3 -m http.server 8000
# Visit http://localhost:8000/
python3 scripts/check_site.py
```

## GitHub Pages

A deployment action runs on push to `main`. If the initial action reports that Pages is disabled, open **Repository → Settings → Pages → Build and deployment → Source: GitHub Actions**; save, then rerun **Actions → Deploy GeoCirculus preview to GitHub Pages**. The standard `GITHUB_TOKEN` cannot activate Pages for a disabled repository automatically.

## Updating the site

1. Edit the desired folder's `index.html`.
2. Update shared `assets/styles.css` or `assets/app.js` only for site-wide behavior.
3. Run `python3 scripts/check_site.py` before pushing.
4. Check the Actions workflow and preview site.

The page templates are currently plain HTML by design. A future CMS or generation step can reduce duplicated header/footer markup while preserving public folder/index.html URLs.

## Content and release policy

- Prototype visuals are illustrative. The leaf-loop symbol is a **temporary scaffold mark**, not an approved company logo.
- Leadership names, plant location, partner claims, service availability, certifications, financial forecasts and impact metrics need client verification before official release.
- The pitch deck identifies a **proposed** 1.5–2 TPD node; do not publish it as commissioned or operating without evidence.
- Educational explanations are original summaries informed by the supplied materials. Do not republish copyrighted handbooks or lectures.
- Verify current Indian waste laws and statistics against original current authorities before publishing.
- The preview uses `noindex,follow` intentionally to avoid search results confusing it with the official site. Remove only after approval and domain migration.
- On the preview, enquiry collection is deliberately disabled.

## Suggested next steps

Client review → content/identity approvals → verified facility details → licensed imagery → fuller curriculum → admin workflow → production migration.

Source maintained in Programmer-s-Picnic/gcs.

## Venture presentation

The **20-slide restyled web presentation** is available at `presentation/index.html`, with slide content in `presentation/data.js`, display logic in `presentation/deck.js`, and styling in `presentation/deck.css`. It preserves the pitch deck's topics and reported figures but is a browser-native redesign rather than embedded PowerPoint screenshots. It includes autoplay, fullscreen, keyboard and touch controls, direct slide links, and an overview grid. The uploaded source PPTX is not hosted in this repository.

## Interactive circular-journey home hero

The homepage recreates the eight-stage GeoCirculus integrated waste-management model as an interactive CSS 3D-style diagram. Stage labels and order follow the client graphic (generation and reduction; segregation; collection/transport; MRF; recycling; organics; energy recovery; scientific disposal). Each button changes a detailed educational panel. Controls include prior/next navigation, a 6.5-second guided tour, mouse-responsive depth, keyboard arrow navigation and a mobile two-column layout. An explanatory note clarifies that treatment pathways are alternatives for different waste fractions, not obligatory sequential processing.

Change copy and learning tags in `assets/circular-journey.js`; change layout/theme in `assets/circular-journey.css`; adjust the actual eight stage buttons in root `index.html`. The original diagram was recreated in browser-native vector/CSS components; the source bitmap is not included. CI runs `scripts/check_cycle_hero.py` and `node --check assets/circular-journey.js`.

## Real 3D circular road (homepage)

The homepage now features a Three.js elevated circular waste-management road with eight clickable stage markers, dynamic stage highlights, soft lighting, landscaping and perspective depth. Users can orbit by dragging, zoom by wheel/pinch, select an overhead Top View, switch to Perspective, focus the camera on a selected checkpoint, or Reset. Selecting a checkpoint synchronizes the existing explanation panel and its guided tour. The eight accessible checkpoint buttons beneath the road are available to keyboard and screen-reader users. The 2D diagram stays in the markup as a fallback if JavaScript modules, the Three.js CDN or WebGL cannot load, including GPU context loss.

The implementation uses the pinned Three.js 0.169.0 and OrbitControls ES modules via the jsDelivr import map in root `index.html`. It does not require a framework or build step. Source: `assets/circular-road-3d.js`; styling: `assets/circular-road-3d.css`. Core stage descriptions and tour remain in `assets/circular-journey.js`.

Site CI checks the JavaScript syntax with Node and validates the 3D markup and responsive fallback with `scripts/check_road3d.py`. The first visit requires connectivity to the third-party Three.js module CDN; on failure the original 2D stage experience remains available.

## Illustrated checkpoints and fullscreen (October 2026)

Each of the eight waste-management checkpoints now has a distinct, locally hosted SVG pictogram (source reduction, segregation bins, collection truck, MRF sorting facility, recycling arrows, composting, energy plant, and controlled disposal). SVGs are in `assets/road-icons/` and are used in both the accessible stage buttons and the Three.js labels through a canvas texture.

Use **⛶ Fullscreen** inside the 3D camera controls to enter a dedicated viewport-sized 3D scene. The fullscreen view keeps rotate/zoom, top/perspective/focus/reset controls, the eight checkpoint buttons and a floating explanation panel with previous/next buttons. The **Exit fullscreen** control or **Esc** leaves fullscreen. **F** also toggles fullscreen when the 3D viewer is focused. When WebGL is unavailable, the existing 2D interactive model remains accessible.

## Approval-only homepage — supplied illustration assets

The root homepage is a link-free client-approval presentation. Website navigation and all clickable anchors were removed **from the homepage only**, leaving the interactive eight-stage road, adjustable 3D camera, fullscreen mode, explanations, and guided tour. The other folder-based pages remain in the repository unchanged.

Eight circular visual crops were extracted from the client-provided integrated waste-management infographic and assembled into a single optimized 4×2 WebP sprite atlas at `assets/road-images/eight-stages.webp`. The atlas preserves the illustration as supplied (including small original numbering and details); it is not a new icon design. Stage buttons, 2D fallback stages, explanation card, and 3D stage billboards use the same source artwork. The atlas contains four images per row, 144px square each; 576×288 total. An accompanying 8-image ZIP is available in the ChatGPT conversation.

### Fullscreen guided tour

The fullscreen stage description now has a **Play guided tour / Pause guided tour** button. It uses the exact same eight-stage, 6.5-second tour as the homepage explanation card; the two controls synchronize through `cycle:toggle-tour` and `cycle:tour-state` custom events. Stage descriptions, focused camera flights, checkpoint selection and both play states remain consistent. If the viewer changes the stage manually or the tab becomes hidden, the tour pauses in both locations. Entering or leaving fullscreen does not reset the tour.
