# CLAUDE.md

## Project
Mise — a weekly meal planner web app. Goal: intuitive, modern, useful, simple.

**Starting a session:** read *Where things stand* at the top of `README.md` first — live commit,
open PRs, known defects, what's queued. The rest of that file has the data model and the decisions
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

1. Branch off `main`. Name it for the change, not the round (`mobile-week`, `sidebar-day-view`).
2. Build it, then check it — see *Testing*. A visual change means opening a browser, or handing
   it to me to look at; don't merge a layout claim neither of us has seen.
3. Open a PR whose description says what changed and what was **not** verified. Be honest in
   that second half; it's the part that gets read before merging.
4. Review the PR against its own description before merging. Re-read the diff if commits were
   pushed after the review — a branch can grow into a different change than the one reviewed.
5. Squash-merge, delete the branch.
6. Watch the Pages build to `built` (command in *Deployment* in `README.md`), then update
   *Where things stand* — live commit, open work, anything that shipped broken. Part of
   merging, not an optional tidy afterwards.

## Layout
`index.html` is the whole page shell, `style.css` all styling, `app.js` the catalogue plus state,
rendering and one event handler. `Mockups/` holds the supplied design concepts the current layout
was built against; `Screenshots/` was deleted, and a new one takes descriptive filenames rather
than camera defaults. *How the code is organised* in `README.md` has the detail. Two things worth
knowing here: the nav lives at body level rather than inside `.topbar`, because a
`backdrop-filter` ancestor would become its containing block — and add files only when one gets
unwieldy.

## Conventions
Established in v1 and extended since — follow them or say why not:

- **State:** one `state` object for everything about the user. `RECIPES` is fixed and never stored.
- **Recipe tags:** every recipe carries exactly one macro tag — `high-protein` or `balanced` — and
  Indian ones carry `indian`. The catalogue is meant to stay over half Indian and over two thirds
  high-protein, so adding recipes means checking those ratios still hold.
- **Two ways to add a meal, never merged:** from an *empty* week slot, the inline picker under the
  week — day and meal already known, so never ask again; from a recipe card, the `#picker` dialog.
  One component draws both: `cardHtml(recipe, slot)` renders every list of recipes, and the slot
  argument swaps its primary button between the two routes. Don't fork it for a new list.
- **Plan shape:** flat, keyed by real date and meal — `state.plan['2026-08-26|Dinner'] = recipeId`.
  Keyed by date, not weekday, so each week is genuinely its own plan.
- **Storage:** one JSON blob under one key, `p5:mealplanner`. Wrap every read *and* write in
  try/catch — quota errors and private mode are real. Validate on load and drop anything
  unrecognised. The plan, bookmarks and theme are saved; view, week, search, filters and
  `focusDay` are per-session on purpose. Theme is the deliberate exception: one the user picked
  and lost on reload is a bug, not a fresh start. `index.html` reads the key inline in `<head>`
  to paint before first paint, so it is written in two places — change one, change the other.
- **One day at a time, at every width.** The week is a bar — date range between two arrows, seven
  day buttons under it — then that day as three meal cards (`state.focusDay`). No accordion and
  no mobile-only week: the seven columns, the rails, `expandAll`, `--week-cols` and the `subgrid`
  row sharing went when the mockups settled on one day. Don't bring a second week markup back.
- **The shell flips at 1000px, the week does not.** Over 1000px `body` is a two-column grid: the
  nav becomes a left sidebar under the brand, the top bar keeps only the theme button, and the
  week gains its summary column. Under it, the nav is the docked pill and the top bar has the
  brand. **One set of nav markup either way** — two lists is two things to drift, and two
  `<nav>`s is two landmarks for one control.
- **The summary column is derived, so it may be dropped.** Everything in `.week-side` is computed
  from the day beside it, which is why hiding it under 1000px loses nothing. Anything that can
  only be read there doesn't belong there.
- **One box per level:** a card gets the border; what sits inside is a filled tile or a hairline
  and a label, never a second outline. Nested boxes were the main thing wrong with v1's week, and
  it's why there is no day card around the meals — the `<h2>` above them already names the day.
- **The page carries the warmth; the cards are the light.** `--bg` is a warm off-white,
  `--surface` the near-white every card takes, `--surface-sunk` a step deeper for trays and inner
  tiles, `--surface-past` back towards the page for days gone by. **Measure both directions with
  a script:** text on its ground needs 4.5, and two surfaces that touch need about 1.10 or the
  edge disappears. Where a pair must sit closer, as a receding past day does, a hairline carries
  the edge instead — on the card and on anything inside it.
- **`--accent` fills, `--accent-ink` writes.** The accent is legible as a background but lands at
  4.47 as text on a tinted tile, so every accent-coloured *word* uses `--accent-ink`, one step
  deeper; borders, dots, chips and fills use `--accent`. Backwards is how the floor breaks quietly.
- **Subject gets the weight:** in the add-to-week dialog the recipe carries the large type and
  "Add to week" is a small uppercase eyebrow above it. The views have no eyebrows — a heading and
  one line of subtitle, hard left, lined up with the sidebar's edge.
- **Filter chips:** grouped by `TAG_GROUPS` in `app.js`. A tag missing from that list still
  renders, under *More* — so adding a recipe tag can never make a chip disappear.
- **Rendering:** change state, then redraw the whole view from it. No diffing, no partial updates.
  Views are built as HTML strings, so run any text through `escapeHtml` before it reaches
  `innerHTML`. No inline `onclick` — one delegated listener dispatches on `data-action`, which is
  why a redraw never needs listeners re-attached.
- **CSS:** colours and spacing via the custom properties at the top of `style.css` — don't
  hardcode new hex values. One accent colour. **Style by class, never by id:** an id outranks
  every media query written to override it, which is trap one below waiting to happen again.

### Five CSS traps this project has already fallen into
Each cost a real bug; *Decisions worth recording* in `README.md` has the full story of each.
- **Media queries add no specificity,** so a base rule written *below* one beats it on source
  order. All of them therefore live at the end of `style.css`, after what they override.
- **A grid item with auto inline margins does not stretch to its track** — it shrink-to-fits.
  `.page` has `margin: 0 auto`, so over 1000px, where `body` is a grid, it needs an explicit
  `width: 100%`. Without it the week rendered at a third of its width. Don't remove that `width`.
- **Breakpoints:** 1000px, 620px, 400px as `max-width`, one `min-width: 1001px`, plus
  `pointer: coarse`. The `max-width` ones stay in **descending order**, or a wider query
  overrides a narrower one. Extend an existing block; don't open a second at the same width.
- **Put a breakpoint where the arithmetic says the constraint bites.** The day row wraps at 400px
  because seven 44px chips plus gaps need 332px, and 401px yields 46px each.
- **Dialog `display` hangs off `[open]`.** A bare `display` on `.sheet` beats the UA's
  `dialog:not([open]) { display: none }` — author origin wins — and both sheets then render in
  the page at all times.

## Accessibility
Every defect this project has shipped has been one of these, so it gets its own section:

- Semantic HTML, labels on inputs, native `<dialog>` for modals.
- **Keyboard must work without a mouse.** Redrawing a view destroys whatever was focused — if the
  control just activated lives inside what gets re-rendered, put focus back afterwards. Four
  places do it, each aiming at what *replaced* the control: `closeSlotPicker()`, the day strip
  chip, the Add button a cleared meal leaves behind, and the save star, whose one lookup covers
  the week, both recipe lists and the open dialog.
- **Never leave a card unnamed, and never hide a focusable control from sight.** The day's name is
  a real `<h2>` above the meal cards and each meal name an `<h3>`, so nothing is hidden to make
  the layout work. If a heading ever must vanish on screen, `.sr-only` keeps it in the outline
  where `display: none` would not — and only on something that isn't focusable.
- **Touch targets at least 44px**, width as well as height, measured at 360px rather than at
  whatever your own window happens to be. Controls are compact on a fine pointer and the
  `pointer: coarse` block lifts them back — so a rule that outranks that block on specificity
  silently breaks the floor, which has happened to the dialog's icon buttons and again to the
  week bar's arrows.

## Scope
Not in v1, deliberately: month calendar, shopping list, user-added recipes, drag-and-drop,
sharing/syncing, recipe photography. Don't add these unless asked — *Not in v1* in `README.md`
has the reasoning. Photography is the newest: the mockups show a photo per meal, the catalogue
has none, and fetching any would break "static files, no API calls".

## Testing
No test framework unless asked. Open work is in *Where things stand* in `README.md`.

**A rendered look is the check for anything that changes layout, not the optional extra.** Reading
the CSS twice missed a week rendering at a third of its width; one screenshot found it and five
other flaws in the same pass. **I check the app in a browser as we iterate**, so don't write that
it has never been looked at. Do name what a change has *not* been seen against, and hand over a
layout change neither of us has looked at rather than calling it done.

For logic, a throwaway Node script against a stub DOM: stub what `app.js` touches on load, drive
`state` and the delegated click handler, assert on the HTML strings that come back. Kept outside
the repo — see the open question about committing a `check.mjs` in `README.md`. The static checks
are nearly free: `node --check`, every id the JS looks up exists in the HTML, no class emitted
without a rule, `max-width` queries descending, no base rule below the first media query.

Three gaps neither a script nor a desktop browser closes, so name them rather than assume:
- **A real phone.** Controls are compact on a mouse and only return to 44px under
  `@media (pointer: coarse)`, a block a desktop never enters. Untested by construction.
- **Keyboard-only and screen reader.** Focus order and accessible names.
- **Contrast as a number,** both directions, and mind what *opacity* does: dimming a control
  blends its text back towards the tile and undoes the tokens, which is why past days are
  quieter by colour instead.

**Screenshots:** none in the repo, and `*.png` is gitignored so a camera-named one cannot be
committed by accident — `Mockups/` is excepted. Stale ones get deleted rather than captioned,
because a shot of the wrong version is worse than none. Hard-refresh before taking a fresh set.
