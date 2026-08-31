# Decisions worth recording

*Append-only. Each entry is a choice that cost something to learn — a bug shipped, an approach
tried and reverted, or a constraint that turned out to bite. Grouped by what they're about rather
than by date; the chronology is in [log.md](log.md).*

## Data and state

| Decision | Why |
|---|---|
| Plan keyed by real date | You asked for real dates; anything else makes "next week" meaningless |
| The viewed week isn't saved | It always opens on the current week, so returning days later doesn't strand you on a stale one |
| Which day you're looking at isn't saved | It means nothing next session, and reopening on a day you happened to tap last Tuesday would be stranger than opening on today |
| Old entries pruned after 4 weeks | The direct consequence of date keys — otherwise storage grows with every week that passes |
| One recipe per slot | "Cleared or replaced" reads as singular |
| Theme is saved, other view state is not | Which week or day you were on means nothing next session. A theme you chose does |
| Redraw the whole view, no diffing | 50 recipes is small; the simplicity is worth more than the cycles saved |
| Validate on load, never trust storage | Junk in storage should produce an empty plan, never a crash — nine kinds of corruption were tested against this |

## The week, and one day at a time

| Decision | Why |
|---|---|
| One day at every width, no accordion | Both mockups show one day. Seven columns gave each day ~150px, narrower than most recipe names, and the accordion that fixed that needed a whole second layout for narrow screens. One day needs neither, and deleting it took the rails, `expandAll`, the animated tracks and the `subgrid` sharing with it |
| Day buttons, not a dropdown | A `<select>` opens the OS wheel on mobile and hides the dates; seven buttons show everything at once |
| Past days editable, not locked | Useful for logging meals already eaten; the greying communicates enough |
| Today is a dot, not a pill | The pill pushed the date onto a second line, which knocked that column out of alignment back when the days were columns |
| ~~The heading is fixed, not rotating~~ — **reversed** | Recorded here because the reasoning was wrong in an instructive way. The rotating greeting was read as a *substitute* for the missing week date range, so when the week bar brought the range back the greeting looked redundant and became a fixed "Your week" plus a subtitle. It was never a substitute: you had asked for a heading that changes on every load, and it changes because a greeting is nicer than a label, not because it was carrying information. `WEEK_GREETINGS` is back — one line, no subtitle, picked once per load so it holds still while you use the app. **A feature that overlaps another one is not therefore replaced by it** |
| The view heading is centred over the content, not the window | It used to be hard left, on the argument that the sidebar sets the left edge of the app. On the week view that reads as drift: the heading sits above a week bar and three cards that stop well short of the right edge, so left-aligning it to the sidebar aligns it to nothing you can see. Centring it needs the heading placed in the **content column only** — over the two-column span it would centre on the window and sit right of the tiles it names. That means all three items in `.view-week` are placed by hand: leave the lower two to auto-flow and the aside slides up beside the heading, which is the thing this arrangement was built to fix |
| The week bar is navigation, so it stays compact | It was taking almost as much height as the three meal cards it steers. The cards are what you came to read; the bar is how you get to them. Padding, arrow size, range type, chip height and the date circle each came down a notch and the cards took the room. A change that makes the bar taller needs a better reason than fitting |
| The summary column is dropped on narrow, not stacked | Every figure in it is computed from the day beside it. Stacking it under the meals would repeat what is already on screen and push the meals out of reach. **Corollary: anything that can only be read there doesn't belong there** |
| Balance is one word off one tag | Every recipe carries exactly one macro tag, so counting them is the whole calculation. Anything finer would be nutrition advice this app is in no position to give |
| Tips are conditional, not random | A random line stops being read after the second time. One that notices the day is empty, or all meat, or two hours of cooking, is worth the four `if`s |
| The nav list *is* the sidebar | Over 1000px the docked pill unwinds into a vertical list in a left column. Building a separate sidebar would mean two nav lists to keep in step and two landmarks for one control; restyling the one that exists means neither |
| The view switch floats at the bottom on narrow | It is the one control used from every screen, and the top bar was carrying a wordmark, three tabs and a theme toggle. Docking it leaves the header quiet. On a wide screen there is a sidebar to put it in instead |

## Adding a meal

| Decision | Why |
|---|---|
| Slot's **+ Add** opens the list inline, under the week | The slot already names the day and meal; asking again in a dialog was redundant, and the space below the week was empty |
| The dialog stays for the recipe-first route | From a card nothing is known yet, so a day and meal still have to be picked |
| The week's picker uses the Recipes card | It was a list of bare rows, so the same recipe looked like two different things in two places. One `cardHtml(recipe, slot)` now draws all three lists |
| The card's button changes, not the card | Recipes says "Add to week" and asks for a day; the picker says "Add to Thu breakfast" and doesn't. Same card, one different button |
| Recipe name is the headline in the add sheet | "Add to week" is the same on every recipe, so it's the one thing there that doesn't need 22px of type |
| The recipe sheet fills the slot it came from | Dropping "Add to week" there was right — the day and meal are known — but dropping the add entirely left reading a recipe as a dead end. The icon fills the slot directly |
| Dialog actions are icons beside the close | Two full-width buttons above the ingredients pushed the recipe down the panel. As icons they sit in the chrome, where actions belong |
| Filter chips grouped and collapsible | Sixteen equal pills in one wrap is a tag dump, not a filter. Grouping says what each choice means; the count badge and **Clear all** show what's on |

## Colour and contrast

| Decision | Why |
|---|---|
| The page is warm, the cards are near-white — and *lightly* | Tried the other way twice. A tinted page behind near-white cards first failed at a 1.12 edge, so v1 of this palette put a heavy peach on every tile — which read as one flat cream wash the moment the cards got large. Inverting it fixed the wash and then repeated it one shade lighter: a `#f2ece5` page plus `#ebe3da` tiles cleared every ratio and still left the white card as the only bright thing on screen. **Passing the measurements is not the same as looking right**, which is the whole reason the mockups get looked at again after the script passes. Now `#f6f3ee` and `#ffffff`, matching Concept A: 1.11 page to card, 1.20 card to tile, and more of the separation carried by the hairline than before |
| Light mode has no room left, so two edges are hairline-only | A near-white page and a white card are 1.11 apart in total, which means `--surface-past` and `--accent-soft` — both of which sit *between* them by definition — cannot also hold 1.10 against the page. They measure 1.04 and 1.06 and are drawn with a `--line` border, which measures 1.29 and 1.17 against them. This is the hairline convention below, but it is worth saying separately: **the lighter the page gets, the more of the structure the hairlines carry**, and a change that removed a border here would be a real defect rather than a tidy-up |
| Dark mode's surfaces are neutral grey; only the accent is warm | Dark mode was a brown (`#14100d` page, `#2a2019` cards) to match the light theme's warmth, and browns that dark read muddy rather than warm. You supplied two reference dark UIs — ChatGPT's settings sheet and the Windows PowerToys panels — and what they do well is *structure*, not hue: a page that goes properly dark, panels a clear step up from it, a hairline visible on both, near-white text rather than beige text, and one saturated accent appearing only on small elements. So the greys came from the references and the orange stayed. Warmth is the light theme's job and the accent's. This is also the change the contrast script paid for itself on: against a neutral panel the old `--accent-soft` sat at **1.01**, and every accent fill on a card would have gone invisible |
| Both directions of contrast get measured | Text against its ground needs 4.5; two surfaces that touch need about 1.10 or the edge is gone. Only checking the first is how a palette ends up legible and shapeless — dark `--accent-soft` sat at 1.03 against a card, making every `+` circle invisible while every text pair passed |
| Where surfaces must sit close, a hairline carries the edge — **and then you measure the line** | A past day is meant to recede into the page, so its fill can't also hold a 1.10 edge. The border does it, on the card and on the tile inside. Adding this distinction to the contrast script turned four apparent failures into three legitimate hairline-carried edges and **one real defect**: dark `--surface-past` at 1.02 against the page, which is to say on the wrong side of it entirely. Without the split the script either passes everything at 1.02 or fails three pairs the convention allows |
| `--bg` is the page and nothing else | Tags, time pills, filter chips and the search field were all filled with `--bg`. On a warm near-white page that was merely pointless — a pill the colour of the page, sitting on a card. Once dark mode went neutral it became a defect: **the page shade is the darkest thing on screen, so a pill filled with it reads as a hole punched through the tile.** All four moved to `--surface-sunk`, which is exactly what "trays and inner tiles" was defined to mean. The general form is worth keeping: a token named for one layer should only ever appear on that layer, and the moment a palette changes lightness, a token used off its layer stops being harmless and starts being wrong |
| Saving is a bookmark, not a star | The save control was a star everywhere, while the sidebar's *Saved* view was a bookmark — two shapes for one idea, and the wrong one won on the button you actually press. A star says *rate this*; a bookmark says *keep this*, which is what the control does. It is now literally the same path (`BOOKMARK_PATH`). Worth noting how long it survived: the Saved view's empty state has read "tap the bookmark on any recipe" since v1, so **the copy had been describing the right icon for months while the icon disagreed** |
| `--accent` fills, `--accent-ink` writes | The accent is legible as a background but lands at 4.47 as text on a tinted tile. So every accent-coloured *word* uses `--accent-ink`, one step deeper; borders, dots, chips and fills use `--accent`. Backwards is how the floor breaks quietly |
| A past day is quieter by colour, never by opacity | Dimming a control blends its text back towards the tile and undoes the palette the contrast figures were computed from. Different tokens keep the numbers |
| One box per level | A card gets the border and nothing inside it gets a second one. Nested boxes were the main thing wrong with v1's week, and it's why no day card wraps the meals — the `<h2>` above them already names the day. The rule then quietly broke inside the meal card itself: the recipe sat in a filled tile, which is a box in a box however subtle the fill, and the mockup has nothing of the kind. The tile is gone and the **recipe name** carries the affordance instead — `--accent-ink`, underlined on hover. Same for the save button, which was a bordered button beside a borderless one; it is now the `.icon-btn` it already claimed to be. **Two boxed controls on one card is the same defect as two boxes.** Where a control needs to say it is pressed, the glyph and the ink say it |
| `theme-color` is written by JS, not keyed to `prefers-color-scheme` | The obvious markup is two tags keyed to the OS preference, and it is wrong here: **the theme is a choice the user stores**, so anyone whose theme disagrees with their OS gets browser chrome fighting the page. It shipped that way once, with a light value left over from before the palette inversion. Now one tag, set from the live `--bg` by `applyTheme()` and again by the inline `<head>` script so there's no flash. Reading the token back off the element also keeps the hex out of a third place |

### One wrong turn worth recording

The picker cards reading as flush was diagnosed as a page-wide figure/ground problem, and the
whole palette was darkened to fix it. That wasn't it, and it was reverted (`5a70694` in the reflog
if the numbers are ever useful). The actual cause was local — white cards on a white panel — and
the fix was to recess that one panel. **A local symptom got a global fix, and the global fix was
wrong.**

## CSS traps this project has already fallen into

Each of these cost a real bug.

**Media queries add no specificity.** A base rule written *below* one beats it on source order. So
every media query lives at the end of `style.css`, after what it overrides. The whole
`min-width: 1001px` block was partly dead for exactly this reason — it sat above the base `.page`
and `.toast` rules, so the wide padding never applied, and nothing about the CSS looked wrong.
A static check now fails if a base rule is ever written below the first media query.

**An id selector outranks all of that.** An id beats every class and every media query written to
override it, so an id selector is the trap above waiting to happen again. `#view-week` and
`#week-grid` were the only two and are now `.view-week` and `.meals`; a static check fails if
another appears. Ids stay in the HTML for `getElementById` — they just carry no styling.

**A grid item with auto inline margins does not stretch to its track — it shrink-to-fits.** `.page`
has `max-width` plus `margin: 0 auto`, which centres a *block* while it still fills the available
width. Making `body` a grid over 1000px turned `.page` into a grid item, where the auto margins win
and it falls back to shrink-to-fit: the page sized itself to its own max-content (~610px) and `1fr`
divided what was left. **The week rendered at a third of its width.** Fixed with an explicit
`width: 100%` — don't remove it. Reading the CSS twice missed this; one screenshot found it.

**Breakpoints go where the arithmetic says the constraint bites.** The day row wraps at 400px
because seven 44px chips plus gaps need 332px, and 401px yields 46px each. It first shipped
wrapping from 620px — hundreds of pixels early — which turned a week that fitted on one row into
two rows of oversized buttons. The `max-width` queries also stay in **descending order**, or a
wider query overrides a narrower one; extend an existing block rather than opening a second at the
same width, which has also happened.

**Dialog `display` hangs off `[open]`.** A bare `display` on `.sheet` beats the UA's
`dialog:not([open]) { display: none }` — author origin wins — and both sheets then render in the
page at all times.

## Accessibility and focus

**Every defect this project has shipped has been an accessibility defect.** Hence the rules in
`CLAUDE.md` having their own section, and hence this.

**A redraw destroys focus.** Rendering rebuilds a view from state, which means the control you just
activated may no longer exist, and focus silently falls to `<body>`. Five places put it back, each
aiming at whatever *replaced* the control:

1. `closeSlotPicker()` — back to the slot the picker was opened from, or the week if it's gone.
2. The day strip chip — the redraw replaces it with an equivalent chip.
3. The Add button a cleared meal leaves behind — the × that was pressed is gone.
4. The save button — one lookup covers the week, both recipe lists and the open dialog, so the fix
   lives where all the callers route through rather than in each of them.
5. **Today** — which deletes itself when pressed, because it only renders while you're off the
   current week.

**A conditionally-rendered control is the one that gets missed.** Both focus bugs shipped here
were one: the save button, and then Today — which was missed precisely because it used to be static
markup in `index.html` and had never needed handling before.

**Never leave a card unnamed, and never hide a focusable control from sight.** The day's name is a
real `<h2>` above the meal cards and each meal name an `<h3>`, so nothing is hidden to make the
layout work. `display: none` on a heading once came back one selector along after being listed as
fixed. If a heading ever must vanish on screen, `.sr-only` keeps it in the outline where
`display: none` would not — and only on something that isn't focusable.

**Touch targets at least 44px**, width as well as height, measured at 360px rather than at whatever
your own window happens to be. Controls are compact on a fine pointer and the `pointer: coarse`
block lifts them back, so a later rule that outranks that block on specificity silently breaks the
floor. That has now happened twice — to the dialog's icon buttons, and to the week bar's arrows.
So the coarse block has to name anything that sets its own width or height later in the file.

**An `aria-expanded="true"` button that cannot collapse anything is worse than a span.** An open
day's header claimed to be a disclosure and did nothing when pressed; it became a `<span>`.

## Deliberately not built

Left out on purpose, roughly in the order they'd earn their place:

- **Shopping list** from the week's ingredients — the obvious next feature, and the data is
  already there
- **Month calendar** view — held back deliberately until the week view settled
- **Your own recipes** — needs an editor and a place to keep them, which is real work
- **Copy last week** / duplicate a day — cheap to add, genuinely useful
- **Sharing or syncing** a plan — impossible without a server, which the project rules exclude
- **Drag-and-drop** — touch needs an entirely separate code path from mouse dragging, and
  clear/replace already covers moving meals
- **Recipe photography** — the newest of these, and the one most likely to be asked for: the
  mockups show a photo per meal, the catalogue has none, and fetching any would break "static
  files, no API calls". The meta line carries the same job in text
