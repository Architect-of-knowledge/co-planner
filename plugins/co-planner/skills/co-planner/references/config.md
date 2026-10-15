# Optional `.co-planner/config.json`

All fields are optional. Missing config uses defaults; preserve unknown fields and existing values during updates. Invalid JSON: report the problem and use stated session defaults without overwriting the file. Unknown style/language/guidance/context values: report and fall back to the defaults below for this session.

```json
{
  "lang": "en",
  "planningStyle": "adaptive",
  "guidance": "auto",
  "contextManagement": "managed",
  "contractFiles": ["src/schema/**", "src/api/types.ts"],
  "gates": { "focused": "npm test -- <test-file>", "typecheck": "npm run typecheck", "full": "npm test" },
  "maxLanes": 3,
  "workers": [{ "name": "native", "kind": "subagent", "modes": ["efficient"] }],
  "statusFile": ".co-planner/handoff.md",
  "insightsFile": ".co-planner/insights.md"
}
```

- `lang`: explicit `--lang en|he` wins, then config, then the request's language.
- `planningStyle`: `adaptive` (default), `explore`, or `converge`. Explicit flags or conversational choices override config; a session override need not change the saved default.
- `guidance`: `auto` (default), `guided`, or `off`. Auto offers help when important overlooked choices emerge; `--guided` or a natural-language request enables it explicitly. Guidance does not change planning style or quick limits.
- `contextManagement`: `managed` (default) or `off`. Controls context-care writes, including native-memory pointers. Off does not disable required instruction loading. Existing topic memory remains usable; only save changes if specifically requested.
- `contractFiles`: coordinator-owned shared interfaces; lanes must not edit them concurrently.
- `gates`: project-specific commands; examples are not guaranteed available. Discover real commands before including them in a plan.
- `maxLanes`: positive integer, default 3; an upper bound, not a target. Dependencies and host limits may require fewer or sequential tasks.
- `workers`: optional worker preferences. `kind` may be `subagent`, `codex`, `agy`, or another installed CLI. Optional `model`, `effort`, `isolation`, `role`, and `modes` remain supported. Configuration is not proof a worker/model exists or permission to launch it. Omit model names to use host defaults.
- `statusFile`: existing project handoff if configured; otherwise reuse a suitable existing handoff or default to `.co-planner/handoff.md`. Preserve unrelated content.
- `insightsFile`: existing insight log, otherwise `.co-planner/insights.md`.

No mandatory migration: older configs, memory tables, `quick`, `--efficient`, and `--lang` remain valid. Write only fields actually needed, and never infer a worker override from an installed executable alone.

## Optional project adapter

A project may supply `.co-planner/map.mjs` for registries, routes, graphs or other specialized evidence. Inspect it before running; it must be read-only. Invoke the generic map with `--adapter` to execute it after either a full or focused map. It receives the focus argument, runs from the project root and prints Markdown. A 5-second timeout bounds adapter runtime; failures are reported and return nonzero status, retaining generic output. This is a timeout, not a security sandbox.
