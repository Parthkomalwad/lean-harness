// One runnable check for the lint logic.
import assert from "node:assert";
import { lint } from "./ste-lint.mjs";
import { description, tokens } from "./lib.mjs";

assert.deepEqual(lint("Run the tests."), []);
assert.match(lint(`Use a comma ${String.fromCharCode(0x2014)} not this.`)[0], /em dash/);
assert.match(lint("The file is deleted by the script.")[0], /passive/);
assert.match(lint(Array(30).fill("word").join(" ") + ".")[0], /30 words/);
assert.deepEqual(lint("```\n" + Array(30).fill("x").join(" ") + "\n```"), []);
assert.equal(description("---\nname: a\ndescription: Use it.\n---"), "Use it.");
assert.equal(tokens("abcd"), 1);
console.log("selftest passed");
