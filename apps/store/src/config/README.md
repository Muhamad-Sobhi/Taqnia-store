# Configuration

- **Purpose:** Define the single typed configuration entry point.
- **Audience:** Developers and deployment operators.
- **Last updated:** 2026-11-24
- **Related docs:** [Environment variables](../../../../docs/operations/environment-variables.md), [Hosting and deployment](../../../../docs/architecture/hosting-and-deployment.md)

Read environment variables only through validated server-side configuration. Keep secrets out of client code and fail clearly when required values are missing or invalid.
