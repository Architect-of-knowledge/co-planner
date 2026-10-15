# Context care: small, durable, and resumable

Default: `contextManagement: "managed"`; `"off"` disables managed writes and native-memory pointers. Continue reading applicable project instructions regardless. Explain once on first setup: co-planner keeps a small project handoff and labeled instruction section, preserving existing content. No hooks, background process, global settings changes or automatic session resets.

## Inspect before writing

Read applicable project instructions and any effective overrides, including `AGENTS.override.md`, nested instructions, and the configured `statusFile`. Reuse established conventions and active plan locations. If there is no configured status file, reuse an obvious existing handoff when suitable and record its path in config; otherwise use `.co-planner/handoff.md`.

In Plan mode or any read-only session, collect proposed updates in the plan. Do not write memory even if the host allows a special plan file. At authorized implementation start, apply task 0 without asking again for routine in-scope writes. Actual filesystem permissions still apply. If a context file is inaccessible, report it and continue permitted work with a handoff in the final response; do not claim it was saved.

## Instruction sections

Use these exact delimiters (one pair per managed section):

```markdown
<!-- co-planner:instructions:start -->
## Co-planner context
For co-planner work, read the active project handoff at [handoff](.co-planner/handoff.md).
Load linked plans and topic notes only when relevant. Follow their accepted scope;
verify stale findings against current code. Update the handoff at milestones,
blockers and requested handoffs when writes are permitted.
<!-- co-planner:instructions:end -->
```

Adapt the pointer to the actual relative path, and localize prose for Hebrew. Keep this section under about 40 lines. Include only essential accepted durable rules or useful commands that are not already present nearby. Do not copy the whole skill, plan, code inventory, transcript or memory into instructions.

For Claude use the effective project `CLAUDE.md`; for Codex use the effective project `AGENTS.md`, or `AGENTS.override.md` when it shadows that file. Create only the active host's file if missing. If both hosts' project files already exist, keep their small managed sections consistent while respecting each scope. Do not create an override or modify ancestor/global instructions to bypass local guidance. When existing rules conflict, surface the conflict instead of silently changing their meaning.

Append a new section or replace exactly the existing matching section. Preserve all text outside it byte-for-byte. If markers are duplicated, nested, or unbalanced, stop that file's automatic update and report the ambiguity; do not guess which content to delete. If an equivalent pointer already exists outside managed sections, reuse it rather than adding a duplicate. Do not reorganize existing user content.

## Handoff

Use `templates/<lang>/handoff.md` for a new handoff. In an existing multipurpose status file use `<!-- co-planner:handoff:start -->` / `<!-- co-planner:handoff:end -->` and preserve surrounding content. The dedicated default handoff uses these markers too, so the checker can measure it.

Aim for 80 lines in the managed section. Include:
- Goal and active plan link; accepted scope and consequential decisions with reasons.
- Current branch/commit when available, and relevant uncommitted changes. These are freshness clues, not proof that all cached facts remain valid.
- Completed work and remaining tasks; next action and blockers.
- Actual verification command, result, and what revision/work state it checked. Never promote old results to current results without checking relevant changes.
- Links to necessary evidence, contracts and topic notes.

Update at implementation start, completed waves, material blockers, and explicit pause/resume handoffs. Do not rewrite after every tool call or archive transcripts. Replace obsolete status; preserve important unresolved constraints and link detailed history in existing plans. If independent work is active, keep its status scoped to its task and do not overwrite another session's progress.

Plans are the detailed source of accepted scope. Reuse an existing saved plan. If none exists, save the approved plan at `.co-planner/plans/<descriptive-slug>.md` in task 0, using a distinct slug for a distinct effort. Do not duplicate the full plan into the handoff.

## Durable memory and host differences

Keep taste, accepted design rules and insights in their existing topic files; create only files with useful content. Record source/date, context and whether a preference is explicit, inferred, or based on actual use. A deferral due to time is not a dislike. Accepted rules include scope, rationale and exceptions; superseded rules retain a brief dated reason. Never turn an inferred preference into a binding instruction.

Claude's auto-memory index is separate from a repository-root `MEMORY.md`. Only when the host supplies the actual memory location and permits writes, add or update a tiny `co-planner:memory` managed section (soft budget 12 lines) pointing to the project handoff (absolute path here, because it is outside the repo). Do not guess or scan global memory paths, duplicate the topic history, or overwrite other memory entries. If unavailable, project context is sufficient.

Codex native memory is generated host state, not a file this skill maintains. Use effective `AGENTS.md` plus the project handoff; do not edit `~/.codex/memories/` or toggle global memory settings. See [Codex memory](https://learn.chatgpt.com/docs/customization/memories) and [Claude memory](https://code.claude.com/docs/en/memory).

Never store credentials, private user data, raw tool logs, or unsupported guesses as facts. Keep context specific to this project.

## Save context by loading less

- Start from applicable instructions and the short handoff; load the active plan section and relevant rules. Search insights/taste by task instead of reading every entry.
- Reuse valid findings inside a session. On resume inspect status and changes, then revalidate relevant paths/symbols. A branch or commit match alone does not cover uncommitted changes.
- Map the relevant area first; expand only when dependencies or exploration style justify it. Do not persist a second automatic code index that will become stale.
- Give workers their brief, contracts and relevant pointers, not the whole conversation. Ask for concise results and evidence; coordinator owns shared memory updates.
- Run focused checks while editing and broader gates at integration. New changes, failures or unresolved risk can justify repetition.
- Offer a copyable resume prompt when the user pauses or changes sessions: “Use co-planner to resume <goal>; read <handoff>, verify current status, and continue with <next action>.” Never clear the chat or claim automatic compaction.

Run `node <skill-dir>/scripts/context-check.mjs [project-root]` after context updates; pass extra context files explicitly when needed. It reports bytes/lines, marker problems and broken local Markdown links. It does not measure tokens, verify claims, discover all host-loaded instructions, or rewrite anything. Report observed reading reductions separately from model token/cost claims.
