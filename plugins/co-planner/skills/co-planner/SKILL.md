---
name: co-planner
description: Plan a feature, product area or redesign together with the user, in compounding question rounds that build on each answer (including the user's free-text notes), spread every decision to the whole family of similar components, look for "3rd knowledge" (two existing parts that together make something neither does alone), remember the user's taste and design rules across sessions, and end in a sized, verifiable wave plan with parallel lanes. Works in English and Hebrew (full RTL support). Use when the user invokes /co-planner, or asks to co-plan, design or rethink something larger than a single fix. Use "/co-planner quick" for small features and "/co-planner --efficient" for a strong coordinator with lighter, cheaper workers.
argument-hint: "[quick] [--efficient] [--lang en|he] <what to plan>"
---

# co-planner: plan together, as one system

*Design: Eyal Nof (Architect-of-knowledge). Method first used on Creation Studio, a web DAW, on 2026-10-14; see `examples/` in the repository.*

Most products are strong components that don't yet work as one system. Your job as co-planner is to turn the user's short directives into concrete proposals, spread each decision to everything it should also apply to, notice what two existing components could do together, and learn from every answer what the user values. Then stop planning and plan a wave that ships.

**Grounded intuition.** A suggestion counts only when it comes from what the code, the docs, the project's own map and the user's recorded taste actually say, never from generic habits of the genre.

Request: $ARGUMENTS

## Modes and language

- **Full** (default): everything below.
- **Quick** (`quick` in the arguments, or the request is clearly one small feature or fix): map only what the request touches, at most **2 rounds**, no spread round, no 3rd-knowledge sweep (raise one only if it is obvious), a one-lane plan. Still write taste entries.
- **Efficient** (`--efficient`, combinable with full or quick): a strong coordinator (an Opus-class session) with lighter workers: Claude Sonnet subagents by default, and optionally GPT-5.6 Terra (Codex CLI) or Gemini 3.8 Flash and 3.1 Pro (Antigravity `agy`) when installed. The coordinator writes the failing tests and **thick briefs**, keeps lanes to 2–4 files, and reads every diff. **Read `references/efficient.md` before planning lanes.**
- **Language:** `--lang he|en` wins; else `.co-planner/config.json` `"lang"`; else the language of the user's request. In Hebrew, **read `references/he.md` before writing anything** and follow it exactly (vocabulary, tags, RTL rules for questions, previews and files). Never mix: one session, one language for everything the user reads; code, paths and identifiers stay as they are.

If plan mode is not active, enter it (EnterPlanMode). Plan mode lets you write only the plan file: everything this skill persists (taste, rules, insights) is collected during the session and written by **task 0** of the plan.

## 0. Load (quietly, cheaply)

Read, and keep conclusions only:
1. The project's instructions (`CLAUDE.md`, `AGENTS.md`, `README`) and any status or handoff file. If the request jumps ahead of a written "next" list, say so and ask.
2. `.co-planner/` in the project root, if it exists:
   - `config.json`: language, contract files, gates, workers, the map adapter (`references/config.md` has the format);
   - `design-rules.md`: decisions that apply to a whole family; don't re-ask them, check new work against them;
   - `taste.md`: what the user likes and cuts, and why;
   - `insights.md`: emergent insights and 3rd knowledge already logged; don't re-propose an entry, extend it.

   If the folder is missing, this is the first run: plan to create it in task 0 from `templates/<lang>/`. Don't ask about it.
3. **The map:** run `node ${CLAUDE_SKILL_DIR}/scripts/map.mjs` from the project root. It finds the project's components and groups them into families (packages, folders, exports), lists the UI views and the shared state each one touches, and shows which views share no state. If `.co-planner/map.mjs` exists, the script runs it too, as the project's richer adapter (a dependency graph, a plugin registry, a design-system inventory). Use `map.mjs <name>` for one component's neighbours.
4. Only what the request touches: the code near the change and the docs that govern it. Use up to 3 parallel read-only search agents for broad sweeps.

## 1. Intake

Turn the request into:
- **The target, as a feeling** ("adding a payment method feels like filling one form, not three") plus 2–5 **core journeys** it must make smooth.
- If the user brought a list, group it into themes and find the patterns behind the items. Small items often share one missing contract.

## 2. Map (code first, browser only when disputed)

Walk each journey through the code and the map. Record every **dead end, extra step, context switch, missing handoff and inconsistent behaviour** as a friction item, with evidence (`file:line`).
- Two views that share no state cannot hand off to each other: in a journey that crosses them, that is a prime gap.
- Run the app or a headless browser only where the code and the user's experience disagree, or to count steps before and after. Never on the user's real data.
- Compare with well-known products when a journey has a familiar shape there: say what to borrow and what to do better.

## 3. Rounds (compounding)

**No round before the map.** Round 1 goes out only after §2 is done: the search agents have reported and the friction list exists. A recommendation made before the code is read is a guess (the first real run recommended the wrong model in round 1 and the user had to correct it). While agents run, read cheap sources yourself; if the user is waiting, say what the map is still checking.

Each AskUserQuestion round is **built from the last one's answers**. At most 4 questions. Fill slots by value, never by quota:
- **Deeper** (at least one): the next unknown that the last answer opened.
- **Spread:** a decision just made for one component goes to its family, as a multiSelect listing the real members from the map. Mark members whose design conflicts, and say why. Spreads that don't fit this round go on the **held queue**.
- **3rd knowledge:** only when a real candidate exists (§5). Options: adopt into this plan / log it / drop it.

Rules:
- **Read the notes as the directive.** The user's free-text notes often say more than the option they picked, and can overturn it. If a note contradicts the pick, resolve it in the next round instead of choosing silently. If a note asks a question, answer it at the top of your next message.
- Use `preview` with ASCII mockups for any UI behaviour (layouts, menus, before/after). In Hebrew, follow `references/he.md` for previews.
- Expand boldly, and tag where each proposal came from: **[yours] [spread] [3rd] [Claude]**. The user cuts freely.
- Recommended option first, marked "(Recommended)". Never ask what the repo can answer; never ask "should I continue?".
- After each round, update the **taste model** (session notes): what was picked, what was cut, and the principle behind it. Use it to aim the next round. A preference seen 2–3 times becomes a **proposed design rule**.
- **Every round's message ends with the tally (mandatory; a round without it is incomplete):**
  ```
  Wave 1 so far: <item> [tag] · <item> [tag] · …   (~L lanes, size S/M/L/XL)
  aligned ~N% for Wave 1 · open: … · held: N
  ```
  Size is rough: about one lane per 4–6 files touched or one new contract. **Size gate:** when Wave 1 passes 3 lanes, or grows by more than one item in a round, the next round includes a cut question ("which of these move to Wave 2?", the newest additions first). Expanding is your job; deciding what fits is the user's.

## 4. Spread round

Before planning, ask about everything still on the held queue (merge related items into one multiSelect: Wave 2, later, or drop). Accepted spreads that will apply to future components become proposed design rules; ask the user to accept them as rules in the same round.

## 5. 3rd knowledge

Two components each do their own job; together they make a third thing that belongs to neither. Recognise it; don't force it. Log only what really emerged.
- **Inline:** when a pair clicks during the talk, raise it in the next round.
- **Final sweep, before the plan (full mode):** cross each component the plan touches with the rest of the map: its families, the shared libraries, the data stores, the background services, the AI or automation features, the dev tooling.
- Lenses that find real candidates: a shared signal or contract nobody joined yet; one component's output is another's missing input; a measurement that could drive a control; one gesture that would serve a whole family; a cost that disappears because something is already built.
- Grade each A–D with a caveat. A weak idea is marked weak.

## 6. Stop rule

Write the plan when **Wave 1 is ≥95% aligned and the last round changed nothing structural**, or when the user says "plan it". Later waves don't need 95%.

## 7. The plan

The plan file, with only the sections that earn their place (`references/plan-template.md` has the skeleton):
1. **Context, target and journeys:** the feeling, the journeys, success = what the user can do afterwards (step counts where measured).
2. **Decision log:** each decision with its tag and a one-line reason.
3. **Backlog:** ranked; one line per item, grouped by journey or theme. Wave 2+ stay one line.
4. **Wave 1 in full:** contracts first (the files `config.json` names as contract files, or schemas, APIs and shared types), then providers, consumers and integration. Each task: what + where (files) + why + done-when + **one surgical verify** (a focused test file, a typecheck, one scripted check). No test that doesn't prove a done-when. The full suite and any browser or demo check run once, at the wave's merge.
5. **Lanes:** up to 3 parallel lanes (or `config.json` `maxLanes`) with **non-overlapping "files you own"**. Default workers are Claude subagents, each in its own git worktree or clone; external worker CLIs (Codex, Antigravity with Gemini, others) are optional in every mode (`references/workers.md`). In efficient mode, lanes follow `references/efficient.md` (worker per lane, the thick brief, tests written first). Every lane brief says: **log any insight or 3rd knowledge that comes up while building**, in the lane's report.
6. **Task 0 (first, after approval):** write the session's taste entries, the accepted design rules and the new insights to `.co-planner/`, create the folder from `templates/<lang>/` on a first run, and write the lane briefs (to `.co-planner/briefs/`, or the project's own briefs folder). In Hebrew, run `rtl-check.mjs` on every file written.
7. **Risks:** the ones that matter for this domain (performance, data migration, compatibility, security, accessibility, cost).
8. **Review after the wave ships (task R):** once the wave is merged and the user has tried it, run one short round on what they actually used, what felt wrong and what they skipped (multiSelect over the shipped items, with notes). Write the answers to `taste.md` marked "used" or "unused/disliked", with the principle; retire or adjust rules that didn't hold; add the friction found to the backlog. Taste learns from use, not only from planning answers.

Then check: was every decision spread where it belongs? Did the 3rd-knowledge sweep run (full mode)? Is every task verifiable with one surgical check? Does the last round end with the tally? Then ExitPlanMode.
