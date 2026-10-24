---
name: personal-service
description: Use when I build an API, bot or worker for my own use. From spec to a cheap host with health checks.
---

# Personal service playbook

| Phase | Skill | In | Out | Gate |
|---|---|---|---|---|
| Plan | `plan-spec` | the idea | `docs/spec.md` | yes |
| Stack | `stack-pick` | spec | ADR | no |
| Code | `test-driven-development` | spec | code and tests | no |
| Review | `review` | the code | findings table | yes |
| Staging | `cheap-deploy` | the service | staging URL with `/health` | yes |
| Production | `cheap-deploy` | staging URL | live URL, cost report | yes |
| Docs | `ship-docs` | live URL | `README.md` | no |

## Rules

- Add a `/health` endpoint before the first deploy.
- Log errors to the host logs. Do not add a monitoring service before a need.
