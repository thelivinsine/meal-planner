# Mise — weekly meal planner

Plan what you're eating this week. Browse a catalogue of 50 recipes, drop them into
breakfast / lunch / dinner slots on real dates, and bookmark the ones you like.
Everything is saved in your own browser — no account, no server, nothing leaves your machine.

**Live app:** https://thelivinsine.github.io/meal-planner/
**Code:** https://github.com/thelivinsine/meal-planner

## Built under deliberate constraints

| | |
|---|---|
| **Stack** | One HTML file, one CSS file, one JS file. Vanilla — no frameworks, no libraries, no build step |
| **Data** | `localStorage` only. No server, no database, no API calls |
| **Hosting** | GitHub Pages, static files, relative paths, `index.html` at the root |
| **Tests** | No test framework, per the constraints. Every check is a throwaway Node script against a stub DOM, plus computed contrast and static wiring — [how that works](docs/architecture.md#how-this-gets-tested) |

The one place the "static files only" rule bends is Google Fonts, the app's single external
request; blocked or offline, you get the fallback stack.

## Where to read what

Five documents, each with one job:

| | |
|---|---|
| **This file** | What the app is and what it does |
| [docs/status.md](docs/status.md) | **Start here in a new session.** Live commit, open work, next jobs, what isn't verified. The only doc that goes stale |
| [docs/architecture.md](docs/architecture.md) | The three files, the data model, storage, rendering, and how it gets tested |
| [docs/decisions.md](docs/decisions.md) | Why each choice was made — including the CSS traps that each cost a real bug |
| [docs/log.md](docs/log.md) | What happened in what order, and what each round of testing covered |
| `CLAUDE.md` | Rules for the AI assistant working in this repo |

## What it does

**Recipes** — the cookbook.
- 50 recipes, each with tags, cooking time, ingredients and a short method. Over half are Indian
  and roughly three quarters high-protein; the rest are tagged `balanced`. Both are ordinary tags,
  so the `indian` and `high-protein` chips filter on them
- Search matches names, tags **and** ingredients — so "chickpea" finds the curry
- Filters in one panel: search, then tag chips grouped under *Macros*, *Meal*, *Diet*,
  *Cuisine & style* and *Main protein* — five short lists instead of one wrap of sixteen.
  **Filters** collapses them and carries a count badge; an active row underneath names what you're
  filtering by, with **Clear all** beside it
- Pick several chips and a recipe matching any of them shows
- Tapping a card opens a detail panel; close it with the ×, Escape, or a tap outside

**Week** — your plan, one day at a time.
- The heading is a different line every time you load the app — *Seven days, twenty-one meals*,
  *Right then — what are we eating?* — one line, no subtitle, centred over the week. It is a
  greeting, not a label; the week bar under it says which week this is
- One tile at the top carries the whole week: the date range with ← / → either side, and the seven
  days under it — weekday over date, the date in a circle. **Today** appears beside the range only
  once you've paged off the current week, which is the only time it has work to do
- **The selected day's circle fills with the accent.** Today is marked with a dot, a day with
  something planned has a tinted circle, and a day gone by is quieter. So the row is the overview:
  where you are, what day it is, and the shape of the week
- Below it, the day's name and then **one card per meal** — the biggest thing on the screen, which
  is the point of them. A filled one shows the recipe name in accent ink, underlined when you hover
  it because tapping it opens the recipe, then its time and what it is (*10 min · Balanced ·
  Vegetarian*), with a save star and a × to clear it. Nothing inside the card gets a box of its own.
  An empty card is a dashed **+ Add a dinner** the width of it
- Each slot can be filled, replaced, or cleared. Past days stay editable, so you can log what you
  actually ate — they just read quieter
- **The same layout at every width.** There is no mobile version of the week; only below 400px
  does the day row wrap four and three, so every button clears 44px on a thumb
- It opens on today when today is in the week on screen, Monday otherwise

**The summary column** — wide screens only, down the right.
- *At a glance*: how many of the day's three meals are planned, with a bar; total cooking time,
  reading `0 min` rather than a dash on an empty day, because the dash looked like a rendering
  fault; and a one-word read on balance from the macro tag every recipe carries
- *Tips for today*: one line picked to fit the day in front of you rather than at random — it says
  something different about an empty day, a half-full one, a day of nothing but meat, and a day
  that adds up to two hours at the stove
- Both are computed from the day beside them, which is why they're dropped rather than stacked on a
  narrow screen: there's nothing in them you can't read off the meals themselves

**Adding a meal — two ways in, never merged.**

*From the week.* Tap **+ Add** on an empty slot and the recipe list opens in the space below your
week. The day and meal are already known from the slot you tapped, so it never asks again: the
recipes appear as the same cards you get on the Recipes page, except the button reads **Add to Thu
breakfast** and fills the slot you tapped. Not sure about one? Tap the card to read the full
recipe — the sheet's calendar icon adds it straight to the slot you came from, because the day and
meal are already settled and this app never asks twice. This route is for empty slots only.

*From a recipe.* **Add to week** on any card, or the calendar icon in the detail panel, opens a
small dialog. The recipe name is the headline; "Add to week" sits above it as a small label.
- Pick a day from seven buttons and a meal from three — everything visible, two taps
- Picking a day that's already gone is allowed but flagged: the dialog says so, and that day's
  button is drawn with a dashed border
- If the slot is taken, the dialog names what's there and the button reads **Replace**

**Saved** — exactly the recipes you've bookmarked, from either the card or the detail panel.
Removing a bookmark drops it from Saved immediately but leaves it in your week: unsaving a recipe
isn't the same as cancelling dinner.

## For anyone reading this without a technical background

**What it does.** Three screens. *Recipes* is the cookbook — search it, filter it, tap a recipe to
read the ingredients and method. *Week* is your plan for the week: seven real days, three meal
slots each. *Saved* is your shortlist of favourites.

**How it saves your plan.** Your browser has a small built-in storage box. The app keeps your week
and your bookmarks there, so closing the tab and coming back later keeps everything. The catch is
that it's per-browser and per-device: your plan on your laptop is not the same plan as on your
phone, and clearing your browsing data clears it. That's the honest trade for having no accounts
and no server to run.

**One day at a time.** *Week* shows the seven days as a row of buttons and then the one day you
picked, as three meal cards. That's true on a laptop and on a phone — the same screen, not two
designs. A tinted date is a day you've already planned something for, so the row still shows the
shape of your week at a glance. On a wide screen there's a column down the right with the day's
numbers in it: how many meals you've planned, roughly how long they'll take, and one suggestion.

**What it deliberately doesn't do yet.** No shopping list, no month calendar, no adding your own
recipes, no sharing a plan with anyone else. Those are sensible next steps rather than oversights —
the reasoning for each is in [docs/decisions.md](docs/decisions.md#deliberately-not-built).

## Three decisions worth reading

The full set is in [docs/decisions.md](docs/decisions.md). These three cost the most to learn:

- **The plan is keyed by real date, not by weekday.** `state.plan['2026-08-26|Dinner']`. It's what
  makes next week a genuinely separate plan rather than the same seven slots relabelled — and it's
  why entries older than four weeks get pruned on load.
- **Contrast gets measured in both directions, by a script that reads the tokens out of the
  stylesheet.** Text on its ground needs 4.5; two surfaces that touch need about 1.10 or the edge
  disappears. Checking only the first is how a palette ends up legible and shapeless — one colour
  sat at 1.03 against a card, making a control invisible, while every text pair passed.
- **Passing the measurements is not the same as looking right.** A palette that cleared every ratio
  still read as one beige wash next to the mockups, twice, one shade apart. The script is a floor,
  not a verdict — which is why the mockups get looked at again after it passes.
- **A grid item with auto inline margins doesn't stretch to its track.** `margin: 0 auto` centres a
  block but shrink-to-fits a grid item, so the week once rendered at a third of its width. Two
  careful readings of the CSS missed it and one screenshot found it — which is why a rendered look
  is now the check for anything touching layout, not the optional extra.

## Running it locally

Open `index.html` in a browser. That's it — nothing to install.

For a cleaner test of the saving behaviour, serve it over HTTP instead — over `file://` every local
page on your machine shares one storage box, which muddies testing:

```
python -m http.server 8765
```

then visit http://localhost:8765.
