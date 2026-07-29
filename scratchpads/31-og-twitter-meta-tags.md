# Issue #31: SEO — Open Graph + Twitter card meta tags

https://github.com/VAGASolutions/liondesign/issues/31

## Task
Add missing social-sharing meta tags to `angular/src/index.html` `<head>`:
- `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- `twitter:card` (`summary_large_image`), `twitter:title`, `twitter:description`, `twitter:image`
- A dedicated OG image (1200×630) under `public/img/`, amber (#f59e0b) brand accent.

## Acceptance criteria
Tested with a link-preview validator (Twitter Card Validator / metatags.io) — title, description,
image render correctly.

## Decisions (confirmed with user)
- Site URL: `https://liondesign.eu`
- OG image: build as SVG (1200x630, amber accent, "LionDesign" wordmark), rasterize to PNG via
  temporary `sharp` install (no image tooling present locally: no imagemagick/puppeteer/canvas).

## Plan
1. Create `angular/public/img/og-image.svg` — 1200x630 design: dark bg, amber accent shapes,
   "LionDesign" wordmark (Lion + amber "Design"), tagline ("Web Design · Security · SEO").
2. `npm install -D sharp` in `angular/`, run a one-off script to rasterize SVG → `og-image.png`
   (1200x630), then remove the sharp devDependency again (keep footprint clean) — confirm with
   user before uninstalling if tests still need it.
3. Add meta tags to `angular/src/index.html` `<head>`:
   - `og:title` = "LionDesign Studio — Web Design · Security · SEO"
   - `og:description` = same as existing meta description
   - `og:image` = `https://liondesign.eu/img/og-image.png`
   - `og:url` = `https://liondesign.eu`
   - `og:type` = `website`
   - `twitter:card` = `summary_large_image`
   - `twitter:title`, `twitter:description`, `twitter:image` mirroring og: equivalents
4. Run `/test`.
5. Manually sanity check tag values (can't run live validator without deploy — note this in PR).
6. Update issue, push branch, run `/rewiewpr`.
