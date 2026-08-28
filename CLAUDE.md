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
6. Watch the Pages build to `built` (command in *Deployment* in `README.md`).
7. Update *Where things stand* in `README.md` — new live commit, open work, anything that
   shipped broken. This step is part of merging, not an optional tidy afterwards.

## Layout
```
index.html   page shell: nav, three view sections, inline slot picker, two <dialog> panels
style.css    all styling
app.js       recipe catalogue, state, rendering, one event handler
README.md    documentation
Screenshots/ shots embedded in the README — descriptive filenames, not camera defaults
```
Add files only when one gets unwieldy.

## Conventions
Established in v1 and extended since — follow them or say why not:

- **State:** one `state` object for everything about the user. `RECIPES` is fixed and never stored.
- **Recipe tags:** every recipe carries exactly one macro tag — `high-protein` or `balanced` — and
  Indian ones carry `indian`. The catalogue is meant to stay over half Indian and over two thirds
  high-protein, so adding recipes means checking those ratios still hold.
- **Two ways to add a meal:** from an *empty* week slot, the inline picker under the week (day and
  meal already known — never ask again); from a recipe card, the `#picker` dialog. Don't merge them.
- **One recipe card:** `cardHtml(recipe, slot)` draws every list of recipes — Recipes, Saved and
  the week's slot picker. Pass a slot and its primary button fills that slot; leave it out and the
  button opens the day-and-meal dialog. Don't fork it for a new list.
- **Plan shape:** flat, keyed by real date and meal — `state.plan['2026-08-26|Dinner'] = recipeId`.
  Keyed by date, not weekday, so each week is genuinely its own plan.
- **Storage:** one JSON blob under one key, `p5:mealplanner`. Every read *and* write wrapped in
  try/catch — quota errors and private mode are real. Validate on load and drop anything
  unrecognised; never trust what's in storage. Only the plan and the bookmarks are saved; view,
  week, search, filters and `focusDay` are all per-session on purpose.
- **One box per level:** a card gets the border; the rows inside it get a hairline and a
  label, not borders of their own. Nested boxes were the main thing wrong with v1's week.
  This applies inside the day cards — lists of recipes use the recipe card instead.
- **A panel holding white cards is sunk:** `--surface-sunk`, never `--surface`. White on white
  leaves the cards with no edge at all. Check a colour pair's contrast rather than eyeballing it.
- **Subject gets the weight:** in a panel, the thing being acted on (the recipe) carries the
  large type; the action (`Add to week`) is a small uppercase eyebrow above it.
- **Filter chips:** grouped by `TAG_GROUPS` in `app.js`. A tag missing from that list still
  renders, under *More* — so adding a recipe tag can never make a chip disappear.
- **Week alignment:** the seven day cards share the week grid's row tracks via CSS `subgrid`,
  so meal rows line up across days. Don't reintroduce anything in a day header that can wrap.
- **Narrow week:** under 1000px the week is a strip of seven day buttons plus the one day
  it selects (`state.focusDay`, never persisted). Same day card as the wide layout — CSS
  hides the six that aren't focused. Don't build a second set of week markup for mobile.
- **Breakpoints:** two, 1000px and 620px, plus a `pointer: coarse` block. Both are `max-width`,
  so they must stay in descending order — a wider query placed after a narrower one silently
  overrides it. Extend the existing block rather than opening a second one at the same width.
- **Rendering:** change state, then redraw the whole view from it. No diffing, no partial updates.
- **Events:** no inline `onclick`. One delegated listener in `app.js` dispatching on `data-action`.
- **Escaping:** views are built as HTML strings, so run any text through `escapeHtml` before it
  goes into `innerHTML`.
- **CSS:** colours and spacing via the custom properties at the top of `style.css` — don't
  hardcode new hex values. One accent colour.

## Accessibility
Every defect this project has shipped has been one of these, so it gets its own section:

- Semantic HTML, labels on inputs, native `<dialog>` for modals.
- **Keyboard must work without a mouse.** Redrawing a view destroys whatever was focused — if the
  control the user just activated lives inside what gets re-rendered, put focus back afterwards.
  `closeSlotPicker()` is the worked example; the day strip is where it was forgotten.
- **Don't hide a heading with `display: none`.** Hiding a day card's `<h2>` leaves the card with
  no accessible name. Use the `.sr-only` pattern already in the codebase to hide it visually.
- **Touch targets at least 44px**, width as well as height. The week's meal rows are the one
  sanctioned exception — 38px on a fine pointer, back to 44px under `@media (pointer: coarse)`.
  Anything else under 44px is a bug, including something that only falls below it at narrow widths.
- Check a computed size at 360px, not just at whatever your own window happens to be.

## Known defects
Live on `main`, merged knowingly. Fix these before building anything on top of them:

1. Switching day loses keyboard focus — `week-day` re-renders the strip out from under it.
2. `.day-head { display: none }` under 1000px hides the `<h2>`; the day card has no name.
3. Day chips are ~43px wide at a 360px viewport, under the 44px floor.

Full write-ups in *Where things stand* in `README.md`.

## Scope
Not in v1, deliberately: month calendar, shopping list, user-added recipes, drag-and-drop,
sharing/syncing. Don't add these unless asked. See *Not in v1* in `README.md`.

## Testing
Open `index.html` in a browser. For anything visual that *is* the test, and it is the step that
keeps getting skipped — the narrow week shipped without it. No test framework unless asked.
The wide week and the day strip have now been seen (`Screenshots/`); everything else has not.
Hard-refresh before shooting — two screenshots of an older build got committed and had to be
deleted, and a screenshot of the wrong version is worse than none.

For logic changes, a throwaway Node script against a stub DOM is the cheap check: stub the few
DOM pieces `app.js` touches on load, import it, drive `state` and the delegated click handler
directly, and assert on the HTML strings that come back. Keep it outside the repo unless we
decide otherwise — see the open question about committing a `check.mjs` in `README.md`.

That script cannot tell you how anything looks. Width-dependent behaviour, contrast, touch
target sizes and focus order all need a real browser at a real width. Say plainly in the PR
description when they haven't been checked, rather than implying a layout claim was verified.

See *Testing* in `README.md` for what has been verified so far, and what never has.
