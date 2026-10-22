// Runs each task in evals/tasks with and without the skill it tests, then writes a results table.
// Usage: node scripts/eval.mjs [--smoke] [--regrade] [--agent claude|codex]
import { readdirSync, mkdtempSync, cpSync, rmSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
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

const grade = (task, out) => task.must.every((p) => toRegex(p).test(out)) && !task.must_not.some((p) => toRegex(p).test(out));
const rawPath = (task, without) => `evals/results/raw/${task.id}-${without ? "without" : "with"}.txt`;

function run(task, without) {
  if (regrade) return { pass: grade(task, read(rawPath(task, without))) };
  const dir = workspace(task.skill, without);
  const [cmd, args] = AGENTS[agent];
  const result = spawnSync(cmd, args, { cwd: dir, input: task.prompt, encoding: "utf8", shell: process.platform === "win32", timeout: 300000 });
  rmSync(dir, { recursive: true, force: true });
  const out = (result.stdout || "").trim();
  mkdirSync("evals/results/raw", { recursive: true });
  writeFileSync(rawPath(task, without), out || result.stderr || String(result.error));
  return { pass: grade(task, out) };
}

const rows = [];
const bySkill = {};
for (const task of tasks) {
  const withIt = run(task, false);
  const withoutIt = run(task, true);
  rows.push(`| ${task.id} | ${task.skill} | ${withIt.pass ? "pass" : "fail"} | ${withoutIt.pass ? "pass" : "fail"} |`);
  const s = (bySkill[task.skill] ??= { with: 0, without: 0, n: 0 });
  s.n++; s.with += withIt.pass; s.without += withoutIt.pass;
  console.log(rows.at(-1));
}

const summary = Object.entries(bySkill).map(([skill, s]) => `| ${skill} | ${s.with}/${s.n} | ${s.without}/${s.n} | ${s.with - s.without >= 0 ? "+" : ""}${s.with - s.without} |`);
const report = [
  `# Eval results: ${agent}`, "", `Run on ${new Date().toISOString().slice(0, 10)}.`, "",
  "| Skill | With | Without | Gain |", "|---|---|---|---|", ...summary, "",
  "| Task | Skill | With | Without |", "|---|---|---|---|", ...rows, "",
].join("\n");
mkdirSync("evals/results", { recursive: true });
writeFileSync(`evals/results/${agent}.md`, report);
console.log(`Wrote evals/results/${agent}.md`);
