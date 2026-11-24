# Testing Strategy

- **Purpose:** Define quality gates and critical customer/admin flow coverage.
- **Audience:** Developers, reviewers, and QA.
- **Last updated:** 2026-11-24
- **Related docs:** [Coding standards](coding-standards.md), [Accessibility](../design/accessibility.md), [CI workflow](../../.github/workflows/ci.yml)

## Test levels

- Unit tests: services, validators, formatters, and pure utilities.
- Component tests: interactive controls and accessible state behavior.
- Integration tests: database-backed workflows against a disposable local/test database.
- Playwright E2E: critical browser journeys in English and Arabic where direction matters.

Current unit tests cover auth validation, password hashing/verification, currency formatting, locale direction, environment error reporting, and search. Playwright covers the English/Arabic storefront, category/search empty states, unpublished-product 404s, account access/login-registration form presentation, and mobile navigation. Axe checks the home page in both locales at four responsive widths and fails on serious or critical WCAG 2.2 A/AA violations. A local-only database integration smoke test covers MariaDB 11.4 and 10.6; there is no connection to the GoDaddy database.

Admin-commerce unit tests cover exact EGP input parsing/range checks and shipping-status transitions. Playwright verifies that the new admin overview, product list, and order list redirect unauthenticated visitors to login. The `db:hosting-smoke` command verifies fresh migration tracking, schema constraints, customer registration/login/session revocation, product catalog/detail queries, order lookup, transactions, row locks, and connection recovery. It does not create an administrator or test authenticated admin persistence workflows; those remain separate test needs.

## Critical E2E scenarios

1. Browse products, navigate categories, and search.
2. Add items as a guest, register or log in, and verify cart preservation (pending M5 cart implementation).
3. Reject checkout for a guest and create an order for an authenticated customer.
4. Checkout with COD, electronic wallet, and InstaPay manual-payment states.
5. Keep transfers pending verification until an authorized administrator confirms them.
6. Admin records shipping agreement and fee, then advances shipment status.
7. Customer can view only their own profile, addresses, and order history.
8. Admin creates/edits products and category-scoped attributes.
9. Legal draft warning is visible and deployment checklist blocks launch.

### Quote request UI tests and planned submission tests

The current UI-only E2E coverage verifies both localized unavailable pages, `noindex`, canonical/hreflang metadata, no form, Arabic RTL screenshot attachment, and bare-route redirects with valid and invalid prefill data.

- Assert exact HTTP and UI outcomes for `delivered` (201), `not_configured` (503), failed/throwing notifier (500/502), timeout/unknown outcome (504), validation/honeypot (400), and rate limiting (429).
- Assert that `NotConfiguredNotifier`, including the production default, can never produce a success response or UI.
- Assert no submitted value appears in notifier output, route responses, logs, traces, or test output.
- E2E with delivery disabled: submit valid synthetic data and verify the unavailable state, no success/reference, and in-memory input retention for retry.
- Verify field errors and request-result messages are localized, associated with controls, announced via `aria-live`, and focused accessibly.
- Verify all quote entry points are absent when the feature flag is off or delivery is unconfigured; with a test-only delivered notifier, verify each configured placement appears only when enabled.
- When entry points are authorized, verify each preserves `/en` or `/ar`; the current `/quote` redirect filtering is covered by E2E tests.
- Keep quote routes out of a future sitemap while unavailable; current tests verify localized metadata, canonical/hreflang, and `noindex`.
- Future quote-management tests must cover multiple products and quantities, historical displayed-price snapshots, independent per-product confirmed prices, status transitions, communication history, and explicit quote approval.
- Future Sales Order conversion tests must prove that customer approval is required, agreed quantities and confirmed prices are transferred, the quote reference remains traceable, and duplicate conversion cannot create a second Sales Order.

The Phase 2 mock prototype component tests cover quote filtering, historical-versus-confirmed price display, temporary pricing edits, conversion blockers, and Arabic rendering. E2E coverage must add protected bilingual admin routes after a test administrator/session strategy is available; the prototype must not weaken route protection or create public mock-data APIs.

- Assert `DevMetadataNotifier` returns `not_configured` and produces 503/unavailable UI in development; assert its logs contain only approved metadata and no submitted values.
- Exercise success UI only with `FakeDeliveredNotifier` located under tests; fail lint/build if a delivered notifier or test fake is imported from production code.
- Use synthetic values such as `Test User` and `test@example.invalid`; never commit real personal data.

## Quality gates

CI runs install, migration-history check, dependency audit, lint, typecheck, unit/component tests, production build, and E2E smoke tests. The hosting database smoke is run manually against fresh disposable MariaDB versions and is not part of CI. Add it to CI only when a safe disposable service is provisioned there. Do not weaken tests to hide genuine failures; document environment-dependent exclusions.
