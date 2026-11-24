# Production Launch Checklist

- **Purpose:** Block production launch until store content, operations, legal review, and infrastructure are approved.
- **Audience:** Taqnia owners and deployment operators.
- **Related docs:** [Deployment runbook](deployment-runbook.md), [Environment variables](environment-variables.md), [Content guidelines](../design/content-guidelines.md)

Do not treat any placeholder below as approved marketing, product, legal, pricing, availability, or service information.

## Storefront placeholders and missing owner inputs

- [ ] Replace or approve the English and Arabic home hero description in `apps/store/src/content/storefront.ts`. The copy is explicitly flagged with `status: "placeholder"`.
- [ ] Replace or approve the English and Arabic catalog-empty title and description in `apps/store/src/content/storefront.ts`. These are flagged placeholders and display only when the content product list is empty; production must not launch without approved products.
- [ ] Replace or approve the category/search product-empty messages in `apps/store/src/content/storefront.ts`. They are explicitly flagged placeholders and remain visible when no matching product records exist.
- [ ] Approve product imagery and localized image alternatives for each real product. The product card/detail image-pending message in `apps/store/src/content/storefront.ts` is a placeholder, not a product image.
- [ ] Supply verified product names, SKUs, descriptions, specifications/units, images, EGP prices, and inventory. The current content catalog is intentionally empty; no sample stock or pricing is present.
- [ ] Supply approved promotion and manufacturer/brand data before reintroducing offers or brand sections. Empty offers and brand sections are intentionally omitted from the home page.
- [ ] Verify `/en/quote` and `/ar/quote` preserve locale, and bare `/quote` redirects to `/en/quote` while preserving only valid `sku`/`category` parameters.
- [ ] Confirm the unavailable quote-page copy and SKU prefill rule (`1–120` ASCII letters, digits, `.`, `_`, `-`) before any quote entry point or submission flow is enabled.
- [ ] Approve the quote dashboard status and access model: All Requests, New Requests, Under Review, Waiting for Customer, Approved, Rejected, and Archived.
- [ ] Verify the quote data model preserves request-time displayed prices separately from per-product confirmed prices.
- [ ] Confirm employee communication procedures for phone, WhatsApp, and email and define required communication-history fields.
- [ ] Verify quote-to-Sales-Order conversion requires explicit approval and creates no more than one order per quote.
- [ ] Approve the quote delivery method and recipient (team/role and any required sales email). SMTP, database storage, both, and third-party delivery remain undecided; no quote-request data may be persisted or delivered before approval.
- [ ] Provide approved public sales email and business phone/WhatsApp values if direct-contact links are wanted; otherwise keep those content values empty and omit their UI.
- [ ] Approve the quote data-retention and deletion policy, response-time promise or no-promise wording, privacy notice, and consent wording with legal review.
- [ ] Decide CAPTCHA, field length/body-size limits, privacy-safe IP/email rate-limit storage, and idempotency behavior.
- [ ] Keep official recipient email, employee/administrator permission model, customer data access controls, and customer data retention policy unresolved until separately approved.
- [ ] Keep public email, phone, and WhatsApp values empty until approved. Do not add `mailto:`, `tel:`, or floating contact links before then.
- [ ] Do not log personal data. Any exception requires explicit written owner approval and a documented legal/security review; current development logging is metadata-only.
- [ ] Verify a real quote submission end-to-end in production before enabling `QUOTE_DELIVERY_ENABLED`; require confirmed delivery/persistence for success, with no silent acceptance or false success.
- [ ] Configure and test an approved email service before advertising password reset. The current password-reset page clearly reports that email delivery is unavailable.
- [ ] Provide administrator roster, customer-support procedures, and approved operational contact details for order handling.

## Legal and commercial approval

- [ ] Create and approve Privacy Policy, Terms and Conditions, Refund and Return Policy, Shipping and Delivery Policy, and Cookie Policy if applicable. These legal pages are not yet implemented; no draft in this checklist is legal advice or approved policy.
- [ ] Approve all displayed product, promotional, payment, warranty, returns, delivery, and support claims. Never infer or fabricate missing details.
- [ ] Confirm payment instructions and manual verification procedures before enabling wallet or InstaPay instructions.
- [ ] Confirm the shipping agreement workflow, delivery coverage, and customer communication process before accepting orders.

## Technical and release readiness

- [ ] Verify the actual GoDaddy cPanel Node runtime, store subdomain binding, resource limits, MySQL connectivity/grants/limits, and image-processing support.
- [ ] Apply reviewed migrations only after a verified backup and account-specific MySQL connectivity test.
- [ ] Provision an administrator through the approved secure process; do not use a seeded or shared admin credential.
- [ ] Verify English/Arabic flows, accessibility scans, customer authentication, order/payment/shipping workflows, backups, and rollback on the production-like deployment.
- [ ] Confirm the corporate WordPress site remains separate and unchanged.

## Current launch blockers

The catalog has no products; quote delivery, official recipient email, persistence/retention, response-time, privacy/consent, CAPTCHA, input limits, rate-limit, idempotency, employee permissions, and customer data access controls remain open; password-reset email delivery is unavailable; legal pages are not implemented or approved; and GoDaddy account-specific runtime/database checks remain open. The approved quote business workflow is documented only. Quote pages are UI-only and unavailable, with no form, entry points, or API handler; submission, dashboard, communication tracking, and Sales Order conversion are not implemented. The quote feature flag is not implemented and must default off. Production launch is blocked until each applicable checklist item is complete and verified.

## Quote planning-only gate

Safe quote planning may continue for dashboard IA, mock UX, status specifications, communication-interface specifications, reusable components, localization, accessibility, proposed permission matrices, and proposed API documentation.

Before implementation of each gated area, record separate approval:

- Persistence/migration approval is required before a quote table or migration is created.
- Submission/retention approval is required before a public form or POST handler is added.
- CAPTCHA, rate-limit, and idempotency approvals are required before anti-abuse implementation.
- Delivery and official recipient approvals are required before email or messaging integration.
- Permission and customer-access approvals are required before protected dashboard operations.
- Sales and authorization approvals are required before quote-to-Sales-Order conversion.
- Personal-data logging and backup approvals are required before production customer-data processing.

## Phase 2 mock prototype status

The Quote Management UI prototype, including overview, list, details, pricing, status, communication, temporary notes, and disabled conversion preview, is non-production UI work. It uses fictional data and local component state only.

Before backend implementation:

- Confirm the quote-specific employee/administrator permission matrix.
- Approve quote persistence and retention.
- Approve public submission, CAPTCHA, rate-limit, idempotency, and delivery decisions.
- Approve actual communication and Sales Order integration behavior.
