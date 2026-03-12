# GitHub Actions & Repo Setup Guide

This guide explains how to enable the optional automation in `.github/` and keep workflows running smoothly.

## Quick Start

1. Enable GitHub Actions for the repository.
2. Add secrets/variables only for the workflows you plan to use.
3. Run the setup workflows (labels, branch protection) if desired.

## Required for Specific Workflows

### Release workflow

Requires an npm token to publish packages.

1. Create an npm automation token: https://www.npmjs.com/settings/{your-username}/tokens
2. Add a repository secret:
   - Name: `NPM_TOKEN`
   - Value: your npm token

### Branch protection workflow (optional)

Uses a GitHub App for elevated permissions.

1. Create a GitHub App: https://github.com/settings/apps/new
2. Set permissions: Repository administration (read/write)
3. Generate a private key and note the App ID
4. Add:
   - Repository variable `APP_ID`
   - Repository secret `APP_PRIVATE_KEY`

If these are missing, the workflow safely skips.

## Labels Setup (optional)

Run the **Setup Labels** workflow to create/update labels used by automation.

## Manual Branch Protection (GUI alternative)

Settings → Branches → Add rule:
- Require pull request before merging
- Require approvals (1+)
- Require code owner reviews
- Require status checks:
  - CI / Lint
  - CI / TypeCheck
  - CI / Build
  - CI / Test
- Require linear history

## Workflow Triggers (Summary)

| Workflow | Trigger |
| --- | --- |
| CI | Push/PR to `dev` and `main` |
| CodeQL | Push/PR to `dev` + schedule |
| Release | Tag `v*` or manual |
| Labeler | PR opened/synced (internal PRs) |
| Greeting | New issue/PR |
| Stale | Weekday schedule |
| Auto Approve | Dependabot PR |
| Setup Labels | Manual |
| Setup Branch Protection | Manual |
| Sponsors | Sponsorship event |

## Notes

- Labeler/auto-approve run only for internal PRs to avoid permission failures on forks.
- Sponsor workflow does nothing on manual trigger (safe no-op).
