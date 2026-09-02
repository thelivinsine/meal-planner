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
| The week bar has no tile | It was a card holding navigation while the meal cards below it held the content, so the page carried two levels of box competing for the same eye. Dissolving it leaves the cards as the only boxes on the week — the same "one box per level" argument as the tile that came out of the meal card, one level up. The cost is that its chips now sit on `--bg`, which is what forced both of its fills to be re-picked: `--surface-sunk` measures **1.08** against the page in both themes, so the hover moved to `--hover` and the tint on a planned day became a ring |
| A planned day is an accent ring, not a fill | The obvious replacement for the tint was another neutral fill, and there isn't one: the page shade has nothing legal beside it that isn't already spoken for. `--hover` would have worked as a colour and been wrong as a signal — every planned day would have looked permanently hovered, and hovering one would have been a no-op, which is a defect this project has already shipped once. `--accent-soft` measured fine on the page (1.06 with a hairline, 1.38 dark) but put `--ink-faint` at **4.35** on it in dark, under the floor, on the past-and-planned day. The ring answers all of it: `--accent` is 4.28 on the page in light and 6.75 in dark, holds up over the hover fill too, and gives one shape three states — bare, ringed, filled |
| The week bar is capped at 520px and centred | Seven chips sharing a 1180px column put Mon and Sun a hand's width apart, and the week stopped reading as one object. The cap is a plain `max-width`, a no-op below 520px, so the narrow layout is untouched — and it centres under the heading, which is already centred on the content column. It does leave the bar on a centred axis while the cards below sit on a left one; that is deliberate, navigation and content, but it is the kind of thing to look at rather than to reason about |
| The summary column is dropped on narrow, not stacked | Every figure in it is computed from the day beside it. Stacking it under the meals would repeat what is already on screen and push the meals out of reach. **Corollary: anything that can only be read there doesn't belong there** |
| Balance is one word off one tag | Every recipe carries exactly one macro tag, so counting them is the whole calculation. Anything finer would be nutrition advice this app is in no position to give |
| Tips are conditional, not random | A random line stops being read after the second time. One that notices the day is empty, or all meat, or two hours of cooking, is worth the four `if`s |
| The nav list *is* the sidebar | Over 1000px the docked pill unwinds into a vertical list in a left column. Building a separate sidebar would mean two nav lists to keep in step and two landmarks for one control; restyling the one that exists means neither |
| The view switch floats at the bottom on narrow | It is the one control used from every screen, and the top bar was carrying a wordmark, three tabs and a theme toggle. Docking it leaves the header quiet. On a wide screen there is a sidebar to put it in instead |

## Adding a meal

| Decision | Why |
|---|---|
| Slot's **+ Add** opens the list inline, under the week | The slot already names the day and meal; asking again in a dialog was redundant, and the space below the week was empty |
| The picker replaces the day rather than sitting under it | Under it, the recipes started below the fold: you tapped **+ Add** and then had to scroll past the three meal cards you had just left to reach anything. Taking the day's place puts the list where your eye already is, and costs nothing, because the day and meal are settled the moment you tap. The week bar stays put, so changing your mind about the day is still one tap away — and it closes the picker when you do, since the slot it was filling no longer exists |
| It gets a back link, not a close × | An × dismisses something that appeared *over* your work. This replaced a view, so the way out is navigation, and it reads as the breadcrumb it is. Two controls doing one job was the alternative, and it would have been one more thing to tab past |
| The picker's height is measured, not a `vh` figure | It has to finish on the screen, and what sits above it is not a fixed height: a greeting that wraps at narrow widths, a bar that grows a **Today** button once you page off this week. So `sizeSlotPicker()` measures. The part worth keeping is what it measures *to*: the first version stopped at the bottom of the window and the page still scrolled, because `.page` carries its own bottom padding **below** the panel and that counts towards document height — 24px wide, about 50px narrow. The floor is that padding now, which is also exactly the space reserved to clear the nav pill under 1000px, so one number covers both layouts. Sub-pixel rounding still left 2px, so it asks the page for the overshoot and corrects once rather than trusting the arithmetic. **A measurement that stops at the window is measuring the wrong thing** |
| Opening the picker does not focus the search field | It did, and it was wrong twice over: scanning the cards is at least as likely as typing, and on a phone the caret throws the keyboard up over the recipes you came to read. Focus still has to go *somewhere* — the **+ Add** that opened it has just been hidden with the day, and focus on a hidden element falls to `<body>` — so it goes to the panel itself, which is the thing that replaced it. This was the app's only automatic focus into a field; the two dialogs let the browser focus their first control, which is never one |
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
| Dark mode's surfaces are neutral grey; only the accent is warm | Dark mode was a brown (`#14100d` page, `#2a2019` cards) to match the light theme's warmth, and browns that dark read muddy rather than warm. You supplied two reference dark UIs — ChatGPT's settings sheet and the Windows PowerToys panels — and what they do well is *structure*, not hue: a page that goes properly dark, panels a clear step up from it, a hairline visible on both, near-white text rather than beige text, and one saturated accent appearing only on small elements. So the greys came from the references and the orange stayed. Warmth is the light theme's job and the accent's. Those references have since been measured properly rather than eyeballed — [dark-mode-reference.md](dark-mode-reference.md) has every hex and ratio, and it confirms the call: both reference dark themes are strictly neutral, R = G = B on every surface value. This is also the change the contrast script paid for itself on: against a neutral panel the old `--accent-soft` sat at **1.01**, and every accent fill on a card would have gone invisible |
| Both directions of contrast get measured | Text against its ground needs 4.5; two surfaces that touch need about 1.10 or the edge is gone. Only checking the first is how a palette ends up legible and shapeless — dark `--accent-soft` sat at 1.03 against a card, making every `+` circle invisible while every text pair passed |
| A fill is measured against what the control sits on | `.nav-btn:hover` and `.theme-btn:hover` both filled with `--surface-sunk` and only one of them was wrong. The sidebar nav unwinds to no fill of its own, so its hover lands on the page — 1.08, under the floor. The theme button carries `--surface` at rest, so its hover lands on *that* — 1.20, fine. Fixing both the same way set the theme button's hover to the fill it already had, and the rule became a **no-op**: every token legal, every pair passing, and nothing happening on hover. **A check that reads values is blind to a rule that changes nothing**, so this one was found by hovering the button. The general shape: the ground for a fill is the thing directly beneath it, which is not always the page |
| A hover fill goes **down** in light and **up** in dark | Both reference light apps spend interaction state downward into grey, because white is the ceiling and their surfaces are already at or near it — while *elevation* still goes up towards white in both themes. The two point opposite ways and both are right. Mise had no hover token at all, and the sidebar's hover had drifted to the dark-mode answer: it filled with `--surface`, going *up*, because bare `--surface-sunk` measured 1.08 on the page and jumping over the page to white was the quickest way to clear the floor. `--hover` at `#eae4da` is the step down that was missing — 1.14 on the page, mid-band for the 1.10–1.25 the references measure at. **Dark's `--hover` deliberately holds the value dark already used.** Dark has nothing above `--surface` to spend, which is the open finding in [dark-mode-reference.md](dark-mode-reference.md#8-against-mises-current-dark-tokens); inventing a hex to close the symmetry would have answered a question nobody had looked at |
| No `--selected` token, because nothing would use one | The same report names hover *and* selected as missing. Selected was not added: every selected state in this app is an accent fill — the pressed chip, the day circle, the current nav item — so a neutral selected shade would have had no consumer. A token with no consumer is a token that drifts out of true unmeasured |
| A number measured out of a reference app can still be wrong for this one | The light report's §6 puts the focus ring at 4px with a gap, read off the pixels of a real app. Built at 4px it was too loud here — a thick orange band around the search field rather than a ring — and it went to 3px after a look. Nothing about the measurement was wrong; the accent is simply louder than the reference's blue at the same width. **A measured reference is evidence, not a spec.** The same round trimmed the scrim change for the opposite reason: the report warned against a heavy black scrim, and Mise's supposedly-heavy one measured 3.7 against the reference's 2.93, so the correction was real but far smaller than the wording implied |
| Where surfaces must sit close, a hairline carries the edge — **and then you measure the line** | A past day is meant to recede into the page, so its fill can't also hold a 1.10 edge. The border does it, on the card and on the tile inside. Adding this distinction to the contrast script turned four apparent failures into three legitimate hairline-carried edges and **one real defect**: dark `--surface-past` at 1.02 against the page, which is to say on the wrong side of it entirely. Without the split the script either passes everything at 1.02 or fails three pairs the convention allows |
| `--bg` is the page and nothing else | Tags, time pills, filter chips and the search field were all filled with `--bg`. On a warm near-white page that was merely pointless — a pill the colour of the page, sitting on a card. Once dark mode went neutral it became a defect: **the page shade is the darkest thing on screen, so a pill filled with it reads as a hole punched through the tile.** All four moved to `--surface-sunk`, which is exactly what "trays and inner tiles" was defined to mean. The general form is worth keeping: a token named for one layer should only ever appear on that layer, and the moment a palette changes lightness, a token used off its layer stops being harmless and starts being wrong |
| Saving is a bookmark, not a star | The save control was a star everywhere, while the sidebar's *Saved* view was a bookmark — two shapes for one idea, and the wrong one won on the button you actually press. A star says *rate this*; a bookmark says *keep this*, which is what the control does. It is now literally the same path (`BOOKMARK_PATH`). Worth noting how long it survived: the Saved view's empty state has read "tap the bookmark on any recipe" since v1, so **the copy had been describing the right icon for months while the icon disagreed** |
| `--accent` fills, `--accent-ink` writes | The accent is legible as a background but lands at 4.47 as text on a tinted tile. So every accent-coloured *word* uses `--accent-ink`, one step deeper; borders, dots, chips and fills use `--accent`. Backwards is how the floor breaks quietly |
| A past day is quieter by colour, never by opacity | Dimming a control blends its text back towards the tile and undoes the palette the contrast figures were computed from. Different tokens keep the numbers |
| One box per level | A card gets the border and nothing inside it gets a second one. Nested boxes were the main thing wrong with v1's week, and it's why no day card wraps the meals — the `<h2>` above them already names the day. The rule then quietly broke inside the meal card itself: the recipe sat in a filled tile, which is a box in a box however subtle the fill, and the mockup has nothing of the kind. The tile is gone and the **recipe name** carries the affordance instead — `--accent-ink`, underlined at rest at 45% of that ink and at full strength on hover (hover-only lasted one round; touch has no hover). Same for the save button, which was a bordered button beside a borderless one; it is now the `.icon-btn` it already claimed to be. **Two boxed controls on one card is the same defect as two boxes.** Where a control needs to say it is pressed, the glyph and the ink say it |
| A light palette is not a dark one inverted | Measuring both reference sets side by side ([light-mode-reference.md](light-mode-reference.md#7-light-and-dark-side-by-side)) turned up an asymmetry worth writing down. Some things hold in both themes: a raised surface moves *towards white*, and a separating hairline is *darker than the page*. Some flip: hover and selected go **up** in dark and **down** in light, a floating rim is lighter in dark and darker in light, and shadows do real work in light while both dark references use none at all. And the budgets differ — light gets about two usable fill levels to dark's five, so light leans on borders and shadows where dark leans on fills. Mise shows the cost directly: `--surface-sunk` steps down from the card, which is **right in light and wrong in dark**, because the light palette was designed first and the dark one inherited its structure instead of inverting its reasoning |
| `theme-color` is written by JS, not keyed to `prefers-color-scheme` | The obvious markup is two tags keyed to the OS preference, and it is wrong here: **the theme is a choice the user stores**, so anyone whose theme disagrees with their OS gets browser chrome fighting the page. It shipped that way once, with a light value left over from before the palette inversion. Now one tag, set from the live `--bg` by `applyTheme()` and again by the inline `<head>` script so there's no flash. Reading the token back off the element also keeps the hex out of a third place |

### One wrong turn worth recording

The picker cards reading as flush was diagnosed as a page-wide figure/ground problem, and the
whole palette was darkened to fix it. That wasn't it, and it was reverted (`5a70694` in the reflog
if the numbers are ever useful). The actual cause was local — white cards on a white panel — and
the fix was to recess that one panel. **A local symptom got a global fix, and the global fix was
wrong.**

## Spacing and rhythm

| Decision | Why |
|---|---|
| Four spacing tokens, and they govern the space *between* things | Eleven different numbers were doing vertical-gap duty — 10, 14, 16, 20, 22, 24, 28, 30, 48, 104 — each picked on its own at the moment it was needed. Nothing measured wrong and the week still read as one undifferentiated list, because **the gap that separates sections was the same size as the gap that separates siblings**: heading to week bar was 24, week bar to the day below it was 20. Four pixels is not a signal. `--space-1/2/3/4` at 8/16/24/40 give the four jobs four sizes — inside a group, between siblings, between blocks, between sections — so the page groups itself without any borders being added to do it |
| Padding *inside* a component is that component's own business | The scale was deliberately not run through every declaration in the file. A meal card's `16px 18px 18px`, a chip's `5px 11px`, a search field's `8px 14px` are the shape of that control, tuned against its own type and its 44px floor; snapping them to a four-step scale would resize half the controls in the app to fix a rhythm problem that lives between them. **The gaps are what the eye reads as rhythm; the paddings are what it reads as the control.** Same reason the horizontal flex gaps (10, 12) stayed put — they space things side by side, where there is no vertical rhythm to break |
| Two numbers stay off the scale on purpose | `.page`'s 104px/100px bottom padding is clearance for the floating nav, not rhythm — it is governed by the nav's own `bottom`, and rounding it to a scale step would either crash into the nav or leave a gap under it. The dialogs are off the scale too, for now: they are a separate surface with their own internal rhythm and no shared edge with the page, so the page was fixed first. **A scale nobody can point an exception at is a scale that gets worked around silently**, so the exceptions are named here and in the token comment |
| The heading is a section break, not a block break | It shipped in this branch at `--space-3`, the same 24px the week bar gets above the day, and looked cramped the moment it was seen at a real zoom level. **The heading is the largest thing on the page, so it needs the largest gap** — the same amount that separates the week bar from the day is not enough under 34px display type. `.view-head` is `--space-4` now, and on the week view the grid's *row* gap carries it while the column gap beside the summary panel stays `--space-3`: side-by-side is a block edge, top-to-bottom under a heading is a section break. Worth recording because the first pass got it from the scale rather than from the page — the step is right, the *choice* of step is a judgement the numbers do not make for you |
| The day gets a section break above it, the week bar does not get a taller box | The fix for "the week bar and the day run together" could have been a fill or a rule behind the bar. Both were rejected the last time round — the bar dissolved onto the page precisely so the meal cards are the only boxes on the week — so the separation is spent as **space**, `--space-4` above `.day-title`, which is also what the slot picker gets when it takes the day's place. Two things in the same slot get the same gap |

## CSS traps this project has already fallen into

Each of these cost a real bug.

**Media queries add no specificity.** A base rule written *below* one beats it on source order. So
every media query lives at the end of `style.css`, after what it overrides. The whole
`min-width: 1001px` block was partly dead for exactly this reason — it sat above the base `.page`
and `.toast` rules, so the wide padding never applied, and nothing about the CSS looked wrong.
A static check now fails if a base rule is ever written below the first media query.

**An outline is clipped by an ancestor's `overflow`, and it follows its own element's
`border-radius`.** The recipe card's focus ring was cut on three sides and showed as a stray orange
rule across the middle of the card: `.card-open` is flush with the card's edges and `.card` sets
`overflow: hidden`, which it needs, or the accent button in its foot squares off the rounded corner.
The first fix — a negative `outline-offset`, drawing the ring inside — left the top corners square
against the card's 13px curve, because an outline takes the *element's* radius and `.card-open` has
none of its own, so it fell back to the 4px in the global `:focus-visible` rule. Both properties
were needed. Two things make this a trap worth naming: the ring had been clipped since it was 2px
and nobody had seen it, and **neither the contrast script nor a screenshot of a resting page can
find it** — it only exists while something has keyboard focus.

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

**`auto` grid rows are content-sized only while the grid's own height is indefinite.** `.pick-grid`
gained `flex: 1` so it could fill the measured panel, which gives it a *definite* height — and with
one, the height is divided among the rows instead of the rows being sized by content. 27 rows of
recipes shared 330px, every card came out **2px tall** (its two borders), and the 125px button
inside each was clipped away by the card's own `overflow: hidden`. On screen it was two dozen blank
white strips. `grid-auto-rows: min-content` sizes rows by content either way, and cards still
stretch to their own row, so a row stays level. Worth naming for three reasons: nothing in the CSS
looks wrong, no token or wiring check can see it, and the fix is on the container rather than on
the thing that visibly broke. It was found by reproducing the screenshot in a headless browser and
asking the page for `.card`'s height — 2.0, with a 125px child.

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
6. `openSlotPicker()` — the **+ Add** that opened it is one of the meal cards being hidden, so
   focus goes to the panel that replaced them.

**The sixth one broke the fourth.** That single save-button lookup searched "the visible view" for
the replacement button — sound while the whole view was visible, and wrong the moment part of a
view became hidden without leaving the DOM. The hidden day still holds bookmark buttons, *earlier*
in document order than the picker's, so bookmarking a recipe from the picker while the same recipe
was planned in another meal that day aimed `.focus()` at a hidden button and dropped to `<body>`.
It is scoped to the open dialog, then the open picker, then the view. **A lookup that assumes
"visible view" means "everything in it is visible" is a lookup with an expiry date** — and this one
was found by reviewing the branch's own diff, not by using the app.

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

**A landmark named by a rotating string is not named.** The week `<section>` took its accessible
name from the greeting `h1` via `aria-labelledby`, and `WEEK_GREETINGS` picks a new one every load
— so the same region announced itself differently each visit, and anything a screen-reader user
learned about "Let's plan your week" was gone next time. The fix is a fixed `aria-label` on the
section; the greeting stays the visible heading, which is what it was for. The general shape: a
landmark name is an address, so it may not be built out of anything that rotates.

**A colour-only affordance is no affordance on a phone.** The recipe name in a meal card lost its
filled tile in PR #7 — correctly, one box per level — and what replaced it was `--accent-ink` plus
an underline *on hover*. Contrast passed (5.95 on a card, 5.61 on a past one) and focus still drew
the global ring, so no stated floor was broken, which is exactly why it survived a round. But
hover is a pointer idea: on touch, the app's most-used control was a differently-coloured word and
nothing else. It is underlined at rest now, the line at 45% of the ink so it reads as an
affordance rather than as a link in running prose, and hover takes it to full strength so the
hover feedback is kept rather than traded away. **A rule that passes every measurable floor can
still fail the device you did not test on.**

**The focus ring is the one control state a resting screenshot cannot show.** It is 3px of
`--accent`, offset 2px so it reads against both the control it surrounds and the surface behind it —
4.74 on a card, 4.28 on the page, comfortably over the 3.0 a non-text component needs. It was
clipped to invisibility on the recipe card for months (see the CSS traps above) and the only reason
anyone found out was pressing Tab. **Every other check this project runs looks at a page at rest.**
One case is knowingly left: on an accent-filled button the ring is orange on orange, held apart only
by the offset gap — legible, since the ring measures 4.74 against the card behind it and the gap is
what the reference relies on, but it reads as a blob. Seen, discussed, and left rather than fixed
with an invented second ring colour.

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
