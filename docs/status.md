# Where things stand

*The one doc that changes every session. Read it first; it is the only one here that goes stale.*

| | |
|---|---|
| **Live** | Code at `2339d05` (PR [#11](https://github.com/thelivinsine/meal-planner/pull/11), squash-merged). Pages `built` at `2339d05`. https://thelivinsine.github.io/meal-planner/ |
| **Open work** | **None.** No branch, no PR, no known defect. Three things parked by choice: the theme button's hover, the accent-on-accent focus ring, and the dark-mode token findings |
| **Confirmed** | The picker replacing the day, the dissolved week bar and the ring on a planned day — **your eyes on the running app**, wide light layout, across four screenshots this round. Plus headless Chrome at 1254 / 760 / 360px in light mode, which is reproducible from the repo and is new. Earlier and still standing: the 3px focus ring and sidebar hover, the underline on all three grounds, **the live site on a phone** |
| **Branches** | `design/bold-consumer` is merged and can be deleted whenever. Everything else has been deleted on merge, `day-takeover-picker` included |

## What just shipped

**PR #11: adding a meal takes over the day, and the week bar stops being a tile.**

**The picker replaces the day instead of sitting under it.** It used to open *below* the three meal
cards, which put the recipes you were choosing from below the fold — you tapped **+ Add** and then
scrolled past what you had just left. Now `.day-title` and `.meals` go `hidden`, the panel draws in
their place, and **Back to the day** is the way out: navigation, not a close ×, because this
replaced a view rather than covering one. The week bar, the sidebar and the summary column never
move, so changing day is still one tap — and doing so closes the picker, since the slot it was
filling is gone.

**It finishes on the screen.** `sizeSlotPicker()` measures the room rather than guessing a `vh`
figure, because what sits above it is not a fixed height — a greeting that wraps, a bar that grows
a **Today** button. `.pick-grid` scrolls inside what is left and the page itself does not scroll.

**The week bar dissolved** — no fill, no border, no radius — so the meal cards are the only boxes
on the week, and it is capped at 520px and centred, because seven chips sharing the full column had
stopped reading as one week. **Both of its fills had to be re-picked as a consequence**:
`--surface-sunk` measures 1.08 against the page in both themes, so the chip hover moved to
`--hover` and the tint on a planned day became an `--accent` **ring**. One shape, three states —
bare, ringed, filled.

**Three new pairs in `check.mjs` and not one new token.** `--ink-soft` and `--ink-faint` on
`--hover`, and `--accent` beside `--hover`. Moving existing tokens onto a new ground is enough to
make a combination nobody was measuring — which is the half of that rule that gets missed. 76
checks, all passing.

**Also:** back link left, heading centred over the cards, search on the row below; and opening the
picker no longer parks a caret in the search box, which was the app's only automatic focus into a
field.

### Three defects, and how each was found

- **Every recipe card collapsed to a 2px strip** — two dozen blank white rows. `flex: 1` gave
  `.pick-grid` a definite height, and `auto` grid rows in a definite-height grid have the height
  *divided among them* rather than sized to content. **Your screenshot found it**; a headless
  browser measured it (`.card` 2.0px with a 125px child inside, clipped by the card's own
  `overflow`); `grid-auto-rows: min-content` fixed it.
- **The page kept a scrollbar, through two rounds of you pointing at it.** The panel was measuring
  to the bottom of the *window*, but `.page` carries its own bottom padding **below** it and that
  counts towards document height — 24px wide, ~50px narrow. The floor is that padding now, which is
  also exactly the space reserved to clear the nav pill under 1000px. Sub-pixel rounding still left
  2px, so it reads `scrollHeight` back and corrects rather than trusting the arithmetic.
- **The save button's focus restoration could aim at a hidden button.** Hiding the day left its
  bookmark buttons in the DOM, *earlier* in document order than the picker's, so bookmarking from
  the picker while the same recipe was planned in another meal that day dropped focus to `<body>`.
  **Found by reviewing the branch's own diff**, not by using the app.

## The tooling changed, and it matters

**The Chrome extension would not connect for a fifth round running — but Chrome runs headless from
the shell.** `chrome --headless --screenshot` renders the app, and `--dump-dom` will hand back
anything the page can compute. That covers both halves of the gap this project keeps hitting:

- **It renders**, so a layout change can be looked at without waiting for you. Three widths this
  round: 1254px, 760px and 360px. Windows will not open a real window under ~500px wide, so 360px
  is tested by loading the app in a 360px `<iframe>`, which gets its own viewport for media queries.
- **It answers questions a picture cannot.** `activeElement`, `scrollHeight`, a computed height.
  Two of the three defects above were confirmed that way — one of them by running the *old* code's
  expression and watching it resolve to a hidden button.

Two cautions worth carrying forward. A script calling `.click()` is **not** a keyboard, so this
does not close the keyboard pass. And measuring during an opening animation gives a wrong answer —
the panel is 8px high for the first frame, so everything here is measured after it settles.

## Next jobs, in the order they'd earn their place

1. **Look at this round in dark mode.** Nothing shipped this round was seen in it. No dark token
   moved, but the ring on a planned day, the dissolved bar, the centred head and the measured
   panel all apply in both themes — and the ring is the only thing now marking a planned day, so
   if it reads weakly anywhere it will read weakly there. Cheapest job on the list and the one with
   the most recent code behind it.
2. **Finish the keyboard pass.** Unchanged in substance and now slightly larger: focus restoration
   after a redraw is asserted in **six** places and driven by a person in none. Two are exercised
   by a scripted headless check, which is not tabbing. Not covered: the week view, the slot picker
   and either dialog end to end. The section this lives under says every defect this project has
   shipped has been an accessibility defect, and this round added one and caught it in review.
3. **A phone again.** `.slot-back` is new and sits in the `pointer: coarse` list; the floor is
   arithmetic once more, and no desktop browser enters that block. The picker also fills the screen
   on a phone now, where the keyboard used to cover it — which is exactly the case that changed.
4. **Take a screenshot set.** Still none in the repo. This round finally makes it cheap: the
   headless command produces them on demand, so the only open question is whether they are worth
   committing. `*.png` is gitignored and would need a deliberate `!Screenshots/**` exception —
   your call.
5. **Act on the dark-mode findings, or decide not to.**
   [dark-mode-reference.md](dark-mode-reference.md#8-against-mises-current-dark-tokens) names two:
   nothing sits above `--surface`, so hover and selected have nowhere to go; and `--surface-sunk`
   is **1.08** from `--bg` in dark. **This round sharpened the second one again** — that 1.08 is
   exactly why the day chips could not keep a neutral fill once the bar dissolved. Light's half is
   fixed with `--hover`; dark is still deliberately untouched.

## One judgement call left open

**The week bar is centred while the day title and cards are left-aligned.** Navigation on one axis,
content on another. It looks deliberate in every shot taken this round, but it is a taste question
rather than a measurement, and you are the one who can say whether it reads as calm or as adrift.

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

What changed this round is that they are now **reproducible on demand** rather than dependent on
you taking one — see the tooling note above. Wanted, if a set is ever committed: the wide layout,
an empty day, the picker open, 360px, and dark mode.

`*.png`, `*.jpg` and `*.jpeg` are gitignored with `!Light mode Mockups/*.png` excepted, because a
camera-named file got committed twice. That exception once named a folder that had been renamed and
silently stopped protecting anything — the four concepts were deleted by a routine docs commit and
nobody noticed for two commits. It now names the folder that exists.

---

**Deeper background:** [architecture](architecture.md) · [decisions](decisions.md) · [log](log.md)
