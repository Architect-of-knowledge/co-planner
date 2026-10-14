# co-planner

**Plan with Claude the way you'd plan with a sharp collaborator who has read your whole codebase.**

`/co-planner` is a Claude Code plugin for planning anything bigger than a single fix: a feature, a product area, a redesign. Instead of one long plan from a single prompt, it runs short rounds of questions. Each round is built from your last answers *and your free-text notes*, which often say more than the option you clicked. Every decision is spread to the whole family of similar components, and the plugin looks for "3rd knowledge": two parts you already have that together make something neither does alone. It remembers your taste and design rules between sessions, and it ends with a wave plan sized to ship, with parallel lanes and one surgical check per task.

[עברית](README.he.md)

*Designed by Eyal Nof. First used to turn a web DAW's strong but disconnected components into one usable studio. See [the example run](examples/creation-studio-run.md).*

## Install

```text
/plugin marketplace add Architect-of-knowledge/co-planner
/plugin install co-planner@architect-of-knowledge
```

Then, in any project:

```text
/co-planner make onboarding feel like one flow instead of four screens
/co-planner quick add CSV export to the reports page
/co-planner --efficient rebuild the settings area
/co-planner --lang he תכנן איתי את מערכת ההרשאות
```

## What a session looks like

1. **Load and map.** It reads your project instructions and its own memory (`.co-planner/`), then runs a fast map of the code: component families, the views a user sees, and which shared state each view touches. Views that share no state can't hand off to each other, and that is often exactly where a journey breaks.
2. **Friction first.** It walks your journeys through the code and lists every dead end, extra step and missing handoff, with `file:line` evidence. **No question goes out before this map exists.**
3. **Compounding rounds** (up to 4 questions each), each built on the last:
   - *Deeper*: the next unknown your last answer opened.
   - *Spread*: a decision you just made goes to every similar component (if one button gets a right-click menu, should every object?).
   - *3rd knowledge*: when two existing parts click together, it asks whether to adopt, log or drop the idea.
   - UI questions come with ASCII mockups to compare.
   - Every proposal is tagged by where it came from: `[yours]` `[spread]` `[3rd]` `[Claude]`.
4. **The tally.** Every round ends with what Wave 1 holds so far, its rough size in lanes, and how aligned you are. When the wave grows past 3 lanes, the next round asks what to cut. It expands boldly; you decide what fits.
5. **The plan.** You get contracts first, then lanes with non-overlapping files, a done-when and one surgical verify per task, the risks, and task 0, which saves your taste, the rules you accepted and the insights found.
6. **The review after the wave.** Once the wave ships and you've used it, one short round asks what you actually used and what felt wrong. Taste learns from use, not only from answers.

**Quick mode** (`/co-planner quick …`): two rounds, no spread, one lane, for small features.

**Efficient mode** (`/co-planner --efficient …`): a strong coordinator (run your session on Opus) with lighter, cheaper workers: Claude Sonnet subagents by default, plus GPT-5.6 Terra (Codex CLI) or Gemini (Antigravity) when installed. Quality holds because the coordinator writes the failing tests first and gives each worker a **thick brief**: helpers to reuse with their `file:line`, one worked example to copy, exact signatures, steps in order, forbidden moves and a self-check. Lanes stay at 2–4 files, and the coordinator reads every diff. Details: [`references/efficient.md`](plugins/co-planner/skills/co-planner/references/efficient.md).

## What it remembers (in your repo)

```text
.co-planner/
  taste.md          what you like and cut, and why (from picks, notes, and real use)
  design-rules.md   decisions that apply to a whole family; new work is checked against them
  insights.md       emergent insights and 3rd knowledge, graded A to D
  config.json       optional: language, contract files, gates, workers, lane count
  map.mjs           optional: your project's own richer map (registries, graphs)
  briefs/           the lane briefs of each wave
```

These are plain Markdown files. Commit them: they're your project's design memory.

## Hebrew, with strict right-to-left

Pass `--lang he`, set `"lang": "he"` in `.co-planner/config.json`, or just write your request in Hebrew. Everything you read is then in Hebrew, with consistent vocabulary, and written to render correctly both in terminals that apply the bidi algorithm and in those that don't:
- every line starts with a Hebrew word;
- sentences never end on code;
- mockups keep Latin labels, with a Hebrew legend underneath;
- files are wrapped in `dir="rtl"` blocks, with code blocks kept left to right.

A checker (`scripts/rtl-check.mjs`) verifies every Hebrew file co-planner writes. The rules are in [`references/he.md`](plugins/co-planner/skills/co-planner/references/he.md).

## Workers

By default, lanes run as Claude subagents, each in its own git worktree. In any mode you can add other coding CLIs as workers: the OpenAI Codex CLI (GPT models such as GPT-5.6 Terra), Google Antigravity (`agy`, with Gemini 3.8 Flash for fast lanes and Gemini 3.1 Pro for hard lanes and reviews), or others. Use one local clone per lane, never with permission-skipping flags. See [`references/workers.md`](plugins/co-planner/skills/co-planner/references/workers.md).

## Requirements

Claude Code with plugins, and Node.js 18+ for the map and the RTL checker (no npm dependencies). The map understands JS/TS (React, Vue, Svelte state libraries) and Python packages. Other stacks still get families from their folders, and can add a `.co-planner/map.mjs` adapter.

## Develop

```bash
claude plugin validate .
node --test tests/*.test.mjs
```

## License

MIT, © 2026 Eyal Nof.
