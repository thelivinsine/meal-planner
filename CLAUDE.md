# CLAUDE.md

Rules for working in this repo. **Every rule here has a full story behind it in
`docs/decisions.md`** — if one looks arbitrary, read it there before working around it.

## Project
Mise — a weekly meal planner web app. Goal: intuitive, modern, useful, simple.

**Starting a session:** read `docs/status.md` first — live commit, open work, what isn't verified.
`docs/architecture.md` has the data model and layout. Several things are missing on purpose, so
read `docs/decisions.md` before proposing changes.

## Working with me
- Ask when something is unclear or a decision is uncertain. Don't guess silently.
- State the decisions you did make and why, in one or two lines each.
- Explain things simply — I'm a non-tech vibe coder, not a developer.
- **"Update the docs"** (however I phrase it) means sweep *every* markdown file against the
  current state — this file, `README.md`, and everything in `docs/`.
- **Keep this file rules-only** — about 135 lines as it stands. The test is not the line count,
  it's "is this a rule or is it reasoning": reasoning goes in `docs/decisions.md`, which has no
  budget. If a rule needs a paragraph to be safe, put the paragraph there and the rule here. A
  line count is what this file kept failing when it was carrying both.

## Hard constraints
- **Never commit code to `main` directly.** Any change to `index.html`, `style.css` or `app.js`
  goes on its own branch and comes back through a PR. Markdown may go straight to `main`.
- Vanilla HTML, CSS, JavaScript only. No frameworks, no libraries, no build step.
- All data persists in the browser (`localStorage`). No server, no database, no API calls.
- Hosted on GitHub Pages: static files over plain HTTP. Relative paths only (no leading `/`),
  entry point `index.html` at the repo root.

## Workflow
1. Branch off `main`, named for the change not the round (`mobile-week`, `sidebar-day-view`).
2. Build it, then check it — see *Testing*. A visual change means a browser, mine or yours.
3. Open a PR saying what changed and what was **not** verified. Be honest in the second half;
   it's the part that gets read before merging.
4. Review it against its own description, re-reading the diff if commits landed after the
   review — a branch can grow into a different change than the one reviewed.
5. Squash-merge, delete the branch.
6. Watch the Pages build to `built` (command in `docs/architecture.md`), then update
   `docs/status.md`. Part of merging, not an optional tidy afterwards.

## Conventions
Follow them or say why not. Full reasoning for each: `docs/decisions.md`.

- **State:** one `state` object for everything about the user. `RECIPES` is fixed, never stored.
- **Recipe tags:** every recipe carries exactly one macro tag — `high-protein` or `balanced` — and
  Indian ones carry `indian`. Keep the catalogue over half Indian and over two thirds
  high-protein, so adding recipes means re-checking both ratios.
- **Plan shape:** flat, keyed by real date and meal — `state.plan['2026-08-26|Dinner'] = id`.
- **Storage:** one JSON blob under one key, `p5:mealplanner`. try/catch every read *and* write;
  validate on load, dropping anything unrecognised. The key lives in `app.js` **and** inline in
  `index.html` — change one, change the other.
- **Two ways to add a meal, never merged:** from an *empty* week slot the inline picker (day and
  meal already known, so never ask again); from a recipe card the `#picker` dialog. One component
  draws both — `cardHtml(recipe, slot)`, the slot argument swapping the primary button.
- **One day at a time, at every width.** Week bar, seven day buttons, then that day as three meal
  cards (`state.focusDay`). **Never bring back a second week markup** — accordion, rails,
  `expandAll`, `--week-cols` and `subgrid` sharing all went when the mockups settled on one day.
- **The shell flips at 1000px, the week does not.** Over 1000px `body` is a two-column grid: nav
  becomes a left sidebar, top bar keeps only the theme button, week gains its summary column. **One
  set of nav markup either way** — two lists drift, two `<nav>`s are two landmarks.
- **The summary column is derived, so it may be dropped.** Anything that can only be read there
  doesn't belong there.
- **One box per level:** the card gets the border, and nothing inside it gets a second one — no
  filled tile around the recipe, no bordered icon button. A meal card holds a label, a name and
  a meta line, and the *name* is what shows it is clickable: `--accent-ink`, underlined on hover.
- **The week bar is navigation, so it stays compact.** The meal cards are the content and get the
  room. If a change makes the bar taller, it needs a reason better than fitting.
- **The page carries the warmth; the cards are the light.** `--bg` warm off-white, `--surface`
  near-white for cards, `--surface-sunk` deeper for trays and tiles, `--surface-past` back
  *towards* the page — towards it, never past it.
- **Measure contrast both directions with a script**, tokens read out of `style.css`: text needs
  4.5 on its ground, two touching surfaces about 1.10. Where a pair must sit closer a hairline
  carries the edge — and then it's the **line** you measure, against both sides.
- **`--accent` fills, `--accent-ink` writes.** Every accent-coloured *word* uses `--accent-ink`;
  borders, dots, chips and fills use `--accent`. Backwards breaks the floor quietly.
- **Anything keyed to the *theme* reads the theme, not the OS.** It's a stored choice, so
  `prefers-color-scheme` is the wrong signal. Set it from the live `--bg`, in the `<head>` script
  too or it flashes.
- **A past day is quieter by colour, never by opacity.** Opacity blends text back towards its tile
  and undoes the tokens.
- **Subject gets the weight:** the recipe takes the large type in the add dialog, "Add to week" a
  small eyebrow over it. Views get no eyebrow — a heading and at most one subtitle, centred over
  the content it introduces. On the week view that means the *content column*, not the two-column
  span, so all three grid items are placed by hand.
- **The Week heading is one line and it changes.** `WEEK_GREETINGS` in `app.js`, picked once per
  load, no subtitle under it. Never replace it with a fixed label — a greeting is the point, and
  the week bar below already says which week this is.
- **Filter chips** are grouped by `TAG_GROUPS` in `app.js`. A tag missing from that list still
  renders under *More*, so adding a recipe tag can never make a chip disappear.
- **Rendering:** change state, redraw the whole view — no diffing. Views are HTML strings, so run
  any text through `escapeHtml` before `innerHTML`. No inline `onclick`: one delegated listener
  dispatches on `data-action`.
- **CSS:** colours and spacing from the custom properties at the top of `style.css`; don't
  hardcode hex. One accent colour. **Style by class, never by id.**

### Four CSS rules that each cost a bug
Mechanism only — the stories are in `docs/decisions.md`.

- **Media queries add no specificity**, so a base rule *below* one beats it. All of them live at
  the end of `style.css`, and an id selector outranks the lot — hence the rule above.
- **`.page` needs its explicit `width: 100%`.** Over 1000px it's a grid item, and one with auto
  inline margins shrink-to-fits instead of stretching. Don't remove it.
- **Breakpoints:** 1000/620/400px `max-width` in **descending order**, one `min-width: 1001px`,
  plus `pointer: coarse` and `prefers-reduced-motion`. Extend a block, never open a second at the
  same width, and put a new one where the arithmetic bites rather than where it feels right.
- **Dialog `display` hangs off `[open]`.** A bare `display` on `.sheet` beats the UA rule, and both
  sheets then render in the page always.

## Accessibility
**Every defect this project has shipped has been an accessibility defect**, so it gets its own
section. Details: `docs/decisions.md#accessibility-and-focus`.

- Semantic HTML, labels on inputs, native `<dialog>` for modals.
- **A redraw destroys focus.** If the control just activated lives inside what gets re-rendered,
  put focus on what *replaced* it — five places do. **A conditionally-rendered control is the one
  that gets missed**; both focus bugs here were one.
- **Never leave a card unnamed, never hide a focusable control.** If a heading must vanish on
  screen, `.sr-only` — never `display: none` — and only on something not focusable.
- **Touch targets at least 44px**, width as well as height, measured at 360px. Controls are compact
  on a fine pointer and `pointer: coarse` lifts them back, so a later rule outranking that block
  silently breaks the floor. Name anything there that sets its own size.

## Scope
Not in v1, deliberately: month calendar, shopping list, user-added recipes, drag-and-drop,
sharing/syncing, recipe photography. Don't add these unless asked;
`docs/decisions.md#deliberately-not-built` has the reasoning. Photography is the trap — the
mockups show one per meal and fetching any would break "no API calls".

## Testing
No test framework unless asked. Approach and the two standing gaps:
`docs/architecture.md#how-this-gets-tested`.

**Read, look and measure — each catches what the other two miss, and this project has been bitten
skipping each in turn** (reading missed a week at a third of its width that one screenshot caught;
a script caught six things no screenshot could). So a rendered look is the check for anything
touching layout, never an optional extra. **I check the app in a browser as we iterate**, so never
write that it has never been looked at. Name what a change has *not* been seen against, and hand
over an unlooked-at layout change rather than calling it done.

**Screenshots:** none in the repo, and `*.png`/`*.jpg` are gitignored so a camera-named file can't
be committed by accident (`Mockups/` excepted; a real set needs its own exception). Stale ones get
deleted, not captioned. Descriptive filenames, hard-refresh first.
