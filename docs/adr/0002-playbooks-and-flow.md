# ADR-0002: Workflow playbooks, a flow file and the lean-flow mod

- Status: Accepted
- Date: 2026-10-24

## Context

I work in different modes: hackathons, office work, personal sites, packages and services. Each mode has its own phase order, skills and gates. I had to tell the agent the mode in each session.

## Decision

1. **Phase skills** do one job each: `plan-spec`, `stack-pick`, `cheap-deploy`, `ship-docs`. Playbooks reuse them.
2. **Playbook skills** set the phase order and the gates for one mode: `hackathon`, `office`, `personal-site`, `personal-package`, `personal-service`.
3. **The `flow` skill** picks a playbook, or a mix, and writes `.flow.json` in the project. This file is the single source of truth for the current phase.
4. **The `lean-flow` mod** (Claude Code only) reads `.flow.json`. It shows a picker above the prompt when no flow exists, a pane with the phases, a status line entry and a toast at each phase change. It adds the current phase to the system prompt.
5. `AGENTS.md` tells every agent to use the `flow` skill at the start of a project, so Codex follows the same flow without the mod.

## Consequences

- The mod never writes `.flow.json`. The agent writes it through the skill, so Claude Code and Codex agree on state.
- The mod loads in every session from `CLAUDE_CODE_PLUGIN_DIRS` in `~/.claude/settings.json`.
- The `prompt.compose` hook does not run where an organization manages Claude Code. There, the `AGENTS.md` rule still applies.
- Each skill description adds to the token budget. Ten new descriptions added about 240 tokens.
