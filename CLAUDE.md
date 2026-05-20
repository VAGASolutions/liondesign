# VaDesign Studio — Project Guide

## What this is
Agency website for **VaDesign**, a web design studio offering web design, security analysis, SEO, brand identity, and performance optimisation. The site includes an embedded "Instant Site Audit" analyzer tool.

## File structure
```
frontend/
  index.html       — single-page site (all sections in one file)
  css/styles.css   — all styles (light + dark theme via .dark class on <html>)
  js/main.js       — all JS: particles, animations, radar chart, 3D scroll, form handling
```

## Design system
- **Brand:** VaDesign — logo splits as `Va<span>Design</span>` where `Design` renders in the accent color
- **Accent color:** `--primary: #f59e0b` (amber) in both light and dark themes
- **Fonts:** Inter (body/headings), JetBrains Mono (monospace/analyzer input)
- **Dark mode:** toggled via `.dark` class on `<html>`, persisted in `localStorage`
- **Themes:** CSS custom properties in `:root` (light) and `.dark` overrides

## Key JS systems
- **Particle canvas** — fixed background, mouse-interactive (`#particle-canvas`)
- **Word canvas** — animated particle text cycling through brand words (`#word-canvas`), include `'VaDesign'` in the `WORDS` array
- **3D scroll** — sections tilt/scale in 3D on scroll (the `init3DScroll` IIFE in main.js)
- **Radar chart** — SVG drawn by JS in the analyzer section
- **Stats counter** — IntersectionObserver triggers count-up animation

## Conventions
- All sections live in `index.html` — no routing, no build tool, plain HTML/CSS/JS
- Amber accent (`#f59e0b`) is the single brand color; use it for hovers, highlights, borders, icons
- Section IDs: `#hero`, `#services`, `#stats`, `#process`, `#portfolio`, `#analyzer`, `#testimonials`, `#pricing`, `#contact`
- Contact email: `webkorte@gmail.com`
- CSS is mobile-first with breakpoints at 1024px and 768px
- Do not add a build step or bundler unless explicitly asked

## Brand naming
- Display name: **VaDesign**
- Logo markup: `Va<span>Design</span>` (span gets `color: var(--primary)`)
- Footer copyright: `© 2026 VaDesign Studio`
- Never use the old name "KORTE" or "korte" anywhere in the codebase
