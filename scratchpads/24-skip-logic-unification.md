# Issue #24 — Wizard: "Kihagyom" logika egységesítése és érvényesítése

https://github.com/VAGASolutions/liondesign/issues/24

Parent: #20 (Design Brief wizard — TODO.md UX hiányosságok javítása)
Siblings: #22 (Back button on summary — merged), #23 (Required field markers — this branch's base)

## Problem
The Skip button (`pricing.component.html:755`) only appears on steps 1 and 3
(`currentStep === 1 || currentStep === 3`). Those two steps aren't covered by
the `canProceed` switch (`pricing.component.ts:349`), so they fall into the
`default: return true` branch — Next is always enabled there, making Skip
redundant and the "fill in or explicitly skip" rule (TODO.md item 3)
unenforced.

## Step map (all 13 data steps, 0–12; step 13 is the summary and out of scope)
- 0, 2, 4, 5, 6, 7 (styles only), 8, 9, 10, 11, 12: **mandatory**, already
  enforced by `canProceed` (added in #23). No Skip button, no change needed.
- **1** (current site URL) and **3** (frontend preference): **optional via
  Skip only** — these are the only two steps with a Skip button. Currently
  the only steps missing from `canProceed`.

So the fix only touches steps 1 and 3.

## Plan
1. **`pricing.component.ts`**
   - Add to `canProceed`: `case 1: return !!b.currentSiteUrl.trim();` and
     `case 3: return !!b.frontend;` — Next is now blocked until filled,
     matching every other step.
   - Add a `skip()` method: unconditionally advances `currentStep` (like
     `next()` but without the `canProceed` gate) and resets `attemptedNext`.
     This is the only way to move past 1/3 without filling the field.

2. **`pricing.component.html`**
   - Change the Skip button's `(click)="next()"` to `(click)="skip()"`.
   - Add `[class.field-invalid]` + inline `.field-error` to the step 1 URL
     input and step 3 frontend chips, using the existing `invalid()` helper,
     consistent with steps 0/2/4/etc. Reuse a new i18n string (not
     "required", since the field itself is optional — the message should
     say "fill in or use Skip").

3. **`i18n.service.ts`**: add `brief.error.fillOrSkip` (EN/HU) — "Fill in this
   field or click Skip to continue." / "Töltsd ki a mezőt, vagy kattints a
   Kihagyom gombra."

4. **`pricing.component.spec.ts`**: add cases —
   - step 1: Next with empty URL does not advance; Skip advances regardless.
   - step 3: Next with no frontend selected does not advance; Skip advances
     regardless.
   - filling the field then Next also advances (parity with Skip).

5. Run the component spec, then the full test suite.
