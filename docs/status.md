# Where things stand

*The one doc that changes every session. Read it first; it is the only one here that goes stale.*

| | |
|---|---|
| **Live** | Code at `eb9ea73` (PR [#8](https://github.com/thelivinsine/meal-planner/pull/8), squash-merged), docs on top. Pages `built` at that commit. https://thelivinsine.github.io/meal-planner/ |
| **Open work** | **None.** No branch, no PR, no known defect. The four follow-ups #7 left are all closed |
| **Confirmed** | You looked at #8 in the browser and called the underline fine, and separately that the longest recipe name wraps cleanly. **Your eyes, not an image**, so neither is reproducible from the repo — and see the caveat under *What just shipped* about what you were not asked to check |
| **Branches** | `design/bold-consumer` and `feat/slot-picker-and-indian-recipes` are merged and can be deleted whenever. `palette-contrast` and `week-affordance-and-landmark` were deleted on merge |

## What just shipped

**PR #8, one commit: the three loose ends #7 left, none related to each other.**

**The recipe name is underlined at rest.** #7 took the filled tile off it — one box per level — and
left `--accent-ink` plus an underline on *hover*, which on a phone is no affordance at all. The line
is there at rest now, at 45% of the ink so it reads as an affordance rather than as a link in prose,
going to full strength on hover so the old feedback is kept rather than traded. Nothing measurable
was broken before: contrast passed, focus still drew the ring. That is why it survived a round, and
it is the reason this is now a rule in `CLAUDE.md` rather than a fix.

**The week landmark has a stable name.** `aria-labelledby` pointed at the greeting `h1`, and the
greeting rotates every load, so the region announced itself differently each visit. A fixed
`aria-label="Week plan"` on the `<section>`; the greeting is untouched and still the visible heading.

**And one stale comment** — `style.css` still called the save glyph a filled star, a round after it
became a bookmark.

`CLAUDE.md` gained both conventions and `docs/decisions.md` both stories, with the code rather than
after it.

### What you confirmed, and what nobody has

You called the underline fine. **You were asked to check three grounds — a card, a past day, and
dark mode — and said only that it looks fine**, so treat the past-day case as unconfirmed: that is
where the 45% line is weakest, sitting on `--surface-past`. It is a fade on a passing ratio, not a
floor, so nothing is known to be wrong. Worth a glance next time you have a past day on screen.

## The four follow-ups #7 left: all closed

1. **The star comment.** Fixed in #8.
2. **The colour-only affordance.** Fixed in #8 — see above, and the caveat with it.
3. **The rotating landmark name.** Fixed in #8.
4. **The long recipe name wrapping.** Closed by eye: *Masala Yoghurt Bowl with Roasted Chana*, the
   catalogue's longest at 40 characters, wraps cleanly. No code change.

## Next jobs, in the order they'd earn their place

1. **Open the live site on a phone.** The one gap a desktop cannot close: every control is compact
   on a mouse and only returns to the 44px floor under `@media (pointer: coarse)`, a block a desktop
   never enters. The week-view round changed several of those sizes — day chips 58→48px, arrows
   32→28px, and the recipe button lost its 46px minimum — so this is less theoretical than it was.
   The floors were re-measured on merge and all three are still lifted to 44px by the coarse block,
   with nothing after it overriding them. That is arithmetic, not a phone.
2. **Take a screenshot set.** There are still none in the repo, so nothing here shows the current
   app. `*.png` is gitignored, so this needs either a `!Screenshots/**` exception or keeping them
   outside the repo — your call which. Wanted: the wide layout, an empty day, the narrow layout at
   360px, and dark mode.
3. **A keyboard-only pass.** Tab through the week, the picker and both dialogs. Focus restoration
   after a redraw is asserted in five places and driven in none of them.

## Three small things open, none urgent

- Google Fonts is the app's first external request; blocked or offline, you get the fallback
  stack. The one place the "static files only" constraint bends.
- `applyTheme()` always stamps `data-theme`, so a dark-OS user gets a light app on first visit
  despite `<meta name="color-scheme" content="light dark">`.
- **Three values are written twice.** The storage key `p5:mealplanner` (`STORAGE_KEY` in `app.js`,
  again in the inline theme script in `index.html`), the `theme-color` fallback hex (tied to the
  palette, left stale once already), and the bookmark icon path (`app.js` renders it, `index.html`
  carries it inline for the sidebar). All three are listed together in
  [architecture](architecture.md#storage).

These are trade-offs rather than bugs. The known-defect list is empty.

## One open question, yours to call

**The check scripts are thrown away every session.** Four rounds have now written the same
throwaways — a stub DOM, a contrast measure, a static wiring sweep — and deleted all of them. The
contrast script was written for the fourth time this round and earned its keep twice in one sitting:
it caught dark `--accent-soft` at **1.01** against the new neutral panel, which would have made
every accent fill invisible on a card, and light `--on-accent` on `--accent` dropping to **4.26**
when the accent was brightened towards the mockup. Both were invisible to the eye and would have
shipped. It was then written a **fifth** time at merge, to re-measure the palette before the button
was pressed, and found one pair the PR had not named — `--bg`/`--surface-sunk` at 1.08 in both
themes, reachable only at `.nav-btn:hover`. That is the case for `check.mjs` in two lines. Against
it: a test file in a repo whose constraints say no test framework.

## Screenshots

**None in the repo.** The ones you took — of the app, and of the two reference dark UIs — live in
the working directory and are gitignored, so **the reasoning in PR #7 cites images nobody else can
see.** That is the cost of the current policy and it is the sharpest it has been: the dark palette
was rebuilt against two pictures that are not in the repo.

The standing policy is unchanged and has been applied four times: a shot of the wrong version is
worse than none, so stale ones get deleted rather than captioned. Old ones are recoverable from git
history if a before-and-after is ever wanted.

`*.png`, `*.jpg` and `*.jpeg` are gitignored with `!Mockups/**` excepted, because a camera-named
file got committed twice. Side effect: a real set now needs a deliberate exception rather than a
`git add`. Descriptive filenames either way — `Screenshot 2026-08-31 155034.png` says nothing about
which version it shows, which is exactly how stale shots survive.

---

**Deeper background:** [architecture](architecture.md) · [decisions](decisions.md) · [log](log.md)
