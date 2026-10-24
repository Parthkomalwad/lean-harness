---
name: flow
description: Use at the start of a project or session to pick my workflow playbook and track its phases in .flow.json.
---

# Flow

A flow is one playbook, or a mix of playbooks, for this project. The file `.flow.json` in the project root holds its state.

## Pick a flow

1. If `.flow.json` exists, read it. Continue at the current phase. Do not ask again.
2. Else, read the repo signals and the request. Suggest one playbook with one line of reason.
3. Ask me to confirm. Then write `.flow.json`.

| Signal | Playbook |
|---|---|
| Hackathon, demo day, deadline in hours | `hackathon` |
| Work repo, ticket ID, company remote | `office` |
| Website, portfolio, landing page | `personal-site` |
| Library, CLI, `package.json` with `bin`, `pyproject.toml` | `personal-package` |
| API, bot, worker, scheduled job | `personal-service` |

To mix playbooks, take the phases of the main playbook. Then add the phases that only the second playbook has.

## The file

```json
{
  "playbook": "hackathon",
  "phase": 0,
  "phases": [
    { "name": "Plan", "skill": "plan-spec", "in": "the idea", "out": "docs/spec.md", "gate": true, "done": false }
  ]
}
```

- `phase` is the index of the current phase.
- `in` is what the phase needs. `out` is the file or URL it makes.

## Rules

- At the end of a phase, set `done` to true and move `phase` forward.
- At a gate, stop and show me the `out` of the phase.
- Do not skip a phase without my approval. Write the reason in `NOTES.md`.
