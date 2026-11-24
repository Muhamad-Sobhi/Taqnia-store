# Hosting and Deployment

- **Purpose:** Describe the verified hosting environment, deployment model, limitations, and infrastructure questions for Taqnia Store.
- **Audience:** Project owners, developers, and deployment operators.
- **Last updated:** 2026-11-24
- **Related docs:** [Assumptions](../00-overview/assumptions.md), [Deployment runbook](../operations/deployment-runbook.md), [Environment variables](../operations/environment-variables.md)

## Deployment target

| Area                      | Target                                                                                                                                       |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Store domain              | `store.taqnia-eg.net`                                                                                                                        |
| Existing corporate domain | `taqnia-eg.net` — existing WordPress site; out of scope and must remain operational                                                          |
| Hosting                   | Existing GoDaddy Web Hosting account with cPanel                                                                                             |
| Application model         | One full Next.js application using SSR, Server Components, and Server Actions; no business Route Handlers or Proxy are currently implemented |
| Database                  | GoDaddy cPanel MySQL, accessed through Drizzle and `mysql2`                                                                                  |
| Application slot          | One available Node.js app slot; this application is the only planned Node application                                                        |
| Plan name                 | **TBD (owner to confirm from Renewals & Billing)**                                                                                           |

## Verified facts

### Confirmed in the hosting dashboard by the owner

- cPanel Web Hosting is present.
- The dashboard exposes Node.js Apps with one application slot, zero currently used.
- MySQL and phpMyAdmin are available.
- File Manager, FTP, and email are available.
- Dashboard storage shows 25 GB total disk, approximately 1.04 GB currently used, a 250,000 file limit, and 23.81 GB database disk.
- The project is intended to deploy only to `store.taqnia-eg.net`; the WordPress corporate website at `taqnia-eg.net` is not to be modified.

### Confirmed from official GoDaddy documentation

The following articles apply to GoDaddy Web Hosting (cPanel). They describe product-level behavior; they do not prove every feature or limit is enabled on this account.

| Topic                                                       | Official source                                                                                                                                                                                                                                              | Verified result                                                                                                                                                                                                                                                                                                                         |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node.js app support / cPanel setup                          | [Retiring older versions of Node.js and Ruby](https://www.godaddy.com/en/help/retiring-older-versions-of-nodejs-and-ruby-42764)                                                                                                                              | GoDaddy directs cPanel users to cPanel's **Setup Node.js App** and Node.js Application Manager and documents selecting the latest version and restarting the app.                                                                                                                                                                       |
| Supported Node.js runtime versions                          | [Retiring older versions of Node.js and Ruby](https://www.godaddy.com/en/help/retiring-older-versions-of-nodejs-and-ruby-42764)                                                                                                                              | The article says GoDaddy moved cPanel Node.js from LTS 10 to LTS 24 and instructs users to select the latest version. It does not expose the runtime selector for this particular account; confirm the actual selection in its cPanel.                                                                                                  |
| Next.js runtime requirement                                 | [Next.js installation requirements](https://nextjs.org/docs/app/getting-started/installation#system-requirements)                                                                                                                                            | Current Next.js documentation lists Node.js 20.9 as the minimum. The documented GoDaddy LTS 24 target is above that minimum; dependency compatibility and account runtime selection still require validation.                                                                                                                           |
| MySQL access host and port                                  | [View database details for my Web Hosting (cPanel) account](https://www.godaddy.com/en/help/view-database-details-for-my-web-hosting-cpanel-account-16021), [Find your database hostname](https://www.godaddy.com/en/help/find-your-database-hostname-23889) | GoDaddy says applications hosted on Web Hosting (cPanel) connect via `localhost` on port `3306`; database names, users, and size are viewed in cPanel. Remote connections from outside the hosting account require separate configuration. The Node app's actual DB user permissions and connectivity still need an account-level test. |
| MySQL component support                                     | [Which components does my hosting support?](https://www.godaddy.com/en/help/which-components-does-my-hosting-support-5614)                                                                                                                                   | MySQL is listed as supported on Web Hosting (cPanel). Tier-specific database counts and sizes vary; the owner's dashboard separately reports its current database storage allowance.                                                                                                                                                    |
| Subdomain creation                                          | [Create addon domains or subdomains in Web Hosting (cPanel)](https://www.godaddy.com/en/help/create-addon-domains-or-subdomains-in-web-hosting-cpanel-8877)                                                                                                  | GoDaddy documents creating a subdomain in cPanel with its own document root. This does not establish that the cPanel Node.js app manager can bind the app to `store.taqnia-eg.net` without affecting the existing WordPress site.                                                                                                       |
| CPU, RAM, process, and connection limits                    | No account-specific public article located                                                                                                                                                                                                                   | Exact limits are not published in the inspected cPanel articles; obtain them from the hosting dashboard or GoDaddy support.                                                                                                                                                                                                             |
| `next/image` optimization / native image-processing support | No applicable GoDaddy cPanel statement located                                                                                                                                                                                                               | GoDaddy's inspected cPanel documentation does not confirm `sharp` or other native image-processing support. Use a no-native-dependency fallback until tested in the account.                                                                                                                                                            |

## Open questions

The owner is contacting GoDaddy support or checking the account. These must remain explicit until verified:

1. **Runtime selection:** Confirm the exact Node.js version selectable in this cPanel account. The application declares Node.js `>=22.0.0`; public guidance referring to LTS 24 does not confirm that this account currently offers it.
2. **Resource limits:** Ask GoDaddy for this account's CPU, RAM, process, execution, and concurrent database connection limits.
3. **Database access:** Although GoDaddy documents `localhost:3306` for cPanel applications, confirm that the Node.js app can connect using its cPanel database user, and verify user grants, database version, size allowance, and concurrent connection limits.
4. **Subdomain binding:** Can the cPanel Node.js app manager serve `store.taqnia-eg.net` while leaving the WordPress site at `taqnia-eg.net` and its document root untouched? The subdomain article documents domain creation, not binding it to a Node application.
5. **Image processing:** Does this account support the native runtime/dependency requirements for Next.js image optimization (including `sharp`)? If unconfirmed or unsupported, use pre-optimized assets and configure images as unoptimized.
6. **Exact hosting plan:** Plan name is TBD; owner to confirm from Renewals & Billing.
7. **Next.js under this app manager:** Public GoDaddy materials inspected do not explicitly certify this exact cPanel account's Node.js Application Manager setup for a full SSR Next.js app. Confirm startup and proxy/port behavior in a non-production test, without changing WordPress.

## Architecture and deployment constraints

- Do not deploy static export as the store architecture: authentication, carts, checkout, inventory, order processing, and admin operations require dynamic server behavior.
- Keep the marketing/corporate WordPress site and store deployment independent. Do not upload store files into the WordPress document root or alter its `.htaccess`, database, or files.
- Use only the one available Node.js app slot. The store is the sole planned Node process.
- `next start` reads the `PORT` environment variable and listens on the wildcard interface when no hostname is passed. The local container test verifies that behavior only; confirm cPanel's assigned port/proxy expectations and process supervision in the account.
- Keep database hostname, port, database name, user, and credentials in validated environment configuration. Never include credentials in source code or client bundles.
- Use MySQL connection settings compatible with the cPanel database. The default pool is three connections per Node process with a bounded 12-request queue; keep this low until GoDaddy confirms account limits.
- Prefer pure-JavaScript dependencies where practical. Do not assume root access, Docker, arbitrary system packages, persistent background workers, or unrestricted processes.
- Keep business logic and database access behind server-side service and repository modules, allowing later migration to a VPS or managed database without rewriting commerce rules.
- Build and deploy only production dependencies/artifacts required by the cPanel application manager. Deployment packaging and startup steps remain subject to official account-specific instructions.
- If native image optimization is unsupported or unverified, use pre-optimized assets and `images.unoptimized: true` rather than making startup depend on an unavailable native binary.

## Next.js compatibility assessment

The project declares Node.js `>=22.0.0` in `apps/store/package.json`; this is the current project's minimum supported runtime. Next.js 16.4.6 itself documents Node.js 20.9 or later, but the project deliberately sets the higher Node 22 floor. Do not treat GoDaddy's public LTS 24 guidance as confirmation that this account currently offers it.

| Feature                      | Current use                                                             | cPanel/Node assessment                                                                                                                                                                                       |
| ---------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Server Components and SSR    | App Router pages/layouts; dynamic account and admin pages               | Supported by `next start`; requires a continuously running Node application and adequate CPU/memory. Account limits need verification.                                                                       |
| Static generation and assets | Public locale/category pages and `public/` assets                       | Supported; deploy the matching `.next` build and `public/` directory. Ensure the app user can write `.next/cache` if Next writes runtime cache data.                                                         |
| Server Actions               | Auth and admin mutations use POST-based Server Actions                  | Supported by the standard Node server. Preserve proxy host/origin headers and test HTTPS/CSRF behavior. Next's default action body limit is 1 MB; no upload action exists.                                   |
| Route Handlers               | None implemented under `src/app/**/route.ts`                            | The Node runtime supports them, but no current Route Handler behavior was validated or needs deployment configuration.                                                                                       |
| Middleware / Proxy           | No `middleware.ts` or `proxy.ts` exists                                 | No current dependency. Next.js Proxy is supported with `next start`; if introduced, verify cPanel forwarding and Node runtime compatibility.                                                                 |
| `next/image`                 | Image component is used; `images.unoptimized` is enabled                | No on-server optimizer or `sharp` dependency is required by current configuration. Keep pre-sized assets; enabling optimization later needs native dependency/resource validation.                           |
| File uploads                 | No upload route or persistence implementation                           | No current requirement. Do not store future customer files on the app filesystem; durable file storage and upload limits would need an approved design.                                                      |
| Caching                      | No application cache APIs, `revalidate*`, or custom cache handler found | Next's single-instance local cache is the only framework cache. Its directory must be writable and its persistence across app restarts must be checked. Multiple app instances/shared cache are not assumed. |
| Runtime filesystem writes    | No application-controlled file writes found                             | Next may write internal cache data under `.next`; verify app-root ownership/permissions. No runtime uploads or generated commerce files are expected.                                                        |
| Authentication sessions      | Signed-cookie token plus MySQL-backed session rows                      | Standard Node-compatible; requires MySQL availability, correct cookie security behind TLS, and stable environment secrets. No in-memory session store.                                                       |
| Background work              | No worker, queue consumer, or scheduled process implemented             | No separate worker is currently required. The web server itself must remain supervised by cPanel. Do not assume persistent background worker support.                                                        |

This assessment is based on the present source tree, not an assurance that every cPanel account's proxy, TLS termination, process manager, filesystem permissions, or resource limits are suitable.

## Database migration findings

The tested versions are Drizzle ORM 0.45.4, Drizzle Kit 0.31.11, and mysql2 3.24.6. The original Drizzle Kit message looked like a dropped connection, but reproducing the migration with Drizzle ORM's query logger exposed the actual statement error: MariaDB returned `ERROR 1059` because the generated foreign-key identifier `product_attribute_values_attribute_id_attribute_definitions_id_fk` is 65 characters; MySQL/MariaDB identifiers are limited to 64. Drizzle Kit's terminal progress display obscured the failed statement.

The failure occurred during the first migration, not the order migration. MariaDB auto-commits DDL; the initial migration therefore left some tables/constraints in the disposable database but no migration journal row. The earlier manually applied order SQL did not establish that the full schema was migrated. The baseline FK name has now been shortened consistently in the Drizzle schema, the initial migration, and both snapshots.

MariaDB 10.6 exposed a second compatibility issue: with `explicit_defaults_for_timestamp=OFF`, nullable timestamp declarations lacking explicit `NULL` became `NOT NULL DEFAULT '0000-00-00 00:00:00'`. This made freshly registered sessions appear revoked. Nullable timestamp columns now explicitly declare `DEFAULT NULL`; generated snapshots remain aligned. Do not change migration tracking rows manually. A failed DDL migration must be inspected and repaired on a disposable database before rerunning; do not assume transactional rollback of DDL.

On fresh, separate local databases, `drizzle-kit migrate` applied both migrations twice on MariaDB 11.4 and MariaDB 10.6. Each database had two migration journal records, 25 application tables, and 31 foreign-key constraints after the first and second runs. The integration smoke prints `migration journal 2/2 (no pending migrations)` after checking the journal against the repository's Drizzle journal file. Seed and database integration smoke checks also passed on both versions. Drizzle Kit is compatible for the tested migrations when SQL identifiers and timestamp defaults are MariaDB-compatible; no migration-system replacement is warranted based on these results.

## Connection budget

The application reuses one `mysql2` pool per Node.js process. The default pool is three connections, keeps at most three idle connections, removes idle connections after 60 seconds, and times out connection establishment after 10 seconds. The wait queue is capped at twelve queued connection requests (`4 × pool size`); a saturated queue rejects new work rather than growing without bound. Drizzle releases checked-out transaction connections in its `finally` path, and `mysql2` removes broken pooled connections; the failed query rejects to its caller, while subsequent requests can obtain a replacement.

The query call sites use bounded fixed-size `Promise.all` groups; no unbounded per-request database fan-out or persistent background query worker was found. The expected baseline is **up to 3 MySQL connections per Node.js process**, not a claim about GoDaddy's server-wide limit. Multiple app processes or additional tools multiply this budget. Do not raise `DATABASE_CONNECTION_LIMIT` until GoDaddy confirms account limits and observed workload justifies it.

## Local cPanel hosting simulation

The repository includes a Docker Compose rehearsal with a configurable MariaDB image (default 11.4; separate compatibility target 10.6) and a configurable Node.js production image (default 24). Both databases are created on `tmpfs`; no persistent database volume is configured:

- MariaDB binds only to loopback port `3307` by default and uses a disposable local database name.
- The app image binds only to loopback port `3310` and uses the production `next start` command.
- The runtime image installs production dependencies only and runs as the unprivileged `node` user.
- `next start` reads `PORT`; the container smoke test verifies the app is reachable through its published loopback port. This does not verify cPanel's proxy configuration.
- Image optimization remains unoptimized.

Verified on 2026-11-24:

- MariaDB versions 11.4.13 and 10.6.28, tested in separate disposable containers and databases.
- Both versions passed fresh `db:migrate` twice, `db:seed`, and `db:hosting-smoke`. This tests customer registration/login/session revocation, published catalog/product detail queries, order lookup, transaction/`FOR UPDATE`, schema indexes/constraints, and recovery after killing a pooled connection.
- The original migration failure and the MariaDB 10.6 timestamp behavior are documented above and corrected in the baseline migrations; these migrations have been tested only on disposable local databases, not deployed to production.
- Node.js 22.23.5 and 24.22.3 both completed production builds from the hardened Dockerfile. Each image starts as the non-root `node` user with production dependencies only, honors an assigned non-default `PORT`, and returns HTTP 200 for `/en`, `/ar`, and `/ar/quote`. Node 22 additionally connected to the disposable MariaDB service and returned `SELECT 1`.

This simulation cannot establish account-specific GoDaddy support or limits. Runtime selector, app-manager startup and port behavior, subdomain binding, MySQL engine/version/grants/connection limits, native image support, resource limits, SSL, persistent cache-directory permissions, and backup procedures remain open.

## cPanel deployment artifact

The current app does **not** enable Next.js `output: "standalone"`; production starts with `npm start` (`next start`) from `apps/store`. The safe runtime package therefore consists of:

- `package.json` and `package-lock.json`;
- production-only `node_modules` installed for the selected account Node version (`npm ci --omit=dev`);
- the complete `.next/` production build and the `public/` directory;
- `next.config.ts` and any other runtime configuration explicitly used by the app.

Build and stage the artifact from `apps/store`; use the application root configured for the Node.js app manager, separate from the WordPress document root. Configure the app manager's startup command as `npm start` and its assigned `PORT`; do not hardcode a port in business logic. Keep `APP_BASE_URL`, `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_CONNECTION_LIMIT`, `SESSION_SECRET`, and `ANALYTICS_ENABLED` in server environment settings, not in the archive. For cPanel MySQL, GoDaddy documents `localhost:3306`, but this account's DB name/grants and actual connection must be verified there.

Do not upload `.env*`, `node_modules` from another OS/Node ABI, local databases, test reports, or development files. Do not assume that `standalone/server.js` or a custom startup file can be selected in this account. Take a verified backup before applying reviewed migrations; retain the old app artifact for rollback and account for forward-only DDL before restoring an older database backup.

The checked-in [drizzle.config.ts](../../apps/store/drizzle.config.ts) intentionally rejects non-loopback database targets and production mode. It is for local generation/verification, not cPanel production migrations. A production schema change is blocked until a separately reviewed migration runner/configuration and operational approval are established; do not bypass this guard or manually alter the migration journal.

## Verification sources and procedure

The official articles above were inspected on 2026-11-24. The GoDaddy product called **Node.js Hosting** is a distinct product and is not treated as evidence for this account's cPanel feature set. Ask GoDaddy support for account-specific values that public documentation does not disclose. Before production deployment, test the Node.js application manager, selected runtime, app startup/port handling, database access, subdomain mapping, and image processing using a staging path or otherwise isolated test that cannot overwrite the corporate WordPress site. Do not infer account-specific capability from another GoDaddy product.
