# Guided planning: uncover the questions users do not know to ask

Guidance is a layer over adaptive/explore/converge and quick, not a fourth planning style. Enable with `--guided`, a natural-language request, or `guidance: "guided"`. Default `guidance: "auto"` offers it when the user is unsure or consequential omissions appear. `"off"` suppresses automatic offers; explicit requests still win. Do not label users inexperienced or infer ability from language or short answers. Offer once when useful: “I can guide you through the decisions that are easy to miss.” If declined, continue ordinary planning without repeating the offer.

## Find the missing decisions

Privately walk the main outcome from first use through success, failure, recovery and later changes. Inspect existing code/docs first where available. Ask what would surprise this particular user or make the delivered feature incomplete. Relevant lenses include:
- Who uses it, who can see/change data, and whether roles differ.
- First use, empty states, defaults and the smallest successful journey.
- Errors, interruption, retries, cancellation, undo and recovery.
- Ownership, retention, export and deletion of data when relevant.
- Scale, operating cost, deployment and integration constraints when they materially affect the outcome.
- How the user will recognize success and maintain the result.

These are lenses, not a mandatory questionnaire. Do not burden a local toy project with enterprise concerns. Separate blockers to this wave, sensible defaults, and optional later improvements. Avoid claiming every possible risk is covered.

## Teach through decisions, not lectures

Introduce one important missing decision at a time, or a small related batch within the host's question limit. For each:
1. Show a concrete situation in the user's project, without unexplained jargon.
2. Explain what changes for the user and why deciding now matters.
3. Recommend a sensible option with its cost or limitation and meaningful alternatives.
4. Ask only if the answer changes product intent, meaningful cost/risk, or the implementation approach. Choose reversible low-impact defaults transparently.

Example for an upload feature, only if the existing app does not already settle it:
“An upload stops halfway through. Should users retry the whole file or resume from where it stopped? For your small images, I recommend retrying: simpler to build and usually quick. Resuming is more useful for large videos.”

Ground the small-image premise in the user's answers or label it as an assumption. The recommended behavior is still a proposal until accepted if it materially changes scope. Use a compact mockup or before/after flow when useful. Do not ask users to choose libraries or algorithms when their intended behavior and repository constraints already determine the answer.

When the user says “I don't know,” explain the tradeoff, offer a default, and distinguish a provisional assumption from an accepted decision. Lack of an answer is not approval for consequential scope, spending or external actions. If they delegate routine choices, make those choices and record the reason rather than repeating questions.

## Learn and converge

Adapt explanations to demonstrated understanding. Preserve the user's chosen terms and decisions; do not reopen questions simply to follow a checklist. In quick mode guidance shares the two-round budget; prioritize the most consequential gap.

Record only consequential accepted decisions and reasons, explicit defaults, and unresolved blockers. The final plan should explain what was chosen well enough for the user and implementer to understand it, without reproducing the lesson or full questionnaire. Continue using the same readiness gate and context-care lifecycle.
