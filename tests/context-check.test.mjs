import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { inspectContext, checkProject } from "../plugins/co-planner/skills/co-planner/scripts/context-check.mjs";

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "co-planner-context-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
}
const block = (kind, text) => `<!-- co-planner:${kind}:start -->\n${text}\n<!-- co-planner:${kind}:end -->`;

test("context checker preserves content and handles Unicode size and local pointers", (t) => {
  const root = fixture(t);
  writeFileSync(join(root, "actual plan.md"), "plan");
  const text = `User-owned preface\n${block("instructions", "Read [plan](<actual plan.md>).\nהקשר")}`;
  writeFileSync(join(root, "AGENTS.md"), text);
  const [report] = checkProject(root);
  assert.deepEqual(report.issues, []);
  assert.equal(report.bytes, Buffer.byteLength(text));
  assert.equal(report.sections[0].lines, 2);
  assert.equal(readFileSync(join(root, "AGENTS.md"), "utf8"), text);
});

test("context checker detects oversized, duplicate, nested and unbalanced sections", (t) => {
  const file = join(fixture(t), "AGENTS.md");
  assert.match(inspectContext(block("instructions", Array(41).fill("rule").join("\n")), file).issues.join(), /soft budget 40/);
  assert.match(inspectContext(block("handoff", "a") + block("handoff", "b"), file).issues.join(), /duplicate/);
  assert.match(inspectContext(block("instructions", block("memory", "nested")), file).issues.join(), /nested/);
  assert.match(inspectContext("<!-- co-planner:handoff:start -->", file).issues.join(), /unclosed/);
  assert.match(inspectContext("<!-- co-planner:memory:end -->", file).issues.join(), /unmatched/);
});

test("context checker reports broken links, ignoring remote links, anchors and fenced examples", (t) => {
  const file = join(fixture(t), "AGENTS.md");
  const text = '[missing](gone.md#section) [remote](https://example.com) [anchor](#top)\n```md\n[example](not-real.md)\n```';
  assert.deepEqual(inspectContext(text, file).issues, ["broken local link: gone.md"]);
});

test("context checker handles missing files, invalid config and custom status", (t) => {
  const root = fixture(t);
  assert.deepEqual(checkProject(root), []);
  assert.match(checkProject(root, ["missing.md"])[0].issues[0], /not found/);
  mkdirSync(join(root, ".co-planner"));
  const config = join(root, ".co-planner/config.json");
  for (const invalid of ["{bad", "null", "[]"]) {
    writeFileSync(config, invalid);
    assert.match(checkProject(root)[0].issues[0], /invalid config/);
  }
  writeFileSync(config, JSON.stringify({ statusFile: "STATUS.md" }));
  assert.match(checkProject(root)[0].issues[0], /not found/);
  writeFileSync(join(root, "STATUS.md"), block("handoff", "Next: test the change."));
  assert.deepEqual(checkProject(root)[0].issues, []);
  writeFileSync(config, JSON.stringify({ statusFile: 1 }));
  assert.match(checkProject(root)[0].issues[0], /must be a string/);
});
