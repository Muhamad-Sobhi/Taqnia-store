# Deployment Runbook

- **Purpose:** Guide an operator through a safe store release and rollback on GoDaddy cPanel.
- **Audience:** Taqnia administrators and deployment operators.
- **Last updated:** 2026-11-24
- **Related docs:** [Hosting and deployment](../architecture/hosting-and-deployment.md), [Environment variables](environment-variables.md), [Backup and restore](backup-and-restore.md)

## Before production deployment

Do not begin production deployment until all infrastructure checks are confirmed for the exact hosting account:

- [ ] Owner confirms GoDaddy plan name from Renewals & Billing.
- [ ] Confirm cPanel Node.js runtime and test the app manager's startup, assigned port, and restart behavior.
- [ ] Confirm `store.taqnia-eg.net` can route to the Node application without modifying the WordPress site at `taqnia-eg.net`.
- [ ] Confirm Node-to-MySQL connectivity, database user grants, version, database storage and connection limits.
- [ ] Confirm shared-host CPU/RAM/process limits are adequate for SSR and order activity.
- [ ] Verify `sharp`/native image support or set up pre-optimized, unoptimized image delivery.
- [ ] Confirm SSL for the store subdomain, environment values, backups, and access controls.
- [ ] **Legal review required before launch:** replace and approve Privacy Policy, Terms and Conditions, Refund and Return Policy, Shipping and Delivery Policy, and Cookie Policy if applicable. The store must not go live with placeholder legal text.
- [ ] Replace sample content/data with verified owner-approved catalog and commercial content.
- [ ] Confirm production payment instructions, admin roster, notification mailbox, and customer support contact details.

## Build and package

Run from `apps/store`:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

The project requires Node.js `>=22.0.0` and uses `next start`; it does not enable standalone output. Build the production `.next/` output, then install production dependencies for the same Linux/Node runtime used by cPanel with `npm ci --omit=dev`. Package `package.json`, `package-lock.json`, production `node_modules`, `.next/`, `public/`, and `next.config.ts`. Ensure the cPanel app user owns or can write the app's Next cache directory. This package shape has been rehearsed in the local container, not in the GoDaddy account.

Do not upload `.env*`, local databases, test reports, source-only development files, or a `node_modules` directory built for a different OS/Node ABI. Keep credentials in the Node app manager's server-side environment configuration.

## cPanel deployment outline

1. Back up the current store files and database; confirm the WordPress site is outside the deployment target.
2. In GoDaddy Products, open the correct Web Hosting account and launch cPanel Admin.
3. Confirm the store subdomain and its independent document root. Do not alter the corporate domain's document root.
4. Configure the Node.js application using the verified runtime (minimum Node.js 22), application root, startup command `npm start`, assigned `PORT`, and environment values.
5. Upload the store release to the app manager's separate application root using the tested cPanel/File Manager or approved FTP workflow. Do not use the WordPress document root.
6. Install production dependencies with `npm ci --omit=dev`, or upload the matching production dependency tree from the tested build. Build `.next/` in a controlled environment rather than assuming shared-host build resources are sufficient.
7. Production migrations are currently blocked: `drizzle.config.ts` only permits loopback development/test databases. Before a schema-changing release, approve a separate reviewed migration runner, take a verified backup, and confirm the prior schema version. Never edit `__drizzle_migrations` manually; MariaDB DDL auto-commits, so inspect partial schema changes after any failure.
8. Verify HTTPS, locale switching, browsing/search, authentication, product administration, order management, and admin authorization. Guest-cart merge, checkout, and order creation are not implemented and remain launch blockers.
9. Confirm database writes, mail delivery, error logs, and health checks without exposing customer data.
10. Recheck `taqnia-eg.net` and confirm WordPress remains unchanged.

Detailed cPanel screen names and artifact packaging will be finalized after the owner confirms the account-specific Node app manager workflow.

## Local cPanel compatibility simulation

The repository provides `apps/store/docker-compose.hosting-simulation.yml`, `apps/store/Dockerfile.hosting-simulation`, `.env.hosting-simulation.example`, and the `db:hosting-smoke` integration check.

1. Copy `.env.hosting-simulation.example` to `.env.local`.
2. Run `npm run hosting:simulation:up` and wait for the MariaDB health check.
3. Run `npm run db:migrate` and `npm run db:seed` against loopback port `3307`.
4. Run `npm run db:migrate` a second time.
5. Run `npm run db:hosting-smoke`; it must report `migration journal 2/2 (no pending migrations)` and passes auth/session, catalog/detail, order, transaction/row-lock, constraints, timestamp-default, and connection-recovery checks.
6. Run `npm run hosting:simulation:app` to build with the configured Node.js 24 image and start `next start` as a non-root user.
7. Verify `http://127.0.0.1:3310/en`, `/ar`, and `/ar/quote`; verify the production container can query the database.
8. For the separate MariaDB 10.6 target, run `npm run hosting:compat:106:up`, then use `DATABASE_PORT=3308 npm run db:migrate` twice, followed by `DATABASE_PORT=3308 npm run db:seed` and `DATABASE_PORT=3308 npm run db:hosting-smoke`; finally run `npm run hosting:compat:106:down`.
9. Run `npm run hosting:simulation:status`, then `npm run hosting:simulation:down` when finished.

MariaDB version selection uses `MARIADB_IMAGE` (default `mariadb:11.4`); the 10.6 command uses a separate Compose project and loopback port `3308`. The Dockerfile's Node image is configurable with `NODE_IMAGE` (default `node:24-bookworm-slim`). These databases use `tmpfs`, not a persistent/reused volume, and are disposable test instances, never backups or staging databases.

Rehearsal findings on 2026-11-24:

- MariaDB 11.4.13 and 10.6.28 each passed fresh migration twice, seed, and database integration smoke checks.
- `db:hosting-smoke` creates synthetic `.invalid`/fixture records only in the disposable local database; it never sends communications.
- The previous migration failure was `ERROR 1059` for a 65-character foreign-key name, hidden by Drizzle Kit's terminal progress output. MariaDB 10.6 also required explicit NULL defaults for nullable TIMESTAMP columns. Both are fixed in the baseline migration and schema.
- Node.js 22.23.5 and 24.22.3 production images both build successfully from the same Dockerfile. Production-only runtime dependencies, non-root execution (`uid=1000`), assigned-port binding, `SELECT 1`, and HTTP 200 on `/en`, `/ar`, and `/ar/quote` were verified.

The simulation does not prove cPanel account-specific runtime availability, Application Manager startup behavior, proxy port assignment, subdomain mapping, MySQL engine/version/grants or limits, backup tooling, SSL, CPU/RAM/process limits, cache-directory permissions, or native image processing support.

The current [drizzle.config.ts](../../apps/store/drizzle.config.ts) deliberately permits migration tooling only against loopback development/test databases. It is not a production migration configuration. A production schema change therefore remains blocked until a separately reviewed migration execution procedure and access controls are approved; do not bypass the guard by editing migration tracking records or changing the production target in a local environment file.

## Rollback

1. Stop or roll back only the store application; do not modify the corporate WordPress site.
2. Restore the last known-good store artifact and compatible environment settings.
3. Restore the database only when required and only from a verified backup; consider whether newer schema changes make restoration unsafe.
4. Re-run store health checks and verify the corporate domain remains operational.
5. Record the incident, migration state, and follow-up actions.
