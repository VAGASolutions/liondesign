# Issue #36 — README.md létrehozása (root + angular/)

Link: https://github.com/VAGASolutions/liondesign/issues/36

## Plan
1. Root `README.md`:
   - Project description (liondesign agency site)
   - Tech stack: Angular 21, Netlify Functions, Resend email API
   - Dev setup pointer to `angular/README.md`
   - Build & deploy (Netlify, netlify.toml base/publish dir)
   - Env vars: `RESEND_API_KEY`, `RESEND_FROM` (optional) for `netlify/functions/send-brief.js`
   - Link to `CLAUDE.md` as detailed spec
2. `angular/README.md`:
   - Angular-specific setup: `npm install`, `npm start` (ng serve), `npm run build`, `npm test`
   - Where components/services live (`src/app/components/`, `src/app/services/`)
   - Link back to root README / CLAUDE.md

## Acceptance criteria
A new developer can spin up and run the project locally using only the README, no external help.
