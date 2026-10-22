# Herdr

Herdr runs the agents. It keeps sessions alive after you close the terminal. The harness does not use skills for runtime work.

## Install

Windows (PowerShell):

```powershell
powershell -ExecutionPolicy Bypass -c "irm https://herdr.dev/install.ps1 | iex"
```

Linux and macOS:

```sh
curl -fsSL https://herdr.dev/install.sh | sh
```

Then add native session restore for Claude Code:

```sh
herdr integration install claude
```

## Two agents side by side

```sh
just herdr
```

Start Herdr first: run `herdr`, or `herdr server` for a headless server. Then `just herdr` runs `herdr/open.mjs`. The script creates a workspace, starts Claude Code in the left pane and Codex in the right pane. Run `herdr` to attach.

Herdr has no layout file. The script uses the Herdr CLI: `workspace create`, `pane split` and `pane run`.

## Council

The old `council-pack` used four subagents in one session. Here, four real agents run in parallel panes:

```sh
node herdr/council.mjs "Should we split the orders service into two services?"
```

Each pane gets one role: skeptic, pragmatist, architect, user advocate. Read the four answers, then decide. Record the decision as an ADR in `docs/adr/`.
