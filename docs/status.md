# Where things stand

*The one doc that changes every session. Read it first; it is the only one here that goes stale.*

| | |
|---|---|
| **Live** | **The app is `ecdd6d4`** — PR [#18](https://github.com/thelivinsine/meal-planner/pull/18), squash-merged. Pages reported `built` at that commit, and all three served files were fetched back and compared against `main` **byte for byte** (identical once line endings are normalised) rather than grepped for a marker. The live page was then rendered and looked at. **No build hash here on purpose:** Pages rebuilds on every commit including this file's own, so naming the build commit in the file that names it is a hash that is stale the moment it is written. The build to trust is the one at the head of `main`. https://thelivinsine.github.io/meal-planner/ |
| **Open work** | **No PRs open.** No known defect. Four things parked by choice: the accent-on-accent focus ring, `--accent-soft` at 1.12 on a dark card, the dialogs being off the spacing scale, and the week greeting (parked whole in a comment, restorable). The dark-mode token findings are **no longer on this list** — three of the four are done and the fourth is the accent-soft one. **One limit still named rather than fixed:** the narrow height budget does not hold under about 760px of viewport height |
| **Confirmed** | **This round, in headless Chrome — and the two halves of that are worth keeping apart. Rendered fifteen, looked at eleven:** Recipes list and tile at 1280px light, list at 1280px dark, the narrow list, the week view wide and narrow, both dialogs, both hover renders, and the deployed site. **The four rendered and not opened**, because a render nobody opens is a file rather than a check: tile at 1280px dark, the narrow tile, the week in dark, and the detail sheet. The hover fills were rendered by *injecting* them onto named elements, since headless cannot hover. **Measured rather than rendered** — the other half, and the list row's widths live here rather than in a picture: 1001/1024/1100/700/359px, where the numbers were the whole point. Measured off the live DOM rather than eyeballed: `.card-add` is 44×32 with its label hidden in every list at every width and 251×34 with its words in a wide tile, `card-actions` reports `0px` on both borders, the narrow name column went 149px → 214px, and no width overflows its viewport. `node check.mjs` — **96 checks**. Before this: the narrow height budget (30.6% mouse / 34.9% finger, 48 assertions across three probes); **storage, hard** — the real `loadState`/`saveState` against 26 cases in a Node VM and cross-tab behaviour in two real Chrome tabs over CDP; and **your eyes on the running app** across every card round, including the screenshots that started this one |
| **Branches** | `controls-and-greys` deleted on merge. Two still on the remote, both safe to delete: `design/bold-consumer` (shipped as `49b3c16`) and `feat/slot-picker-and-indian-recipes`, fully contained in `main` since the second round |

## What just shipped

**PR #18, squash-merged as `ecdd6d4`** — three commits, two rounds of critique on the same
screenshots, and the second round **reversed part of the first**. Pages `built` and the live files
verified before this file was touched.

### Round one: a focus ring that fired on a mouse click

**Chrome matches `:focus-visible` on a text field however it was focused** — deliberately, because
a text field is for typing and the caret has to be findable. So the app's shared 3px ring appeared
on a mouse click and stayed there while you typed, which is the one thing a focus ring exists not to
do. It read as a CSS mistake and was a browser rule.

A text field already carries a border, so the border is its focus indicator: `--accent`, doubled to
2px by an **inset shadow** rather than a wider border, which would shift the field by a pixel every
time it took focus. `outline: none` on that one control and nowhere else. A keyboard user loses
nothing — the same accent edge appears either way.

The same round shrank the add button to its glyph under 620px, took the vertical rule out of a list
card, and split `--control` off `--surface-sunk` because a *track* and a *control* want opposite
directions in dark.

### Round two: the greys were the wrong way up

Your four points off the next set of screenshots, and the fourth one was a real bug rather than a
taste call.

**`--control` was `#f0eae1` — a step *down* from the card and only 1.05 from the page.** So a search
field and five filter dropdowns sitting inside a white panel were the same shade as the page around
that panel, and read as **gaps punched through it** rather than as controls resting on it. The
project's own file already documents this failure for `--bg`; this was the same failure one token
along, and round one had walked straight past it while moving the dark half.

The correction came out of [§3 of the light report](light-mode-reference.md#3-the-nesting-ladder-in-light-mode--and-where-it-runs-out),
which makes exactly one distinction: **states go down in light, elevation goes up in both themes.**
An input fill is elevation. Both references prove it — PowerToys puts its input at `#fefefe` on a
`#fbfbfb` card, Claude at `#fefefd` on `#fcfcfb` chrome. Round one read the first half of that
sentence and skipped the second.

| | before | after |
|---|---|---|
| `--bg`, the page | `#f6f3ee` | `#f4f0e9` — cards lift off it at 1.14, was 1.11 |
| `--control`, a control's rest fill | `#f0eae1`, 1.20 **down** from the card | `#fbf7f2`, 1.07 down with `--line-strong` at 1.76 carrying the edge — and 1.07 **above the page** |
| tag pills | `--control` | `--surface-sunk` — a label has no border, and at 1.07 on white it would not be there |
| `--hover`, dark | `#2b2b2b` | `#383838` |

So the split is not control-versus-track after all. It is **pressable-versus-not**: everything you
can press is raised, everything that is only a word is sunk.

### The no-op that had been shipped for eight rounds

Moving `--control` up meant no card-level hover could use it — a hover onto a near-white fill is a
**1.07 no-op**, the exact defect this project has shipped once before. So `--hover` became *the*
state fill on either ground, page or card. Pointing it at a card is what surfaced the older bug:

**Dark `--hover` had been `#2b2b2b` since PR #10, which *is* `--surface`.** Every hover that landed
on a card was doing nothing at all in dark mode. It had been recorded as a harmless placeholder on
the grounds that both of its consumers landed on `--bg`, where it was a real 1.23 step — true when
written, and it stopped being true the moment a third consumer appeared. `check.mjs` reported
nothing, because **the pair `--hover`/`--surface` was not on its list**.

**A token parked at a neighbour's value is a no-op waiting for a consumer, and the pair has to be
measured before the consumer arrives, not after.** `#383838` clears both grounds: 1.48 on the page,
1.21 on a card.

### Half a rule reverted, and why that is not a climbdown

Round one moved `.btn:hover` off the accent wash on the argument that hover and *pressed* were the
same two colours. That is true of `.icon-btn` — the layout toggle's pressed state **is** the accent
wash, and you could not tell which layout was on by looking at the button under the pointer — and
false of `.btn`, which has no pressed state anywhere in the app. On a tools row that had just gone
white-on-white with hairlines, a grey `.btn` hover was the same move as every rest fill beside it
and read as nothing happening. You said so; the wash is back on `.btn` and `.icon-btn` keeps the
grey.

**A rule that is right for one control is not therefore right for the class it inherits from.**

### The third commit exists because the diff got re-read

Reviewing the branch against its own description — workflow step 4, which earns its place about
every third round — turned up a regression the round had introduced and neither the script nor the
wide renders could see.

`.is-list .card-top` had gone from `flex: 0 1 40%; min-width: 178px` to a grown column, and the
178px floor looked like decoration next to `flex: 1 1 auto`. **Growing a column is only generous
while there is free space to grow into.** In the slot picker beside the summary panel the column is
~430px, the row runs out, and a grown basis then loses to the tags: measured at 1024px the recipe
name fell to **83px over three lines** while three tags wrapped into three rows beside it — worse
than the fixed basis it replaced.

**The same rule has two very different amounts of room in this app, and the wide one is the one you
look at.** The floor is back, with the measurement in the comment so it does not look like
decoration again.

### Docs

`CLAUDE.md` is still at exactly **200 lines**: five rules rewritten, none added, paid for by
compressing the bookmark rule whose reasoning was already in `decisions.md`. The `--bg` rule now
names a different token per element, the hover rule is about `--hover` rather than `--control`, and
the card rule carries the list glyph.

Both colour reference docs gained a **correction to their own previous verdict** rather than a new
section — the light report's "nothing in the light theme moved" was the wrong thing to have been
pleased about, and the dark report's `--hover` placeholder was a defect rather than a deferral. That
is the point of keeping them as evidence: a document that records what it concluded last time is a
document that can be caught being wrong.

## What is not verified

**No real pointer or keyboard has touched this round.** The five hover fills were rendered by
*injecting* them onto specific elements, because headless Chrome cannot hover — that proves the
colours read, not that the rules fire. The focus border was confirmed by computed value in round
one, not by eye. **Tab into the search field versus clicking it** is the single most useful thing to
do by hand here, and it is the check the whole round was about.

**A real phone.** Unchanged as a gap: the difference between a mouse and a finger in the narrow
layout is 33px of controls, so the budget sits **4 points from its ceiling on the pointer nobody
here has tested with**. A headless run can force the `pointer: coarse` block on, and forcing it is
not being on one. The list add button now sets its own `width: var(--tap)` and so holds the floor
without that block, which is one less thing to get wrong and still not a finger.

**A real keyboard.** Still the oldest debt here. Eight places restore focus; a person has driven
none of them.

**`--control` at 1.07 below a white card is a deliberate near-invisible fill**, with the border
doing the work — which is what the references do at the white ceiling and is nobody's favourite
sentence. If the search field reads as too faint on a real screen, the lever is `--line-strong`, not
the fill: there is nothing above white to spend.

**`--accent-soft` at 1.12 on a dark card is load-bearing in one more place** than it was, since
`.btn:hover` went back to it. It clears the 1.10 floor by 0.02. Finding (c) of the dark report,
still open and now slightly more exposed.

**Viewports under about 760px tall.** At 390x664 the picker is 41% and cannot be less while the week
bar stays: four things above it are on the 44px touch floor, which is 200px before a single gap.
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

1. **Finish the keyboard pass.** Six rounds at the top of this list, and this round added the one
   control whose focus treatment is now different from everything else's. Tab through the week, the
   picker with a dropdown open, both dialogs, and one filter menu end to end.
2. **A phone.** The 44px floor is arithmetic and a forced media block, and the narrow budget depends
   on it.
3. **Decide about short screens.** Either accept 41% on a 664px viewport as the honest limit, or
   decide what leaves the page there — the week range row is the only candidate that is not a touch
   floor.
4. **Decide whether the spacing scale gets a check.** Unchanged: a rule writing `margin-bottom: 18px`
   is legal CSS and passes all 96 checks. Described in
   [architecture](architecture.md#how-this-gets-tested), deliberately not written, held by review.
5. **Put the dialogs on the spacing scale, or say why not.** Unchanged: `22px`, `20px`, `18px` and
   `14px` are still doing gap duty inside the sheets.
6. **Take a screenshot set.** Cheaper than ever and still none in the repo — this round produced
   fifteen renders and kept none. `*.png` is gitignored and would need a deliberate `!Screenshots/**`
   exception. Your call, and the 1001–1150px band is the one that would earn its place first.
7. **Decide about `--accent-soft` on a dark card.** The last dark-mode finding, at 1.12. The
   reference answer is to stop making a dark tint work and **invert** the element — PowerToys uses
   the bright accent as the fill with dark text on it, which measures 10.47 instead of 1.12.
8. **Decide whether the week greeting comes back.** It is parked, not deleted, and the page is a
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

**A past day with meals looks exactly like a past day without.** The deliberate cost of taking the
ring off past days, and only right if the week bar is for steering rather than for history.

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
round drove it into fifteen: Recipes in list and tile at 1280px in both themes, the narrow list and
narrow tile, the week view wide in both themes and narrow, the add-to-week dialog in both themes,
the detail sheet, the injected hover states in both themes, and the deployed site as the last check.
**Eleven of the fifteen were looked at**; the four that were not are named in the Confirmed row at
the top, because a render nobody opened is a file rather than a check. Windows will not
open a window under about 500 CSS px, so anything narrower is rendered in an `<iframe>` sized to the
width, which gets its own viewport for media queries. **One thing to remember about that rig:** CSS
transitions do not tick under `--virtual-time-budget`, so a transitioned property sits at its start
value and a render taken mid-animation comes out washed pale. Disable animation and transition in
the frame before measuring or shooting.

`*.png`, `*.jpg` and `*.jpeg` are gitignored with `!Light mode Mockups/*.png` excepted, because a
camera-named file got committed twice. That exception once named a folder that had been renamed and
silently stopped protecting anything — the four concepts were deleted by a routine docs commit and
nobody noticed for two commits. It now names the folder that exists.

---

**Deeper background:** [architecture](architecture.md) · [decisions](decisions.md) · [log](log.md)
