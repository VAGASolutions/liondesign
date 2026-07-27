# liondesign

Agency website for **liondesign**, a web design studio offering web design, security analysis, SEO, brand identity, and performance optimisation.

## Tech stack

- **Angular 21** (standalone components) — primary app, in `angular/`
- **Netlify Functions** — serverless backend, in `netlify/functions/`
- **Resend** — transactional email API used by the design-brief form
- **Netlify** — hosting, build, and deploy

## Repository structure

```
angular/                — Angular app (see angular/README.md for setup)
netlify/functions/      — Netlify Functions (e.g. send-brief.js)
netlify.toml            — Netlify build config
CLAUDE.md                — detailed project spec and conventions
```

## Getting started

1. Install dependencies and run the Angular app — see [`angular/README.md`](angular/README.md).
2. Netlify Functions run automatically alongside the Angular dev server when using the Netlify CLI (`netlify dev`), or are deployed separately by Netlify in production.

## Environment variables

Required for `netlify/functions/send-brief.js` (handles the design-brief form submission and emails it via Resend):

| Variable | Required | Description |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | API key for [Resend](https://resend.com), used to send the brief email |
| `RESEND_FROM` | no | Sender address for outgoing emails (defaults to `onboarding@resend.dev`) |

Set these in the Netlify dashboard (Site settings → Environment variables) for deployed environments, or in a local `.env` file when using `netlify dev`.

## Build & deploy

Deployment is handled by Netlify, configured in [`netlify.toml`](netlify.toml):

- **Build base:** `angular/`
- **Build command:** `npm run build`
- **Publish directory:** `dist/liondesign/browser`
- **Functions directory:** `netlify/functions/`
- **Node version:** 22
- **SPA routing:** all routes fall back to `index.html` (200)

Pushing to `main` triggers a Netlify build and deploy automatically.

## Project spec

For design system details, coding conventions, and feature-area breakdowns, see [`CLAUDE.md`](CLAUDE.md).
