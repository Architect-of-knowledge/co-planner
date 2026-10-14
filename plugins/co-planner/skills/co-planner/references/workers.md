# Workers: who implements the lanes

The plan's lanes run in parallel, each owning a set of files that no other lane touches. The coordinator (the main session) writes the contracts first, reviews each lane's diff, merges, and runs the full gates once.

## Default: Claude subagents

Launch one subagent per lane with the Agent tool, in its own git worktree (`isolation: "worktree"`) or a local clone, in the background. Give it the lane's brief file. Ask it to commit after every finished step, run only its focused gates, and end with a report: done or blocked per task, commits, gate results, checks that need a browser, and **any insight or 3rd knowledge**.

## Optional: external worker CLIs

Any CLI that can take a brief and work headless can run a lane. List it in `.co-planner/config.json` `workers`, and keep these rules:
- **One local clone per lane** (`git clone -q . ../<project>-<lane>`, then a branch). Some sandboxes cannot write a worktree's git data, which lives in the main repo; a clone keeps it inside the worker's folder.
- Install dependencies **before** launch if the worker's sandbox blocks the network.
- If the tool cannot commit inside its sandbox, have it leave the work uncommitted and list the commits it would make; the coordinator commits after reading the diff.
- Never give a worker flags that skip permission checks or disable its sandbox.
- Read-only reviewers (a second model reviewing the merged wave) are cheap insurance: run one after each merge.

Example launch lines (adjust models and flags to the tool's own docs):

```bash
# OpenAI Codex CLI, inside the lane's clone
codex exec -m <model> -s workspace-write -C ../proj-lane-a -o lane-a-report.md < ../proj-lane-a/.co-planner/briefs/lane-a.md
# Any CLI with a prompt flag, read-only review of the merged wave
<tool> --read-only -p "$(cat .co-planner/briefs/review.md)"
```

## The brief (every lane)

```markdown
# Task: <wave>, lane <X>: <one line>
You are an implementation worker. Infer the scope from this brief and do the whole job without asking questions.
Work only in <clone or worktree>, on branch <branch>.

## Why
<the friction this lane removes, with file:line evidence>

## Read first
<project instructions, the plan section for this lane, the contracts the coordinator wrote>

## The task
<numbered items, each with its done-when>

## Tests (one per done-when; nothing else)

## Rules
- Files you own: <list>. Never: <the other lanes' files, the contract files>.
- <the project's non-negotiables>
- Log any insight or 3rd knowledge that comes up while building, in your report.

## Gates
<focused tests, typecheck, build: never the full suite>

## Report
Done or blocked per task, commits, gate results, checks that need a browser, insights.
```
