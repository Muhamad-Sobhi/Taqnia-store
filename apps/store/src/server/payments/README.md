# Payments

- **Purpose:** Isolate payment workflows and future provider integrations.
- **Audience:** Backend developers and authorized store administrators.
- **Last updated:** 2026-11-24
- **Related docs:** [ADR-0004](../../../../../docs/decisions/ADR-0004-manual-payment-and-shipping.md), [Security](../../../../../docs/engineering/security.md)

The initial implementation supports COD, electronic wallets, and InstaPay through manual verification. Customer references/proofs remain unverified until an authorized administrator records verification.
