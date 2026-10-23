set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]

# List the recipes
default:
    @just --list

# Use the repo git hooks
setup:
    git config core.hooksPath .githooks

# Deploy skills and MCP servers to each agent in apm.yml
deploy:
    apm install
    apm audit

# Run every local check
test:
    node scripts/selftest.mjs
    node scripts/ste-lint.mjs
    node scripts/budget.mjs
    node scripts/no-em-dash.mjs
    node scripts/eval.mjs --smoke

# Print release notes. Use "just release tag" to create the tag.
release *args:
    node scripts/release.mjs {{args}}

# Run the eval suite: agent is claude or codex, runs per task
eval agent="claude" runs="3":
    node scripts/eval.mjs --agent {{agent}} --runs {{runs}}

# Show always-loaded tokens. Pass the old harness path to compare.
budget old="":
    node scripts/budget.mjs {{ if old == "" { "" } else { "--v1 " + old } }}

# Open Claude Code and Codex side by side in Herdr
herdr:
    node herdr/open.mjs
