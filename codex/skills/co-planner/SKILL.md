---
name: co-planner
description: Extend native Plan mode with collaborative questions, grounded improvement suggestions, and implementation-ready plans for features, redesigns, or new projects. Use for collaborative planning or $co-planner, including quick small-feature plans. Supports English and Hebrew.
---

# Co-planner

Plan with the user through short rounds that build on their answers and free-text notes. Find valuable connections between existing capabilities, spread decisions where they actually fit, and finish with a verifiable wave of work.

## Native Plan mode first

Co-planner is an add-on to the host's native Plan mode. For a new planning session, confirm that mode is active before starting the planning rounds; follow the platform adapter below to enter it or direct the user to the native control. Selecting a co-planner style does not change the host's mode. If the host has no native Plan mode, explain that limitation and offer a conversational planning-only fallback; never claim the native restrictions are active.

After the plan is accepted, implementation proceeds through the host's normal approval/mode transition. The approved plan, briefs and context-care instructions continue to guide that implementation; do not re-enter Plan mode merely to save an authorized checkpoint or execute an already approved plan. Queue project-memory writes until the host permits them.

## Start and route

1. Read the project's applicable instructions and relevant status. Load `.co-planner/config.json` if present; see [configuration](references/config.md) for supported options. Current user instructions override saved preferences and an old next-task list.
2. Resolve language: explicit `--lang en|he`, then config, then request language. For Hebrew, read [Hebrew guidance](references/he.md) before composing the session. Identifiers remain unchanged.
3. Resolve style: explicit `--style adaptive|explore|converge` or conversational choice, then `planningStyle`, otherwise `adaptive`. Announce the choice briefly; do not require a setup questionnaire. Allow changes during the session.
4. Read [the planning workflow](references/workflow.md). Use only the references needed by the task. Load relevant memory entries rather than all historical notes.
5. Resolve guidance: `--guided` or an explicit request enables it; otherwise `guidance: "guided"` enables it and `"off"` disables automatic offers. The default `"auto"` offers guided help when important unaddressed decisions emerge or the user asks for help understanding choices. Read [guided planning](references/guided.md) when guidance is useful.
6. Read [context care](references/context-care.md) when managing project context or handing planning to implementation. Default is managed; `contextManagement: "off"` disables its writes, not applicable project instructions.

## Modes

- **Adaptive:** investigate uncertainties in proportion to their impact, then converge when the plan is ready.
- **Explore:** examine alternative approaches, simplifying moves and useful combinations more broadly before narrowing scope. Keep exploratory ideas separate from committed work.
- **Converge:** resolve blockers and plan the smallest useful outcome; raise an extra idea only if it materially improves that outcome.
- **Quick** (`quick`, or clearly small scope): targeted inspection, at most two question rounds, one implementation lane, no exhaustive spread or combination sweep. If a material blocker remains, name it and offer a discovery task or a larger session instead of inventing a settled decision. Quick limits override style breadth.
- **Efficient** (`--efficient`): improve implementation briefs and match available workers to independent tasks. Read [efficient mode](references/efficient.md) when planning implementation. This is independent of planning style and does not switch the session's model.

## Essential boundaries

- Distinguish code evidence, user-reported behavior, and hypotheses. An undetected store or import is not proof of an absent handoff.
- Ask about intent and consequential tradeoffs; discover repository facts yourself. Clarify an ambiguous goal early, but inspect relevant implementation before recommending code changes.
- Free-text answers can override a selected option. Resolve meaningful contradictions rather than silently choosing one.
- Suggestions are proposals until accepted. Do not turn a temporary budget cut into a permanent dislike or an inferred preference into a hard rule.
- A planning request authorizes planning, not implementation. Respect the host's actual mode and write restrictions; queue memory changes for the first permitted implementation step. Never claim to switch modes without a supported host mechanism.
- Stop when the outcome, scope, blocking decisions, dependencies, acceptance criteria and verification are settled. If the user asks for the plan earlier, expose assumptions and unresolved blockers; do not label an incomplete plan implementation-ready.

## Deliver

Use [the plan template](references/plan-template.md), keeping only useful sections. Include accepted decisions and reasons, the executable first wave, deferred ideas, and proportionate checks. Context setup belongs in task 0 when enabled. A post-wave review learns from actual use when the user is available; it does not block completion of otherwise finished implementation.

Before finalizing, check consistency between decisions, task dependencies, ownership, acceptance criteria and scope. Present the plan through the host's supported planning surface.

## Codex adapter

- Invocation: `$co-planner`; take options and the task from the user's message, including natural-language style changes.
- Resolve scripts and references relative to this installed `SKILL.md`, not the project working directory. Run `node <absolute-skill-directory>/scripts/map.mjs` from the target project root; quote paths containing spaces.
- Respect the host's current collaboration mode. A skill cannot enable or exit Codex Plan mode. For a new planning request outside it, direct the user to the native Plan control (`/plan` where supported) and wait for the mode change before starting rounds; do not treat the command text or a promise to switch as proof that the mode changed. In Plan mode, keep proposed file changes in the plan and use the host's required final-plan format. Outside Plan mode, co-planning still does not imply permission to implement.
- Use the available question tool only under its documented conditions. For `request_user_input`, keep to at most three questions with single-choice options; do not invent multi-select or preview fields. Show previews separately, and use a numbered list with a free-text selection for selecting multiple items. If no suitable tool is available, ask in chat.
- Use `[agent]` for agent-originated proposals. Read-only exploration or implementation workers are optional and subject to host availability and authorization. A sequential plan is a complete fallback; see [workers](references/workers.md).
- Native Codex memories are generated host state. Use project instructions and the explicit project handoff for this skill's durable continuity; do not modify native memory internals or global settings.
