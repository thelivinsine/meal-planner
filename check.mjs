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
  ['--ink-soft', '--bg'], ['--ink-soft', '--surface'], ['--ink-soft', '--surface-sunk'], ['--ink-soft', '--surface-past'],
  ['--ink-faint', '--bg'], ['--ink-faint', '--surface'], ['--ink-faint', '--surface-sunk'], ['--ink-faint', '--surface-past'],
  ['--accent-ink', '--bg'], ['--accent-ink', '--surface'], ['--accent-ink', '--surface-sunk'],
  ['--accent-ink', '--surface-past'], ['--accent-ink', '--accent-soft'],
  ['--on-accent', '--accent'],
];

/* `line` means: this pair is allowed under 1.10 because a hairline carries the
   edge instead — so the *line* gets measured, against both sides, and the pair
   itself is not. That is the rule in CLAUDE.md, made runnable. */
const SURFACE_PAIRS = [
  ['--surface', '--bg'],
  ['--surface-sunk', '--surface'],
  ['--surface-sunk', '--bg'],          /* reachable at .nav-btn:hover */
  ['--surface-past', '--bg', { line: '--line' }],
  ['--accent-soft', '--surface'],      /* the 1.01 catastrophe lived here */
  ['--accent-soft', '--bg', { line: '--line' }],
  ['--accent', '--surface'],
  ['--accent', '--bg'],
  ['--line', '--bg'],
  ['--line', '--surface'],
  ['--line-strong', '--surface'],
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
