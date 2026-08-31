# Development log

*Append-only. What happened, in order. The reasoning behind any choice is in
[decisions.md](decisions.md); the current state is in [status.md](status.md).*

| | |
|---|---|
| **Setup** | Repo created; project constraints written into `CLAUDE.md` — vanilla JS only, browser storage only, GitHub Pages as the target |
| **Scope** | Settled on v1: three views, ~25 recipes, week planning, bookmarks. Month calendar and drag-and-drop explicitly excluded |
| **v1 built** | `index.html` / `style.css` / `app.js` on branch `feat/v1-meal-planner`. Week view moved to real dates during planning, at your request |
| **First review** | Two changes from your feedback: past days now visually distinct from upcoming ones, and the day dropdown in the add dialog became a grid of day buttons |
| **Published** | Merged to `main` and pushed to GitHub as a public repo |
| **Second round** | Branch `feat/slot-picker-and-indian-recipes`: the slot's **+ Add** now opens the recipe list inline under the week instead of asking for the day and meal a second time, and the catalogue grew to 50 with 27 Indian and 38 high-protein recipes |
| **Deployed** | Second round merged to `main`; GitHub Pages serving `main` at the root |
| **UI round** | Branch `feat/ui-polish`, from your notes on the v1 screenshots: week rows aligned with `subgrid`, nested boxes removed, filters grouped and collapsible, the add sheet re-weighted around the recipe name, and a view-the-recipe route out of the week picker |
| **Card unified** | Same branch, at your request: the week's slot picker dropped its own row design and now draws the Recipes card, with only the primary button differing |
| **Contrast** | One wrong turn, recorded in full under [decisions](decisions.md#one-wrong-turn-worth-recording): a local figure/ground problem got a global palette fix, which was wrong and was reverted |
| **Review** | PR #2 read back against its own description before merging. Four small things: past days had lost their accent-free hover when an override was deleted, and three figures in the docs were stale. Two flagged and deliberately kept — the app-wide `[hidden]` rule, and 38px week rows on a fine pointer |
| **UI round merged** | PR [#2](https://github.com/thelivinsine/meal-planner/pull/2) squash-merged to `main` as `409d7d2`, then `f60a79d` for the notes. The stale v1 screenshots were deleted; no fresh set yet |
| **Narrow week** | Branch `mobile-week`. Started as a CSS-only compaction of the meal rows below 1000px, then grew on the same branch into the day strip: seven day buttons plus the one day they select, the same card as the wide layout with six hidden. `focusDay` added to state, not persisted |
| **Reviewed twice** | The first review covered the compaction and produced one fixup — a duplicate `@media (max-width: 1000px)` block folded back into the existing one, which had been sitting after the 620px block and overriding it. The branch then grew two more commits, so the PR was re-read from scratch. That pass found three defects, which shipped open and were fixed a round later |
| **Merged anyway** | PR [#3](https://github.com/thelivinsine/meal-planner/pull/3) squash-merged to `main` as `236ce5b` with the three defects open, at your call |
| **Seen at last** | You took screenshots of the Week view and committed them to `main` as `f0dfe07`. The wide week and the day strip both looked right. Two of the four turned out to be of an older version and were deleted rather than left to mislead |
| **Two directions** | Two redesign proposals opened side by side off the same `main`: PR #4, bold consumer product, and PR #5, app shell / control surface. Nine rounds of feedback into #4 before it was reviewed |
| **Reviewed** | PR #4 read against its own description. Three real defects: the recipe dialog had no way to fill the slot it was opened from, `display: none` on the day `<h2>` had come back one selector along after being listed as fixed, and the open day's header was an `aria-expanded="true"` button that could not collapse anything. All three fixed on the branch, with 21 stub-DOM assertions. Two camera-named screenshots that nothing referenced were dropped from the diff |
| **Direction A shipped** | PR [#4](https://github.com/thelivinsine/meal-planner/pull/4) squash-merged to `main` as `49b3c16`. The branch was kept, not deleted, at your request |
| **Direction B closed** | PR [#5](https://github.com/thelivinsine/meal-planner/pull/5) closed and `design/app-shell` deleted. It conflicted with `main` the moment A merged — both proposals rewrote the same three files — and rebasing would have meant rewriting it. The table-shaped week is the part worth bringing back |
| **Docs corrected** | Several rounds of notes had hardened into "nobody has ever opened this app in a browser", which was simply false — you check it in a browser as you iterate. Corrected. The real gap is narrower: a real phone, and a keyboard-only pass |
| **Mockups supplied** | You added three desktop concepts and three mobile ones, committed to `main` as `f58bf0f` under `Mockups/` — reference material, so no branch |
| **Concept A built** | Branch `sidebar-day-view`: Concept A's desktop layout with Concept C's right-hand column, and Concept C's mobile view minus its vertical timeline. The seven-column accordion and everything holding it up came out. **Not looked at in a browser by either of us at this point** — the Chrome tooling was unavailable, so the checks were reading, 19 stub-DOM assertions, computed contrast and static wiring only |
| **Screenshots found six flaws** | You opened it and shot it wide and narrow. The wide layout was rendering at a third of its width; the `min-width: 1001px` block was partly dead on source order; the palette read as one cream wash; empty meal cards were 140px tall; the day row wrapped from 620px instead of 400px; and the nav pill landed on a tap target. All six fixed in `01239e8`. **The lesson worth keeping: reading the CSS twice found none of this. One screenshot found all of it** |
| **Fixes confirmed wide** | A third screenshot showed the wide light layout right — main column about 2.8× the summary column and filling the width, and the derived panels correct on a full day (3/3 planned, 37 min, *Protein-heavy*, all-protein tip firing). Narrow and dark still unseen |
| **Docs split from the feature** | At your request the documentation went straight to `main` — allowed, and the only thing that is — leaving PR #6 as a code-only diff |
| **Reviewing the diff found six more** | Asked to review the PR's own diff before merging. Three were real: `theme-color` only half-fixed and keyed to the wrong signal, the **Today** button dropping keyboard focus, and dark `--surface-past` darker than the page at 1.02 against it. Also: two id selectors turned back into classes, two classes emitted with no CSS rule deleted, `*.png` gitignored. **The lesson pairs with the screenshot one** — all six were invisible to the eye and visible to a script |
| **Three old defects closed on the way** | Shipped with Concept A: the `is-upcoming` class that no CSS rule matched is gone (the "no class without a rule" static check exists because of it), toggling Save no longer throws keyboard focus away, and the missing week date-range line is back in the week bar |
| **Concept A shipped** | PR #6 squash-merged to `main` as `7e10f85`, branch deleted, Pages `built`. You looked at it locally before telling me to merge, but it wasn't shot, and the dark past-day colour had changed since the one screenshot that existed. Shipping ahead of a screenshot was your call and was recorded as such rather than left to read as verified |
| **Confirmed on the live site** | You opened the deployed site and called it good, closing the narrow layout and dark mode. Recorded as your look, not an image — the repo still holds no picture of the current app |
| **Docs restructured** | This split: `README.md` back to a front door for a reviewer, `CLAUDE.md` to rules an agent must follow, and `docs/` for status, architecture, decisions and this log. `README.md` had reached 529 lines doing six unrelated jobs, and `CLAUDE.md` was 20 over its own budget because reasoning had nowhere else to live |
| **Palette round** | Branch `palette-contrast`, from three screenshots of the shipped app plus two of reference dark UIs (ChatGPT settings, Windows PowerToys). Light mode read as one beige wash despite passing every ratio, so the page went near-white and the card white, per Concept A. Dark mode's surfaces went neutral grey, taken from the references, with the app's orange left in charge of all the colour — brown that dark had read muddy. The summary column moved down to start level with the week bar, which meant taking the week heading out of `.week-main` so the grid could give it a row of its own. **Not rendered by me — the Chrome extension refused to connect all session.** You opened it locally and called it good, light and dark |
| **Week-view round** | Same branch, from your look at it. Four things: the rotating `WEEK_GREETINGS` heading came back, one line and no subtitle, now centred over the content column; the week bar came down a notch on every dimension and the meal cards took the room; the save star lost its border; and the recipe inside a meal card lost its filled tile, with the name carrying the affordance instead. Three `CLAUDE.md` conventions described the code this replaced, so they moved with it. **Not rendered by me either** — the extension still would not connect, and the compaction figures are arithmetic on paper. You looked at it and called it good |
| **Icon and token round** | Same branch, third commit. The save control became a bookmark — the same path as the sidebar's *Saved* icon — replacing a star that said *rate* rather than *keep*. And `--bg` stopped filling anything inside a card: tags, time pills, filter chips and the search field all moved to `--surface-sunk`, because with dark mode now neutral a pill filled with the page shade read as a hole punched through the tile. Two more `CLAUDE.md` rules, both stated as bans rather than preferences |
| **A defect that light mode had been hiding** | The `--bg` fills were wrong all along and cost nothing while the page was a warm off-white close to the tiles. Changing dark mode's lightness is what made them visible. **A token used off its own layer is latent, not harmless** — and the thing that exposed it was a palette change three commits earlier, not the code that introduced it |
| **The fixed heading was a wrong call** | Recorded in [decisions](decisions.md#the-week-and-one-day-at-a-time): the rotating greeting had been read as a stand-in for the missing week date range, so restoring the range made it look redundant. It was never a stand-in. **A feature that overlaps another is not therefore replaced by it** |
| **Docs swept, straight to `main`** | This entry and the rest of the sweep went to `main` directly, which markdown is allowed to do, leaving PR #7 as a code-only diff — the same split as the Concept A round. `CLAUDE.md` was deliberately left out of the sweep: its three changed conventions ship with the code on the branch, and editing the same lines on `main` would only manufacture a merge conflict |
| **Re-read before merging, and the description was the finding** | The PR body still described only the first of three commits — the two rounds with the most visual risk in them were undescribed, and the body is what gets read before merging. Nothing in the code was wrong: contrast re-measured from the tokens found no text pair under 4.5 in either theme, and the three touch targets the week-view round shrank are all still lifted to 44px by the `pointer: coarse` block with nothing after it overriding them. **A branch can grow into a different change than the one described**, which is why step 4 says re-read the diff when commits land after the review. The body was rewritten to cover all three before the merge |
| **Palette round shipped** | PR #7 squash-merged to `main` as `88e27d0`, branch deleted, Pages `built`. You checked the latest changes in your own browser first, which closed the third commit — the one that had been seen by nobody. Still your eyes rather than an image, so the repo holds no picture of it |
| **Four follow-ups left open deliberately** | Listed in [status](status.md): a comment in `style.css` still calling the save glyph a star; the recipe name being a colour-only affordance until hover, on a control touch users cannot hover at all; `aria-labelledby` now naming the week landmark with a random greeting, so the name changes every load; and the recipe name possibly wrapping at `1.125rem` on a long Indian name. None blocks anything and none was folded into the merge, because scope creep in a merge commit is how a reviewed diff stops matching what shipped |
| **Three follow-ups closed** | Branch `week-affordance-and-landmark`, PR [#8](https://github.com/thelivinsine/meal-planner/pull/8), one commit. The recipe name is underlined **at rest** now, in the accent ink at 45% with hover taking it to full strength — it had passed every measurable floor and still failed the device nobody tested on. The week `<section>` took a fixed `aria-label`, since `aria-labelledby` was pointing at a heading that rotates every load. And the `.bookmark` comment stopped saying *star*. Squash-merged as `eb9ea73`, Pages `built` |
| **The fourth closed by eye** | You checked the catalogue's longest name, *Masala Yoghurt Bowl with Roasted Chana* at 40 characters, and it wraps cleanly. No code change |
| **The phone gap closed at last** | You opened the live site on a phone and it works well. That had been the top job for four rounds and the one thing a desktop cannot do: every control is compact on a fine pointer and only returns to the 44px floor inside `@media (pointer: coarse)`, a block a desktop browser never enters. Arithmetic had said it was fine three times; a thumb now agrees. One phone, unnamed, so a change to any control's size puts it back on the list |
| **The check script saved** | Branch `check-script`, PR [#9](https://github.com/thelivinsine/meal-planner/pull/9). `check.mjs` at the repo root — one file, no dependencies, no config, no runner, never served to a browser. 66 checks: contrast in both themes and both directions with the tokens read out of `style.css`, the action and id wiring, and the three values written twice. **The same three throwaways had been written and deleted five times**, and two of those rewrites caught things that would have shipped. The stub DOM was deliberately left out — of the three it was the only one that never caught anything — with a `ponytail:` comment recording when to add it |
| **It failed on its first run** | `--surface-sunk` beside `--bg` at **1.08**, the pair found at PR #7's merge and left alone. Fixed rather than excused: `.nav-btn:hover` in the sidebar, where the nav unwinds to no fill of its own and so lands on the page, moved to `--surface`. The token itself could not move — in dark mode the only value clearing 1.10 against both `--bg` and `--surface` is `#232323`, which is already `--surface-past`, and two tokens on one shade means a tray inside a past card has no edge. The pair then **left the script's list** rather than being marked known, with a comment saying to put it back if a bare sunk fill lands on the page again |
| **The script could not catch the next one** | `.theme-btn:hover` was changed alongside the nav button on the reasoning that both put a sunk fill on the page. Only the sidebar one did: the theme button carries `background: var(--surface)` at rest, so setting its hover to `--surface` made the rule a **no-op**, leaving only the icon colour changing. Every token stayed legal and every pair still measured fine — **a contrast script is blind to a rule that changes nothing.** You found it with a mouse, one hover. Reverted to `--surface-sunk`, 1.20 light and 1.14 dark against the button it sits on. The lesson is in [architecture](architecture.md#how-this-gets-tested): *a fill has to differ from what the control sits on, not from the page behind it* |
| **Check script shipped** | PR #9 squash-merged as `6e27431`, branch deleted, Pages `built`, 66 of 66 passing on `main`. The `.theme-btn` revert shipped **measured but not looked at**, at your call to come back to it later |

---

## What each round of testing actually checked

Kept because the *coverage* is the record — every script itself was thrown away. See
[architecture.md](architecture.md#how-this-gets-tested) for the standing approach.

### v1 and the early rounds

- 50 unique, complete recipes, each tagged `high-protein` or `balanced`, and both catalogue
  thresholds (over half Indian, over two thirds high-protein)
- Week-start arithmetic landing on a Monday across month, year and leap-day boundaries
- 7 day cards and 21 slots rendered, with the right past / today / upcoming split for the real date
- The inline slot picker: hidden on load, opens with the tapped day and meal in its heading, offers
  all 50 recipes, filters on its own search without disturbing the Recipes view, fills exactly the
  tapped slot in one click without the dialog opening, closes on Escape, week navigation and view
  change, and returns focus to the slot it was opened from
- The dialog route: 7 day buttons with one preselected; add → replace → clear leaving exactly one
  correct entry
- The filter panel: a chip for every catalogue tag and no duplicates, every tag landing in a named
  group, the count badge and active row appearing and clearing, the collapse toggle carrying
  `aria-expanded`
- The picker and the Recipes grid rendering byte-identical card markup apart from the primary
  action, and a picker card's star following a bookmark made from the open sheet
- A save/reload round-trip, and nine kinds of corrupt storage (truncated JSON, `null`, `[]`, wrong
  types, unknown recipe ids, invalid dates) all falling back to a clean state

### The bold-consumer redesign

All three files replaced. Alongside your own passes in the browser: `node --check`, contrast
computed rather than eyeballed, and **89 stub-DOM assertions** — 68 during the build, 21 more at
review. They covered the seven-column and accordion renders, rail sides and count, that every
column track is the same type so the width animation can run at all, focus restoration on both
layouts, the expand-all toggle and its relabelling, plan writes and clears, bookmarks, tag
filters, theme persistence and restore, the recipe dialog's two tool states, and the fill-slot
route out of the inline picker.

### The Concept A round

`node --check`, plus **29 stub-DOM assertions**: the week bar and its Today button appearing only
off the current week, the seven-day row and its single selection, empty and filled meal cards, the
meta line, the glance arithmetic and progress width, every shape `balanceOf` and `tipFor` can
return, plan writes and clears, the storage round-trip, focus restoration after a clear, after a
save toggle and after pressing Today, week paging, day switching, the past-day class, and
`theme-color` tracking `--bg` across three theme switches.

Static checks: every id the JS looks up exists in the HTML, all 106 emitted classes have a rule,
`max-width` queries descending, no base rule below the first media query, the storage key matching
in both places, and no id selectors in the stylesheet.

Contrast, both directions, tokens read out of `style.css`: **16 text pairs per theme against 4.5**
— lowest 4.67, dark `--ink-faint` on a card — **6 bare surface edges against 1.10**, and **8
hairline-carried edges** measured on the line against both sides. Four edges were fixed rather
than tolerated across the round: dark `--accent-soft` at 1.03 against a card, the active sidebar
pill at 1.05 against the page, the 1.12 page-to-card edge that sank the first attempt at a warm
page, and dark `--surface-past` at 1.02.

**And worth saying plainly: none of these scripts caught the layout rendering at a third of its
width. A screenshot did.** Three rounds of reading have found fifteen bugs between them — six a
browser would have shown, six only a script or a diff review could, and one that was invisible to
two careful readings and obvious in a single shot.

### The palette and week-view rounds (PR #7)

The thinnest coverage of any round so far, and worth being explicit about why: **the Chrome
extension would not connect at any point**, so nothing was rendered by me. What there was:

- `node --check app.js`, and a read of every rule the change touched.
- **Contrast, both directions, tokens read out of `style.css`** — the same throwaway written for the
  fourth time. It earned its keep twice in one sitting: dark `--accent-soft` at **1.01** against the
  new neutral panel, which would have made every accent fill on a card invisible, and light
  `--on-accent` on `--accent` dropping to **4.26** when the accent was brightened towards the
  mockup's orange. Both were invisible to the eye and both would have shipped.
- Final figures: no text pair under 4.5 in either theme; page-to-card 1.11 light and 1.23 dark;
  card-to-tile 1.20 and 1.14; `--line` 1.24 on the light page and 1.53 on the dark one. Two light
  edges sit under 1.10 by necessity and are measured on the line instead, at 1.29 and 1.17.
- The recipe name's new colour measured where it lands: `--accent-ink` at 5.95 on a card and 5.61 on
  a past card in light, 8.68 and 8.57 in dark.
- Static reads rather than a scripted sweep: no hardcoded hex outside the token blocks, the
  `theme-color` fallback updated with the page colour, and the two lines in the 620px block that
  were setting the week bar *larger* than its new base removed.

The third commit added: `node --check`, a grep proving no `star` identifier survives anywhere, a
check on where `var(--bg)` is still allowed to appear — five places, all of them either the page
itself, an inverted surface using it as *ink* (the toast, and the docked nav pill, which is filled
with `--ink`), or a `color-mix` for the translucent top bar — and the one fill that now sits flush measured on its border instead, the
search field inside the sunk slot picker at 1.57 light and 2.13 dark.

A fifth writing of the same contrast script at merge, to re-measure the shipped tokens before the
button was pressed. It found one pair the PR had not named: `--bg`/`--surface-sunk` at **1.08** in
both themes, reachable only at `.nav-btn:hover` in the sidebar. Every other element moved to
`--surface-sunk` this round sits inside a `--surface` panel at 1.20, which is why it did not matter.
The same pass re-checked the three touch targets the week-view round shrank and confirmed the
`pointer: coarse` block still lifts all of them to 44px with nothing after it overriding them.

**Not covered, and it is most of what matters here:** no stub-DOM assertions, and no rendered look
at any of the three commits by me. The compaction figures (~122px → ~100px for the week bar) are
computed from padding and line heights rather than measured. You confirmed all three in your own
browser before the merge, which is the only look any of them got.

### The follow-up and check-script rounds (PRs #8 and #9)

**The extension would not connect for a third round running**, so again nothing was rendered by me.
What changed is that the measuring stopped being thrown away.

- **`check.mjs` replaced the throwaways.** 66 checks, run by hand. Its numbers were cross-read
  against the figures earlier rounds had computed by hand and recorded in `architecture.md` and
  `decisions.md`, and they match — different code, same answers, which is the strongest evidence
  available that the arithmetic is right.
- **It found the 1.08 pair immediately**, which was the case for saving it, made concrete on the
  first run.
- **And it was blind to the bug it caused.** The `.theme-btn:hover` no-op left every token legal and
  every pair passing. **A check that reads values cannot see a rule that changes nothing** — the
  clearest demonstration yet of why read, look and measure are three checks and not one.
- **You closed the phone gap and three of the four follow-ups by looking**, which is the other half
  of the same point.

**Not covered:** the underline was confirmed by you on all three grounds, but the `.theme-btn`
revert was not looked at by anyone — measured only. Still no stub DOM, still no keyboard-only pass,
and the CSS-shape checks earlier rounds sometimes did by hand are not in the script yet.
