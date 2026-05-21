# LionDesign Studio — Angular App

Angular 21 frontend for the LionDesign web design agency site.

## Development

```bash
cd angular
npm install          # first time only
npx ng serve         # dev server at http://localhost:4200
```

## Build

```bash
npx ng build         # production build → dist/liondesign/browser/
```

## Generate a component

```bash
npx ng generate component components/<name>
```

## Project structure

```
src/
  app/
    components/      # one folder per page section
    services/        # shared services
    models/          # TypeScript interfaces/types
    app.ts           # root component
    app.routes.ts    # route definitions
    app.config.ts    # provideRouter, etc.
  styles.scss        # global CSS custom properties + resets
  main.ts            # bootstrap entry
public/
  img/               # portfolio images
  favicon.ico
```

## Netlify deployment

Configured via `netlify.toml` in the repo root:
- Base: `angular/`
- Build command: `npm run build`
- Publish dir: `dist/liondesign/browser`
- SPA redirect: `/* → /index.html` (200)

## Tests

```bash
npx ng test          # unit tests (Vitest)
```
