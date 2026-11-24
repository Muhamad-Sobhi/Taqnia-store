# Error Handling and Logging

- **Purpose:** Standardize API errors, operational diagnostics, and privacy-safe logs.
- **Audience:** Developers and operations staff.
- **Last updated:** 2026-11-24
- **Related docs:** [Security](security.md), [Store API](../api/store-api.md), [Troubleshooting](../operations/troubleshooting.md)

## API errors

Return the standard envelope:

```json
{
  "error": {
    "code": "STRING_CODE",
    "message": "Human-readable message",
    "details": {}
  }
}
```

Use an HTTP status matching the failure. Do not leak stack traces, SQL, credentials, or internal identifiers to customers.

## Logging

Log actionable operational context, correlation IDs, status transitions, and error codes. Redact email/phone/address where not required; never log passwords, session tokens, database URLs, payment screenshots, or full secret values. Avoid broad catches and silent fallback behavior.

## User experience

Show localized, useful validation and failure messages. Keep authentication errors generic enough to prevent account enumeration. Do not render success-shaped responses after a failed operation.

## Quote request outcomes (proposed; not implemented)

| Notifier/request outcome                        | HTTP response | Customer state                                                                                     |
| ----------------------------------------------- | ------------: | -------------------------------------------------------------------------------------------------- |
| Confirmed delivery or persistence (`delivered`) |           201 | Announce success only after confirmation. A reference is allowed only when a record was persisted. |
| Feature flag off or `not_configured`            |           503 | Show the unavailable message; no success state or reference.                                       |
| `failed` or thrown exception                    |       500/502 | Show a clear retry message; retain inputs in client memory only.                                   |
| Timeout or unknown outcome                      |           504 | Say the request could not be confirmed and invite retry; do not assume success.                    |
| Invalid input or honeypot                       |           400 | Generic rejection; never echo values or return bot-shaped success.                                 |
| Rate limited                                    |           429 | Localized retry message; no success state.                                                         |

Quote request errors use the standard envelope. Field errors may identify field names only. Do not log request bodies or submitted values at the framework, application, proxy, console, tracing, or error-reporting layers. `DevMetadataNotifier` runs only in development, is restricted to submission ID, timestamp, locale, field names, and value lengths, and always returns `not_configured`; it maps to 503 and unavailable UI in development as well as production. It is never a success path. Use `FakeDeliveredNotifier` only from the tests tree to verify success; guard production imports. A test must assert that submitted values never appear in logs or responses.

The form's `aria-live` status must receive focus when the result is announced; field errors must be associated with controls by `aria-describedby`. Keep entered data in memory for retries after failures and clear it after confirmed success, without using browser persistence.

Future quote-management errors must not expose customer contact information, internal notes, communication history, confirmed prices, employee assignments, or Sales Order identifiers to unauthorized users. Price-review and status-change operations must record an auditable result without echoing protected values in customer-facing responses.
