# Plan template

Use only sections that help the task. Omit empty sections; preserve host-required output formatting. For a small task, combine these into a few short paragraphs. Avoid invented detail for an unbuilt project.

```markdown
# Plan: <outcome>

## Outcome and scope
Who benefits, what they can do afterwards, and the constraints.
Key journeys or operational flows; explicit non-goals where needed.
Evidence: confirmed findings, attributed user observations, labeled hypotheses.

## Decisions
Accepted choices, reasons and meaningful alternatives rejected.
Assumptions and any bounded discovery required before dependent work.

## First wave
Task 0 (when writes are permitted): save the approved plan if needed;
update enabled managed context and meaningful memory changes.

Tasks in dependency order:
- Outcome served; change and affected files/components.
- Prerequisites and shared interfaces/contracts where necessary.
- Done when: observable acceptance criteria.
- Verify: actual command/check and expected behavior, or explicit limitation.

If parallel work helps: lane ownership, prerequisites and integration order.
Shared contracts precede dependent lanes; one owner for overlapping files.
If not: sequential execution is sufficient.

Integration: relevant broader gates, user-visible checks, and failure handling.
Context checkpoint: observed results, outstanding work and next action.

## Later and risks
Deferred ideas with reason; do not silently include them in this wave.
Material compatibility, migration, rollback or operational concerns only.
After real use: short feedback round; update taste/rules and backlog from evidence.
```

Readiness review: every accepted outcome is covered; tasks agree with decisions; dependencies and file ownership are feasible; tests prove acceptance rather than mirror wording; scope fits the agreed constraints. No fabricated alignment percentages or passing test claims.
