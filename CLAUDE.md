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
index.html   page shell: nav, three view sections, two <dialog> panels
style.css    all styling
app.js       recipe catalogue, state, rendering, one event handler
README.md    documentation
```
Add files only when one gets unwieldy.

## Conventions
Established in v1 — follow them or say why not:

- **State:** one `state` object for everything about the user. `RECIPES` is fixed and never stored.
- **Plan shape:** flat, keyed by real date and meal — `state.plan['2026-08-26|Dinner'] = recipeId`.
  Keyed by date, not weekday, so each week is genuinely its own plan.
- **Storage:** one JSON blob under one key, `p5:mealplanner`. Every read *and* write wrapped in
  try/catch — quota errors and private mode are real. Validate on load and drop anything
  unrecognised; never trust what's in storage.
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
