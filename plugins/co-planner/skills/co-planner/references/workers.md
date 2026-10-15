# Implementation workers

Lanes are a planning structure, not authorization to launch agents. Use workers only during authorized implementation and when the host permits delegation. Sequential implementation is a full fallback. Independent read-only exploration can use available agents when it will reduce uncertainty enough to justify the overhead.

## Native workers

Use the host's supported agent mechanism and isolation options. Do not assume Claude tool names exist in Codex or vice versa. A worktree/clone is appropriate for concurrent edits when supported; read-only searches need no clone. Assign non-overlapping files and stage shared contracts before dependent work. If ownership must change, coordinate before editing.

## External CLI workers

Only use a configured or user-selected CLI after checking it is installed and inspecting current help/documentation for supported flags and model choices. CLI presence alone does not establish login, access, model availability or permission to run. Avoid hard-coded models, reasoning levels and launch recipes that may silently become obsolete.

Use a separate local clone/worktree per editing lane, within permitted locations. Prepare dependencies when necessary and permitted. Respect permissions and sandboxing; never use bypass flags. Whether git commits are writable depends on the environment: leave a diff if committing is unavailable. Inspect both exit status and the tool's reported completion state, not just a successful process exit.

A worker that cannot finish reports the blocker and partial changes; it must not invent verification results. The coordinator reviews diffs, integrates in dependency order and runs relevant gates. Workers report insights; only the coordinator updates shared handoff/memory to avoid overwriting concurrent progress.

## Brief

```markdown
# Lane: <outcome>
Workspace/branch: <actual isolated location, if needed>
Read: <applicable project instructions, plan section, shared contracts>
Why: <accepted outcome and relevant evidence>
Tasks: <changes in dependency order, with observable acceptance criteria>
Own: <files/components>; coordinate before changing ownership.
Reuse: <relevant existing patterns and helpers>
Verify: <actual focused commands and expected behavior>
Constraints: <relevant project requirements; known baseline failures>
Blockers: report missing contracts or consequential ambiguity; do not invent scope.
Report: changes, checks run and results, unresolved issues, useful new insights.
```

Do not ban broader testing when a specific new risk warrants it. Read-only independent review is optional, proportional to risk and available tools.
