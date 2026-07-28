# Issue #28 — Contact komponens: önálló form vagy marad a Pricing CTA-ban

Link: https://github.com/VAGASolutions/liondesign/issues/28
Parent: https://github.com/VAGASolutions/liondesign/issues/25

## Decision
Option B (confirmed with user): keep the Pricing CTA as the contact path.
Update `CLAUDE.md` to match reality instead of rebuilding a standalone
`ContactComponent` + `send-contact.js` function.

## Prior art
- `4f505ad` removed `components/contact/` and its wiring from the app.
- Same treatment as #27 (Testimonials, PR #61): when a listed section no
  longer exists as a standalone component and product intentionally keeps
  it that way, reconcile `CLAUDE.md` instead of restoring code.
- `#contact` anchor currently lives on the `<section id="contact">` inside
  `pricing.component.html` (the CTA card with email + response-time block),
  not a dedicated component/route.

## Plan
1. Edit `CLAUDE.md`:
   - Remove `ContactComponent` from the "Page sections" component list.
   - Keep `#contact` in the anchor ID list (anchor still exists and is
     valid — it's just hosted on the Pricing section), but add a short note
     clarifying `#contact` resolves to the Pricing CTA, not a standalone form.
2. No app code changes needed — component already fully removed, anchor
   already wired correctly.
3. Commit, push branch, update issue #28 (and check on parent #25 — once
   both #27 and #28 are done, #25 should be closable too).

## Acceptance criteria
Code and CLAUDE.md spec match — no documented but non-existent component;
`#contact` behavior is documented accurately.
