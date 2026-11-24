# ADR-0003: Use MySQL with Drizzle ORM

- **Purpose:** Record the relational database and query abstraction choice.
- **Audience:** Developers and database operators.
- **Last updated:** 2026-11-24
- **Related docs:** [Data model](../architecture/data-model.md), [Hosting and deployment](../architecture/hosting-and-deployment.md)
- **Status:** Accepted

## Context

The account provides MySQL through cPanel/phpMyAdmin. Commerce requires transactions and normalized relations for customers, catalog, stock, carts, orders, payments, and operational history. The owner selected Drizzle ORM.

## Options considered

1. MySQL with parameterized SQL directly.
2. MySQL with Drizzle ORM and `mysql2`.
3. A different hosted database.

## Decision

Use MySQL through Drizzle ORM and the `mysql2` driver. Keep schema and business operations server-only, version schema changes as committed migrations, and configure the connection using validated environment variables.

## Consequences

- The deployed account must allow the Node.js app to connect to its cPanel MySQL database.
- Database host/port and connection-pool settings remain configurable and must be verified against the account.
- Use explicit transactions and indexes; preserve exact money using integer minor units.
- Migrations are append-only after application.
