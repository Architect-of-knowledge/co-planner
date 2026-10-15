#!/usr/bin/env node
// Read-only context hygiene check. No tokenizer or model calls.
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const LIMITS = { instructions: 40, handoff: 80, memory: 12 };

export function inspectContext(text, file) {
  const issues = [];
  const sections = [];
  const marker = /<!--\s*co-planner:(instructions|handoff|memory):(start|end)\s*-->/g;
  let active = null;
  const seen = new Set();
  for (const match of text.matchAll(marker)) {
    const [, kind, edge] = match;
    if (edge === "start") {
      if (active || seen.has(kind)) issues.push(`duplicate or nested ${kind} section`);
      seen.add(kind);
      if (!active) active = { kind, start: match.index, body: match.index + match[0].length };
    } else if (!active || active.kind !== kind) {
      issues.push(`unmatched ${kind} end marker`);
    } else {
      const body = text.slice(active.body, match.index).trim();
      const lines = body ? body.split(/\r?\n/).length : 0;
      sections.push({ kind, lines, bytes: Buffer.byteLength(body) });
      if (lines > LIMITS[kind]) issues.push(`${kind}: ${lines} lines exceeds soft budget ${LIMITS[kind]}`);
      active = null;
    }
  }
  if (active) issues.push(`unclosed ${active.kind} section`);
  // Basic inline Markdown file links; skip fenced examples, URLs and anchors.
  // Reference links and arbitrary HTML are intentionally outside this checker.
  const prose = [];
  let fence = null;
  for (const line of text.split(/\r?\n/)) {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = null;
      continue;
    }
    if (!fence) prose.push(line);
  }
  for (const match of prose.join("\n").matchAll(/\[[^\]\n]*\]\(\s*(<[^>]+>|[^\s)]+)(?:\s+"[^"\n]*")?\s*\)/g)) {
    let target = match[1].replace(/^<|>$/g, "");
    if (!target || target.startsWith("#") || /^[a-z][a-z\d+.-]*:/i.test(target) || target.startsWith("//")) continue;
    target = target.split("#")[0].replace(/:\d+(?::\d+)?$/, "");
    try { target = decodeURIComponent(target); } catch { issues.push(`invalid link encoding: ${target}`); continue; }
    if (target && !existsSync(isAbsolute(target) ? target : resolve(dirname(file), target))) issues.push(`broken local link: ${target}`);
  }
  return { lines: text.split(/\r?\n/).length, bytes: Buffer.byteLength(text), sections, issues };
}

export function checkProject(root, extras = []) {
  const configPath = resolve(root, ".co-planner/config.json");
  let config = {};
  const reports = [];
  if (existsSync(configPath)) {
    try {
      config = JSON.parse(readFileSync(configPath, "utf8"));
      if (!config || Array.isArray(config) || typeof config !== "object") throw new Error("expected a JSON object");
    } catch (error) {
      reports.push({ file: configPath, issues: [`invalid config: ${error.message}`] });
      config = {};
    }
  }
  if (config.statusFile !== undefined && typeof config.statusFile !== "string") {
    reports.push({ file: configPath, issues: ["statusFile must be a string"] });
  }
  const status = typeof config.statusFile === "string" && config.statusFile ? config.statusFile : ".co-planner/handoff.md";
  const defaults = ["CLAUDE.md", ".claude/CLAUDE.md", "AGENTS.md", "AGENTS.override.md", status];
  const required = new Set(extras.map((file) => resolve(root, file)));
  if (typeof config.statusFile === "string" && config.statusFile) required.add(resolve(root, config.statusFile));
  for (const file of new Set([...defaults.map((file) => resolve(root, file)), ...required])) {
    if (!existsSync(file)) {
      if (required.has(file)) reports.push({ file, issues: ["file not found"] });
      continue;
    }
    try {
      if (!statSync(file).isFile()) throw new Error("not a regular file");
      reports.push({ file, ...inspectContext(readFileSync(file, "utf8"), file) });
    } catch (error) { reports.push({ file, issues: [error.message] }); }
  }
  return reports;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(process.argv[2] ?? ".");
  if (!existsSync(root) || !statSync(root).isDirectory()) {
    console.error(`context-check: project directory not found: ${root}`);
    process.exitCode = 1;
  } else {
    const reports = checkProject(root, process.argv.slice(3));
    for (const report of reports) {
      console.log(`${report.file}: ${report.bytes ?? "?"} bytes, ${report.lines ?? "?"} lines`);
      for (const section of report.sections ?? []) console.log(`  ${section.kind}: ${section.lines} lines, ${section.bytes} bytes`);
      for (const issue of report.issues) console.log(`  warning: ${issue}`);
    }
    console.log(reports.length ? "Read-only check; bytes and lines are not token counts." : "No project context files found; nothing changed.");
    if (reports.some((report) => report.issues.length)) process.exitCode = 1;
  }
}
