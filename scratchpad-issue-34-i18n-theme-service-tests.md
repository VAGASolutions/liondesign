# Issue #34: Tesztek — services (i18n, theme) unit tesztelése

https://github.com/VAGASolutions/liondesign/issues/34
Parent: https://github.com/VAGASolutions/liondesign/issues/30

## Feladat
- `i18n.service.ts`: nyelv toggle, localStorage perzisztencia, szótár lekérdezés helyes/hiányzó kulcsokkal.
- `theme.service.ts`: `.dark` class toggle, localStorage perzisztencia, `prefers-color-scheme` fallback.

## Prior art
- Nincs korábbi PR/scratchpad ehhez az issue-hoz.
- CI (`.github/workflows/*.yml`) már készen áll: ha van `*.spec.ts`, lefuttatja `npm test`-et (vitest, `@angular/build:unit-test` builder, `tsconfig.spec.json` -> `vitest/globals` types).
- `angular/package.json` már tartalmazza a `vitest`/`jsdom` dev depeket.

## Services vizsgálata
- `I18nService` (`src/app/services/i18n.service.ts`):
  - `lang = signal<Lang>('en')`, `t = computed(...)` a TRANSLATIONS dict-ből.
  - constructor: `localStorage.getItem('lang')` -> ha van, azt használja, egyébként 'en'. Nincs validáció érvénytelen értékre (pl. 'fr' bekerülne lang-ba, de TRANSLATIONS['fr'] undefined lenne -> computed() dobna hibát). Edge case tesztelendő.
  - `toggle()`: en<->hu vált, majd localStorage.setItem.
- `ThemeService` (`src/app/services/theme.service.ts`):
  - `dark = signal(false)`, DOCUMENT injektálva.
  - constructor: `localStorage.getItem('theme')` ha van, azt használja ('dark' string egyenlőség), egyébként `matchMedia('(prefers-color-scheme: dark)').matches` fallback.
  - `effect()`: `.dark` class toggle a document.documentElement-en + localStorage.setItem.
  - `toggle()`: dark signal invert.
  - Angular effect() csak injection context-ben fut le automatikusan (TestBed) — teszthez `TestBed.runInInjectionContext` vagy a service-t simán DI-vel kell létrehozni, hogy az effect lefusson (flushEffects / awaiting microtask).

## Terv
1. `i18n.service.spec.ts` létrehozása:
   - default lang 'en' ha nincs localStorage érték
   - localStorage-ből olvasott érvényes 'hu' érték respektálása
   - toggle() en->hu->en, és localStorage frissül
   - t() a megfelelő kulcsokat adja vissza az aktuális nyelven
   - hiányzó kulcs -> undefined (mivel Record<string,string>, nincs fallback logika)
2. `theme.service.spec.ts` létrehozása:
   - nincs localStorage érték, prefers-color-scheme: dark -> dark=true
   - nincs localStorage érték, prefers-color-scheme: light -> dark=false
   - localStorage 'theme'='dark' felülírja a media query-t
   - localStorage 'theme'='light' felülírja a media query-t
   - érvénytelen localStorage érték (pl. 'invalid') -> mivel `saved ? saved==='dark' : prefersDark`, invalid truthy string -> dark=false (mert !== 'dark') — ezt teszteljük edge case-ként
   - toggle() a dark jelet invertálja
   - effect lefutása után a `.dark` class megjelenik/eltűnik a document.documentElement-en, és localStorage frissül
3. `matchMedia` mock szükséges (jsdom nem implementálja alapból) — global mock a spec fájlban vagy setup fájlban.
4. `localStorage` mock/reset each teszt előtt (`beforeEach` -> `localStorage.clear()`), és `vi.spyOn` szükség esetén.
5. Futtatás: `npm test` (angular:test builder -> vitest).
6. Commit lépésenként: i18n teszt, majd theme teszt.
