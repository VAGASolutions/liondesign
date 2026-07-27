# Issue #35 — Tesztek: core komponensek unit tesztelése (hero, stats, pricing wizard)

https://github.com/VAGASolutions/liondesign/issues/35

Parent: #30 (Unit teszt lefedettség kialakítása — umbrella, no blocking work)
References (all closed, implemented): #20, #22, #23, #24 (wizard UX fixes already in
`pricing.component.ts`/`.html` — see scratchpads/22-*.md, 23-*.md, 24-*.md)

No blocker issues — #30 is just the tracking umbrella and the referenced wizard
issues are already merged. Test runner confirmed working: `ng test` (uses
`@angular/build:unit-test`, vitest + jsdom under the hood), baseline 4 spec
files / 23 tests green before this change.

## Scope (from issue body)
1. `hero.component.ts` — particle canvas + word canvas init (mock RAF), just
   needs to run without throwing and clean up on `ngOnDestroy` (no pixel
   assertions).
2. `stats.component.ts` — `IntersectionObserver` trigger drives the count-up
   animation correctly to the target value.
3. `pricing.component.ts` (Design Brief wizard) — `canProceed` per step,
   Next/Back/Skip navigation, edge cases from #20/#22/#23/#24 (required field
   validation, skip-only steps 1/3, back button on summary).

`pricing.component.spec.ts` already exists (built during #22-#24) and covers:
back button hidden on step 0 / shown+working on summary, required-field
indicators, blocked Next + inline errors on step 0, advance once filled,
skip-only steps 1 and 3 (Next blocked, Skip always advances). Missing:
`canProceed` coverage for the other mandatory steps (2,4,5,6,7,8,9,10,11,12),
including array-based fields (mood, visualStyles, sections, features).

## Plan
1. **`hero.component.spec.ts`** (new)
   - Mock `requestAnimationFrame`/`cancelAnimationFrame` (or let jsdom's real
     rAF run but limit ticks) so `ngAfterViewInit` doesn't loop forever in the
     test.
   - Create component, trigger `ngAfterViewInit` (via `detectChanges`),
     assert no throw and canvases exist.
   - Call `ngOnDestroy`, assert `cancelAnimationFrame` was called for tracked
     raf ids (spy on `cancelAnimationFrame`).

2. **`stats.component.spec.ts`** (new)
   - Mock global `IntersectionObserver` (jsdom doesn't implement it) with a
     fake class that stores the callback and lets the test invoke it manually
     with a fabricated `isIntersecting` entry.
   - Mock `requestAnimationFrame` to run synchronously/immediately (invoke
     callback right away, recursively, tracking elapsed time via a fake
     `performance.now()`) so the count-up resolves without real animation
     frames.
   - Assert: before trigger, `.stat-number` text unchanged; after firing the
     observer callback with `isIntersecting: true` and running rAF to
     completion, `el.textContent` equals `target + suffix` for each stat.
   - Assert `observer.unobserve` called once per element (no double-count on
     repeated intersection).

3. **`pricing.component.spec.ts`** (extend existing file)
   - Add a `describe('PricingComponent canProceed per step')` block:
     directly drive `component.currentStep` + `component.brief` fields and
     assert `component.canProceed` toggles false→true per mandatory step
     (2, 4, 5 incl. mood array, 6, 7 visualStyles array, 8 incl.
     sections array, 9, 10, 11 features array, 12), plus default `true`
     beyond `TOTAL_STEPS` (summary step).
   - Keep existing DOM-driven tests as-is (they already exercise #22/#23/#24
     scenarios end-to-end).

4. Run `ng test` (full suite) after each file, confirm all green before
   moving to the next component.

## Test commands
- `cd angular && npx ng test --watch=false`
