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
| **UI round** | Branch `feat/ui-polish`, from your notes on the v1 screenshots: week rows aligned with `subgrid`, nested boxes removed, filters grouped and collapsible (chips then, dropdowns since PR #13), the add sheet re-weighted around the recipe name, and a view-the-recipe route out of the week picker |
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
| **The references got measured** | The two dark reference UIs had been described from memory in three docs and never measured. Both, plus a light-mode set you added (Claude desktop and PowerToys light), were decoded pixel by pixel — a small PNG decoder over `zlib`, sampling at named coordinates — and written up as `docs/dark-mode-reference.md` and `docs/light-mode-reference.md`. Every surface hex, state delta, edge and shadow treatment, with ratios computed the way `check.mjs` computes them. Docs only; nothing in `style.css` moved |
| **The nesting ladder, and its light-mode half** | The organising pattern you spotted — a component inside a component gets lighter each level — measured out monotonic across all three dark chains, with the step *shrinking* each time (1.30, 1.22, 1.13). The light set then broke the symmetry: containers still move towards white, but **hover and selected move the opposite way**, and at a white ceiling the ladder stops entirely — a submenu over a menu over the page is `#ffffff` three times, carried by a rim and a shadow. The sharper find was the shadows: both dark references use **none anywhere** (panel to backdrop in one pixel), while both light ones use real gradient blur. Recorded in [decisions](decisions.md#colour-and-contrast) |
| **What it says about Mise** | Light mode measured structurally right — page below white so cards rise to it, sunk trays stepping down, `--line` carrying the edge at 1.24/1.37 exactly where PowerToys puts its hairline. Dark mode has two gaps: **no token above `--surface`**, so states have nowhere to go and the ladder ends at depth 1; and `--surface-sunk` at **1.08** from the page, the same token doing the right thing in light and the wrong thing in dark. Neither acted on — `check.mjs` and a browser both have to agree before a token moves |
| **A docs commit had deleted the mockups** | Found while sweeping. `a3b34c0`, a routine README-and-log sweep, carried a silent `Mockups/*.png` deletion in its diff: the folder had been renamed on disk to `Light mode Mockups/`, the `!Mockups/**` exception was anchored to a path that no longer existed, and `*.png` swallowed all four. The repo had tracked **zero** images for two commits while `architecture.md` still said otherwise. Restored from `f58bf0f` under the folder's real name, exception rewritten as `!Light mode Mockups/*.png` — `*.png` not `**`, so the reference shots in `Other references/` stay out. **A negated gitignore path is a dependency on a folder name**, and renaming the folder fails silently in the one direction nobody checks |
| **Check script shipped** | PR #9 squash-merged as `6e27431`, branch deleted, Pages `built`, 66 of 66 passing on `main`. The `.theme-btn` revert shipped **measured but not looked at**, at your call to come back to it later |
| **Light mode polished** | Branch `light-mode-states`, driven by [light-mode-reference.md](light-mode-reference.md#9-against-mises-current-light-tokens) rather than by a screenshot — the first round to work that way. Its §9 verdict, *the light palette is structurally right*, is what kept the change small: **no surface token moved.** `--hover: #eae4da` added, a fill 1.14 *below* the page, closing the report's one named gap and retiring PR #9's workaround of sending the sidebar hover *up* to white. `--selected` deliberately not added — every selected state here is an accent fill, so it would have had no consumer. Dark's `--hover` holds dark's existing value: light-only was your call, and dark's own ramp is still the open question |
| **The reference was right and still wrong** | Section 6 of the report puts the focus ring at 4px with a gap, read off a real app's pixels. Built at 4px it was too loud here — a thick orange band around the search field, not a ring — and shipped at 3px after you looked. Same round, the opposite direction: the report warns against heavy black scrims, and Mise's supposedly-heavy one measured **3.7** where the reference sits at 2.93, so the correction to .42 was real but far smaller than the wording implied. **A measured reference is evidence, not a spec** |
| **Tabbing found a ring clipped for months** | The recipe card's focus ring was cut on three sides by `.card`'s `overflow: hidden` and showed as a stray orange rule across the middle of the card. Present since it was 2px; 3px made it visible. The fix took two goes — a negative `outline-offset` to draw it inside, then the card's top radius, because **an outline follows its own element's `border-radius`** and `.card-open` has none, so it fell back to the 4px in the global `:focus-visible` rule. Neither the script (reads source text) nor a screenshot (taken at rest) can see a focus ring at all |
| **A false alarm, resolved by arithmetic** | A second ring looked clipped at the sidebar's left edge across two screenshots. It was the crop of a zoomed snip: the sidebar has 14px of padding and the ring extends 5px, so nothing could cut it. Checked against the CSS before changing anything, and confirmed by you at 100% zoom. **Worth recording because the standing rule is to trust the look over the arithmetic** — here the arithmetic was specific enough to be worth one question first |
| **Light round shipped** | PR [#10](https://github.com/thelivinsine/meal-planner/pull/10) squash-merged as `1dd7a52`, branch deleted, Pages `built`, 70 of 70 passing on `main`. Two pairs added to the script with the new token. Left open and seen: the focus ring on an accent-filled button is orange on orange, legible but blobby |
| **The picker took the day's place** | Branch `day-takeover-picker`, PR [#11](https://github.com/thelivinsine/meal-planner/pull/11), squash-merged as `2339d05`. The inline picker stopped opening *below* the three meal cards — which put the recipes you were choosing from below the fold — and now hides `.day-title` and `.meals` and draws in their spot, with **Back to the day** as the one way out. `sizeSlotPicker()` measures the room rather than guessing a `vh` figure. Same branch: the week bar dissolved onto the page, capped at 520px and centred, so the meal cards are the only boxes on the week — which forced both of its fills to be re-picked, since `--surface-sunk` measures 1.08 against the page in both themes |
| **The tooling changed, and it is the durable part** | The Chrome extension refused to connect for a fifth round, and headless Chrome from the shell turned out to be the better instrument anyway: `--screenshot` renders, `--dump-dom` answers questions a picture cannot. Two of that round's three defects were confirmed by asking the live page for a number — `activeElement`, `scrollHeight` — which is a third kind of check this project had never used |
| **Spacing** | Branch `spacing-scale`, PR [#12](https://github.com/thelivinsine/meal-planner/pull/12), squash-merged as `c39fe70`. From your note that the vertical spacing "doesn't seem nice" — and the cause turned out to be arithmetic, not taste. **Eleven numbers were doing vertical-gap duty** (10, 14, 16, 20, 22, 24, 28, 30, 48, 104), each picked on its own, and the gap separating *sections* had come out the same size as the gap separating *siblings*: 24 above the week bar, 20 below it. Four `--space-*` tokens at 8/16/24/40 gave the four jobs four sizes. Padding *inside* components was deliberately left alone — the scale spaces things apart, it does not resize controls |
| **The scale does not pick the step for you** | The heading shipped in the first commit at `--space-3`, and you looked at it at a real zoom level and said it was still cramped. It was: the heading is the largest thing on the page, so it wants the largest gap. **The step had been picked from the scale rather than from the page.** Fixed to `--space-4` in a second commit, with the week grid's row and column gaps split so the summary column beside it keeps the block gap. Worth keeping because every gap in that round measured exactly as designed and one of them was still wrong |
| **A round with no token, no check and no defect** | 76 checks before and 76 after, none added, none moved — the first round in a while where the script had nothing to say, because spacing is the one thing it does not read. That is now written down as a gap rather than left implied: a rule writing `margin-bottom: 18px` is legal CSS and passes everything |

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

### The light-mode round (PR #10)

**The first round driven by a reference document rather than by a screenshot.**
[light-mode-reference.md](light-mode-reference.md) had been written the round before and never
acted on. Its §9 verdict — the light palette is *structurally right* — is what kept this small: no
surface token moved.

- **`--hover` closes the report's one named gap.** No hover or selected token existed. The sidebar
  hover had been going *up* to `--surface`, the dark-mode direction, as a workaround for
  `--surface-sunk` measuring 1.08 on the page. It now goes down, to `#eae4da`, 1.14 on the page.
  Dark's `--hover` is set to the value dark already used — your call was light-only.
- **No `--selected` token was added**, because every selected state in this app is an accent fill.
  A neutral one would have had no consumer.
- **The reference's 4px focus ring was built, looked at, and reduced to 3px.** Too loud on this
  palette. **A number measured out of a reference app was still wrong for this one** — the round's
  clearest argument for looking at things.
- **The scrim went .50 → .42**, 2.97 over white against the reference's 2.93. Recorded honestly:
  the old value measured 3.7, so this was a smaller correction than the report's wording suggested.
- **Tabbing found a clipped focus ring on the recipe card** — cut on three sides by `.card`'s
  `overflow: hidden`, showing as a stray orange rule across the middle. Present since 2px and never
  noticed. The fix took two goes: the negative offset, and then the radius, because **an outline
  follows its element's own `border-radius`** and `.card-open` has none.
- **Two `check.mjs` pairs added** with the new token, per the rule that a pair not in the list is a
  pair nobody measures. 70 checks, all passing.

**The extension would not connect for a fourth round running.** Everything seen this round was seen
by you, in your browser, from seven screenshots — which is also how the false alarm got resolved: a
ring that looked clipped in the sidebar turned out to be the crop of a zoomed snip, and the
arithmetic (14px of padding against a ring extending 5px) is what said so before anything was
changed.

**Not covered:** dark mode and narrow widths, for changes that apply to both; the rest of the
keyboard pass — the week view, the slot picker and both dialogs; and the accent-on-accent focus
ring, which was seen, discussed and deliberately left.

### The picker takes the day (PR #11)

**The round where the tooling changed.** The Chrome extension would not connect for a fifth time —
but Chrome runs headless from the shell, and that turned out to be the more useful instrument
anyway: it renders, and it also answers questions a picture cannot.

- **The inline picker now replaces the day** instead of opening below it, where the recipes started
  below the fold. Day title and meal cards hide, the panel draws in their place, **Back to the day**
  is the way out, and the week bar, sidebar and summary column never move.
- **The week bar dissolved onto the page** — no fill, no border, no radius — and was capped at
  520px and centred, because seven chips sharing the full column had stopped reading as one week.
  Both of its fills had to be re-picked as a consequence: chip hover to `--hover`, and the tint on
  a planned day to an `--accent` **ring**, since no neutral fill is legal on the page.
- **Three new pairs in `check.mjs` and not one new token.** Moving `--hover` and `--accent` onto the
  page made three combinations nobody was measuring. 76 checks.
- **The cards collapsed to 2px strips, and your screenshot is what showed it.** `flex: 1` gave
  `.pick-grid` a definite height, and `auto` grid rows in a definite-height grid get the height
  *divided among them* rather than sized to content. Reproduced headless, measured — `.card` 2.0px
  with a 125px child — and fixed with `grid-auto-rows: min-content`.
- **The page still scrolled, twice.** You spotted the scrollbar in two screenshots running. The
  panel was measuring to the bottom of the *window*, but `.page` carries its own bottom padding
  below it, which counts towards document height. Then sub-pixel rounding left 2px, so it now reads
  `scrollHeight` back and corrects instead of trusting the arithmetic.
- **Opening it no longer parks a caret in the search box** — your call, and the app's only
  automatic focus into a field.
- **Reviewing the branch's own diff found the bug the round caused.** Hiding the day left its
  bookmark buttons in the DOM, earlier in document order than the picker's, so the save button's
  focus restoration could aim at a hidden copy and drop to `<body>`. Confirmed both ways headless.

**Not covered:** dark mode, and a real keyboard. Every look this round was a headless screenshot at
1254 / 760 / 360px in light mode, plus your own eyes on the running app — the two defects that a
screenshot could not have shown were both found by asking the live page for a number
(`activeElement`, `scrollHeight`), which is a way of checking this project had not used before.

### The spacing round (PR #12)

The first round whose subject `check.mjs` cannot read at all.

- **Measured, both ends, on the live page.** Every figure in the before-and-after table in
  [status.md](status.md#what-just-shipped) is `getBoundingClientRect()` from headless Chrome at
  1254×900 — the old CSS measured before the change, the new CSS measured after — not arithmetic on
  the stylesheet. That mattered once: the week-bar-to-day gap is 40px of margin plus the bar's own
  4px of bottom padding, which reads as 44 and is what the page actually shows.
- **`scrollHeight === innerHeight` re-checked on both states.** The slot picker measures its own
  height, so growing its head by 4px was the one change that could have put the page back into
  scroll. Confirmed on the day view and on the open picker.
- **Looked at:** week view at 1254 and 760, recipes at 1254, the picker at 1254, and the week at
  360px in an iframe — seven renders, all light mode, all discarded.
- **76 checks, unchanged.** Nothing added and nothing to add: no token moved and no colour appeared.
- **Two headless cautions, both new.** `--virtual-time-budget` does not reliably advance CSS
  animations, so one screenshot came back mid-fade and one measurement came back 8px short — the
  panel's `translateY(-8px)` entrance, caught before it settled. Neither was a defect and both would
  read as one.

**Not covered:** dark mode, a real keyboard, a real phone, and the 620px breakpoint from either
side. No control changed size, so the 44px floor should be untouched — untested, and "should be" is
the whole reason a phone stays on the list.

**What the round is really about.** Every gap in it measured exactly as designed and one of them was
still wrong, because a scale says which sizes exist and not which one a given gap wants. The
headless renders answer *what is it*; they never answer *is it right*. That still took your eyes on
the running page, at a zoom level no default screenshot uses.

### The tools round (PR #13)

Four commits on `search-filter-view-toolbar`, one review pass, squash-merged as `12ce708`. The
round started from a defect and ended up rebuilding how three views are steered.

- **The defect:** tap **+ Add** on a breakfast slot and all fifty recipes appeared. The slot knows
  which meal it is, so the list now arrives filtered to it — 14 breakfasts, 17 lunches, 19 dinners
  — as a **ticked box in the *Meal* dropdown with the filter row open**, not a hidden rule.
- **Fixing it forced the matcher's semantics.** With one flat OR over every ticked tag, a vegan
  breakfast returned every vegan dinner too, and the preset stopped meaning anything the moment a
  second box was ticked. It is OR *within* a group and AND *across* groups now. The one behaviour
  change in this round that a user of the old Recipes page would notice.
- **One tools row, drawn by one function into three views.** Search, a tile/list toggle and the
  five filter groups as dropdowns of checkboxes — on Recipes, on Saved, and in the slot picker.
  Five labelled stacks of chips became one row 30px tall.
- **It is the one component that is never redrawn.** `syncTools()` writes ticked boxes, badges, the
  pressed layout button and the field's value in place. A redraw would shut the open `<details>`
  under your finger and move the caret to the end of the search box on every keystroke — neither
  visible to any check this project runs, both certain.
- **Native `<details name>` for the dropdowns.** Keyboard, exclusivity and disclosure semantics for
  no script; closing on an outside click and on Escape written by hand, with Escape taking the menu
  before the picker it sits inside.
- **Then the cards got quieter, on your notes:** three tags at most and never `quick`, the minutes
  as bare text instead of a pill identical to the tags beside them, type down a step. Cards went
  186 → 136px in tile and 85 → 62px in list.
- **The alignment bug had two causes and one symptom.** `align-items: flex-start` floated 11px
  minutes above the top of a 15px name that had wrapped; and in list layout `flex: 1` with
  `space-between` put the number wherever each name happened to end — measured at 469, 429 and
  535px down one list. Baseline alignment and a fixed 40% name column, with a 178px floor under it
  for the slot picker's narrow column.
- **Two headings left the page.** The rotating week greeting is parked in a comment with its
  restore notes; the day title is `.sr-only`, because it repeated the week bar for anyone who could
  see it and is the only name those three cards have for anyone who cannot. Both grid items in
  `.view-week` had to be moved to row 1 — left in row 2 the grid charges a `--space-4` gap for the
  empty row above them.
- **A past day lost its ring.** With meals logged on Monday and Tuesday, the two loudest marks on
  the week bar were the two days you cannot act on.
- **Two bugs this round caused and this round found.** `.card-tags` carried `flex: none` in list
  layout, so in the slot picker's narrow column three tags ran under the foot of buttons and the
  card's own `overflow: hidden` sliced the last one in half — caught in a render, not in the code.
  And the dropdown menu ran 2px off the right edge at 360px — caught by asking the live page for
  `getBoundingClientRect().right` on all five menus at three widths.
- **Reviewing the diff before merging found four things, all of them written by this branch**, none
  behavioural: both empty states still blamed "that search" when there are filters now, a comment
  described two rules the branch had deleted, another said "six groups" where there are five, and
  the parked greeting comment still spoke in the present tense.
- **76 checks, unchanged again — and this time that is the finding.** A search field, a layout
  toggle, five dropdowns and a menu of checkboxes went into three views without one new colour
  pair, because every ground was already measured. Reusing a ground costs nothing; moving a token
  onto a new one is what makes a pair.

**Not covered:** a real keyboard, a real phone, and anything between 400 and 620px. The Escape
ordering and the never-redraw rule were both written *for* the keyboard and neither has been driven
by one — every interaction in this round was `.click()` from a script. Dark mode *was* looked at,
twice, which closes a gap that had been open since PR #10.

### The docs-maintenance round (no PR)

A sweep of all nine markdown files against the code, with nothing shipping in `index.html`,
`style.css` or `app.js` on the same day. Every figure in the docs was re-derived from `app.js`
rather than trusted — 50 recipes, 27 `indian`, 38 `high-protein`, 14 / 17 / 19 by meal, 16 tags in
five groups — and `node check.mjs` was re-run: 76 pass.

- **Three things had drifted in `status.md`.** Pages was `built` at `46e34f3`, the docs commit on
  top of the live code, not at `12ce708`; the branch row said everything but one branch had gone on
  merge, while `feat/slot-picker-and-indian-recipes` is still on the remote and fully contained in
  `main`; and a heading counted "three bugs" over a list that added up to six.
- **`CLAUDE.md` came back to 200 lines from 229**, which had been an open question for four rounds.
  All 55 rules survive; what came out was the *justification* beside them, which `decisions.md`
  already carried in every case — the picker's height arithmetic, why `--bg` reads as a hole in
  dark mode, why the ring is not a fill, the 4px focus ring that shipped at 3px. The file now
  states the budget as a rule rather than as a remark, because "is this a rule or is it reasoning"
  is the test the file failed quietly for four rounds while nothing counted the lines.

