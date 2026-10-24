---
name: stack-pick
description: Use when a flow picks a backend, database or framework. Gives my default stack and when to change it.
---

# Stack pick

Start from my defaults. Change one only for a reason in the spec. Write the reason in an ADR.

<!-- TODO(parth): replace these defaults with your real choices. -->

| Need | Default | Change when |
|---|---|---|
| Web app | Next.js with TypeScript | The site is static content only: use Astro |
| API only | Hono on Node, or FastAPI for Python work | The team uses another framework |
| Database | Postgres on Supabase or Neon free tier | The data is a few documents: use SQLite |
| Auth | The auth of the database host | The project needs SSO |
| Files | The storage of the database host | Files exceed the free tier |

## Rules

- Use one database. Do not add a cache or a queue before a measured need.
- Pick the option with a free tier and no credit card when quality is equal.
- Record the choice in `docs/adr/`.
