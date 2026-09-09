# Where things stand

*The one doc that changes every session. Read it first; it is the only one here that goes stale.*

| | |
|---|---|
| **Live** | **The app is `f55a6d7`** — PR [#26](https://github.com/thelivinsine/meal-planner/pull/26), squash-merged. Pages reported `built` at `f55a6d7`, and **all four served files were fetched back and compared against `main` byte for byte** — identical once line endings are normalised. Both deployed pages were then rendered and looked at: the landing page at 1280px, and the app's sidebar showing the wordmark unchanged at rest. The live markup reads back `class="brand brand-side" href="landing.html"`, and `landing.html` returns **200**. https://thelivinsine.github.io/meal-planner/landing.html <br><br>*Note on the rig:* `style.css` needed `curl --http1.1` to fetch — HTTP/2 reset the connection three times on that one file. A transport hiccup, not a deploy problem; the other three came over unaided. <br><br>*Previously:* **The app is `a4be1c9`** — PR [#25](https://github.com/thelivinsine/meal-planner/pull/25), squash-merged. Pages reported `built` at `a4be1c9`, all three served files were fetched back and compared against `main` **byte for byte** (identical once line endings are normalised), and the deployed page was rendered and looked at — **and, for the first time, *scripted*:** the live *Recipes* view was reached, switched to the list layout, toggled to dark and asked for its computed values. That closes the rig limit recorded below. It reads back `order=Filters@264 view-toggle@355 search@427`, the pressed layout button at `rgb(200,73,31)` with a transparent border, and the card ring at `solid 2px rgb(200,73,31)` light / `rgb(255,122,79)` dark. https://thelivinsine.github.io/meal-planner/ <br><br>*Previously:* **The app is `1b07bb0`** — PR [#24](https://github.com/thelivinsine/meal-planner/pull/24), squash-merged. Pages reported `built` at `1b07bb0`, all three served files were fetched back and compared against `main` **byte for byte** (identical once line endings are normalised), and the deployed page was rendered and looked at — the week view, which is the one the live rig can reach unaided. https://thelivinsine.github.io/meal-planner/ <br><br>*Previously:* **`51ae81f`** — PR [#23](https://github.com/thelivinsine/meal-planner/pull/23), squash-merged. Pages reported `built` at `51ae81f`, all three served files were fetched back and compared against `main` **byte for byte** (identical once line endings are normalised), and the deployed page was then rendered with the filter row and a dropdown open and looked at. https://thelivinsine.github.io/meal-planner/ |
| **Open work** | **No PRs open.** No known defect. **`landing-ui-engineering` is the other half of the skill comparison and is deliberately unmerged** — two commits, local only, never pushed. It holds the same editorial page built to a different skill's checklist; delete it when the comparison stops being interesting. **Carried forward from last round, untouched:** the search field has no `max-width`, so at 1440px it is about 1120px of input — the lever is `flex: 0 1 480px` on `.search`; the dialogs' quiet focus-restore is still reasoned rather than driven end to end (**open a recipe with the mouse and press Escape** settles it); and the caret rotation is still unreadable by script. **New and unverified this round:** nobody has clicked the wordmark or hovered anything in a real browser — the link is measured, not driven — and nothing has been checked in Safari or Firefox, where `text-wrap: balance` and `color-mix()` in the landing headline are the two things most likely to differ. **One doc gap, not caused by this round:** `log.md`'s *what each round actually checked* section jumps from PRs #20/#22 to #26 — **#23, #24 and #25 were never written up there**, and their coverage lives only in this file's rolling *Confirmed* row. Worth backfilling before those entries roll off. **Named limits carried forward:** `--surface-past` has almost nothing left on a near-white page; `--hover`/`--rail` are pinned within one shade with `--accent-ink` on `--hover` at **4.54** against a 4.5 floor; and the narrow height budget does not hold under about 760px of viewport height. |
| **Confirmed** | **This round: `node check.mjs` at 144 checks, up from 140** — and the four new ones are the reason the landing page is allowed to duplicate the palette at all. `check.mjs` now reads `landing.html` and compares its storage key, its `theme-color` fallback and **every token it declares, name by name, in both themes** (12 per theme). **Two rounds of checking found twelve defects and only one of them was visible in a screenshot.** Tabbing the page found five: `:focus-visible` written per component, so **five of seven focusables took Chrome's 1px default**; a `.day:focus-visible` styling a `<div>` that is never focusable; `aria-label` on a roleless `<div>`, which announces nothing; the wordmark as the `h1` with the real headline an `h2`; and then the heading fix broke the masthead, because `.masthead p` outranked `.brand` on the `<p>` that replaced the `<h1>` — the only one a render caught. `/code-review` at high effort found seven more, both mediums measured in Chrome: **`:focus-visible`'s `border-radius: 4px` sat below `.btn`'s `999px` at equal specificity and squared the CTA pill off on focus**, and **`.meal:first-of-type` matched nothing** because every child of `.week` is a `div`. The rest were facts on the page that were false — two mock recipes that do not exist, `paneer` and `lentils` tagged on nothing, "3 files" falsified by the diff itself, and a ring on a day gone by — plus `01/02/03` numerals at **1.47:1** from `--accent` at `opacity: .28`, words wearing `--accent` instead of `--accent-ink`, `prefers-reduced-motion` covering only the load-in, and no `pointer: coarse` block at all. **Two of the fixes were themselves broken, and only measuring caught them:** `var(--tap)` is not declared in `landing.html`, so the whole `min-height` was invalid and dropped (link rows stayed 20px on a coarse pointer), and the new `theme-color` line read `--bg` from a `<style>` block that comes *after* it, writing an empty string. **Re-measured after all of it:** CTA radius `999px` at rest *and* on focus; all seven focusables `solid 2px rgb(200,73,31)`; `under44=none` on a coarse pointer; `theme-color` `#faf8f4` light and `#1a1a1a` dark; the brand link `207x27` fine and `207x44` coarse, and at 390px `display: none` with focus falling to `<body>` and absent from all 16 tabbables; no horizontal overflow at 1440/1024/768/390/375/320. <br><br>*Previously:* **This round: `node check.mjs` at 140 checks, up from 136** — and the four are not this round's colours, they are two pairs the script had never had. Chasing a comment the review said was wrong (`.meal-add:hover` washes accent-soft onto a *card*, not the page) found the "+" circle on an empty meal sitting on `--surface-past` on a day gone by, with `--accent-soft` beside it at **1.13 / 1.25** and `--accent` at **4.55 / 6.10**. Both pass, so it is a guard rather than a fix. **Rendered and looked at, seven:** Recipes tiles at 1280px light, the list light and dark with a card focused, the row after the button swap, and three on the deployed site — Recipes light, Recipes list dark with a card focused, and the week. **Measured rather than rendered, which is the whole of this round:** `matches(':focus-visible')` after every handoff — mouse gives `false` on the bookmark, day-chip and clear-slot paths, keyboard gives `true` on all of them — and **seventeen focusables focused the way a Tab does, every one reading `solid 2px rgb(200,73,31)`** except the search input, which is `outline: none` by design. Row order and tab order read off the DOM (`filters-toggle → tile → list → input`), 39px with no wrap at 1280px *and* at 360px, and the search field at **167px at 360px — the same number recorded before the previous reorder**, so flex distribution did not move and no touch target changed. A functional pass with **no console errors**: layout toggle both ways, the slot picker opening with focus on the panel and its `Meal` badge at 1, a meal added and cleared. **One rig trap walked into again, and it was already written down four sections below:** under `--virtual-time-budget` a colour transition started by a *click* never advances in the CSSOM, so `getComputedStyle` keeps reporting the pre-toggle value while the paint shows the final one — a theme toggled by clicking read back `--ink: #f5f3f1` on `:root` but `#191310` on a card name, and twenty minutes went on chasing a palette bug that was not there. Seeding `localStorage` with `theme: 'dark'` and reloading gives the honest numbers (`#f5f3f1` / `#1a1a1a` / `#2b2b2b`) and is now the recorded way round it. **Not a new finding — a note that was read too late**, which is the more useful thing to record about it <br><br>*Previously:* **This round: `node check.mjs` at 136 checks, unchanged** — nothing in the diff touches a token, which is the point. **Rendered and looked at, six:** Recipes tiles at **1440px**, **1280px** and **1100px** (the three widths where the row's right end is visible), the list at **700px**, **390x664** through the iframe rig, and the deployed site. **Measured rather than rendered**, and again the half that found the defect: the search input comes out **427px at 620px and 167px at 360px, identical before and after** the reorder — flex distribution does not depend on order — while at 1440px the *row* ended 481px short of the grid above it, which no narrow screenshot could show. A functional pass at 1254px and 390px with the slot picker open: panel keeps focus on open, `Meal` badge still 1, one tool row at 39px with no wrap, no page scroll, **no console errors**. <br><br>*Previously:* **`node check.mjs` at 136 checks, up from 127**, and the additions are all one sentence — a control that was on a card is on the page now. **Rendered and looked at, eight:** Recipes tiles at 1280px light with the row shut, the same with the row and a dropdown open, dark at 1280px with a dropdown open, the slot picker wide, the slot picker at 390px, the list layout at 700px with the row open, the focus-ring shot, and the deployed site. **Measured rather than rendered**, which is again the half that caught things: the narrow height budget went from the **41%** recorded below to **45.5%** at 390x664 with `pointer: coarse` forced on (50.5% on a mouse); the touch floor holds at 390px (search 155x44, each layout button 44x44, Filters 105x44, a summary 80x44, Clear 52x44); nine controls tabbed end to end with a 3px `rgb(200,73,31)` ring on every one; and a functional pass with **no console errors** — shut by default on all three lists, `aria-expanded` flipping, `indian` giving 27 of 50, badge 1, Clear back to 50, the row surviving a view switch, the picker opening shut with badge 1, and a meal added. |
| **Branches** | `landing-frontend-design` deleted on merge. **`landing-ui-engineering` is still here, local only and unpushed** — the same landing page built with `/agent-skills:frontend-ui-engineering` instead, kept as the other half of the comparison. Before it: `quieter-focus-ring`, `filters-button-left`, `tools-row-untiled`, `tag-contrast` and `page-white-rail`, all deleted on merge; `accent-tags` deleted with the PR that was dropped. Two still on the remote, both safe to delete: `design/bold-consumer` (shipped as `49b3c16`) and `feat/slot-picker-and-indian-recipes`, fully contained in `main`. |

## What just shipped

**One PR, `#26`: a landing page that started as a plugin test, the wordmark turned into the only
route to it, and twelve defects found by two kinds of checking that a screenshot could not do.**

### It began as a comparison of two skills, not as a feature

Two branches, the same brief, a different frontend-design skill on each: `/frontend-design` on
`landing-frontend-design` and `/agent-skills:frontend-ui-engineering` on `landing-ui-engineering`.
The first round gave them different *directions* as well as different skills, which made the
comparison useless, so the second round put the same editorial direction on both. `A` was chosen
and merged; `B` stays local and unpushed.

**What separated them, once the look was held constant:** `/frontend-design` argued for a committed
aesthetic and said nothing about structure — it produced the better-looking page and left the
wordmark as the `h1`, sizes picked per rule, and gaps off the spacing scale.
`/agent-skills:frontend-ui-engineering` is a checklist with no art direction — it needed the
aesthetic handed to it, then enforced a type scale, heading ranks, `.sr-only` text behind every
colour-only signal, and a coarse-pointer block. Neither found a single one of the twelve defects
below; both were found by tabbing and by review.

### The page

Editorial "mise en place": hairline rules instead of tiles, an oversized Bricolage headline with
hand-set line breaks, `01/02/03` over the method, a mock week strip as the hero art, paper grain,
one staggered load-in behind `prefers-reduced-motion`.

**Self-contained, and the palette copied rather than imported.** Linking `style.css` was rejected on
**class collisions, not weight** — `.page`, `.brand`, `.day`, `.btn` and `.card` all exist in both
files with different meanings. Extracting a shared `tokens.css` is the honest fix and is still
available; it was rejected for now as more moving parts than the duplication removes. So the
duplication is measured instead, which is where the four new checks come from.

### The wordmark link, and the exception it needed

`.brand-side` becomes an `<a href="landing.html">` with a `.sr-only` suffix, so the accessible name
is "Mise · about this app" rather than the name it already is.

It exists **over 1000px only**, because `.brand-side` is `display: none` under that — the app is
nameless on a phone. That collides with *a control may go `display: none` only where a visible copy
does the same job*, and three options were put up before one was taken: a fourth item in the docked
pill (already tight at 360px), a second way back in the top bar (which under 620px is carrying one
already), or **the link alone with no route on a phone**. The last was chosen.

What makes it defensible is measured, not argued: at 390px `focus()` leaves `activeElement` on
`<body>` and the element is absent from all 16 tabbables, so nothing is hidden-but-focusable —
which is the failure that rule guards. What is lost is a route, and the landing page is where you
arrive from rather than somewhere the app needs to send you.

`a.brand-side` also joined the `pointer: coarse` block. It was a `<p>`, so no touch floor applied to
it; as a link it owes one, and a tablet over 1000px is a coarse pointer at a width where the
sidebar exists. **207x27 fine, 207x44 coarse.**

### Twelve defects, and only one a screenshot could see

The split is the whole lesson of the round. **Tabbing found five**, including `:focus-visible`
written per component so that five of seven focusables took Chrome's 1px default — the state
CLAUDE.md already says neither a script nor a screenshot can see. **The review found seven more**,
both mediums verified in Chrome: `:focus-visible`'s `border-radius: 4px` sat *below* `.btn`'s
`999px` at equal specificity and squared the CTA pill off on focus, and `.meal:first-of-type`
matched nothing because every child of `.week` is a `div`.

The rest were **facts on the page that were false**: two of three mock recipes did not exist and the
third was misnamed, `paneer` and `lentils` are tagged on no recipe, "3 files: one HTML, one CSS, one
JS" was falsified by the diff that shipped it, and the week mock rang the 8th while the 9th was
today — a ring on a day gone by, the one thing the week bar is forbidden to do.

**Then two of the fixes were themselves broken**, and again only measuring caught it: `var(--tap)`
is not declared in `landing.html`, so the entire `min-height` declaration was invalid and dropped
and the link rows stayed 20px; and the new `theme-color` line read `--bg` from a `<style>` block
that comes *after* the script, writing an empty string. `index.html` gets away with the same shape
only because its stylesheet is a `<link>` above the script.

### `check.mjs`, 140 → 144

The finding with the longest tail was that the script measured none of this. `p5:mealplanner` now
lives in three files and the palette in two, and `check.mjs`'s own comment says the `theme-color`
hex has been left stale once already. It now reads `landing.html` and compares its storage key, its
`theme-color` and **every token it declares, name by name, in both themes** — both files split on
their `[data-theme="dark"]` selector first, so a light value is never compared against a dark one.
**Gap:** `--shadow` is an `rgba()` list, so the hex comparison skips it.

### One doc constraint that bit

`CLAUDE.md` was at 200 lines, its cap, so two new rules had to be paid for. Three candidate cuts
turned out to be **rules wearing reasoning's clothes** and were put back — the recipe-ratio
re-check and the `FILTER_GROUPS` *More* clause are both instructions. What paid instead: the
workflow's justification for re-reading a grown diff, the *photography is the trap* aside, two words
in Scope, and folding the landing page and the wordmark into one bullet whose hover-only clause now
lives only in `style.css` and `decisions.md`. Back to exactly 200.

---

*Previously:* **One PR, `#25`: two complaints off one screenshot, a button swap asked for mid-round, and a review
that found a gap in the contrast script.**

### The focus ring is 2px, and it stops appearing after a mouse click

Two things wearing one complaint, and only the second was a defect.

The **width** is the third look at a number taken off a reference app. §6 of the light report
measures 4px; built at 4px it was too loud, shipped at 3px, and 3px was still a band rather than a
ring on the running app. 2px, with the same 2px gap. Contrast does not move — a line's ratio does
not depend on how thick the line is.

The **appearance** was real, and the cause is a browser rule this project had never measured:

> **Chrome paints `:focus-visible` on *programmatic* focus, and on the focus a `<dialog>` hands
> back when it closes.** Confirmed in headless Chrome with nothing ever typed at the page — a bare
> `.focus()` on a button matched `:focus-visible`, and so did the element a closed dialog restored
> to.

That is the sting: this project's own accessibility rule — *a redraw destroys focus, so put it on
what replaced the control* — is **why** the app calls `.focus()` in eight places. Every one of them
was drawing an orange ring for a mouse user. The thing in the screenshot was the recipe name that
had been opened and closed.

`handOff()` passes `focus({ focusVisible })`, and the value is **read off the control that was
activated**: a keypress leaves it `:focus-visible`, a mouse click does not. One line at the top of
the delegated listener pays for all eight. The dialogs get a `blur()` and a quiet re-focus, because
the flag only moves when focus does. Focus still lands in exactly the same place either way.

**What this deliberately is not** is a modality flag tracking the pointer. That was rejected once
already, for the search field, and re-deriving what `:focus-visible` already means is still the
wrong answer to a browser doing the right thing in the case it was designed for.

### The pressed layout toggle loses its orange border

It had one for arithmetic, not taste: `--accent-soft` measures **1.06** against the faded end of
the page it has sat on since the tools row lost its tile, so it needed a hairline to have an edge.
The arithmetic was right and the reading of it was not — on a 30px icon button a 1px accent border
reads as a thick orange outline.

The answer was already written down, two rounds before the question was asked.
[dark-mode-reference.md §4c](dark-mode-reference.md), off PowerToys: *a tint that cannot hold its
ground should be inverted, not propped up.* Pressed is the full `--accent` fill with `--on-accent`
on it — 4.28 against the faded page in light, 6.40 in dark, glyph at 4.74 / 7.12 — so it carries
its own edge. It is also the shape this app already used for "selected": the selected day chip and
the pressed meal chip in the dialogs are both exactly this.

The only bordered `.icon-btn` in the app is gone, and with it the one exception to *one box per
level*.

### The row's two buttons swap: Filters, then the layout toggle

Asked for mid-round. A markup reorder inside `toolsHtml()` and nothing else — `.tool-bar` is a flex
row, so DOM order is visual order **and tab order**. A CSS `order` would have got the same picture
and left a keyboard reaching the two buttons in the old sequence, which is the version of this
change that would have been a bug. Same lesson as `#24`, which moved the search field.

### The review found a gap the comment was hiding

`/code-review` traced the focus machinery end to end and found **no correctness bug in it**. What it
did find was a comment of mine crediting `.meal-add:hover` with washing `--accent-soft` onto the
page. It does not — `.meal-add` lives inside `.meal`, so its ground is a card. Chasing that down
found two pairs `check.mjs` has never had:

> The "+" circle on an empty meal is `--accent-soft` at rest and `--accent` on hover, and on a day
> gone by the card under it is `--surface-past` — which appeared in no surface pair at all.

Both pass, at 1.13 / 1.25 and 4.55 / 6.10, so this is a guard rather than a fix. But a past day with
an empty meal is the one place in the app where that pair is on screen, and nothing was measuring
it. **A wrong comment is worth chasing even when the code it sits over is right** — the error was in
the sentence and the gap was in the list beside it.

It also caught that the rule added earlier in the same branch was **already violated**: "never a
bare `.focus()`" is broken by `el.slotPicker.focus()` and `el.weekGrid.focus()`, ringless today only
because two `outline: none` rules suppress it. Delete either and a plain mouse click on "+ Add"
draws a 2px ring around the whole content column — the exact defect the branch exists to fix. Named
as the exemption in `CLAUDE.md` and at both call sites, with what has to change if either panel ever
gets a visible ring.

### Six doc lines that had gone false

The `toolsHtml()` comment and `openSlotPicker()`'s tab-order comment both named the old row order;
README enumerated the row; `docs/log.md`'s narrow tab pass records which control comes first after
the picker panel. `docs/decisions.md`'s *one box per level* row still ended "the glyph and the ink
say it", which is what this round replaced with a fill, and `status.md`'s own PR #23 write-up still
asserted the bordered-icon-button exception in the present tense. The parts lists in `CLAUDE.md` and
`architecture.md` were left alone deliberately, the same call as last round: they name the
component's parts, not their order.

`CLAUDE.md` is at 200 lines, its cap, which is what forced the new focus rule to be three lines
rather than four.

---

*Previously:* **One PR, `#24`: one request, one line of CSS to pay for it, and three doc lines that had gone false.**

### The Filters button moves left of the search field

Row order is **layout toggle · Filters · search**. It is a markup reorder inside `toolsHtml()` and
nothing else — `.tool-bar` is a flex row, so DOM order is visual order and **tab order follows it**.
A CSS `order` would have got the same picture and left a keyboard reaching the two in the old
sequence, which is the version of this change that would have been a bug.

The ask named the Filters button; the control that actually moved is the **search field**, to the end
of the row, and the layout toggle came left with it.

### The field had to lose its 480px cap

Found by review, not by looking, and the arithmetic is why:

> With the field *last*, `max-width: 480px` on it left the row ending **481px short of the card grid
> above it** at 1440px — 155px short at 1100px, nothing at all under 620px.

The same cap was invisible while search was *first*: the dead space fell **between** the field and
the right-aligned buttons, where a gap in a row of controls reads as spacing. Trailing, it reads as
a row that ran out. The tools row has no tile of its own to end at, so the grid's edge is the only
edge on the page for it to line up with, and the field now fills to it. One deleted declaration.

**The cost is a wide field** — about 1120px at 1440px — and that is a taste call nobody has ruled
on. It is in the Open work row rather than settled here.

### Three doc lines that the reorder made false

`README.md` enumerated the row in the old left-to-right order and called the layout buttons
"beside" the search box; `docs/log.md`'s narrow tab pass recorded **the search box as the first
control after the picker panel**, which is the tile/list toggle now. The two enumerations in
`CLAUDE.md` and `architecture.md` were left alone deliberately — they list the component's *parts*,
not their order.

`check.mjs` is untouched at **136**, and that is the honest reading rather than a gap: this round
moved a control and deleted a width. Neither is a colour, and the script only measures colour and
wiring.

---

*Previously:* **One PR, `#23`: four requests, and the third turned the fourth into a palette change.**

### The filter row is shut, everywhere

It opened above 620px and stayed shut below, on the argument that a *visible* ticked box in the
*Meal* group is what makes the slot picker's short list explain itself. **The count badge does
that job in 0px**, so the exception was the thing paying rent. Two costs beyond the pixels settled
it: one component read two ways on the same app, and the 620px listener **reopened a row you had
shut** every time a desktop window crossed the line. That reset is gone with it, so a row you open
now survives a window drag. The ticked box itself is untouched and still untickable.

The narrow budget was the measurable half: **41% → 45.5%** of a 390x664 screen on a finger.

### Every caret points down shut and up open

The Filters button's pointed **left** when shut — a `rotate(-90deg)` saying "there is more to the
side" about a row that opens downwards — and the five dropdown carets below it never moved at all.
The upward one drops the 3px `margin-top` that centres a downward triangle: a CSS triangle is a
border box with three transparent sides, so flipping it moves the visual weight to the other end.

### The tile went, and took the palette with it

The row was a `--surface` card with a `--line` rim and 16px of padding, holding a search field, two
icon buttons and six chips — **each of which is a box in its own right.** That is *one box per
level* failing at the level it was written for. On the page it reads as controls rather than as a
panel, and the narrow layout got the padding back for free.

Then the fourth request — one border colour, `--line` instead of `--line-strong` — did not fit,
and the number is why:

> `--line` on `--control` measures **1.03 in dark.** The lighter hairline disappears on a
> raised-on-a-card fill, so the two could never have gone together.

`--control` is the rest fill for a control **on a card**, and there is no card any more — at 1.03
above the page in light it was a fill doing nothing, which is the no-op this project has now
shipped three times. So the search field and the five summaries went to **`--surface` with a
`--line` edge**, the card's own arrangement at this palette's white ceiling, and the light border
then works in both themes. `.chip` in the dialogs keeps `--control`/`--line-strong` and is the last
thing in the app resting on a card.

**One exception to "no bordered icon button" was bought with it** — *and given back two rounds
later; the rest of this paragraph is what it cost while it stood.* The pressed layout toggle's
`--accent-soft` wash is 1.18 on the white tile it used to sit on and **1.06** against the faded end
of the page it sits on now, with nothing carrying the edge. It took an `--accent` border —
`.icon-btn` already declared a transparent 1px one, so colouring it shifted nothing, and `--accent`
measures 4.03 on the wash and 4.28 on the page. On a 30px control that hairline read as a thick
orange outline, and the fill went to the full `--accent` instead.

`check.mjs` went **127 → 136**, and every addition is the same sentence: a control that was on a
card is on the page now. `--line`, `--hover` and `--accent` gained the faded end of the page as a
ground, and `--accent-soft` gained it as a pair that **fails** — which is what found the pressed
toggle. Nothing in a screenshot was going to. `--control` beside `--bg` stays in the list as a
guard with nothing filling it, its comment saying so, the same way `--surface-sunk` beside `--bg`
does.

`CLAUDE.md` is back at exactly **200 lines**: five rules changed, one is new, and the room came
from trimming reasoning out of six others.

---

*Previously:* **Two PRs, `#20` then `#22`, both from looking at the running app.** The first fixed a fill that
measured fine and read as a smudge; the second was a request for a whiter page that turned out to
be a question about which edge in the palette gets to be a colour and which gets to be a line.

### The tags: legal, and still invisible

The recipe tags were `--surface-sunk`, the progress-track shade — **1.20** from a white card and
**1.14** from a dark one. Both clear this project's 1.10 floor and the pills still read as
smudges, because **a track can afford to be faint and a borderless pill cannot**: the track has an
accent fill inside it doing the reading. The floor says two surfaces are distinguishable; it does
not say a shape is legible.

`--tag-fill` is now its own token at **1.32 both ways**, and it is a token rather than a deeper
`--surface-sunk` for two reasons. One value cannot serve both themes: down in dark is capped,
since the card is `#2b2b2b` and the page `#1a1a1a`, so a pill with more contrast below the card is
darker than the page and reads as a hole punched through it. And `--surface-sunk` was doing two
jobs again — the exact split `--control` needed two rounds ago — so it keeps the track, unchanged.

**The first attempt was dropped, not merged.** It gave the tags the accent wash, `--accent-soft`
with `--accent-ink`, on the argument that the pills should match the pressed layout toggle in the
same tools row. Every number cleared, the screenshots looked fine, and on the real page it looked
worse than the grey it replaced. PR #19 was closed and the branch deleted. **The ask was contrast;
the answer looked like colour.**

### The page: three edges, room for two

The page went from `#f4f0e9` to **`#faf8f4`** with a **1.04 fade down the viewport**, and the
sidebar got a fill of its own for the first time. The arithmetic is the whole story:

> White to the old page was **1.14 of contrast in total.** The floor between two touching surfaces
> is **1.10.** So cards, a whiter page, and a rail that reads apart from the page cannot all have
> a tonal step — 1.10 twice over is 1.21, and there is only 1.14 to spend.

One of the three edges had to become a hairline. The card's is the one that already had a border,
so **page to card is 1.06 now**, carried by `--line` at 1.29 on the page and 1.37 on the card —
which is what both light references do at the white ceiling (Claude runs content to chrome at
1.03 and lets the seam do the work). What the room bought is `--rail`: a real **1.12** step, so
the sidebar reads as a panel rather than as page with a line down it.

This was put to you as a choice before any of it was written, with the three options measured. It
is the kind of trade a script cannot make, because every option passes.

### Four tokens moved because the page overtook them

- **`--control`** `#fbf7f2` → `#fdfbf8`. It was *below* `#faf8f4`, which made a control on a card
  darker than the page around the card — the exact reading this token was invented to prevent.
- **`--surface-past`** → `#fcfaf7`, and it is now nearly out of room: 1.04 from a live card, 1.02
  from the page. A spent day is told by its `--ink-faint` name and its border, not by its fill.
- **`--hover`** `#eae4da` → `#e7e0d5`. The nav rows hover on the rail now and the old value sat
  **1.06** from it — a hover that does nothing, which is the bug this project has shipped twice
  already. `#e7e0d5` is the only value clearing both ends: 1.11 on the rail below, and
  `--accent-ink` still 4.54 on it above.
- **`--rail`** has a **four-shade window** in light — pinned between the page above and `--hover`
  below, 1.10 each way — and the value is the middle of it. Dark went the other way, **down** to
  `#0e0e0e`, ChatGPT's arrangement of chrome darker than content, after up was tried and missed
  the selected pill's floor at **1.0999**.

### The gradient, and the two mechanics behind it

`background-attachment: fixed`, so the fade is anchored to the **viewport** rather than the
document — it reads the same on the week view and 300px into a list of fifty recipes. Attached to
the document it stretches over the whole scroll height and disappears.

The stops are tokens, not an `rgba()` overlay, so `check.mjs` can measure the *other* ground
everything on the page sits on. **The fade goes down in light and up in dark**, which is not
symmetry for its own sake: a light page has nothing above it to fade towards and a dark page has
nothing below.

`--bg` stays a flat token underneath, because three things read the page's colour rather than its
gradient — `theme-color`, the translucent top bar, and the `transition` on `body`.

### Docs, and the check

`check.mjs` went **96 → 127**: eight text pairs on the two new grounds, six surface pairs, and the
page-to-card pair took the hairline exception, which means the script now measures `--line`
against both sides of it instead. **`--tag-fill` needed no new pair type** — both of its pairs
already existed for other tokens.

`CLAUDE.md` is still at exactly **200 lines**, and paying for this round cost more than usual:
four rules changed, one gained a clause about the rail and the fade, and the room came from
trimming reasoning out of five others. The line count is the only thing that catches "rule or
reasoning" going the wrong way, and it did its job twice in one session.

`index.html`'s `theme-color` copy moved with `--bg` — **caught by the duplicate-value check, not
by reading the diff**, for the second round running.

## What is not verified

**~~The deployed *Recipes* view was not rendered.~~ Closed this round.** It stood on two true
facts — headless Chrome exits `21` here the moment `--remote-debugging-port` is asked for, and a
`file://` rig cannot script a cross-origin iframe — and on one thing nobody had tried: a page served
from **`localhost`** can `fetch()` the deployed files, because GitHub Pages sends
`Access-Control-Allow-Origin: *`, and `document.write` them into a **same-origin** iframe with
relative paths rewritten to the deployed origin. The live page then takes clicks and answers
`getComputedStyle`. The deployed *Recipes* view was reached, switched to the list layout, toggled to
dark and measured. **The limit was the `file://` half, not the cross-origin half**, and it went
unexamined for four rounds because the sentence naming it read like a browser rule.

**No keyboard, still, and tab order changed again this round.** Filters is reached before the two
layout buttons now, and the search field is last. Seventeen focusables were focused *the way a Tab
does* and every ring measured, which is not the same as a hand on a Tab key: nothing tests that the
sequence is comfortable, only that each stop is visible. Ninth round for this sentence.

**`pointer: coarse` was not forced this round at all.** The 44px floor at 360px is pure arithmetic
here: no control changed size, only its position in a flex row, and the field's measured width came
out identical before and after. The narrow height budget was not re-measured either — nothing in
the diff changes a height.

**Dark mode was not rendered**, and neither was the filter row **open** under its new position. The
row of dropdowns is unchanged and still starts at the left edge of the tools row, so it no longer
begins under the button that opens it — that relationship has been reasoned about, not seen.

**Saved and the slot picker were driven, not looked at.** Both draw the same component from the same
call, and the review's functional pass opened the picker at two widths and read its geometry back.
No render of either was opened.

*Carried over —* **every border in the tools row and on every `.btn` in the app changed colour, and no pointer
touched any of them.** `.btn:hover` and `.filter-summary:hover` both swap to an `--accent` border,
and that swap now starts from a *lighter* resting line than it did — the one state where the change
is bigger than at rest, and the one nobody has seen.

**The dialogs were not opened.** `.btn` is shared, so every button in both sheets moved to `--line`
— 1.37 on a light sheet and 1.24 on a dark one, arithmetic only. `.chip` beside them still carries
`--line-strong`, which is deliberate and means the two are a shade apart inside the same dialog.
**That pairing has not been looked at.**

**The caret flip cannot be read back by a script.** `getComputedStyle(el, '::after').transform`
returns `none` in this Chrome while the `[open]` rule is demonstrably matching — its `margin-top`
comes back as `-3px` from the same rule. So the one thing confirming the arrows point the right way
is **two screenshots**, and a future change to that rule has nothing runnable guarding it.

**`--surface-past`, the week view and the summary column were not re-rendered.** Nothing in the diff
reaches them and `.btn` is the only shared class that could.

**The 44px numbers came from a *forced* `pointer: coarse`**, via CDP touch emulation. Forcing it is
not a finger, and the tab pass was CDP key events rather than a keyboard. Both are the standing
debts below, and this round moved every control in the row.

*Carried over —* **no real pointer or keyboard has touched the round before this one either, and
`--hover` moved in it.** Every hover fill in
the app is a shade different now and **not one of them was rendered** — not the nav rows on the new
rail, which is the one the token was re-picked for. Nothing was injected this round either, so the
claim is arithmetic: 1.11 on the rail, 1.24 on the page, 1.31 on a card. **Hovering a nav row and a
day chip is the single most useful thing to do by hand here.**

**A real phone.** Unchanged as a gap: the difference between a mouse and a finger in the narrow
layout is 33px of controls, so the budget sits **4 points from its ceiling on the pointer nobody
here has tested with**. A headless run can force the `pointer: coarse` block on, and forcing it is
not being on one. The list add button now sets its own `width: var(--tap)` and so holds the floor
without that block, which is one less thing to get wrong and still not a finger.

**A real keyboard.** Still the oldest debt here. Eight places restore focus; a person has driven
none of them.

**`--control` is at 1.03 below a white card now**, down from 1.07, because it had to move up to
stay above the whiter page. A deliberate near-invisible fill with the border doing the work — what
the references do at the white ceiling, and nobody's favourite sentence. If the search field reads
as too faint on a real screen the lever is `--line-strong`, not the fill: there is nothing above
white left to spend.

**`--surface-past` is the sharp end of the same squeeze**, at 1.04 from a live card and 1.02 from
the page. **A past day with no meals on it has not been looked at since the page moved** — the
render that would show it is a week in the past, and this round's shots were all of the current
week. If a spent card now reads as a live one, the fill is not the lever either; the name and date
are already `--ink-faint`.

**The `fixed` background is the one risky mechanic shipped this round.** `background-attachment:
fixed` is known to misbehave on iOS Safari, and there is no iOS here. If the fade looks wrong or
scrolls oddly on a phone, that is the line to pull — the flat `--bg` underneath is the fallback and
needs nothing added.

**The theme switch snaps the gradient.** A gradient image is not interpolable, so on toggle the fade
jumps while the colour under it transitions. At 1.04 between the stops that is roughly a 1% step
during a full repaint, and **it has not been watched in a browser slowly enough to be sure it is
invisible.**

**`--accent-soft` at 1.12 on a dark card is load-bearing in one more place** than it was, since
`.btn:hover` went back to it. It clears the 1.10 floor by 0.02. Finding (c) of the dark report,
still open and now slightly more exposed.

**Viewports under about 760px tall.** At 390x664 the picker is **45.5%** on a finger now, up from
41% — the filter row starting shut is where the difference came from, and it is the last easy
point in that budget. It cannot go much further while the week bar stays: four things above it are on the 44px touch floor, which is 200px before a single gap.
**You cannot spend a touch floor.** Named in
[decisions.md](decisions.md#height-and-who-gets-the-screen) rather than fixed.

**The 1001–1150px band is measured, not looked at.** That is where the picker column is narrowest
and where the name column's floor now bites — three tags wrap to three rows there and the card is
96px tall. Same as before this round, and the name is 133px instead of 83px, so it is a trade rather
than a defect. It is the band worth a screenshot.

**Anything between 400 and 620px**, where the tools row has collapsed to one line but the cards have
not gone single-column.

**Three or more tabs.** Nothing in the cross-tab mechanism cares how many there are, but only two
were ever driven.

## Next jobs, in the order they'd earn their place

1. **Finish the keyboard pass.** Seven rounds at the top of this list. CDP tab events walked the
   tools row this round and found nothing, which is the easy half — what is left is a real keyboard
   through the week, the picker with a dropdown open, and **both dialogs**, which is also where this
   round's untested border change landed.
2. **Open the two dialogs and look at them.** New, and cheap: `.btn` changed colour in both, and
   `.chip` beside it deliberately did not.
3. **A phone.** The 44px floor is arithmetic and a forced media block, and the narrow budget depends
   on it.
4. **Decide about short screens.** Either accept 41% on a 664px viewport as the honest limit, or
   decide what leaves the page there — the week range row is the only candidate that is not a touch
   floor.
5. **Decide whether the spacing scale gets a check.** Unchanged: a rule writing `margin-bottom: 18px`
   is legal CSS and passes all 144 checks. Described in
   [architecture](architecture.md#how-this-gets-tested), deliberately not written, held by review.
6. **Put the dialogs on the spacing scale, or say why not.** Unchanged: `22px`, `20px`, `18px` and
   `14px` are still doing gap duty inside the sheets.
7. **Take a screenshot set.** Cheaper than ever and still none in the repo — three rounds have now
   produced thirteen renders, then eight, then six, and kept none of them. `*.png` is gitignored and would need a deliberate `!Screenshots/**`
   exception. Your call, and the 1001–1150px band is the one that would earn its place first.
8. **Decide about `--accent-soft` on a dark card.** The last dark-mode finding, at 1.12. The
   reference answer is to stop making a dark tint work and **invert** the element — PowerToys uses
   the bright accent as the fill with dark text on it, which measures 10.47 instead of 1.12.
9. **Decide whether the week greeting comes back.** It is parked, not deleted, and the page is a
   good deal quieter without it.

## Five judgement calls left open

**The search field runs the full width of the content column.** Dropping its cap is what makes the
tools row end where the cards end, and the row has no other edge to meet. The alternative is a
capped field and a row that stops 481px short of the grid at 1440px, which is what the review
found. One declaration either way.

**The tile foot still keeps its words above 620px.** A list row shows the glyph alone at every
width; a tile shows *Add to week*. The reasoning is that a tile has the room and the button is the
widest thing on it — but it does mean one component reads two ways on the same screen when you flip
the toggle. Say the word and it compresses everywhere; it is one selector.

**The app has no name on screen under 1000px.** Deliberate, and it reads odder written down than it
looks: a phone app's name is on its home screen and in its tab title, not repeated above every
view. If it feels anonymous on the live site, the fix is a name in the picker's row, not the return
of the 53px bar.

**The week bar is centred while the meal cards are left-aligned.** Navigation on one axis, content
on another. The bar is the first thing on the page, with nothing centred above it to justify it.

**A past day with meals looks exactly like a past day without**, and after this round a past *card*
barely differs from a live one either — `--surface-past` is 1.04 from a white card on a near-white
page. The first half is the deliberate cost of taking the ring off past days; the second is the
deliberate cost of the whiter page. Both are only right if the week is for steering rather than for
history.

## Three small things open, none urgent

- Google Fonts is the app's first external request; blocked or offline, you get the fallback stack.
  The one place the "static files only" constraint bends.
- `applyTheme()` always stamps `data-theme`, so a dark-OS user gets a light app on first visit
  despite `<meta name="color-scheme" content="light dark">`.
- **Values are written twice** — the storage key, the `theme-color` fallback hex and the bookmark
  icon path, and since `landing.html` the storage key and `theme-color` again plus the whole
  palette. None can be de-duplicated without a build step, which this project does not have.
  `check.mjs` compares all of it, and it **earned that**: moving `--bg` once left the
  `theme-color` copy behind and the script caught it before the commit. Listed in
  [architecture](architecture.md#storage).

These are trade-offs rather than bugs. The known-defect list is empty, and empty **on the live app**
as well — the three served files were fetched back and compared byte for byte against `main`, rather
than assumed from a green build.

## Screenshots

**None of the app in the repo**, and the half of the policy that matters is unchanged: a shot of
the wrong version is worse than none, so a stale one is never captioned as current. What changed is
where it goes — **`archive/screenshots/`, not the bin**, still gitignored and still never cited. The
four supplied design concepts *are* tracked, under `Light mode Mockups/`; shots of the running app
are not. The reference shots the palette was read from live on disk too, under
`docs/Dark mode references/` and `docs/Light mode references/`.

They are **reproducible on demand** — headless Chrome from the shell renders any state. This round
drove it into six, all named in the Confirmed row. An earlier round drove it into thirteen: the Recipes grid at 1280px in both themes twice over (accent tags,
then grey), the Recipes list at 1280px in both themes, the week view wide in both themes on the new
page, the narrow week at 390px and 359px, and the deployed site as the last check. **Twelve of the
thirteen were looked at**; the one that was not is named in the Confirmed row at the top, because a
render nobody opened is a file rather than a check.

**A third thing about the rig — and it was half wrong for four rounds.** Chrome does exit `21`
here the moment `--remote-debugging-port` is asked for, so there is no CDP session to drive the
*deployed* site with, and a `file://` rig cannot script a cross-origin iframe. The conclusion drawn
from those two — "the live site can only be loaded and shot as it lands" — was the mistake. Serve
the rig from `localhost`, `fetch()` the deployed files (Pages sends
`Access-Control-Allow-Origin: *`), rewrite their relative `href`/`src` to the deployed origin, and
`document.write` them into a same-origin iframe: the live page is then scriptable. That is how the
deployed *Recipes* view was reached and measured this round. **Two true constraints and one
unexamined inference is how a limit outlives its cause.**

**Two things about the rig, both of which cost time in an earlier round.** Windows will not open a headless
window under about 500 CSS px — `--window-size=390` reports `innerWidth: 526` and the PNG is a
390px *crop* of a 526px layout, which looks exactly like a horizontal overflow bug and is not one.
Anything narrower than that goes in an `<iframe>` sized to the width, which gets its own viewport
for media queries. And **CSS transitions do not tick under `--virtual-time-budget`**, so a
transitioned property sits mid-interpolation: a dark-theme render taken after clicking the toggle
came out with light-mode ink on dark cards, which reads as a contrast defect and is a rig artefact.
Disable animation and transition in the frame before measuring or shooting — both of these were
diagnosed by asking the live page for computed values rather than by looking harder at the
picture.

`*.png`, `*.jpg` and `*.jpeg` are gitignored with `!Light mode Mockups/*.png` excepted, because a
camera-named file got committed twice. That exception once named a folder that had been renamed and
silently stopped protecting anything — the four concepts were deleted by a routine docs commit and
nobody noticed for two commits. It now names the folder that exists.

---

**Deeper background:** [architecture](architecture.md) · [decisions](decisions.md) · [log](log.md)
