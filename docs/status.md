# Where things stand

*The one doc that changes every session. Read it first; it is the only one here that goes stale.*

| | |
|---|---|
| **Live** | **The app is `51ae81f`** — PR [#23](https://github.com/thelivinsine/meal-planner/pull/23), squash-merged. Pages reported `built` at `51ae81f`, all three served files were fetched back and compared against `main` **byte for byte** (identical once line endings are normalised), and the deployed page was then rendered with the filter row and a dropdown open and looked at. https://thelivinsine.github.io/meal-planner/ <br><br>*Previously:* **`c3e399f`** — PRs [#20](https://github.com/thelivinsine/meal-planner/pull/20) and [#22](https://github.com/thelivinsine/meal-planner/pull/22), squash-merged in that order. Pages reported `built` at `c3e399f`, and all three served files were fetched back and compared against `main` **byte for byte** (identical once line endings are normalised) rather than grepped for a marker; the live page was then rendered and looked at. #22 was reopened from #21, which GitHub **closed by itself** when the base branch it was stacked on was deleted on merging #20 — a stacked PR does not survive its base, so stack the branches and open the second PR only after the first lands. **No build hash here on purpose:** Pages rebuilds on every commit including this file's own, so naming the build commit in the file that names it is a hash that is stale the moment it is written. The build to trust is the one at the head of `main`. https://thelivinsine.github.io/meal-planner/ |
| **Open work** | **No PRs open.** No known defect. **One new thing that could not be read back by script:** the caret rotation — `getComputedStyle(el, '::after').transform` returns `none` in this Chrome even while the `[open]` rule is demonstrably matching (its `margin-top` reads back fine), so the flip is confirmed **by eye in two screenshots and nothing else**. Four things parked by choice: the accent-on-accent focus ring, `--accent-soft` at 1.12 on a dark card, the dialogs being off the spacing scale, and the week greeting (parked whole in a comment, restorable). **Two new limits this round, both named rather than fixed:** `--surface-past` has almost nothing left on a near-white page (1.04 from a live card), and `--hover`/`--rail` are pinned to within one shade by the floors either side of them, with `--accent-ink` on `--hover` at **4.54** against a 4.5 floor. **One limit still named rather than fixed:** the narrow height budget does not hold under about 760px of viewport height |
| **Confirmed** | **This round: `node check.mjs` at 136 checks, up from 127**, and the additions are all one sentence — a control that was on a card is on the page now. **Rendered and looked at, eight:** Recipes tiles at 1280px light with the row shut, the same with the row and a dropdown open, dark at 1280px with a dropdown open, the slot picker wide, the slot picker at 390px, the list layout at 700px with the row open, the focus-ring shot, and the deployed site. **Measured rather than rendered**, which is again the half that caught things: the narrow height budget went from the **41%** recorded below to **45.5%** at 390x664 with `pointer: coarse` forced on (50.5% on a mouse); the touch floor holds at 390px (search 155x44, each layout button 44x44, Filters 105x44, a summary 80x44, Clear 52x44); nine controls tabbed end to end with a 3px `rgb(200,73,31)` ring on every one; and a functional pass with **no console errors** — shut by default on all three lists, `aria-expanded` flipping, `indian` giving 27 of 50, badge 1, Clear back to 50, the row surviving a view switch, the picker opening shut with badge 1, and a meal added. <br><br>*Previously:* **In headless Chrome, and the two halves are worth keeping apart. Rendered thirteen, looked at twelve:** the Recipes grid at 1280px in both themes on the accent tags and again on the grey ones, the Recipes list at 1280px dark, the week view wide in both themes on the new page, the narrow week at **390px and 359px** through the iframe rig, and the deployed site. **The one rendered and not opened:** the Recipes list at 1280px light. **Measured rather than rendered**, which is the half that caught things: the live page was asked for its computed values — the tag pill reads `#56463c` on `#e8dfd3` over a white card in light and `#c2bebb` on `#3e3e3e` in dark, and the progress track still reads `#f0eae1` / `#212121`, so the two tokens that used to share a shade are demonstrably apart. `node check.mjs` — **127 checks**, up from 96. Before this: the narrow height budget (30.6% mouse / 34.9% finger, 48 assertions across three probes); **storage, hard** — the real `loadState`/`saveState` against 26 cases in a Node VM and cross-tab behaviour in two real Chrome tabs over CDP; and **your eyes on the running app**, which is what started both of this round's changes and rejected the first attempt at the tags |
| **Branches** | `tools-row-untiled` deleted on merge; `tag-contrast` and `page-white-rail` before it; `accent-tags` deleted with the PR that was dropped. Two still on the remote, both safe to delete: `design/bold-consumer` (shipped as `49b3c16`) and `feat/slot-picker-and-indian-recipes`, fully contained in `main` since the second round |

## What just shipped

**One PR, `#23`: four requests, and the third turned the fourth into a palette change.**

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

**One exception to "no bordered icon button" was bought with it.** The pressed layout toggle's
`--accent-soft` wash is 1.18 on the white tile it used to sit on and **1.06** against the faded end
of the page it sits on now, with nothing carrying the edge. It takes an `--accent` border —
`.icon-btn` already declared a transparent 1px one, so colouring it shifts nothing, and `--accent`
measures 4.03 on the wash and 4.28 on the page.

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

**Every border in the tools row and on every `.btn` in the app changed colour, and no pointer
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
   is legal CSS and passes all 136 checks. Described in
   [architecture](architecture.md#how-this-gets-tested), deliberately not written, held by review.
6. **Put the dialogs on the spacing scale, or say why not.** Unchanged: `22px`, `20px`, `18px` and
   `14px` are still doing gap duty inside the sheets.
7. **Take a screenshot set.** Cheaper than ever and still none in the repo — this round produced
   thirteen renders and kept none, and this one eight. `*.png` is gitignored and would need a deliberate `!Screenshots/**`
   exception. Your call, and the 1001–1150px band is the one that would earn its place first.
8. **Decide about `--accent-soft` on a dark card.** The last dark-mode finding, at 1.12. The
   reference answer is to stop making a dark tint work and **invert** the element — PowerToys uses
   the bright accent as the fill with dark text on it, which measures 10.47 instead of 1.12.
9. **Decide whether the week greeting comes back.** It is parked, not deleted, and the page is a
   good deal quieter without it.

## Four judgement calls left open

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
- **Three values are written twice** — the storage key, the `theme-color` fallback hex and the
  bookmark icon path. They cannot be de-duplicated without a build step, which this project does
  not have. `check.mjs` compares all three, and it **earned that this round**: moving `--bg` left
  the `theme-color` copy behind and the script caught it before the commit. Listed in
  [architecture](architecture.md#storage).

These are trade-offs rather than bugs. The known-defect list is empty, and empty **on the live app**
as well — the three served files were fetched back and compared byte for byte against `main`, rather
than assumed from a green build.

## Screenshots

**None of the app in the repo**, and the standing policy is unchanged: a shot of the wrong version
is worse than none, so stale ones get deleted rather than captioned. The four supplied design
concepts *are* tracked, under `Light mode Mockups/`; shots of the running app are not.

They are **reproducible on demand** — headless Chrome from the shell renders any state, and this
round drove it into thirteen: the Recipes grid at 1280px in both themes twice over (accent tags,
then grey), the Recipes list at 1280px in both themes, the week view wide in both themes on the new
page, the narrow week at 390px and 359px, and the deployed site as the last check. **Twelve of the
thirteen were looked at**; the one that was not is named in the Confirmed row at the top, because a
render nobody opened is a file rather than a check.

**Two things about the rig, both of which cost time this round.** Windows will not open a headless
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
