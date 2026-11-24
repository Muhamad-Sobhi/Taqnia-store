# Store API

- **Purpose:** Inventory and document all store Route Handlers and their contracts.
- **Audience:** Frontend developers, backend developers, and API consumers.
- **Last updated:** 2026-11-24
- **Related docs:** [Request flows](../architecture/request-flows.md), [Security](../engineering/security.md), [Error handling](../engineering/error-handling-and-logging.md)

## Status

No business Route Handlers are implemented. The quote endpoint below is a proposed contract only; it is not implemented and must not accept real submissions until delivery and privacy decisions are approved. Admin product and order pages use server-rendered routes and protected Server Actions; they do not expose public API endpoints.

## Implemented administration pages

| Page                                        | Authorization                     | Behavior                                                                                   | Status                                         |
| ------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| `/{locale}/admin`                           | Existing `admin` role route guard | Store administration navigation                                                            | Implemented                                    |
| `/{locale}/admin/products`                  | `catalog.manage`                  | Search and paginate products                                                               | Implemented                                    |
| `/{locale}/admin/products/new`              | `catalog.manage`                  | Create bilingual product, default SKU, category assignments, EGP price, and catalog status | Implemented                                    |
| `/{locale}/admin/products/{productId}/edit` | `catalog.manage`                  | Edit the same product fields                                                               | Implemented                                    |
| `/{locale}/admin/orders`                    | `orders.manage`                   | Filter and paginate existing orders                                                        | Implemented; no checkout/order creation exists |
| `/{locale}/admin/orders/{orderNumber}`      | `orders.manage`                   | View order snapshots and status/audit history                                              | Implemented                                    |

Product saves use a Server Action and exact decimal-string-to-integer EGP parsing. Order updates use separately authorized Server Actions: `shipping.manage` for audited shipping/status changes, `payments.verify` for manual payment verification, and `orders.manage` for internal notes. No endpoint creates an order. The order migration and local auth/catalog/order query behavior have been verified against disposable MariaDB 11.4 and 10.6 databases; no production database has been touched.

## Required endpoint documentation

For every endpoint, record method, path, authentication/role, request Zod schema, response schema, status codes, error codes, rate-limit policy, side effects, and relevant service.

| Method | Path         | Auth                              | Purpose                                                    | Status                    |
| ------ | ------------ | --------------------------------- | ---------------------------------------------------------- | ------------------------- |
| POST   | `/api/quote` | Public; guest submissions allowed | Submit a quote request, separate from checkout and orders. | Proposed; not implemented |

### Proposed quote request contract

The UI-only unavailable pages are `/en/quote` and `/ar/quote`; they contain no form and are `noindex`. Bare `/quote` redirects to `/en/quote` using the existing root-route default-locale mechanism and preserves only valid `sku` and `category` query parameters. SKU prefill accepts 1–120 ASCII letters, digits, `.`, `_`, or `-`; category must be a known category slug. The language-neutral API is a future `/api/quote`; include `locale` in the JSON body and validate it against supported locales.

Request: JSON POST with locale, full name, email, message, and `consent: true`; optional company, phone, product name/SKU, category, and positive-integer quantity. Include the honeypot field and an `Idempotency-Key` header. Signed-in name/email may be prefilled in the browser, but submissions are not linked to customer accounts, carts, or orders. Do not put personal data in query strings; only non-personal `sku` and `category` may be prefill parameters. Validate `sku`/`category` length and allowed characters, require category membership, and silently ignore invalid prefill values without echoing them.

The approved future form business model supports one or multiple requested products. The future request representation must provide a list of product or variant identifiers/SKUs and a positive requested quantity for each line. It must capture each displayed price at submission. It must not accept customer-submitted confirmed prices or Sales Order creation instructions. A quote submission has no purchase or order side effect.

For a future submission form, validate with Zod on both client and server, trim values, validate phone only when present, bound body size, and length-limit every field. Exact form field limits are not yet approved. The owner confirmed `email_required`; email is required and phone is optional.

| Outcome                                     |       HTTP | Response and UI rule                                                                                                 |
| ------------------------------------------- | ---------: | -------------------------------------------------------------------------------------------------------------------- |
| Notifier confirms delivery or persistence   |        201 | Success UI only after confirmation. Include a reference only if the request was actually persisted.                  |
| Feature flag off or notifier not configured |        503 | `QUOTE_UNAVAILABLE`; show “Quote requests are temporarily unavailable”; never show success.                          |
| Delivery failure or thrown exception        | 500 or 502 | Error envelope with a clear retry message; never show success.                                                       |
| Timeout or unknown delivery outcome         |        504 | Unconfirmed/retry error; never assume delivery or show success.                                                      |
| Invalid input or honeypot triggered         |        400 | Generic rejection; field names may identify validation errors, but never echo values. Bots must not receive success. |
| Rate limited                                |        429 | Retry message and an appropriate retry policy; never show success.                                                   |

The proposed 201 response contains only `{ "status": "delivered" }`, with an optional opaque `reference` only when persistence is confirmed. It must not include submitted fields. Failure responses use the standard error envelope and may include field names, never submitted values.

All errors use the standard envelope below. Do not include submitted values in messages, details, logs, traces, or error reporting. For recoverable errors, keep the user's entries in client memory only. Discard client state after confirmed success; do not use browser persistence.

The default `NotConfiguredNotifier` must return `not_configured` in every environment. `DevMetadataNotifier` runs only in development, logs only submission ID, timestamp, locale, field names, and value lengths, and always returns `not_configured`; therefore it always maps to 503 with no success UI. Test success only through `FakeDeliveredNotifier` under the tests tree. Add a test/lint guard that no delivered notifier or fake notifier is imported by production code. No database table, migration, email/SMTP, third-party integration, or production delivery is authorized.

Before submission implementation is considered complete, add exact response/UI mapping for delivered, not configured, failed, timeout, thrown exception, honeypot, and rate-limited cases; verify `DevMetadataNotifier` returns not configured/503 and never renders success; prove production default can never return success; ensure POST payload values never appear in logs or responses; and test retry state in memory only. The current UI-only E2E tests cover both locales, unavailable/no-form/noindex behavior, canonical/hreflang metadata, Arabic RTL screenshot attachment, and `/quote` redirect filtering.

## Proposed quote administration contracts (non-implemented)

The following contracts are documentation proposals for future approval. They must not create routes, database access, or active endpoints.

| Method and path                                   | Proposed authorization                                | Purpose                                   |
| ------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------- |
| `GET /api/admin/quotes`                           | Approved quote read permission                        | List/filter/sort/paginate quote requests  |
| `GET /api/admin/quotes/[quoteId]`                 | Quote read permission with customer-data access scope | Retrieve details and histories            |
| `PATCH /api/admin/quotes/[quoteId]/status`        | Assigned employee or approved quote administrator     | Apply a valid lifecycle transition        |
| `PATCH /api/admin/quotes/[quoteId]/assignment`    | Approved quote administrator                          | Assign an employee                        |
| `PUT /api/admin/quotes/[quoteId]/prices`          | Approved quote administrator                          | Set confirmed prices and preserve history |
| `POST /api/admin/quotes/[quoteId]/communications` | Assigned employee or approved quote administrator     | Record a manual communication             |
| `POST /api/admin/quotes/[quoteId]/notes`          | Assigned employee or approved quote administrator     | Add a protected internal note             |
| `POST /api/admin/quotes/[quoteId]/convert`        | Approved quote/Sales administrator                    | Convert only an explicitly approved quote |

All paths require server-side role/permission enforcement, Zod validation, standard error envelopes, protected audit behavior, and customer-data access decisions. No employee, administrator, or customer permission matrix is approved yet.

## API error format

```json
{
  "error": {
    "code": "STRING_CODE",
    "message": "Human-readable message",
    "details": {}
  }
}
```
