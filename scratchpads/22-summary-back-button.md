# Issue #22 — Wizard: Vissza gomb hozzáadása az összegzés (summary) lépéshez

https://github.com/VAGASolutions/liondesign/issues/22

Parent: #20 (Design Brief wizard — TODO.md UX hiányosságok javítása)

## Problem
`pricing.component.html:675` wraps the whole footer nav (Back/Next/Skip) in
`@if (currentStep < TOTAL_STEPS)`. Step 13 (`currentStep === 13`, the summary
screen) falls outside that condition, so there's no Back button there — only
"Send Brief" / "Book a consultation". User can't go back to edit prior steps
without closing (and losing) the brief.

`back()` in pricing.component.ts already just decrements `currentStep` and
never touches `brief`, so data preservation is already correct — this is a
template-only bug.

## Plan
1. Restructure the footer template: keep `<div class="brief-modal-footer">`
   always rendered (drop the outer `TOTAL_STEPS` guard), keep the Back button
   condition as `currentStep > 0` (unconditional otherwise), and move the
   `TOTAL_STEPS` guard onto just the `.brief-nav-right` (Skip/Next/Finish)
   block so those don't show on the summary step.
2. Manually verify: step 13 shows only Back on the left, no Next/Skip on the
   right; clicking Back goes to step 12 with all previously entered brief
   data intact.
3. Add a small spec file for PricingComponent covering: back button hidden on
   step 0, back button visible + working on step 13 (summary), and that
   `next`/`skip` controls aren't rendered on step 13.
