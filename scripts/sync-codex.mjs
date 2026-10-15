#!/usr/bin/env node
// Claude resources are canonical. Copy them into the independently installable Codex skill.
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "plugins/co-planner/skills/co-planner");
const target = join(root, "codex/skills/co-planner");
const args = process.argv.slice(2);
if (args.some((arg) => arg !== "--check")) {
  console.error("Usage: node scripts/sync-codex.mjs [--check]");
  process.exit(2);
}
const check = args.includes("--check");
function files(dir, prefix = "") {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap((entry) => {
    const name = join(prefix, entry.name);
    return entry.isDirectory() ? files(join(dir, entry.name), name) : [name];
  });
}
let drift = 0;
for (const group of ["references", "scripts", "templates"]) {
  const expected = files(join(source, group));
  for (const file of expected) {
    const src = join(source, group, file), dest = join(target, group, file);
    const content = readFileSync(src);
    if (existsSync(dest) && content.equals(readFileSync(dest))) continue;
    if (check) { console.error(`out of sync: ${group}/${file}`); drift++; }
    else { mkdirSync(dirname(dest), { recursive: true }); writeFileSync(dest, content); }
  }
  for (const file of files(join(target, group))) if (!expected.includes(file)) {
    console.error(`extra Codex resource: ${group}/${file}; review and remove explicitly`);
    drift++;
  }
}
// Platform adapters differ; shared entrypoint workflow must not drift.
const shared = (file) => readFileSync(file, "utf8").split("# Co-planner\n")[1]?.split("\n## ").slice(0, -1).join("\n## ");
const claude = shared(join(source, "SKILL.md")), codex = shared(join(target, "SKILL.md"));
if (!claude || claude !== codex) { console.error("shared SKILL.md workflow differs; reconcile entrypoints"); drift++; }
if (drift) process.exitCode = 1;
else console.log(check ? "Codex shared resources match." : "Codex shared resources synchronized.");
