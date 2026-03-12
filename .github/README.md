# .github Overview

This folder contains all GitHub-facing automation and templates.

## What’s inside

- `workflows/`: CI, release, automation, and housekeeping workflows
- `ISSUE_TEMPLATE/`: issue templates for bugs, features, questions, and security
- `PULL_REQUEST_TEMPLATE.md`: PR template for consistent reviews
- `CODEOWNERS`: code ownership rules
- `SETUP_GUIDE.md`: how to enable optional workflows and secrets
- `labeler.yml`: labels applied automatically based on file paths
- `dependabot.yml`: dependency update configuration

## How to use

1. Start with `SETUP_GUIDE.md` to enable the pieces you want.
2. Keep `labeler.yml` aligned with your folder structure.
3. Update templates whenever you add new top-level capabilities.

## Workflow safety

Workflows are designed to avoid failing on forks or missing secrets:

- Labeler and auto-approve only run on internal PRs
- Branch protection workflow skips without app credentials
- Release publishes only when `NPM_TOKEN` is present
