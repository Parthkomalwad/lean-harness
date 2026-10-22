# Migration from agentic-harness

Each of the 25 v1 packs has one fate. Read the reason before you add a pack back.

| Fate | Meaning |
|---|---|
| Delete | A current model does it well without help. |
| APM | Someone else's work, declared in `apm.yml`. |
| Script | A fixed procedure, now a `just` recipe. |
| Herdr / files | Runtime or memory, moved out of prompts. |
| Keep delta | Only my preferences stay, in `AGENTS.md` or one small skill. |
| Eval | Not kept now. Add it back only if an eval task shows a gain. |

| Old pack | Fate | Where it went | Reason |
|---|---|---|---|
| core | Delete | `apm install` | The pack router chose packs per project. APM installs one fixed set. The `lean-code` rules moved to `AGENTS.md`. |
| harness-band | Delete | `just budget` | The status band showed active packs and cost. The budget check measures the cost in CI. |
| system-one | Eval | Not kept | It calls paid third-party APIs. Add it back if an eval shows a gain on large files. |
| memory-pack | Herdr / files | `docs/adr/`, `NOTES.md` | Plain files work with each agent. |
| session-mem | Herdr / files | `herdr integration install claude` | Herdr restores sessions. |
| orchestrator | Herdr / files | Herdr panes | Parallel work runs in real panes, not in a prompt. |
| council-pack | Herdr / files | `herdr/council.mjs` | Four agents answer in parallel panes. |
| ui-pack | Keep delta | `.apm/skills/ui-taste` | My banned patterns and page checks stay. The registry and picker steps were generic. |
| motion-pack | Eval | Not kept | Video briefs are rare in my work. |
| docs-pack | Delete | `docs/style-ste.md` | Models write good READMEs. The STE guide holds my rules. |
| db-pack | Eval | Not kept | Schema design is model knowledge. Put project facts in the `AGENTS.md` of that project. |
| architect-pack | Delete | `docs/adr/` | ADR-0001 is the template. |
| glassbox | Eval | Not kept | Models explain code well when asked. |
| research-pack | Delete | Model and web search | Current agents search the web without a skill. |
| deploy-pack | Script | `just deploy` | Deploy is a fixed procedure. |
| test-pack | Script | `just test`, pre-commit hook | The test rules moved to `AGENTS.md`. |
| security-pack | Script | `apm audit` in CI | APM scans each install for hidden Unicode and drift. |
| observability-pack | Eval | Not kept | Model knowledge. Add project facts per project. |
| ship-pack | Script | `just release`, `AGENTS.md` | Commit and branch rules are in `AGENTS.md`. Release notes come from a script. |
| launch-pack | Keep delta | `docs/launch-checklist.md` | A checklist, not a skill. |
| superpowers | APM | `obra/superpowers` | Pinned upstream. |
| taste-skill | APM | `Leonxlnx/taste-skill` | Pinned upstream. |
| playwright-cli | APM | `microsoft/playwright-cli` | Pinned upstream skill. |
| web-design-guidelines | APM | `vercel-labs/agent-skills` | Pinned upstream skill. |
| firecrawl | Delete | Not kept | Agents fetch web pages without it. Add the Firecrawl MCP server to `apm.yml` if a project needs it. |
