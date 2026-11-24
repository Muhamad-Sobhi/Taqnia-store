# Shared Libraries

- **Purpose:** Hold pure, browser-safe helpers and validation schemas shared by UI and server boundaries.
- **Audience:** Developers and AI agents.
- **Last updated:** 2026-11-24
- **Related docs:** [Coding standards](../../../../docs/engineering/coding-standards.md), [Store API](../../../../docs/api/store-api.md)

Add formatters, constants, and Zod schemas here when they do not depend on server-only modules. Keep business workflows in services and avoid secret/environment access from this layer.
