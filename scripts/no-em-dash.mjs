// Fails if any tracked text file contains an em dash.
import { execSync } from "node:child_process";
import { read } from "./lib.mjs";

const files = execSync("git ls-files", { encoding: "utf8" }).split("\n").filter((f) => /\.(md|mjs|yml|yaml|json|ps1|sh)$|justfile/.test(f));
const bad = files.filter((f) => { try { return read(f).includes(String.fromCharCode(0x2014)); } catch { return false; } });
if (bad.length) {
  console.error(`Em dash found in: ${bad.join(", ")}`);
  process.exit(1);
}
console.log(`No em dashes in ${files.length} files`);
