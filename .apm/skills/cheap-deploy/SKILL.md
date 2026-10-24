---
name: cheap-deploy
description: Use when I deploy a site, app or service. Deploys to staging first on a free or low-cost host.
---

# Cheap deploy

<!-- TODO(parth): set your hosts and your monthly limit. -->

Monthly limit: 0 USD for hackathon and personal work, unless I approve more.

| Thing | Host |
|---|---|
| Static site or Next.js | Vercel or Cloudflare Pages |
| API or worker | Cloudflare Workers, or Fly.io for long processes |
| Container | Fly.io or Render free tier |
| Package | npm or PyPI, see `personal-package` |

## Steps

1. Deploy to staging first. Use a preview URL.
2. Put secrets in the host secret store. Do not commit `.env` files.
3. Open the staging URL with `playwright-cli`. Check that the main action works.
4. Report the URL, the monthly cost and the free-tier limits.
5. Gate: ask me before a production deploy.
