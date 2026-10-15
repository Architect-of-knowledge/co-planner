import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";

const script = resolve("plugins/co-planner/skills/co-planner/scripts/map.mjs");
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "co-planner-map-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
}
const run = (cwd, args = []) => spawnSync(process.execPath, [script, ...args], { cwd, encoding: "utf8" });

test("uninspected views are not diagnosed as isolated", (t) => {
  const root = fixture(t);
  mkdirSync(join(root, "views"));
  for (let i = 0; i < 202; i++) writeFileSync(join(root, "views", `Screen${i}.tsx`), "export function Screen() { return null; }");
  const result = run(root);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /among 200 inspected views \(200\)/);
  assert.match(result.stdout, /Uninspected views: 2/);
  assert.match(result.stdout, /not evidence of a broken journey/);
});

test("source traversal enforces its cap within a single directory", (t) => {
  const root = fixture(t);
  for (let i = 0; i < 20003; i++) writeFileSync(join(root, `${i}.js`), "");
  const result = run(root);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /\(20000 source files, capped/);
});

test("large files are counted but explicitly reported unparsed", (t) => {
  const root = fixture(t);
  writeFileSync(join(root, "large.js"), " ".repeat(400001));
  const result = run(root);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /1 oversized/);
});

test("adapter is opt-in and receives focused arguments", (t) => {
  const root = fixture(t);
  mkdirSync(join(root, ".co-planner"));
  writeFileSync(join(root, "thing.js"), "export const thing = 1;");
  writeFileSync(join(root, ".co-planner/map.mjs"), 'console.log("ADAPTER:", process.argv.slice(2).join(","));');
  assert.doesNotMatch(run(root).stdout, /ADAPTER:/);
  const missingFocus = run(root, ["registry-only", "--adapter"]);
  assert.equal(missingFocus.status, 1);
  assert.match(missingFocus.stdout, /ADAPTER: registry-only/);
  for (const args of [["--adapter"], ["thing", "--adapter"]]) {
    const result = run(root, args);
    assert.equal(result.status, 0);
    assert.match(result.stdout, args.length === 2 ? /ADAPTER: thing/ : /ADAPTER:/);
  }
});

test("adapter errors and timeout retain generic output and return failure", (t) => {
  const root = fixture(t);
  mkdirSync(join(root, ".co-planner"));
  const adapter = join(root, ".co-planner/map.mjs");
  assert.equal(run(root, ["--adapter"]).status, 1);
  writeFileSync(adapter, "process.exit(7);");
  let result = run(root, ["--adapter"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /adapter failed \(7\)/);
  assert.match(result.stdout, /# Map/);
  writeFileSync(adapter, "setInterval(() => {}, 1000);");
  result = run(root, ["--adapter"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /ETIMEDOUT/);
  assert.match(result.stdout, /# Map/);
});
