# Contributing

- **Purpose:** Define the contribution and review workflow for Taqnia Store.
- **Audience:** Taqnia team members and approved contributors.
- **Last updated:** 2026-11-24
- **Related docs:** [Git workflow](docs/engineering/git-workflow.md), [Coding standards](docs/engineering/coding-standards.md), [Testing strategy](docs/engineering/testing-strategy.md)

## Before contributing

- Confirm access to the private repository; do not make it public.
- Read [AGENTS.md](AGENTS.md) and the task-specific documents listed in [the context map](docs/ai/context-map.md).
- Create a feature branch from the current integration branch. Do not push directly to `main`.
- Keep changes focused. Explain any new dependency in the pull request.

## Pull request workflow

1. Implement the smallest complete change.
2. Add or update focused tests.
3. Update directly related documentation and `CHANGELOG.md`.
4. Run lint, typecheck, unit tests, production build, and the relevant end-to-end tests.
5. Open a pull request using the repository template and wait for CI and review.

## Pull request checklist

- [ ] English-only source, identifiers, UI text, errors, tests, and docs.
- [ ] No secrets, personal data, real customer information, or unverified commercial claims.
- [ ] Customer/admin authorization is enforced server-side where applicable.
- [ ] EGP arithmetic uses integer minor units.
- [ ] Accessibility, Arabic RTL, English LTR, and responsive states are considered.
- [ ] Tests, documentation, and changelog are updated.
- [ ] Hosting assumptions remain compatible with the findings in the deployment document.
