# Where things stand

*The one doc that changes every session. Read it first; it is the only one here that goes stale.*

| | |
|---|---|
| **Live** | Code at `1dd7a52` (PR [#10](https://github.com/thelivinsine/meal-planner/pull/10), squash-merged). Pages `built` at `1dd7a52`. https://thelivinsine.github.io/meal-planner/ |
| **Open work** | **None.** No branch, no PR, no known defect. Two things parked by choice, both below: the theme button's hover, and the accent-on-accent focus ring |
| **Confirmed** | The new sidebar hover, the 3px focus ring on a chip, a bookmark, a primary button and a recipe card, and the dialog scrim — **your eyes on the running app**, wide light layout only. Earlier and still standing: the underline on all three grounds, the longest recipe name wrapping, **the live site on a phone**. None of it reproducible from the repo |
| **Branches** | `design/bold-consumer` and `feat/slot-picker-and-indian-recipes` are merged and can be deleted whenever. Everything else has been deleted on merge, `light-mode-states` included |

## What just shipped

**PR #10: the light-mode reference report, acted on.**

[light-mode-reference.md](light-mode-reference.md#9-against-mises-current-light-tokens) §9 says the
light palette is **structurally right** — every direction correct, all three text tiers clear. So
this was polish, not a repaint, and **no surface token moved.** Three changes and one bug.

**`--hover`, a hover fill that points down.** The report's one named gap was that no hover or
selected token existed in either theme. The sidebar nav hover was going *up* to `--surface`, which
is the dark-mode direction: a light theme has almost nothing above its surfaces, so state is spent
downward into grey. `#eae4da`, **1.14** on `--bg`, mid-band for the 1.10–1.25 the reference apps
measure at. It also retires the workaround from PR #9 — bare `--surface-sunk` measured 1.08 on the
page, and the fix at the time was to jump over the page to white rather than find a proper step
below it. Controls sitting on a *card* are untouched: `--surface-sunk` is already a correct
downward step at 1.20.

**No `--selected` token, because nothing would use one.** Every selected state in this app is an
accent fill — the pressed chip, the day circle, the current nav item. A neutral selected shade
would have had no consumer.

**Dark is deliberately unchanged.** `--hover` there is `#2b2b2b`, exactly the value the dark sidebar
hover already used. Dark spends state *upward* and has nothing above `--surface` to spend, which is
the open dark-mode finding below — it needs your eye on whether dark mode feels flat, not a hex
picked to close a ticket. Your call was light-only, and that is what shipped.

**The focus ring: 4px, looked at, then 3px.** The reference draws 4px with a gap. It was built that
way, you looked, and it was too loud on this palette — a thick orange band around the search field
rather than a ring. 3px keeps the intent at a weight the accent can carry. **This is the round's
clearest argument for looking:** the number came from a measured reference document and was still
wrong for this app.

**`--scrim`, and the light one drops .50 → .42.** Composites to `#9a9591`, **2.97** over white
against the reference's 2.93. Worth recording honestly: the old value was *not* the "heavy black"
the report warns against — it measured 3.7 — so this was a smaller correction than it sounded, and
it was checked against a screenshot before being kept. Dark keeps .50: darkening a dark page does
nothing.

### The bug a keyboard found

**The focus ring on a recipe card was clipped, and had been all along.** `.card-open` is flush with
the card's edges and `.card` clips its overflow — it has to, or the accent button in the foot would
square off the rounded corner — so the ring was cut on three sides and showed only as a stray orange
rule across the middle of the card. At 2px nobody had noticed; 3px made it obvious.

It took two attempts, and the second is the part worth keeping. A negative `outline-offset` drew the
ring inside, and the top corners were *still* square against the card's 13px curve: **an outline
follows its element's own `border-radius`**, and `.card-open` has none, so it fell back to the 4px in
the global `:focus-visible` rule. It now carries the card's top radius too.

**Neither the contrast script nor a screenshot of a resting page could have found this.** It took
pressing Tab — which is job 2 on the list below, still only a quarter done.

### Two things looked at and left

- **The ring on an accent-filled button is orange-on-orange**, separated only by the 2px gap. It is
  legible — 4.74 against the white card behind it, and the offset gap is exactly what the reference
  relies on — but it reads as a blob rather than a ring. Raised, seen, not answered.
- **The theme button's hover** from PR #9 is still unlooked-at. Unchanged this round.

## The phone gap is closed

**You opened the live site on a phone and it works well.** That was the top job here for four
rounds and the one thing a desktop could not do: every control is compact on a fine pointer and
only returns to the 44px floor inside `@media (pointer: coarse)`, a block a desktop browser never
enters. The week round had shrunk several of them — day chips 58→48px, arrows 32→28px, the recipe
button losing its 46px minimum — and the merge check was arithmetic: the coarse block still lifts
all three, nothing after it overrides them. Now a thumb agrees with the arithmetic.

**Your eyes, not a screenshot**, and no device or browser was named, so this is one phone rather
than a matrix. It does not need re-doing per round — but a change to any control's size puts it
back on the list.

## Next jobs, in the order they'd earn their place

1. **Finish the keyboard pass.** PR #10 started one and it immediately paid: tabbing found the
   clipped card ring, which no script and no screenshot of a resting page could see. What was
   covered is the recipe grid and the sidebar, in light mode, on a wide screen. **Not covered: the
   week view, the inline slot picker, and either dialog end to end** — which is where the
   interesting part is, because focus restoration after a redraw is asserted in five places and
   driven in none of them. This is still the biggest untested thing left, and the section it lives
   under says every defect this project has shipped has been an accessibility defect.
2. **Look at the round's changes in dark mode and at narrow widths.** No dark value changed in #10,
   but the 3px ring and the `.card-open` radius apply in both themes and at every width, and have
   only been seen in light on a wide screen. Outlines do not affect layout, so the 44px floor is
   safe by arithmetic — which is the kind of claim this project has learned to distrust on its own.
3. **Take a screenshot set.** There are still none in the repo, so nothing here shows the current
   app. `*.png` is gitignored, so this needs either a `!Screenshots/**` exception or keeping them
   outside the repo — your call which. Wanted: the wide layout, an empty day, the narrow layout at
   360px, and dark mode.
4. **Act on the dark-mode findings, or decide not to.** [dark-mode-reference.md](dark-mode-reference.md#8-against-mises-current-dark-tokens)
   names two: there is no token above `--surface`, so hover and selected states have nowhere to go
   and the nesting ladder ends one level up from the page; and `--surface-sunk` sits **1.08** from
   `--bg` in dark, the same token that is correct in light. Both are measured, neither is a defect,
   and moving a surface token means new pairs in `check.mjs` **and** a browser. **#10 sharpened
   this rather than closing it:** light's half of the same gap is now fixed with `--hover`, and dark
   was left alone on purpose, so the two themes are deliberately asymmetric until you look.

## Three small things open, none urgent

- Google Fonts is the app's first external request; blocked or offline, you get the fallback
  stack. The one place the "static files only" constraint bends.
- `applyTheme()` always stamps `data-theme`, so a dark-OS user gets a light app on first visit
  despite `<meta name="color-scheme" content="light dark">`.
- **Three values are written twice** — the storage key `p5:mealplanner`, the `theme-color` fallback
  hex and the bookmark icon path, each in both `app.js`/`style.css` and `index.html`. They cannot be
  de-duplicated without a build step, which this project does not have. **`check.mjs` now compares
  all three**, so the duplication stays but drifting apart no longer goes unnoticed — which is what
  happened to the `theme-color` hex once. Listed in [architecture](architecture.md#storage).

These are trade-offs rather than bugs. The known-defect list is empty.

## Screenshots

**None of the app in the repo.** The four supplied design concepts *are* tracked, under
`Light mode Mockups/`; shots of the running app are not, and neither are the reference UIs.

**The reference gap is now mostly closed.** PR #7's reasoning cited dark-mode reference images
nobody else could see. Those images, and a light-mode set added since, have been decoded and
written up as [dark-mode-reference.md](dark-mode-reference.md) and
[light-mode-reference.md](light-mode-reference.md): every hex read out of the pixels, every ratio
computed. Someone can now check the palette reasoning without the pictures. Shots of *this app*
remain the real gap.

The standing policy is unchanged and has been applied four times: a shot of the wrong version is
worse than none, so stale ones get deleted rather than captioned. Old ones are recoverable from git
history if a before-and-after is ever wanted.

`*.png`, `*.jpg` and `*.jpeg` are gitignored with `!Light mode Mockups/*.png` excepted, because a
camera-named file got committed twice. **That exception used to name `Mockups/` and silently
stopped protecting anything** when the folder was renamed on disk — the four concepts were deleted
from the repo by a routine docs commit and nobody noticed for two commits. Restored from
`f58bf0f`, and the exception now names the folder that exists. It is `*.png` rather than `**` so
the `Other references/` shots inside it stay out. Side effect: a real set now needs a deliberate exception rather than a
`git add`. Descriptive filenames either way — `Screenshot 2026-08-31 155034.png` says nothing about
which version it shows, which is exactly how stale shots survive.

---

**Deeper background:** [architecture](architecture.md) · [decisions](decisions.md) · [log](log.md)
