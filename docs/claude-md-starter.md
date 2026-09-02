# A starting CLAUDE.md for the next project

Not a doc about Mise. This is the portable skeleton pulled out of Mise's own `CLAUDE.md` —
the structure that survived, with every meal-planner-specific rule stripped out. Copy the
block below into a new repo's `CLAUDE.md` and fill the angle brackets.

Mise's `CLAUDE.md` is long because it is old: each rule there was paid for by a bug. A new
project has no bugs yet, so it starts short and earns its rules. Don't paste Mise's colour
tokens, CSS traps or plan shape into a project that hasn't hit them — an unearned rule is
noise the next session has to read past.

## What actually carries over

Four structural moves, not the rules themselves:

1. **Rules here, reasoning in `docs/decisions.md`.** The one file stays scannable only if the
   paragraphs live somewhere with no budget. Mise's kept failing this by carrying both.
2. **A session starts at `docs/status.md`.** One doc allowed to go stale, holding the live
   commit, open work and what isn't verified. Everything else stays true.
3. **The PR says what was *not* verified.** That half is what gets read before merging, and
   it only works if it's honest.
4. **Name the defect class this project actually ships, and give it its own section.** For
   Mise every shipped defect was an accessibility defect, so accessibility got a heading.
   Yours may be data loss, or auth, or money. You won't know on day one — add the section
   when the second one of a kind lands.

## The template

```markdown
# CLAUDE.md

Rules for working in this repo. **Every rule here has a story behind it in
`docs/decisions.md`** — if one looks arbitrary, read it there before working around it.

## Project
<One line: what this is and what "good" means for it.>

**Starting a session:** read `docs/status.md` first — live commit, open work, what isn't
verified. `docs/architecture.md` has the shape of the thing. Some things are missing on
purpose: read `docs/decisions.md` before proposing changes.

## Working with me
- Ask when something is unclear. Don't guess silently.
- State the decisions you made and why, one or two lines each.
- Explain things simply — assume I'm not a specialist in this stack.
- **"Update the docs"** means sweep *every* markdown file against the current state.
- **Keep this file rules-only.** The test isn't line count, it's "is this a rule or is it
  reasoning". Reasoning goes in `docs/decisions.md`, which has no budget.

## Hard constraints
- **Never commit to `main` directly.** Code changes go on a branch and come back via PR.
  Docs may go straight to `main`.
- <Stack limits: languages, no-frameworks, no-build-step, deploy target — whatever is fixed.>

## Workflow
1. Branch off `main`, named for the change not the round.
2. Build it, then check it — see *Testing*.
3. Open a PR saying what changed and what was **not** verified. The second half is the part
   that gets read before merging.
4. Review it against its own description; re-read the diff if commits landed after review.
5. Squash-merge, delete the branch.
6. Verify the deploy, then update `docs/status.md`. Part of merging, not a tidy afterwards.

## Conventions
Follow them or say why not.

- **State:** <where it lives, what shape, what's never stored.>
- **One way to do each thing.** If two paths exist for one idea, say why they're not merged.
- **One shape for one idea.** The same concept gets the same icon, word and control everywhere.
- Any value written in two places names both here — change one, change the other.
- <Style/naming rules a reviewer would otherwise argue about every time.>

## <Your defect class>
Add this section once a second defect of one kind ships. Rules here, stories in decisions.

## Scope
Not in v1, deliberately: <list>. Don't add these unless asked; reasoning in
`docs/decisions.md#deliberately-not-built`.

## Testing
<The one saved check command.> Run it after touching <what>, and **extend it** when you add
a thing it should cover — an unlisted case is a case nobody measures.

**Read, look and measure — each catches what the other two miss.** A rendered look is the
check for anything touching layout, never an optional extra. Name what a change has *not*
been seen against, and hand over unverified work as unverified rather than calling it done.
```
