# Extending lean-harness

Each addition goes to one layer. Each addition must show a gain in the eval suite, or it does not stay.

## Pick the layer

| You want to add | Put it in | Command |
|---|---|---|
| Someone else's skill, plugin or agent | `apm.yml` | `apm install owner/repo#<sha>` |
| An MCP server | `apm.yml`, under `dependencies.mcp` | `apm install` |
| Your own skill | `.apm/skills/<name>/SKILL.md` | `apm install` |
| A rule or preference | `AGENTS.md` | none |
| A fixed procedure | `scripts/` and a `justfile` recipe | `just <recipe>` |
| A rule that must always apply | `.githooks/` or `.github/workflows/` | none |
| A decision | `docs/adr/NNNN-title.md` | none |
| A workflow for one kind of project | `.apm/skills/<playbook>/SKILL.md` | `apm install` |
| A Claude Code UI change | `mods/<name>/` | `claude plugin validate mods/<name>` |

## Add an upstream skill or plugin

1. Find the repo. APM accepts a `SKILL.md` folder, an APM package or a `plugin.json` collection.
2. Get the commit to pin: `git ls-remote https://github.com/owner/repo HEAD`.
3. Run `apm install owner/repo#<sha>`. For a skill in a subfolder, use `owner/repo/path/to/skill#<sha>`.
4. APM adds the line to `apm.yml` and updates `apm.lock.yaml`.
5. Add one or more eval tasks that the skill must help with. See "Prove it" below.
6. Run `just eval`. Keep the skill only if the "With" column wins.

## Add an MCP server

Add the server ID from the MCP registry to `apm.yml`:

```yaml
dependencies:
  mcp:
    - io.github.github/github-mcp-server
```

Then run `apm install`. APM writes the server config for each target.

## Add your own skill

1. Create `.apm/skills/<name>/SKILL.md`.
2. Write a `description` of one sentence. The agent loads it in every session, so it counts against the token budget.
3. Write only what the model does not know: your rules, your banned patterns, your checks.
4. Run `just test`. The STE lint and the token budget must pass.
5. Run `apm install` to deploy it. Then prove it.

## Add a rule to AGENTS.md

1. Add a rule only after an agent gets it wrong.
2. Write one instruction per sentence, in STE style. See `docs/style-ste.md`.
3. Add an eval task that fails without the rule.
4. Keep `AGENTS.md` under 60 lines. Move detail to a skill or a doc, and link it.

## Add a workflow playbook

A playbook is a skill with a phase table: phase, skill, in, out, gate. See `.apm/skills/hackathon/SKILL.md` and ADR-0002.

1. Reuse the phase skills: `plan-spec`, `stack-pick`, `cheap-deploy`, `ship-docs`.
2. Create `.apm/skills/<playbook>/SKILL.md` with the phase table.
3. Add a row for it in the signal table of `.apm/skills/flow/SKILL.md`.
4. Add the name to `PLAYBOOKS` in `mods/lean-flow/hooks/register.tsx`.
5. Run `just test`.

## The lean-flow mod

`mods/lean-flow` shows the flow in Claude Code. It reads `.flow.json` and never writes it.

To load it in every session, add this to `~/.claude/settings.json`:

```json
{ "env": { "CLAUDE_CODE_PLUGIN_DIRS": "~/.claude/lean/mods/lean-flow" } }
```

Then link each new skill into `~/.claude/skills`, as in "Use it in every project". Run `/flow` to open the pane, or `/flow hackathon` to start a playbook.

## Prove it

Create `evals/tasks/NN-name.json`:

```json
{
  "skill": "my-skill",
  "prompt": "The task, as you would type it.",
  "must": ["regex the output must match"],
  "must_not": ["regex the output must not match"]
}
```

Set `skill` to `agents-md` to test `AGENTS.md`, or to the folder name of a skill. Then:

```sh
just eval            # Claude Code
just eval codex      # Codex
```

The script runs each task twice: with the piece, and without it. It writes the table to `evals/results/`. To score saved output again after you change a check, run `node scripts/eval.mjs --regrade`.

## Use lean-harness in your own project

Get the skills and the upstream dependencies:

```sh
apm install Parthkomalwad/lean-harness#v0.2.0
```

Get the rules: copy `AGENTS.md` into your project, then edit it. Add a `CLAUDE.md` with one line: `@AGENTS.md`.

To change the harness itself, fork the repo.

## Use it in every project (Claude Code)

Link the repo and load `AGENTS.md` from your user-level `CLAUDE.md`.

Windows (PowerShell):

```powershell
New-Item -ItemType Junction -Path "$HOME\.claude\lean" -Target "<path to lean-harness>"
New-Item -ItemType Junction -Path "$HOME\.claude\skills\ui-taste" -Target "<path to lean-harness>\.apm\skills\ui-taste"
Set-Content "$HOME\.claude\CLAUDE.md" "@~/.claude/lean/AGENTS.md"
```

Linux and macOS:

```sh
ln -s <path to lean-harness> ~/.claude/lean
ln -s <path to lean-harness>/.apm/skills/ui-taste ~/.claude/skills/ui-taste
echo "@~/.claude/lean/AGENTS.md" > ~/.claude/CLAUDE.md
```

A `git pull` in the repo updates every project.

## Enforce the commit rules in every repo

`.githooks/global/commit-msg` blocks AI attribution and em dashes in commit messages. To use it in every repo on your machine:

```sh
git config --global core.hooksPath ~/.claude/lean/.githooks/global
```

A repo that sets its own `core.hooksPath` (for example with husky) keeps its own hooks.

## Publish a skill to the marketplace

This repo is also an APM marketplace. The `marketplace:` block in `apm.yml` lists the packages.

1. Add the package under `marketplace.packages`, with `name`, `description`, `source`, `version` and `category`.
2. Run `apm marketplace check`.
3. Run `apm pack`. It writes `.claude-plugin/marketplace.json` and `.agents/plugins/marketplace.json`.
4. Commit, then tag with `just release tag` and push the tag.

Consumers then run `/plugin marketplace add Parthkomalwad/lean-harness` in Claude Code, or `apm marketplace add Parthkomalwad/lean-harness` with APM.

## Contribute back

Open a pull request. Include the eval task and the result table that shows the gain. A change without an eval result does not merge.
