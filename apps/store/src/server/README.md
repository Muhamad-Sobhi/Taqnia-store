# Server

- **Purpose:** Explain the boundary for all server-only modules.
- **Audience:** Backend developers and AI agents.
- **Last updated:** 2026-11-24
- **Related docs:** [Security](../../../../docs/engineering/security.md), [Coding standards](../../../../docs/engineering/coding-standards.md)

Keep database access, business logic, authentication, payment, mail, and authorization on the server. Never import server-only modules into client components or expose secrets through responses.
