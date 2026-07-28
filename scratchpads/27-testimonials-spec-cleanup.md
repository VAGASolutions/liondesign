# Issue #27 — Testimonials komponens: visszaállítás vagy spec törlése

Link: https://github.com/VAGASolutions/liondesign/issues/27
Parent: https://github.com/VAGASolutions/liondesign/issues/25

## Decision
Option B (confirmed with user): TestimonialsComponent stays removed. Update
`CLAUDE.md` to match reality instead of restoring the component.

## Prior art
- `5dd42c0` removed `components/testimonials/` and its wiring from `app.html`/`app.ts`.
- `7e18b3e` did the identical cleanup for the removed Analyzer component — same
  pattern to follow here: strip `TestimonialsComponent` and `#testimonials`
  from the "Page sections" list and anchor ID list in `CLAUDE.md`.
- Verified no live `#testimonials` references remain in nav/footer/components
  (the one hit in `pricing.component.ts` is an unrelated wizard form option
  label, not a scroll target).

## Plan
1. Edit `CLAUDE.md`:
   - Remove `TestimonialsComponent` from the "Page sections" component list.
   - Remove `#testimonials` from the anchor ID list.
2. No app code changes needed — component already fully removed.
3. Commit, push branch, update issue #27 (and check on parent #25).

## Acceptance criteria
Code and CLAUDE.md spec match — no documented but non-existent component.
