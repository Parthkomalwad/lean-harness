# Notes on sources

Step 1 of BRIEF.md. Read on 2026-10-22.

## Old harness (Parthkomalwad/agentic-harness)

- 19 local packs under `plugins/`, 6 upstream packs referenced from `marketplace.json`.
- Most packs hold 1 skill. `ui-pack` holds 4, `glassbox` 3, `core` and `deploy-pack` 2.
- Only `council-pack` (4) and `glassbox` (1) define agents.
- Hooks: `harness-band`, `memory-pack`, `research-pack`, `security-pack`.
- Scripts: `build-docs.mjs`, `validate.mjs`, `cloud-setup.sh`. Templates: `methodology`, `minimal`, `ui`.

## APM (microsoft.github.io/apm)

- Install on Windows: `irm https://aka.ms/apm-windows | iex`. On Unix: `curl -sSL https://aka.ms/apm-unix | sh`.
- `apm.yml` fields: `name`, `version`, `targets`, `dependencies.apm`, `dependencies.mcp`.
- A dependency is `owner/repo`, `owner/repo#ref`, or `{git, path, ref}`.
- Lockfile: `apm.lock.yaml`. Installed packages go to `apm_modules/`.
- Local primitives live in `.apm/skills/`, `.apm/prompts/`, `.apm/instructions/`, `.apm/agents/`, `.apm/hooks/`.
- `apm compile` writes per-target output. `apm audit` scans for hidden Unicode and drift. `apm audit --ci` is the CI gate.
- Target names: `copilot`, `claude`, `cursor`, `codex`, `gemini`, `opencode`, `windsurf`, `kiro`, `grok-build`, `antigravity`, `agent-skills`, `hermes`, `intellij`, `grok-bot`.
- Compiled files: `CLAUDE.md` for `claude`, `AGENTS.md` for `codex`, `GEMINI.md` for `gemini`.

## Herdr (herdr.dev)

- Terminal multiplexer for agents. Panes keep running after detach.
- Install on Windows: `powershell -ExecutionPolicy Bypass -c "irm https://herdr.dev/install.ps1 | iex"`.
- Config: `%APPDATA%\herdr\config.toml` or `~/.config/herdr/config.toml`. Keys, theme and UI only. No layout file.
- Layouts are scripted with the CLI: `herdr workspace create --cwd <dir> --label <name>`, `herdr pane split <id> --direction right`, `herdr pane run <id> <command>`.
- `herdr integration install claude` adds native session restore for Claude Code.

## ASD-STE-100

- Procedures: 20 words or fewer per sentence. Descriptions: 25 words or fewer.
- Active voice. Imperative for instructions. One instruction per sentence.
- One word has one meaning. Use approved words. Noun clusters of 3 words or fewer.

## Conflicts with the brief

1. APM compiles `CLAUDE.md` for the `claude` target. The brief wants a hand-written `CLAUDE.md` that imports `AGENTS.md`. Decide which one owns `CLAUDE.md`.
2. Herdr has no layout file. "Herdr config" becomes a script that calls the Herdr CLI.
3. `apm`, `just` and `herdr` are not installed on this machine.
