// Runs each task in evals/tasks with and without the skill it tests, then writes a results table.
// Usage: node scripts/eval.mjs [--smoke] [--regrade] [--agent claude|codex] [--runs N] [--concurrency N]
import { readdirSync, mkdtempSync, cpSync, rmSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawn } from "node:child_process";
import { read } from "./lib.mjs";

const AGENTS = {
  // The prompt goes on stdin, so the shell never splits it.
  claude: ["claude", ["-p", "--setting-sources", "project", "--strict-mcp-config"]],
  codex: ["codex", ["exec", "--skip-git-repo-check", "-"]],
};
const agent = process.argv.includes("--agent") ? process.argv[process.argv.indexOf("--agent") + 1] : "claude";
const smoke = process.argv.includes("--smoke");
// --regrade scores the saved output in evals/results/raw again, without new agent runs.
const regrade = process.argv.includes("--regrade");
const flag = (name, fallback) => (process.argv.includes(name) ? Number(process.argv[process.argv.indexOf(name) + 1]) : fallback);
const RUNS = flag("--runs", 1);
const CONCURRENCY = flag("--concurrency", 4);

const tasks = readdirSync("evals/tasks").filter((f) => f.endsWith(".json")).map((f) => {
  const task = JSON.parse(read(join("evals/tasks", f)));
  task.id = f.replace(".json", "");
  for (const key of ["skill", "prompt", "must", "must_not"]) if (!(key in task)) throw new Error(`${f}: missing ${key}`);
  task.must.concat(task.must_not).forEach((p) => toRegex(p));
  return task;
});

function toRegex(pattern) {
  const flags = pattern.startsWith("(?i)") ? "imu" : "mu";
  return new RegExp(pattern.replace("(?i)", ""), flags);
}

if (smoke) {
  if (!existsSync(".claude/skills") && !existsSync(".agents/skills")) console.warn("Run apm install first for a full eval.");
  console.log(`Eval smoke test passed: ${tasks.length} tasks parse`);
  process.exit(0);
}

// A temp project with the harness files, minus the piece under test when "without" is set.
function workspace(skill, without) {
  const dir = mkdtempSync(join(tmpdir(), "lean-eval-"));
  for (const path of ["AGENTS.md", "CLAUDE.md", ".claude", ".agents", ".codex", "docs/adr"]) {
    if (existsSync(path)) cpSync(path, join(dir, path), { recursive: true });
  }
  if (without && skill === "agents-md") ["AGENTS.md", "CLAUDE.md"].forEach((f) => rmSync(join(dir, f), { force: true }));
  if (without && skill !== "agents-md") [".claude/skills", ".agents/skills"].forEach((d) => rmSync(join(dir, d, skill), { recursive: true, force: true }));
  return dir;
}

// An empty answer or a usage-limit message is not a result. It counts as missing, not as a fail.
const INVALID = /^$|^You.ve hit your .*limit/i;
const grade = (task, out) => INVALID.test(out.trim()) ? null : task.must.every((p) => toRegex(p).test(out)) && !task.must_not.some((p) => toRegex(p).test(out));
const rawPath = (task, without, r) => `evals/results/raw/${agent}/${task.id}-${without ? "without" : "with"}-r${r}.txt`;

// Runs the agent once and resolves with its stdout.
function runAgent(dir, prompt) {
  const [cmd, args] = AGENTS[agent];
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd: dir, shell: process.platform === "win32" });
    let out = "";
    const timer = setTimeout(() => child.kill(), 300000);
    child.stdout.on("data", (d) => (out += d));
    child.on("error", (e) => { clearTimeout(timer); resolve(String(e)); });
    child.on("close", () => { clearTimeout(timer); resolve(out.trim()); });
    child.stdin.end(prompt);
  });
}

async function run(task, without, r) {
  if (regrade) return grade(task, read(rawPath(task, without, r)));
  const dir = workspace(task.skill, without);
  const out = await runAgent(dir, task.prompt);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(`evals/results/raw/${agent}`, { recursive: true });
  writeFileSync(rawPath(task, without, r), out);
  return grade(task, out);
}

// Every (task, with/without, run) job, run CONCURRENCY at a time.
const jobs = tasks.flatMap((task) => [false, true].flatMap((without) => Array.from({ length: RUNS }, (_, i) => ({ task, without, r: i + 1 }))));
const results = new Map();
let next = 0;
async function worker() {
  while (next < jobs.length) {
    const job = jobs[next++];
    const pass = await run(job.task, job.without, job.r);
    const key = `${job.task.id}:${job.without}`;
    const prev = results.get(key) ?? { pass: 0, n: 0 };
    if (pass !== null) results.set(key, { pass: prev.pass + pass, n: prev.n + 1 });
    else results.set(key, prev);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const rows = [];
const bySkill = {};
for (const task of tasks) {
  const w = results.get(`${task.id}:false`), wo = results.get(`${task.id}:true`);
  const cell = (x) => (x.n ? `${x.pass}/${x.n}` : "n/a");
  rows.push(`| ${task.id} | ${task.skill} | ${cell(w)} | ${cell(wo)} |`);
  // Only tasks with valid runs on both sides count toward the summary.
  if (!w.n || !wo.n) continue;
  const s = (bySkill[task.skill] ??= { with: 0, without: 0, wn: 0, won: 0 });
  s.wn += w.n; s.won += wo.n; s.with += w.pass; s.without += wo.pass;
}

const pct = (a, n) => `${Math.round((a / n) * 100)}%`;
const summary = Object.entries(bySkill).map(([skill, s]) => `| ${skill} | ${s.with}/${s.wn} (${pct(s.with, s.wn)}) | ${s.without}/${s.won} (${pct(s.without, s.won)}) | ${Math.round((s.with / s.wn - s.without / s.won) * 100)} points |`);
const report = [
  `# Eval results: ${agent}`, "", `${RUNS} runs per task. "n/a" means no valid run, for example a usage limit. Run on ${new Date().toISOString().slice(0, 10)}.`, "",
  "| Piece | With | Without | Gain |", "|---|---|---|---|", ...summary, "",
  "| Task | Skill | With | Without |", "|---|---|---|---|", ...rows, "",
].join("\n");
mkdirSync("evals/results", { recursive: true });
writeFileSync(`evals/results/${agent}.md`, report);
console.log(report);
