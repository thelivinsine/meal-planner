# Where things stand

*The one doc that changes every session. Read it first; it is the only one here that goes stale.*

| | |
|---|---|
| **Live** | Code at `88e27d0` (PR [#7](https://github.com/thelivinsine/meal-planner/pull/7), squash-merged), docs on top. Pages `built`. https://thelivinsine.github.io/meal-planner/ |
| **Open work** | [PR #8](https://github.com/thelivinsine/meal-planner/pull/8) on `week-affordance-and-landmark`: three of the four follow-ups, **none of it rendered yet**. No known defect |
| **Confirmed** | You checked the latest changes in your browser and called the whole PR good — that closes all three commits, including the icon-and-token one that had been seen by nobody. **Your eyes, not an image**, so it is not reproducible from the repo |
| **Branches** | `design/bold-consumer` and `feat/slot-picker-and-indian-recipes` are merged and can be deleted whenever. `palette-contrast` was deleted on merge |

## What just shipped

Three commits, three problems, all found in screenshots you took of the running app.

**The palette.** Light mode read as one beige wash: a heavy page (`#f2ece5`) plus heavy inner tiles
(`#ebe3da`) left the white card as the only bright thing on screen. Every ratio passed and it still
looked wrong beside `Mockups/Desktop - Concept A.png`. Page → `#f6f3ee`, card → `#ffffff`. Dark
mode's surfaces went **neutral grey**, taken from two reference dark UIs you supplied, because the
brown it had been read muddy rather than warm at that lightness. The orange is untouched in role and
now carries all the colour. The summary column also moved down to start level with the week bar,
which meant taking the week heading out of `.week-main` so the grid could give it a row of its own.

**The week view.** The rotating `WEEK_GREETINGS` heading is back, one line, no subtitle, centred
over the content column. The week bar came down a notch on every dimension and the meal cards took
the room — the bar is navigation, the cards are the content.

**The boxes, and one token.** The save control became a **bookmark**, the same path as the sidebar's
*Saved* icon, replacing a star that said *rate* rather than *keep*. It lost its border, and the
recipe inside a meal card lost its filled tile — the name carries the affordance now. And `--bg`
stopped filling anything inside a card: tags, time pills, filter chips and the search field all
moved to `--surface-sunk`, because with dark mode neutral a pill filled with the page shade read as
a hole punched through the tile. Those fills were wrong all along and cost nothing while the page
sat close in lightness to the tiles — **a token used off its own layer is latent, not harmless**,
and what exposed it was a palette change two commits earlier.

`CLAUDE.md` gained the five conventions these changes established, and it shipped with the code
rather than in the docs sweep, so `main` is no longer a version behind.

## Four follow-ups: three in a PR, one closed

Items 1–3 are all in [PR #8](https://github.com/thelivinsine/meal-planner/pull/8), open and
unmerged. **Nothing in it has been rendered** — the browser extension would not connect the session
that wrote it, so the underline is a visual judgement nobody has made yet.

1. **`style.css` still calls the save glyph a star.** Comment above `.bookmark`, text only. *Fixed in
   #8.*
2. **The recipe name is a colour-only affordance until hover** — and touch has no hover. It is the
   app's most-used control and it had no box, no fill and no underline at rest, only `--accent-ink`.
   Contrast passes (5.95 on a card, 5.61 on a past one) and focus still gets the global ring, so no
   stated floor was broken; it was the touch case that made an underline the better call. *#8
   underlines it at rest in `--accent-ink` at 45%, hover to `currentColor`* — **unlooked-at, and the
   fade is weakest on a past day.**
3. **`aria-labelledby="week-heading"` names the week region with a random greeting**, so the
   landmark name changed on every load. *#8 gives the `<section>` a fixed `aria-label="Week plan"`;
   the greeting stays the visible `h1`.*
4. ~~**The recipe name at `1.125rem` display weight may wrap** in a narrow card.~~ **Closed.** You
   looked at the catalogue's longest name, *Masala Yoghurt Bowl with Roasted Chana* (40 characters),
   and it wraps cleanly. Your eyes, not an image, so it is not reproducible from the repo.

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
