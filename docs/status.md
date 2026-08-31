# Where things stand

*The one doc that changes every session. Read it first; it is the only one here that goes stale.*

| | |
|---|---|
| **Live** | Code at `6e27431` (PR [#9](https://github.com/thelivinsine/meal-planner/pull/9), squash-merged); docs on top through `5a5ec57`, markdown only, no code touched. Pages `built` at `5a5ec57`. https://thelivinsine.github.io/meal-planner/ |
| **Open work** | **None.** No branch, no PR, no known defect. One thing parked by choice: the theme button's hover, below |
| **Confirmed** | The underline on all three grounds, the longest recipe name wrapping, **the live site on a phone**, and the sidebar nav hover. **Your eyes, not images**, so none of it is reproducible from the repo. The theme button's hover is *not* on this list — see below |
| **Branches** | `design/bold-consumer` and `feat/slot-picker-and-indian-recipes` are merged and can be deleted whenever. `palette-contrast`, `week-affordance-and-landmark` and `check-script` were deleted on merge |

## What just shipped

**PR #9: `check.mjs`, and the first thing it found.**

**The script is saved instead of rewritten.** One file at the repo root, no dependencies, no config,
no runner, never served to a browser. `node check.mjs` prints a tick or a cross per check and exits
non-zero if any fail. It replaces three throwaways written and deleted five times between them, two
of which had caught things no eye could catch. 66 checks: contrast in both themes and both
directions with the tokens read out of `style.css`, the action and id wiring, and the three values
written twice. The hairline rule is encoded rather than described — a pair marked `line:` is allowed
under 1.10 and its **line** is measured instead, against both sides.

**It failed on its first run**, on `--surface-sunk` beside `--bg` at **1.08** — the pair found at
PR #7's merge and left. Fixed rather than excused: `.nav-btn:hover` in the sidebar, where the nav
unwinds to no fill of its own and so lands on the page, now uses `--surface` (1.11 light, 1.23
dark). The token itself could not move — in dark mode the only value clearing 1.10 against both
`--bg` and `--surface` is `#232323`, which is `--surface-past`, and two tokens on one shade means a
tray inside a past card has no edge at all. The pair then **left the script's list** rather than
being marked known, with a comment saying to put it back if a bare sunk fill lands on the page
again; `--line-strong` on `--bg` took its slot.

### The one the script could not have caught

`.theme-btn:hover` was changed alongside the nav button on the reasoning that both put a sunk fill
on the page. **Only the sidebar one did.** The theme button carries `background: var(--surface)` at
rest, so its hover sits on that, not on `--bg` — and setting it to `--surface` made the rule a
no-op, leaving only the icon colour changing. Every token involved stayed legal and every pair still
measured fine, so **a contrast script is blind to a rule that changes nothing**. It took a mouse.
The lesson is now in `architecture.md`: *a fill has to differ from what the control sits on, not
from the page behind it.* Reverted to `--surface-sunk`, which measures 1.20 light and 1.14 dark
against the button.

**That revert has not been looked at.** You said it was fine to come back to later, so it shipped
measured but unseen: hovering the theme button should give a faint grey panel, not just a darker
icon. Nothing else on the page uses that rule, and both numbers clear the floor — it is a look, not
a risk.

## The four follow-ups #7 left: all closed

1. **The star comment.** Fixed in #8.
2. **The colour-only affordance.** Fixed in #8 — see above, and the caveat with it.
3. **The rotating landmark name.** Fixed in #8.
4. **The long recipe name wrapping.** Closed by eye: *Masala Yoghurt Bowl with Roasted Chana*, the
   catalogue's longest at 40 characters, wraps cleanly. No code change.

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

1. **Take a screenshot set.** There are still none in the repo, so nothing here shows the current
   app. `*.png` is gitignored, so this needs either a `!Screenshots/**` exception or keeping them
   outside the repo — your call which. Wanted: the wide layout, an empty day, the narrow layout at
   360px, and dark mode.
2. **A keyboard-only pass.** Tab through the week, the picker and both dialogs. Focus restoration
   after a redraw is asserted in five places and driven in none of them. **This is now the biggest
   untested thing left**, and the section it lives under says every defect this project has shipped
   has been an accessibility defect.
3. **Act on the dark-mode findings, or decide not to.** [dark-mode-reference.md](dark-mode-reference.md#8-against-mises-current-dark-tokens)
   names two: there is no token above `--surface`, so hover and selected states have nowhere to go
   and the nesting ladder ends one level up from the page; and `--surface-sunk` sits **1.08** from
   `--bg` in dark, the same token that is correct in light. Both are measured, neither is a defect,
   and moving a surface token means new pairs in `check.mjs` **and** a browser. Wants your eye on
   whether dark mode actually feels flat before any hex changes.

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

## The open question is closed

**`check.mjs` exists.** The argument for it — five rewrites, two saves — is above; the argument
against was that a file that looks like a test invites someone to grow a suite around it. That risk
is unchanged and now lives in a comment at the top of the file. `CLAUDE.md` says to run it after
touching tokens and, more importantly, **to add new pairs to its list**: a combination not in that
list is one nobody measures, which is the way this check will rot if it rots.

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
