# co-planner

**Plan with a collaborator who helps you discover the right questions, find useful improvements, and turn decisions into work you can verify.**

Co-planner extends native Plan mode in Claude Code and Codex, for existing codebases and new projects. It builds short question rounds from your answers and free-text notes, proposes consistent behavior across related components, and looks for “3rd knowledge”: two existing capabilities that together enable a useful new outcome.

[How to use: novice → expert](how-to-use.md) · [עברית](README.he.md) · [מדריך שימוש בעברית](how-to-use.he.md) · [Changelog](CHANGELOG.md) · [Roadmap](ROADMAP.md)

Designed by Eyal Nof. See the [original Creation Studio run](examples/creation-studio-run.md) and a [guided planning example](examples/guided-planning.md).

## Install

**Claude Code** — install the published marketplace version:

```text
/plugin marketplace add Architect-of-knowledge/co-planner
/plugin install co-planner@architect-of-knowledge
```

To try this checkout before publication, launch Claude Code from your target project with `claude --plugin-dir /absolute/path/to/co-planner/plugins/co-planner`.

**Codex** — copy the self-contained folder `codex/skills/co-planner` from this checkout into `~/.agents/skills/co-planner` (personal) or your target project's `.agents/skills/co-planner` (project only). Avoid installing both scopes with the same skill name. If a destination already exists, review differences before replacing it.

For a first personal installation, run from this repository:

```bash
mkdir -p ~/.agents/skills
cp -R codex/skills/co-planner ~/.agents/skills/
```

Use `$co-planner` in Codex. It discovers local skills in these locations; see [official skill documentation](https://learn.chatgpt.com/docs/build-skills). This repository contains an installable Codex skill, not a published Codex marketplace plugin.

## Start planning

First enable the host's native Plan mode, then invoke co-planner. In Claude Code CLI, use `Shift+Tab` until Plan mode is active; in Codex, use the native Plan control or `/plan` where supported. After accepting the plan, use the host's approval flow to begin implementation. See the [step-by-step guide](how-to-use.md).

```text
/co-planner --guided help me plan my first booking app
/co-planner --style explore make onboarding feel like one flow
/co-planner quick --style converge add CSV export
/co-planner --efficient rebuild the settings area
/co-planner --lang he תכנן איתי את מערכת ההרשאות
```

In Codex use the same options after `$co-planner` instead of `/co-planner`. Natural language works too: “guide me through the decisions I might miss” or “switch to a focused plan.”

| Option | What changes |
|---|---|
| Default / `--style adaptive` | Investigate in proportion to uncertainty and impact, then converge |
| `--style explore` | Examine alternatives and broader improvement opportunities before narrowing scope |
| `--style converge` | Resolve blockers and plan the smallest useful outcome |
| `--guided` | Surface consequential questions you might not know to ask, with scenarios, recommendations and tradeoffs |
| `quick` | Targeted inspection, at most two question rounds and one lane; overrides broad exploration |
| `--efficient` | Scoped implementation briefs and suitable available workers; no forced model switch |
| `--lang en` / `--lang he` | Explicit session language; otherwise config, then request language |

Guidance defaults to `auto`: it is offered when useful, without assuming the user's experience level. Declining does not stop normal planning.

## What a session does

1. **Grounds the problem.** Reads applicable instructions, the current handoff and relevant evidence. Existing code is inspected before code-change recommendations; a new project starts from goals and constraints.
2. **Finds useful improvements.** Considers simplification, defaults, recovery, reuse and combinations. Proposals explain benefit, evidence, effort, downside and how to test uncertain assumptions.
3. **Compounds the questions.** Your notes matter as much as option picks. Important overlooked decisions get concrete explanations in guided mode. Optional suggestions remain outside accepted scope.
4. **Converges on a plan.** Scope, blocking decisions, dependencies, acceptance criteria and verification determine readiness. No invented alignment percentage or compulsory extra rounds.
5. **Hands off to implementation.** Tasks follow dependency order, with parallel lanes only when useful. After implementation is authorized, context task 0 saves the approved plan and initializes enabled project context. Planning mode never silently writes project memory.
6. **Learns from use.** Once you try the result, feedback can update preferences, rules and later work.

## Context care: less repetition, more continuity

Enabled by default, this maintains small labeled sections in the active host's project instructions (`CLAUDE.md` or `AGENTS.md`) and a compact handoff. Existing text outside those sections is preserved. Effective overrides and existing status files are respected.

```text
.co-planner/
  config.json       optional settings
  handoff.md        current goal, accepted scope, progress, checks, next action
  plans/            approved plans when no existing plan location serves the task
  taste.md          explicit/inferred preferences and actual-use feedback
  design-rules.md   accepted rules, scope and rationale
  insights.md       useful ideas, evidence, caveats and disposition
  map.mjs           optional reviewed project map adapter
  briefs/           task-specific implementation briefs when needed
```

Files are created only when useful. The handoff reuses a configured or suitable existing status file. Details are loaded on demand, findings rechecked when relevant code changes, and checkpoints updated at milestones rather than every tool call. A resume prompt lets you continue in a fresh session.

Claude auto-memory receives only a small project pointer when the host exposes a writable memory location. Codex native memories remain host-managed; the shared project handoff supplies reliable continuity. See [context care](plugins/co-planner/skills/co-planner/references/context-care.md).

Set `"contextManagement": "off"` to disable managed writes. The skill still respects project instructions. It does not promise a token-saving percentage: the read-only context checker reports bytes, lines and broken pointers, not billing or token counts.

## Configuration, workers and map

All [configuration fields](plugins/co-planner/skills/co-planner/references/config.md) are optional. Old configs and memory tables remain readable. Worker models are configurable, not pinned; installed tools still need valid access and host authorization. Sequential implementation is a complete fallback. See [efficient mode](plugins/co-planner/skills/co-planner/references/efficient.md) and [workers](plugins/co-planner/skills/co-planner/references/workers.md).

The mapper is a bounded heuristic for JS/TS symbols, views and stores, plus Python symbols. It is not a semantic dependency graph. No detected shared store does **not** prove a broken handoff: routes, props, APIs, events or persistence may connect the views. Unsupported stacks use manual inspection or a project adapter. Adapters now require explicit `--adapter`, after inspection, and have a five-second timeout.

English and Hebrew are supported. New Hebrew documents use RTL wrappers; code stays LTR. Existing user-owned documents are not reformatted just to satisfy the [Hebrew rules](plugins/co-planner/skills/co-planner/references/he.md).

## Develop

Node.js 18+ runs the dependency-free helpers and tests. Planning itself can fall back to manual inspection without Node.

```bash
node scripts/sync-codex.mjs
node scripts/sync-codex.mjs --check
node --test tests/*.test.mjs
claude plugin validate .
claude plugin validate plugins/co-planner
node plugins/co-planner/skills/co-planner/scripts/context-check.mjs .
```

Shared scripts, references and templates are maintained in the Claude package and copied into the Codex folder. Each package works independently when installed. Platform entrypoints differ; the sync check also detects shared-entrypoint drift. Behavioral evaluation cases and their limits are in [tests/scenarios/README.md](tests/scenarios/README.md).

## License

MIT, © 2026 Eyal Nof.
