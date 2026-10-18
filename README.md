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
