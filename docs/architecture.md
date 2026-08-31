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

No test framework, per the project constraints. Every check is a throwaway Node script, and the
approach is stable even though the scripts are not kept:

- **`node --check app.js`** — free, catches nothing subtle, run it anyway.
- **A stub DOM.** Stub what `app.js` touches on load, drive `state` and the delegated click
  handler, assert on the HTML strings that come back.
- **Static wiring.** Every id the JS looks up exists in the HTML; no class emitted without a CSS
  rule; no id selectors in the stylesheet; `max-width` queries descending; no base rule below the
  first media query; the storage key matching in both places.
- **Contrast, computed in both directions,** with the tokens read out of `style.css` so the script
  cannot drift from what ships. Text on its ground needs 4.5. Two surfaces that touch need about
  1.10 — *unless* a hairline carries the edge, in which case the **line** is measured instead,
  against both sides. That distinction is load-bearing; see
  [decisions.md](decisions.md#colour-and-contrast).

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
