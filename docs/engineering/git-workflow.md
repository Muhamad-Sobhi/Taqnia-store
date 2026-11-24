# Git Workflow

- **Purpose:** Define safe contribution, branch, and review practices.
- **Audience:** Taqnia maintainers and contributors.
- **Last updated:** 2026-11-24
- **Related docs:** [Contributing](../../CONTRIBUTING.md), [Coding standards](coding-standards.md)

## Repository and branches

- Keep the repository private. Do not publish it or its assets.
- Use short-lived feature/fix branches and pull requests; do not push directly to `main`.
- Keep changes narrowly scoped and avoid unrelated formatting or cleanup.

## Commit and review

Use Conventional Commits. Pull requests require CI success, focused tests, documentation/changelog updates, and review. Any security- or payment-related change requires explicit attention to authorization and audit behavior.

## Secrets and generated files

Never commit `.env` files, production exports, user data, payment evidence, or deployment credentials. Lockfiles are committed. Generated migrations are committed; applied migrations are immutable.
