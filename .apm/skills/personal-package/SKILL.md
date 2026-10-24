---
name: personal-package
description: Use when I build a library or CLI to publish on npm or PyPI. From API design to release.
---

# Personal package playbook

| Phase | Skill | In | Out | Gate |
|---|---|---|---|---|
| Plan | `plan-spec` | the idea | `docs/spec.md` with the public API | yes |
| Code | `test-driven-development` | spec | code and tests | no |
| Docs | `ship-docs` | the API | `README.md` with examples | no |
| Review | `review` | the code | findings table | yes |
| Dry run | none | the package | `npm pack` or `python -m build` output | yes |
| Publish | none | dry run | version on the registry | yes |

## Rules

- Use semantic versions. Start at `0.1.0`.
- Keep runtime dependencies to zero when the standard library works.
- Check that the package name is free before the code phase.
- Ask me before you publish.
