# Writing style: ASD-STE-100

All instructions in this repo follow a subset of ASD-STE-100 (Simplified Technical English). `scripts/ste-lint.mjs` checks rules 1, 2, 3 and 7 on `AGENTS.md` and each `SKILL.md`.

## 1. Short procedure sentences

Write procedure sentences with 20 words or fewer. The lint allows 25, the limit for descriptions.

- Good: "Run `just test` before you commit."
- Bad: "Before committing anything it is generally a good idea to make sure that you have run the full test suite so that nothing breaks."

## 2. Short description sentences

Write description sentences with 25 words or fewer.

- Good: "APM installs each dependency at the commit in `apm.yml`."
- Bad: "APM, which is the package manager from Microsoft that we use here, installs each dependency, pinning it at whatever commit hash is written in the manifest file."

## 3. Active voice

Name who does the action.

- Good: "The script deletes the temp folder."
- Bad: "The temp folder is deleted."

## 4. One instruction per sentence

- Good: "Stage the files. Then commit."
- Bad: "Stage the files and then commit and push."

## 5. One meaning per word

Use one word for one thing. Do not change words for variety.

- Good: "Install the skill. The skill loads at start."
- Bad: "Install the skill. The capability loads at start."

## 6. Imperative for instructions

- Good: "Read `docs/adr/` first."
- Bad: "You should probably read the ADRs first."

## 7. No em dashes

Use a period, a comma or a colon.

- Good: "APM deploys to two targets: Claude Code and Codex."
- Bad: "APM deploys to two targets [em dash] Claude Code and Codex."

## 8. Short noun clusters

Use three nouns or fewer in a row.

- Good: "the token limit for skill descriptions"
- Bad: "the skill description token budget limit"
