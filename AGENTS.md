# AGENTS.md

These rules are my preferences. Follow them in every project that uses this harness.

## Writing

- Write in ASD-STE-100 style. See `docs/style-ste.md`.
- Keep procedure sentences to 20 words or fewer. Keep description sentences to 25 words or fewer.
- Use the active voice. Write one instruction per sentence.
- Do not use em dashes. Use a period, a comma or a colon.
- Do not use hype words, for example "revolutionary" or "game-changing".

## Git

- Use Conventional Commits: `type(scope): summary`, under 72 characters.
- Do not add AI attribution. Do not add `Co-Authored-By` or "Generated with" lines.
- Name branches `<type>/<short-name>`, for example `feat/rate-limit`.
- Do not stage `.env` files, keys or build output.
- Ask before you push, publish or open a pull request.

## Code

- Read the code that a change touches before you write.
- Use the first option that works: no code, existing code, the standard library, an installed dependency, new code.
- Do not add an abstraction that has one implementation.
- Fix a bug in the shared function, not in each caller.
- Do not remove input validation, security checks or accessibility basics.

## Tests

- A new test must fail without the change and pass with it.
- Do not skip or delete a failing test without telling me.

## Decisions and memory

- Read `docs/adr/` before you change the architecture.
- Record each architecture decision as a new ADR in `docs/adr/`.
- At the end of a session, write open work to `NOTES.md`.
- At the start of a project, use the `flow` skill. If `.flow.json` exists, continue its current phase.

## Commands

- Use the `just` recipes. Run `just --list` to see them.
- Run `just test` before you report a task as complete.

## UI

- For any UI work, use the `ui-taste` skill.
