# Collaborative planning workflow

## Ground the request

Inspect applicable instructions, the active handoff, and relevant accepted rules. Follow links selectively. Capture the intended outcome, audience, constraints and current scope; for UI work, describe the key journeys and how they should feel. For non-UI work, use the equivalent operational flows.

For an existing project, run the bundled map if useful, then inspect the relevant files and governing docs. A map is a navigation aid, not a full semantic graph. Its regexes miss aliases, indirect hooks, server state and dynamic connections. Trace routes, props, APIs, events and persistence before declaring a missing handoff. Use a browser or runtime check when it will settle behavior the code cannot establish, using fixture data.

The project adapter is executable code. Inspect it before running it; only execute a read-only adapter in planning. The mapper requires `--adapter` to run it and imposes a timeout. Node unavailable or unsupported stack: use targeted file searches and state the map's coverage limits. Never make installing tooling a prerequisite for a simple planning discussion.

For a new project, use goals, constraints, examples and domain evidence. Label untested ideas as hypotheses. Do not invent file evidence or force a map of an empty repository.

Record useful friction with file/symbol evidence or attributed observations. Prioritize causes rather than listing symptoms. Reuse findings in the current session; on resume check changed files and verify relevant facts before reusing them.

## Find and challenge useful suggestions

Read [suggestions](suggestions.md) when doing substantial exploration or improvement discovery. Adaptive examines the strongest adjacent opportunities; explore considers more alternatives; converge raises only high-value opportunities close to the goal. Quick skips a broad sweep.

A spread is a proposal over actual related components, not a mandate to make everything uniform. Identify meaningful exceptions. Third knowledge combines two existing capabilities into a useful new outcome; distinguish an existing capability from one that would first need building.

For guided sessions, use [guided planning](guided.md) to uncover overlooked decisions with concrete scenarios, explain consequences and recommend defaults. Keep these questions inside the selected style and round budget.

## Compound the conversation

Ask a small batch of consequential questions, within the host's tool limits. Choose the next unknown opened by the user's answer; do not require another question if nothing material is unresolved. Offer a recommendation with its tradeoff, alternatives and room for free text. Show a small mockup when it helps distinguish UI choices, not for every cosmetic decision.

Read notes before interpreting option picks. Answer embedded questions before moving on. Resolve conflicts with current intent; do not repeat settled questions unless evidence changed.

Tag proposals `[yours]`, `[spread]`, `[3rd]`, or `[agent]` (localized in Hebrew). Tags indicate provenance, not priority or approval. Keep a small decision record: accepted, deferred, rejected, or unresolved, with rationale and relevant evidence. Propose durable rules only when the user has established a recurring principle; do not silently promote inferred taste.

After a round, provide a brief recap:

> Wave 1: <accepted outcomes>. Open: <blocking decisions>. Deferred: <useful later ideas>.

Discuss a scope tradeoff when new ideas materially change the agreed outcome, effort or dependencies. Estimate effort from uncertainty, integration and verification as well as code size; lane count is not a size measure. Do not force a cut just because several tiny related fixes were added.

Before finalizing full-mode planning, review the relevant families and strongest combination opportunities. Surface only worthwhile candidates. Offer accepted scope, later work, or discard for unresolved proposals; do not exhaustively question the user about every weak idea.

## Converge and hand off

Ready means:
- The user outcome, audience, in/out of scope and consequential constraints are clear.
- Blocking product and implementation choices are resolved. Low-impact assumptions are explicit.
- Work is sequenced by dependencies, and interfaces are specified enough to prevent conflicting implementations.
- Each accepted outcome has tasks and acceptance criteria; verification is available or its limitation is explicit.
- Material failure behavior, compatibility and migration needs are covered where applicable.

Review the plan against these checks, looking for contradictions and unnecessary work. If uncertainty requires implementation evidence, plan a bounded discovery task with a question, method, completion condition and next decision. Do not conceal it as an ordinary settled implementation task.

Use [the plan template](plan-template.md). Name actual gate commands from the project, or define the needed check if none exists. No invented successful checks. Use focused tests during tasks and broader integration gates after the wave; repeat when new changes or failures justify it.

At authorized implementation start, perform context task 0 when enabled, then contracts and dependent tasks. Worker briefs carry scoped context and require checkpoint updates in reports. On completion update the handoff with observed verification and remaining work, then invite a later usage review. A user's absence does not block finished implementation.
