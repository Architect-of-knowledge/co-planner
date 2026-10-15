#!/usr/bin/env node
// A declared read-policy illustration, not an LLM/token benchmark.
import { mkdtempSync, writeFileSync, readFileSync, rmSync, cpSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const root = mkdtempSync(join(tmpdir(), "co-planner-resume-"));
try {
  const files = {
    "handoff.md": "Goal: preserve cart state while improving checkout. Accepted: no change to cart behavior. Next: inspect CartPage and selection rule; no implementation or test results yet. See [rule](cart-rule.md).\n",
    "cart-rule.md": "Accepted rule: preserve existing cart behavior; inspect current source before deciding on changes.\n",
    "taste.md": "Preference: clear labels in account settings. Source: explicit user feedback on profile work.\n",
    "insights.md": "Deferred: combine profile and preferences pages. Reason: outside checkout scope.\n",
    "older-plan.md": "Earlier profile plan: update name validation and profile navigation. Not current checkout scope.\n"
  };
  for (const [file, text] of Object.entries(files)) writeFileSync(join(root, file), text);
  cpSync(fileURLToPath(new URL("../fixture-app/src/views/CartPage.tsx", import.meta.url)), join(root, "CartPage.tsx"));
  const policies = {
    "read-all-topic-notes": [...Object.keys(files), "CartPage.tsx"],
    "handoff-and-relevant-context": ["handoff.md", "cart-rule.md", "CartPage.tsx"]
  };
  for (const [name, paths] of Object.entries(policies)) {
    const contents = paths.map((path) => readFileSync(join(root, path), "utf8"));
    assert.ok(contents.some((text) => text.includes("Accepted rule: preserve existing cart behavior")));
    assert.ok(contents.some((text) => text.includes("export function CartPage")));
    console.log(`${name}: ${paths.length} files, ${contents.reduce((total, text) => total + Buffer.byteLength(text), 0)} bytes`);
  }
  console.log("Declared read sets on one synthetic resume fixture; not measured model token/cost savings or tool-call behavior.");
} finally { rmSync(root, { recursive: true, force: true }); }
