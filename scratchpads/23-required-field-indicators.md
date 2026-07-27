# Issue #23 — Wizard: Kötelező mezők vizuális jelölése

https://github.com/VAGASolutions/liondesign/issues/23

Parent: #20 (Design Brief wizard — TODO.md UX hiányosságok javítása)
Sibling: #22 (Back button on summary step — already merged, `4813e78`)

## Problem
`canProceed` (pricing.component.ts:348) enforces required fields per step, but
nothing in the template tells the user which fields are required. A disabled
Next button is the only signal. TODO.md item 2.

## Required fields per step (from `canProceed`)
- step 0: siteType, goal
- step 2: audience, b2b
- step 4: hasLogo, hasBrand
- step 5: theme, mood (array, needs 1+)
- step 6: fontStyle, needsHungarian
- step 7: visualStyles (array, needs 1+)
- step 8: pageStructure, sections (array), navStyle, scrollAnimations
- step 9: hasPhotos, needsVideo, iconStyle
- step 10: animationLevel
- step 11: features (array, needs 1+)
- step 12: hasCopy, hasImages
- steps 1, 3: fully optional (skippable) — no required-marks needed

## Plan
1. **Component logic** (`pricing.component.ts`):
   - Add `attemptedNext = signal(false)`.
   - Change `next()`: if `!canProceed` at a validated step, set
     `attemptedNext.set(true)` and return (don't advance) — this is the
     "user tries to proceed" trigger for inline errors, since a genuinely
     disabled button never fires a click at all.
   - Remove `[disabled]="!canProceed"` from the Next button so the click
     handler can run and surface validation feedback (still blocks
     advancing programmatically).
   - Reset `attemptedNext` to `false` in `back()`, `openModal()`, and on a
     successful `next()`.
   - Add `invalid(valid: boolean): boolean { return this.attemptedNext() && !valid; }`
     helper for templates.

2. **i18n** (`i18n.service.ts`): add EN/HU strings:
   - `brief.required` — "Required" / "Kötelező" (used on the `*` mark, via aria-label)
   - `brief.error.required` — "This field is required." / "Kötelező mező."
   - `brief.error.step` — banner shown near Next when blocked, e.g.
     "Please fill in the highlighted required fields." / "Töltsd ki a
     kiemelt kötelező mezőket."

3. **Styles** (`tailwind.css`): add `.required-mark` (amber asterisk),
   `.field-error` (small red/amber inline text), `.field-invalid` modifier
   for `.option-chips`/`.form-input`/`.form-textarea` (red-ish border glow),
   `.brief-step-error-banner` for the step-level message.

4. **Template** (`pricing.component.html`): for every required field listed
   above — add `*` after the label, add `[class.field-invalid]="invalid(...)"`
   on the input/option-chips wrapper, add a conditional `.field-error` message
   below it. Add a step-level error banner near the Next button, shown when
   `attemptedNext() && !canProceed`.

5. **Tests** (`pricing.component.spec.ts`): add cases —
   - clicking Next on step 0 with empty fields does not advance and marks
     `attemptedNext` true / shows error text.
   - filling required fields then clicking Next advances and clears error.
   - required marks are present on known required labels (spot check step 0
     and step 5 for array-based validation).

6. Run `ng test` (or configured test runner) for the affected spec, then a
   full-suite run before wrapping up.

7. Manual/puppeteer check of steps 0, 5, 7 (array-based) if browser tooling
   is available.
