# Where things stand

*The one doc that changes every session. Read it first; it is the only one here that goes stale.*

| | |
|---|---|
| **Live** | Code at `c648fad` (PR [#17](https://github.com/thelivinsine/meal-planner/pull/17), squash-merged). Pages `built` at `c648fad`, and the three live files were fetched back and checked for this round's markers — so the live app and `main` are the same commit, confirmed rather than assumed. https://thelivinsine.github.io/meal-planner/ |
| **Open work** | **No PRs open.** No known defect. Five things parked by choice: the theme button's hover, the accent-on-accent focus ring, the dark-mode token findings, the dialogs being off the spacing scale, and the week greeting (parked whole in a comment, restorable). **One new limit, named rather than fixed:** the narrow height budget does not hold under about 760px of viewport height — see *What is not verified* |
| **Confirmed** | **The narrow height budget**, headless at 360/390/412/500/619/800/1254px with `pointer: coarse` forced on for the phone numbers: **30.6% on a mouse, 34.9% on a finger**, against 69% before, and 400-433px of recipe list where there were 132px. 48 assertions across three throwaway probes — 20 narrow, 11 wide, 17 across the 620px crossing — plus six renders looked at, including dark mode and the wide layout as a regression. Before that: **storage, hard** — the real `loadState`/`saveState` against 26 cases in a Node VM and cross-tab behaviour in two real Chrome tabs over CDP, both probes failing against the unfixed code; the tools row at three widths and in dark mode; and **your eyes on the running app** across the card rounds. Still standing from PR #11: the picker replacing the day, the ring on a planned day, the 3px focus ring, the underline on all three grounds, and **the live site on a phone** |
| **Branches** | `narrow-list-first` deleted on merge. Two still on the remote, both safe to delete: `design/bold-consumer` (shipped as `49b3c16`) and `feat/slot-picker-and-indian-recipes`, fully contained in `main` since the second round |

## What just shipped

**PR #17, squash-merged as `c648fad`** — four commits, and Pages `built` at the same commit before
this file was touched.

### The list gets the screen, not the controls

**It started from one screenshot of the slot picker on a narrow window, with one and a bit recipe
cards on it.** The first thing built was a probe rather than a fix, and the answer was that no band
was wrong on its own:

| | |
|---|---|
| top bar | 53px |
| week bar (the day strip wrapping to two rows) | 149px |
| picker head (back link over a centred title) | 48px |
| tools row (search, then the toggles, then the filter dropdowns) | 195px |
| gaps and page padding | 95px |
| **above the list** | **540px — 69% of a 780px screen** |
| the recipe list it all steers | **132px** |

Recipes and Saved measured 51-56%. **A layout that has only ever been checked one band at a time
can be wrong in a way that no band is wrong** — that is the finding worth keeping, and the reason
the budget is now a number rather than a feeling.

Six changes, all under 620px, and two of them agreed with you before anything was built:

1. **The brand leaves the top bar for good.** It lives in the sidebar and only there, so under
   1000px the app is nameless and the bar carries **the way back** instead: out of the slot picker,
   or off Recipes and Saved to the week. One button, sharing the picker's `.slot-back` shape and one
   `data-action`.
2. **The picker's own back link goes out of the page at that width** — the bar's copy is the same
   control in a row that already exists — and the centred title gets the row to itself.
3. **The tools row stops wrapping.** The old comment's "a search box squeezed to 90px is not a
   search box" was never measured: the field is 135px on a mouse and 107px on a finger, so the
   *placeholder* is what gives instead — "Search recipes…" narrow, the long hint wide, with the
   `.sr-only` label unchanged for a screen reader.
4. **The filter dropdowns start shut.** The Meal preset is still ticked and the badge still reads
   `1`; the row is 66px and one tap away. **This contradicts a rule in `CLAUDE.md` on purpose** —
   over 620px the ticked box is still visible, which is what makes the short list explain itself.
5. **The day strip stops wrapping at 400px and starts at 360px.** Below.
6. **Four gaps step down one token**, all on the four-step scale.

### A breakpoint that was arithmetic, and wrong twice

The day row had wrapped to two rows below 400px since the Concept A round. The sum behind it was
computed against the **wide** page padding, so it fired about 40px early — and the corrected sum
was still wrong, because `.weekbar` carried 2px of its own padding either side: the browser said
43.4px where the arithmetic promised 44.0. The padding went, the breakpoint is `max-width: 359px`,
and a chip is exactly 44.0px at 360, which is the floor.

The cost had been invisible and constant: **every phone between 361 and 400px, a 390px iPhone
included, was drawing a second 54px row of day chips on a screen with the width for one.**

**A breakpoint derived from arithmetic has to be checked against the browser, because the
arithmetic is missing a padding somewhere.**

### A value that stopped being constant

**Reviewing the branch's own diff found the same class of bug as PR #15's prune, one layer up.**
The 620px line was read into a constant at start-up — right for a phone, wrong for the case the
whole round came from. A desktop window *dragged* narrow kept the wide defaults, so the filter row
stayed open, the long placeholder stayed put, and the chrome measured **41% instead of 30.6% at the
same 390px**. The screenshot that started this round was a dragged window.

A `change` listener on the same query fixes it, writing the row through `syncTools()` rather than
redrawing it, so a typed search and the ticked filters survive the crossing. **A value that was
constant because nothing could change it stops being constant the moment something can.**

### Two dead lines, and the path they were hiding

The same review found a `margin-right: auto` that does nothing (the theme button's own auto margin
already takes every spare pixel in the row) and a `target.blur()` the focus guard never needed.

Proving the second meant testing a route this branch had never touched: **Escape while the top
bar's back link holds focus**, which reaches `closeSlotPicker()` without passing the handler at
all. It restores focus to the `+ Add` that opened the picker — and it did so before the blur came
out, which is what showed the blur was doing nothing.

That back control is **the eighth place focus has to be put back**, and it is the conditional
control again for the third time — conditional on *two* things here, the state and the width.

### Three stale docs the sweep caught, none of them this branch's fault

- **`architecture.md` still said the storage listener needs no focus restoration** — the argument
  PR #16 disproved. This was its last surviving copy.
- **The focus-restoration count was six in `decisions.md`, seven in `CLAUDE.md` and
  `architecture.md`**, and the tools row was numbered as a *place* while being the one place that
  restores nothing. It is eight numbered places now, the storage listener among them, and the tools
  row has no number.
- **The README said the day row wraps below 400px.**

**A number written in four files drifts in three of them.**

`CLAUDE.md` is still at exactly 200 lines: two rules changed, one added, and the accessibility rule
about hiding focusable controls gained its one exception — a visible copy doing the same job, never
both at once. Paid for by compressing five rules whose reasoning was already in `decisions.md`.

## What is not verified

**A real phone.** Unchanged as a gap and sharper than it was: the difference between a mouse and a
finger in the narrow layout is 33px of controls, so the budget sits **4 points from its ceiling on
the pointer nobody here has tested with**. A headless run can force the `pointer: coarse` block on,
which is how those numbers were taken, and forcing it is not being on one.

**A real keyboard.** Still the oldest debt here, and this round added a control and took another
out of the page at one width. Focus was asserted in the DOM in both directions and on the Escape
route, never driven by a hand. Eight places restore focus; a person has driven none of them.

**Viewports under about 760px tall.** At 390x664 — a phone with browser chrome showing — the picker
is 41%, and it cannot be less while the week bar stays. The top bar, the week range row, the day
chips and the search field are all on the 44px touch floor, and that is 200px before a single gap.
**You cannot spend a touch floor**, so on a short screen something has to leave the page rather
than get smaller. Named in
[decisions.md](decisions.md#height-and-who-gets-the-screen) rather than fixed.

**The 621-1000px band was asserted, not looked at.** The app shows no name at all there now, and
Recipes has no back link (the nav pill is on screen, as before). That band is exactly where the
first cut of this round had *both* back controls visible at once — caught by a probe, not an eye.

**Whether an empty top bar reads right on the week view.** With the brand gone it holds one 32px
theme button. It matches what the wide layout has always done, and it is in the renders.

**Anything between 400 and 620px**, where the tools row has already collapsed to one line but the
cards have not gone single-column.

**Three or more tabs.** Nothing in the cross-tab mechanism cares how many there are, but only two
were ever driven.

## Next jobs, in the order they'd earn their place

1. **Finish the keyboard pass.** Five rounds at the top of this list, and the reason is bigger every
   time: eight places restore focus, one of them is conditional on the *width*, and no keyboard has
   driven any of it. Tab through the week, the picker with a dropdown open, both dialogs, and one
   filter menu end to end.
2. **A phone.** The 44px floor is arithmetic and a forced media block, and the narrow budget now
   depends on it.
3. **Decide about short screens.** Either accept 41% on a 664px viewport as the honest limit, or
   decide what leaves the page there — the week range row is the only candidate that is not a touch
   floor.
4. **Decide whether the spacing scale gets a check.** Unchanged: a rule writing `margin-bottom: 18px`
   is legal CSS and passes all 76 checks. Described in
   [architecture](architecture.md#how-this-gets-tested), deliberately not written, held by review.
5. **Put the dialogs on the spacing scale, or say why not.** Unchanged: `22px`, `20px`, `18px` and
   `14px` are still doing gap duty inside the sheets.
6. **Take a screenshot set.** Cheaper than ever and still none in the repo — this round produced six
   renders and kept none. `*.png` is gitignored and would need a deliberate `!Screenshots/**`
   exception. Your call.
7. **Act on the dark-mode findings, or decide not to.**
   [dark-mode-reference.md](dark-mode-reference.md#8-against-mises-current-dark-tokens) names two:
   nothing sits above `--surface`, so hover and selected have nowhere to go; and `--surface-sunk`
   is **1.08** from `--bg` in dark.
8. **Decide whether the week greeting comes back.** It is parked, not deleted, and the page is a
   good deal quieter without it — quieter still now the brand has gone from the bar above it.

## Three judgement calls left open

**The app has no name on screen under 1000px.** Deliberate, and it reads odder written down than it
looks: a phone app's name is on its home screen and in its tab title, not repeated above every
view. The row it used to occupy is doing more useful work. If it feels anonymous on the live site,
the fix is a name in the picker's row, not the return of the 53px bar.

**The week bar is centred while the meal cards are left-aligned.** Navigation on one axis, content
on another. The bar is the first thing on the page now, with nothing centred above it to justify
it — the call is more exposed than it was, not less.

**A past day with meals looks exactly like a past day without.** The deliberate cost of taking the
ring off past days, and only right if the week bar is for steering rather than for history.

## Three small things open, none urgent

- Google Fonts is the app's first external request; blocked or offline, you get the fallback stack.
  The one place the "static files only" constraint bends.
- `applyTheme()` always stamps `data-theme`, so a dark-OS user gets a light app on first visit
  despite `<meta name="color-scheme" content="light dark">`.
- **Three values are written twice** — the storage key, the `theme-color` fallback hex and the
  bookmark icon path. They cannot be de-duplicated without a build step, which this project does
  not have. `check.mjs` compares all three, so the duplication stays but drifting apart no longer
  goes unnoticed. Listed in [architecture](architecture.md#storage).

These are trade-offs rather than bugs. The known-defect list is empty, and empty **on the live app**
as well — Pages is `built` at the same commit as `main` and the served files were checked.

## Screenshots

**None of the app in the repo**, and the standing policy is unchanged: a shot of the wrong version
is worse than none, so stale ones get deleted rather than captioned. The four supplied design
concepts *are* tracked, under `Light mode Mockups/`; shots of the running app are not.

They are **reproducible on demand** — headless Chrome from the shell renders any state, and this
round drove it into the six that needed looking at: the narrow day view, the picker, the picker with
the filter row open, Recipes, the picker in dark mode, and the wide layout as a regression. Windows
will not open a window under about 500 CSS px, so anything narrower is rendered in an `<iframe>`
sized to the width, which gets its own viewport for media queries. Wanted, if a set is ever
committed: the wide layout, an empty day, the picker open, 360px, and dark mode.

`*.png`, `*.jpg` and `*.jpeg` are gitignored with `!Light mode Mockups/*.png` excepted, because a
camera-named file got committed twice. That exception once named a folder that had been renamed and
silently stopped protecting anything — the four concepts were deleted by a routine docs commit and
nobody noticed for two commits. It now names the folder that exists.

---

**Deeper background:** [architecture](architecture.md) · [decisions](decisions.md) · [log](log.md)
