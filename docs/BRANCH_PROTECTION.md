# Branch Protection Rules

This document outlines the branch protection rules that should be set up in the GitHub repository settings.

## Protected Branches

### `main` branch
- Represents the production-ready code
- Requires pull request reviews before merging
- Requires status checks to pass before merging
- Requires branches to be up to date before merging
- Includes administrators in these restrictions

### `develop` branch
- Main development branch
- Requires pull request reviews before merging
- Requires status checks to pass before merging
- Requires branches to be up to date before merging

## Branch Naming Convention

- Feature branches: `feature/description-of-feature`
- Bug fix branches: `fix/description-of-fix`
- Release branches: `release/version-number`
- Hotfix branches: `hotfix/description-of-hotfix`

## Workflow

1. Development Flow:
   ```
   feature/fix branch -> develop -> main
   ```

2. Feature Development:
   - Create a new branch from `develop`
   - Implement the feature
   - Create a pull request to `develop`
   - After review and approval, merge to `develop`

3. Release Process:
   - Create a release branch from `develop`
   - Test and fix any issues
   - Create a pull request to `main`
   - After review and approval, merge to `main`
   - Tag the release with version number
   - Merge back to `develop`

4. Hotfix Process:
   - Create hotfix branch from `main`
   - Fix the issue
   - Create pull requests to both `main` and `develop`
   - After review and approval, merge to both branches

## Required Status Checks

The following status checks must pass before merging:
- Build workflow
- Lint checks
- Format checks

## Review Requirements

- At least one approval is required
- Dismiss stale pull request approvals when new commits are pushed
- Require review from Code Owners for core files
