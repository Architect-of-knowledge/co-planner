# Behavioral evaluation scenarios

These are realistic manual/host evaluation cases, separate from `node --test` structural regressions. Run in disposable project copies, with the matching installed skill and host mode. Do not give the acting model the expected outcomes below. Keep generated files and transcripts outside the source repository; record the host/version, prompt, answers, files changed, checks and observed result.

No paid API runner, worker delegation or credentials are required by the automated test suite. Live model sessions have not been run as part of the 0.2 implementation validation. The author reviewed the instruction paths and the illustrative English/Hebrew dialogues; that is a consistency review, not evidence that every host will follow them.

## Cases

| Case | Request and setup | Observe |
|---|---|---|
| Adaptive | Existing fixture app: “Make checkout easier; preserve current cart behavior.” | Inspect relevant handlers; distinguish evidence from assumptions; ask only consequential intent questions |
| Explore | Same app: “Explore how these existing screens could work together.” | Several internally considered ideas, strongest candidates presented with benefit/cost/evidence; optional ideas outside scope |
| Converge | Same app: “Just plan a small CSV export, no paid services.” | Focus on export behavior and limits; no unsolicited redesign |
| Quick + guided | “Quick, guided: export the current report.” One user round leaves a material authorization ambiguity | Respect two-round limit; expose blocker or bounded discovery instead of declaring readiness |
| New project | Empty folder: “A booking app for my one-person repair business.” | No invented files/map evidence; clarify outcome and constraints, label assumptions |
| Guided explicit | `--guided`: “I don't know what decisions matter for bookings.” | Plain scenarios about consequential gaps; recommendation and downside; no technical quiz |
| Guided auto | No flag; user says “I don't know what I am missing.” | Offer guided help once; decline keeps normal planning working |
| Guidance disabled | `guidance: "off"`; ordinary request, then explicit `--guided` | No automatic offer; explicit request enables guidance |
| Contradictory answer | User picks immediate confirmation, note says “I need to approve every booking.” | Resolve the conflict; do not silently pick one |
| Deferred idea | Memory says “Self-service cancellation deferred due to time.” | Do not label it disliked or add it to current scope; reconsider only if constraints change |
| False isolation | Two views transfer an ID through a route or an API, without shared stores | Inspect the actual transfer; do not recommend a new global store solely from mapper output |
| No workers | Efficient request with native agents unavailable and no external CLI access | Produce useful sequential briefs; no fabricated workers or model names |
| Invoked before Plan mode | Start a new planning request in ordinary mode | Claude requests native entry when available; Codex directs the user to the Plan control and waits before rounds; no claim that style flags toggle native mode |
| Approved implementation | Accepted plan, host now permits implementation | Execute approved work and context updates without forcing re-entry to Plan mode |
| Read-only planning | Existing instruction file, request to plan and remember decisions | No project/native-memory writes; pending context task in plan |
| Existing instructions | File has user prose before and after a managed block | Update block only; compare outside bytes before/after |
| Both hosts / override | `CLAUDE.md`, `AGENTS.md`, effective `AGENTS.override.md`; custom status file | Respect effective files and scope; one handoff; preserve unrelated content |
| Duplicate markers | Two `co-planner:instructions` sections | Report ambiguity; no automatic rewrite of that file |
| Context off | `contextManagement: "off"` | Read required instructions but no managed or native-memory writes |
| Native memory absent | No host-provided Claude memory path, or Codex native store present | Project handoff works; no guessing Claude paths, editing Codex generated state, or changing global settings |
| Resume with changes | Saved handoff references old checks; modify relevant source without committing | Revalidate relevant evidence/results; do not rerun the whole exploration by habit |
| Hebrew | Hebrew request for new booking app, then feedback and a pause request | Hebrew questions/options/plan/handoff; code identifiers unchanged; copied commands valid; new files pass RTL check |

## Human scoring

Judge observable results, not exact headings or wording:

- Suggestions: relevant outcome, supported evidence or labeled hypothesis, meaningful downside and validation.
- Planning: no unresolved consequential decisions disguised as defaults; dependencies and acceptance criteria are actionable.
- Guidance: surfaces an important missing question, explains it without jargon, adapts to the answer and stops when useful decisions are settled.
- Scope: rejected/deferred ideas remain outside the wave; user notes govern interpretation.
- Context: user content preserved, mode restrictions respected, useful next action and honest verification state.
- Efficiency: no unnecessary repeated question/exploration; record actual tool reads if the host exposes them. Do not equate shorter output with quality.

## Compact-context comparison

Run `node tests/scenarios/context-reading.mjs` for a reproducible read-volume illustration. It compares two explicit read sets for the same unchanged cart-resume fixture: all topic notes versus a handoff plus the relevant rule and source. It checks that both sets contain the accepted decision and necessary source. This measures files and UTF-8 bytes under a declared read policy, not live model behavior, tokens, billing, or a general savings percentage. Changed source still needs revalidation in either policy.

For a live resume evaluation, record the actual tool calls in two fresh sessions on the same snapshot, one with the earlier workflow and one with the upgraded skill. Supply the same user answers. Compare repeated reads and unnecessary remapping while also scoring correctness; report host caching and unavailable usage telemetry as limitations.

## Hebrew conversational review sample

**Request:** “אני רוצה יישום להזמנת פגישות. אני עובד לבד ולא יודע מה צריך להחליט.”

**Suitable next question:** “אם שני לקוחות מנסים להזמין אותה שעה, האם ההזמנה הראשונה צריכה לשמור את המקום מיד, או שתרצה לאשר בקשות ידנית? אם שעות העבודה שלך קבועות, אני ממליץ על אישור מיידי כדי לחסוך לך טיפול בכל בקשה.”

**User:** “אישור מיידי, אבל ביטולים רק דרכי כרגע.”

**Suitable recap:** “הוחלט על הזמנה מיידית של שעה פנויה ועל ביטולים דרכך. ביטול עצמאי נשאר מחוץ לגרסה הזאת. בהמשך נברר את משך הפגישה ואת המידע הדרוש לאישור ההזמנה.”

This is an authored walkthrough, not a captured Claude/Codex test transcript. It illustrates concrete guidance, respected scope and natural Hebrew independent of RTL linting.
