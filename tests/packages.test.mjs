import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, readdirSync, existsSync, rmSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";

const packages = ["plugins/co-planner/skills/co-planner", "codex/skills/co-planner"];
function allFiles(root) {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? allFiles(join(root, entry.name)) : [join(root, entry.name)]);
}

test("Codex resources and shared workflow match canonical source", () => {
  execFileSync(process.execPath, ["scripts/sync-codex.mjs", "--check"], { stdio: "pipe" });
});

for (const source of packages) test(`${source} works as an isolated skill folder`, (t) => {
  const root = mkdtempSync(join(tmpdir(), "co-planner-package-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const destination = join(root, "installed skill");
  cpSync(source, destination, { recursive: true });
  for (const file of allFiles(destination).filter((file) => file.endsWith(".md"))) {
    const text = readFileSync(file, "utf8").replace(/```[\s\S]*?```/g, "");
    for (const match of text.matchAll(/\[[^\]]+\]\(([^\s)]+)\)/g)) {
      const target = match[1];
      if (/^(https?:|#)/.test(target)) continue;
      assert.ok(existsSync(resolve(dirname(file), target)), `${file}: broken resource ${target}`);
    }
  }
  const output = execFileSync(process.execPath, [join(destination, "scripts/map.mjs")], { cwd: resolve("tests/fixture-app"), encoding: "utf8" });
  assert.match(output, /CartPage/);
  execFileSync(process.execPath, [join(destination, "scripts/context-check.mjs"), root]);
  const hebrew = allFiles(join(destination, "templates/he"));
  execFileSync(process.execPath, [join(destination, "scripts/rtl-check.mjs"), ...hebrew]);
});
