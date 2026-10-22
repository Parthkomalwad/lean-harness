<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/hero-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="docs/assets/hero-light.svg">
  <img src="docs/assets/hero-dark.svg" alt="On the left, the 25 packs of agentic-harness v1, dimmed. An arrow points to five layers of lean-harness v2: AGENTS.md, apm.yml, herdr, justfile and CI, evals. Always-loaded text drops from 1,782 to 454 tokens." width="900">
</picture>

<br>

### A lean, agent-agnostic harness. Only what the model does not already know.

[![check](https://github.com/Parthkomalwad/lean-harness/actions/workflows/check.yml/badge.svg)](https://github.com/Parthkomalwad/lean-harness/actions/workflows/check.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-D97757?labelColor=1F1E1D)](LICENSE)
[![APM](https://img.shields.io/badge/Microsoft_APM-claude_%7C_codex-D97757?labelColor=1F1E1D)](https://microsoft.github.io/apm/)
[![Always loaded](https://img.shields.io/badge/always_loaded-75%25_smaller-D97757?labelColor=1F1E1D)](#old-vs-new)

[Install](#install) · [Old vs new](#old-vs-new) · [Evals](#eval-results) · [Why lean](docs/adr/0001-why-lean.md) · [Migration](docs/migration.md)

</div>

<br>

## Where this came from

[agentic-harness](https://github.com/Parthkomalwad/agentic-harness) was v1: 25 packs of skills, agents and hooks for Claude Code, each off until needed. It taught me what a harness is for. It also taught me that current models already know most of what those packs said, and that a harness locked to one agent is hard to keep.

lean-harness is v2. It keeps only the delta, and moves everything else to the layer where it belongs.

## Old vs new

| Layer | agentic-harness (v1) | lean-harness (v2) |
|---|---|---|
| Knowledge | 25 packs of skills | `AGENTS.md` with only the delta, in ASD-STE-100 |
| Dependencies | Upstream packs in my marketplace | Pinned in `apm.yml`, installed by [Microsoft APM](https://microsoft.github.io/apm/) |
| Runtime | Orchestrator and memory skills | [Herdr](https://herdr.dev/docs/) panes, plain files for memory |
| Enforcement | Claude Code hooks | Scripts, git hooks and CI |
| Proof | None | An eval suite that measures each piece |
| Agents | Claude Code only | Claude Code and Codex |

Always-loaded text, measured by `just budget`: **1,782 tokens** in v1 with all packs on, **454 tokens** in v2.

## Install

You need [APM](https://microsoft.github.io/apm/getting-started/installation/), [just](https://github.com/casey/just) and Node.js 20 or later. [Herdr](https://herdr.dev/docs/install/) is optional.

```sh
git clone https://github.com/Parthkomalwad/lean-harness
cd lean-harness
apm install      # deploys skills to .claude/ and .agents/
just setup       # turns on the pre-commit hook
just test
```

### Use it in your own project

```sh
apm install Parthkomalwad/lean-harness#v0.1.0
```

This installs the `ui-taste` skill and the four pinned upstream skills, for Claude Code, Codex or any other APM target. Copy `AGENTS.md` for the rules. To add your own skills, plugins or MCP servers, see [docs/extending.md](docs/extending.md).

### Open it in Herdr

```sh
just herdr
```

This starts Claude Code and Codex side by side in one Herdr workspace. Run `herdr` to attach. See [herdr/README.md](herdr/README.md) for the multi-agent council.

## What is in it

| Path | Job |
|---|---|
| [`AGENTS.md`](AGENTS.md) | My preferences for writing, git, code and tests. Every agent reads it. |
| [`CLAUDE.md`](CLAUDE.md) | One line that imports `AGENTS.md`. |
| [`apm.yml`](apm.yml) | Upstream skills, pinned to a commit. |
| [`.apm/skills/ui-taste`](.apm/skills/ui-taste/SKILL.md) | The one local skill: my UI rules. |
| [`justfile`](justfile) | `deploy`, `test`, `release`, `eval`, `budget`, `herdr`. |
| [`evals/`](evals/) | Ten tasks, run with and without each piece. |
| [`docs/adr/`](docs/adr/) | Decisions. Memory that any agent can read. |

## Supported agents

APM deploys to the targets in `apm.yml`: `claude` (Claude Code) and `codex` (Codex). APM supports more targets, for example `copilot`, `gemini`, `opencode`, `windsurf` and `kiro`. See the [APM targets matrix](https://microsoft.github.io/apm/reference/targets-matrix/). The `cursor` target is off for now: the superpowers hooks clash with it. [ADR-0001](docs/adr/0001-why-lean.md) has the details.

## Eval results

`just eval` runs each task in a clean folder twice: with the piece under test, and without it. A task passes when the output matches its checks.

<!-- eval:start -->
Claude Code, one run per task, 2026-10-23:

| Piece | With | Without | Gain |
|---|---|---|---|
| `AGENTS.md` | 5/5 | 4/5 | +1 |
| `ui-taste` skill | 5/5 | 4/5 | +1 |

What made the difference:

- Without `AGENTS.md`, the commit message got a `Co-Authored-By` trailer for the AI. With it, no trailer.
- Without `ui-taste`, the page review missed the "too many competing actions" problem.

Most tasks pass both ways. That is the point of this repo: a current model already does most things well, so the harness holds only the small delta. Ten tasks and one run are a small sample. Add real tasks to `evals/tasks/` to make it stronger.
<!-- eval:end -->

Full table: [evals/results/claude.md](evals/results/claude.md).

## Read more

- [ADR-0001: why lean](docs/adr/0001-why-lean.md)
- [Migration: what happened to each v1 pack](docs/migration.md)
- [Writing style: ASD-STE-100](docs/style-ste.md)
- [Extending: add skills, plugins and MCP servers](docs/extending.md)
- [Evaluating AGENTS.md](https://arxiv.org/abs/2602.11988) (ETH Zurich, 2026): context files help most when they hold non-standard practices. This repo applies that finding.

## Notes

- Not affiliated with or endorsed by Anthropic, Microsoft or OpenAI.
- [MIT](LICENSE). Upstream skills keep their own licenses.
