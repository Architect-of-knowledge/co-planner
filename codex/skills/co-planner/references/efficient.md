# Efficient implementation

Efficient mode invests in scoped briefs and verification. It does not switch the coordinator model or guarantee lower cost. Use configured, actually available workers and host-permitted delegation; otherwise execute sequentially with the same briefs.

Before naming a worker, inspect its availability and current supported options. Model names and reasoning levels come from validated configuration or the host default, not hard-coded recommendations. Do not warn users that their model is inadequate based only on its name.

A useful brief contains:
- Outcome and acceptance criteria; prerequisites and exact interfaces where coordination requires them.
- Relevant helpers/patterns with source pointers, and one worked example when it reduces ambiguity.
- Owned files, shared contract boundaries, and the sequence dictated by dependencies.
- Focused verification and known baseline failures; project-specific restrictions and how to report a blocker.
- Required report: changes, checks actually run, unresolved issues, and worthwhile new insights.

Write a failing test first when it captures a meaningful behavioral requirement and is practical. Do not mandate a test for every prose edit or forbid correcting an erroneous assertion; workers report necessary test changes for coordinator review. Size lanes by coherent responsibility and dependencies rather than a fixed number of files. Keep shared contracts with one owner.

Give each worker only its brief and relevant references, not the full planning history. Review diffs and verification before integration, rerun affected gates on the integrated result, and use a separate review only when complexity or risk warrants it. If a worker is stuck, diagnose the cause before retrying; bound retries and take over or report a concrete blocker. Avoid duplicating work merely to spend less on each individual call.

See [workers](workers.md) and [context care](context-care.md).
