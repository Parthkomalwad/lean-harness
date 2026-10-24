---
name: office
description: Use when I work in a company repo. Follows the team flow from ticket to pull request.
---

# Office playbook

<!-- TODO(parth): add your ticket tool, branch rules and banned tools. -->

Follow the rules of the repo first. These phases fill the gaps.

| Phase | Skill | In | Out | Gate |
|---|---|---|---|---|
| Ticket | none | ticket ID and text | acceptance criteria in `NOTES.md` | yes |
| Design | `plan-spec` | criteria | ADR if the change affects architecture | yes |
| Code | `test-driven-development` | criteria | code and tests | no |
| Review | `review` | the diff | findings table, fixes | yes |
| PR | `finishing-a-development-branch` | the branch | pull request draft | yes |

## Rules

- Do not deploy. CI deploys.
- Do not send company code to an outside service.
- Ask before you push or open a pull request.
