# Taqnia Store Agent Instructions

## Project summary

Taqnia Store is a bilingual, product-first e-commerce application for IT and networking equipment.
It serves `store.taqnia-eg.net`; the separate corporate WordPress website is out of scope.
The store uses Next.js, TypeScript, Drizzle, and MySQL.
Customers must authenticate before checkout; orders use manual payment and shipping workflows.
Version 1 uses EGP and no external analytics.
The project is proprietary and the repository must remain private.

## Repository map

```text
apps/store/       The single Next.js store app (UI, server, DB, tests)
docs/             Architecture, operations, design, engineering, and AI guidance
.github/          CI, pull request template, and issue templates
AGENTS.md         Primary instructions for coding agents
```

All implementation tasks belong to `apps/store`. Do not create or deploy a corporate marketing app.

## Commands

Run commands from `apps/store` unless a command explicitly says otherwise.

| Task                                      | Command                                     |
| ----------------------------------------- | ------------------------------------------- |
| Install                                   | `npm ci`                                    |
| Development                               | `npm run dev`                               |
| Lint                                      | `npm run lint`                              |
| Typecheck                                 | `npm run typecheck`                         |
| Unit/component tests                      | `npm test`                                  |
| End-to-end tests                          | `npm run test:e2e`                          |
| Build                                     | `npm run build`                             |
| Production start                          | `npm start`                                 |
| Generate/apply migrations (added in M4)   | `npm run db:generate`, `npm run db:migrate` |
| Seed local development data (added in M4) | `npm run db:seed`                           |

The migration and seed commands are documented for M4 but are not available in the M1 scaffold. Once implemented, they require a configured local environment. Never run seed or migration commands against production without explicit deployment approval and a verified backup.

## Conventions

- **English only** for source, identifiers, comments, UI copy, error messages, tests, configuration, and documentation. Arabic is supported as user content/translation data, not as repository instruction or inline copy.
- TypeScript strict mode with `noUncheckedIndexedAccess`; do not use `any`. Narrow `unknown` values and avoid non-null assertions.
- Use Server Components by default. Keep client components small and use them only for interactivity.
- Validate all external input and environment variables with Zod.
- Keep business logic in `src/server/services`; route handlers parse/validate, call services, and map results to responses.
- Use Drizzle parameterized queries. Use integer minor units for money; never use floating point for prices or totals.
- Keep customer and administrator permissions distinct and enforce authorization on the server.
- Keep user-facing text in a centralized content layer.
- Document significant decisions and update relevant docs with each feature.

## Always do

- Read [the context map](docs/ai/context-map.md), relevant task recipes, and the Next.js-specific guidance in `apps/store/AGENTS.md` before implementation.
- Keep store deployment separate from the WordPress corporate website.
- Keep secret values in validated environment variables; commit only `.env.example`.
- Label development sample data and never fabricate real prices, specifications, inventory, warranties, or claims.
- Preserve guest carts across registration/login and require an authenticated customer for every order.
- Record manual payment and shipping status transitions and require admin verification for transfer payments.
- Run relevant tests, lint, typecheck, and build before completing a change.
- Update documentation, changelog, and ADRs when the architecture changes.

## Never do

- Never expose database credentials, secrets, or admin-only data to the browser.
- Never treat a customer-uploaded payment screenshot as proof of payment.
- Never mark an electronic transfer paid without an authorized administrator's verification.
- Never use floating-point arithmetic for EGP values.
- Never edit an applied migration; create a new migration.
- Never add dependencies without justification or assume native binaries are available on shared hosting.
- Never deploy static export as a substitute for required store server functionality.
- Never overwrite, reconfigure, or place application files in the corporate WordPress site.
- Never enable external analytics or tracking by default.
- Never allow legal placeholder pages to pass the production launch checklist.

## Hosting constraints

- The target is the existing GoDaddy cPanel account with one currently unused Node.js application slot and MySQL.
- The only planned Node application is the Taqnia Store.
- The account's runtime selector, Node app/subdomain binding, resource limits, database access and connection limits, and native image-processing support must be verified; see [hosting and deployment](docs/architecture/hosting-and-deployment.md).
- Public GoDaddy guidance indicates the cPanel Node.js runtime has moved to LTS 24; use the runtime actually available in this account. Keep host and port configuration out of business logic.
- Do not assume root, Docker, persistent background workers, unrestricted processes, or arbitrary system packages.
- Keep the app portable to a VPS or managed database by isolating hosting and database configuration.

## Agent workflow

1. Read `docs/ai/context-map.md` and applicable task recipes.
2. State the bounded implementation plan and files involved.
3. Implement the smallest complete change.
4. Add/update focused tests.
5. Update docs, ADRs, and changelog where relevant.
6. Run lint, typecheck, tests, and build (plus focused E2E when applicable).
7. Summarize changes, verification, risks, and open questions.

## Definition of Done

- [ ] Requirements and authorization boundaries are met.
- [ ] English-only repository content and centralized user-facing copy are preserved.
- [ ] Tests, lint, typecheck, and build pass.
- [ ] Docs, API docs, and changelog are current.
- [ ] No real/sample data confusion, secrets, or unrelated corporate-site changes.
- [ ] Hosting compatibility and open questions are recorded.
- [ ] Legal placeholders are clearly marked and launch remains blocked pending approval.

## Task documentation

Use [task recipes](docs/ai/task-recipes.md), [coding standards](docs/engineering/coding-standards.md), [testing strategy](docs/engineering/testing-strategy.md), and [engineering security](docs/engineering/security.md).

## Known issues and open questions

- GoDaddy plan name is TBD; the owner will confirm it from Renewals & Billing.
- Confirm actual cPanel Node.js runtime, app startup/port behavior, and binding to `store.taqnia-eg.net`.
- Confirm Node app resource limits and MySQL connectivity, grants, size, and connection limits.
- Confirm whether `sharp` works; keep image processing optional and use unoptimized/pre-optimized images if uncertain.
- Obtain approved legal policies before launch.
- Final payment instructions, product catalog, administrator roster, and operational contact details are owner-supplied.
