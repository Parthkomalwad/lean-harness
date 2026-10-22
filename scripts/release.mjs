// Prints release notes since the last tag. With "tag", it also creates the tag from apm.yml.
// Usage: node scripts/release.mjs [tag]
import { execSync } from "node:child_process";
import { read } from "./lib.mjs";

const sh = (cmd) => execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
const version = read("apm.yml").match(/^version:\s*(.+)$/m)[1].trim();
let last = "";
try { last = sh("git describe --tags --abbrev=0"); } catch {}
const range = last ? `${last}..HEAD` : "HEAD";
let log = "";
try { log = sh(`git log ${range} --pretty=format:%s`); } catch {}

const groups = { Added: /^feat/, Fixed: /^fix/, Changed: /^(refactor|perf|chore|docs|ci|build)/ };
console.log(`## v${version}\n`);
for (const [title, pattern] of Object.entries(groups)) {
  const lines = log.split("\n").filter((l) => pattern.test(l));
  if (lines.length) console.log(`### ${title}\n${lines.map((l) => `- ${l}`).join("\n")}\n`);
}

if (process.argv[2] === "tag") {
  sh(`git tag -a v${version} -m "v${version}"`);
  console.log(`Created tag v${version}. Push it with: git push origin v${version}`);
}
