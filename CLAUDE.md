# CLAUDE.md

## Project
Mise — a weekly meal planner web app. Goal: intuitive, modern, useful, simple.

See `README.md` for what v1 does, the data model, and the decisions already taken.
Read it before proposing changes — several things are missing on purpose, not by oversight.

## Working with me
- Ask when something is unclear or a decision is uncertain. Don't guess silently.
- State the decisions you did make and why, in one or two lines each.
- Explain things simply — I'm a non-tech vibe coder, not a developer.

## Hard constraints
- Vanilla HTML, CSS, JavaScript only. No frameworks, no libraries, no build step.
- All data persists in the browser (`localStorage`). No server, no database, no API calls.
- Hosted on GitHub Pages: everything must work from static files opened over plain HTTP.
  - Relative paths only (no leading `/`).
  - Entry point is `index.html` at the repo root.
  - ES modules are fine (`<script type="module">`), but they need a local server to test —
    `python -m http.server` from the repo root.

## Layout
```
index.html   page shell: nav, three view sections, inline slot picker, two <dialog> panels
style.css    all styling
app.js       recipe catalogue, state, rendering, one event handler
README.md    documentation
```
Add files only when one gets unwieldy.

## Conventions
Established in v1 — follow them or say why not:

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
  unrecognised; never trust what's in storage.
- **One box per level:** a card gets the border; the rows inside it get a hairline and a
  label, not borders of their own. Nested boxes were the main thing wrong with v1's week.
  This applies inside the day cards — lists of recipes use the recipe card instead.
- **Subject gets the weight:** in a panel, the thing being acted on (the recipe) carries the
  large type; the action (`Add to week`) is a small uppercase eyebrow above it.
- **Filter chips:** grouped by `TAG_GROUPS` in `app.js`. A tag missing from that list still
  renders, under *More* — so adding a recipe tag can never make a chip disappear.
- **Week alignment:** the seven day cards share the week grid's row tracks via CSS `subgrid`,
  so meal rows line up across days. Don't reintroduce anything in a day header that can wrap.
- **Rendering:** change state, then redraw the whole view from it. No diffing, no partial updates.
- **Events:** no inline `onclick`. One delegated listener in `app.js` dispatching on `data-action`.
- **Escaping:** views are built as HTML strings, so run any text through `escapeHtml` before it
  goes into `innerHTML`.
- **Markup:** semantic HTML, labels on inputs, native `<dialog>` for modals. Keyboard must work
  without a mouse. Touch targets at least 44px.
- **CSS:** colours and spacing via the custom properties at the top of `style.css` — don't
  hardcode new hex values. One accent colour.

## Scope
Not in v1, deliberately: month calendar, shopping list, user-added recipes, drag-and-drop,
sharing/syncing. Don't add these unless asked. See *Not in v1* in `README.md`.

## Testing
Open `index.html` in a browser. No test framework unless asked.
For logic changes, a throwaway Node script against a stub DOM is the cheap check — see *Testing*
in `README.md` for what was verified in v1.
