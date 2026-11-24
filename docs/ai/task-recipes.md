# Task Recipes

- **Purpose:** Give repeatable, testable steps for common store changes.
- **Audience:** AI agents and developers.
- **Last updated:** 2026-11-24
- **Related docs:** [Context map](context-map.md), [Coding standards](../engineering/coding-standards.md), [Testing strategy](../engineering/testing-strategy.md)

## Add a page

1. Read the context map, design system, accessibility, SEO, and content guidelines.
2. Add the route under the appropriate `src/app` segment; keep presentation in components.
3. Put labels and copy in the centralized content layer.
4. Add metadata, locale/RTL handling, loading/error/empty states, and accessibility behavior.
5. Add focused component/E2E tests; update docs and changelog.

## Add a Route Handler

1. Identify the route contract and auth/role requirement.
2. Define a Zod request schema and response/error shape.
3. Implement business logic in a server service, not in the Route Handler.
4. Enforce ownership and role checks in the service boundary; use transactions for multi-write operations.
5. Document method/path/auth/request/response/errors in `docs/api/store-api.md`.
6. Test validation, authorization, success, and failure cases.

## Add a database table

1. Read the data model and migration policy.
2. Add a Drizzle schema with ID, timestamps, explicit foreign keys and indexes.
3. Generate a new migration; never edit a migration already applied.
4. Update repository/service types and `docs/architecture/data-model.md`.
5. Test migration and query behavior against a disposable MySQL database.
6. Never run production migration/seed commands without explicit approval and backup.

## Add a UI component

1. Check for an existing primitive or pattern before introducing a dependency.
2. Implement semantic markup and explicit default/focus/disabled/loading/error states.
3. Keep copy centralized and verify English LTR and Arabic RTL.
4. Add component tests for meaningful interactive behavior and update the component inventory.

## Change hosting configuration

1. Read the current hosting report and identify which open question the change depends on.
2. Check current official GoDaddy documentation and account-specific evidence.
3. Isolate values in validated environment configuration.
4. If the change depends on unverified subdomain/runtime/DB/image support, document the risk and do not claim production compatibility.
5. Update the deployment runbook and ADR if a decision changes.
