# LionDesign Studio — Project Guide

## What this is
Agency website for **liondesign**, a web design studio offering web design, security analysis, SEO, brand identity, and performance optimisation. The site includes an embedded "Instant Site Audit" analyzer tool.

## Repository structure
```
angular/                   — Angular 21 app (primary codebase)
  src/
    app/
      app.ts               — root component
      app.html             — root template
      app.scss             — root styles
      app.config.ts        — application config (provideRouter, etc.)
      app.routes.ts        — route definitions
    styles.scss            — global styles
    main.ts                — bootstrap entry point
  public/
    img/                   — portfolio images (aeolab.eu.png, brevity.png, etc.)
    favicon.ico
  angular.json             — Angular CLI workspace config
  package.json

netlify.toml               — Netlify build config (base: angular/, publish: dist/liondesign/browser)
CLAUDE.md                  — this file
```

## Design system
- **Brand:** liondesign — logo splits as `Lion<span>Design</span>` where `Design` renders in the accent color
- **Accent color:** `--primary: #f59e0b` (amber) in both light and dark themes
- **Fonts:** Inter (body/headings), JetBrains Mono (monospace/analyzer input) — load via Google Fonts in `index.html` or `styles.scss`
- **Dark mode:** toggled via `.dark` class on `<html>`, persisted in `localStorage`
- **Themes:** CSS custom properties in `:root` (light) and `.dark` overrides

## Angular conventions
- Angular **21**, standalone components (`standalone: true` by default)
- **SCSS** for all component styles
- **Angular Router** configured in `app.routes.ts` — use hash-free HTML5 routing (Netlify handles SPA redirects)
- Components go in `src/app/components/<name>/` — one folder per component
- Services go in `src/app/services/`
- Shared interfaces/types go in `src/app/models/`
- Prefer `inject()` over constructor DI
- Use `@defer` blocks for heavy sections (particle canvas, radar chart) to improve initial load

## Key feature areas to port from `frontend/`
- **Particle canvas** — fixed background, mouse-interactive (`#particle-canvas`)
- **Word canvas** — animated particle text cycling through brand words, include `'liondesign'`
- **3D scroll** — sections tilt/scale on scroll
- **Radar chart** — SVG drawn in the analyzer section
- **Stats counter** — IntersectionObserver count-up animation
- **i18n** — EN/HU language toggle, persisted in `localStorage`

## Page sections (map to Angular components)
`HeroComponent`, `ServicesComponent`, `StatsComponent`, `ProcessComponent`,
`PortfolioComponent`, `AnalyzerComponent`, `TestimonialsComponent`,
`PricingComponent`, `ContactComponent`

Section anchor IDs: `#hero`, `#services`, `#stats`, `#process`, `#portfolio`,
`#analyzer`, `#testimonials`, `#pricing`, `#contact`

## Netlify deployment
- Build base: `angular/`
- Build command: `npm run build`
- Publish dir: `dist/liondesign/browser`
- Node version: 22
- SPA redirect: `/* → /index.html` (200) configured in `netlify.toml`

## Brand naming
- Display name: **liondesign**
- Logo markup: `Lion<span>Design</span>` (span gets `color: var(--primary)`)
- Footer copyright: `© 2026 LionDesign Studio`
- Contact email: `webkorte@gmail.com`
- Never use the old name "KORTE" or "korte" anywhere in the codebase

## General conventions
- Amber accent (`#f59e0b`) is the single brand color; use it for hovers, highlights, borders, icons
- CSS is mobile-first with breakpoints at 1024px and 768px
- No comments unless the WHY is non-obvious
