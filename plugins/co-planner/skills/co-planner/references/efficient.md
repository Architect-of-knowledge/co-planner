# Efficient mode (`--efficient`): a strong coordinator, lighter workers

The strongest model does what only it can do well: the map, the rounds with the user, the contracts, the tests, the briefs, the review of every diff, and the merge. Lighter, cheaper models do the bulk of the editing. Quality holds because the coordinator puts its effort into the **brief and the verification**, not into typing code.

## Roles and models

| Role | Default | Optional alternatives (if installed) |
|---|---|---|
| Coordinator (this session) | Claude Opus | none: it is the session's own model |
| Implementation lanes | Claude Sonnet subagents (`model: "sonnet"`) | GPT-5.6 Terra through the Codex CLI; Gemini 3.8 Flash through Antigravity (`agy`) |
| Hard lane (tricky logic, concurrency, data migration) | Claude Sonnet subagent with the thick brief | Gemini 3.1 Pro through `agy`; Terra at its highest effort |
| Read-only review of the merged wave | a Sonnet subagent | Gemini 3.1 Pro through `agy` in plan mode |

- **Check the coordinator.** The skill cannot switch the session's model. If the session is not running an Opus-class model, say so once at the start ("efficient mode expects a strong coordinator; switch with `/model opus`, or continue as is") and carry on.
- **Detect the optional workers** before the plan names them: `command -v codex`, `command -v agy`. Name only what is installed, plus whatever `.co-planner/config.json` lists. Model names change often: take them from `config.json` `workers[].model` when set, and tell the user to check `codex --help` and `agy models` for the current names. Antigravity's names carry the effort (`gemini-3.8-flash-high`, `gemini-3.1-pro-high`).
- **Assign by lane, not by habit:** mechanical lanes (wiring, renames, UI plumbing) go to the cheapest worker; lanes with real logic go to the strongest worker available; never run a lighter worker on a contract file.

## The thick brief (what lighter workers need)

A lighter model follows instructions closely but infers less. Every brief in efficient mode adds these sections to the template in `references/workers.md`, and stays under about two pages:

1. **The tests are already written.** Before launching a lane, the coordinator commits one failing test per done-when, in the lane's own test files. The brief says: "make these tests pass without editing their assertions; if a test looks wrong, stop and report". This is the biggest single lever.
2. **Reuse, with addresses.** List the helpers, components and patterns to use, each with its `file:line`, and what not to re-create ("ids come from `newId()` in `src/ids.ts:12`; don't write your own").
3. **One worked example.** Point at an existing piece of code that does the same kind of thing, and say what to copy from it ("follow how `addInsert` in `src/routing.ts:88` builds its command and its inverse").
4. **Steps in order.** A numbered sequence, each step small enough to check: "1. add the store; run `selection.test.ts`. 2. wire the playlist click; run it again …".
5. **Exact signatures.** For every new export: its name, parameters and return type, written out.
6. **Forbidden moves.** The files it must not touch, the shortcuts it must not take (no type casts to silence errors, no catch-all error handling, no editing assertions, no new dependencies), and what to do instead (stop and report).
7. **A self-check before the report.** "Before you finish: run every listed gate and paste the counts; re-read your diff for each forbidden move; list any test you could not make pass and why."

## Lane sizing

- 2–4 files per lane (full mode allows more). Split a bigger lane in two rather than writing a longer brief.
- One new concept per lane: a lane that adds a store *and* a menu system is two lanes.
- Contracts (schemas, shared types, APIs) are always the coordinator's, written and committed before any lane starts.

## Verification (the coordinator's share of the work)

- Read **every line** of each lane's diff before merging; lighter models are more likely to pass a test the wrong way (special-casing the test input, weakening a check).
- Re-run the lane's gates yourself on the merge; don't trust reported numbers.
- One fix round per lane at most: send the specific problems back to the same worker (`SendMessage`, `codex exec resume`, `agy --continue`). If the second attempt still fails, take the lane over.
- After the wave, run a read-only review with a different model family from the workers'.
