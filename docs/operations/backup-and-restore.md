# Backup and Restore

- **Purpose:** Protect store records and provide a safe recovery process.
- **Audience:** Store owners, database operators, and deployment operators.
- **Last updated:** 2026-11-24
- **Related docs:** [Deployment runbook](deployment-runbook.md), [Hosting and deployment](../architecture/hosting-and-deployment.md), [Security](../engineering/security.md)

## Backup requirements

- Take a database backup before migrations, releases affecting schema, and operational changes with material data risk.
- Store backups in an access-controlled location separate from the live hosting account when possible; encrypt backups containing personal data.
- Record backup timestamp, database identity, schema version, and operator. Do not store credentials alongside backups.
- Verify backups by restoring to a non-production database on a regular schedule.

## Restore outline

1. Stop store writes or place the store in a safe maintenance mode.
2. Identify the correct verified backup and expected migration version.
3. Restore into an isolated database first when feasible.
4. Validate orders, customers, inventory movements, payment history, and row counts.
5. Switch only after owner approval; document any lost or replayed transactions.
6. Resume service and monitor errors.

Exact cPanel backup/restore screens, retention, and database-size constraints require account-specific verification before production.
