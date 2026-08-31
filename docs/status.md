# Where things stand

*The one doc that changes every session. Read it first; it is the only one here that goes stale.*

| | |
|---|---|
| **Live** | Code at `7e10f85` (PR [#6](https://github.com/thelivinsine/meal-planner/pull/6), squash-merged), docs on top. Pages `built`. https://thelivinsine.github.io/meal-planner/ |
| **Open work** | **None.** No branch, no PR, no known defect |
| **Confirmed** | You opened the live site after the deploy and called it good — that closes the narrow layout and dark mode, the two things that shipped without a screenshot. **Your eyes, not an image**, so it is not reproducible from the repo |
| **Branches** | `design/bold-consumer` and `feat/slot-picker-and-indian-recipes` are merged and can be deleted whenever |

## Next jobs, in the order they'd earn their place

1. **Open the live site on a phone.** The one gap a desktop cannot close, and the only one left
   that could still hide a real defect: every control is compact on a mouse and only returns to
   the 44px floor under `@media (pointer: coarse)`, a block a desktop never enters.
2. **Take a screenshot set.** There are none, so nothing in the repo shows the current app and the
   confirmation above lives only in a sentence. `*.png` is gitignored, so this needs either a
   `!Screenshots/**` exception in `.gitignore` or keeping them outside the repo — your call which.
   Wanted: the wide layout, an empty day, the narrow layout at 360px, and dark mode.
3. **A keyboard-only pass.** Tab through the week, the picker and both dialogs. Focus restoration
   after a redraw is asserted in five places and driven in none of them.

## Three small things open, none urgent

- Google Fonts is the app's first external request; blocked or offline, you get the fallback
  stack. The one place the "static files only" constraint bends.
- `applyTheme()` always stamps `data-theme`, so a dark-OS user gets a light app on first visit
  despite `<meta name="color-scheme" content="light dark">`.
- The storage key `p5:mealplanner` is written twice — `STORAGE_KEY` in `app.js` and again in the
  inline theme script in `index.html`. Change one, forget the other.

These are trade-offs rather than bugs. The known-defect list is empty.

## One open question, yours to call

**The check scripts are thrown away every session.** Three rounds have now written the same three
throwaways — a stub DOM, a contrast measure, a static wiring sweep — and deleted all of them; 29
assertions last time. Two of the six findings in the pre-merge review were things a *committed*
script would have failed on the day they were written, which is the case for `check.mjs` in one
line. Against it: a test file in a repo whose constraints say no test framework.

The `subgrid` fallback question is closed — the accordion that needed it is gone.

## Screenshots

**None, and the directory is gone too.** There were two of the pre-redesign Week view, deleted
once they went stale rather than left misrepresenting the app. That is the standing policy — a
shot of the wrong version is worse than none — and it has been applied three times now. The old
ones are recoverable from git history if a before-and-after is ever wanted.

`*.png`, `*.jpg` and `*.jpeg` are gitignored with `!Mockups/**` excepted, because a camera-named
file got committed twice. Side effect: a real set now needs a deliberate exception rather than a
`git add`. Descriptive filenames either way — `Screenshot 2026-08-31 151618.png` says nothing
about which version it shows, which is exactly how stale shots survive.

---

**Deeper background:** [architecture](architecture.md) · [decisions](decisions.md) · [log](log.md)
