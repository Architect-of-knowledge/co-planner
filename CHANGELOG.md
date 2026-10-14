# Changelog

## 0.1.1 (2026-10-14)

- **Efficient mode** (`--efficient`): a strong coordinator (an Opus-class session) with lighter workers. By default these are Claude Sonnet subagents; GPT-5.6 Terra through the Codex CLI and Gemini 3.8 Flash and 3.1 Pro through Antigravity can be added when installed.
  - The coordinator writes the failing tests first.
  - Each worker gets a detailed brief: reuse pointers with `file:line`, one worked example, exact signatures, steps in order, forbidden moves and a self-check.
  - Lanes are capped at 2–4 files, and the coordinator reads every diff.
- **External workers in every mode:** recipes for Antigravity (Gemini) and the Codex CLI, with the permission and status pitfalls of each. Model names are kept as editable defaults in `config.json`.
- `ROADMAP.md`, with Claude Code desktop support as the first item.

## 0.1.0 (2026-10-14)

First release.
- **Compounding question rounds** built on your answers and notes:
  - each decision is spread to its whole family;
  - 3rd-knowledge search;
  - taste and design rules that persist in `.co-planner/`;
  - a sized wave plan with parallel lanes and one surgical check per task.
- **Rules from the first real run:**
  - no question before the code map;
  - a mandatory tally line with a size gate;
  - a review round after each wave.
- **Quick mode** for small features.
- **English and Hebrew,** with strict right-to-left rules and a checker (`rtl-check.mjs`).
- **A generic code map** (`map.mjs`): families, views, and the shared state each view touches, with an optional project adapter.
