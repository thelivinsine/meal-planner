# Where things stand

*The one doc that changes every session. Read it first; it is the only one here that goes stale.*

| | |
|---|---|
| **Live** | Code at `7e10f85` (PR [#6](https://github.com/thelivinsine/meal-planner/pull/6), squash-merged), docs on top. Pages `built`. https://thelivinsine.github.io/meal-planner/ |
| **Open work** | Branch **`palette-contrast`**, PR [#7](https://github.com/thelivinsine/meal-planner/pull/7), **three** commits, **open**. A palette round, a week-view round and an icon-and-token round, all from your screenshots. Nothing in it is on the live site |
| **Confirmed** | You opened the branch locally after the palette commit and again after the week-view commit, and called both good. **Your eyes, not an image.** The third commit has not been looked at by anyone |
| **Branches** | `design/bold-consumer` and `feat/slot-picker-and-indian-recipes` are merged and can be deleted whenever |

## What is in PR #7

Two commits, four problems each, all from screenshots you took.

**`96743b3` — palette.** Light mode read as one beige wash: a heavy page (`#f2ece5`) plus heavy
inner tiles (`#ebe3da`) left the white card as the only bright thing on screen. Every ratio passed
and it still looked wrong beside `Mockups/Desktop - Concept A.png`. The page went to `#f6f3ee` and
the card to `#ffffff`. Dark mode's surfaces went **neutral grey**, taken from two reference dark
UIs you supplied — ChatGPT's settings sheet and the Windows PowerToys panels — because the brown
it had been read muddy rather than warm at that lightness. The orange is untouched and now carries
all the colour. The summary column also moved down to start level with the week bar.

**`9e554dd` — the week view.** The rotating `WEEK_GREETINGS` heading is back, one line, no
subtitle, centred over the content column. The week bar came down a notch on every dimension and
the meal cards took the room. The save control lost its border. The recipe inside a meal card lost
its filled tile — the name carries the affordance now.

**`4f66fb1` — icons and one token.** The save control is a **bookmark**, the same path as the
sidebar's *Saved* icon, replacing a star that said *rate* rather than *keep*. And `--bg` stopped
filling anything inside a card: tags, time pills, filter chips and the search field all moved to
`--surface-sunk`, because with dark mode now neutral a pill filled with the page shade read as a
hole punched through the tile. The `--bg` fills were wrong all along and cost nothing while the
page was close in lightness to the tiles — **a token used off its own layer is latent, not
harmless**, and what exposed it was a palette change two commits earlier.

**Five `CLAUDE.md` conventions moved with the code**, so `CLAUDE.md` on `main` is a version behind
until #7 merges: one box per level, view heads, the week bar staying compact, `--bg` being the page
and nothing else, and one shape for one idea.
That is the one file the docs sweep deliberately left alone, to keep the squash-merge clean.

## The gap in PR #7, stated plainly

**Neither commit was rendered by me.** The Chrome extension refused to connect for the whole
session, twice. So:

- The first two commits are measured, not seen — but *you* saw both and approved them, which
  closes them.
- **The third commit is seen by nobody.** It is the smallest of the three and the least likely to
  hide a layout fault, but two things in it are guesses about how something looks: whether the
  bookmark glyph reads at 18px in a 30px button as well as the star did at 19px, and whether
  `--surface-sunk` pills on a `--surface` card are distinct enough in *light* mode, where the pair
  is 1.20 apart but both are nearly white.
- Still unmeasured from the week-view commit: the compaction figures (the bar comes down roughly
  122px → 100px, computed from padding and line heights, not measured), and the heading centring,
  which places all three `.view-week` items by hand. If any of those placements is wrong the
  *aside* moves, not the heading — so the thing worth a glance is that the summary column still
  starts level with the week bar.
- One unlooked-at detail: the recipe name at `1.125rem` display weight may wrap in a narrow card on
  a long Indian recipe name.

## Next jobs, in the order they'd earn their place

1. **Look at PR #7 and merge or send it back.** It is the only open work, and its last commit is
   unverified by anyone.
2. **Open the live site on a phone.** The one gap a desktop cannot close: every control is compact
   on a mouse and only returns to the 44px floor under `@media (pointer: coarse)`, a block a
   desktop never enters. The week-view round changed several of those sizes, so this is now less
   theoretical than it was.
3. **Take a screenshot set.** There are still none in the repo, so nothing here shows the current
   app. `*.png` is gitignored, so this needs either a `!Screenshots/**` exception or keeping them
   outside the repo — your call which. Wanted: the wide layout, an empty day, the narrow layout at
   360px, and dark mode.
4. **A keyboard-only pass.** Tab through the week, the picker and both dialogs. Focus restoration
   after a redraw is asserted in five places and driven in none of them.

## Three small things open, none urgent

- Google Fonts is the app's first external request; blocked or offline, you get the fallback
  stack. The one place the "static files only" constraint bends.
- `applyTheme()` always stamps `data-theme`, so a dark-OS user gets a light app on first visit
  despite `<meta name="color-scheme" content="light dark">`.
- The storage key `p5:mealplanner` is written twice — `STORAGE_KEY` in `app.js` and again in the
  inline theme script in `index.html`. Change one, forget the other. It is one of **three** values
  written twice — the others are the `theme-color` fallback hex, tied to the palette and left stale
  once already, and now the bookmark icon path, which `app.js` renders and `index.html` also carries
  inline for the sidebar. All three are listed together in
  [architecture](architecture.md#storage).

These are trade-offs rather than bugs. The known-defect list is empty.

## One open question, yours to call

**The check scripts are thrown away every session.** Four rounds have now written the same
throwaways — a stub DOM, a contrast measure, a static wiring sweep — and deleted all of them. This
round wrote the contrast script for the fourth time, and it earned its keep twice in one sitting:
it caught dark `--accent-soft` at **1.01** against a neutral panel, which would have made every
accent fill invisible on a card, and it caught the light `--on-accent` on `--accent` pair dropping
to 4.26 when the accent was brightened towards the mockup. Both were invisible to the eye and
would have shipped. That is the case for `check.mjs` in two lines. Against it: a test file in a
repo whose constraints say no test framework.

## Screenshots

**None in the repo.** The ones you took this session — of the app, and of the two reference dark
UIs — live in the working directory and are gitignored, so **the reasoning in PR #7 cites images
nobody else can see.** That is the cost of the current policy, and it is the sharpest it has been:
the dark palette was rebuilt against two pictures that are not in the repo.

The standing policy is unchanged and has been applied four times: a shot of the wrong version is
worse than none, so stale ones get deleted rather than captioned. Old ones are recoverable from git
history if a before-and-after is ever wanted.

`*.png`, `*.jpg` and `*.jpeg` are gitignored with `!Mockups/**` excepted, because a camera-named
file got committed twice. Side effect: a real set needs a deliberate exception rather than a
`git add`. Descriptive filenames either way — `Screenshot 2026-08-31 155034.png` says nothing about
which version it shows, which is exactly how stale shots survive.

---

**Deeper background:** [architecture](architecture.md) · [decisions](decisions.md) · [log](log.md)
