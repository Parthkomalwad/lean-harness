// Checks AGENTS.md and every local SKILL.md against the rules in docs/style-ste.md.
// Usage: node scripts/ste-lint.mjs [files...]
import { existsSync } from "node:fs";
import { read, skillFiles } from "./lib.mjs";

const MAX_WORDS = 25;
const PASSIVE = /\b(is|are|was|were|be|been|being)\s+(\w+ed|done|made|given|taken|shown|written|known|seen|built|run|set|kept)\b/i;
const EM_DASH = String.fromCharCode(0x2014);

export function lint(text) {
  const problems = [];
  // Drop code blocks, inline code, frontmatter and table rows before counting.
  const prose = text
    .replace(/^---[\s\S]*?^---$/m, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "code")
    .split("\n")
    .filter((line) => !line.trim().startsWith("|"));
  prose.forEach((line, i) => {
    if (line.includes(EM_DASH)) problems.push(`line ${i + 1}: em dash`);
    for (const sentence of line.replace(/^[\s#>*-]*(\d+\.)?\s*/, "").split(/(?<=[.!?:])\s+/)) {
      const words = sentence.split(/\s+/).filter(Boolean).length;
      if (words > MAX_WORDS) problems.push(`line ${i + 1}: ${words} words: "${sentence.slice(0, 50)}..."`);
      if (PASSIVE.test(sentence)) problems.push(`line ${i + 1}: passive voice: "${sentence.match(PASSIVE)[0]}"`);
    }
  });
  return problems;
}

if (process.argv[1].endsWith("ste-lint.mjs")) {
  const args = process.argv.slice(2);
  const files = args.length ? args : ["AGENTS.md", ...skillFiles(".apm/skills")];
  let failed = false;
  for (const file of files.filter(existsSync)) {
    const problems = lint(read(file));
    for (const problem of problems) console.error(`${file}: ${problem}`);
    failed ||= problems.length > 0;
  }
  if (failed) process.exit(1);
  console.log(`STE lint passed: ${files.length} files`);
}
