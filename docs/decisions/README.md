# Architecture Decision Records

- **Purpose:** Index significant architecture decisions and their current status.
- **Audience:** Taqnia stakeholders, reviewers, and developers.
- **Last updated:** 2026-11-24
- **Related docs:** [System overview](../architecture/system-overview.md), [Roadmap](../00-overview/roadmap.md)

| ID                                                         | Decision                                                                                                                                | Status                                             |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| [ADR-0001](ADR-0001-store-and-corporate-separation.md)     | Keep the store separate from the existing WordPress corporate site.                                                                     | Accepted                                           |
| [ADR-0002](ADR-0002-dynamic-nextjs-store.md)               | Use a dynamic Next.js app for commerce functionality.                                                                                   | Accepted, subject to hosting verification          |
| [ADR-0003](ADR-0003-mysql-with-drizzle.md)                 | Use MySQL through Drizzle ORM.                                                                                                          | Accepted                                           |
| [ADR-0004](ADR-0004-manual-payment-and-shipping.md)        | Use manual payment verification and shipping agreement workflows at launch.                                                             | Accepted                                           |
| [ADR-0005](ADR-0005-quote-request-delivery-persistence.md) | Record the approved quote workflow and block persistence, delivery, submission, and conversion until unresolved decisions are approved. | Business workflow approved; implementation blocked |

Use the [ADR template](ADR-0000-template.md) for additional significant decisions.
