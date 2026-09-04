# Where things stand

*The one doc that changes every session. Read it first; it is the only one here that goes stale.*

| | |
|---|---|
| **Live** | Code at `212ddd3` (PR [#16](https://github.com/thelivinsine/meal-planner/pull/16), squash-merged). Pages `built` at `212ddd3`, so the live app and `main` are the same commit. https://thelivinsine.github.io/meal-planner/ |
| **Open work** | **No PRs open — #14, #15 and #16 are all merged.** Reviewing #15 turned up two bugs in it: the four-week prune counted back from the week on screen (fixed inside #15, squashed into `98afb27`), and the listener dropped a background tab's keyboard focus on the floor (PR #16). Both below. No known defect. Five things parked by choice: the theme button's hover, the accent-on-accent focus ring, the dark-mode token findings, the dialogs being off the spacing scale, and the week greeting (parked whole in a comment, restorable) |
| **Confirmed** | **Storage, hard**: the real `loadState`/`saveState` against 26 cases in a Node VM (sixteen kinds of corrupt blob, the four-week prune, a full quota, storage blocked outright), and cross-tab behaviour in **two real Chrome tabs over CDP** — nine assertions, and both probes fail against the unfixed code. Before that: the tools row at 1254 / 760 / 360px **and in dark mode**, headless, driving the real controls and reading numbers back — plus **your eyes on the running app** for three rounds of card notes. Still standing from PR #11: the picker replacing the day, the ring on a planned day, the 3px focus ring, the underline on all three grounds, and **the live site on a phone** |
| **Branches** | `cross-tab-sync` and `week-grid-comment-parked` both deleted on merge, along with `search-filter-view-toolbar` before them. Two more on the remote, both safe to delete: `design/bold-consumer` (shipped as `49b3c16`) and `feat/slot-picker-and-indian-recipes`, which is fully contained in `main` and has been since the second round |

## What just shipped

**PR #14, PR #15 and PR #16, squash-merged in that order** as `8626bd0`, `98afb27` and `212ddd3`.
Pages was confirmed `built` at `212ddd3` before this file was touched, so the live app and `main`
are the same commit for the first time in four rounds.

### A seventh place focus has to be put back (PR #16)

**The storage listener shipped with a comment explaining why it needed no focus handling, and the
comment was wrong.** The argument: the event only ever arrives in a tab the user is *not* in — they
are in the tab that did the saving — so there is nothing live to restore.

That confuses the user's **attention** with the **DOM**. `document.activeElement` is per-document
and survives the tab going to the background: it is whatever they tabbed to before switching away.
`render()` replaces whole `innerHTML`, so it falls to `<body>` and they come back to a tab that has
forgotten where they were. **The seventh instance of the one defect class this project keeps
shipping — and the first one argued away in a comment rather than missed.**

The fix is the same move as the other six: find what replaced the control and focus it. Here it
could be *any* control on the page, so it is looked up by its own `data-*` attributes rather than
by name — every delegated control carries `data-action` plus whatever identifies it, so the element
is already its own selector. Two guards do the real work: it runs **only if focus actually fell to
`<body>`**, because the tools row is never redrawn and a caret half way through a search must be
left alone; and the scope ladder is the bookmark handler's, because the day the picker replaced is
still in the DOM with hidden controls of its own.

Headless, with a real `StorageEvent` at the running app and the fix stashed out as a control: a day
chip, a meal card's **+ Add** and a card inside the open slot picker all keep focus with the fix and
all land on `<body>` without it, the search box is untouched either way, and `scrollY` stays 0.

### The review fix (inside PR #15)

**Reviewing #15 before the merge found a data-loss bug in #15.** `loadState()` took its four-week
prune cutoff from `state.weekStart`. That is today's Monday at start-up — the only time the
function ran before this round — and a *different* date the moment you page the week forward. Add
a `storage` listener that calls `loadState()` again and the cutoff starts moving with the view.

Tab B parked six weeks ahead, tab A plans a meal in the current week: the event lands, the prune
drops every current-week entry out of tab B's memory, and tab B's next save writes the gap back to
storage. **The exact loss the listener was added to stop, through a different door.**

The cutoff now counts back from today. At start-up the two expressions give the same date, so
nothing else moved. Proven against the real functions in a Node VM, with the unfixed code as a
negative control, plus a headless Chrome run dispatching a real `StorageEvent` at the app — the
other tab's meal appeared, the theme followed, the tools row survived, no console errors, and a
`localStorage.clear()` elsewhere left the plan alone.

**The lesson is the one this file keeps writing down:** a value that was constant because a
function ran once stops being constant the moment something calls it twice.

**And the round's second lesson:** both of #15's bugs were in the *reasoning written beside the
code*, not in the code. One comment said the cutoff was fine and one said focus was fine. Neither
was checked, and neither could be — a comment passes every script here.

### The storage round (PR #15)

**The question was "does `localStorage` work well?" and the answer was yes — which is why the
round is worth recording.** The saving code was already sound: try/catch on both the read *and*
the write, `JSON.parse` guarded separately, every value re-validated on load against the recipe
catalogue and a date pattern, a four-week prune, a toast on a full quota, and all six mutation
sites paired with a `saveState()`. Twenty-six cases against the real functions confirmed it,
including sixteen kinds of corrupt blob. Nothing inside it needed changing.

**The hole was one level up, between tabs.** Each tab holds its own `state` and `saveState()`
writes the *whole* blob, so with two tabs open the one that saved second replaced whatever the
first had added — plan a Monday dinner in tab A, bookmark a recipe in tab B, and the dinner was
gone. Silently, and with tab A still showing it until you reloaded.

A `storage` listener now re-reads on any write from another tab. **That is what stops the loss,
not just the divergence:** once tab B's copy is current, tab B's next save carries tab A's meal
along with it. `loadState()` also replaces the plan and bookmarks instead of merging into them,
which is what lets a *deletion* reach the other tab — with the reset placed past every early
return, so a corrupt blob still cannot wipe a plan that is on screen.

**Eight lines of code, and the rest of the round was proving it.** Two throwaway probes, neither
committed: the real `loadState`/`saveState` in a Node `vm`, and two real Chrome tabs driven over
CDP, which is the only way to see a `storage` event at all. Both were run against the unfixed code
first and both fail there — the browser one on four assertions including the clobber itself.
Covered in [log.md](log.md#the-storage-round-pr-15).

**It shipped with no focus restoration in the listener, and that was wrong — fixed in PR #16.**
The argument was that the event only arrives in a tab the user is *not* in, so there is nothing live
to put back. That confuses the user's attention with the DOM: a background tab keeps its
`activeElement`, and the redraw drops it to `<body>`. See *A seventh place focus has to be put back*
below.

### The docs-maintenance round (no PR)

**One docs-only round and no code.** Every figure in the nine markdown files was
re-derived from `app.js` rather than trusted, three stale facts in this file were corrected (the
Pages commit, the branch row, a heading that counted three bugs over a list of six), and
`CLAUDE.md` came back from 229 lines to 200 with all 55 rules intact — the reasoning moved to
[decisions.md](decisions.md), which is where it was already written. Details in
[log.md](log.md#the-docs-maintenance-round-no-pr).

The sweep also turned up one thing that is *not* documentation: `style.css` still described the
week's parked heading in the present tense and still carried `.view-week > .view-head`, a rule the
live page matches with 0 elements. That became PR #14, merged as `8626bd0` — the same present-tense-comment defect the PR
#13 review caught in `index.html`, one file over, which is worth noting: **a parked feature leaves
its story in more than one file, and the sweep after it only swept one of them.**

**PR #13: one tools row — search, layout, filters — on Recipes, on Saved, and in the week's slot
picker.** Four commits and a review pass.

**It started as a defect.** Tapping **+ Add** on a breakfast slot showed all fifty recipes. The
slot already knows which meal it is, so the list now arrives filtered to it — 14 breakfasts, 17
lunches, 19 dinners — and it arrives *visibly*: a ticked box in the **Meal** dropdown with the
filter row open, so the short list explains itself and anyone who wants a breakfast at dinner can
untick it.

**Fixing that forced the matcher's semantics, which is the one change a user of the old Recipes
page would notice.** Filters were a single flat OR over every ticked tag. Asking for a vegan
breakfast returned every vegan dinner too, because *breakfast* and *vegan* were alternatives rather
than conditions — so the meal preset stopped meaning anything the moment a second box was ticked.
It is now **OR within a group, AND across groups**: two macro boxes still means either macro.
Measured: breakfast 14, + vegan 5, + vegetarian 12.

**The row itself is one component in three places** — `toolsHtml(name)` into `#tools-recipes`,
`#tools-saved` and `#tools-slot`, the same move as `cardHtml(recipe, slot)`. Five labelled stacks
of chips became one row 30px tall, five dropdowns of checkboxes with a count badge each. Search
text and ticked tags are **per list** (`surface`); the tile/list layout is **one preference**
(`state.cardView`), shared by all three and persisted with the theme.

**And it is the only component in the app that is never redrawn.** `syncTools()` writes the ticked
boxes, the badges, the pressed layout button and the field's value in place. A redraw would shut
whichever `<details>` was open under your finger and move the caret to the end of the search box on
every keystroke — neither of which any check here can see, and both of which are certain. That
makes it a seventh answer to "a redraw destroys focus": **don't redraw**.

Then three rounds of your notes on the cards, in order:

| | Before | After |
|---|---|---|
| Tags on a card | up to 6, wrapping | **3**, and never `quick` |
| The minutes | a `--surface-sunk` pill, same as a tag | **bare text** |
| Card name / tag type | 17px / 9px | **15px / 8px** |
| Card height, tile | 186px | **136px** |
| Card height, list | 85px | **62px** |
| Minutes in list layout | 469, 429, 535px across one list | **442px on every row**, midline level with the tags |
| Week view headings | greeting + day title | **none visible** |

**The alignment bug had two causes and one symptom.** `align-items: flex-start` aligned the
*boxes*, so 11px minutes floated above the top of a 15px name that had wrapped to two lines; and in
list layout `flex: 1` with `space-between` put the number wherever each name happened to end.
Baseline alignment fixes the first, a fixed 40% name column the second — with a 178px floor under
that 40%, because in the slot picker the content column is ~400px wide and a plain percentage
squeezed "Overnight Oats with Berries" into three lines.

**Two headings left the page and neither was deleted.** The rotating week greeting is parked whole
in a comment where it stood, with the `el` entry, the start-up line and the grid rule it needs
written beside it; `WEEK_GREETINGS` is still in `app.js`, unread. The day title is `.sr-only` — it
repeated the week bar for anyone who could see the week bar, and it is the only name those three
meal cards have for anyone who cannot. Both surviving grid items in `.view-week` had to be told
they are in **row 1**: left in row 2 the grid charges a `--space-4` row gap for the empty row above
them.

**A past day lost its ring.** With meals logged on Monday and Tuesday, the two loudest marks on the
week bar were the two days you cannot act on. It is colour alone now, name and date both at
`--ink-faint`. The cost is accepted: a past day with meals looks like a past day without.

### 76 checks, unchanged — and this round that is the finding

A search field, a layout toggle, five dropdowns and a menu of sixteen checkboxes went into three
views and the pair list did not grow by one. Every ground was already measured: the menu is
`--surface` inside a `--surface` card with a `--line-strong` hairline, a summary chip is
`--surface-sunk` with `--ink-soft`, an option hovers to `--surface-sunk` with `--ink`, the pressed
layout button is the `--accent-soft` wash with `--accent-ink` on it, the badge is `--on-accent` on
`--accent`. **Reusing a ground costs nothing; moving a token onto a new one is what makes a pair.**

`--line-strong` beside `--bg` now has no live consumer at all — `.chip` sits on a dialog and
`.filter-summary` sits on the tools card. It stays in the list as the guard for the next thing that
lands on the page.

### The bugs this round caused and this round found

- **`.card-tags` carried `flex: none` in list layout**, so in the slot picker's narrow column three
  tags ran under the foot of buttons and the card's own `overflow: hidden` sliced the last one in
  half. Caught in a render — no script would have seen it.
- **The dropdown menu ran 2px off the right edge at 360px.** Caught by asking the live page for
  `getBoundingClientRect().right` on all five menus at three widths. Fixed by making the open group
  stop floating under 620px rather than by shaving 2px.
- **Reviewing the diff before merging found four more**, all written by this branch, none
  behavioural: both empty states still blamed "that search" when there are filters now, a comment
  described two rules the branch had deleted, another said "six groups" where there are five, and
  the parked greeting comment still spoke in the present tense. That is the fourth round in a row
  where reading the branch's own diff found something using the app had not.

## What is not verified

**A real keyboard.** Unchanged as a gap and worse as a debt, because this round added the largest
cluster of focusable controls in the app — three search fields, six buttons, five `<summary>`
disclosures, sixteen checkboxes — and wrote two rules *for* the keyboard that no keyboard has
driven: the Escape order (dialog, then dropdown, then picker) and the never-redraw rule that keeps
focus on a ticked box. Every interaction this round was `.click()` from a script.

**A real phone.** `pointer: coarse` lifts `.filter-summary` and `.filter-opt` to the 44px floor and
both are named in that block, so the arithmetic is right. A 15px checkbox inside a 44px row is
still the thing a thumb has to hit, and 360px was an `<iframe>` — a viewport, not a device.

**Anything between 400 and 620px**, where the tools row has already wrapped but the cards have not
gone single-column.

**The storage round was never looked at.** No CSS, no markup, no layout — the only visual
consequence is a background tab redrawing itself, and that is asserted in the DOM rather than seen.
Worth thirty seconds with two windows side by side before merging #15. Nor was it tabbed through,
though it adds no focusable control.

**Three or more tabs.** Nothing in the mechanism cares how many there are, but only two were driven.

**The week view now has no visible heading at all.** Deliberate, seen in two headless renders, and
the kind of thing that reads differently on a phone.

## Next jobs, in the order they'd earn their place

1. **Finish the keyboard pass.** It has been next on this list for four rounds and the reason to do
   it is now three times what it was: focus restoration is asserted in seven places and driven by a
   person in none, and the tools row adds an Escape ordering and a "don't redraw" claim on top.
   Tab through the week, the picker with a dropdown open, both dialogs, and one filter menu end to
   end.
2. **A phone.** Same list, and the 44px floor is genuinely untested on the new controls.
3. **Decide whether the spacing scale gets a check.** Unchanged from last round: a rule writing
   `margin-bottom: 18px` is legal CSS and passes all 76 checks. Described in
   [architecture](architecture.md#how-this-gets-tested), deliberately not written, held by review.
4. **Put the dialogs on the spacing scale, or say why not.** Unchanged: `22px`, `20px`, `18px` and
   `14px` are still doing gap duty inside the sheets.
5. **Take a screenshot set.** Cheaper than ever and still none in the repo — this round produced
   about fifteen renders and kept none. `*.png` is gitignored and would need a deliberate
   `!Screenshots/**` exception. Your call.
6. **Act on the dark-mode findings, or decide not to.**
   [dark-mode-reference.md](dark-mode-reference.md#8-against-mises-current-dark-tokens) names two:
   nothing sits above `--surface`, so hover and selected have nowhere to go; and `--surface-sunk`
   is **1.08** from `--bg` in dark. One of its examples has quietly gone away — the time pill is
   bare text now, which sidesteps that question rather than answering it.
7. **Decide whether the week greeting comes back.** It is parked, not deleted, and the page is a
   good deal quieter without it. Worth looking at the week view fresh in a week and deciding on
   purpose rather than by neglect.

## Two judgement calls left open

**The week bar is centred while the meal cards are left-aligned.** Navigation on one axis, content
on another. This round removed the two headings that used to sit above the bar, so the bar is now
the first thing on the page and there is nothing centred above it to justify it — the call is more
exposed than it was, not less.

**A past day with meals looks exactly like a past day without.** That is the deliberate cost of
taking the ring off past days, and it is only right if the week bar is for steering rather than for
history. If you find yourself wanting to see what you ate last Monday *from the bar*, this was the
wrong trade.

## Three small things open, none urgent

- Google Fonts is the app's first external request; blocked or offline, you get the fallback stack.
  The one place the "static files only" constraint bends.
- `applyTheme()` always stamps `data-theme`, so a dark-OS user gets a light app on first visit
  despite `<meta name="color-scheme" content="light dark">`.
- **Three values are written twice** — the storage key, the `theme-color` fallback hex and the
  bookmark icon path. They cannot be de-duplicated without a build step, which this project does
  not have. `check.mjs` compares all three, so the duplication stays but drifting apart no longer
  goes unnoticed. Listed in [architecture](architecture.md#storage).

These are trade-offs rather than bugs. The known-defect list is empty, and now empty **on the
live app** as well — both PRs are merged and Pages is `built` at the same commit as `main`.

## Screenshots

**None of the app in the repo**, and the standing policy is unchanged: a shot of the wrong version
is worse than none, so stale ones get deleted rather than captioned. The four supplied design
concepts *are* tracked, under `Light mode Mockups/`; shots of the running app are not.

They are **reproducible on demand** — headless Chrome from the shell renders any state, and this
round drove it into the states that needed looking at (a dropdown open, list layout, the picker
filtered to lunch, a meal planted on a past day so the past-and-planned chip existed at all).
Wanted, if a set is ever committed: the wide layout, an empty day, the picker open, 360px, and dark
mode.

`*.png`, `*.jpg` and `*.jpeg` are gitignored with `!Light mode Mockups/*.png` excepted, because a
camera-named file got committed twice. That exception once named a folder that had been renamed and
silently stopped protecting anything — the four concepts were deleted by a routine docs commit and
nobody noticed for two commits. It now names the folder that exists.

---

**Deeper background:** [architecture](architecture.md) · [decisions](decisions.md) · [log](log.md)
