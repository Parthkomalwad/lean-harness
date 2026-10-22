// Counts the text every session loads: AGENTS.md, CLAUDE.md and each local skill description.
// Usage: node scripts/budget.mjs [--v1 <old-harness-path>]
import { existsSync } from "node:fs";
import { join } from "node:path";
import { tokens, read, skillFiles, description } from "./lib.mjs";

const LIMIT = 1200;

function measure(root, files, skillDir) {
  let total = 0;
  for (const file of files) {
    const path = join(root, file);
    if (existsSync(path)) total += tokens(read(path));
  }
  for (const skill of skillFiles(join(root, skillDir))) total += tokens(description(read(skill)));
  return total;
}

const v1Index = process.argv.indexOf("--v1");
if (v1Index !== -1) {
  const old = process.argv[v1Index + 1];
  const v1 = measure(old, ["CLAUDE.md"], "plugins");
  const v2 = measure(".", ["AGENTS.md", "CLAUDE.md"], ".apm/skills");
  console.log(`v1 (all packs on): ${v1} tokens`);
  console.log(`v2: ${v2} tokens`);
  console.log(`v2 is ${Math.round((1 - v2 / v1) * 100)}% smaller`);
  process.exit(0);
}

const total = measure(".", ["AGENTS.md", "CLAUDE.md"], ".apm/skills");
console.log(`Always-loaded text: ${total} of ${LIMIT} tokens`);
if (total > LIMIT) {
  console.error("Over budget. Remove text from AGENTS.md or a skill description.");
  process.exit(1);
}
