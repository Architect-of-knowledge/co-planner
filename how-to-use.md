# How to use co-planner

[עברית — המדריך המלא](how-to-use.he.md) · [Install and overview](README.md)

Co-planner is an add-on to the native Plan mode in Claude Code and Codex. It helps you decide what to build, discover useful improvements, and produce a plan that a coding agent can implement. You can plan an existing project or start with an idea. It supports Claude Code and Codex, in English and Hebrew.

## 1. Complete novice: start with the outcome you want

You do not need to know which technical questions to ask. Guided planning helps uncover important choices using concrete examples, explains their consequences, and recommends an option. It does not require you to choose frameworks or understand architecture.

### Install once

For Claude Code, enter these commands inside Claude Code:

```text
/plugin marketplace add Architect-of-knowledge/co-planner
/plugin install co-planner@architect-of-knowledge
```

These install the published version. To try the current checkout before release, see the expert section below.

For Codex, copy this repository's `codex/skills/co-planner` folder into `~/.agents/skills/co-planner` on your computer, or `.agents/skills/co-planner` inside your target project. Copy the entire folder, including its scripts and references. If there is already a folder there, compare it before replacing it. Restart the client if the new skill does not appear. See [official Codex skill locations](https://learn.chatgpt.com/docs/build-skills).

### Enter native Plan mode, then activate co-planner

Open the project you want help with. For a new idea, use an empty project folder.

1. **Enable native Plan mode.** In Claude Code's terminal, press `Shift+Tab` until the status bar shows Plan mode, or launch with `claude --permission-mode plan`. In Codex, use the native Plan control or `/plan` where supported. Confirm the mode is active; `/plan` toggles it, so do not run it again if it is already on. See [Claude's instructions](https://code.claude.com/docs/en/common-workflows#plan-before-editing) and [Codex's command reference](https://learn.chatgpt.com/docs/reference/slash-commands).
2. **Invoke co-planner inside that mode**, with your request. The native mode governs editing and approval; the skill adds its planning workflow.

In Claude Code:

```text
/co-planner --guided I want a simple appointment-booking app for my small business. Help me figure out what matters before we build it.
```

In Codex:

```text
$co-planner --guided I want a simple appointment-booking app for my small business. Help me figure out what matters before we build it.
```

Tell it who the app is for, the outcome you want, and any limits you know. It is fine to say “I don't know yet.” Existing code is inspected where useful; an empty project does not need a code map.

### Answer in your own words

You might be asked: “If two customers try to book the same time, should the first confirmed booking reserve it immediately, or should you approve requests manually?” The planner explains the tradeoff and recommends an option based on your business.

You can reply:

```text
I want bookings confirmed immediately. I work alone, so there should only be one booking at a time. Explain the simplest way to handle cancellations too.
```

Your explanation matters more than clicking an option. Ask “What would you recommend for my situation?” or “Show me an example.” You may accept an idea, postpone it, or reject it. Suggestions do not automatically become features you have agreed to build.

### Review the plan, then authorize implementation

Check that the plan describes what you want users to do, what is included now, and how you will know it works. Ask for corrections if needed. When ready, say:

```text
Implement this plan.
```

Accept the plan through the host's normal approval flow and switch out of Plan mode when the host requires it. The skill cannot override that restriction. Implementation may still need ordinary host permission for restricted operations.

### Pause and come back

During authorized implementation, the skill keeps a short project handoff with progress, decisions, test results and the next action. It preserves existing instructions outside its marked sections. You do not need to maintain these notes yourself.

Before leaving, say:

```text
Save a handoff for this work and give me a short prompt to resume later.
```

If writes are not allowed, it provides the handoff in the response instead of pretending to save it. In a fresh session, use the provided prompt or ask co-planner to resume from the project's handoff. It checks the current project state before trusting old results.

To work in Hebrew, write your request in Hebrew or add `--lang he`. Commands and code names remain unchanged.

## 2. Average user: steer depth, scope and continuity

Activate native Plan mode first, then use the same options with `/co-planner` in Claude Code and `$co-planner` in Codex. Adaptive, explore, converge, quick and guided change the planning workflow inside that mode; they do not toggle native Plan mode.

| Need | Example options | What to expect |
|---|---|---|
| Balanced planning | `--style adaptive` | Default; investigate in proportion to impact and uncertainty |
| Explore improvements | `--style explore` | More alternatives, simplification and combinations before scope selection |
| Reach a focused plan | `--style converge` | Resolve blockers and choose the smallest useful outcome |
| Discover overlooked decisions | `--guided` | Concrete scenarios, explanations and recommended defaults |
| Small change | `quick` | At most two question rounds and one implementation lane |
| Better worker handoff | `--efficient` | Scoped briefs and available workers, with sequential fallback |

Examples for Claude Code:

```text
/co-planner --style explore make onboarding easier using what we already have
/co-planner quick --guided add CSV export to reports
/co-planner --style converge --efficient consolidate the settings pages
```

For Codex:

```text
$co-planner --style explore make onboarding easier using what we already have
$co-planner quick --guided add CSV export to reports
$co-planner --style converge --efficient consolidate the settings pages
```

Styles can change mid-session: “We have enough ideas; switch to convergence.” Guidance is independent of style. Quick keeps its two-round limit even with exploration or guidance enabled. If a major unknown cannot be resolved within that limit, the planner identifies it rather than inventing an answer.

### Make improvement suggestions useful

Give constraints such as “one week,” “no new paid services,” or “preserve the current workflow.” Ask:

```text
Which existing capabilities could work together? Rank the strongest ideas by benefit and effort, and tell me what would make your recommendation wrong.
```

A good proposal states evidence or an explicit hypothesis, benefit, effort, tradeoff and validation. “3rd knowledge” means a useful outcome from combining two capabilities; it is not a requirement to add more features. You can say “Keep that for later; it isn't a dislike, just outside this release.”

### Let context care reduce repeated explanation

The skill manages short labeled sections in the active host's project instructions, plus a handoff. Detailed plans and topic memory stay separate and are read only when relevant. Both platforms can use the same project handoff.

When guidance is set to `auto`, the skill offers it when useful. For persistent defaults, ask it to save settings when writes are permitted, or edit `.co-planner/config.json`:

```json
{
  "planningStyle": "adaptive",
  "guidance": "auto",
  "contextManagement": "managed",
  "lang": "en"
}
```

Use `guidance: "guided"` to enable guidance by default, or `"off"` to suppress automatic offers. `--guided` still enables it explicitly. Use `contextManagement: "off"` to disable automatic context writes; applicable project instructions still apply.

After you use a shipped feature, report what worked and what you skipped. That feedback improves project preferences more reliably than accumulating every conversation in memory.

## 3. Experts: configure, integrate and maintain

### Native mode and lifecycle

The intended sequence is native Plan mode → co-planner rounds → accepted plan → host-approved implementation → context checkpoints. Claude can request entry through its native planning tool when available. Codex needs the user/host to change collaboration mode; a skill cannot change it just by instructing the model. If invoked too early, co-planner directs the user to the native control before starting rounds.

The skill may read relevant memory while planning, but project instruction, handoff and memory updates wait for permitted implementation. The host's special plan artifact follows its own rules. Implementation uses the approved briefs and context-care instructions without re-entering planning for every checkpoint. On a host without native Plan mode, an explicitly explained conversational planning fallback is available; it does not provide native enforcement.

### Local packages and source of truth

Load the current Claude checkout from your target project using:

```bash
claude --plugin-dir /absolute/path/to/co-planner/plugins/co-planner
```

The Codex delivery is a standalone skill folder at `codex/skills/co-planner`; it has no runtime dependency on the sibling Claude package. Its `agents/openai.yaml` supplies UI metadata, and implicit selection remains enabled. Do not install the same skill in multiple discovery scopes unless you intentionally want duplicate entries.

Maintain shared scripts, references and templates under `plugins/co-planner/skills/co-planner`. Synchronize after changes:

```bash
node scripts/sync-codex.mjs
node scripts/sync-codex.mjs --check
```

The tool copies shared resources and flags extras for explicit review. Platform entrypoints remain separate; their common workflow is checked for drift. Do not edit generated Codex resource copies directly.

### Project configuration

See the [complete config reference](plugins/co-planner/skills/co-planner/references/config.md). Existing configs need no migration. Additional supported fields include:

- `contractFiles`: coordinator-owned interfaces that must precede dependent work.
- `gates`: actual focused, typecheck and integration commands from the project.
- `maxLanes`: an upper bound, not a required concurrency level.
- `workers`: optional installed and authorized native/external workers, with optional model/effort settings; no hard-coded model promises.
- `statusFile` and `insightsFile`: reuse established project locations.

Explicit session choices override saved defaults. Worker availability and host limits determine feasible execution; configuration is not launch authorization. Planning and context writes respect the actual host mode.

### Context ownership and freshness

Managed sections use `co-planner:instructions`, `co-planner:handoff`, or `co-planner:memory` start/end HTML comments. Soft budgets are 40, 80 and 12 lines respectively. Unmanaged content is preserved; ambiguous markers stop automatic updates to that file. Applicable overrides are honored.

Only the active host's instruction file is created when absent. If both platform files exist, their small managed sections point to the same handoff. An existing `statusFile` is reused. Codex native memory is generated state and is not edited. Claude auto-memory receives only a small pointer when the host supplies its real location and permits writes.

A saved commit/branch identifies context, not validity: relevant uncommitted changes and changed files must also be checked on resume. Keep secrets and raw transcripts out of project memory. No hooks, background services, global settings changes, forced compaction or automatic fresh sessions are installed.

Run the read-only check from this repository:

```bash
node plugins/co-planner/skills/co-planner/scripts/context-check.mjs /path/to/target-project
```

Extra arguments are file paths relative to the target project for checking nested or nonstandard context files. The checker does not discover every ancestor instruction file. It reports bytes/lines, malformed markers and broken basic inline Markdown links; it does not validate semantic claims, model tokens or monetary savings.

### Map and adapters

```bash
node /path/to/installed/co-planner/scripts/map.mjs
node /path/to/installed/co-planner/scripts/map.mjs CheckoutPage
node /path/to/installed/co-planner/scripts/map.mjs CheckoutPage --adapter
```

Run from the target project. The map uses bounded regex-based inspection, not a compiler graph. It skips tests and many generated folders, caps source files and view reporting, and reports unparsed coverage. Follow props, routes, APIs, events and persistence before interpreting missing shared-store detections.

A project adapter at `.co-planner/map.mjs` must be reviewed as read-only before execution. It is opt-in with `--adapter`, receives the focus argument and has a five-second timeout. Timeout is not sandbox isolation. Nonzero/timeout failures retain the generic output and return failure. Without Node.js 18+, use manual inspection.

### Validate and extend

```bash
node --test tests/*.test.mjs
claude plugin validate .
claude plugin validate plugins/co-planner
```

See [behavioral scenarios](tests/scenarios/README.md) for realistic exercises covering guidance, styles, scope, memory and resumption. Structural tests do not prove model behavior. Compare outcomes and observed reads on the same task before making efficiency claims; fewer questions alone is not evidence of a better plan.
