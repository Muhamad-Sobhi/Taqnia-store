# Coding Standards

- **Purpose:** Keep the application safe, consistent, testable, and deployable.
- **Audience:** Developers and AI agents.
- **Last updated:** 2026-11-24
- **Related docs:** [AGENTS.md](../../AGENTS.md), [Folder structure](../architecture/folder-structure.md), [Security](security.md)

## TypeScript and React

- Use strict TypeScript and `noUncheckedIndexedAccess`; do not use `any`.
- Use `unknown` plus narrowing at untrusted boundaries. Avoid non-null assertions; if unavoidable, explain the invariant.
- Components/types use `PascalCase`; values/functions use `camelCase`; files/folders use `kebab-case`; constants use `SCREAMING_SNAKE_CASE`.
- Server Components are the default. Keep client components small and leaf-level.
- Use stable, accessible HTML semantics and keep user-facing strings in centralized content modules.

## Layering

- Route Handlers validate input, call a service, and map results/errors to HTTP.
- Business logic belongs in `src/server/services`; database access belongs in `src/server/db`.
- Keep server-only modules out of client import graphs.
- Validate all external input and environment configuration with Zod.
- Use one API error envelope: `{ "error": { "code": "STRING_CODE", "message": "Human readable", "details": {} } }`.

## Data and dependencies

- Money is integer minor units plus currency code; version 1 uses EGP only.
- Use Drizzle parameterized queries, explicit indexes, foreign keys, and migrations.
- Do not edit an applied migration. Add a new migration.
- Justify each dependency; prefer pure JavaScript when it avoids an unsupported native dependency.
- Never log secrets, payment evidence, or unnecessary personal data.

## Documentation

Public modules should have useful TSDoc. Comments explain why, not what. Update related docs and changelog in the same change.
