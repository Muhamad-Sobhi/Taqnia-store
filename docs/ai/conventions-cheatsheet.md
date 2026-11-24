# Conventions Cheatsheet

- **Purpose:** Provide a short reminder of implementation rules for coding agents.
- **Audience:** AI agents and developers.
- **Last updated:** 2026-11-24
- **Related docs:** [AGENTS.md](../../AGENTS.md), [Coding standards](../engineering/coding-standards.md), [Task recipes](task-recipes.md)

- English-only repository instructions, source, identifiers, comments, UI strings, errors, tests, and docs.
- Centralize user-facing text for English/Arabic translation; set explicit `lang`/`dir`.
- Server Components by default; keep client JavaScript small.
- Zod at all external and environment boundaries.
- Route Handler → service → repository layering; never put business logic in routes or components.
- Server-side customer/admin authorization on every protected operation.
- Integer minor-unit money in EGP; no floats.
- Drizzle parameterized queries; migrations are append-only after application.
- Sample catalog data is visibly marked. Never invent real product facts.
- No external analytics by default. Legal drafts must block launch.
- Preserve the WordPress corporate site; do not build a second corporate application.
