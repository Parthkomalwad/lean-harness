# ADR-0001: Replace the pack harness with a lean harness

- Status: Accepted
- Date: 2026-10-23

## Context

[agentic-harness](https://github.com/Parthkomalwad/agentic-harness) was v1. It had 25 packs of skills, agents, workflows and hooks for Claude Code. Each pack stayed off until a project needed it. It worked, and it showed four limits:

1. **Models caught up.** Current models already know testing, architecture and deployment. Skills that teach these again cost tokens and add noise.
2. **It worked only in Claude Code.** The plugin marketplace is specific to one agent. Codex, Cursor and other agents could not use it.
3. **I maintained copies.** Six packs were other people's work, listed in my marketplace.
4. **Runtime lived in prompts.** Sessions, memory and multi-agent work were skills, not infrastructure.

## Decision

Build a new repo, lean-harness. It keeps only the delta: facts and preferences that a current model does not know. Each other concern moves to the correct layer.

| Concern | Layer |
|---|---|
| Knowledge | `AGENTS.md`, in ASD-STE-100 style |
| Dependencies | `apm.yml`, installed by Microsoft APM |
| Runtime | Herdr panes |
| Memory | Plain files: `docs/adr/` and `NOTES.md` |
| Enforcement | Scripts, git hooks and CI |
| Proof | An eval suite |

Details:

- `AGENTS.md` is the source. `CLAUDE.md` holds one line that imports it. We do not run `apm compile`, because it writes its own `CLAUDE.md`.
- APM deploys to the `claude` and `codex` targets. The `cursor` target is off: the superpowers hooks overlap with the Claude hook import in Cursor.
- Herdr has no layout file. Scripts in `herdr/` call the Herdr CLI.

## Consequences

Good:

- Fewer always-loaded tokens. CI fails if `AGENTS.md` and skill descriptions grow past the budget.
- The same setup works in Claude Code and Codex.
- An upstream skill updates when I change one pinned commit in `apm.yml`.
- Each kept skill must show a gain in the eval suite.

Bad:

- Three new tools to install: APM, just and Herdr.
- Less help on topics that the model knows only partly. The eval suite must catch these cases.
- Users of v1 must move by hand. v1 stays public and works.

## Alternatives

- **Keep v1 and trim packs.** This keeps the Claude Code lock-in.
- **AGENTS.md only, no APM.** Simple, but upstream skills become copies again.
