# Taqnia Store Application

- **Purpose:** Explain local development and verification for the store application.
- **Audience:** Developers and approved contributors.
- **Last updated:** 2026-11-24
- **Related docs:** [Root README](../../README.md), [AGENTS.md](../../AGENTS.md), [Hosting and deployment](../../docs/architecture/hosting-and-deployment.md)

This is the only application in this repository. It serves the e-commerce store at `store.taqnia-eg.net`; it does not build or modify the separate WordPress corporate website.

## Local setup

```bash
npm ci
cp .env.example .env
npm run dev
```

The current storefront pages use the approved static category and empty-catalog content, so they can be browsed without a database. The database-backed admin catalog and authentication require a reachable, dedicated local MySQL database and valid server settings in `.env`; replace the example database credentials and generate a unique `SESSION_SECRET` before using them. The public catalog has not yet been connected to the database-backed catalog service. Initialize only a verified local development database with:

```bash
npm run db:migrate
npm run db:seed
```

The migration and seed commands refuse non-loopback hosts and database names that do not end in `_local` or `_dev` (test mode allows `_test`). The seed creates categories and customer/admin roles, but no administrator account or product inventory. Never point local migration or seed commands at production or the WordPress database.

To provision the first local administrator after migrating and seeding the local database, run:

```bash
npm run db:admin:create
```

The command requires `NODE_ENV=development`, an `APP_BASE_URL` on localhost, and a verified loopback database ending in `_local` or `_dev`. It prompts for email and phone and reads the password without echoing it. It refuses to create a second administrator, prints no credentials, and is not a production provisioning tool. Sign in at `/{locale}/account/login`, then open `/{locale}/admin`.

## Commands

| Purpose                            | Command                             |
| ---------------------------------- | ----------------------------------- |
| Development                        | `npm run dev`                       |
| Lint                               | `npm run lint`                      |
| Typecheck                          | `npm run typecheck`                 |
| Unit/component tests               | `npm test`                          |
| End-to-end tests                   | `npm run test:e2e`                  |
| Production build                   | `npm run build`                     |
| Production start                   | `npm start`                         |
| Start disposable hosting database  | `npm run hosting:simulation:up`     |
| Start separate MariaDB 10.6 target | `npm run hosting:compat:106:up`     |
| Run database compatibility checks  | `npm run db:hosting-smoke`          |
| Build/start Node 24 app simulation | `npm run hosting:simulation:app`    |
| Show simulation status             | `npm run hosting:simulation:status` |
| Stop simulation containers         | `npm run hosting:simulation:down`   |
| Apply local migration              | `npm run db:migrate`                |
| Seed local roles/categories        | `npm run db:seed`                   |
| Provision local admin              | `npm run db:admin:create`           |
| Format                             | `npm run format`                    |

The order migration has been tested on disposable MariaDB 11.4 and 10.6 databases. There is still no checkout or order-creation workflow; the order admin pages require explicitly created test records to show data.

## Deployment

Use the full Next.js server; do not enable static export. `next start` reads the assigned `PORT` environment variable. Image optimization is configured as unoptimized while GoDaddy native `sharp` support remains unverified. Consult the hosting report and runbook before any cPanel deployment.

## GoDaddy cPanel hosting simulation

The repository includes a disposable local simulation for cPanel-style Node and MariaDB hosting:

```bash
cp .env.hosting-simulation.example .env.local
npm run hosting:simulation:up
npm run db:migrate
npm run db:migrate
npm run db:seed
npm run db:hosting-smoke
npm run hosting:simulation:app
curl -I http://127.0.0.1:3310/en
npm run hosting:simulation:status
npm run hosting:simulation:down
```

The simulation defaults to MariaDB 11.4 on loopback port `3307` and Node.js 24 on loopback port `3310`. `npm run hosting:compat:106:up` starts a separate MariaDB 10.6 project on port `3308`; override `DATABASE_PORT=3308` when running its migration, seed, and smoke commands. Both use `tmpfs`, not persistent or reused database volumes. The app runtime image installs production dependencies only and runs as an unprivileged user. Example database and session values are local-only placeholders, not production secrets.

Use this only for compatibility rehearsal. It does not verify the selected account runtime, cPanel port forwarding, subdomain binding, database grants, resource limits, or native `sharp` support.
