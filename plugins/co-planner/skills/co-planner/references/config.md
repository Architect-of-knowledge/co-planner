# `.co-planner/config.json`

Optional. Created by task 0 on the first run, with only the fields the session learned. Every field is optional.

```json
{
  "lang": "en",
  "contractFiles": ["src/schema/**", "src/api/types.ts"],
  "gates": { "focused": "npx vitest run <files>", "typecheck": "npm run typecheck", "full": "npm test" },
  "maxLanes": 3,
  "workers": [
    { "name": "claude", "kind": "subagent", "isolation": "worktree" },
    { "name": "sonnet", "kind": "subagent", "model": "sonnet", "modes": ["efficient"] },
    { "name": "terra", "kind": "codex", "model": "gpt-5.6-terra", "effort": "high", "modes": ["efficient"] },
    { "name": "gemini-flash", "kind": "agy", "model": "gemini-3.8-flash-high", "modes": ["full", "efficient"] },
    { "name": "gemini-pro", "kind": "agy", "model": "gemini-3.1-pro-high", "role": "hard-or-review", "modes": ["full", "efficient"] }
  ],
  "statusFile": "HANDOFF.md",
  "insightsFile": ".co-planner/insights.md"
}
```

| Field | Meaning |
|---|---|
| `lang` | `en` or `he`: the language of the rounds, the plan and the files co-planner writes |
| `contractFiles` | Files only the coordinator (the main session) edits: schemas, API types, shared contracts. Wave 1 starts with them, and lanes never own them |
| `gates` | The commands lanes run (`focused`, `typecheck`) and the one the coordinator runs once at the merge (`full`) |
| `maxLanes` | How many lanes run in parallel (default 3) |
| `workers` | Who implements lanes. The default is Claude subagents, each in its own worktree. `kind` is `subagent`, `codex`, `agy` or another CLI (`references/workers.md`); `model` and `effort` override the defaults; `modes` limits a worker to `full`, `quick` or `efficient`; `role: "hard-or-review"` reserves it for hard lanes and reviews. Model names change: check `codex --help` and `agy models` |
| `statusFile` | The file that says where work stands ("next, in order"). Plans that jump ahead of it say so |
| `insightsFile` | Where emergent insights and 3rd knowledge are logged, if the project already has such a log |

## `.co-planner/map.mjs` (optional adapter)

A project can add its own map script. It runs after the generic map with the same arguments, from the project root, and prints Markdown sections. Typical uses: a plugin or module registry grouped by category, a dependency graph, a design-system inventory, routes and the screens they open. Keep it read-only and fast (under a few seconds).
