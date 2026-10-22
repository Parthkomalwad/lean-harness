---
name: ui-taste
description: Use when you build or review a web page or UI component. Gives my banned patterns and the checks each page must pass.
---

# UI taste

## Before you build

1. Write one line for each item: who arrives, the one action, what they must believe.
2. If the project has a `DESIGN.md`, follow it for all tokens.
3. Use real content. Do not use lorem ipsum.

## Banned patterns

- Do not center a title on a gradient background.
- Do not use purple or blue default gradients.
- Do not add glow effects to UI.
- Do not use emoji as icons.
- Do not make every element fade in.
- Do not make a grid of identical cards.
- Do not use dark patterns: fake urgency, hidden costs, pre-checked opt-ins.

## Checks

Report this table for each page:

| Check | Pass or fix |
|---|---|
| The one action is clear in 5 seconds | |
| The first screen says what it is and for whom | |
| Headings put the key word first | |
| Each decision point has few choices | |
| Targets are large and near the cursor or thumb | |
| Each action gives feedback in 400 ms | |
| Lines are 45 to 75 characters, body text is 16px or larger | |

## After you build

1. Take screenshots at 375px and 1440px with `playwright-cli`.
2. Run the `web-design-guidelines` review on the changed files.
3. Fix the three worst problems. Repeat, at most three rounds.
