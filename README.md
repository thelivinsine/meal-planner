# Mise — weekly meal planner

Plan what you're eating this week. Browse a catalogue of 50 recipes, drop them into
breakfast / lunch / dinner slots on real dates, and bookmark the ones you like.
Everything is saved in your own browser — no account, no server, nothing leaves your machine.

**Live app:** https://thelivinsine.github.io/meal-planner/
**Code:** https://github.com/thelivinsine/meal-planner
**Stack:** one HTML file, one CSS file, one JS file. No frameworks, no build step, no dependencies.

## Where things stand

*Written for picking this up in a new session.*

| | |
|---|---|
| **`main`** | Commit `49b3c16`, the bold-consumer redesign squash-merged from PR [#4](https://github.com/thelivinsine/meal-planner/pull/4). Pages build `built`, live at the link above. The branch `design/bold-consumer` is deliberately **not** deleted |
| **Open work** | None. Both design PRs are settled: [#4](https://github.com/thelivinsine/meal-planner/pull/4) merged, [#5](https://github.com/thelivinsine/meal-planner/pull/5) closed and `design/app-shell` deleted. What is left is verification, not building — see *Next jobs* |
| **Screenshots** | **None.** The two pre-redesign shots were deleted rather than left captioned as stale. Nothing in the repo shows the current app |
| **Deploy** | Merging to `main` triggers a Pages build on its own. Watch it with `gh api repos/thelivinsine/meal-planner/pages/builds/latest --jq .status` until it reads `built` |

**The whole redesign is live and none of it has been seen in a browser.** That is the single most
important thing to know here. Contrast is computed, touch targets are arithmetic, the accordion
and the docked nav have only ever existed as HTML strings in a stub-DOM script. The three defects
that shipped with PR #3 are genuinely fixed — but they were found by reading, and so were the ones
found since, which is not the same as having looked at the thing.

**Next jobs, in the order they'd earn their place:**

1. **Open it in a browser.** Wide, then at 360px, then on a real phone. Everything below this
   line is guesswork until that happens.
2. **Take screenshots.** There are none — the stale pair was deleted rather than left in place
   misrepresenting the app, the third round of stale shots this project has had. Worth capturing:
   the wide accordion, expand-all, the narrow week, the recipe dialog, and both themes.
3. **Seven small things found in review and left alone**, none of them urgent:
   - Google Fonts is the app's first external request; blocked or offline, you get the fallback
     stack. The one place the "static files only" constraint bends.
   - `applyTheme()` always stamps `data-theme`, so a dark-OS user gets a light app on first
     visit despite `<meta name="color-scheme" content="light dark">`.
   - `<meta name="theme-color">` is `#fdf4e9`, the cream page colour from *before* the surfaces
     inverted. The page is `#ffffff` now, and there is no dark-mode variant, so browser chrome is
     both the wrong colour and light-only.
   - The storage key `p5:mealplanner` is written twice — `STORAGE_KEY` in `app.js` and again in
     the inline theme script in `index.html`. Change one, forget the other.
   - Toggling Save inside the open recipe dialog rewrites `#detail-tools` and drops keyboard
     focus. Same class as the day-strip defect, in a place nobody checked.
   - `is-upcoming` is emitted by `renderWeek` and matched by no CSS rule.
   - The week's date range line is gone with no replacement; on a wide screen the rails carry
     dates, but there's no longer a single label saying which week you're looking at.

**Two open questions, both yours to call:**

- **The stub-DOM check scripts are still thrown away each session.** This round added 21 more
  assertions to the pile and then deleted them, so a regression between rounds still has nothing
  to catch it. Committing a single `check.mjs` would fix that; it also puts a test file in a repo
  whose constraints say no test framework. Not done either way.
- **`subgrid` has no fallback.** The week's alignment depends on CSS `subgrid` (Chrome 117+,
  Safari 16+, Firefox 71+). On anything older the rows size per card, which degrades to the old
  misalignment rather than to something broken. Worth a fallback only if an old browser matters.

---

## Screenshots

None. There were two, of the Week view before the bold-consumer redesign, and they were deleted
rather than left in the file misrepresenting the app — the third round of stale shots this
project has had. `Screenshots/` is empty until someone opens the current build and takes a fresh
set; the old ones are recoverable from git history if a before-and-after is ever wanted.

Worth capturing when it happens: the wide week with one day open and six rails, the same week
under **Expand all**, the narrow week at 360px, the inline slot picker with **Add to Thu
breakfast** on a card, the recipe dialog with its icon tools, and every one of those in dark mode.

---

## For anyone reading this without a technical background

**What it does.** Three screens. *Recipes* is the cookbook — search it, filter it, tap a recipe
to read the ingredients and method. *Week* is your plan for the week: seven real days, three
meal slots each. *Saved* is your shortlist of favourites.

**How it saves your plan.** Your browser has a small built-in storage box. The app keeps your
week and your bookmarks there, so closing the tab and coming back later keeps everything.
The catch is that it's per-browser and per-device: your plan on your laptop is not the same plan
as on your phone, and clearing your browsing data clears it. That's the honest trade for having
no accounts and no server to run.

**On a phone.** The seven-day grid can't fit across a phone screen, so it turns into a row of
seven day buttons with one day open below them. The tinted buttons are the days you've already
planned something for, so you can still see the shape of your week at a glance.

**What it deliberately does not do yet.** No shopping list, no month calendar, no adding your own
recipes, no sharing a plan with anyone else. Those are all sensible next steps, not oversights —
see [Not in v1](#not-in-v1).

---

## Running it

Open `index.html` in a browser. That's it — nothing to install.

For a cleaner test of the saving behaviour, serve it over HTTP instead:

```
python -m http.server 8765
```

then visit http://localhost:8765. (Over `file://`, every local page on your machine shares one
storage box, which muddies testing.)

---

## What v1 does

**Recipes**
- 50 recipes, each with tags, cooking time, ingredients and a short method
- Over half are Indian, and roughly three quarters are high-protein; the rest are tagged
  `balanced`. Both are ordinary tags, so the `indian` and `high-protein` chips filter on them
- Search matches recipe names, tags **and** ingredients — so "chickpea" finds the curry
- Filters live in one panel: search, then tag chips grouped under *Macros*, *Meal*, *Diet*,
  *Cuisine & style* and *Main protein* — five short lists instead of one wrap of sixteen
- **Filters** collapses the chips and carries a count badge; an active row underneath names what
  you're filtering by, with **Clear all** beside it
- Pick several chips; a recipe matching any of them shows
- Tapping a card opens a detail panel; close it with the ×, the Escape key, or a tap outside

**Week**
- Monday–Sunday of a real week, with the actual dates shown
- Move between weeks with ← / →, or jump back with **Today**
- **One day is open at a time.** The other six collapse to narrow vertical rails carrying the full
  day name and date, turned on their side and facing inward from both sides. Click a rail and it
  expands while the previous day collapses, the column widths animating between the two
- **Expand all**, beside the week arrows, returns to seven equal columns. There the three meal
  rows line up straight across all seven days, however long a recipe name runs
- Three states are visually distinct: **past** days are dulled almost to the page colour,
  **today** is a card filled with ink, **upcoming** days carry the warm tile tint
- Each slot can be filled, replaced, or cleared
- Past days stay editable, so you can log what you actually ate
- **On a narrow screen** seven columns stop fitting, so the week becomes a strip of seven day
  buttons and the one day it selects. The strip is the overview the seven cards give you on a
  wide window: which day you're on, which is today, and which days already have something
  planned (those are tinted). The buttons wrap four and three, centred. Tap a day to show it. It
  opens on today when today is in the week
  on screen, Monday otherwise, and it resets that way whenever you move to another week — which
  day you were looking at isn't worth remembering between sessions. The day card itself is the
  same card as the wide layout, with its meal labels beside the meals instead of above them

**Adding a meal — two ways in**

*From the week.* Tap **+ Add** on an empty slot and the recipe list opens in the space below
your week. The day and meal are already known from the slot you tapped, so it never asks again:
the recipes appear as the same cards you get on the Recipes page — name, time, tags, and a
bookmark — except the button reads **Add to Thu breakfast** and fills the slot you tapped. Not
sure about one? Tap the card to read the full recipe — the sheet offers Save but not **Add to
week**, because the day and the meal are already settled and this app never asks twice; close it
and use the card's button. There's a search box in the panel, and Escape, the ×, or moving to
another week all close it. This route is for empty slots only — a filled slot is changed by
clearing it and adding again, or through the dialog below.

*From a recipe.* **Add to week** on any card — or the calendar icon beside the close button in the
detail panel, where it sits next to Save as a pair of icon buttons — opens a small dialog. The
recipe name is the headline there; "Add to week" sits above it as a small label, and everything
below is centred.
- Pick a day from seven day buttons and a meal from three — everything visible, two taps
- Picking a day that's already gone is allowed but flagged: the dialog says so, and that day's
  button is drawn with a dashed border
- If the slot is taken, the dialog names what's there and the button reads **Replace**

**Saved**
- Exactly the recipes you've bookmarked, from either the card or the detail panel
- Removing a bookmark drops it from Saved immediately but leaves it in your week — unsaving a
  recipe isn't the same as cancelling dinner

---

## How the code is organised

Three files, as the project constraints require:

| File | Contains |
|---|---|
| `index.html` | The page shell: top bar, three `<section>` views, the inline slot picker, the docked view switch and two `<dialog>` panels. The switch sits at body level, not inside the top bar — a `backdrop-filter` ancestor becomes the containing block for anything `position: fixed` inside it. Also an inline `<script>` in `<head>` that paints the stored theme before first paint |
| `style.css` | All styling. CSS custom properties for the palette, two width breakpoints (1000px, 620px) and a coarse-pointer block |
| `app.js` | The recipe catalogue, the app state, rendering, and one event handler |

**The data model** is the part worth understanding. Two things exist:

- `RECIPES` — the fixed catalogue, hardcoded. Never saved, never changes at runtime.
- `state` — everything about *you*: which view you're on, which week you're looking at, which day
  is open (`focusDay` — it drives the wide accordion as well as the narrow week), whether the week
  is expanded to all seven columns (`expandAll`), your plan, your bookmarks, your theme, your
  current search and filters, and whether the filter panel is open.
  The plan, the bookmarks and the theme are saved — the rest is per-session by design. The theme
  is the deliberate exception: one you picked and lost on reload would be a bug, not a fresh
  start.

The plan is one flat object keyed by real date and meal:

```js
state.plan = { '2026-08-26|Dinner': 'chickpea-curry' }
```

Keying by actual date, rather than by "Wednesday", is what makes next week a genuinely separate
plan instead of the same seven slots relabelled. It also means one assignment fills a slot and one
`delete` clears it — no nested structures to walk.

**Rendering** is deliberately dumb: change state, then redraw the whole view from it. With 50
recipes that's instant, and it removes a whole class of bug where the screen and the data disagree.

**Events** go through a single click listener on `document`, dispatching on a `data-action`
attribute. Because of that, re-drawing a view never needs listeners re-attached.

**Storage** is one key, `p5:mealplanner`, holding one JSON blob of the plan, the bookmarks and the
theme. `index.html` reads that same key inline in `<head>` to paint the theme before first paint,
so the key name is written in two places — change one and you must change the other.
Reads and writes are wrapped in `try`/`catch`: private browsing and full quotas are real, and
neither should take the app down. Loading also *validates* rather than trusting — every entry
must have a real date, a real meal name and a recipe that still exists, or it's dropped. Junk in
storage produces an empty plan, never a crash. Entries older than four weeks are also dropped, so
the saved blob can't grow forever.

---

## Decisions worth recording

| Decision | Why |
|---|---|
| Plan keyed by real date | You asked for real dates; anything else makes "next week" meaningless |
| The viewed week isn't saved | It always opens on the current week, so returning days later doesn't strand you on a stale one |
| Old entries pruned after 4 weeks | The direct consequence of date keys — otherwise storage grows with every week that passes |
| One recipe per slot | "Cleared or replaced" reads as singular |
| Day buttons, not a dropdown | A `<select>` opens the OS wheel on mobile and hides the dates; seven buttons show everything at once |
| Past days editable, not locked | Useful for logging meals already eaten; the greying communicates enough |
| Slot's **+ Add** opens the list inline, under the week | The slot already names the day and meal; asking again in a dialog was redundant, and the space below the week was empty |
| The dialog stays for the recipe-first route | From a card nothing is known yet, so a day and meal still have to be picked |
| Day cards share the grid's rows (CSS `subgrid`) | Their meal rows used to drift out of line whenever one card's header or recipe name was taller |
| Today is a dot, not a pill | The pill pushed the date onto a second line, which is what knocked that column out of alignment |
| No boxes inside the day card | Card border, then dashed slot boxes, then a filled pill inside that — three nested outlines to say one thing. A hairline and a label carry it |
| Filter chips grouped and collapsible | Sixteen equal pills in one wrap is a tag dump, not a filter. Grouping says what each choice means; the count badge and **Clear all** show what's on |
| Recipe name is the headline in the add sheet | "Add to week" is the same on every recipe, so it's the one thing there that doesn't need 22px of type |
| The week's picker uses the Recipes card | It was a list of bare rows, so the same recipe looked like two different things in two places. One `cardHtml(recipe, slot)` now draws all three lists |
| The picker panel is a sunk tray | Cards on a panel of the same tone have no edge at all. The tray sits one step deeper than the cards it holds, which lifts them without adding shadows |
| The page is white, the tiles are tinted | The reverse read as washed out: a tinted page behind near-white cards gave a 1.12:1 edge. Inverting it puts the colour where the content is |
| The wide week is an accordion | Seven equal columns give each day about 150px, narrower than most recipe names. One day at 8/14ths of the row is readable; the other six still show their names and dates on the rails |
| Column tracks are all `minmax(0, Nfr)` | `grid-template-columns` only interpolates when every pair of track sizes is interpolable. A `1fr` against a pixel width is not, so mixing them made the accordion snap instead of animate |
| The view switch floats at the bottom | It is the one control used from every screen, and the top bar was carrying a wordmark, three tabs and a theme toggle. Docking it leaves the header quiet |
| The week heading rotates | One line, chosen from eight at load, instead of an eyebrow plus a title plus a date range. It says what the screen is for rather than what it is called |
| Theme is saved, other view state is not | Which week or day you were on means nothing next session. A theme you chose does |
| Dialog actions are icons beside the close | Two full-width buttons above the ingredients pushed the recipe down the panel. As icons they sit in the chrome, where actions belong |
| The card's button changes, not the card | Recipes says "Add to week" and asks for a day; the picker says "Add to Thu breakfast" and doesn't. Same card, one different button |
| A narrow week shows one day, not seven squeezed | Seven columns below ~1000px gives each day about 130px, which is narrower than a recipe name. A day strip plus one full-width card keeps the card readable and the week glanceable |
| The same day card on both layouts | A second set of week markup for mobile is two things to keep in step, and they drift. CSS hides the six days that aren't focused instead |
| Which day you're looking at isn't saved | It means nothing next session, and reopening on a day you happened to tap last Tuesday would be stranger than opening on today |
| No drag-and-drop | Touch needs an entirely separate code path from mouse dragging, and clear/replace already covers moving meals |
| Redraw the whole view, no diffing | 50 recipes is small; the simplicity is worth more than the cycles saved |

---

## Not in v1

Left out on purpose, roughly in the order they'd earn their place:

- **Shopping list** from the week's ingredients — the obvious next feature, and the data is already there
- **Month calendar** view — held back deliberately until the week view settled
- **Your own recipes** — needs an editor and a place to keep them, which is real work
- **Copy last week** / duplicate a day — cheap to add, genuinely useful
- **Sharing or syncing** a plan — impossible without a server, which the project rules exclude

---

## Testing

There's no test framework in the repo, per the project constraints. Every check has been a
throwaway Node script run against a stub DOM — load `app.js`, drive `state` and the delegated
click handler, assert on the HTML strings that come back — and then deleted.

### Before the redesign

These assertions were written against the pre-redesign app. Most still describe behaviour that
did not change, but none of them have been re-run since:

- 50 unique, complete recipes, each tagged `high-protein` or `balanced`, and both catalogue
  thresholds (over half Indian, over two thirds high-protein)
- Week-start arithmetic landing on a Monday across month, year and leap-day boundaries
- 7 day cards and 21 slots rendered, with the right past / today / upcoming split for the real date
- The inline slot picker: hidden on load, opens with the tapped day and meal in its heading, offers
  all 50 recipes, filters on its own search without disturbing the Recipes view, fills exactly the
  tapped slot in one click without the dialog opening, closes on Escape, week navigation and
  view change, and returns focus to the slot it was opened from
- The dialog route: 7 day buttons with one preselected; add → replace → clear leaving exactly one
  correct entry
- The filter panel: a chip for every catalogue tag and no duplicates, every tag landing in a
  named group (nothing falling through to *More*), the count badge and active row appearing and
  clearing, and the collapse toggle carrying `aria-expanded`
- The week markup: no wrapping Today pill, one today dot, labelled **+ Add** buttons
- The picker and the Recipes grid render byte-identical card markup apart from the primary
  action, and a picker card's bookmark star follows a bookmark made from the open sheet
- Viewing from a picker card: the sheet's primary button carries that slot, survives a bookmark
  redraw, fills exactly that slot, closes both panels, and refuses an unknown meal
- A save/reload round-trip, and nine kinds of corrupt storage (truncated JSON, `null`, `[]`, wrong
  types, unknown recipe ids, invalid dates) all falling back to a clean state

### The redesign round

The bold-consumer round replaced all three files and was checked no better than the rounds
before it: `node --check`, contrast computed rather than eyeballed, and 89 stub-DOM assertions —
68 during the build, 21 more added at review. Between them they covered the seven-column and
accordion renders, rail sides and count, that every column track is the same type so the width
animation can run at all, focus restoration on both the wide and narrow layouts, the expand-all
toggle and its relabelling, plan writes and clears, bookmarks, tag filters, theme persistence and
restore, the recipe dialog's two tool states, and the fill-slot route out of the inline picker.
Thrown away with the rest.

### What has never been seen

**Nobody has opened the current app in a browser. Not once, across nine build rounds and two
reviews.** There are no screenshots either. Everything below is reasoning about source code:

- How any of it looks, in either theme.
- The accordion's column animation, the docked nav switch, the frosted top bar.
- Every contrast pair — computed, and several sit within 0.1 of the 4.5 floor.
- Every touch target, including the 44px floors that only apply under `@media (pointer: coarse)`.
- The day strip wrapping 4 + 3 at 360px, and the roughly 77px chips that arithmetic gives.
- The whole app on a real phone rather than a narrow desktop window.

Two rounds of reading found nine real bugs between them, and six of those were the kind only a
browser shows — both dialogs rendering in the page at all times, the column animation never
running, a frosted halo that was the wrong shape, and the three fixed at review. Assume there are
others of the same kind that reading did not catch.

One deliberate gap, unchanged: the week's meal rows are 38px on a mouse and return to 44px under
`@media (pointer: coarse)`, so a narrow *desktop* window has rows below the floor. That is a
pointer question, not a width one, and it is the only sanctioned exception. The day chips used to
be an accidental second one; the wrapped strip fixed that.

---

## Development log

| | |
|---|---|
| **Setup** | Repo created; project constraints written into `CLAUDE.md` — vanilla JS only, browser storage only, GitHub Pages as the target |
| **Scope** | Settled on v1: three views, ~25 recipes, week planning, bookmarks. Month calendar and drag-and-drop explicitly excluded |
| **v1 built** | `index.html` / `style.css` / `app.js` on branch `feat/v1-meal-planner`. Week view moved to real dates during planning, at your request |
| **First review** | Two changes from your feedback: past days now visually distinct from upcoming ones, and the day dropdown in the add dialog became a grid of day buttons |
| **Published** | Merged to `main` and pushed to GitHub as a public repo |
| **Second round** | Branch `feat/slot-picker-and-indian-recipes`: the slot's **+ Add** now opens the recipe list inline under the week instead of asking for the day and meal a second time, and the catalogue grew to 50 with 27 Indian and 38 high-protein recipes |
| **Deployed** | Second round merged to `main`; GitHub Pages serving `main` at the root. Live at the link above |
| **UI round** | Branch `feat/ui-polish`, from your notes on the v1 screenshots: week rows aligned with `subgrid`, nested boxes removed, filters grouped and collapsible, the add sheet re-weighted around the recipe name, and a view-the-recipe route out of the week picker |
| **Card unified** | Same branch, at your request: the week's slot picker dropped its own row design and now draws the Recipes card, with only the primary button differing |
| **Contrast** | One wrong turn worth recording: the picker cards reading as flush was diagnosed as a page-wide figure/ground problem and the whole palette was darkened. That wasn't it, and it was reverted (`5a70694` in the reflog if the numbers are ever useful). The actual cause was local — white cards on a white panel — and the fix was to recess that one panel |
| **Review** | PR #2 read back against its own description before merging. Four small things: past days had lost their accent-free hover when an override was deleted, and three figures in this file were stale. Two flagged and deliberately kept — the app-wide `[hidden]` rule, and 38px week rows on a fine pointer |
| **UI round merged** | PR [#2](https://github.com/thelivinsine/meal-planner/pull/2) squash-merged to `main` as `409d7d2`, then `f60a79d` for the notes. Pages build `built`, live site serving it. The stale v1 screenshots were deleted; no fresh set yet |
| **Narrow week** | Branch `mobile-week`. Started as a CSS-only compaction of the meal rows below 1000px, then grew on the same branch into the day strip: seven day buttons plus the one day they select, the same card as the wide layout with six hidden. `focusDay` added to state, not persisted |
| **Reviewed twice** | The first review covered the compaction and produced one fixup — a duplicate `@media (max-width: 1000px)` block folded back into the existing one, which had been sitting after the 620px block and overriding it. The branch then grew two more commits, so the PR was re-read from scratch. That pass found three defects, which shipped open and were fixed a round later in PR #4 |
| **Merged anyway** | PR [#3](https://github.com/thelivinsine/meal-planner/pull/3) squash-merged to `main` as `236ce5b` with the three defects open, at your call. Pages build `built` |
| **Seen at last** | You took screenshots of the Week view and committed them to `main` as `f0dfe07` — documentation, so no branch. The wide week and the day strip both look right. Two of the four turned out to be of an older version and were deleted rather than left to mislead, the same call as the v1 set |
| **Two directions** | Two redesign proposals opened side by side off the same `main`: PR #4, bold consumer product, and PR #5, app shell / control surface. Nine rounds of feedback into #4 before it was reviewed |
| **Reviewed** | PR #4 read against its own description. Three real defects: the recipe dialog had no way to fill the slot it was opened from, `display: none` on the day `<h2>` had come back one selector along after being listed as fixed, and the open day's header was an `aria-expanded="true"` button that could not collapse anything. All three fixed on the branch, with 21 stub-DOM assertions. Two camera-named screenshots that nothing referenced were dropped from the diff |
| **Direction A shipped** | PR [#4](https://github.com/thelivinsine/meal-planner/pull/4) squash-merged to `main` as `49b3c16`, at your call, unseen in a browser. Pages build `built`. The branch was kept, not deleted, at your request |
| **Direction B closed** | PR [#5](https://github.com/thelivinsine/meal-planner/pull/5) closed and `design/app-shell` deleted. It conflicted with `main` the moment A merged — both proposals rewrote the same three files — and rebasing would have meant rewriting it. The table-shaped week is the part worth bringing back |

---

## Deployment

GitHub Pages serves `main` from `/ (root)`, already enabled. Every push to `main` rebuilds; there
is no workflow file and no build step, because there's nothing to build — relative paths
throughout and `index.html` at the root.

```
gh api repos/thelivinsine/meal-planner/pages/builds/latest --jq '{status, commit}'
```

`status` goes `building` → `built`, usually inside a minute. A stale-looking page after that is
almost always the browser cache, not the deploy — hard-refresh before believing anything is wrong.
