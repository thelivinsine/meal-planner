# Dark mode reference — colour, hover and edge treatment

Written from `Dark mode references/`: eight screenshots of the ChatGPT desktop app and the
Windows PowerToys settings app. Every hex here was **read out of the pixels**, not eyeballed —
the PNGs were decoded and sampled at named coordinates, and every ratio is the WCAG relative
luminance formula, the same one `check.mjs` uses.

Scope: colour values, state changes, and how edges between components are drawn. Layout is out
of scope on purpose. The companion is [`light-mode-reference.md`](light-mode-reference.md);
its section 7 sets the two themes side by side.

---

## 1. The two palettes, as measured

### ChatGPT desktop — dark

| Role | Hex | Contrast vs. its own ground |
|---|---|---|
| Canvas — page **and** sidebar, one shade, no seam | `#000000` | — |
| Sidebar row, hover **and** active | `#1a1a1a` | 1.21 on canvas |
| Panel / modal sheet / composer pill | `#212121` | 1.30 on canvas |
| Control fill in a panel — icon button rest, selected nav row | `#303030` | 1.22 on panel |
| Nav row hover | `#383838` | 1.37 on panel |
| Hairline / divider / input stroke | `#424242` | 1.60 on panel |
| Icon button **hover** | `#676767` | **2.33 on its own rest fill** |
| Floating popover fill | `#353535` | 1.71 on canvas |
| Popover rim, 1 px | `#414141` | 1.20 on popover |
| Popover selected row | `#4a4a4a` | 1.38 on popover |
| Popover divider | `#535353` | 1.59 on popover |
| Sunk text-entry well inside a panel | `#000000` | 1.30 **below** panel |
| Primary text | `#ffffff` | 16.10 |
| Secondary text | `#afafaf` | 7.34 |
| Placeholder | `#828c8d` | 4.67 |

### PowerToys (WinUI 3) — dark

| Role | Hex | Contrast vs. its own ground |
|---|---|---|
| Page | `#202020` | — |
| Card | `#2b2b2b` | 1.15 on page |
| Card edge line — **darker than the page** | `#1d1d1d` | 1.03 on page, 1.19 under the card |
| Sub-row inside a card | `#2d2d2d` | 1.03 on card |
| Control stroke / input fill | `#383838` | 1.21 on card |
| Accent | `#4cc2ff` | 7.06 on card, 8.12 on page |
| Text **on** an accent fill | near-black | 10.47 |
| Primary text | `#ffffff` | 16.29 |
| Secondary text | `#cccccc` | 10.15 |

---

## 2. Colour rules both apps follow

**Greys are perfectly neutral.** Every surface value in both apps has R = G = B *exactly* —
`#212121`, `#2b2b2b`, `#353535`, `#4a4a4a`. No warm tint, no cool tint, no fashionable dark
navy. All the chroma on screen lives in content and in at most one accent. A tinted dark grey
photographs well in a mockup and goes muddy on a real monitor.

**The ramp is logarithmic, not linear.** Steps get bigger in hex as you climb, because the eye
needs a larger absolute step at higher luminance to see the same difference:

```
ChatGPT:   00  →  21  →  30  →  38  →  42  →  67
hex gap:      33     15      8     10     37
ratio:      1.30   1.22   1.13   1.20   2.33
```

The first step off pure black is the biggest jump in hex and still only a 1.30 ratio. `+0x08`
near the bottom (`#000` → `#080808`) is invisible; the same `+0x08` at `#303030` → `#383838`
is a perfectly usable hover. **Near black, spend hex generously. Higher up, spend it
carefully.** This is the single most common reason a hand-picked dark ramp feels wrong: even
hex spacing produces uneven perceived spacing.

**Body text is 16:1, not 4.5:1.** Both apps put pure white on their darkest surfaces. Neither
treats 4.5 as a target — 4.5 is where the *third* tier lands, and only just:

| Tier | ChatGPT | PowerToys |
|---|---|---|
| Primary | 16.10 | 16.29 |
| Secondary | 7.34 | 10.15 |
| Placeholder / disabled | 4.67 | — |

Three text weights, not five, with large gaps between them. Four greys at 9, 8, 7 and 6 read
as one mushy grey; three at 16, 7.5 and 4.7 read as a hierarchy.

**Nothing is dimmed with opacity.** Every softer shade is its own solid hex. Opacity over a
dark ground pulls a colour towards the ground and quietly destroys the ratio you measured.

---

## 3. The nesting ladder — deeper means lighter

**This is the organising principle underneath everything else in this document.** In both apps,
every level of containment steps *lighter* than the thing containing it. A component inside a
component inside a component climbs the grey ramp, monotonically, every time.

The three chains, measured end to end:

| Depth | ChatGPT panel | ChatGPT popover | PowerToys |
|---|---|---|---|
| 0 — page | `#000000` | `#000000` | `#202020` |
| 1 — the container | `#212121` panel **1.30** | `#353535` menu **1.71** | `#2b2b2b` card **1.15** |
| 2 — a component inside it | `#303030` control **1.22** | `#4a4a4a` row hover **1.38** | `#2d2d2d` sub-row **1.03** |
| 3 — a component inside *that* | `#383838` hover **1.13** | — | `#383838` input **1.17** |

`Screenshot 2026-09-01 000935.png` — the chat context menu — is the cleanest single example of
the ladder in one component: page `#000000`, menu `#353535`, hovered *Archive* row `#4a4a4a`,
with the rim at `#414141` and the divider at `#535353`. Three depths, three shades, all up.

Three things fall out of the table:

**a) The step *shrinks* with depth.** ChatGPT's chain goes 1.30, then 1.22, then 1.13. There is
less headroom left at each level, so each level is allowed less of it. This is why depth 3 and
beyond stops working with fill alone and needs a hairline instead (section 5).

**b) How far a container jumps encodes how much it floats.** ChatGPT's docked settings panel
sits at `#212121` (1.30 off the page); its floating popover, at the *same* nesting depth, sits
at `#353535` (**1.71**). Same depth, very different heights. So the ladder is not a fixed scale
you index into — it is relative, and the size of the first jump is the elevation signal.

**c) The ladder and the hover ladder are the same ladder.** A hover is just one more rung: a
control at `#303030` hovering to `#383838` is doing exactly what a sub-row does when it sits
inside a card. Nesting depth and interaction state spend from one shared budget — which is why
a theme that spends it all on nesting has nothing left for hover (section 4).

### The two exceptions

**Large multi-line entry wells go down.** ChatGPT's custom-instructions textarea is `#000000`
inside a `#212121` panel — 1.30 *below* its container. This is the only element in the whole
sample set that reverses direction, and the distinction is affordance, not size alone: a chip
or a button is a raised object you press, a big text well is a hole you type into. Note it only
works because the panel sits 1.30 above black in the first place; on a compressed ramp there is
nothing to sink to and a sunk element reads as a gap rather than a well.

**Single-line fields don't move at all.** The settings search box is the panel shade exactly,
`#212121`, with a `#424242` stroke around it. It is an outline, not a surface. This is the safe
default when you are unsure of the direction, and the one to reach for when the ramp is tight.

Summarised:

| Element | Direction | Why |
|---|---|---|
| Panel, card, popover, menu | **Up**, by a lot if it floats | it contains things |
| Chip, pill, tag, icon button, row | **Up**, by less | a raised, pressable object |
| Single-line field, search box | **Neither** — stroke only | an outline, not a surface |
| Large multi-line entry well | **Down** one step | a hole you type into |

> **Rule: containment goes up, recession goes down, and only one element type recedes.** If you
> cannot say which of the two a component is, outline it instead of filling it.

---

## 4. Hover and state — where the headroom goes

This is the part most dark themes get wrong, and it is a colour problem, not a layout one.

Look at what ChatGPT reserves *above* its panel shade:

```
#212121   panel                                  ← the resting surface
#303030   control at rest            1.22 on panel
#383838   nav row hover              1.37 on panel
#424242   borders                    1.60 on panel
#676767   icon button hover          2.33 on the control's own rest fill
```

**Five usable levels above the resting surface.** And the loudest hover is not a polite nudge:
`#303030` → `#676767` is a **2.33 ratio**, a bigger jump than the one between the page and the
panel. The button becomes obviously, almost aggressively lighter.

Measured state deltas across both apps:

| Transition | Ratio | Note |
|---|---|---|
| Sidebar row rest → hover (`#000` → `#1a1a1a`) | 1.21 | quietest state in either app |
| Sidebar row hover = selected | 1.21 | **the same value; not distinguished by fill** |
| Nav row rest → hover (`#212121` → `#383838`) | 1.37 | |
| Popover row rest → selected (`#353535` → `#4a4a4a`) | 1.38 | |
| Icon button rest → hover (`#303030` → `#676767`) | 2.33 | loudest |

Two things fall out of that table.

**a) 1.20 is the floor for a state change, and the top of the range is much higher than
people expect.** Anything under about 1.15 is not a hover, it is a rounding error — and no
contrast script will flag it, because both values pass on their own. The useful band is
roughly **1.20 to 2.35**, with small icon buttons at the loud end because they have no label
and nothing else to signal with.

**b) Hover and selected can share a value.** ChatGPT's sidebar uses `#1a1a1a` for both — the
distinction is carried by text weight and the persistent trailing icons, not by a third grey.
Inventing a separate `selected` shade between `hover` and `rest` is how a ramp runs out of
room.

**The failure mode this prevents:** a theme picks a page and a card, both look good in a
static mockup, and then every hover, focus and selected state has to be squeezed into whatever
hex is left. Everything ends up 1.04 apart and the interface feels dead. **Choose the resting
surface so there is room above it, then design the states** — the card should sit no higher
than about `#2b2b2b` to leave five levels overhead.

**Hover is not the only signal, because touch has no hover.** Both apps also carry the state
in the icon and label; the fill is the reinforcement, not the whole message.

---

## 5. Edges, shadows and blur

**Neither app uses a drop shadow. Anywhere.** This was the most surprising thing in the
sampling, so it was checked in three places:

- ChatGPT's **modal sheet**: scanning right from the sheet edge gives `#212121, #212121,
  #212121, #000000, #000000, …`. Panel to backdrop in one pixel. No falloff, no penumbra.
- ChatGPT's **popover menu**: scanning right from the edge gives `#353535, #373737, #000000,
  #000000, …`. A one-pixel `#414141` rim, then nothing.
- PowerToys' **card**: scanning down onto the card gives `#202020 ×8, #1d1d1d, #1d1d1d,
  #2b2b2b, …`. A flat 2 px band at a *fixed* value, not a gradient.

Elevation is expressed by **lightness and a hairline**, not by blur. A thing that floats is
lighter; a thing that is docked is darker; the boundary is one or two solid pixels. A soft
blurred shadow over a dark ground is nearly invisible anyway — you are darkening something
that is already almost black — so both apps spend the pixel on an edge instead.

### The three edge treatments

| Situation | Treatment | Example | Ratio |
|---|---|---|---|
| Two surfaces far apart in lightness | **No edge at all** | GPT panel `#212121` on canvas `#000` | 1.30 |
| Two surfaces nearly identical | **Darker hairline** below/left | PT card `#2b2b2b` on page `#202020`, line `#1d1d1d` | fills 1.15, line 1.19 under the card |
| Something that genuinely floats | **Lighter rim**, 1 px | GPT popover `#353535`, rim `#414141` | 1.20 |

The middle row is the most transferable trick in either app. PowerToys' card is only **1.15**
from its page, and its sub-rows are **1.03** from the card — effectively the same colour. Both
are separated entirely by a `#1d1d1d` line that is *darker than the page itself*. A dark
hairline reads as a shadow, which is what the eye expects between stacked physical objects. A
*light* hairline in dark mode reads as a rim-lit outline — a different and louder statement,
correctly reserved here for the floating popover.

> **Rule: below ~1.20 between two touching surfaces, stop pushing the fills apart and draw the
> edge instead — and in dark mode, draw it darker, not lighter.** Save the light rim for
> popovers, menus and toasts.

### Backdrops

ChatGPT's modal backdrop is a **heavy near-opaque dark scrim, not a glassy blur**. Content
behind it flattens to `#000000` across most of the screen, and a saturated blue button behind
the scrim reads as `#151821` — dimmed almost to the canvas. The scrim's job is to remove the
background from consideration, not to decorate it. Nothing in either app depends on
`backdrop-filter`.

### Dividers

Both apps draw dividers *lighter* than the surface they sit on, and both put them well above
the fill steps around them:

- ChatGPT panel `#212121`, divider `#424242` — **1.60**, louder than any surface step.
- ChatGPT popover `#353535`, divider `#535353` — **1.59**.
- PowerToys card `#2b2b2b`, control stroke `#383838` — 1.21.

A divider inside a panel is deliberately *more* contrasty than the panel-to-page step. It has
to survive being one pixel tall.

---

## 6. Accent colour — absent, or structural

The two apps take opposite positions, and both are coherent.

**ChatGPT's chrome has no accent colour at all.** Sidebar, settings, modals, menus, buttons —
greys and white, end of story. The only saturated pixels in the entire screenshot set are
inside message content and one blue send button. Every affordance is carried by lightness.

**PowerToys uses `#4cc2ff` constantly, and always the same way: as a fill with near-black text
on it.** The toggle track when On, the keyboard-shortcut chips (`Ctrl`, `D`), the hyperlink.
Measured 7.06 on a card, 8.12 on the page, and **10.47 for the dark text sitting on the
accent**. Never accent-coloured body text on a dark ground, never an accent-tinted border
doing structural work.

Note the accent is a **light** blue, not a mid blue. On a dark ground a mid-saturation brand
colour usually fails its contrast floor; the dark-mode variant has to be lightened until it
clears, and then it is bright enough to be used as a fill with dark text on top.

> **Rule: pick one accent job and do only it.** Either the accent fills small solid shapes
> with dark text on top, or a *lightened* accent variant writes words. Doing both with one
> value breaks one of them.

**One measured wobble, kept honest.** The destructive *Delete* item in the context menu is red
text `#dd5447` on the `#353535` menu — **3.17**, under the 4.5 floor. ChatGPT ships it anyway,
carried by the red trash icon beside it. Worth knowing that the reference is not perfect here;
a lighter red (around `#ff8a80`) clears 4.5 on the same ground without losing the meaning.

What is *not* coherent is the common middle ground: accent-tinted borders, accent backgrounds
at 8% opacity, and accent text at three different weights, all at once. Neither reference does
any of it.

---

## 7. Checklist

1. Neutral greys — R = G = B on every surface value. Chroma comes from the accent and content.
2. Page shade chosen against the *deepest* thing you need. Pure black only if nothing recedes
   below the page; the moment you want a shadow line or a sunk well, start at `#1a1a1a`–`#202020`
   so there is floor space beneath you.
3. Six surface values, logarithmically spaced — big hex steps near black, small ones higher up.
4. **Every level of containment steps lighter than its container**, by a shrinking amount:
   roughly 1.30, then 1.22, then 1.13. Containment goes up; only a large entry well goes down;
   when in doubt, outline instead of filling.
5. Nesting and hover spend from the **same** budget. Count the deepest nesting you need *and*
   the states it has to support before fixing the card shade.
6. Text in three tiers, roughly 16 / 8 / 4.7, all solid values, never opacity.
7. Every pointer-reactive element has a hover **≥ 1.20** above its own rest fill; small
   unlabelled icon buttons go to ~2.3. Hover and selected may share a value.
8. Surfaces closer than ~1.20 get an edge instead of more fill: a **darker** hairline for
   stacking, a lighter 1 px rim only for things that genuinely float.
9. Dividers inside a panel are ~1.6 against it — louder than the surface steps around them.
10. No drop shadows, no backdrop blur. Elevation is lightness plus a hairline.
11. One accent, one job: a bright fill with dark text on it, or a lightened variant for words.
12. Measure both directions with a script. Every number in this document came from one.

---

## 8. Against Mise's current dark tokens

Measured from `style.css`, `[data-theme="dark"]`, on 2026-09-01. **Nothing here has been acted on**
— PR #10 fixed the *light* half of the shared hover gap and deliberately left dark alone, so the
two themes are asymmetric on purpose until someone looks at dark. `--hover` exists in dark as of
that PR, holding `#2b2b2b`, which is the value the dark sidebar hover already used: a placeholder
carrying today's behaviour, not an answer to anything below.

```
--bg           #1a1a1a
--surface      #2b2b2b   1.23 on bg
--surface-sunk #212121   1.14 BELOW surface, 1.08 above bg
--surface-past #232323   1.11 on bg
--line         #3a3a3a   1.53 on bg, 1.24 on surface
--line-strong  #545454   1.87 on surface
--ink          #f5f3f1   12.79 on surface
--ink-soft     #c2bebb   7.67 on surface
--ink-faint    #9b9794   4.89 on surface
--accent       #ff7a4f   5.49 on surface
--accent-ink   #ffab8b   7.72 on surface
--accent-soft  #4a2c1a   1.12 on surface
--hover        #2b2b2b   = --surface; placeholder, see above
--on-accent    #1e1207   7.12 on accent
```

**What already matches the references and should not be touched:**

- Neutral greys. Moving off the old brown (`#14100d` / `#2a2019`) was right, and for exactly
  the reason section 2 gives — both references are precisely neutral.
- Three text tiers at 12.79 / 7.67 / 4.89, close to ChatGPT's 16.10 / 7.34 / 4.67.
- `--on-accent` as near-black on the accent fill at 7.12 — the PowerToys pattern.
- `--line` at 1.53 on the page and 1.24 on a card, in the same band as ChatGPT's dividers.
- `--surface-past` pulled *towards* the page rather than past it.

**Three gaps, in order of how much they explain the flat feeling:**

**a) There is no token above `--surface`.** The ramp stops at `#2b2b2b`. ChatGPT keeps five
levels above its panel; Mise keeps none — so hover, selected and pressed states have to be
built out of `--surface-sunk` (which is *darker*) or `--line`. This is the headroom problem in
section 4, and since nesting and hover share one budget (section 3c), the ladder tops out at
depth 1 with nothing left for depth 2 or for any state. Most likely source of the flat feeling. A raised step near `#3a3a3a`
(1.21 on surface, matching PowerToys' control fill) and a hover near `#4a4a4a` (1.38, matching
ChatGPT's popover-selected step) would give states somewhere to go, with `#5a5a5a`–`#676767`
available for the loud icon-button hover.

**b) `--surface-sunk` goes down, against the ladder, into almost nothing.** It is 1.14 below the card and only
**1.08** above the page — under this project's own 1.10 floor against `--bg`. That is one step
away from being the same "hole punched through the tile" bug `CLAUDE.md` already documents for
`--bg`. Both references put small inner elements — chips, tags, pills, icon buttons — *above*
their card, not below — that is the section 3 ladder, and `--surface-sunk` is the one token in
Mise that runs against it. Section 3's exception does not rescue it: the exception is for large
multi-line entry wells, and Mise has none. The tags, filter summary chips and search fields that
use this token are all in the "small and pressable, therefore up" row. (The time pill was one of
them until PR #13 took its fill away — it is bare text now, which sidesteps the question rather
than answering it.)

**c) `--accent-soft` at 1.12 on a card is scraping the floor.** It clears 1.10 by 0.02.
PowerToys never uses a dark tinted accent fill at all — it uses the *bright* accent as the
fill with dark text on top, which measures 10.47 instead of 1.12. If accent-soft keeps being
hard to see, the reference answer is to stop making a dark tint work and invert the element.

None of the above is a proposal to change tokens. `check.mjs` and a browser both have to agree
before anything moves — this is the measured gap between `style.css` today and what the two
reference apps do.
