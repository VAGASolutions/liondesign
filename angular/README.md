# liondesign — Angular app

Angular 21 frontend for the liondesign agency site. See the [root README](../README.md) for the full project overview, environment variables, and deploy process, and [`../CLAUDE.md`](../CLAUDE.md) for design system and coding conventions.

## Setup

```bash
npm install
npm start        # ng serve — dev server at http://localhost:4200
```

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Run the dev server (`ng serve`) |
| `npm run build` | Production build, output to `dist/liondesign/browser` |
| `npm run watch` | Development build in watch mode |
| `npm test` | Run unit tests (Vitest) |

## Structure

```
src/
  app/
    app.ts, app.html, app.scss   — root component
    app.config.ts                — application config (providers, router)
    app.routes.ts                — route definitions
    components/<name>/           — page section components (one folder each)
    services/                    — shared services (i18n, theme, ...)
  styles.scss                    — global styles
  main.ts                        — bootstrap entry point
public/                          — static assets (images, favicon)
```

Current section components: `hero`, `services-section`, `stats`, `process`, `portfolio`, `pricing`, `marquee`, `nav`, `footer`.
