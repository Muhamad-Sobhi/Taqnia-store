# Roadmap

- **Purpose:** Track delivery milestones and release dependencies for Taqnia Store.
- **Audience:** Taqnia owners, project contributors, developers, and AI agents.
- **Last updated:** 2026-11-24
- **Related docs:** [Project brief](project-brief.md), [Assumptions](assumptions.md), [Deployment runbook](../operations/deployment-runbook.md)

## Milestones

| Milestone                               | Scope                                                                                                                               | Status                              | Exit criteria                                                                                       |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------- |
| M0 — Discovery and hosting verification | Confirm scope, inspect logo, document verified GoDaddy facts and open questions.                                                    | Complete                            | Source-backed hosting report exists; account-specific items remain explicit and isolated.           |
| M1 — Repository foundation              | Store-only scaffold, tooling, CI, coding-agent instructions, docs, ADRs, and cPanel-compatible configuration.                       | Complete                            | Install/lint/typecheck/test/build and E2E smoke checks work locally and in CI.                      |
| M2 — Design system                      | Logo colors, Inter/Cairo, RTL/LTR, responsive light theme, reusable accessible UI foundations.                                      | Complete                            | Token documentation and tested UI foundation.                                                       |
| M3 — Storefront                         | Product-first homepage, categories, listing/detail, search/filter, navigation, product content placeholders.                        | Complete                            | Responsive store discovery flows work; no corporate marketing site is introduced.                   |
| M4 — Store foundation                   | Validated config, Drizzle/MySQL schema and migrations, seed setup, customer auth, catalog services and product admin UI.            | In progress                         | Complete auth/profile foundations, permission boundaries, flexible attributes, and tested DB setup. |
| M5 — Commerce operations                | Guest cart merge, checkout/order creation, manual payment verification, manual shipping, notifications, and customer order history. | In progress (admin foundation only) | E2E coverage for cart-to-order and admin operations; every order is customer-owned.                 |
| M6 — Hardening                          | Security, accessibility, performance, SEO, error handling, and critical-flow E2E.                                                   | Planned                             | Acceptance checks and service coverage goals pass or documented exceptions are approved.            |
| M7 — Production readiness               | Verify hosting with GoDaddy, deploy/runbook rehearsal, policy approval, backups, handover.                                          | Planned                             | Production checklist complete; legal placeholders removed; rollback tested.                         |

## Current dependencies and blockers

- M1 may proceed with configurable host, port, runtime, and DB settings. Do not claim production compatibility until the cPanel account's Node app manager, runtime, subdomain, and database connection are tested.
- M2 must use the existing logo palette documented in [the design system](../design/design-system.md).
- M4–M5 depend on actual payment instructions, admin roster, catalog data, and operational contact details from the owner.
- M4 has the original 19-table migration, seed, customer registration/login/session foundations, authorization helpers, published-catalog queries, and a product-management UI. The schema now includes a separate generated six-table order migration and an admin UI for managing existing orders. Neither migration has been applied to MySQL. Checkout/order creation, cart workflows, customer order history, password-reset delivery, rate limiting, editable account details/addresses, and database-backed integration coverage remain incomplete. GoDaddy connectivity/limits are unverified.
- Local admin provisioning is available only in development through `npm run db:admin:create`; it requires a user-supplied password and refuses non-local configuration. No default administrator credentials are created.
- M7 is blocked until approved privacy, terms, refund/return, shipping/delivery, and (if required) cookie policy text replaces the legal drafts.
- No production launch is permitted with sample catalog data represented as real inventory.

## Quote management planning and implementation gates

The Quote Management System is split so that planning and non-production design can proceed without resolving or assuming blocked persistence, security, or delivery decisions.

### A. Safe work that may proceed

- Design the protected administration dashboard, navigation, quote-list, details, pricing-review, communication, and conversion-review information architecture.
- Define responsive English/Arabic, RTL/LTR, keyboard, loading, empty, success, and error states using static or clearly marked mock data.
- Define reusable admin components: status summary cards, filter/search controls, request table, detail summary, line-item pricing table, status timeline, internal notes, communication timeline, assignment control, and confirmation dialog.
- Specify quote statuses and valid transitions.
- Propose an employee/administrator permission matrix for review and approval.
- Document proposed API shapes and route responsibilities without implementing Route Handlers.
- Define test scenarios, accessibility expectations, and RTL screenshot coverage using synthetic data.

This work must remain non-production and must not add database tables, migrations, server endpoints, forms, persistence, delivery integrations, feature flags, CAPTCHA, rate limits, or idempotency behavior.

### B. Work that requires explicit approval

The following work is blocked:

- Quote persistence and MySQL schema or migrations.
- Public customer submission form and POST handler.
- Customer personal-data storage or retention.
- Official recipient, email, WhatsApp, or other delivery integration.
- CAPTCHA provider/configuration.
- Public submission rate limiting and storage.
- Idempotency behavior.
- Final employee/administrator permissions and customer data access controls.
- Personal-data logging and backup policy.
- Actual Sales Order conversion and production activation.

No blocked item may be implemented with a default, placeholder provider, inferred recipient, or undocumented security policy.

### Revised quote implementation roadmap

| Phase                                        | Safe or gated scope                                                                                                         | Dependency and exit criterion                                                                               |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| QP1 — Information architecture and lifecycle | Dashboard IA, status model, transitions, protected-page structure, and reusable-component inventory.                        | Safe now. Exit: documentation and synthetic wireframes are internally consistent and reviewed.              |
| QP2 — Admin interaction specifications       | Details, pricing review, communication history, assignment, notes, status changes, and conversion review mock interactions. | Safe only as static/mock UX. Exit: English/Arabic and RTL states are specified with no persistence.         |
| QP3 — Permission and API specifications      | Proposed permission matrix and non-implemented API contracts.                                                               | Safe for proposal only. Exit: every operation has a proposed role boundary and approval remains documented. |
| QP4 — Persistence decision                   | Quote schema, migrations, indexes, constraints, retention, and backup behavior.                                             | Blocked by persistence, retention, access, and backup approvals.                                            |
| QP5 — Public submission activation           | Form, POST handler, validation, CAPTCHA, rate limiting, idempotency, and delivery/persistence.                              | Blocked by persistence, CAPTCHA, anti-abuse, delivery, retention, privacy, and recipient decisions.         |
| QP6 — Internal quote services                | Dashboard queries, status transitions, pricing history, communication history, assignments, and audit records.              | Requires QP4 and approved permissions.                                                                      |
| QP7 — Sales Order conversion                 | Explicit approval record, transactional transfer, traceable quote reference, duplicate-conversion constraint.               | Requires QP4, approved conversion authorization, and an existing or approved Sales Order architecture.      |
| QP8 — Hardening and activation               | Integration tests, security tests, E2E, accessibility, backup rehearsal, and production gate.                               | Requires all prior decisions and separate production-activation approval.                                   |

### Dashboard information architecture

- `Quote Dashboard`
  - Summary totals for All, New, Under Review, Waiting for Customer, Approved, Rejected, and Archived.
  - Recent activity and status distribution.
  - Search, date, assignee, and status filters.
- `Quote Requests`
  - Status-based navigation.
  - Search, filter, sort, and pagination.
  - Reference, customer, submission date, product count, quantity total, status, assignee, and actions.
- `Quote Details`
  - Customer and contact information.
  - Requested line items with SKU, requested quantity, displayed unit price, confirmed unit price, and line total.
  - Request metadata, status timeline, assignee, internal notes, and communication history.
- `Pricing Review`
  - Current catalog availability and catalog price as review context.
  - Independent displayed-price snapshot and editable confirmed-price proposal.
  - Product-level difference and confirmed-price history.
- `Communication`
  - Manual communication record entry for phone, WhatsApp, or email.
  - Channel, date, employee, outcome, and internal notes.
- `Sales Order Conversion`
  - Customer approval evidence, line-item review, confirmed-price review, and explicit confirmation.
  - Traceability and duplicate-conversion warning; no automatic conversion.

### Proposed lifecycle

`New` -> `Under Review` -> `Waiting for Customer` -> `Approved`

`New`, `Under Review`, or `Waiting for Customer` may transition to `Rejected` or `Archived`. `Approved` should not be silently changed back by a normal user action. Rejected and Archived records remain traceable. A status transition must record the employee, timestamp, old status, new status, and optional notes. Pricing review does not equal customer approval.

The proposed status aliases in the dashboard are New Requests, Under Review, Waiting for Customer, Approved, Rejected, and Archived.

### Proposed reusable components

- Admin shell and locale switch.
- Quote summary card.
- Status badge and status distribution.
- Quote search/filter toolbar.
- Quote table with pagination.
- Quote detail header and metadata panel.
- Customer contact panel.
- Quote line-item table.
- Pricing snapshot and confirmed-price editor.
- Price-history timeline.
- Communication-history timeline.
- Communication record form.
- Assignment selector.
- Internal-notes panel.
- Status-transition dialog.
- Duplicate-conversion guard.
- Empty, loading, error, and permission-denied states.

These components are design and architecture proposals until approved implementation begins.

### Phase 2 implementation status

The mock Quote Management Admin Dashboard prototype is implemented as a protected bilingual UI prototype. It uses the existing `admin` role as the safest available route guard; no quote-specific permission matrix or role is created.

Implemented prototype areas include the overview and status distribution, filterable and paginated quote list, quote details, local confirmed-price calculations, local status-transition rules, read-only communication history, temporary notes, and disabled Sales Order conversion preview.

Mock operations remain in component memory or isolated static fixtures. They do not call APIs, mutate databases, send communications, create Sales Orders, or persist customer data. The public quote routes remain unchanged and unavailable.
