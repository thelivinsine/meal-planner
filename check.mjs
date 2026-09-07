/* ============================================================================
   check.mjs — the tape measure. Run it by hand: `node check.mjs`

   Not a test framework and not a test suite: no dependencies, no config, no
   runner, nothing installed, and it is never served to a browser. It reads the
   three source files as text and reports numbers a look cannot give you.

   It exists because this same script had been written and thrown away five
   times, and twice in one sitting it caught something that would have shipped:
   dark --accent-soft at 1.01 against its panel (an invisible fill), and
   --on-accent dropping to 4.26 when the accent was brightened. Neither was
   visible to the eye. Rewriting a check from memory each round is how a check
   quietly gets weaker.

   Exit code 0 if everything passes, 1 if anything fails, so it can gate a
   merge later without changing anything here.

   ponytail: no stub-DOM smoke test. The other two throwaways earned their
   keep; that one never caught anything. Add it when a storage bug gets past
   this.
   ========================================================================= */

import { readFileSync } from 'node:fs';

const css = readFileSync('style.css', 'utf8');
const js = readFileSync('app.js', 'utf8');
const html = readFileSync('index.html', 'utf8');

let failures = 0;
let checks = 0;

function report(ok, label, detail) {
  checks++;
  if (!ok) failures++;
  console.log(`  ${ok ? '✓' : '✗'} ${label.padEnd(44)} ${detail}`);
}

function section(title) {
  console.log(`\n${title}`);
}

/* ---------- colour ----------------------------------------------------- */

/* Tokens are read out of style.css rather than repeated here. A copy in this
   file would be one more value written twice, which is the exact bug the
   duplicate section below exists to catch. */
function tokens(block) {
  const start = css.indexOf(block);
  if (start === -1) throw new Error(`token block not found: ${block}`);
  const body = css.slice(start, css.indexOf('\n}', start));
  const found = {};
  for (const [, name, value] of body.matchAll(/(--[\w-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
    found[name] = value;
  }
  return found;
}

const light = tokens(':root {');
const dark = { ...light, ...tokens('[data-theme="dark"] {') };

/* WCAG relative luminance, then the ratio. Both are straight from the spec —
   the sRGB channel transfer curve is not something to approximate. */
function luminance(hex) {
  const h = hex.length === 4
    ? '#' + [...hex.slice(1)].map((c) => c + c).join('')
    : hex;
  const channels = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

/* 4.5 is WCAG AA for body text. 1.10 is this project's own floor for two
   surfaces that touch: below it the edge stops reading as an edge. */
const TEXT = 4.5;
const SURFACE = 1.1;

/* Every pair that actually touches on screen. A pair missing here is a pair
   nobody measures, so add one when a new combination appears in the CSS. */
const TEXT_PAIRS = [
  ['--ink', '--bg'], ['--ink', '--surface'], ['--ink', '--surface-sunk'], ['--ink', '--surface-past'],
  /* --control is where a control on a card *rests* — the search field, a filter chip, a
     filter summary — so all three text tiers land on it, and the placeholder is the faint
     one. It is the pair that moved dark --ink-faint: on the old #9b9794 the placeholder
     measured 4.05 on a raised field. */
  ['--ink', '--control'], ['--ink-soft', '--control'], ['--ink-faint', '--control'],
  ['--accent-ink', '--control'],
  /* A saved bookmark is accent ink on a bare icon button, and that button hovers to
     --hover. */
  ['--accent-ink', '--hover'],
  ['--ink-soft', '--bg'], ['--ink-soft', '--surface'], ['--ink-soft', '--surface-sunk'], ['--ink-soft', '--surface-past'],
  /* The only text that lands on --tag-fill: a tag is one word in --ink-soft, at 8px. */
  ['--ink-soft', '--tag-fill'],
  ['--ink-faint', '--bg'], ['--ink-faint', '--surface'], ['--ink-faint', '--surface-sunk'], ['--ink-faint', '--surface-past'],
  ['--accent-ink', '--bg'], ['--accent-ink', '--surface'], ['--accent-ink', '--surface-sunk'],
  ['--accent-ink', '--surface-past'], ['--accent-ink', '--accent-soft'],
  ['--on-accent', '--accent'],
  /* The sidebar nav hover sets --ink on --hover, so that pair is real text on a real
     ground. */
  ['--ink', '--hover'],
  /* The week bar dissolved onto the page, so its day chips hover on --hover too — and
     unlike a nav item, a chip carries three colours: its weekday name, the date, and
     the date again on a day gone by. */
  ['--ink-soft', '--hover'], ['--ink-faint', '--hover'],
  /* Two new grounds, and every tier lands on both. The rail carries the brand, the
     nav rows and the saved-bookmark icon; the faded end of the page carries whatever
     the bottom of the viewport holds — a view heading on a short view, day chips, the
     recipe count. --bg is only the *top* of the page now, so measuring text against it
     alone measures one end of a gradient. */
  ['--ink', '--rail'], ['--ink-soft', '--rail'], ['--ink-faint', '--rail'], ['--accent-ink', '--rail'],
  ['--ink', '--bg-fade'], ['--ink-soft', '--bg-fade'], ['--ink-faint', '--bg-fade'], ['--accent-ink', '--bg-fade'],
];

/* `line` means: this pair is allowed under 1.10 because a hairline carries the
   edge instead — so the *line* gets measured, against both sides, and the pair
   itself is not. That is the rule in CLAUDE.md, made runnable. */
const SURFACE_PAIRS = [
  /* This pair used to be the one that needed no help, at 1.14. The page going to
     #faf8f4 spent it: 1.06 now, and the card's own --line border is the edge — 1.29 on
     the page, 1.37 on the card. It is the deliberate trade the token block sets out,
     and the step it bought is --rail/--bg below. The faded end of the page is the
     easier one and still clears the floor on its own, at 1.11 — the one place a card
     still lifts off the page by fill. */
  ['--surface', '--bg', { line: '--line' }],
  ['--surface', '--bg-fade'],
  /* The sidebar against the page, which is the contrast the whiter page was bought
     with: 1.12 light, 1.11 dark. At the bottom of the viewport the page has faded
     towards the rail in light and away from it in dark, so the light end dips to 1.07
     and the border-right carries the seam there. */
  ['--rail', '--bg'],
  ['--rail', '--bg-fade', { line: '--line' }],
  /* Both things that land *on* the rail: the selected nav pill is a white-ish card on
     it, and every other row hovers to --hover. The second is why --hover had to be
     deepened — on the rail the old value was 1.06. */
  ['--surface', '--rail'],
  ['--hover', '--rail'],
  ['--surface-sunk', '--surface'],
  /* The tag pill, and the only pair the token has: a tag is never on the page, never on
     a past card, and carries no border for a hairline to measure instead. It is also the
     one pair in here that is deliberately met from *opposite* directions — 1.32 below a
     white card in light, 1.32 above a dark one in dark. A ratio cannot see a direction,
     so that half is in the token's comment in style.css. */
  ['--tag-fill', '--surface'],
  /* A control rests *up* towards white, and above a white card there is nowhere to go —
     so in light this pair is 1.07 and the border is the whole edge, which is what a light
     theme does once it runs out of greys (docs/light-mode-reference.md §3). Dark has the
     room and clears it at 1.21. The pair that matters for the token's whole purpose is the
     next one: --control must stay *above* --bg, or a pill on a card reads as a hole. */
  ['--control', '--surface', { line: '--line-strong' }],
  /* Kept as a guard rather than as a live pair. The tools row lost its tile, so the
     search field and the five filter summaries went to --surface with a --line edge —
     the same arrangement a card has — and .chip in the dialogs is the last thing filled
     with --control, always on a --surface sheet. Put this back to work the moment a
     --control fill lands on the page again. */
  ['--control', '--bg', { line: '--line-strong' }],
  /* The state fill lands on both grounds now: .day-chip and .nav-btn on the page,
     .icon-btn, .theme-btn and .filter-opt on a card or a menu. Dark's old #2b2b2b was a
     no-op on the second. */
  ['--hover', '--surface'],
  /* A pressed chip is an accent fill beside its unpressed siblings, and the search
     field's focus border is accent inside a --control field. */
  ['--accent', '--control'],
  /* --surface-sunk beside --bg is deliberately absent: nothing fills the page shade's
     neighbour with it any more. The one hover that did — .nav-btn:hover in the sidebar,
     where the nav unwinds to no fill of its own — measured 1.08 and now uses --surface.
     (.theme-btn:hover looked like the same bug and is not: it sits on the button's own
     --surface fill, so it is the pair above that governs it.) The week bar dissolving
     took away the last two: its chip hover moved to --hover, and the tint on a planned
     day became an --accent ring. Everything sunk now fills something inside a card, and
     .chip — which can reach the page — carries a --line-strong border, measured below.
     Put the pair back the moment a bare sunk fill lands on the page again. */
  ['--line-strong', '--bg'],
  ['--surface-past', '--bg', { line: '--line' }],
  ['--accent-soft', '--surface'],      /* the 1.01 catastrophe lived here */
  ['--accent-soft', '--bg', { line: '--line' }],
  ['--accent', '--surface'],
  ['--accent', '--bg'],
  /* The ring on a day that has meals. It sits on the page at rest and on the hover fill
     under a pointer, and it is the only thing marking a planned day, so both grounds
     have to hold it. */
  ['--accent', '--hover'],
  /* The one hover fill that lands on the page rather than inside a card. Light spends
     state downward, so this sits *below* --bg; the check is the same either way. */
  ['--hover', '--bg'],
  ['--line', '--bg'],
  ['--line', '--surface'],
  ['--line-strong', '--surface'],
  /* Three grounds the untiled tools row created, all of them the *faded* end of the
     page: the row sits near the top of a view, but a short viewport puts it well down
     the gradient. --line is every edge on the row now, --hover is the layout buttons'
     hover, and --accent is the pressed one's border plus the search field's focus edge. */
  ['--line', '--bg-fade'],
  ['--hover', '--bg-fade'],
  ['--accent', '--bg-fade'],
  /* The pressed layout button, and the one pair the tile was hiding: 1.18 on the white
     card it used to sit on, 1.11 on --bg and **1.06** here. It is an .icon-btn, so the
     glyph rather than a word is what the fill has to hold — hence a border, and hence
     --accent rather than --line as the thing measured. */
  ['--accent-soft', '--bg-fade', { line: '--accent' }],
];

function measure(name, theme) {
  section(`Colour — ${name}`);

  for (const [ink, ground] of TEXT_PAIRS) {
    const r = ratio(theme[ink], theme[ground]);
    report(r >= TEXT, `${ink} on ${ground}`, `${r.toFixed(2)} (needs ${TEXT})`);
  }

  for (const [a, b, opts] of SURFACE_PAIRS) {
    const r = ratio(theme[a], theme[b]);
    if (opts?.line && r < SURFACE) {
      /* Too close on purpose. The hairline is then the thing that has to be
         visible, and it has to be visible against *both* sides — a line that
         only clears one of them leaves half the edge missing. */
      for (const side of [a, b]) {
        const lr = ratio(theme[opts.line], theme[side]);
        report(lr >= SURFACE, `${opts.line} on ${side} (carries ${a}/${b})`, `${lr.toFixed(2)} (needs ${SURFACE})`);
      }
    } else {
      report(r >= SURFACE, `${a} beside ${b}`, `${r.toFixed(2)} (needs ${SURFACE})`);
    }
  }
}

/* ---------- wiring ----------------------------------------------------- */

/* A button whose action has no branch does nothing at all, and looks entirely
   normal doing it. Same for an id app.js reaches for that index.html does not
   have: getElementById returns null and the failure surfaces somewhere else
   entirely. Both are typo-shaped, which is why a human reading the diff misses
   them. */
function wiring() {
  section('Wiring');

  const emitted = new Set(
    [...js.matchAll(/data-action="([\w-]+)"/g), ...html.matchAll(/data-action="([\w-]+)"/g)]
      .map((m) => m[1])
  );
  const handled = new Set([...js.matchAll(/action === '([\w-]+)'/g)].map((m) => m[1]));

  const unhandled = [...emitted].filter((a) => !handled.has(a)).sort();
  report(unhandled.length === 0, 'every data-action has a branch',
    unhandled.length ? `no branch for: ${unhandled.join(', ')}` : `${emitted.size} actions`);

  const dead = [...handled].filter((a) => !emitted.has(a)).sort();
  report(dead.length === 0, 'no branch without a data-action',
    dead.length ? `never emitted: ${dead.join(', ')}` : `${handled.size} branches`);

  const ids = new Set([...html.matchAll(/\sid="([\w-]+)"/g)].map((m) => m[1]));
  const wanted = [...js.matchAll(/getElementById\('([\w-]+)'\)/g)].map((m) => m[1]);
  const missing = [...new Set(wanted)].filter((id) => !ids.has(id)).sort();
  report(missing.length === 0, 'every getElementById exists in the HTML',
    missing.length ? `missing: ${missing.join(', ')}` : `${new Set(wanted).size} ids`);
}

/* ---------- values written twice --------------------------------------- */

/* Three values genuinely have to live in two files: the inline <head> script
   runs before app.js loads, and the sidebar icon is in the markup rather than
   rendered. They cannot be de-duplicated without a build step, which this
   project does not have — so they get measured instead. The theme-color hex
   has already been left stale once. */
function duplicates() {
  section('Values written twice');

  const pairs = [
    ['storage key', /const STORAGE_KEY = '([^']+)'/.exec(js)?.[1],
      /localStorage\.getItem\('([^']+)'/.exec(html)?.[1]],
    ['bookmark icon path', /const BOOKMARK_PATH = '([^']+)'/.exec(js)?.[1],
      /<path d="(M6\.5 3\.5h11[^"]*)"/.exec(html)?.[1]],
    ['theme-color fallback', /--bg:\s*(#[0-9a-fA-F]{3,6})/.exec(css)?.[1]?.toLowerCase(),
      /<meta name="theme-color" content="(#[0-9a-fA-F]{3,6})"/.exec(html)?.[1]?.toLowerCase()],
  ];

  for (const [label, a, b] of pairs) {
    const found = a !== undefined && b !== undefined;
    report(found && a === b, label,
      !found ? 'could not find both copies — has one been renamed?'
        : a === b ? 'both copies agree' : `app/css has ${a}, index.html has ${b}`);
  }
}

/* ---------- run -------------------------------------------------------- */

measure('light', light);
measure('dark', dark);
wiring();
duplicates();

console.log(`\n${failures ? `✗ ${failures} of ${checks} checks failed` : `✓ all ${checks} checks passed`}\n`);
process.exit(failures ? 1 : 0);
