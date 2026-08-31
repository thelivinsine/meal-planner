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
| **`main`** | Commit `7e10f85`, the Concept A rebuild from PR [#6](https://github.com/thelivinsine/meal-planner/pull/6), squash-merged and live. Pages build `built` on that commit. Branch `sidebar-day-view` deleted. `main` and the live site are the same thing again |
| **Open work** | **None on a branch.** What is outstanding is looking, not building — see *Next jobs*. `design/bold-consumer` and `feat/slot-picker-and-indian-recipes` are old, already-merged branches still lying around |
| **Shipped unseen** | **Dark mode and the narrow layout.** Both changed after the one screenshot that exists, and both went out on your say-so rather than on a shot. If something looks wrong on the live site, start there — a past day in dark mode is the most likely thing |
| **Screenshots** | **None.** The pre-redesign shots were deleted once they went stale, and `*.png` is now gitignored so a camera-named one cannot be committed by accident. Nothing in the repo shows the current app |
| **Mockups** | `Mockups/` holds the supplied concepts. The live app is Concept A's desktop layout with Concept C's right-hand column, and Concept C's mobile view minus its vertical timeline |
| **Deploy** | Merging to `main` triggers a Pages build on its own. Watch it with `gh api repos/thelivinsine/meal-planner/pages/builds/latest --jq .status` until it reads `built` |

**What shipped.** The seven-column accordion is gone, along with the vertical rails,
**Expand all**, the animated column tracks and the `subgrid` row sharing — both mockups show one
day at a time, so one layout now serves every width and there is no mobile-only week to keep in
step. Over 1000px the nav becomes a left sidebar and the week gains a right-hand column: *At a
glance* (meals planned, cooking time, dietary balance) and *Tips for today*, both computed from
the day on screen. Under 1000px that column is dropped rather than stacked, because everything in
it can be read off the meals themselves.

**Three rounds, and the first two are the reason this shipped at all.**

*Round one found six flaws.* The wide layout was rendering at a third of its width with the
content adrift in dead space; everything was one flat cream; meal cards were tall enough that
three empty ones filled a phone screen; the day row wrapped to two rows on a screen with room for
one; and the docked nav pill sat on the "Add a dinner" button. The root cause of the first was
`.page` becoming a grid item, where `margin: 0 auto` stops it stretching and it shrink-to-fits.
All six fixed in `01239e8`.

*Round two confirms the fixes, wide and in light mode.* The main column now runs about 2.8× the
summary column and fills the width; the warm page against near-white cards reads with real
hierarchy; and the derived panels are right on a full day — 3/3 planned, 37 min, *Protein-heavy*,
with the tip that fires when all three slots are high-protein.

*Round three was a review of the diff, not a screenshot, and found six more.* Three mattered.
`theme-color` was only half-fixed: both tags hung off `prefers-color-scheme`, but the theme here
is a choice the user *stores*, so anyone whose theme disagreed with their OS got the wrong browser
chrome — and the light value was still `#ffffff` from before the palette inversion. One tag now,
written from the live `--bg` by `applyTheme()` and by the inline `<head>` script, so the hex is
never copied a third time. The **Today** button dropped keyboard focus: it renders only while you
are off the current week, so pressing it deletes it — the exact case the four existing focus fixes
were written for, missed because it used to be static markup. And dark `--surface-past` was
`#100d0b`, *darker* than the page at 1.02 against it, so a past day read as a hole punched in the
page rather than a card receded into it; `#201a15` puts it between card and page as the light one
is. The other three were housekeeping: the stylesheet's only two ID selectors turned back into
classes (an ID outranks any media query meant to override it), two classes emitted with no CSS
rule deleted, and `*.png` gitignored.

**The lesson from round three is narrower than round one's but worth the same.** All six were
invisible to the eye and visible to a script — a contrast number, a class with no rule, a focus
target that no longer exists. Screenshots caught what reading missed; scripts caught what looking
could not.

**What is checked, and what still isn't.** Checked: the wide light layout in a browser,
`node --check`, 29 stub-DOM assertions, contrast *and* surface-to-surface separation computed from
the tokens in the stylesheet for both themes, and static wiring — every id resolves, all 106
emitted classes have a rule, `max-width` queries descending, no base rule below the first media
query, and no ID selectors left in the stylesheet. The contrast script now separates bare surface
edges, which must clear 1.10, from edges a hairline carries, where the line must clear 1.15
against both sides — the distinction the convention already drew in prose.

**Not** checked, and it shipped anyway: **the narrow layout and dark mode.** The wrap threshold
moved in `01239e8` and the dark past-day colour moved again in the round-three fixes, so neither
is covered by the one screenshot in the record. You opened the app before merging and told me to
go; that is your look, not a shot, and it is not in the record. Treat any visual claim above other
than *round two* as reasoning.

**Next jobs, in the order they'd earn their place:**

1. **Look at the live site narrow, and in dark mode.** Shipped unseen, so this is a check on
   production now rather than a gate on a PR. A past day in dark mode is the specific thing: its
   meal cards should sit slightly *lighter* than the page, a card that has settled into it, not a
   dark hole punched in it.
2. **Open the live site on a phone.** Still the one gap a desktop cannot close.
3. **Take a screenshot set.** There are none, and `*.png` is gitignored now — so this means either
   excepting a `Screenshots/` directory in `.gitignore` or keeping them outside the repo. Wanted:
   the narrow layout, an empty day, and both of those in dark mode.
4. **Three small things still open**, none urgent:
   - Google Fonts is the app's first external request; blocked or offline, you get the fallback
     stack. The one place the "static files only" constraint bends.
   - `applyTheme()` always stamps `data-theme`, so a dark-OS user gets a light app on first
     visit despite `<meta name="color-scheme" content="light dark">`.
   - The storage key `p5:mealplanner` is written twice — `STORAGE_KEY` in `app.js` and again in
     the inline theme script in `index.html`. Change one, forget the other.

Three more from that list were fixed and shipped in `7e10f85`: the unmatched `is-upcoming` class
is gone, toggling Save no longer throws focus away — one lookup after the redraw covers the week,
both recipe lists and the open dialog — and `theme-color` follows the page for real, on the second
attempt (round three above). The missing week date-range line is back, in the week bar. The three
still open are the ones listed just above: Google Fonts, the `data-theme` stamp on a first visit,
and the storage key written twice.

**One open question, yours to call:**

- **The check scripts are still thrown away each session, and round three is the argument for
  stopping.** Three sessions have now written the same three throwaways — a stub DOM, a contrast
  measure, a static wiring sweep — and deleted all of them; 29 assertions this time. Two of round
  three's six findings were things a *committed* script would have failed on the day they were
  written, which is the case for `check.mjs` in one line. Against it: a test file in a repo whose
  constraints say no test framework. Still your call, still not done.

The `subgrid` fallback question is closed: the accordion that depended on it is gone, so nothing
in the app needs `subgrid` any more.

---

## Screenshots

None. There were two, of the Week view before the bold-consumer redesign, and you had them
deleted once they went stale rather than leave them misrepresenting the app. That is the standing
policy here — a screenshot of the wrong version is worse than no screenshot — and it has now been
applied three times. `Screenshots/` stays empty until a fresh set is taken; the old ones are
recoverable from git history if a before-and-after is ever wanted.

Worth capturing when it happens: the wide layout with its sidebar and summary column, a day with
all three meals filled, an empty day with its three dashed invitations, the narrow layout at
360px, the inline slot picker with **Add to Thu breakfast** on a card, the recipe dialog with its
icon tools, and every one of those in dark mode.

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

**One day at a time.** *Week* shows the seven days as a row of buttons and then the one day you
picked, as three meal cards. That's true on a laptop and on a phone — the same screen, not two
designs. A tinted date is a day you've already planned something for, so the row still shows the
shape of your week at a glance. On a wide screen there's a column down the right with the day's
numbers in it: how many meals you've planned, roughly how long they'll take, and one suggestion.

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
- One tile at the top carries the whole week: the date range with ← / → either side, and the
  seven days under it — weekday over date, the date in a circle. **Today** appears beside the
  range only once you've paged off the current week, which is the only time it has work to do
- **The selected day's date circle fills with the accent.** Today is marked with a dot, a day
  with something planned has a tinted circle, and a day gone by is quieter. So the row is the
  overview: where you are, what day it is, and the shape of the week
- Below it, the day's name and then **one card per meal**. A filled one shows the recipe, its
  time, and what it is (*10 min · Balanced · Vegetarian*), with a save star and a × to clear it.
  An empty one is a dashed **+ Add a dinner** the width of the card
- Each slot can be filled, replaced, or cleared. Past days stay editable, so you can log what
  you actually ate — they just read quieter
- **The same layout at every width.** There is no mobile version of the week: the seven-column
  accordion it replaced needed one, and keeping two in step is how they drift. Only below 400px
  does the day row wrap four and three, so every button clears 44px on a thumb
- It opens on today when today is in the week on screen, Monday otherwise, and resets that way
  whenever you move to another week — which day you were looking at isn't worth remembering

**The summary column** (wide screens only, down the right)
- *At a glance*: how many of the day's three meals are planned, with a bar; the total cooking
  time, which reads `0 min` rather than a dash on an empty day, because the dash looked like a
  rendering fault; and a one-word read on the balance, from the macro tag every recipe carries —
  nothing planned, one meal in, light on protein, protein-heavy, or a good balance
- *Tips for today*: one line, picked to fit the day in front of you rather than at random —
  it says something different about an empty day, a half-full one, a day of nothing but meat,
  and a day that adds up to two hours at the stove
- Both are computed from the day beside them, which is why they're dropped rather than stacked
  on a narrow screen: there is nothing in them you can't read off the meals themselves

**Adding a meal — two ways in**

*From the week.* Tap **+ Add** on an empty slot and the recipe list opens in the space below
your week. The day and meal are already known from the slot you tapped, so it never asks again:
the recipes appear as the same cards you get on the Recipes page — name, time, tags, and a
bookmark — except the button reads **Add to Thu breakfast** and fills the slot you tapped. Not
sure about one? Tap the card to read the full recipe — the sheet's calendar icon adds it straight
to the slot you came from, because the day and the meal are already settled and this app never
asks twice. Reading first costs you nothing. There's a search box in the panel, and Escape, the ×, or moving to
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
| `index.html` | The page shell: top bar, three `<section>` views, the week bar, the day's meal cards, the summary column, the inline slot picker, the view switch and two `<dialog>` panels. The switch sits at body level, not inside the top bar — a `backdrop-filter` ancestor becomes the containing block for anything `position: fixed` inside it, and that same element is what becomes the sidebar on a wide screen. Also an inline `<script>` in `<head>` that paints the stored theme before first paint |
| `style.css` | All styling. CSS custom properties for the palette, then three `max-width` breakpoints (1000px, 620px, 400px), one `min-width: 1001px` block for the sidebar layout, and a coarse-pointer block. Every media query sits at the end of the file, after the rules it overrides — a query adds no specificity, so a base rule below one beats it |
| `app.js` | The recipe catalogue, the app state, rendering, and one event handler |

**The data model** is the part worth understanding. Two things exist:

- `RECIPES` — the fixed catalogue, hardcoded. Never saved, never changes at runtime.
- `state` — everything about *you*: which view you're on, which week you're looking at, which day
  is showing (`focusDay`, the same at every width now), your plan, your bookmarks, your theme,
  your current search and filters, and whether the filter panel is open.
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
| Today is a dot, not a pill | The pill pushed the date onto a second line, which knocked that column out of alignment back when the days were columns |
| No boxes inside the meal card | Card border, then dashed slot boxes, then a filled pill inside that — three nested outlines to say one thing. A card border and one filled tile carry it |
| No day card around the meals | The `<h2>` above them already names the day, so a card holding three cards is a box that says nothing. The same reasoning that removed the nested slot boxes |
| Filter chips grouped and collapsible | Sixteen equal pills in one wrap is a tag dump, not a filter. Grouping says what each choice means; the count badge and **Clear all** show what's on |
| Recipe name is the headline in the add sheet | "Add to week" is the same on every recipe, so it's the one thing there that doesn't need 22px of type |
| The week's picker uses the Recipes card | It was a list of bare rows, so the same recipe looked like two different things in two places. One `cardHtml(recipe, slot)` now draws all three lists |
| The picker panel is a sunk tray | Cards on a panel of the same tone have no edge at all. The tray sits one step deeper than the cards it holds, which lifts them without adding shadows |
| The page is warm, the cards are near-white | Tried the other way twice. A tinted page behind near-white cards first failed at a 1.12:1 edge, so v1 of this palette put a heavy peach on every tile — which read as one cream wash the moment the cards got large enough to see, as your screenshots showed. Back to a warm page and light cards, this time with the separations measured: 1.19 page to card, 1.11–1.19 card to tile |
| Both directions of contrast get measured | Text against its ground needs 4.5; two surfaces that touch need about 1.10 or the edge is gone. Only checking the first is how a palette ends up legible and shapeless — dark `--accent-soft` sat at 1.03 against a card, making every + circle invisible while every text pair passed |
| Where surfaces must sit close, a hairline carries the edge | A past day is meant to recede into the page, so its fill can't also carry a 1.10 edge. The border does it, on the card and on the tile inside it |
| One day at every width, no accordion | Both mockups show one day. Seven columns gave each day ~150px, narrower than most recipe names, and the accordion that fixed that needed a whole second layout for narrow screens. One day needs neither, and deleting it took the rails, `expandAll`, the animated tracks and the `subgrid` sharing with it |
| The nav list is the sidebar | Over 1000px the docked pill unwinds into a vertical list in a left column. Building a separate sidebar would mean two nav lists to keep in step and two landmarks for one control; restyling the one that exists means neither |
| The view switch floats at the bottom on narrow | It is the one control used from every screen, and the top bar was carrying a wordmark, three tabs and a theme toggle. Docking it leaves the header quiet. On a wide screen there is a sidebar to put it in instead |
| The heading is fixed, not rotating | The rotating greeting was standing in for a date range that had gone missing. The week bar carries the range now, so the heading can just say what the screen is |
| The summary column is dropped on narrow, not stacked | Every figure in it is computed from the day beside it. Stacking it under the meals would repeat what is already on screen and push the meals up out of reach |
| Balance is one word off one tag | Every recipe carries exactly one macro tag, so counting them is the whole calculation. Anything finer would be nutrition advice this app is in no position to give |
| Tips are conditional, not random | A random line stops being read after the second time. One that notices the day is empty, or all meat, or two hours of cooking, is worth the four `if`s |
| No recipe photography | The mockups show a photo per meal. There is none in the catalogue, and fetching any breaks "static files, no API calls". The meta line carries the same job in text |
| Theme is saved, other view state is not | Which week or day you were on means nothing next session. A theme you chose does |
| Dialog actions are icons beside the close | Two full-width buttons above the ingredients pushed the recipe down the panel. As icons they sit in the chrome, where actions belong |
| A past day is quieter by colour, never by opacity | Dimming a control blends its text back towards the tile and undoes the palette the contrast figures were computed from. Different tokens keep the numbers |
| The recipe sheet fills the slot it came from | Dropping "Add to week" there was right — the day and meal are known — but dropping the add entirely left reading a recipe as a dead end. The icon fills the slot directly |
| The card's button changes, not the card | Recipes says "Add to week" and asks for a day; the picker says "Add to Thu breakfast" and doesn't. Same card, one different button |
| The day row wraps 4 + 3 under 400px | Seven across a 320px screen gives a 39px button, under the 44px floor — and the floor is width as well as height. Two rows keep every day tappable. 400px, not 620px, because at 401px seven chips still get 46px each: it first shipped wrapping from 620 and turned a week that fitted on one row into two rows of oversized buttons |
| The whole wide layout lives in one media block at the end of the file | A media query adds no specificity, so a wide rule written above the base rule it means to override loses on source order. The wide `.page` padding and toast offset were dead for exactly that reason, and nothing about the CSS looked wrong |
| `.page` carries an explicit `width: 100%` | Over 1000px it is a grid item, and a grid item with auto inline margins doesn't stretch to its track — the margins absorb the space and it shrink-to-fits. `margin: 0 auto` therefore sized the page to its own max-content and rendered the week at a third of its width. Reading the CSS twice missed it; one screenshot found it |
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

The bold-consumer round replaced all three files. Alongside your own passes in the browser after
each iteration: `node --check`, contrast computed rather than eyeballed, and 89 stub-DOM assertions —
68 during the build, 21 more added at review. Between them they covered the seven-column and
accordion renders, rail sides and count, that every column track is the same type so the width
animation can run at all, focus restoration on both the wide and narrow layouts, the expand-all
toggle and its relabelling, plan writes and clears, bookmarks, tag filters, theme persistence and
restore, the recipe dialog's two tool states, and the fill-slot route out of the inline picker.
Thrown away with the rest.

### The Concept A round

Merged to `main` as `7e10f85`. `node --check`, 29 stub-DOM assertions covering the week bar and its
Today button appearing only off the current week, the seven-day row and its single selection,
empty and filled meal cards, the meta line, the glance arithmetic and progress width, every shape
`balanceOf` and `tipFor` can return, plan writes and clears, the storage round-trip, focus
restoration after a clear, after a save toggle and after pressing Today, week paging, day
switching, the past-day class, and `theme-color` tracking `--bg` across three theme switches.
Static checks: every id the JS looks up exists in the HTML, all 106 emitted classes have a rule,
the `max-width` queries are still descending, no base rule is written below the first media query,
the storage key still matches in both places, and there are no ID selectors in the stylesheet.

The contrast script grew a distinction the convention had only made in prose: surface pairs that
touch bare must clear 1.10, while pairs deliberately closer than that are checked on the hairline
between them instead — the line against *both* sides, over 1.15. Four pairs looked like failures
until they were sorted that way; three were legitimate hairline-carried edges, and the fourth was
a real defect (dark `--surface-past` at 1.02 against the page).

Contrast is computed in **both directions** after the palette inversion, and the tokens are read
out of `style.css` so the script cannot drift from what ships: fourteen text pairs against a 4.5
floor — lowest 4.67, dark `--ink-faint` on a card — and eleven surface-against-surface edges
against about 1.10, which is the check the first attempt at a warm page failed. Two edges failed
here and were fixed rather than tolerated: dark `--accent-soft` at 1.03 against a card, and the
active sidebar pill at 1.05 against the page.

All of it thrown away with the rest — and worth saying plainly: none of these scripts caught the
layout rendering at a third of its width. A screenshot did.

### What has been seen, and what hasn't

**You check the app in a browser as you iterate** — wide desktop, the window dragged narrow, and
both themes. Earlier versions of this file claimed nobody had ever looked at the app; that was
wrong, and it is the thing to correct if it creeps back in.

**Through the Concept A round the looking was yours, not mine.** The browser tooling would not
connect while it was built, so every rendering anyone has seen is a screenshot you took. Round one
found six flaws, including a wide layout at a third of its width that two careful readings of the
CSS had missed. Round two confirms the fixes wide and in light mode. **Narrow and dark remain
unseen** — the wrap threshold moved in the fix commit and the dark past-day colour moved again
before the merge — so what this file says about them is
reasoning from the CSS, not observation.

Still genuinely unverified beyond that, in rough order of how likely it is to bite:

- **A real phone.** A dragged-narrow desktop window is not one. Every control is deliberately
  compact on a mouse and only returns to the 44px floor under `@media (pointer: coarse)`, so the
  entire touch-target story is untested by construction — a desktop browser never enters that
  block. Density and real thumb reach are unknown too.
- **Keyboard-only and screen reader.** Focus order, focus restoration after a redraw, and the
  accessible names on the day row and the meal cards have been asserted in a stub DOM and
  reasoned about, never driven. Every defect this project has shipped was in this category.
- **Contrast as a measurement.** The figures were computed, but several pairs sit within 0.2 of
  the 4.5 floor, which is closer than an eye can call.
- **Old browsers.** `color-mix` is load-bearing. `subgrid` no longer is — it went with the
  accordion, which closes one of the two open questions below.

Two rounds of reading found nine bugs between them, six of which a browser would have shown —
both dialogs rendering in the page at all times, the column animation never running, a frosted
halo that was the wrong shape, and the three fixed at review. Reading and looking each catch what
the other misses; this project now does both.

**The 44px floor now works differently, and the old note about it was stale.** It used to be one
exception — 38px week rows on a mouse. The redesign made compactness the general rule: on a fine
pointer the nav buttons are 28px, icon buttons and chips 30px, a filled meal row 34px. The
`@media (pointer: coarse)` block lifts all of them back to 44px on a finger. So a narrow *desktop*
window shows controls below the floor on purpose, and that is a pointer question, not a width one.

The catch is that this only holds for controls actually listed in that block, and a later rule
that outranks it on specificity silently breaks the floor — which has already happened once, to
the dialog's icon buttons. Worth re-checking against the block whenever a control is added.

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
| **Direction A shipped** | PR [#4](https://github.com/thelivinsine/meal-planner/pull/4) squash-merged to `main` as `49b3c16`. Pages build `built`. The branch was kept, not deleted, at your request |
| **Direction B closed** | PR [#5](https://github.com/thelivinsine/meal-planner/pull/5) closed and `design/app-shell` deleted. It conflicted with `main` the moment A merged — both proposals rewrote the same three files — and rebasing would have meant rewriting it. The table-shaped week is the part worth bringing back |
| **Docs corrected** | Several rounds of notes had hardened into "nobody has ever opened this app in a browser", which was simply false — you check it in a browser as you iterate, wide and narrow and in both themes. Corrected in both files. The real gap is narrower and more specific: a real phone, and a keyboard-only pass |
| **Mockups supplied** | You added three desktop concepts and three mobile ones, committed to `main` as `f58bf0f` under `Mockups/` — reference material, so no branch |
| **Concept A built** | Branch `sidebar-day-view`: Concept A's desktop layout with Concept C's right-hand column, and Concept C's mobile view minus its vertical timeline, as you asked. The seven-column accordion and everything holding it up came out — one day at a time is now the layout at every width. Three of the seven small things from the last review were fixed on the way past. **Not looked at in a browser by either of us** at this point: the Chrome tooling was unavailable, so the checks were reading, 19 stub-DOM assertions, computed contrast and static wiring only |
| **Screenshots found six flaws** | You opened it and shot it wide and narrow. The wide layout was rendering at a third of its width — `.page` had become a grid item, where `margin: 0 auto` stops it stretching and it shrink-to-fits to its own max-content. The `min-width: 1001px` block was also partly dead, sitting above the base rules it meant to override. Beyond those: the palette read as one cream wash, empty meal cards were 140px tall, the day row wrapped from 620px instead of 400px, and the nav pill landed on a tap target. All six fixed in `01239e8`, with the palette re-measured for surface separation as well as text contrast, and a new static check that fails if a base rule is ever written below the first media query. **The lesson worth keeping: reading the CSS twice found none of this. One screenshot found all of it.** |
| **Fixes confirmed wide** | A third screenshot shows the wide light layout right: main column about 2.8× the summary column and filling the width, warm page against near-white cards reading with hierarchy, and the derived panels correct on a full day — 3/3 planned, 37 min, *Protein-heavy*, with the all-protein tip firing. Narrow and dark are still unseen, and both changed in the fix commit |
| **Docs split from the feature** | At your request the documentation went straight to `main` — allowed, and the only thing that is — leaving PR #6 as a code-only diff. `main` therefore documented work still sitting on a branch, which is exactly what *Where things stand* is for. `CLAUDE.md` was also swept and cut from 197 lines to 173 against its own 150-line budget; what remains is conventions with their reasoning, each of which has cost a bug |
| **Reviewing the diff found six more** | Asked to review the PR's own diff before merging, and it turned up six things, three of them real: `theme-color` was only half-fixed — both tags hung off `prefers-color-scheme`, but the theme here is a *stored choice*, and the light value was still the pre-inversion `#ffffff`; the **Today** button dropped keyboard focus, because it is rendered only while off the current week and so deletes itself when pressed; and dark `--surface-past` was darker than the page at 1.02 against it, making a past day a hole rather than a receded card. Also: the stylesheet's only two ID selectors turned back into classes, two classes emitted with no CSS rule deleted, and `*.png` gitignored. **The lesson pairs with the screenshot one**: all six were invisible to the eye and visible to a script — a contrast number, a class with no rule, a focus target that no longer exists |
| **Concept A shipped, dark and narrow unseen** | PR #6 squash-merged to `main` as `7e10f85`, branch deleted, Pages build `built`. You opened the app locally before telling me to merge, so the layout was looked at — but not shot, so it is not in the record, and the dark past-day colour had changed since the one screenshot that is. Shipping ahead of a screenshot was your call and is recorded as such; *Where things stand* names it under **Shipped unseen** rather than letting it read as verified |

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
