---
name: hackathon
description: Use when I build a project for a hackathon. Speed first, from plan to pitch deck and demo video.
---

# Hackathon playbook

Optimize for a working demo, not for complete code. Write these phases to `.flow.json`.

| Phase | Skill | In | Out | Gate |
|---|---|---|---|---|
| Plan | `plan-spec` | the idea, the judging rules | `docs/spec.md` | yes |
| UI | `ui-taste`, `taste-skill` | spec | main screen works | no |
| Backend | `stack-pick` | spec | API and data work | no |
| Review | `review` | the code | findings table | no |
| Staging | `cheap-deploy` | the app | live URL | yes |
| Pitch | `ship-docs` | live URL | deck | no |
| Video | `ship-docs` | live URL | demo video | no |
| README | `ship-docs` | all of the above | `README.md` | yes |

## Rules

- Time-box the plan to 30 minutes.
- Fake what the demo does not show. Mark each fake with a `TODO(demo)` comment.
- In the review phase, fix only critical findings and security findings. Put the rest in `NOTES.md`.
- Deploy early. Deploy again after each phase.
