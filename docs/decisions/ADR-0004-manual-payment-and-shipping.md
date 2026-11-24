# ADR-0004: Launch with Manual Payment and Shipping Workflows

- **Purpose:** Record the version 1 payment and fulfillment integration boundary.
- **Audience:** Taqnia owners, administrators, and developers.
- **Last updated:** 2026-11-24
- **Related docs:** [Request flows](../architecture/request-flows.md), [Security](../engineering/security.md), [Store API](../api/store-api.md)
- **Status:** Accepted

## Context

At launch, Taqnia will accept Cash on Delivery, electronic wallets, and InstaPay. Staff will communicate with customers, confirm transfer evidence, agree delivery fees, and update order records manually. There is no initial payment gateway or shipping provider integration.

## Options considered

1. Integrate gateways and carriers before launch.
2. Implement manual workflows behind payment and shipping abstractions, then add providers later.

## Decision

Implement a manual payment workflow and manually managed shipping details. Transfers remain unverified until an authorized administrator records verification. COD has its own payment state. Admin changes are audited.

## Consequences

- Operational procedures and administrator authorization are critical.
- Customer-submitted screenshots/references are not authoritative payment confirmation.
- Shipping fee updates change the confirmed order total and must be audited.
- Provider interfaces should permit later automation without changing order ownership or core commerce rules.

## Current implementation boundary

The admin UI now supports reviewing existing order snapshots, changing shipping status/fee/details, recording payment verification, and adding internal notes. Each mutation requires its specific server-side permission and writes an actor/timestamp history record. Transfer payments require verification notes before being marked paid; COD is marked paid only after delivery.

The order tables are in a separate generated migration, verified only against fresh disposable MariaDB 11.4 and 10.6 databases. The migration has not been applied to production. Checkout, order creation, customer order history, notifications, and provider integrations remain unimplemented. This admin foundation does not activate or imply production readiness.

The current payment safeguards require administrator verification notes before marking a transfer paid and prevent COD from being marked paid before delivery. A complete allowed-transition matrix for every payment status has not been approved; do not infer additional transitions from the enum values alone.
