---
name: personal-site
description: Use when I build a website for my own project. Quality first, from spec to cheap deploy, README and video.
---

# Personal site playbook

| Phase | Skill | In | Out | Gate |
|---|---|---|---|---|
| Plan | `plan-spec` | the idea | `docs/spec.md` | yes |
| Design | `taste-skill` | spec, reference sites | `DESIGN.md` | yes |
| UI | `ui-taste` | `DESIGN.md` | pages with the checks table | no |
| Backend | `stack-pick` | spec | API, database, ADR | no |
| Staging | `cheap-deploy` | the app | preview URL | yes |
| Production | `cheap-deploy` | preview URL | live URL | yes |
| Docs | `ship-docs` | live URL | `README.md`, demo video | no |

## Rules

- Collect 3 reference sites before the design phase. Write what to take from each.
- Run `web-design-guidelines` on each page before staging.
