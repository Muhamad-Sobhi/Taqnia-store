# Security

- **Purpose:** Define security controls and the initial threat model for the store.
- **Audience:** Developers, administrators, and security reviewers.
- **Last updated:** 2026-11-24
- **Related docs:** [Security policy](../../SECURITY.md), [Error handling and logging](error-handling-and-logging.md), [Store API](../api/store-api.md)

## Threat model summary

| Asset                          | Entry point / threat                                              | Mitigation                                                                                                                                                                                    |
| ------------------------------ | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Customer accounts and sessions | Credential stuffing, session theft, CSRF                          | Scrypt password hashing, generic login errors, HTTP-only SameSite cookies, hashed session tokens; rate limits and reset delivery remain launch blockers.                                      |
| Orders and addresses           | Cross-customer access or IDOR                                     | Derive customer ID from session; enforce ownership in services and queries.                                                                                                                   |
| Admin operations               | Privilege escalation                                              | Server-side role checks on every admin action; least privilege; audit log.                                                                                                                    |
| Payment state                  | Forged proof or unauthorized status update                        | Treat customer references as unverified; require authorized manual verification; record actor and notes.                                                                                      |
| Inventory and totals           | Tampered quantity, price, shipping fee, or race                   | Revalidate server-side; integer minor units; transaction/locking as appropriate; admin-only shipping edits.                                                                                   |
| Database credentials           | Source or browser exposure                                        | Validated server-only environment configuration; no secrets in client bundles, logs, or repository.                                                                                           |
| Store availability             | Abuse of auth/checkout/search endpoints                           | Rate limiting, bounded queries/uploads, resource-aware workload, explicit error responses.                                                                                                    |
| Personal information           | Excessive logging or exposure                                     | Minimize and redact logs; restrict admin access; define retention/backup controls.                                                                                                            |
| Quote requests                 | Spam, request-body leakage, accidental persistence, false success | Planned Zod validation, honeypot, body-size limit, per-IP/email limits, idempotency, metadata-only development logs, and fail-closed notifier outcomes; implementation is not authorized yet. |

## Implemented controls and outstanding work

- Passwords use Node.js `scrypt` with per-password salts; opaque random session tokens are stored only as HMAC-SHA256 fingerprints.
- Session cookies are HTTP-only, SameSite=Lax, scoped to `/`, and Secure in production. Registration and login create server-side sessions.
- Customer roles are assigned server-side; customer and permission-check helpers query the database rather than trusting client-provided roles.
- Admin product and order actions authorize on the server by `catalog.manage`, `orders.manage`, `payments.verify`, or `shipping.manage`; hiding or rendering a form is not the authorization boundary.
- The local administrator provisioning tool accepts a user-supplied password only in development, requires a localhost app URL and seeded admin role/permissions, creates no default account, and prints no credentials.
- Order details preserve customer/address snapshots for fulfillment. Order access and customer-data retention/backup controls still require production review; no production migration was run.
- Inputs are validated with Zod and database operations use parameterized Drizzle queries.
- Login errors are generic. Password-reset tokens have schema support, but reset delivery/redemption is unavailable until an email provider and the full reset flow are implemented.
- Rate limiting and dedicated integration tests against MySQL are not implemented. Add them before production authentication is exposed publicly.

## Requirements

- Validate and sanitize input; use parameterized ORM queries; encode output by default.
- Use HTTPS and security headers including CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and frame protections.
- Use secure, HTTP-only, same-site session cookies; rotate or revoke sessions according to the final account-security policy.
- Apply rate limits to registration, login, password reset, and checkout.
- Protect state-changing endpoints against CSRF.
- Keep roles and permissions enforced on the server, not only in the UI.
- Do not automatically trust payment screenshots or customer-entered transfer references.
- Never log passwords, tokens, payment proof, or unnecessary personal data.
- Analytics are disabled by default; future analytics must be gated by one configuration flag and a small wrapper module. Do not add a cookie banner for absent non-essential tracking.
- Legal placeholder content must not be treated as approved privacy disclosure; production launch is blocked until policies receive review.

## Quote request privacy and logging (proposed)

- Quote submissions are not orders and may be initiated by guests. Do not associate them with a customer, cart, or order.
- Do not create quote tables or persist submitted values to a database, file, local/session storage, cookies, caches, queues, or backups until the owner approves storage and retention.
- Submit personal values only by POST. Permit only non-personal `sku` and `category` prefill query parameters.
- Never log names, email, phone, company, message text, consent values, or request bodies to application/proxy/framework logs, console, traces, analytics, error reports, test output, or CI.
- `DevMetadataNotifier` is development-only and may log only a submission ID, timestamp, locale, field names, and value lengths. It always returns `not_configured`, so development receives the same 503/unavailable behavior as production. Never use metadata logging as a success path.
- Validate on client and server with Zod, cap request-body size, reject a populated honeypot without success, and rate-limit per IP and email. The rate-limit key/store, trusted client-IP source, and retention behavior must be privacy-reviewed before implementation.
- Use an idempotency key per form session. Its deduplication mechanism must be decided without violating the no-persistence rule.
- Require an unchecked consent checkbox with content-layer draft text and a privacy link, but do not treat either as legally approved. Marketing consent is excluded.
- Keep request values in client memory for retry after failure; clear only after a confirmed successful result. Never echo values in server errors.
- Keep `QUOTE_DELIVERY_ENABLED` off by default. Not configured, failed, and timeout outcomes are explicit failures; only confirmed delivery/persistence permits success.
- Future quote management must separate public and administrative data. Customers may submit and view only their approved customer-facing interactions; internal notes, communication history, confirmed prices, assigned employees, and Sales Order links require restricted employee or administrator access.
- Quote records must preserve submitted displayed prices separately from administration-confirmed prices and must not expose or overwrite historical prices when catalog prices change.
- Quote-to-Sales-Order conversion is an explicit privileged action requiring customer approval. It must prevent duplicate order creation and preserve the original quote reference.

The following quote security and privacy decisions remain unresolved: official recipient email address, customer data retention policy, CAPTCHA provider and configuration, input field length limits, rate limiting policy, idempotency strategy, employee and administrator permissions, and customer data access controls. Do not assume an approved implementation for any of these items.

See [ADR-0005](../decisions/ADR-0005-quote-request-delivery-persistence.md) for undecided data/delivery options and [the API contract](../api/store-api.md) for proposed response mapping.

## Shared hosting considerations

Avoid assumptions of root access, Docker isolation, unrestricted background tasks, or available native binaries. Keep application secrets in cPanel environment configuration and ensure diagnostics do not reveal environment values.
