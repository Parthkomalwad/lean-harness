---
name: review
description: Use before a deploy, publish or pull request. Runs code review, security review and CodeRabbit review, then fixes the findings.
---

# Review

Run the three reviews on the diff against the base branch. Run them in this order.

| Review | How | Looks for |
|---|---|---|
| Code | `/code-review high`, or the `requesting-code-review` skill | bugs, logic errors, missing tests |
| Security | `/security-review` | secrets, injection, auth gaps, unsafe input |
| CodeRabbit | `coderabbit review --plain --base main` | a second opinion from another model |

## Steps

1. Commit or stage the work. The reviews read the diff.
2. Run each review. Collect the findings in one table: source, file and line, severity, finding.
3. Fix each critical and high finding. Then run the tests.
4. Run the review that found the issue again. Confirm the fix.
5. Write each finding that you do not fix in `NOTES.md`, with the reason.
6. Gate: show me the table before the next phase.

## Rules

- If `coderabbit` is not installed, do not install it. Tell me to run `curl -fsSL https://cli.coderabbit.ai/install.sh | sh`, then `coderabbit auth login`. Continue with the other two reviews.
- In a company repo, ask me before you send code to CodeRabbit.
- Do not mark a finding as false without a reason in the table.
