# Changelog

All notable changes to Mise, the weekly meal planner, are listed here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
There are no version tags yet: the version numbers below are proposed, one per
milestone in the git history. Commits that only changed the docs are left out.

## [Unreleased]

Nothing yet. Everything merged to `main` is live and listed below.

## [1.3.0] - 2026-09-09

### Added
- A landing page, `landing.html`, that introduces the app. On wide screens the
  app name in the sidebar links to it. (#26)
- `check.mjs` now also checks that the landing page uses the same colours and
  storage key as the app, so the two can't drift apart. (#26)

## [1.2.0] - 2026-09-07

### Added
- On phones, a back button in the top bar: out of the recipe picker, or from
  Recipes and Saved back to the week. (#17)

### Changed
- On phones the recipe list now gets about two thirds of the screen, instead of
  the controls taking most of it. Search, layout toggle and Filters share one
  line, and the spacing is a step tighter. (#17)
- The app name now appears only in the wide-screen sidebar. (#17)
- The add button shows just its icon in list view and on phones. (#18)
- No divider line inside a recipe card, in either layout. (#18)
- In list view, a recipe's minutes and tags sit together on the right. (#18)
- New colours for controls, tag pills, the page and the sidebar: controls
  read as raised, tags are easier to see, the page is near-white with a gentle
  fade, and the sidebar reads as its own panel. (#18, #20, #22)
- The search and filter row loses the box around it, and its filters start
  closed on every list at every width. A count on the Filters button says when a
  filter is on. (#23)
- The row's order is now Filters, layout toggle, then search, and the search
  field fills the rest of the row. (#24, #25)
- The focus ring is thinner (2px), and the pressed layout button is a solid
  orange fill instead of an outline. (#25)

### Fixed
- The search field no longer shows a focus ring after a mouse click or while
  typing. (#18)
- Three hover effects did nothing in dark mode. (#18)
- The Filters arrow pointed sideways, and the dropdown arrows never turned.
  Every arrow now points down when closed and up when open. (#23)
- A focus ring appeared after mouse clicks. It now shows for keyboard use
  only. (#25)

## [1.1.1] - 2026-09-04

### Fixed
- With the app open in two tabs, a change made in one could silently wipe a
  change made in the other. Each tab now picks up the other's changes. (#15)
- Coming back to a tab that had been updated in the background no longer loses
  your place for the keyboard. (#16)

## [1.1.0] - 2026-09-02

### Added
- Search, filters and a tile/list layout toggle on one row, on Recipes, on
  Saved and in the recipe picker. (#13)
- The recipe picker opens already filtered to the meal you are filling. (#13)

### Changed
- Adding a meal from an empty slot now opens the picker in place of the day,
  sized to fit the screen, with a "Back to the day" link. The page itself no
  longer scrolls. (#11)
- Opening the picker no longer puts the cursor in the search box, so a phone
  keyboard doesn't cover the recipes. (#11)
- The week bar loses its box, is narrower and centred, and a day with meals
  planned gets an orange ring. (#11)
- Vertical spacing uses four set sizes, so sections, blocks and items are
  clearly spaced apart. (#12)
- Filters are dropdowns of checkboxes. Ticking two in one group shows either;
  ticking across groups shows only recipes that match both. (#13)
- Recipe cards show at most three tags, never "quick", and the minutes as plain
  text. (#13)
- The week view loses its greeting heading, and a past day is shown in muted
  colour only, with no ring. (#13)
- In light mode, hover darkens rather than lightens, and the dark backdrop
  behind dialogs is lighter. (#10)

### Fixed
- The keyboard focus ring on a recipe card was cut down to a stray line. (#10)

## [1.0.0] - 2026-08-31

### Added
- On wide screens, a left sidebar for navigation and a summary column beside
  the day. (#6)
- `check.mjs`: one command that checks colour contrast in both themes and that
  every button is wired to a handler. Run it with `node check.mjs`. (#9)

### Changed
- One day at a time at every screen width: a week bar with seven day buttons,
  then that day's three meals. Replaces the wide-screen accordion. (#6)
- The week bar shows the date range again, and is more compact. (#6, #7)
- New palette: a warm page with white cards. Light mode is lighter, and dark
  mode uses neutral greys. (#6, #7)
- The week heading is a random greeting again. (#7)
- Saving a recipe uses a bookmark icon, matching the Saved view, instead of a
  star. (#7)
- A planned recipe's name is underlined, so it reads as clickable on touch
  screens too. (#8)

### Fixed
- The wide layout rendered at a third of its width. (#6)
- Empty meal cards were far too tall, and the day row wrapped too early. (#6)
- Keyboard focus on the save button and on Today. (#6)
- Screen readers heard a different name for the week section on every
  load. (#8)
- The sidebar hover was too faint to see against the page. (#9)

## [0.2.0] - 2026-08-28

### Added
- Dark mode, with a toggle that remembers your choice. (#4)

### Changed
- On narrow screens the week shows one day at a time, picked from a strip of
  seven day buttons. (#3)
- Full redesign: new fonts, warm colours, one orange accent, the view switch
  docked at the bottom, and motion that turns off when your device asks for
  reduced motion. (#4)

## [0.1.0] - 2026-08-27

### Added
- The first version of the planner: a week view on real dates, a recipe list
  and a Saved list, all stored in the browser.
- Filling an empty meal slot opens the recipe list right there, without asking
  again for the day and meal.
- The recipe catalogue grows from 25 to 50, over half of them Indian and most
  high in protein.
- Recipe filters grouped by macros, meal, diet, cuisine and main protein. (#2)

### Changed
- Past days look different from upcoming ones.
- The add-to-week dialog picks a day with buttons instead of a dropdown.
- The week's meal rows line up across all seven days, and the same recipe card
  is used on every list. (#2)

[Unreleased]: https://github.com/thelivinsine/meal-planner/compare/f55a6d7...main
[1.3.0]: https://github.com/thelivinsine/meal-planner/compare/a4be1c9...f55a6d7
[1.2.0]: https://github.com/thelivinsine/meal-planner/compare/212ddd3...a4be1c9
[1.1.1]: https://github.com/thelivinsine/meal-planner/compare/12ce708...212ddd3
[1.1.0]: https://github.com/thelivinsine/meal-planner/compare/6e27431...12ce708
[1.0.0]: https://github.com/thelivinsine/meal-planner/compare/49b3c16...6e27431
[0.2.0]: https://github.com/thelivinsine/meal-planner/compare/409d7d2...49b3c16
[0.1.0]: https://github.com/thelivinsine/meal-planner/compare/3dc982d...409d7d2
