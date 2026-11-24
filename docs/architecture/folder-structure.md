# Folder Structure

- **Purpose:** Explain repository and application folder responsibilities.
- **Audience:** Developers and AI agents.
- **Last updated:** 2026-11-24
- **Related docs:** [System overview](system-overview.md), [Task recipes](../ai/task-recipes.md)

## Repository

| Path          | Responsibility                                                                     |
| ------------- | ---------------------------------------------------------------------------------- |
| `apps/store/` | The single Next.js storefront and server application.                              |
| `docs/`       | Project, architecture, design, engineering, API, operations, and AI documentation. |
| `.github/`    | CI workflow and contribution templates.                                            |
| `AGENTS.md`   | Primary coding-agent instructions.                                                 |

There is deliberately no `apps/marketing` directory: the separate corporate site already exists as WordPress and is not part of this project.

## `apps/store/src`

| Path              | Responsibility                                                            |
| ----------------- | ------------------------------------------------------------------------- |
| `src/app/`        | Next.js routes and layouts; pages stay presentation-focused.              |
| `src/components/` | Reusable UI, storefront features, and layout elements.                    |
| `src/content/`    | Centralized bilingual UI copy and replaceable structured content.         |
| `src/server/`     | Server-only database access, services, auth/security, payments, and mail. |
| `src/lib/`        | Pure shared validators, formatters, constants, and browser-safe helpers.  |
| `src/config/`     | Single typed environment/configuration entry point.                       |
| `src/types/`      | Shared domain and transport types without server-only dependencies.       |

Public storefront routes are locale-prefixed (`/en` and `/ar`) so each response has matching language and text direction metadata. See [the locale routing decision](decisions/adr-0001-locale-prefixed-routing.md).

Tests live under `tests/unit`, `tests/component`, and `tests/e2e`. Database migrations live under `drizzle/`; development/admin scripts live under `scripts/`.
