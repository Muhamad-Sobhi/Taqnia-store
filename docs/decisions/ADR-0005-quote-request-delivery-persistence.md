# ADR-0005: Quote Request Delivery and Persistence

- **Status:** Business workflow approved; safe dashboard planning authorized; UI-only milestone completed; persistence, submission, delivery, and conversion blocked
- **Decision owners:** Taqnia Store project
- **Related docs:** [Request flows](../architecture/request-flows.md), [Store API](../api/store-api.md), [Security](../engineering/security.md), [Launch checklist](../operations/launch-checklist.md)

## Context

Quote requests are a separate lead flow, not checkout or an order. Visitors may eventually submit without an account; an authenticated customer's name and email may be prefilled and remain editable. The owner confirmed `email_required`: a future form requires full name, email, message, and an unchecked privacy-consent checkbox; phone, company, product name/SKU, category, and quantity are optional. Attachments, marketing consent, address, budget, and job title are excluded from v1.

The approved quote-management workflow is:

1. Customers view publicly displayed product prices.
2. Customers select one or more products and specify an individual quantity for each product.
3. Customers provide contact information and submit the request.
4. The request enters the administration dashboard for review. It does not create a purchase or Sales Order.
5. Administration reviews products, SKUs, quantities, availability, and the prices displayed when the request was submitted.
6. Administration determines a separate confirmed price for every quoted product.
7. Assigned staff contact the customer through phone call, WhatsApp, or email and record negotiation communication.
8. Explicit customer approval allows conversion to a Sales Order. Decline or non-conclusion allows rejection or closure.

A quote is a pricing and negotiation record, not a confirmed purchase. Public catalog prices are informational for the initial request; the final price is always a manual administration decision.

## Approved management requirements

The administration dashboard must conceptually provide:

- All Requests
- New Requests
- Under Review
- Waiting for Customer
- Approved
- Rejected
- Archived

Each quote request must preserve:

- Unique Quote Reference Number
- Customer information
- Requested products
- Product SKUs
- Requested quantity for each product
- Displayed product price captured at submission
- Confirmed product price determined for each product
- Request submission date
- Current request status
- Internal administration notes
- Communication history
- Assigned employee

The displayed price and confirmed price are separate values. The displayed price is a historical snapshot associated with the request and must not change when catalog prices change. The confirmed price is manually set by administration and may differ independently for each product in the request. A clear history of confirmed-price changes and review decisions must be retained.

Communication history must record the channel (phone call, WhatsApp, or email), communication date, assigned employee, communication outcome, and internal notes. The system may document these interactions conceptually but must not integrate a messaging or email provider in this milestone.

After explicit customer approval, administration may convert the quote into a Sales Order. The conversion must transfer the requested products, agreed quantities, and confirmed prices; preserve the original Quote Reference Number for traceability; and prevent duplicate Sales Order creation from the same quote. Conversion is a separate authorized action and never occurs during quote submission.

The form may accept non-personal `sku` and `category` prefill query parameters only. Personal data must be submitted with POST, must not appear in URLs, and must not be persisted or logged under the current approval. No quote-request table, migration, email transport, third-party integration, or real delivery implementation is authorized.

The localized unavailable-page routes are `/en/quote` and `/ar/quote`. Bare `/quote` redirects to the default locale using the same mechanism as the storefront root, preserving only valid non-personal `sku` and `category` parameters. SKU prefill accepts 1–120 ASCII letters, digits, `.`, `_`, or `-`; category must match a known category slug. The UI-only pages and redirect are implemented. They are `noindex`, have localized canonical/hreflang metadata, contain no form, and have no entry points. The language-neutral API is a future `POST /api/quote`, with locale supplied and validated in the JSON body.

## Interim constraints

- Keep all quote entry points hidden. `QUOTE_DELIVERY_ENABLED` is a future setting, not implemented in runtime configuration.
- The current direct page always shows an unavailable state, is `noindex`, and has no form or success state. No submission is accepted.
- Only a notifier-confirmed delivery or persistence may produce HTTP 201 and a success UI. Show a reference only if a request was actually persisted.
- Keep submitted values in browser memory only. Retain them in that memory after recoverable failures; clear them after confirmed success. Never use local/session storage, cookies, caches, queues, files, or a database for submissions.
- Do not log submitted values. `DevMetadataNotifier` is active only in development and may log only a submission ID, timestamp, locale, submitted field names, and value lengths. It always returns `not_configured`; metadata logging is not delivery or persistence. It therefore produces HTTP 503 and no success UI in every environment.
- Success-state tests use `FakeDeliveredNotifier` only from the tests tree. Production code must not import it or any notifier that returns `delivered`.
- Do not create a quote schema or implement real submission handling until the owner approves the storage/delivery workflow and outstanding privacy decisions.

## Delivery and persistence options under consideration

| Option              | Benefits                                                                    | Trade-offs and questions                                                                                                                     |
| ------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Email via SMTP      | Familiar operational workflow; no customer-facing admin queue required.     | Requires an approved recipient, SMTP credentials, delivery monitoring, retries, and a retention/deletion policy for mailbox copies.          |
| Database storage    | Enables a protected admin queue, status tracking, and controlled retention. | Requires an approved schema, migrations, role checks, access audit, backup/deletion rules, and a retention policy. No table is approved now. |
| Database plus email | Durable request record plus prompt notification.                            | Adds consistency, retry/outbox, duplicate-delivery, and retention complexity; determines which copy is authoritative.                        |
| Third-party service | May provide managed delivery and spam protection.                           | Requires vendor, data-transfer, privacy, access, cost, retention, and secret-management review. No provider is approved.                     |

No option is selected by this ADR.

## Proposed interface and outcomes

The application will define a `LeadNotifier` boundary with outcomes that distinguish `delivered`, `not_configured`, and `failed`; timeout must be identifiable as an unconfirmed failure. `NotConfiguredNotifier` is the default in every environment. `DevMetadataNotifier` is active only in development, logs only the approved metadata, and always returns `not_configured`. It must therefore produce HTTP 503 and unavailable UI in development as well as production. It is never a success path.

Success-state tests use a `FakeDeliveredNotifier` that lives under the tests tree only. Add a test/lint guard against importing it, or any notifier that returns `delivered`, from production code paths.

The proposed API is `POST /api/quote`. The status mapping is documented in the [Store API contract](../api/store-api.md); it is planned, not implemented. Failure responses must use the standard error envelope and must not echo submitted values.

## Open decisions required before implementation

- Approve and verify the official recipient email address.
- Approve the customer data retention and deletion policy.
- Select and configure CAPTCHA and approve the provider/configuration.
- Set input field length limits.
- Define the rate limiting policy and privacy-safe enforcement strategy.
- Define the idempotency strategy.
- Define employee and administrator permissions.
- Define customer data access controls.
- Select the delivery/persistence option and an approved team/role recipient. No employee mailbox or public contact detail may be invented.
- Approve the response-time promise, or approve that no response-time wording is shown.
- Approve the privacy notice and consent wording, including legal review.
- Set backup and personal-data logging policies.
- Choose request-size and per-field length limits and a privacy-safe rate-limit store/key strategy for per-IP and per-email limits.
- Decide how idempotency is enforced and whether a deployment-provided shared store is available on cPanel.
- Approve Arabic CTA/consent/error copy. Add a shared locale-aware link helper when quote entry points are authorized.
- Confirm that a configured production provider can be exercised end-to-end before enabling the feature flag.

## Implementation category boundary

### Safe work

- Quote dashboard UX and information architecture.
- Static or clearly marked mock quote administration screens.
- Page structure and reusable component specifications.
- Status lifecycle and transition specifications.
- Communication-history interface specifications without persistence.
- Proposed permission matrix.
- Proposed API contract documentation.
- English/Arabic copy specifications and RTL/LTR/accessibility requirements.

### Work requiring approval

- Database schema and migrations.
- Persistent quote services.
- Customer submission form and POST endpoint.
- Customer personal-data storage.
- Delivery integrations.
- CAPTCHA and public anti-abuse controls.
- Rate limiting and idempotency.
- Sales Order conversion.
- Production activation.

The safe category is implementation-independent planning only. Any prototype must clearly use synthetic, non-production data and must not expose a submission or conversion action.

This ADR records a proposed boundary and constraints only. It does not authorize implementation of real submissions, delivery, persistence, or a production notifier.
