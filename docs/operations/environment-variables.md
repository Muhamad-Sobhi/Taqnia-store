# Environment Variables

- **Purpose:** Define server configuration names, purpose, secret status, and validation rules.
- **Audience:** Developers and deployment operators.
- **Last updated:** 2026-11-24
- **Related docs:** [Hosting and deployment](../architecture/hosting-and-deployment.md), [Deployment runbook](deployment-runbook.md), [Security](../engineering/security.md)

## Configuration inventory

The application validates runtime and database configuration in the server-only entry point (`src/config/env.ts`). Keep these values in cPanel environment configuration; never put credentials in browser-exposed variables.

| Variable                    | Purpose                                                                                                     | Example                       | Required          | Secret |
| --------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------- | ----------------- | ------ |
| `NODE_ENV`                  | Runtime environment                                                                                         | `production`                  | Platform-provided | No     |
| `PORT`                      | Port assigned by the Node app manager                                                                       | `3000`                        | Yes in hosting    | No     |
| `APP_BASE_URL`              | Canonical store origin                                                                                      | `https://store.taqnia-eg.net` | Yes               | No     |
| `DATABASE_HOST`             | MySQL hostname (GoDaddy documents `localhost` for cPanel apps)                                              | `localhost`                   | Yes               | No     |
| `DATABASE_PORT`             | MySQL port (GoDaddy documents `3306` for cPanel apps)                                                       | `3306`                        | Yes               | No     |
| `DATABASE_NAME`             | cPanel database name                                                                                        | `<from cPanel>`               | Yes               | No     |
| `DATABASE_USER`             | Least-privilege database user                                                                               | `<from cPanel>`               | Yes               | No     |
| `DATABASE_PASSWORD`         | Database credential                                                                                         | `<secret>`                    | Yes               | Yes    |
| `DATABASE_CONNECTION_LIMIT` | Per-process MySQL pool size; capped by schema validation and to be tuned after account limits are confirmed | `3`                           | No; defaults to 3 | No     |
| `SESSION_SECRET`            | Session/signing secret                                                                                      | `<random secret>`             | Yes               | Yes    |
| `ANALYTICS_ENABLED`         | Explicit opt-in for future analytics wrapper                                                                | `false`                       | No; defaults off  | No     |

Never commit actual secret values. `.env.example` contains placeholders only. Use a randomly generated `SESSION_SECRET` of at least 32 characters. Database values in CI and local migration checks are placeholders and do not establish GoDaddy connectivity. No email transport variables are currently supported; password-reset delivery is not available until that integration is implemented.

The pool reuses up to three connections by default, keeps up to the configured connection count idle, drops idle connections after 60 seconds, and has a 10-second connection-establishment timeout. Its request queue is bounded to four times the pool size (12 by default). These are application-side limits per Node.js process; they do not establish GoDaddy's account-wide MySQL connection limit.

The development-only `db:admin:create` utility prompts for the administrator email and phone and reads the password without terminal echo. Do not pass passwords through shell arguments or environment variables. The command refuses non-development settings, non-localhost app URLs, non-loopback MySQL hosts, and database names without a `_local` or `_dev` suffix. It only creates the first local administrator and never prints credentials.

The Drizzle migration configuration and seed command are restricted to loopback databases in development/test mode. Development databases must end in `_local` or `_dev`; test mode also permits `_test`. Production schema changes require a separate reviewed deployment procedure and must not use these local commands.

## Planned quote feature configuration (not implemented)

`QUOTE_DELIVERY_ENABLED` is planned as a non-secret boolean that defaults to `false`. It is not currently recognized by `src/config/env.ts` and is not present in `.env.example`; do not configure or enable it until the owner authorizes implementation and an approved notifier is available.

The owner confirmed `email_required` for a future quote form; this is a business rule, not a runtime setting. SKU prefill is limited to 1–120 ASCII letters, digits, `.`, `_`, or `-`, matching the current product SKU column's maximum length. Public sales phone, WhatsApp, and email values are planned as optional content configuration, empty by default, not as environment-variable defaults.
