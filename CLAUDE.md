# CLAUDE.md

## Project
Mise — a weekly meal planner web app. Goal: intuitive, modern, useful, simple.

**Starting a session:** read *Where things stand* at the top of `README.md` — live commit, open
PRs, known defects, what's queued. The rest of that file has the data model and the decisions
already taken; read it before proposing changes, because several things are missing on purpose.

## Working with me
- Ask when something is unclear or a decision is uncertain. Don't guess silently.
- State the decisions you did make and why, in one or two lines each.
- Explain things simply — I'm a non-tech vibe coder, not a developer.
- **"Update the docs"** (however I phrase it) means sweep *every* markdown file in the repo
  against the current state — `CLAUDE.md`, `README.md`, and anything else by then.
- Keep this file at **around 150 lines**. It's meant to be read, not skimmed: a convention with
  its reasoning attached is worth more than a terse bullet that gets misapplied later.

## Hard constraints
- **Never commit code to `main` directly.** Any change to `index.html`, `style.css` or `app.js`
  goes on its own branch and comes back through a PR. Documentation only — `CLAUDE.md`,
  `README.md` — may be committed straight to `main`.
- Vanilla HTML, CSS, JavaScript only. No frameworks, no libraries, no build step.
- All data persists in the browser (`localStorage`). No server, no database, no API calls.
- Hosted on GitHub Pages: static files over plain HTTP. Relative paths only (no leading `/`),
  entry point `index.html` at the repo root. ES modules are fine but need a local server to
  test — `python -m http.server` from the repo root.

## Workflow
The loop every code change goes through, in order:

1. Branch off `main`, named for the change not the round (`mobile-week`, `sidebar-day-view`).
2. Build it, then check it — see *Testing*. A visual change means a browser, mine or yours.
3. Open a PR saying what changed and what was **not** verified. Be honest in the second half;
   it's the part that gets read before merging.
4. Review it against its own description, re-reading the diff if commits landed after the
   review — a branch can grow into a different change than the one reviewed.
5. Squash-merge, delete the branch.
6. Watch the Pages build to `built` (command in *Deployment* in `README.md`), then update *Where
   things stand*. Part of merging, not an optional tidy afterwards.

## Layout
`index.html` is the page shell, `style.css` all styling, `app.js` the catalogue plus state,
rendering and one event handler. `Mockups/` holds the design concepts this layout was built
against; *How the code is organised* in `README.md` has the detail. Add files only when one gets
unwieldy. One gotcha: the nav sits at body level, not inside `.topbar`, because a
`backdrop-filter` ancestor becomes the containing block for anything fixed inside it.

## Conventions
Established in v1 and extended since — follow them or say why not:

- **State:** one `state` object for everything about the user. `RECIPES` is fixed and never stored.
- **Recipe tags:** every recipe carries exactly one macro tag — `high-protein` or `balanced` — and
  Indian ones carry `indian`. The catalogue is meant to stay over half Indian and over two thirds
  high-protein, so adding recipes means checking those ratios still hold.
- **Two ways to add a meal, never merged:** from an *empty* week slot, the inline picker under the
  week — day and meal already known, so never ask again; from a recipe card, the `#picker` dialog.
  One component draws both — `cardHtml(recipe, slot)` renders every recipe list, the slot argument
  swapping its primary button between the routes. Don't fork it for a new list.
- **Plan shape:** flat, keyed by real date and meal — `state.plan['2026-08-26|Dinner'] = recipeId`.
  Keyed by date, not weekday, so each week is genuinely its own plan.
- **Storage:** one JSON blob under one key, `p5:mealplanner`. try/catch every read *and* write
  (quota errors and private mode are real) and validate on load, dropping anything unrecognised.
  Plan, bookmarks and theme persist; view, week, search, filters and `focusDay` are per-session on
  purpose — theme excepted, because one you picked and lost on reload is a bug, not a fresh start.
  `index.html` reads the key inline in `<head>` to paint before first paint, so it lives in two
  places: change one, change the other.
- **One day at a time, at every width.** The week is a bar — date range between two arrows, seven
  day buttons under it — then that day as three meal cards (`state.focusDay`). No accordion and
  no mobile-only week: the seven columns, the rails, `expandAll`, `--week-cols` and the `subgrid`
  row sharing went when the mockups settled on one day. Don't bring a second week markup back.
- **The shell flips at 1000px, the week does not.** Over 1000px `body` is a two-column grid: the
  nav becomes a left sidebar under the brand, the top bar keeps only the theme button, the week
  gains its summary column. Under it, nav is the docked pill and the brand is in the top bar.
  **One set of nav markup either way** — two lists drift, and two `<nav>`s are two landmarks for
  one control.
- **The summary column is derived, so it may be dropped.** Everything in `.week-side` is computed
  from the day beside it, so hiding it under 1000px loses nothing — and anything that can only be
  read there doesn't belong there.
- **One box per level:** a card gets the border; inside it is a filled tile or a hairline and a
  label, never a second outline. Nested boxes were the worst thing about v1's week, and it's why
  no day card wraps the meals — the `<h2>` above them already names the day.
- **The page carries the warmth; the cards are the light.** `--bg` warm off-white, `--surface` the
  near-white every card takes, `--surface-sunk` a step deeper for trays and tiles, `--surface-past`
  back *towards* the page for days gone by — towards it, never past it. **Measure both directions
  with a script:** text on its ground needs 4.5, two touching surfaces about 1.10 or the edge is
  gone. Where a pair must sit closer, as a receding past day does, a hairline carries the edge —
  and then it's the *line* you measure, against both sides.
- **`--accent` fills, `--accent-ink` writes.** The accent is legible as a background but lands at
  4.47 as text on a tinted tile, so every accent-coloured *word* uses `--accent-ink`, one step
  deeper; borders, dots, chips and fills use `--accent`. Backwards is how the floor breaks quietly.
- **Subject gets the weight:** in the add-to-week dialog the recipe takes the large type and "Add
  to week" is a small uppercase eyebrow over it. Views get no eyebrow — a heading and one
  subtitle, hard left, on the sidebar's edge.
- **Filter chips:** grouped by `TAG_GROUPS` in `app.js`. A tag missing from that list still
  renders, under *More* — so adding a recipe tag can never make a chip disappear.
- **Rendering:** change state, then redraw the whole view from it — no diffing, no partial
  updates. Views are HTML strings, so run any text through `escapeHtml` before `innerHTML`. No
  inline `onclick`: one delegated listener dispatches on `data-action`, which is why a redraw
  never needs listeners re-attached.
- **CSS:** colours and spacing via the custom properties at the top of `style.css` — don't
  hardcode new hex values. One accent colour. **Style by class, never by id:** an id outranks
  every media query written to override it, which is trap one below waiting to happen again.
- **Anything keyed to the *theme* reads the theme, not the OS.** It's a stored choice, so
  `prefers-color-scheme` is the wrong signal — that's how `theme-color` shipped light chrome over
  a dark page. Set it from the live `--bg`, in the `<head>` script too or it flashes.

### Five CSS traps this project has already fallen into
Each cost a real bug; *Decisions worth recording* in `README.md` has the full story of each.
- **Media queries add no specificity,** so a base rule *below* one beats it on source order. All
  of them live at the end of `style.css` — and an id selector outranks the lot, per the CSS rule.
- **A grid item with auto inline margins shrink-to-fits rather than stretching.** `.page` has
  `margin: 0 auto`, so over 1000px, where `body` is a grid, it needs `width: 100%` — without it
  the week rendered at a third of its width. Don't remove that `width`.
- **Breakpoints** are 1000/620/400px `max-width`, one `min-width: 1001px`, plus `pointer: coarse`.
  The `max-width` ones stay **descending** or a wider query overrides a narrower one; extend a
  block rather than opening a second at the same width. And put one **where the arithmetic bites**
  — the day row wraps at 400px because seven 44px chips plus gaps need 332px, 401px giving 46 each.
- **Dialog `display` hangs off `[open]`.** A bare `display` on `.sheet` beats the UA's
  `dialog:not([open]) { display: none }` — author origin wins — so both sheets render always.

## Accessibility
Every defect this project has shipped has been one of these, so it gets its own section:

- Semantic HTML, labels on inputs, native `<dialog>` for modals.
- **Keyboard must work without a mouse.** A redraw destroys whatever was focused, so put focus on
  what *replaced* the control just activated. Five places do: `closeSlotPicker()`, the day chip,
  the Add button a cleared meal leaves, the save star (one lookup covers the week, both lists and
  the dialog), and **Today**, which deletes itself when pressed. **A conditionally-rendered
  control is the one that gets missed** — both focus bugs here were one.
- **Never leave a card unnamed, never hide a focusable control.** The day is a real `<h2>` over the
  meal cards, each meal an `<h3>`, so nothing is hidden to make the layout work. If a heading must
  vanish on screen, `.sr-only` keeps it in the outline where `display: none` would not — and only
  on something not focusable.
- **Touch targets at least 44px**, width as well as height, measured at 360px and not at whatever
  your window happens to be. Controls are compact on a fine pointer and `pointer: coarse` lifts
  them back, so a later rule outranking that block silently breaks the floor — which has now
  happened to the dialog's icon buttons and to the week bar's arrows.

## Scope
Not in v1, deliberately: month calendar, shopping list, user-added recipes, drag-and-drop,
sharing/syncing, recipe photography. Don't add these unless asked; *Not in v1* in `README.md` has
the reasoning. Photography is the trap — the mockups show one per meal and fetching any would
break "no API calls".

## Testing
No test framework unless asked. *Testing* in `README.md` records what each round checked; this is
the rule.

**Read, look and measure — each catches what the other two miss, and this project has been bitten
skipping each in turn.** Reading the CSS twice missed a week rendering at a third of its width;
one screenshot found it and five more. A later round found six things no screenshot can show: a
contrast ratio of 1.02, a class no rule matched, a focus target that no longer existed. So a
rendered look is the check for anything touching layout, never an optional extra — and **I check
the app in a browser as we iterate**, so never write that it has never been looked at. Name what a
change has *not* been seen against; hand over an unlooked-at layout change rather than call it done.

For logic, a throwaway Node script against a stub DOM: stub what `app.js` touches on load, drive
`state` and the delegated handler, assert on the returned HTML. Kept outside the repo — see the
open question about committing a `check.mjs` in `README.md`. The static checks are nearly free:
`node --check`, every id the JS looks up exists, no class emitted without a rule, no id selectors,
`max-width` queries descending, no base rule below the first media query. Measure contrast both
directions from the tokens in `style.css`; mind that *opacity* blends text back towards its tile
and undoes them, which is why past days are quieter by colour.

Two gaps neither a script nor a desktop closes, so name them rather than assume: **a real phone**
(a desktop never enters `pointer: coarse`, so touch targets are untested by construction) and
**keyboard-only with a screen reader**. **Screenshots:** none in the repo, and `*.png`/`*.jpg` are
gitignored so a camera-named one can't be committed by accident (`Mockups/` excepted; a real set
needs its own exception). Stale ones get deleted, not captioned — a shot of the wrong version is
worse than none. Descriptive filenames, and hard-refresh first.
