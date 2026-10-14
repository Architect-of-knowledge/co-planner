#!/usr/bin/env node
// co-planner map: a cheap, read-only picture of a project as families of components, the views a user sees,
// and the shared state those views touch. Run from the project root:
//   node map.mjs            the whole map
//   node map.mjs <name>     one component: matching files, what they import, and who imports them
// If the project has `.co-planner/map.mjs`, it runs afterwards as the project's own, richer adapter.
// No dependencies. JS/TS (React, Vue, Svelte) and Python are understood; other files are counted only.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const SKIP = new Set(["node_modules", ".git", "dist", "build", "out", "coverage", ".next", ".nuxt", ".svelte-kit", "vendor", "target", "__pycache__", ".venv", "venv", ".turbo", ".cache"]);
const CODE = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".vue", ".svelte", ".py"]);
const MAX_FILES = 20000, MAX_BYTES = 400_000;
const isTest = (f) => /(\.|_)(test|spec)\.[a-z]+$|(^|\/)(tests?|__tests__|spec)\//.test(f);

function walk(dir, out = []) {
  if (out.length >= MAX_FILES) return out;
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (e.name.startsWith(".") && e.name !== ".co-planner") continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) { if (!SKIP.has(e.name)) walk(p, out); }
    else if (CODE.has(extname(e.name))) out.push(relative(ROOT, p));
  }
  return out;
}
const files = walk(ROOT).filter((f) => !isTest(f) && !f.startsWith(".co-planner/"));
const text = new Map();
const read = (f) => { if (!text.has(f)) { let t = ""; try { if (statSync(f).size <= MAX_BYTES) t = readFileSync(f, "utf8"); } catch { /* unreadable: counted, not parsed */ } text.set(f, t); } return text.get(f); };

// ---------- families: workspace packages, else top-level source folders ----------
function workspaces() {
  try {
    const pkg = JSON.parse(readFileSync("package.json", "utf8"));
    const globs = Array.isArray(pkg.workspaces) ? pkg.workspaces : pkg.workspaces?.packages ?? [];
    return globs.flatMap((g) => g.endsWith("/*") ? (existsSync(g.slice(0, -2)) ? readdirSync(g.slice(0, -2)).map((d) => join(g.slice(0, -2), d)) : []) : [g]).filter((d) => existsSync(join(d, "package.json")));
  } catch { return []; }
}
const roots = workspaces();
// A family is a folder under the package's source root; a family over SPLIT files is split one level deeper.
const SPLIT = 60;
const familyAt = (f, depth) => {
  const ws = roots.find((r) => f === r || f.startsWith(r + "/"));
  const parts = (ws ? relative(ws, f) : f).split("/");
  const srcAt = parts[0] === "src" || parts[0] === "lib" || parts[0] === "app" ? 1 : 0;
  const dirs = parts.slice(srcAt, -1).slice(0, depth);
  const group = dirs.length ? dirs.join("/") : "(root files)";
  return ws ? `${ws} › ${group}` : group;
};
const depthOf = new Map();
for (let depth = 1; depth <= 3; depth++) {
  const counts = new Map();
  for (const f of files) if ((depthOf.get(f) ?? 1) === depth) { const k = familyAt(f, depth); counts.set(k, (counts.get(k) ?? 0) + 1); }
  for (const f of files) if ((depthOf.get(f) ?? 1) === depth && (counts.get(familyAt(f, depth)) ?? 0) > SPLIT && familyAt(f, depth + 1) !== familyAt(f, depth)) depthOf.set(f, depth + 1);
}
const familyOf = (f) => familyAt(f, depthOf.get(f) ?? 1);
const exportsOf = (t) => [...t.matchAll(/export\s+(?:default\s+)?(?:async\s+)?(?:function\*?|const|let|class|interface|type|enum)\s+([A-Za-z_$][\w$]*)/g)].map((m) => m[1])
  .concat([...t.matchAll(/^(?:def|class)\s+([A-Za-z_]\w*)/gm)].map((m) => m[1]).filter((n) => !n.startsWith("_")));

// ---------- views and shared state ----------
const VIEW_DIR = /(^|\/)(pages?|views?|screens?|routes?|windows?|panels?|dialogs?|layouts?)\//i;
const isView = (f) => /\.(tsx|jsx|vue|svelte)$/.test(f) && (VIEW_DIR.test(f) || /(Page|View|Screen|Window|Panel|Dialog)\.(tsx|jsx|vue|svelte)$/.test(f));
// Stores: zustand, redux toolkit, pinia, svelte stores, jotai/recoil atoms, signals, React contexts.
const STORE_DEF = /export\s+const\s+([A-Za-z_$][\w$]*)\s*(?::[^=]+)?=\s*(?:create|createStore|createSlice|configureStore|defineStore|writable|readable|derived|atom|selector|signal|createContext|createSignal|reactive|ref)\s*[(<]/g;
const stores = new Map(); // name -> defining file
for (const f of files) for (const m of read(f).matchAll(STORE_DEF)) if (!stores.has(m[1])) stores.set(m[1], f);
const touches = (t, s) => new RegExp(`\\b${s.replace(/\$/g, "\\$")}\\b`).test(t);
const writes = (t, s) => new RegExp(`\\b${s.replace(/\$/g, "\\$")}\\s*\\.\\s*(setState|set|update|dispatch|\\$patch)\\b|\\b${s.replace(/\$/g, "\\$")}\\.getState\\(\\)\\.(set|add|remove|update|toggle|select|open|commit|apply)\\w*`).test(t);

// ---------- one component ----------
const focus = process.argv[2];
if (focus) {
  const hits = files.filter((f) => f.toLowerCase().includes(focus.toLowerCase()) || exportsOf(read(f)).includes(focus));
  if (!hits.length) { console.error(`map: nothing matches "${focus}"`); process.exit(1); }
  const importsOf = (f) => [...read(f).matchAll(/(?:import|export)[^'"]*?from\s*['"](\.[^'"]+)['"]|require\(\s*['"](\.[^'"]+)['"]\s*\)/g)].map((m) => relative(ROOT, resolve(dirname(f), m[1] ?? m[2])));
  for (const f of hits.slice(0, 12)) {
    const stem = f.replace(/\.[^.]+$/, "");
    const by = files.filter((g) => g !== f && importsOf(g).some((i) => i === stem || i === f || i.replace(/\.[^.]+$/, "") === stem));
    console.log(`${f}  [${familyOf(f)}]`);
    console.log(`  exports: ${exportsOf(read(f)).slice(0, 15).join(", ") || "-"}`);
    console.log(`  imports: ${importsOf(f).slice(0, 15).join(", ") || "-"}`);
    console.log(`  imported by (${by.length}): ${by.slice(0, 15).join(", ")}${by.length > 15 ? " …" : ""}`);
    const st = [...stores.keys()].filter((s) => touches(read(f), s));
    if (st.length) console.log(`  state: ${st.map((s) => (writes(read(f), s) ? `${s}(w)` : s)).join(", ")}`);
  }
  process.exit(0);
}

// ---------- the whole map ----------
const fam = new Map();
for (const f of files) { const k = familyOf(f); const v = fam.get(k) ?? { files: 0, exports: 0, views: 0 }; v.files++; v.exports += exportsOf(read(f)).length; if (isView(f)) v.views++; fam.set(k, v); }
console.log(`# Map of ${basename(ROOT)}  (${files.length} source files${files.length >= MAX_FILES ? ", capped" : ""}; tests skipped)\n`);
console.log("## Families (component groups: workspace package › folder)");
for (const [k, v] of [...fam].sort((a, b) => a[0].localeCompare(b[0]))) console.log(`  ${k}  files=${v.files}  exports=${v.exports}${v.views ? `  views=${v.views}` : ""}`);

const views = files.filter(isView);
console.log(`\n## Views (${views.length}) and the shared state each touches  (w = writes)`);
console.log(`   stores found: ${stores.size ? [...stores.keys()].join(", ") : "none (no zustand/redux/pinia/svelte/atom/signal/context exports detected)"}`);
const usedBy = new Map();
for (const v of views.slice(0, 200)) {
  const t = read(v);
  const st = [...stores.keys()].filter((s) => stores.get(s) !== v && touches(t, s));
  for (const s of st) (usedBy.get(s) ?? usedBy.set(s, []).get(s)).push(v);
  console.log(`  ${v}: ${st.map((s) => (writes(t, s) ? `${s}(w)` : s)).join(", ") || "(none)"}`);
}
if (views.length > 200) console.log(`  … ${views.length - 200} more views`);
console.log("\n## State shared by 2+ views (the channels views can hand off through)");
const shared = [...usedBy].filter(([, vs]) => vs.length > 1).sort((a, b) => b[1].length - a[1].length);
for (const [s, vs] of shared) console.log(`  ${s} (${stores.get(s)}): ${vs.length} views`);
if (!shared.length) console.log("  none");
const lonely = views.filter((v) => ![...usedBy.values()].some((vs) => vs.length > 1 && vs.includes(v)));
if (views.length) console.log(`\nViews sharing no store with another view (${lonely.length}): in a journey that crosses two of them, a handoff is likely missing.`);

const adapter = join(ROOT, ".co-planner", "map.mjs");
if (existsSync(adapter)) {
  console.log("\n## Project adapter (.co-planner/map.mjs)");
  const r = spawnSync(process.execPath, [adapter, ...process.argv.slice(2)], { stdio: "inherit" });
  if (r.status) console.log(`(adapter exited ${r.status})`);
}
