# Security Policy

- **Purpose:** Explain how to report security issues affecting Taqnia Store.
- **Audience:** Customers, researchers, and maintainers.
- **Last updated:** 2026-11-24
- **Related docs:** [Engineering security](docs/engineering/security.md), [Error handling and logging](docs/engineering/error-handling-and-logging.md)

## Reporting a vulnerability

Report suspected vulnerabilities privately to the Taqnia project owner or the designated security contact. Do not create a public issue or disclose exploit details before the owner confirms a coordinated disclosure plan.

Include affected versions, impact, and safe reproduction notes. Do not include real customer data, credentials, or payment evidence in a report.

## Scope and response

This policy covers the Taqnia Store application and its deployment configuration. The corporate WordPress website is separately operated and is not changed by this repository. The project owner will acknowledge reports and coordinate investigation and remediation.

## Secrets

Never report or commit active secrets in plain text. If a credential is exposed, notify the owner and rotate it immediately.
