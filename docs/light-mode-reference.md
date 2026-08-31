# Light mode reference — colour, hover and edge treatment

Companion to [`dark-mode-reference.md`](dark-mode-reference.md), same method and same structure.
Written from `Light mode Mockups/Other references/`: six screenshots of the Claude desktop app
and the Windows PowerToys settings app. Every hex was **read out of the pixels** — the PNGs
were decoded and sampled at named coordinates, and every ratio is the WCAG relative luminance
formula, the same one `check.mjs` uses.

One of the PowerToys screenshots is the *same screen* as the dark reference, which makes the
light/dark comparison in section 7 a direct one rather than an inference.

Scope: colour values, state changes, and how edges between components are drawn. Layout is out
of scope on purpose.

---

## 1. The two palettes, as measured

### PowerToys (WinUI 3) — light

| Role | Hex | Contrast vs. its own ground |
|---|---|---|
| Page | `#f3f3f3` | — |
| Card | `#fbfbfb` | 1.07 on page |
| Card edge line — **darker than the page** | `#e5e5e5` | 1.14 on page, 1.22 under the card |
| Input fill | `#fefefe` | 1.03 on card |
| Accent | `#0067c0` | 5.48 on card |
| Text **on** an accent fill | `#ffffff` | 5.67 |
| Primary text | `#1a1a1a` | 15.68 |
| Secondary text | `#606060` | 6.08 |

### Claude desktop — light

| Role | Hex | Contrast vs. its own ground |
|---|---|---|
| Content surface | `#ffffff` | — |
| Docked chrome — sidebar, modal rail | `#fcfcfb` | 1.03 below content |
| Seam between chrome and content | `#e4e4e3` | 1.24 on chrome |
| Nav row hover | `#f0f0ef` | 1.11 below chrome |
| Nav row selected | `#e3e3e2` | 1.25 below chrome |
| Divider, menu hover, segmented-control track | `#f3f3f3` | 1.11 below white |
| Input fill | `#fefefd` | 1.02 **above** chrome |
| Input border | `#e5e5e4` | 1.23 on chrome |
| Popover / menu fill | `#ffffff` | — same as content |
| Popover rim | `#bcbdbb` | 2.24 on white |
| Focus ring | `#456bb9` | 5.04 on chrome, 4.03 on a selected row |
| Toggle On | `#4c77ca` | 4.38 on white |
| Toggle Off track | `#cecece` | 1.57 on white |
| Modal scrim | `#969795` | 2.93 over white |
| Tooltip fill | `#0b0b0b` | 19.68 inverted |
| Primary text | `#0b0b0b` | 19.68 |
| Secondary text | `#888782` | 3.60 |

A third data point, incidental but consistent: the Windows File Explorer window in
`Screenshot 2026-09-01 000540.png` sits at `#ffffff` for its content and sidebar, `#fdfdfd` for
the toolbar, and drops to `#e8e8e8` for the recessed tab strip.

---

## 2. Colour rules both apps follow

**Greys are near-neutral, with a faint warm cast in one of them.** PowerToys is perfectly
neutral — `#f3f3f3`, `#fbfbfb`, `#e5e5e5`, R = G = B exactly, the same discipline as its dark
theme. Claude carries a **one-point warm tint** in its off-white chrome: `#fcfcfb`, `#e3e3e2`,
`#888782` — blue one step below red and green, never more. That is enough to read as paper
rather than plastic and small enough that it never turns beige.

This is the one place light mode allows what dark mode does not. In the dark references every
surface was strictly neutral, because a tint at low luminance goes muddy. Near white there is
room for a whisper of warmth, and one degree is the whole budget.

**The whole ramp is compressed.** Compare the first step off the page in each mode:

| | Light | Dark |
|---|---|---|
| PowerToys page → card | **1.07** | 1.15 |
| Claude / ChatGPT content → chrome | **1.03** | 1.30 |

Light mode has far less usable room. Luminance is non-linear: between `#f3f3f3` and `#ffffff`
there are twelve hex steps and almost no perceptual distance, while between `#000000` and
`#212121` there are thirty-three hex steps and a full 1.30 ratio. **You cannot build a light
theme out of fills alone** — there is not enough range — which is why sections 3 and 5 look so
different from their dark-mode counterparts.

**Body text is 16–20:1, not 4.5:1.** Both apps use near-black rather than pure black:
`#1a1a1a` and `#0b0b0b`, not `#000000`. Pure black on pure white is avoided in both.

| Tier | PowerToys | Claude |
|---|---|---|
| Primary | 15.68 | 19.68 |
| Secondary | 6.08 | **3.60** |

Claude's secondary text at 3.60 **fails** the 4.5 floor. It is used for descriptions under
labels, at a large-ish size, but it is a real miss and worth knowing before copying the value.
PowerToys' `#606060` at 6.08 is the safer model.

**Nothing is dimmed with opacity.** Same as dark mode: every softer shade is a solid hex.

---

## 3. The nesting ladder in light mode — and where it runs out

In the dark references, every level of containment stepped **lighter**, monotonically. Light
mode is not the mirror image of that, and the difference is the most useful thing in this
document.

### Containers still step towards white

| Depth | PowerToys light | PowerToys dark |
|---|---|---|
| 0 — page | `#f3f3f3` | `#202020` |
| 1 — card | `#fbfbfb` **1.07 lighter** | `#2b2b2b` **1.15 lighter** |
| 2 — input inside it | `#fefefe` **1.03 lighter** | `#383838` **1.17 lighter** |

Same direction in both themes. A raised surface moves **towards white** whether the page is
dark or light — it is not "away from the page", it is "towards the light". Claude does the same
thing: its search field is `#fefefd` on `#fcfcfb` chrome, up towards white by 1.02.

### But interaction states step *down*

This is the break. In dark mode, a hover and an elevation both went lighter — one shared
budget. In light mode they point in **opposite** directions:

| Claude light | Value | Direction |
|---|---|---|
| Chrome | `#fcfcfb` | — |
| Nav row hover | `#f0f0ef` | **down** 1.11 |
| Nav row selected | `#e3e3e2` | **down** 1.25 |
| Segmented-control track | `#f3f3f3` | **down** 1.11 from white |
| Selected segment inside that track | `#ffffff` | **back up** 1.11 |
| Toggle Off track | `#cecece` | **down** 1.57 |

A light theme has almost nothing above its surface — white is the ceiling and most surfaces are
already at or near it. So state has to be spent downward, into grey.

> **Rule: in dark mode, elevation and interaction point the same way. In light mode they point
> opposite ways** — elevation goes towards white, states go towards grey. A light theme built by
> naively inverting a dark one gets its hovers backwards.

### At white, the ladder stops entirely

`Screenshot 2026-09-01 001550.png` shows a submenu floating over a menu, over the page. All
three are the same value:

```
page behind     #fcfcfb
menu            #ffffff
submenu on it   #ffffff     ← identical, no further step
```

There is nowhere left to go. Depth 2 is carried **entirely** by a `#bcbdbb` rim and a soft
shadow (section 5) — no fill difference at all. In the dark reference the equivalent nesting
was `#000` → `#353535` → `#4a4a4a`, three distinct fills.

> **Rule: light mode gets roughly two fill levels, then hands off to borders and shadows.
> Dark mode gets four or five.** Plan the light theme around edges from the start rather than
> discovering halfway through that you have run out of greys.

### Direction summary

| Element | Light mode | Dark mode |
|---|---|---|
| Card, panel, raised container | **Up** towards white | **Up** towards white |
| Input fill | **Up** towards white | **Up** towards white |
| Hover / selected row | **Down** into grey | **Up** towards white |
| Recessed track, tray, well | **Down** into grey | **Down** towards black |
| Floating menu at the white ceiling | **No step** — rim + shadow | **Up** towards white |

---

## 4. Hover and state

Measured state deltas across the light references:

| Transition | Ratio |
|---|---|
| Chrome → nav hover (`#fcfcfb` → `#f0f0ef`) | 1.11 |
| Chrome → nav selected (`#fcfcfb` → `#e3e3e2`) | 1.25 |
| Hover → selected (`#f0f0ef` → `#e3e3e2`) | 1.13 |
| White → menu row hover (`#ffffff` → `#f3f3f3`) | 1.11 |
| Segmented track → selected segment (`#f3f3f3` → `#ffffff`) | 1.11 |

Two things differ from dark mode.

**a) The band is narrower and lower: roughly 1.10 to 1.25.** Dark mode ran 1.20 to 2.35, with
an icon-button hover at 2.33. Nothing in the light set comes close to that — the loudest state
change measured is 1.25. There is no room for a loud one, so light mode does not attempt it.

**b) Hover and selected are separate values here.** ChatGPT's dark sidebar used one value
(`#1a1a1a`) for both. Claude's light sidebar splits them — `#f0f0ef` and `#e3e3e2`, only 1.13
apart — and can afford to because the *selected* state also gets a focus ring and a bolder
label doing part of the work. Splitting two states 1.13 apart is only safe when something
non-colour also separates them.

**Neither light app relies on hover alone.** Both put the affordance in the icon and the label
first. That matters more here than in dark mode, because a 1.11 hover on a bright screen in
daylight is genuinely marginal.

---

## 5. Edges, shadows and blur — the big divergence

**The dark references had no drop shadow anywhere. The light references have real ones.**
This is the single largest difference between the two modes, and it was checked by scanning
across the edges pixel by pixel.

Claude's modal, scanning left from the panel edge — a smooth 30-pixel gradient:

```
#969795 (flat scrim) … #959694 #949593 #939492 #929391 #919290 #90918f #818280 #7f807f | #fcfcfb (panel)
```

Claude's popover, scanning left from the menu edge — a 20-pixel falloff, then a hard rim:

```
#fbfbfb #fafafa #f9f9f9 #f8f8f8 #f7f7f7 #f6f6f6 #f5f5f5 #f4f4f4 #f3f3f3 #f1f1f1 #f0f0f0 #eeeeee | #bcbdbb rim | #ffffff
```

Compare the dark equivalents, which went from panel to background in **one pixel** with no
falloff at all. The reason is straightforward: a shadow is a darkening, and darkening something
already near-black does nothing, while darkening something near-white is highly visible. **Light
mode can afford shadows, so it uses them; dark mode cannot, so it uses lightness instead.**

### The three edge treatments

| Situation | Treatment | Example | Ratio |
|---|---|---|---|
| Two surfaces nearly identical | **Darker hairline** | PT page `#f3f3f3` / card `#fbfbfb`, line `#e5e5e5` | fills 1.07, line 1.14 |
| Docked chrome meets content | **Darker seam**, 2 px | Claude `#fcfcfb` / `#ffffff`, seam `#e4e4e3` | fills 1.03, seam 1.24 |
| Something that genuinely floats | **Rim + soft gradient shadow** | Claude menu, rim `#bcbdbb` | rim 2.24 on white |

The first row is exactly the dark-mode technique, unchanged: PowerToys light uses `#e5e5e5`
under its card where PowerToys dark used `#1d1d1d`. **In both themes the separating line is
darker than the page.** That rule does not flip.

What does flip is the *rim* on floating things. In dark mode the popover rim was **lighter**
than the popover (`#414141` on `#353535`). In light mode it is **darker** (`#bcbdbb` on
`#ffffff`), and much louder — 2.24 versus 1.20. Where dark mode says "this floats" with
lightness, light mode says it with a hard dark edge plus a blur.

### Backdrops

Claude's modal scrim is `#969795` — a mid grey, **2.93** over white, and faintly warm like the
rest of the palette. Two things to note. It is much lighter than a naive `rgba(0,0,0,.5)`, and
it is a *flat* colour with the shadow gradient layered on top of it, not a blur. Neither app
uses `backdrop-filter` in either theme.

### Dividers

Claude draws dividers at `#f3f3f3` on white — **1.11**, barely there. The dark references drew
theirs at 1.59–1.60 against their panels. This is the compression from section 2 showing up
again: light mode simply cannot make a 1.6 divider without it reading as a heavy rule.

---

## 6. Accent, focus and inversion

### The accent flips, the usage does not

| | Light | Dark |
|---|---|---|
| PowerToys accent | `#0067c0` — deep blue | `#4cc2ff` — pale blue |
| Text on the accent fill | `#ffffff`, 5.67 | near-black, 10.47 |
| Accent on its card | 5.48 | 7.06 |

Same role in both themes — **a solid fill with maximum-contrast text on it**, used for toggle
tracks, key chips, and the slider. But the hue is re-picked per theme, not reused: a deep blue
on a dark ground would fail its floor, and a pale blue on a light ground would too. The two
values are not tints of one another; they are two separate answers to "what clears 4.5 here".

Claude's toggle-on blue is `#4c77ca` at 4.38 on white — under the text floor, though it is a
non-text UI component where 3.0 applies. Its focus ring `#456bb9` measures 5.04.

### Focus rings exist in light mode and were absent from the dark set

`Screenshot 2026-09-01 001529.png` shows a **4 px `#456bb9` ring, offset by a gap** from the
`#e3e3e2` selected row it surrounds. It measures 5.04 against the chrome behind it and 4.03
against the row inside it — deliberately readable against *both* sides, which is the same
"measure a line against both grounds" rule this project already applies to hairlines.

Nothing in the seven dark screenshots showed a focus ring. That is a gap in the dark reference
set, not evidence that dark mode does without one.

### Inversion is a legitimate fourth move

The tooltip in `Screenshot 2026-09-01 001500.png` is `#0b0b0b` with white text — **19.68**,
fully inverted against the light UI around it. It is not a step on the ladder; it steps off the
ladder entirely.

> **Rule: when a small transient element must be unmissable and the ramp has no room left,
> invert it rather than trying to find one more grey.** Tooltips, toasts and badges are the
> candidates. Anything persistent is not.

---

## 7. Light and dark, side by side

The payoff. What stays the same, what flips, and what has no counterpart.

### Stays the same

| Rule | Evidence |
|---|---|
| Raised surfaces move **towards white** | PT card is lighter than its page in *both* themes |
| The separating line is **darker than the page** | `#e5e5e5` light, `#1d1d1d` dark — same technique |
| Accent = solid fill + max-contrast text | `#0067c0`+white / `#4cc2ff`+near-black |
| Three text tiers, all solid, never opacity | both themes, both apps |
| Text at 15–20:1, not at the 4.5 floor | both themes, both apps |

### Flips

| | Light | Dark |
|---|---|---|
| Hover / selected direction | **down** into grey | **up** towards white |
| Rim on a floating surface | **darker** (`#bcbdbb`, 2.24) | **lighter** (`#414141`, 1.20) |
| Drop shadows | **real gradient blur** | **none at all** |
| Warm tint allowed | yes, one point (`#fcfcfb`) | no, strictly neutral |
| Extreme text colour | near-black `#0b0b0b`, not `#000` | pure `#ffffff` |

### Has no counterpart

| | |
|---|---|
| Available fill levels | light ~2, dark ~5 |
| State-change band | light 1.10–1.25, dark 1.20–2.35 |
| Divider strength | light 1.11, dark 1.59 |
| First step off the page | light 1.03–1.07, dark 1.15–1.30 |

**The one-sentence version:** dark mode has range and spends it on fills; light mode has almost
none and spends borders and shadows instead. Inverting one theme's numbers to make the other
produces backwards hovers, invisible shadows, and a ramp that runs out.

---

## 8. Checklist for a light theme

1. Near-neutral greys; at most a one-point warm tint on the off-white chrome. Never more.
2. Page below white (`#f3f3f3`–`#f6f3ee`) if cards need to sit *above* it; page at white only
   if everything nests downward.
3. Expect about **two** usable fill levels, then plan on borders and shadows. Do not try to
   build a light theme the way you would build a dark one.
4. Raised containers and input fills go **towards white**; hover, selected, tracks and trays go
   **down into grey**. These are opposite directions and both are correct.
5. State changes land in **1.10–1.25**. If two states must sit 1.13 apart, something non-colour
   (a ring, a bolder label, an icon) has to separate them too.
6. Text in three tiers, roughly 16 / 6 / 4.5, all solid values, never opacity. Near-black, not
   `#000000`. **Check the secondary tier** — the reference misses it at 3.60.
7. Separating hairlines are **darker than the page** in light mode exactly as in dark mode.
8. Floating surfaces get a **dark rim plus a soft gradient shadow**; docked ones get a flat
   2 px seam and no shadow.
9. Scrims are a mid grey around 2.9 over white, not a heavy black.
10. One accent, re-picked for this theme rather than reused from the dark one: a solid fill with
    white text on it.
11. Give focus its own ring, offset from the control, measured against **both** the control and
    the surface behind it.
12. When something small and transient must be unmissable, **invert it** rather than hunting for
    one more grey.
13. Measure both directions with a script. Every number in this document came from one.

---

## 9. Against Mise's current light tokens

Measured from `style.css`, `:root`, on 2026-09-01.

```
--bg           #f6f3ee
--surface      #ffffff   1.11 above bg
--surface-sunk #f0eae1   1.20 below surface, 1.08 below bg
--surface-past #faf8f5   1.04 on bg
--line         #e3dbd0   1.24 on bg, 1.37 on surface
--line-strong  #cabbaa   1.88 on surface
--ink          #191310   18.39 on surface
--ink-soft     #56463c   8.99 on surface
--ink-faint    #6a5849   6.76 on surface
--accent       #c8491f   4.74 on surface
--accent-ink   #ad4020   5.95 on surface
--accent-soft  #fbe9e1   1.18 on surface
--on-accent    #ffffff   4.74 on accent
```

**The light theme is structurally right, and more right than the dark one.** Read against
section 3, every direction is correct: the page sits below white at `#f6f3ee` so cards can rise
to `#ffffff` (1.11, between PowerToys' 1.07 and Claude's 1.03); `--surface-sunk` goes **down**
from the card into grey, which is what light-mode trays and tiles are supposed to do; and
`--surface-past` recedes towards the page. Three text tiers at 18.39 / 8.99 / 6.76 are all
comfortably clear, with `--ink-faint` at 6.76 well above the 3.60 that Claude ships.

That is worth stating plainly because it sharpens the dark-mode diagnosis. `--surface-sunk`
going down is **correct in light and wrong in dark** — it is the same token doing the right
thing at `#f0eae1` and the wrong thing at `#212121`, because the light palette was designed
first and the dark one inherited its structure rather than inverting its reasoning.

Four observations, none urgent:

**a) The ramp is compressed at the same point the references are.** `--bg` to `--surface` is
1.11 and `--bg` to `--surface-sunk` is 1.08 — both under the project's 1.10 target in one case
and barely over it in the other. The existing comment in `style.css` already documents this and
already solves it the way both references do, with `--line` carrying the edge at 1.24 on the
page and 1.37 on a card. That is the right answer and matches PowerToys' 1.14–1.22 hairline
exactly. No change needed; it is simply worth knowing that this is not a Mise problem but the
structural limit of light mode from section 2.

**b) There is no hover or selected token, in either theme.** Section 4 puts light-mode state
changes at 1.10–1.25. Against `--surface` that means roughly `#f0f0f0`–`#e8e8e8`, warmed to
match; against `--bg`, roughly `#ebe6df`. This is the light-mode half of the same gap flagged
in the dark report — there, states have nowhere to go *up*; here, nowhere to go *down* that is
named. Both would be fixed by the same pair of tokens, pointing opposite ways per theme.

**c) `--accent` at 4.74 on white is close to the floor, and 4.74 is also `--on-accent`.** The
accent both writes at 4.74 and is written on at 4.74. It clears, but there is no margin, and
this is why `--accent-ink` at 5.95 exists for words. Worth keeping in mind if the orange is ever
warmed further — it moves both numbers at once.

**d) No shadow token differences between themes are documented.** Section 5 is emphatic that
shadows are a light-mode device and do nothing in dark mode. `style.css` does define a darker
`--shadow` for dark mode, which is the right instinct, but both reference dark themes dropped
shadows entirely in favour of lightness. Whether Mise's dark shadows are visible at all is a
question for the browser, not the script.

None of this is a proposal to change tokens. `check.mjs` and a browser both have to agree
before anything moves — this is the measured gap between `style.css` today and what the
reference apps do.
