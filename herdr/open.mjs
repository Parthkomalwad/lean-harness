// Opens a Herdr workspace with Claude Code on the left and Codex on the right.
// Usage: node herdr/open.mjs [left-command] [right-command]
import { execFileSync } from "node:child_process";

const [left = "claude", right = "codex"] = process.argv.slice(2);
const herdr = (...args) => {
  const out = execFileSync("herdr", args, { encoding: "utf8" }).trim();
  return out ? JSON.parse(out) : {};
};

const workspace = herdr("workspace", "create", "--cwd", process.cwd(), "--label", "lean-harness", "--no-focus");
const leftPane = workspace.result.root_pane.pane_id;
const rightPane = herdr("pane", "split", leftPane, "--direction", "right", "--no-focus").result.pane.pane_id;

herdr("pane", "run", leftPane, left);
herdr("pane", "run", rightPane, right);
console.log(`Opened ${left} and ${right}. Run "herdr" to attach.`);
