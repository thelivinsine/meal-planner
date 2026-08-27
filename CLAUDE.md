# CLAUDE.md

## Project
P5_PracticeProject — a weekly meal planner web app. Goal: intuitive, modern, useful, simple.
Users browse recipes from a comprehensive catalogue, add them to a weekly schedule, edit that
schedule, bookmark recipes, view a calendar, and move between page views smoothly.

## Working with me
- Ask when something is unclear or a decision is uncertain. Don't guess silently.
- State the decisions you did make and why, in one or two lines each.
- Explain things simply — I'm a non-tech vibe coder, not a developer.

## Hard constraints
- Vanilla HTML, CSS, JavaScript only. No frameworks, no libraries, no build step.
- All data persists in the browser (`localStorage`). No server, no database, no API calls.
- Hosted on GitHub Pages: everything must work from static files opened over plain HTTP.
  - Relative paths only (no leading `/`).
  - Entry point is `index.html` at the repo root.
  - ES modules are fine (`<script type="module">`), but they need a local server to test —
    `python -m http.server` from the repo root.

## Layout
```
index.html
style.css
app.js
```
Add files only when one gets unwieldy.

## Conventions
- Wrap every `localStorage` read in try/catch and fall back to a default — quota errors and
  private mode are real.
- Store one JSON blob under a single namespaced key (e.g. `p5:data`), not many loose keys.
- No inline `onclick`; attach listeners in `app.js`.
- Semantic HTML + labels on inputs; keyboard must work without a mouse.

## Testing
Open `index.html` in a browser. No test framework unless asked.
