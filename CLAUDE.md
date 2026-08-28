# CLAUDE.md

## Project
Mise — a weekly meal planner web app. Goal: intuitive, modern, useful, simple.

See `README.md` for what the app does, the data model, and the decisions already taken.
Read it before proposing changes — several things are missing on purpose, not by oversight.
**Starting a session:** read *Where things stand* at the top of `README.md` first — it names the
live commit, any open PR, known defects, and what's queued next.

## Working with me
- Ask when something is unclear or a decision is uncertain. Don't guess silently.
- State the decisions you did make and why, in one or two lines each.
- Explain things simply — I'm a non-tech vibe coder, not a developer.
- **"Update the docs"** (or refresh / update documentation, however I phrase it) means sweep
  *every* markdown file in the repo against the current state of the project — `CLAUDE.md`,
  `README.md`, and anything else that exists by then — not just the one we were looking at.
- Keep this file at **around 150 lines**. It's meant to be read, not skimmed: a convention with
  its reasoning attached is worth more than a terse bullet that gets misapplied later.

## Hard constraints
- **Never commit code to `main` directly.** Any change to `index.html`, `style.css` or `app.js`
  goes on its own branch and comes back through a PR. Documentation only — `CLAUDE.md`,
  `README.md` — may be committed straight to `main`.
- Vanilla HTML, CSS, JavaScript only. No frameworks, no libraries, no build step.
- All data persists in the browser (`localStorage`). No server, no database, no API calls.
- Hosted on GitHub Pages: everything must work from static files opened over plain HTTP.
  - Relative paths only (no leading `/`).
  - Entry point is `index.html` at the repo root.
  - ES modules are fine (`<script type="module">`), but they need a local server to test —
    `python -m http.server` from the repo root.

## Workflow
The loop every code change goes through, in order:

1. Branch off `main`. Name it for the change, not the round (`mobile-week`, `feat/ui-polish`).
2. Build it, then check it — see *Testing* below. A visual change means opening a browser.
3. Open a PR whose description says what changed and what was **not** verified. Be honest in
   that second half; it's the part that gets read before merging.
4. Review the PR against its own description before merging. Re-read the diff if commits were
   pushed after the review — a branch can grow into a different change than the one reviewed.
5. Squash-merge, delete the branch.
6. Watch the Pages build to `built` (command in *Deployment* in `README.md`), then update
   *Where things stand* in `README.md` — live commit, open work, anything that shipped broken.
   Part of merging, not an optional tidy afterwards.

## Layout
```
index.html   page shell: top bar, three view sections, inline slot picker, docked nav,
             two <dialog> panels. The nav sits at body level, not in .topbar — a
             backdrop-filter ancestor would become its containing block
style.css    all styling
app.js       recipe catalogue, state, rendering, one event handler
README.md    documentation
Screenshots/ deleted — no shot of the current build exists. Recreate it with descriptive
             filenames, not camera defaults
```
Add files only when one gets unwieldy.

## Conventions
Established in v1 and extended since — follow them or say why not:

- **State:** one `state` object for everything about the user. `RECIPES` is fixed and never stored.
- **Recipe tags:** every recipe carries exactly one macro tag — `high-protein` or `balanced` — and
  Indian ones carry `indian`. The catalogue is meant to stay over half Indian and over two thirds
  high-protein, so adding recipes means checking those ratios still hold.
- **Two ways to add a meal, never merged:** from an *empty* week slot, the inline picker under the
  week — day and meal already known, so never ask again; from a recipe card, the `#picker` dialog.
  One component draws both: `cardHtml(recipe, slot)` renders every list of recipes, and the slot
  argument is what swaps its primary button between the two routes. Don't fork it for a new list.
- **Plan shape:** flat, keyed by real date and meal — `state.plan['2026-08-26|Dinner'] = recipeId`.
  Keyed by date, not weekday, so each week is genuinely its own plan.
- **Storage:** one JSON blob under one key, `p5:mealplanner`. Every read *and* write wrapped in
  try/catch — quota errors and private mode are real. Validate on load and drop anything
  unrecognised; never trust what's in storage. The plan, the bookmarks and the
  theme are saved; view, week, search, filters, `focusDay` and `expandAll` are per-session on
  purpose. Theme is the one deliberate exception: a theme the user picked and lost on reload is
  a bug, not a fresh start. `index.html` reads it inline in `<head>` to paint before first
  paint, so the key is written in two places — change one, change the other.
- **One box per level:** a card gets the border; the rows inside it get a hairline and a
  label, not borders of their own. Nested boxes were the main thing wrong with v1's week.
  This applies inside the day cards — lists of recipes use the recipe card instead.
- **The page is the white; the tiles carry the colour.** `--bg` is plain white, `--surface` is
  the warm tint every card and panel takes, `--surface-sunk` is one step deeper for trays and
  tags, `--surface-past` is nearly the page again for days gone by. A tray holding cards must sit
  a step deeper than the cards, or their edges vanish. Check a colour pair's contrast with a
  script rather than eyeballing it — several of these sit within 0.1 of the 4.5 floor.
- **`--accent` fills, `--accent-ink` writes.** The accent is legible as a background but lands at
  4.47 as text on a tinted tile, so every accent-coloured *word* uses `--accent-ink`, one step
  deeper. Borders, dots, chips and button fills use `--accent`. Getting this backwards is how the
  contrast floor gets broken quietly.
- **Subject gets the weight:** in the add-to-week dialog the recipe carries the large type and
  "Add to week" is a small uppercase eyebrow above it. The views themselves have no eyebrows —
  they were removed when the week heading became one rotating line.
- **Dialog `display` hangs off `[open]`.** A bare `display` on `.sheet` beats the user agent's
  `dialog:not([open]) { display: none }`, because the UA origin loses to the author origin, and
  both sheets render in the page at all times. This has already happened once.
- **Filter chips:** grouped by `TAG_GROUPS` in `app.js`. A tag missing from that list still
  renders, under *More* — so adding a recipe tag can never make a chip disappear.
- **Wide week is an accordion:** one day open, the other six collapsed to vertical rails that
  expand on click (`state.focusDay`). `expandAll` gives all seven equal columns. In expand-all a
  day header stops being a button rather than becoming one that does nothing. `--week-cols` is
  set on the grid as a custom property, not as inline `grid-template-columns`, so the narrow
  media query can still override it — and **every track must be the same type** (`minmax(0, Nfr)`
  throughout), or `grid-template-columns` will not interpolate and the widths snap instead of
  animating. Under expand-all the day cards share the grid's row tracks via `subgrid` so meal rows
  line up across all seven; don't put anything in a day header that can wrap.
- **Narrow week:** under 1000px the week is a strip of seven day buttons, wrapped 4 + 3 and
  centred, plus the one day it selects. Same day card as the wide layout — CSS hides the six
  that aren't focused. Don't build a second set of week markup for mobile.
- **Breakpoints:** two, 1000px and 620px, plus a `pointer: coarse` block. Both are `max-width`,
  so they must stay in descending order — a wider query placed after a narrower one silently
  overrides it. Extend the existing block rather than opening a second one at the same width.
- **Rendering:** change state, then redraw the whole view from it. No diffing, no partial updates.
  Views are built as HTML strings, so run any text through `escapeHtml` before it reaches
  `innerHTML`. No inline `onclick` — one delegated listener in `app.js` dispatches on
  `data-action`, which is why a redraw never needs listeners re-attached.
- **CSS:** colours and spacing via the custom properties at the top of `style.css` — don't
  hardcode new hex values. One accent colour.

## Accessibility
Every defect this project has shipped has been one of these, so it gets its own section:

- Semantic HTML, labels on inputs, native `<dialog>` for modals.
- **Keyboard must work without a mouse.** Redrawing a view destroys whatever was focused — if the
  control the user just activated lives inside what gets re-rendered, put focus back afterwards.
  `closeSlotPicker()` is the worked example; the day strip is where it was forgotten.
- **Never leave a card unnamed, and never hide a focusable control from sight.** The narrow week
  drops the day header entirely and puts the name on the `<article>` as an `aria-label` — `.sr-only`
  would have kept a button in the tab order that nobody can see.
- **Touch targets at least 44px**, width as well as height, measured at 360px rather than at
  whatever your own window happens to be. Controls are compact on a fine pointer and the
  `pointer: coarse` block lifts them back — so a rule that outranks that block on specificity
  silently breaks the floor, which has already happened to the dialog's icon buttons.

## Known defects

None open — PR #4 fixed all three that shipped with PR #3. But **what is unverified is a longer
list than what is broken**: the whole redesign shipped without anyone opening a browser. See
*Where things stand* in `README.md` for the seven small things left knowingly, and for what has
never been looked at.

## Scope
Not in v1, deliberately: month calendar, shopping list, user-added recipes, drag-and-drop,
sharing/syncing. Don't add these unless asked. See *Not in v1* in `README.md`.

## Testing
Open `index.html` in a browser — for anything visual that *is* the test, and it is the step that
keeps getting skipped. No test framework unless asked.
**Nothing in the current design has been seen, and there are no screenshots at all.** The two
pre-redesign shots were deleted rather than left captioned as stale — this project has now had
three rounds of stale screenshots committed and removed, and a screenshot of the wrong version is
worse than none. Taking a fresh set is the top job. Hard-refresh before shooting.

For logic changes, a throwaway Node script against a stub DOM is the cheap check: stub the few
DOM pieces `app.js` touches on load, import it, drive `state` and the delegated click handler
directly, and assert on the HTML strings that come back. Keep it outside the repo unless we
decide otherwise — see the open question about committing a `check.mjs` in `README.md`.

That script cannot tell you how anything looks. Width-dependent behaviour, contrast, touch target
sizes and focus order need a real browser at a real width — three of the six bugs in the last
review were exactly that kind. See *Testing* in `README.md` for what has been verified and what
never has.
