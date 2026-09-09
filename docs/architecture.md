# How the code is organised

*Changes when the shape of the code changes, not otherwise. For **why** any of it is this way,
see [decisions.md](decisions.md).*

## Four files

| File | Contains |
|---|---|
| `index.html` | The page shell: top bar (the theme button, plus the way back under 1000px), three `<section>` views, the week bar, the day's meal cards, the summary column, the inline slot picker that replaces them, the view switch and two `<dialog>` panels. Plus an inline `<script>` in `<head>` that paints the stored theme and sets `theme-color` before first paint |
| `style.css` | All styling. Custom properties first — the palette, the radii, and `--space-1/2/3/4`, the four-step scale every vertical gap *between* components names — then the rules, then **every media query at the end of the file**: three `max-width` breakpoints (1000px, 620px, 359px, descending), one `min-width: 1001px` for the sidebar layout, a `pointer: coarse` block, and `prefers-reduced-motion` |
| `app.js` | The recipe catalogue, the app state, rendering, and one event handler |
| `landing.html` | The landing page, and the only file here that is not the app. **Self-contained bar one thing** — two Google Fonts stylesheets, the repo's only external request. Otherwise: its own inline `<style>` with the palette copied out of `style.css`, its own type sizes, and an inline `<head>` script that reads the same stored theme. It shares no code with the app and the app loads none of it — the only link between them is the sidebar wordmark's `href` and the CTAs pointing back at `index.html` |

`Light mode Mockups/` holds the four supplied design concepts the current layout was built
against — the only images tracked here. Loose captures go to `archive/screenshots/`, gitignored
and untracked — see [status](status.md#screenshots).

The **reference UIs** the palette was measured against are a different thing and are *not* in the
repo: `docs/Dark mode references/` and `docs/Light mode references/` are gitignored shots sitting
on disk beside the write-ups. Both were decoded pixel by pixel and written up as
[dark-mode-reference.md](dark-mode-reference.md) and
[light-mode-reference.md](light-mode-reference.md) — every surface hex, state delta and edge
treatment, with the contrast ratios computed the same way `check.mjs` computes them. Clone the
repo and the pictures are not there; the numbers read out of them are.

Two bits of markup are placed where they are for a reason, and moving either breaks something that
looks unrelated:

- **The view switch sits at body level**, not inside `.topbar`: a `backdrop-filter` ancestor becomes
  the containing block for anything `position: fixed` inside it. That same element is what becomes
  the sidebar over 1000px.
- **The week view's grid items are placed by hand, both of them in row 1.** There used to be a
  third — `.view-head`, holding the rotating greeting, given a row of its own so the summary column
  started level with the week bar rather than level with the heading. The greeting is parked now
  (in a comment where it stood, with restore notes), and the two survivors have to be told they are
  in **row 1**: left in row 2 they keep an empty first row above them and the grid charges its
  `--space-4` row gap for it — 40px of nothing over the week bar. The `.view-head` rule that placed
  the heading in the content column only is written out in the same comment, because restoring the
  greeting means restoring all three placements together.

## The data model

Two things exist:

- **`RECIPES`** — the fixed catalogue, hardcoded. 50 recipes, never saved, never changes at
  runtime. Each carries exactly one macro tag (`high-protein` or `balanced`); 27 are `indian` and
  38 `high-protein`, and both ratios are meant to hold as recipes are added.
- **`state`** — everything about *you*: which view, which week, which day (`focusDay`), your plan,
  your bookmarks, your theme, and the card layout (`cardView`, `'tile'` or `'list'`).
- **`surface`** — the third object, and the newest. Search text, ticked tags and whether the filter
  row is open, **one set per list**: `recipes`, `saved`, `slot`. It is separate from `state`
  because it is three of the same thing rather than one of anything, and per-list because a search
  typed on Recipes has nothing to do with what you want in Saved. The slot picker's set is rewritten
  on every open, with the meal it was opened for already ticked.

The plan is one flat object keyed by real date and meal:

```js
state.plan = { '2026-08-26|Dinner': 'chickpea-curry' }
```

Keying by actual date rather than by "Wednesday" is what makes next week a genuinely separate plan
instead of the same seven slots relabelled. One assignment fills a slot, one `delete` clears it —
no nested structures to walk.

## Storage

One key, `p5:mealplanner`, holding one JSON blob of the plan, the bookmarks, the theme and the
card layout.
`index.html` reads that same key inline in `<head>` to paint the theme before first paint, **so
the key name is written in two places** — change one and you must change the other.

It is not the only value written twice. The others, so they can be found together:

| Duplicated | Where | Why |
|---|---|---|
| `p5:mealplanner` | `STORAGE_KEY` in `app.js`; inline `<head>` script in `index.html` | The theme must paint before `app.js` loads |
| The bookmark icon path | `BOOKMARK_PATH` in `app.js`; the *Saved* nav button in `index.html` | The nav is static markup, the save buttons are rendered. Same shape by rule, not by mechanism |
| The light `--bg` hex | `--bg` in `style.css`; `theme-color` meta in `index.html` | The meta needs a value for an unstyled first paint. Left stale once already |

Reads and writes are wrapped in `try`/`catch`: private browsing and full quotas are real and
neither should take the app down. Loading also *validates* rather than trusting — every entry
needs a real date, a real meal name and a recipe that still exists, or it is dropped. Junk in
storage produces an empty plan, never a crash. Entries older than four weeks are dropped too, so
the blob cannot grow forever.

The plan, bookmarks, theme and card layout persist; view, week, `focusDay` and everything in
`surface` are per-session on purpose. Theme and layout are the deliberate exceptions — a look you
picked and lost on reload is a bug, not a fresh start.

**Two tabs stay in step.** Each tab holds its own `state`, and `saveState()` writes the *whole*
blob, so before PR #15 the tab that saved second replaced whatever the first had added — plan a
meal in one tab, bookmark a recipe in the other, and the meal was gone. A `storage` listener now
re-reads on any write from another tab, so every copy stays current and the next save is built on
the newest data. `loadState()` **replaces** the plan and bookmarks rather than merging into them,
which is what makes a *deletion* in one tab reach the other; the reset sits past every early
return, so a read that failed or a blob that never parsed still leaves a good state alone.

The listener **does** restore focus, and the argument that it did not need to was the bug PR #16
fixed. That argument ran: the event only ever arrives in a tab the user is *not* in, so there is no
live focus to put back. It confuses the user's attention with the DOM — `document.activeElement` is
per-document and survives the tab going to the background, so the redraw dropped it to `<body>` and
you came back to a tab that had forgotten where you were. It now looks the control up by its own
`data-*` attributes, and only when focus actually fell to `<body>`, so a caret half way through a
search is left alone. The tools row is never redrawn either way, so a half-typed search survives
regardless. What is left is a real but narrow
race: two tabs saving inside the few milliseconds before the event lands can still drop one
change. A version counter and a per-field merge would close it, and that is a lot of machinery for
a single-user planner.

## Rendering and events

**Rendering is deliberately dumb:** change state, then redraw the whole view from it. No diffing,
no partial updates. With 50 recipes that is instant, and it removes a whole class of bug where the
screen and the data disagree. Views are built as HTML strings, so any text runs through
`escapeHtml` before it reaches `innerHTML`.

**One thing measures the page rather than describing it.** `sizeSlotPicker()` reads the viewport,
`.page`'s computed bottom padding and the panel's own top, sets a `max-height` in pixels, then
reads `scrollHeight` back to correct whatever sub-pixel rounding left over. It is the only layout
arithmetic in `app.js`, and it exists because the panel has to finish on the screen while what sits
above it — a bar that grows a **Today** button, a tools row whose filter line opens and closes —
has no fixed height. It re-runs on `resize`.

**One component is the exception to "redraw the whole view".** The tools row — search, the
tile/list toggle, the filter dropdowns — is drawn once at startup by `toolsHtml(name)` into three
containers and never redrawn. `syncTools(name)` writes the ticked boxes, the badges, the pressed
layout button, the placeholder (which follows the *width*, since the row is drawn once) and (only
when it disagrees) the search value **in place**. Redrawing it would close
whichever dropdown was open and move the caret to the end of the field on every keystroke, which is
exactly what dumb rendering is fine with everywhere else and not here.

**Events** go through a single click listener on `document`, dispatching on a `data-action`
attribute. No inline `onclick` anywhere. Because of that, redrawing a view never needs listeners
re-attached — but it *does* destroy focus, which is why eight places put it back. See
[decisions.md](decisions.md#accessibility-and-focus).

## How this gets tested

No test framework, per the project constraints. **`check.mjs` at the repo root is not one** — one
file, no dependencies, no config, no runner, never served to a browser. Run it by hand:

```
node check.mjs
```

It reads `style.css`, `app.js` and `index.html` as text and prints a tick or a cross per check,
exiting non-zero if any fail. It replaces the three throwaways this project had written and deleted
five times. What it covers:

- **Contrast, computed in both directions,** with the tokens read out of `style.css` so the script
  cannot drift from what ships. Text on its ground needs 4.5. Two surfaces that touch need about
  1.10 — *unless* a hairline carries the edge, in which case the **line** is measured instead,
  against both sides. That distinction is load-bearing and is now encoded in the pair list as a
  `line:` option; see [decisions.md](decisions.md#colour-and-contrast).
- **Wiring.** Every `data-action` the app emits has a branch in the dispatcher, every branch is
  reachable from some emitted action, and every `getElementById` finds an id that exists in the
  HTML. All typo-shaped failures, all silent, all invisible in a diff.
- **The values written twice** — storage key, bookmark path, `theme-color` fallback — checked
  against each other. The `theme-color` one has already been left stale once.
- **Every token `landing.html` copies**, compared name by name against `style.css` in both themes,
  plus that file's own storage key and `theme-color` fallback. This is the whole reason the
  duplicated palette is allowed to stay duplicated: 12 tokens per theme, and a hex changed in one
  file and not the other fails rather than drifting. Both files are split on their
  `[data-theme="dark"]` selector first, so a light value is never compared against a dark one.
  **Gap:** `--shadow` is an `rgba()` list, so the hex comparison skips it.

**The pair list is the part that rots.** A colour combination not in it is a combination nobody
measures, so a new surface or ink token means adding its pairs by hand.

**Nothing checks the spacing scale**, and it is worth saying out loud now that there is one.
`--space-1/2/3/4` are honoured by convention: a rule that writes `margin-bottom: 18px` is legal
CSS, passes all 144 checks, and puts the file straight back where it was before the scale existed.
A shape check could catch it — a vertical `margin`/`gap` whose value is a raw pixel figure and not
a `var(--space-*)` — and it belongs on the list above with the other CSS-shape checks, to be folded
in the next time one bites. Until then the scale is held by review, not by the script.

Still done by hand, not in the script:

- **`node --check app.js`** — free, catches nothing subtle, run it anyway.
- **A stub DOM.** Deliberately left out of `check.mjs`: of the three throwaways it was the one that
  never caught anything. Marked with a `ponytail:` comment there, to be added when a storage or
  render bug gets past what is written.
- **The CSS-shape checks** the throwaways sometimes did — no id selectors in the stylesheet,
  `max-width` queries descending, no base rule below the first media query. Worth folding in the
  next time one of them bites.

`README.md` links the per-round record of what each of these actually found; the running history is
in [log.md](log.md).

**Two things `check.mjs` cannot reach, and what PR #15 used instead.** It reads the four files as
text, so it can see neither what `loadState()` does with a corrupt blob nor what two tabs do to
each other. That round wrote a throwaway for each, and both are recorded in
[log.md](log.md#the-storage-round-pr-15) rather than committed:

- **The real `loadState`/`saveState` in a Node `vm`.** Lines 1–597 of `app.js` are DOM-free, so
  they load into a context with a fake `localStorage` and nothing stubbed. 26 cases — a
  round-trip, sixteen kinds of corrupt blob, the `KEEP_WEEKS` prune, a full quota, storage blocked
  outright.
- **Two real Chrome tabs over CDP.** The `storage` event does not exist in Node, so the bug that
  round fixed is invisible there. Both tabs served over HTTP onto one origin and driven through
  the DevTools protocol on Node's built-in `WebSocket`, no dependency. `app.js` is a classic
  script, so its top-level `const state` is a global lexical binding that `Runtime.evaluate` reads
  directly — which is what makes driving this app from outside cheap.

Both were run against the unfixed code first and both fail there. **Neither is committed:**
`check.mjs` is the one saved check by rule, and a second one that launches Chrome and binds a port
is a change to how this project tests rather than a test. The offer stands if the storage code
moves again.

### The gaps

- **Keyboard-only and a screen reader — started, not finished.** PR #10 tabbed through the recipe
  grid and the sidebar in light mode on a wide screen, and immediately found a defect nothing else
  could see. **Still undriven: the week view, the inline slot picker and both dialogs** — which is
  where the interesting part is, since focus restoration after a redraw is asserted in eight places
  and driven by a person in none. Three of the eight are now exercised by a scripted headless check —
  opening the picker, and bookmarking from inside it — which is how the hidden-copy bug below was
  confirmed, but a script clicking `.click()` is not a keyboard. A screen reader has never been run
  at all. **Every accessibility defect
  this project has shipped was in this category**, and it remains the largest gap.
- **A real phone — closed once, and it reopens.** A dragged-narrow desktop window is not one:
  controls are compact on a fine pointer and only return to the 44px floor under
  `@media (pointer: coarse)`, which a desktop browser never enters. The narrow height budget makes
  this sharper than it was: the difference between a mouse and a finger there is 33px of controls
  (30.6% against 34.9% of a 780px screen), so the budget is 4 points from its ceiling on the
  pointer nobody here has tested with. A headless run can *force* that block on — which is how
  those numbers were taken — and forcing it is not being on one. You opened the live site on a
  phone after PR #8 and it was fine. That was one phone, unnamed, at one moment — so any change to a
  control's size puts this back on the list rather than inheriting the result.
- **What a value-reading script cannot see.** `check.mjs` compares colours, names and paths. It
  cannot see a rule that *changes nothing*: `.theme-btn:hover` was briefly set to the fill the
  button already had, and every token stayed legal and every pair still measured fine while the
  hover did nothing at all. **A check that reads values is blind to a no-op.** That one took a
  mouse. Its sibling took a keyboard: the recipe card's focus ring had been clipped away by an
  ancestor's `overflow: hidden` since it was 2px wide, and **no check this project runs looks at a
  page that has keyboard focus on it** — not the script, which reads source text, and not a
  screenshot, which is taken at rest.
- **What a screenshot cannot see either.** The picker round produced two defects a picture could
  not show and the script could not either: `.focus()` aimed at a button that was still in the DOM
  but hidden, and a page 2px taller than the window. Both were found by asking the *live page* for
  a number — `activeElement`, `scrollHeight` — from a headless browser driven by the shell. That is
  a third kind of check this project now has and had not used before, and it is the one that suits
  anything measured rather than drawn.

**All 144 checks pass.** The pair that once did not — `--surface-sunk` beside `--bg` at **1.08**,
known since PR #7 — was fixed rather than excused, twice over. The first fix sent
`.nav-btn:hover` in the sidebar — where the nav unwinds to no fill of its own and so lands on the
page — *up* to `--surface`, which cleared the floor at 1.11 light and 1.23 dark and was the
dark-mode direction. PR #10 replaced it with `--hover`, a proper step **down** into grey at 1.14,
which is what a light theme is supposed to do. `.theme-btn:hover` was changed with it and changed back: it looked like the same bug but
sits on the *button's own* `--surface` fill, so `--surface-sunk` was right there all along (1.20 and
1.14), and setting it to `--surface` made the rule a no-op. **A fill has to differ from what the
control sits on, not from the page behind it.** The token itself could not move: in dark mode the only
value clearing 1.10 against both `--bg` and `--surface` is `#232323`, which is `--surface-past`, and
two tokens holding the same shade means a tray inside a past card has no edge at all.

The pair is now **absent from the script's list on purpose**, with a comment saying to put it back
the moment a bare sunk fill lands on the page again. `--line-strong` against `--bg` was added in its
place. That once covered two sunk fills that could reach the page, and it now covers none: the slot
picker's tray went when the picker took over the day, and the tools row lost its tile, which sent
`.filter-summary` and the search field to `--surface`/`--line` — the card's arrangement. `.chip` in
the dialogs is the last `--control` fill in the app and it is always on a `--surface` sheet. The
pair stays measured (2.30, comfortable) as the guard for the next thing that reaches the page.

A third thing to watch rather than a gap: contrast figures are computed, and three pairs now sit
under 5.0 against the 4.5 floor — light `--on-accent` on `--accent` at 4.74, light `--accent-ink` on
`--hover` at 4.70, dark `--ink-faint` on `--control` and `--hover` at 4.74 — closer than an eye can
call. The last of those used to be `--ink-faint` on `--surface` at 4.89 and is now the tighter pair,
because PR #18 raised the ground under the search placeholder. The middle one is new in PR #19: a
saved bookmark is `--accent-ink`, and the button under it now hovers to `--hover` rather than to
`--control`, which is a darker ground by 0.9.
Since the light page went near-white there is also less room between surfaces than there was, so two
edges are held by a hairline alone; see [decisions.md](decisions.md#colour-and-contrast). And
`color-mix` is load-bearing for old browsers; `subgrid` no longer is.

**PR #13 added a search field, a layout toggle, five dropdowns and a menu of checkboxes to three
views, and the pair list did not grow at all.** Every ground in it was already measured — and the
values here are the ones that held while the row still had a tile under it: the dropdown menu was
`--surface` inside a `--surface` card with a `--line-strong` hairline; a summary chip was
`--control` with `--ink-soft`; a ticked option hovers to `--hover` with `--ink`;
the pressed layout button was the `--accent-soft` wash with `--accent-ink` (the full `--accent`
fill since); the count badge is
`--on-accent` on `--accent`; the checkbox's `accent-color` is `--accent` on a card. That is the
happy version of the rule below — reusing a ground costs nothing, and it is why the count stayed at
76 through that round.

**PR #18 is the other case, and the count went 76 to 91.** It added one token, `--control`, which is
one new *ground* — so all three text tiers land on it, `--accent-ink` lands on it (a saved bookmark,
hovered), and it has to be measured against both the card and the page. Seven pairs, and the
fifteenth check is the arithmetic behind them: **a new ground is expensive and a reused ground is
free**, which is the whole reason the list is kept by hand rather than generated. It earned its keep
immediately — dark `--ink-faint` on `--control` came out at **4.05**, because raising the search
field raised the ground under its placeholder, and no screenshot of a placeholder was ever going to
show that. The token went to `#a8a4a1`.

**PR #19 went 91 to 96 with no new token at all**, which is the same rule read the other way. Two
existing tokens landed on new ground: `--accent-ink` on `--hover`, because the bookmark's hover fill
moved there, and `--hover` beside `--surface`, because three card-level hovers moved there with it.
That second pair is the one worth the paragraph: dark `--hover` had been `#2b2b2b` since PR #10 —
*the same value as `--surface`* — so those three hovers were doing nothing at all in dark, and the
script reported nothing because the pair was not on the list. **A no-op fill is invisible to a check
that reads values and to a screenshot taken at rest**, and the only reason this one surfaced is that
adding a consumer forced the pair to be written down. The fifth check is `--control` beside
`--surface` splitting in two: at 1.07 in light it falls under the floor and the `line` branch
measures `--line-strong` against both sides instead of the pair.

**Untiling the tools row went 127 to 136, and every one of the nine is the same sentence:** a
control that was on a card is on the page now. `--line`, `--hover` and `--accent` all gained the
faded end of the page as a ground, and `--accent-soft` gained it as a pair that **fails** — 1.06,
against 1.18 on the white tile it used to sit on — which is how the pressed layout button came to be
the only bordered `.icon-btn` in the app, until the wash was given up for the full `--accent` fill
and the border went with it. The pairs the round created all outlived it: `--accent-soft` still
lands on the faded page as `.btn:hover`, with the same `--accent` border carrying it. `--control` beside `--bg` is still in the list with
nothing filling it: kept as a guard, like `--surface-sunk` beside `--bg` before it, and its comment
says so. **A layout change that moves a control from a card to the page is a palette change**, and
the script is the only thing that says which of its colours stopped working.

**136 to 140, and the four came from a wrong comment rather than from a change.** Nothing in that
round's diff was a colour except the pressed layout button's fill; the additions came from a code
review noticing that the comment above `--accent-soft`/`--bg-fade` credited `.meal-add:hover` with
washing accent-soft onto the *page*, when `.meal-add` lives inside `.meal` and its ground is a card.
Following that found two pairs the list had never had: the "+" circle on an empty meal is
`--accent-soft` at rest and `--accent` on hover, and on a day gone by the card under it is
`--surface-past`, which appeared in no surface pair at all. Both pass — 1.13 / 1.25 and 4.55 / 6.10
— so they are guards, not fixes. **The gap was in the list and the error was in the sentence beside
it**, which is the argument for writing the ground down next to every pair: a comment naming the
wrong consumer is the only thing that can make a missing pair look present.

The pair list grew by two in PR #10, with `--hover`: the token beside `--bg`, and `--ink` on it.
It grew by three more when the week bar dissolved, without a single new token — `--ink-soft` and
`--ink-faint` on `--hover`, because the day chip carries three inks where a nav item carries one,
and `--accent` beside `--hover`, because the ring marking a planned day sits on that fill under a
pointer. That is the rule in practice, and the second half of it is the part that gets missed: **a
new pair does not need a new token.** Moving an existing token onto a new ground makes one.

Which is why adding the pair is a rule in `CLAUDE.md` rather than a habit: **a pair missing from
that list is a pair nobody measures.** The script cannot tell the difference between a combination
that is safe and one it was never handed, and both print the same silence.

## Deployment

GitHub Pages serves `main` from `/ (root)`, already enabled. Every push to `main` rebuilds; there
is no workflow file and no build step, because there is nothing to build — relative paths
throughout and `index.html` at the repo root.

```
gh api repos/thelivinsine/meal-planner/pages/builds/latest --jq '{status, commit}'
```

`status` goes `building` → `built`, usually inside a minute. A stale-looking page after that is
almost always the browser cache, not the deploy — hard-refresh before believing anything is wrong.

## Running it locally

Open `index.html` in a browser; there is nothing to install. For a cleaner test of the saving
behaviour, serve over HTTP instead — over `file://` every local page on your machine shares one
storage box, which muddies testing:

```
python -m http.server 8765
```
