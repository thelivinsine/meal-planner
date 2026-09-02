# Where things stand

*The one doc that changes every session. Read it first; it is the only one here that goes stale.*

| | |
|---|---|
| **Live** | Code at `c39fe70` (PR [#12](https://github.com/thelivinsine/meal-planner/pull/12), squash-merged). Pages `built` at `c39fe70`. https://thelivinsine.github.io/meal-planner/ |
| **Open work** | **None.** No branch, no PR, no known defect. Four things parked by choice: the theme button's hover, the accent-on-accent focus ring, the dark-mode token findings, and the dialogs being off the new spacing scale |
| **Confirmed** | The new spacing at 1254 / 760px light — **headless renders, and your eyes on the running app** at a zoom level no default screenshot uses, which is what caught the heading gap being a step too small. Still standing from PR #11: the picker replacing the day, the dissolved week bar, the ring on a planned day, the 3px focus ring, the underline on all three grounds, and **the live site on a phone** |
| **Branches** | `design/bold-consumer` is merged and can be deleted whenever. Everything else has been deleted on merge, `spacing-scale` included |

## What just shipped

**PR #12: four spacing tokens instead of eleven ad-hoc vertical gaps.**

**The complaint was "the spacing doesn't feel nice" and the cause was arithmetic.** Eleven numbers
were doing vertical-gap duty — 10, 14, 16, 20, 22, 24, 28, 30, 48, 104 — each picked on its own at
the moment it was needed. Nothing measured wrong. The week still read as one flat list, because
**the gap that separates sections was the same size as the gap that separates siblings**: heading
to week bar was 24, week bar to the day below it 20. Four pixels is not a signal, so nothing on the
page said where one block ended and the next began.

`--space-1/2/3/4` at **8 / 16 / 24 / 40** give the four jobs four sizes — inside a group, between
siblings, between blocks, between sections — and every vertical gap *between* components now names
one. Measured headless at 1254×900 on the week view, before → after:

| Gap | Before | After |
|---|---|---|
| window top → heading | 68 | 56 |
| heading → week bar | 24 | **40** |
| week bar → day title | 20 | **40** |
| day title → first meal card | 10 | 16 |
| meal card → meal card | 14 | 16 |
| last card → page bottom (desktop) | 48 | 40 |

The 68 → 56 is the desktop top bar, which over 1000px holds one small theme button and was spending
22px of padding above it. That is where "a hole above the header and nothing below it" came from:
the same pixels, in the wrong place.

**Padding *inside* a component was deliberately not touched.** A meal card's `16px 18px 18px`, a
chip's `5px 11px`, a search field's `8px 14px` are the shape of that control, tuned against its own
type and its 44px floor. Snapping them to a four-step scale would have resized half the controls in
the app to fix a rhythm problem that lives *between* them. The horizontal flex gaps (10, 12) stayed
for the same reason — side by side, there is no vertical rhythm to break.

**Two numbers stay off the scale, named in the token comment and in
[decisions](decisions.md#spacing-and-rhythm)**: `.page`'s 104px/100px bottom padding is clearance
for the floating nav, governed by the nav's own `bottom`; and the dialogs are a separate surface
with their own internal rhythm and no shared edge with the page.

### The heading gap was got wrong once, in the open

It shipped in the first commit at `--space-3`, the same 24px the week bar gets above the day, and
you looked at it at a real zoom level and said it was still cramped. It was: **the heading is the
largest thing on the page — 34px display type — so it needs the largest gap**, not the middle one.
It is `--space-4` now, and on the week view the grid carries it as a *row* gap while the column gap
beside the summary panel stays `--space-3` — side by side is a block edge, under a heading is a
section break.

Worth recording because the mistake is the interesting part: **the step was picked from the scale
rather than from the page.** A scale tells you which sizes exist; it does not tell you which one a
particular gap wants. That judgement still needs a look.

**No token moved, no new colour, no check added.** 76 checks, all passing, unchanged in number —
which is itself the finding below.

## The tooling that changed last round did the work this round

**The Chrome extension has never connected here; Chrome runs headless from the shell instead.**
`chrome --headless --screenshot` renders the app, and `--dump-dom` will hand back anything the page
can compute. This round was the first one it carried end to end: the before-and-after table above
is `getBoundingClientRect()` on the live page at both ends, not arithmetic on the stylesheet, and
every look was a headless render. That covers both halves of the gap this project keeps hitting:

- **It renders**, so a layout change can be looked at without waiting for you. Three widths this
  round: 1254px, 760px and 360px. Windows will not open a real window under ~500px wide, so 360px
  is tested by loading the app in a 360px `<iframe>`, which gets its own viewport for media queries.
- **It answers questions a picture cannot.** `activeElement`, `scrollHeight`, a computed height.
  Two of the three defects above were confirmed that way — one of them by running the *old* code's
  expression and watching it resolve to a hidden button.

Two cautions worth carrying forward. A script calling `.click()` is **not** a keyboard, so this
does not close the keyboard pass. And measuring during an opening animation gives a wrong answer —
the panel is 8px high for the first frame, so everything here is measured after it settles. A third
one earned this round: `--virtual-time-budget` does not always advance CSS animations, so a
screenshot can come back mid-fade and a measurement can come back 8px short. Both showed up, both
were harmless once recognised, and both would have been read as defects by anyone who did not know.

**And the thing it still cannot do is have an opinion.** Every gap in the table above was measured
headless and every one of them passed; the heading gap was still wrong, and it took you looking at
the page at a real zoom level to say so. The renders answer *what is it*, never *is it right*.

## Next jobs, in the order they'd earn their place

1. **Look at the last two rounds in dark mode.** Still nothing shipped since PR #10 has been seen in
   it, and this round added a reason to care that spacing alone would not: **space is now doing work
   that a fill or a border would otherwise do.** The 40px above the day title is the *only* thing
   separating the dissolved week bar from the meal cards, and the ring is the only thing marking a
   planned day. Neither is a colour, but both are read against one. Cheapest job on the list, two
   rounds overdue.
2. **Finish the keyboard pass.** Unchanged: focus restoration after a redraw is asserted in six
   places and driven by a person in none. Two are exercised by a scripted headless check, which is
   not tabbing. Not covered: the week view, the slot picker and either dialog end to end. Nothing
   focusable changed this round, which is exactly why it has been possible to keep deferring.
3. **A phone again.** No control changed size this round — the scale spaces things apart rather than
   resizing them, so the 44px floor should be untouched. "Should be" is doing real work in that
   sentence, and only a thumb settles it. 360px was checked in a 360px `<iframe>`, which is a
   viewport, not a device.
4. **Decide whether the spacing scale gets a check.** A rule writing `margin-bottom: 18px` is legal
   CSS and passes all 76 checks. The shape check that would catch it — a vertical `margin`/`gap`
   with a raw pixel value instead of a `var(--space-*)` — is described in
   [architecture](architecture.md#how-this-gets-tested) and deliberately not written yet, on the
   standing rule that a CSS-shape check gets folded in the next time one bites. **The scale is held
   by review, not by the script**, and that is a choice rather than an oversight.
5. **Put the dialogs on the scale, or say why not.** They were left off because they are a separate
   surface with their own rhythm and no shared edge with the page, and fixing the page first was the
   smaller change. But `22px`, `20px`, `18px` and `14px` are still doing gap duty inside the sheets,
   which is the exact condition this round existed to remove. It is a smaller version of the same
   job and it should either happen or be written down as permanent.
6. **Take a screenshot set.** Still none in the repo, and cheaper than ever: this round produced
   seven renders on demand and threw all of them away. The only open question is whether they are
   worth committing. `*.png` is gitignored and would need a deliberate `!Screenshots/**` exception —
   your call.
7. **Act on the dark-mode findings, or decide not to.**
   [dark-mode-reference.md](dark-mode-reference.md#8-against-mises-current-dark-tokens) names two:
   nothing sits above `--surface`, so hover and selected have nowhere to go; and `--surface-sunk`
   is **1.08** from `--bg` in dark. Light's half is fixed with `--hover`; dark is still deliberately
   untouched.

## One judgement call left open

**The week bar is centred while the day title and cards are left-aligned.** Navigation on one axis,
content on another. Still open, and this round changed what hangs on it: with 40px now separating
the bar from the day, the two read as clearly separate things, which makes the mixed alignment
either more deliberate or more obviously a mismatch. It is a taste question rather than a
measurement, and you are the one who can say whether it reads as calm or as adrift.

## Three small things open, none urgent

- Google Fonts is the app's first external request; blocked or offline, you get the fallback stack.
  The one place the "static files only" constraint bends.
- `applyTheme()` always stamps `data-theme`, so a dark-OS user gets a light app on first visit
  despite `<meta name="color-scheme" content="light dark">`.
- **Three values are written twice** — the storage key, the `theme-color` fallback hex and the
  bookmark icon path. They cannot be de-duplicated without a build step, which this project does not
  have. `check.mjs` compares all three, so the duplication stays but drifting apart no longer goes
  unnoticed. Listed in [architecture](architecture.md#storage).

These are trade-offs rather than bugs. The known-defect list is empty.

## Screenshots

**None of the app in the repo**, and the standing policy is unchanged: a shot of the wrong version
is worse than none, so stale ones get deleted rather than captioned. The four supplied design
concepts *are* tracked, under `Light mode Mockups/`; shots of the running app are not.

They are **reproducible on demand** rather than dependent on you taking one — see the tooling note
above. This round produced seven and kept none, which is the policy working rather than a waste.
Wanted, if a set is ever committed: the wide layout, an empty day, the picker open, 360px, and dark
mode.

`*.png`, `*.jpg` and `*.jpeg` are gitignored with `!Light mode Mockups/*.png` excepted, because a
camera-named file got committed twice. That exception once named a folder that had been renamed and
silently stopped protecting anything — the four concepts were deleted by a routine docs commit and
nobody noticed for two commits. It now names the folder that exists.

---

**Deeper background:** [architecture](architecture.md) · [decisions](decisions.md) · [log](log.md)
