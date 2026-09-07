# CLAUDE.md

Rules for working in this repo. **Every rule here has a full story behind it in
`docs/decisions.md`** — if one looks arbitrary, read it there before working around it.

## Project
Mise — a weekly meal planner web app. Goal: intuitive, modern, useful, simple.

**Starting a session:** read `docs/status.md` first — live commit, open work, what isn't verified.
`docs/architecture.md` has the data model and layout; `docs/decisions.md` what is left out.

## Working with me
- Ask when something is unclear or a decision is uncertain. Don't guess silently.
- State the decisions you did make and why, in one or two lines each.
- Explain things simply — I'm a non-tech vibe coder, not a developer.
- **"Update the docs"** (however I phrase it) means sweep *every* markdown file against the
  current state — this file, `README.md`, and everything in `docs/`.
- **Keep this file rules-only, and at 200 lines or fewer.** It hit 229 by keeping *reasoning* beside
  the rules; the test is "rule or reasoning", and the line count is what catches you failing it.

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
4. Review it against its own description, re-reading the diff if commits landed after — a branch
   can grow into a different change than the one reviewed.
5. Squash-merge, delete the branch.
6. Watch the Pages build to `built` (command in `docs/architecture.md`), then update
   `docs/status.md`. Part of merging, not an optional tidy afterwards.

## Conventions
Follow them or say why not. Full reasoning for each: `docs/decisions.md`.

- **State:** one `state` object for everything about the user. `RECIPES` is fixed, never stored.
- **Recipe tags:** exactly one macro tag per recipe — `high-protein` or `balanced` — and `indian`
  on the Indian ones. Keep the catalogue over half Indian and over two thirds high-protein, so
  adding recipes means re-checking both ratios.
- **Plan shape:** flat, keyed by real date and meal — `state.plan['2026-08-26|Dinner'] = id`.
- **Storage:** one JSON blob under one key, `p5:mealplanner`. try/catch every read *and* write;
  validate on load, dropping anything unrecognised. `loadState()` **replaces** plan and bookmarks,
  past every early return; a `storage` listener re-reads so two tabs can't overwrite each other.
  The key lives in `app.js` **and** inline in `index.html` — change one, change the other.
- **Two ways to add a meal, never merged:** from an *empty* week slot the inline picker (day and
  meal already known, so never ask again); from a recipe card the `#picker` dialog. One component
  draws both — `cardHtml(recipe, slot)`, the slot argument swapping the primary button.
- **The picker takes the day's place, and fits on the screen.** Opening it hides `.day-title` and
  `.meals` and draws in their spot; one way out, a **back link**, not a close ×. The week bar,
  sidebar and summary column never move. `sizeSlotPicker()` **measures** its height rather than
  naming a `vh`, and `.pick-grid` scrolls inside it so the page never does.
- **One day at a time, at every width.** Week bar, seven day buttons, then that day as three meal
  cards (`state.focusDay`). **Never a second week markup** — `docs/decisions.md` lists what went.
- **The shell flips at 1000px, the week does not.** Over 1000px `body` is a two-column grid: nav
  becomes a left sidebar, the brand moves into it — its **only** copy, the app is nameless under
  1000px — the top bar keeps the theme button, the week gains its summary column. **One set of nav
  markup either way**: two lists drift, two `<nav>`s are two landmarks.
- **Under 620px the list gets two thirds of the screen**, measured. Paid for by: no brand, the top
  bar carrying the way back, one tools row with the dropdowns **shut**, four gaps a token lower, and
  the *tile* foot's add button compressed too. `NARROW_MQ` decides the JS half, **live**.
- **The summary column is derived, so it may be dropped.** Anything that can only be read there
  doesn't belong there.
- **One box per level:** the card gets the border, nothing inside it gets a second one — no filled
  tile around the recipe, no bordered icon button. The recipe *name* shows a meal card is clickable:
  `--accent-ink`, **underlined at rest** (the accent at 45%), full strength on hover, never
  hover-only.
- **The week bar is navigation, so it stays compact — and it has no tile.** No fill, no border, no
  radius; capped at 520px and centred. If a change makes the bar taller, it needs a reason better
  than fitting.
- **A planned day is an accent *ring*, never a fill.** One shape, three states: bare circle, ringed
  when planned, filled when selected. Chip hover is `--hover`. **Never on a day gone by.**
- **`--bg` is the page and nothing else.** Nothing inside a card may be filled with it: a control
  rests on `--control`, a tag pill on `--accent-soft`.
- **A fill must differ from what the control sits on**, not from the page behind it. A hover set to
  the shade the control already has is a no-op, and no contrast script can see one.
- **One shape for one idea.** Saving a recipe is a **bookmark**, not a star — the same path as the
  sidebar's *Saved* icon (`BOOKMARK_PATH` in `app.js`, inline in `index.html` too; change both).
- **The page carries the warmth; the cards are the light.** `--bg` warm off-white, `--surface`
  white for cards, `--control` a control's rest fill *up* towards white, `--surface-sunk` a
  recessed *track* going down, `--surface-past` back *towards* the page, never past it.
- **Measure contrast both directions with a script**, tokens read out of `style.css`: text needs
  4.5 on its ground, two touching surfaces about 1.10. Where a pair must sit closer a hairline
  carries the edge — and then it's the **line** you measure, against both sides.
- **A light palette is not a dark one inverted.** Raised surfaces move towards white and hairlines
  go darker than the page in *both* themes, but hover and selected go **up** in dark and **down** in
  light. Read `docs/dark-mode-reference.md` and `docs/light-mode-reference.md` before moving a
  surface token or inventing a state colour — **as evidence, not as a spec**.
- **`--hover` is the state fill, on either ground** — page or card — **down** in light, **up** in
  dark. Not `--control`: that is where a control *rests*, near white in light, so a hover sent
  there is a no-op. A control that already has a fill hovers by moving its **border** instead.
- **`--accent` fills, `--accent-ink` writes.** Every accent-coloured *word* uses `--accent-ink`;
  borders, dots, chips and fills use `--accent`. Backwards breaks the floor quietly.
- **Anything keyed to the *theme* reads the theme, not the OS** — it is a stored choice. Set it
  from the live `--bg`, in the `<head>` script too or it flashes.
- **A past day is quieter by colour, never by opacity, and it carries no ring.** Name *and* date
  at `--ink-faint`, so the whole chip recedes rather than half of it.
- **Subject gets the weight:** the recipe takes the large type in the add dialog, "Add to week" a
  small eyebrow over it. Views get no eyebrow — a heading, at most one subtitle, centred on the
  content. The week has no head, and its **two** grid items are placed in **row 1** by hand:
  auto-flowed into row 2 they are charged a `--space-4` gap above.
- **The week view has no visible heading.** The greeting is parked whole in a comment in
  `index.html`, restore notes beside it; the day title is `.sr-only`. Neither returns unasked.
- **One tools row, three lists.** Search, the tile/list toggle and the filter dropdowns are one
  component — `toolsHtml(name)` into `#tools-recipes`, `#tools-saved`, `#tools-slot`. Drawn once at
  startup and **never redrawn**; `syncTools(name)` writes boxes, badges and the pressed layout
  button in place. **Search text and ticked tags are per list** (`surface.recipes` / `.saved` /
  `.slot`), never shared; the layout is one `state.cardView` for all three, persisted.
- **The slot picker opens filtered to its meal** — a ticked box in the *Meal* group with the filter
  row open, not a hidden rule; reset on every open. Under 620px the row starts shut and the badge
  carries it.
- **Filters mean OR *within* a group, AND *across* groups.** Groups are `FILTER_GROUPS`:
  `TAG_GROUPS` in order, minus tags no recipe carries, plus *More* for anything it forgot — so a
  new recipe tag can never become unfilterable. The matcher needs the *grouping*, not just the tags.
- **Filter groups are dropdowns of checkboxes on one row.** Native `<details name>`; closing on an
  outside click and on Escape are wired by hand, and Escape takes the menu before the picker. The
  row **wraps** on a phone — a scroll container clips an absolutely positioned menu.
- **A card is a card in both layouts, and neither has a divider *inside* it.** `.is-list` turns the
  same `cardHtml` on its side — name left, minutes and tags collected on the right beside a foot
  whose add button is its **glyph alone** at every width; no second component. **Three tags at
  most, never `quick`** (`cardTags()`), and the minutes are **bare text, not a pill**.
- **Rendering:** change state, redraw the whole view — no diffing. Views are HTML strings, so run
  any text through `escapeHtml` before `innerHTML`. No inline `onclick`: one delegated listener
  dispatches on `data-action`.
- **Vertical gaps come from four tokens** — `--space-1/2/3/4` (8/16/24/40): inside a group, between
  siblings, between blocks, between sections. A new vertical gap picks a step; it does not invent a
  number. **A view heading is a section break, not a block break.** **Padding inside a component
  stays put**, and horizontal flex gaps are off the scale too. Two exceptions, both in
  `docs/decisions.md`. Nothing in `check.mjs` sees any of this.
- **CSS:** colours and spacing from the custom properties at the top of `style.css`; don't
  hardcode hex. One accent colour. **Style by class, never by id.**

### Seven CSS rules that each cost a bug — mechanism only, stories in `docs/decisions.md`

- **`grid-auto-rows: auto` is content-sized only while the grid's own height is indefinite.** Give
  a grid a definite height — `flex: 1` inside a `max-height` panel does exactly that — and the
  height is divided among the rows instead. `.pick-grid` needs its `min-content`.
- **Media queries add no specificity**, so a base rule *below* one beats it. All of them live at
  the end of `style.css`, and an id selector outranks the lot — hence the rule above.
- **`.page` needs its explicit `width: 100%`.** Over 1000px it's a grid item, and one with auto
  inline margins shrink-to-fits instead of stretching. Don't remove it.
- **Breakpoints:** 1000/620/359px `max-width` in **descending order**, one `min-width: 1001px`,
  plus `pointer: coarse` and `prefers-reduced-motion`. Extend a block, never open a second at the
  same width, and put a new one where the arithmetic bites rather than where it feels right.
- **An outline is clipped by an ancestor's `overflow`, and takes its *own* element's
  `border-radius`.** `.card-open` needs both a negative `outline-offset` and the card's top radius,
  or its focus ring is cut to a stray line. Nothing that reads a page at rest can see this.
- **Chrome matches `:focus-visible` on a text field however it was focused**, so the shared 3px ring
  showed on a mouse click. A text field's focus is its **border** — accent, doubled by an inset
  shadow, with `outline: none` on that one control.
- **Dialog `display` hangs off `[open]`.** A bare `display` on `.sheet` beats the UA rule, and both
  sheets then render in the page always.

## Accessibility
**Every defect here has been an accessibility defect.** Details: `docs/decisions.md#accessibility-and-focus`.

- Semantic HTML, labels on inputs, native `<dialog>` for modals.
- **A redraw destroys focus.** If the control just activated lives inside what gets re-rendered,
  put focus on what *replaced* it — eight places do. **A conditionally-rendered control is the one
  that gets missed**; all three focus bugs here were one.
- **Focus something visible.** `.focus()` on a hidden element does nothing and drops you to
  `<body>`, so a lookup for "what replaced it" must be scoped to what is on screen: open dialog,
  then open picker, then the view.
- **Never open a panel with focus in a search field** — reading the list is as likely as typing,
  and on a phone the keyboard covers it. Focus the panel (`tabindex="-1"`).
- **A landmark's name must not change between loads**, so never point `aria-labelledby` at
  something that rotates — the week greeting did. A fixed `aria-label` on the section instead.
- **Never leave a card unnamed, and never hide a focusable control with nothing in its place.** A
  heading that must vanish goes `.sr-only`, never `display: none`, and only if nothing in it takes
  focus (`.day-title`). A *control* may go `display: none` only where a visible copy does the same
  job — the picker's back link under 620px, the top bar carrying it. Never both at once. A *label
  inside* a control may go, where `aria-label` carries the same words — the narrow add button's.
- **Tab through anything you change.** The focus ring is the one control state neither the script
  nor a screenshot can see, and it has hidden a defect here for months.
- **Touch targets at least 44px**, width as well as height, measured at 360px. Controls are compact
  on a fine pointer and `pointer: coarse` lifts them back, so a later rule outranking that block
  silently breaks the floor. Name anything there that sets its own size.

## Scope
Not in v1, deliberately: month calendar, shopping list, user-added recipes, drag-and-drop,
sharing/syncing, recipe photography. Don't add these unless asked; reasoning in
`docs/decisions.md#deliberately-not-built`. Photography is the trap — fetching one breaks "no API calls".

## Testing
No test framework unless asked. **`node check.mjs`** is the one saved check — contrast both ways,
action and id wiring, the three values written twice. Run it after touching `style.css` tokens, and
**add the new pairs** when a colour token appears. Gaps: `docs/architecture.md#how-this-gets-tested`

**Read, look and measure — each catches what the other two miss.** A rendered look is the check for
anything touching layout, never an optional extra. **I check the app in a browser as we iterate**,
so never write that it has never been looked at. Name what a change has *not* been seen against.

**Screenshots:** none in the repo; `*.png`/`*.jpg` gitignored (`!Light mode Mockups/*.png` excepted,
and that exception must name a folder that exists). Stale ones get deleted, not captioned.
