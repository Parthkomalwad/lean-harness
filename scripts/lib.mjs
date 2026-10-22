import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

// ponytail: chars/4 estimate, swap for a real tokenizer if the budget gets tight
export const tokens = (text) => Math.ceil(text.length / 4);

export const read = (path) => readFileSync(path, "utf8");

// Every SKILL.md under a folder, recursive.
export function skillFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return skillFiles(path);
    return name === "SKILL.md" ? [path] : [];
  });
}

// The frontmatter description: the only part of a skill an agent always loads.
export function description(skillText) {
  const match = skillText.match(/^description:\s*(.+)$/m);
  return match ? match[1].trim() : "";
}
