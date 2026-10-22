// Asks one question to several agents in parallel Herdr panes. Each pane gets a different role.
// Usage: node herdr/council.mjs "Should we split the orders service?"
import { execFileSync } from "node:child_process";

const question = process.argv[2];
if (!question) throw new Error('Usage: node herdr/council.mjs "<question>"');

const ROLES = {
  skeptic: "Find the strongest reason this is a bad idea.",
  pragmatist: "Give the smallest change that solves the problem.",
  architect: "Describe the long-term effect on the system design.",
  "user-advocate": "Describe the effect on the people who use the product.",
};
const herdr = (...args) => {
  const out = execFileSync("herdr", args, { encoding: "utf8" }).trim();
  return out ? JSON.parse(out) : {};
};

const workspace = herdr("workspace", "create", "--cwd", process.cwd(), "--label", "council", "--no-focus");
let pane = workspace.result.root_pane.pane_id;
Object.entries(ROLES).forEach(([role, brief], i) => {
  if (i > 0) pane = herdr("pane", "split", pane, "--direction", i % 2 ? "right" : "down", "--no-focus").result.pane.pane_id;
  const prompt = `You are the ${role}. ${brief} Question: ${question} Answer in 150 words or fewer.`;
  herdr("pane", "run", pane, `claude ${JSON.stringify(prompt)}`);
});
console.log('Council started. Run "herdr" to attach and read the four answers.');
