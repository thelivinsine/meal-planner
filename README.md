# Mise — weekly meal planner

Plan what you're eating this week. Browse a catalogue of 50 recipes, drop them into
breakfast / lunch / dinner slots on real dates, and bookmark the ones you like.
Everything is saved in your own browser — no account, no server, nothing leaves your machine.

**Live code:** https://github.com/thelivinsine/meal-planner
**Stack:** one HTML file, one CSS file, one JS file. No frameworks, no build step, no dependencies.

---

## For anyone reading this without a technical background

**What it does.** Three screens. *Recipes* is the cookbook — search it, filter it, tap a recipe
to read the ingredients and method. *Week* is your plan for the week: seven real days, three
meal slots each. *Saved* is your shortlist of favourites.

**How it saves your plan.** Your browser has a small built-in storage box. The app keeps your
week and your bookmarks there, so closing the tab and coming back later keeps everything.
The catch is that it's per-browser and per-device: your plan on your laptop is not the same plan
as on your phone, and clearing your browsing data clears it. That's the honest trade for having
no accounts and no server to run.

**What it deliberately does not do yet.** No shopping list, no month calendar, no adding your own
recipes, no sharing a plan with anyone else. Those are all sensible next steps, not oversights —
see [Not in v1](#not-in-v1).

---

## Running it

Open `index.html` in a browser. That's it — nothing to install.

For a cleaner test of the saving behaviour, serve it over HTTP instead:

```
python -m http.server 8765
```

then visit http://localhost:8765. (Over `file://`, every local page on your machine shares one
storage box, which muddies testing.)

---

## What v1 does

**Recipes**
- 50 recipes, each with tags, cooking time, ingredients and a short method
- Over half are Indian, and roughly three quarters are high-protein; the rest are tagged
  `balanced`. Both are ordinary tags, so the `indian` and `high-protein` chips filter on them
- Search matches recipe names, tags **and** ingredients — so "chickpea" finds the curry
- Tag chips filter the grid (pick several; a recipe matching any of them shows)
- Tapping a card opens a detail panel; close it with the ×, the Escape key, or a tap outside

**Week**
- Monday–Sunday of a real week, with the actual dates shown
- Move between weeks with ← / →, or jump back with **This week**
- Three states are visually distinct: **past** days are greyed and settled, **today** carries an
  accent border and a "Today" pill, **upcoming** days are clean and white
- Each slot can be filled, replaced, or cleared
- Past days stay editable, so you can log what you actually ate

**Adding a meal — two ways in**

*From the week.* Tap **+ Add** on an empty slot and the recipe list opens in the space below
your week. The day and meal are already known from the slot you tapped, so it never asks again:
one tap on a recipe fills that slot and the list closes. There's a search box in the panel, and
Escape, the ×, or moving to another week all close it.

*From a recipe.* **Add to week** on any card (or in the detail panel) opens a small dialog
- Pick a day from seven day buttons and a meal from three — everything visible, two taps
- Picking a day that's already gone is allowed but flagged: the dialog says so, and that day's
  button is drawn with a dashed border
- If the slot is taken, the dialog names what's there and the button reads **Replace**

**Saved**
- Exactly the recipes you've bookmarked, from either the card or the detail panel
- Removing a bookmark drops it from Saved immediately but leaves it in your week — unsaving a
  recipe isn't the same as cancelling dinner

---

## How the code is organised

Three files, as the project constraints require:

| File | Contains |
|---|---|
| `index.html` | The page shell: header nav, three `<section>` views, two `<dialog>` panels |
| `style.css` | All styling. CSS custom properties for the palette, three breakpoints |
| `app.js` | The recipe catalogue, the app state, rendering, and one event handler |

**The data model** is the part worth understanding. Two things exist:

- `RECIPES` — the fixed catalogue, hardcoded. Never saved, never changes at runtime.
- `state` — everything about *you*: which view you're on, which week you're looking at, your
  plan, your bookmarks, your current search and filters.

The plan is one flat object keyed by real date and meal:

```js
state.plan = { '2026-08-26|Dinner': 'chickpea-curry' }
```

Keying by actual date, rather than by "Wednesday", is what makes next week a genuinely separate
plan instead of the same seven slots relabelled. It also means one assignment fills a slot and one
`delete` clears it — no nested structures to walk.

**Rendering** is deliberately dumb: change state, then redraw the whole view from it. With 25
recipes that's instant, and it removes a whole class of bug where the screen and the data disagree.

**Events** go through a single click listener on `document`, dispatching on a `data-action`
attribute. Because of that, re-drawing a view never needs listeners re-attached.

**Storage** is one key, `p5:mealplanner`, holding one JSON blob of the plan and the bookmarks.
Reads and writes are wrapped in `try`/`catch`: private browsing and full quotas are real, and
neither should take the app down. Loading also *validates* rather than trusting — every entry
must have a real date, a real meal name and a recipe that still exists, or it's dropped. Junk in
storage produces an empty plan, never a crash. Entries older than four weeks are also dropped, so
the saved blob can't grow forever.

---

## Decisions worth recording

| Decision | Why |
|---|---|
| Plan keyed by real date | You asked for real dates; anything else makes "next week" meaningless |
| The viewed week isn't saved | It always opens on the current week, so returning days later doesn't strand you on a stale one |
| Old entries pruned after 4 weeks | The direct consequence of date keys — otherwise storage grows with every week that passes |
| One recipe per slot | "Cleared or replaced" reads as singular |
| Day buttons, not a dropdown | A `<select>` opens the OS wheel on mobile and hides the dates; seven buttons show everything at once |
| Past days editable, not locked | Useful for logging meals already eaten; the greying communicates enough |
| Slot's **+ Add** opens the list inline, below the week | The slot already says which day and meal; re-asking in a dialog was pure redundancy. It fills the empty space under the week rather than navigating away |
| The dialog stays for the recipe-first route | Coming from a card, nothing is known yet, so a day and meal still have to be picked |
| No drag-and-drop | Touch needs an entirely separate code path from mouse dragging, and clear/replace already covers moving meals |
| Redraw the whole view, no diffing | 50 recipes is small; the simplicity is worth more than the cycles saved |

---

## Not in v1

Left out on purpose, roughly in the order they'd earn their place:

- **Shopping list** from the week's ingredients — the obvious next feature, and the data is already there
- **Month calendar** view — held back deliberately until the week view settled
- **Your own recipes** — needs an editor and a place to keep them, which is real work
- **Copy last week** / duplicate a day — cheap to add, genuinely useful
- **Sharing or syncing** a plan — impossible without a server, which the project rules exclude

---

## Testing

There's no test framework in the repo, per the project constraints. Verification was:

- **Manual** — open it and use it.
- **A throwaway Node script** run during development (kept outside the repo). It loaded `app.js`
  against a stub DOM and asserted: 25 unique complete recipes; week-start arithmetic landing on a
  Monday across month, year and leap-day boundaries; 7 day cards and 21 slots rendered; the right
  number of past / today / upcoming days for the real date; 7 day buttons in the picker with one
  preselected; add → replace → clear leaving exactly one correct entry; search and filters
  returning sane sets; a save/reload round-trip; and nine kinds of corrupt storage (truncated JSON,
  `null`, `[]`, wrong types, unknown recipe ids, invalid dates) all falling back to a clean state.

A second throwaway script was run for the inline slot picker: it asserted the panel starts hidden,
opens with the tapped day and meal in its heading, offers all 50 recipes, filters on its own search
box without disturbing the Recipes view, writes exactly the slot that was tapped on one click
without the dialog ever opening, says *Replace* on an occupied slot, and closes on Escape, week
navigation and view changes. It also re-checked the catalogue thresholds and that every recipe
carries either `high-protein` or `balanced`.

Not verified by machine: how it actually looks. Browser automation wasn't available during
development, so layout on a real phone and a clean console during real use were checked by eye.

---

## Development log

| | |
|---|---|
| **Setup** | Repo created; project constraints written into `CLAUDE.md` — vanilla JS only, browser storage only, GitHub Pages as the target |
| **Scope** | Settled on v1: three views, ~25 recipes, week planning, bookmarks. Month calendar and drag-and-drop explicitly excluded |
| **v1 built** | `index.html` / `style.css` / `app.js` on branch `feat/v1-meal-planner`. Week view moved to real dates during planning, at your request |
| **First review** | Two changes from your feedback: past days now visually distinct from upcoming ones, and the day dropdown in the add dialog became a grid of day buttons |
| **Published** | Merged to `main` and pushed to GitHub as a public repo. GitHub Pages not yet enabled |
| **Second round** | Branch `feat/slot-picker-and-indian-recipes`: the slot's **+ Add** now opens the recipe list inline under the week instead of asking for the day and meal a second time, and the catalogue grew to 50 with 27 Indian and 38 high-protein recipes |

---

## If you want it online

The repo is public, so GitHub Pages is a settings toggle away: **Settings → Pages → deploy from
branch `main`, folder `/ (root)`**. It'll be served at `thelivinsine.github.io/meal-planner`.
The app is already written for it — relative paths throughout, `index.html` at the root, no build step.
