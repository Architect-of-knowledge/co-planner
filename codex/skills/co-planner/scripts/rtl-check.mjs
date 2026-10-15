#!/usr/bin/env node
// rtl-check: strict right-to-left checks for Hebrew Markdown files (references/he.md, "Files written in Hebrew").
// Usage: node rtl-check.mjs <file.md>…   Exit 0 when clean, 1 with one line per problem: file:line: message.
// No dependencies. Prose lines are checked; fenced code and HTML lines are skipped.
import { readFileSync } from "node:fs";

const HEB = /[֐-׿]/;
const STRONG = /[A-Za-z֐-׿]/; // the first strong character decides a paragraph's direction
const BIDI = /[‎‏‪-‮⁦-⁩]/;
// Markdown markers that may come before the first word of a line.
const LEAD = /^(\s*(#{1,6}\s+|[-*+]\s+(\[[ xX]\]\s+)?|\d+[.)]\s+|>\s*|\|\s*)|\*\*|__|\*|_|\s)+/;

export function checkText(text) {
  const problems = [];
  const lines = text.split(/\r?\n/);
  const hebrew = HEB.test(text);
  if (!hebrew) return problems;
  const firstContent = lines.findIndex((l) => l.trim() !== "");
  const lastContent = lines.length - 1 - [...lines].reverse().findIndex((l) => l.trim() !== "");
  if (!/^<div dir="rtl">$/.test(lines[firstContent]?.trim() ?? "")) problems.push([firstContent + 1, 'the document must open with <div dir="rtl"> on its own line']);
  if ((lines[lastContent]?.trim() ?? "") !== "</div>") problems.push([lastContent + 1, "the document must close with </div> on its own line"]);
  let fence = null, ltrOpen = false;
  lines.forEach((raw, i) => {
    const n = i + 1, line = raw.trimEnd();
    const f = line.match(/^\s*(```+|~~~+)/);
    if (f) {
      if (fence === null) {
        fence = f[1];
        if (!ltrOpen) problems.push([n, 'wrap this code block in <div dir="ltr"> … </div>']);
      } else if (line.trim().startsWith(fence)) fence = null;
      return;
    }
    if (fence !== null) { if (BIDI.test(line)) problems.push([n, "bidi control character inside a code block"]); return; }
    const t = line.trim();
    if (t === '<div dir="ltr">') { ltrOpen = true; return; }
    if (t === "</div>") { ltrOpen = false; return; }
    if (t === "" || t.startsWith("<") || /^\|?\s*:?-{3,}/.test(t) || /^[-*_]{3,}$/.test(t)) return;
    for (const m of t.matchAll(/`[^`]*`/g)) if (BIDI.test(m[0])) problems.push([n, "bidi control character inside a code span"]);
    // Table rows: check each cell; other lines: the line itself.
    const parts = t.startsWith("|") ? t.split("|").slice(1, -1) : [t];
    for (const part of parts) {
      const body = part.replace(LEAD, "");
      if (!HEB.test(body)) continue; // a cell or line with no Hebrew (a date, a code name) is fine on its own
      const first = body.replace(/^[\s([{"'“”«»]+/, "").match(STRONG);
      const startsCode = /^[\s([{"'“”«»]*`/.test(body);
      if (startsCode || (first && !HEB.test(first[0]))) problems.push([n, `starts with a Latin word, code or tag before the Hebrew ("${body.slice(0, 24)}…"): start with a Hebrew word`]);
      else if (/^[\s([{"'“”«»]*\d/.test(body)) problems.push([n, "starts with a number: start with a Hebrew word"]);
      const end = body.replace(/\s+$/, "");
      if (/(`[^`]*`|[A-Za-z0-9)\]])\s*[.:?!]$/.test(end) && !/[֐-׿][^A-Za-z`]*[.:?!]$/.test(end)) problems.push([n, "ends with a Latin run or code before the final punctuation: end the sentence with a Hebrew word"]);
    }
  });
  return problems;
}

const files = process.argv.slice(2);
if (files.length) {
  let bad = 0;
  for (const f of files) for (const [n, msg] of checkText(readFileSync(f, "utf8"))) { console.log(`${f}:${n}: ${msg}`); bad++; }
  if (bad) { console.log(`\n${bad} problem(s). Rules: references/he.md`); process.exit(1); }
  console.log(`rtl-check: ${files.length} file(s) clean`);
}
