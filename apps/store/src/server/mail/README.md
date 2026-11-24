# Mail

- **Purpose:** Isolate order/account message delivery behind a mailer interface.
- **Audience:** Backend developers and operations staff.
- **Last updated:** 2026-11-24
- **Related docs:** [Environment variables](../../../../../docs/operations/environment-variables.md), [Request flows](../../../../../docs/architecture/request-flows.md)

Use a console implementation locally and a configured mail transport in production. Never log credentials, full personal data, or sensitive payment evidence.
