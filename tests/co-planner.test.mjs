// node --test tests/  (no dependencies)
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const skill = join(here, "../plugins/co-planner/skills/co-planner");
const { checkText } = await import(join(skill, "scripts/rtl-check.mjs"));

test("rtl-check passes the shipped Hebrew files", () => {
  const files = [...readdirSync(join(skill, "templates/he")).map((f) => join(skill, "templates/he", f)), join(here, "../README.he.md"), join(here, "../how-to-use.he.md")];
  for (const f of files) assert.deepEqual(checkText(readFileSync(f, "utf8")), [], f);
});

test("rtl-check reports each kind of violation", () => {
  const bad = ['<div dir="rtl">', "", "# כותרת תקינה", "", "`map.mjs` מוצא רכיבים", "- Spread למשפחה", "3 מסלולים בגל", "הקובץ הוא `config.json`.", "```", "code", "```", "", "</div>"].join("\n");
  const lines = checkText(bad).map(([n]) => n);
  assert.deepEqual(lines, [5, 6, 7, 8, 9]);
  assert.equal(checkText("plain English, no Hebrew").length, 0);
  assert.ok(checkText("שורה בלי עטיפה").some(([, m]) => m.includes('<div dir="rtl">')));
});

test("map finds families, views and the state they share", () => {
  const out = execFileSync(process.execPath, [join(skill, "scripts/map.mjs")], { cwd: join(here, "fixture-app"), encoding: "utf8" });
  assert.match(out, /stores found: useCart, useUser|stores found: useUser, useCart/);
  assert.match(out, /CartPage\.tsx: useCart\(w\)/);
  assert.match(out, /useCart \(src\/state\/cart\.ts\): 2 views/);
  assert.match(out, /Views with no detected shared store among 3 inspected views \(1\)/);
  const one = execFileSync(process.execPath, [join(skill, "scripts/map.mjs"), "CheckoutPage"], { cwd: join(here, "fixture-app"), encoding: "utf8" });
  assert.match(one, /imports: src\/state\/cart/);
  assert.equal(spawnSync(process.execPath, [join(skill, "scripts/map.mjs"), "nothing-here"], { cwd: join(here, "fixture-app") }).status, 1);
});
