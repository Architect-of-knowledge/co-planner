# Roadmap

Ideas for later versions. Nothing here is promised; open an issue to discuss one.

## Claude Code desktop

Make co-planner equally at home in the Claude Code desktop app (macOS and Windows) as in the CLI:
- **Worker detection that survives the desktop's PATH.** Apps started from the desktop don't always inherit the shell's PATH, so `command -v codex` can fail even when the tool is installed. Look in the usual install folders too (`~/.local/bin`, npm's global bin, `%LOCALAPPDATA%`), and offer to record full paths in `.co-planner/config.json`.
- **Windows recipes.** Launch lines for PowerShell, and for workers installed inside WSL (`wsl codex exec …`, `wsl agy -p …`), including how clones and paths map between Windows and WSL.
- **Cloud sessions.** When the session runs in a remote sandbox (Claude Code on the web), external CLIs and their logins aren't there: say so once, and plan every lane for Claude subagents.
- **Desktop-friendly previews.** Check how ASCII mockups and right-to-left Hebrew render in the desktop app's panel, and adjust `references/he.md` if it differs from terminals.

## Other ideas

- A map adapter gallery: example `.co-planner/map.mjs` files for common stacks (Next.js routes, a plugin registry, a design-system inventory).
- More languages beyond English and Hebrew, starting with other right-to-left languages (Arabic, Persian), which can reuse the same RTL rules and checker.
