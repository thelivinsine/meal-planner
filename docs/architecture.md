# How the code is organised

*Changes when the shape of the code changes, not otherwise. For **why** any of it is this way,
see [decisions.md](decisions.md).*

## Three files

| File | Contains |
|---|---|
| `index.html` | The page shell: top bar, three `<section>` views, the week bar, the day's meal cards, the summary column, the inline slot picker, the view switch and two `<dialog>` panels. Plus an inline `<script>` in `<head>` that paints the stored theme and sets `theme-color` before first paint |
| `style.css` | All styling. Custom properties for the palette, then the rules, then **every media query at the end of the file** — three `max-width` breakpoints (1000px, 620px, 400px, descending), one `min-width: 1001px` for the sidebar layout, a `pointer: coarse` block, and `prefers-reduced-motion` |
| `app.js` | The recipe catalogue, the app state, rendering, and one event handler |

`Mockups/` holds the supplied design concepts the current layout was built against. There is no
`Screenshots/` — see [status](status.md#screenshots). The dark-mode reference images the palette was
rebuilt against are *not* in the repo; they are gitignored screenshots in the working directory,
which is a real gap in the record and is called out in [status](status.md#screenshots).

Two bits of markup are placed where they are for a reason, and moving either breaks something that
looks unrelated:

- **The view switch sits at body level**, not inside `.topbar`: a `backdrop-filter` ancestor becomes
  the containing block for anything `position: fixed` inside it. That same element is what becomes
  the sidebar over 1000px.
- **The week view's `.view-head` is a direct child of `.view-week`**, not part of `.week-main`, so
  the grid can give it a row of its own and the summary column can start level with the week bar.
  Consequence: all three items in that grid are placed by hand — heading in column 1 row 1,
  `.week-main` in column 1 row 2, `.week-side` in column 2 row 2. Leave the lower two to auto-flow
  and the aside slides up beside the heading, undoing the thing the arrangement exists for.

## The data model

Two things exist:

- **`RECIPES`** — the fixed catalogue, hardcoded. 50 recipes, never saved, never changes at
  runtime. Each carries exactly one macro tag (`high-protein` or `balanced`); 27 are `indian` and
  38 `high-protein`, and both ratios are meant to hold as recipes are added.
- **`state`** — everything about *you*: which view, which week, which day (`focusDay`), your plan,
  your bookmarks, your theme, your search and filters, and whether the filter panel is open.

The plan is one flat object keyed by real date and meal:

```js
state.plan = { '2026-08-26|Dinner': 'chickpea-curry' }
```

Keying by actual date rather than by "Wednesday" is what makes next week a genuinely separate plan
instead of the same seven slots relabelled. One assignment fills a slot, one `delete` clears it —
no nested structures to walk.

## Storage

One key, `p5:mealplanner`, holding one JSON blob of the plan, the bookmarks and the theme.
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

The plan, bookmarks and theme persist; view, week, search, filters and `focusDay` are per-session
on purpose. Theme is the deliberate exception — one you picked and lost on reload is a bug.

## Rendering and events

**Rendering is deliberately dumb:** change state, then redraw the whole view from it. No diffing,
no partial updates. With 50 recipes that is instant, and it removes a whole class of bug where the
screen and the data disagree. Views are built as HTML strings, so any text runs through
`escapeHtml` before it reaches `innerHTML`.

**Events** go through a single click listener on `document`, dispatching on a `data-action`
attribute. No inline `onclick` anywhere. Because of that, redrawing a view never needs listeners
re-attached — but it *does* destroy focus, which is why five places put it back. See
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
- **The three values written twice** — storage key, bookmark path, `theme-color` fallback — checked
  against each other. The `theme-color` one has already been left stale once.

**The pair list is the part that rots.** A colour combination not in it is a combination nobody
measures, so a new surface or ink token means adding its pairs by hand.

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

### Two gaps none of that closes

- **A real phone.** A dragged-narrow desktop window is not one. Controls are compact on a fine
  pointer and only return to the 44px floor under `@media (pointer: coarse)`, which a desktop
  browser never enters — so the entire touch-target story is untested by construction. Real thumb
  reach and density are unknown too.
- **Keyboard-only and a screen reader.** Focus order, focus restoration after a redraw, and the
  accessible names on the day row and meal cards are asserted in a stub DOM and reasoned about,
  never driven. **Every accessibility defect this project has shipped was in this category.**

**All 66 checks pass.** The one that did not — `--surface-sunk` beside `--bg` at **1.08**, known
since PR #7 — was fixed rather than excused: `.nav-btn:hover` in the sidebar — where the nav unwinds to no fill
of its own and so lands on the page — now uses `--surface`, clearing the floor at 1.11 light and
1.23 dark. `.theme-btn:hover` was changed with it and changed back: it looked like the same bug but
sits on the *button's own* `--surface` fill, so `--surface-sunk` was right there all along (1.20 and
1.14), and setting it to `--surface` made the rule a no-op. **A fill has to differ from what the
control sits on, not from the page behind it.** The token itself could not move: in dark mode the only
value clearing 1.10 against both `--bg` and `--surface` is `#232323`, which is `--surface-past`, and
two tokens holding the same shade means a tray inside a past card has no edge at all.

The pair is now **absent from the script's list on purpose**, with a comment saying to put it back
the moment a bare sunk fill lands on the page again. `--line-strong` against `--bg` was added in its
place, since `.chip` and `.slot-picker` are the two sunk fills that can still reach the page and
both carry that border (2.30, comfortable).

A third thing to watch rather than a gap: contrast figures are computed, and three pairs now sit
under 5.0 against the 4.5 floor — light `--on-accent` on `--accent` at 4.74, light `--accent-ink` on
`--surface-sunk` at 4.97, dark `--ink-faint` on `--surface` at 4.89 — closer than an eye can call.
Since the light page went near-white there is also less room between surfaces than there was, so two
edges are held by a hairline alone; see [decisions.md](decisions.md#colour-and-contrast). And
`color-mix` is load-bearing for old browsers; `subgrid` no longer is.

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
