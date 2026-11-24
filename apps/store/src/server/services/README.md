# Services

- **Purpose:** Keep commerce and account business rules independent from UI and transport.
- **Audience:** Backend developers and AI agents.
- **Last updated:** 2026-11-24
- **Related docs:** [Request flows](../../../../../docs/architecture/request-flows.md), [Testing strategy](../../../../../docs/engineering/testing-strategy.md)

Services own catalog, cart, auth, checkout, inventory, order, and admin rules. They validate domain invariants, enforce customer ownership/admin roles, and are covered by unit/integration tests.
