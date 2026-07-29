# Issue #33: SEO: dinamikus lang/hreflang az EN/HU váltóhoz + canonical link

https://github.com/VAGASolutions/liondesign/issues/33

Parent: #29 (SEO alapok bevezetése) — 2/3 sub-issues done (#31, #32 closed)
No blockers.

## Problem
- `index.html` has static `<html lang="en">`, never updated when `i18n.service.ts` toggles language at runtime.
- No `<link rel="canonical">` in `index.html`.
- hreflang alternates: not applicable — single-page, single-URL site (no separate /en, /hu routes). Document this as a deliberate non-issue, follow-up only if per-language URLs are introduced later.

## Plan
1. `angular/src/app/services/i18n.service.ts`
   - In `toggle()`, set `document.documentElement.lang = this.lang()` after updating the signal.
   - Also set it in the constructor (so `lang` attribute matches the restored/saved language on initial load, not just on toggle) — needed to satisfy "lang always reflects state" not just "updates on toggle".
   - Add a doc comment (or note in this scratchpad, not code) about hreflang: not applicable since one URL for both languages.
2. `angular/src/index.html`
   - Add `<link rel="canonical" href="https://liondesign.eu/" />`.
   - Leave `<html lang="en">` as static default (matches the service's default init 'en'); it will be corrected client-side by the service on load/toggle.
3. Add/extend `i18n.service.spec.ts`:
   - Test that `toggle()` updates `document.documentElement.lang`.
   - Test that constructor/init sets `document.documentElement.lang` to match restored value from localStorage.
4. Run `/test`.
5. Update README if relevant (probably no README change needed beyond the issue's own tracking).
6. hreflang decision: documented here — not adding hreflang alternate links since this is a single-page app with one canonical URL serving both languages client-side. Follow-up only if per-language routes (e.g. /en, /hu) are introduced in the future.
