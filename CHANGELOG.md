# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versioning follows Semantic Versioning.

## [Unreleased]

### Added

- Added a disposable GoDaddy cPanel hosting simulation with MariaDB 11.4 and a Node.js 24 Next.js production container.
- Added MariaDB 10.6 compatibility settings and repeatable database integration smoke checks for sessions, catalog, orders, constraints, transactions, locks, and connection recovery.
- Added bilingual product administration and order list/detail pages with server-side permission checks, audited manual shipping/payment updates, and local-only administrator provisioning with no default password.
- Added local/test-only guards for Drizzle operations, hidden interactive password entry for initial local administrator setup, and row locks for serialized order status updates.
- Initial Taqnia Store project scaffolding and documentation.
- Responsive axe-core checks for serious and critical home-page accessibility violations in English and Arabic.
- Production launch checklist for storefront placeholders, owner inputs, and release blockers.
- Localized quote-request unavailable pages and a bare-route redirect that preserves only validated SKU/category prefill; no form, API, feature flag, persistence, or delivery implementation added.

### Changed

- Documented the generated order schema, local admin setup, admin page authorization, and the still-unimplemented checkout/order creation.
- Replaced internal-facing home copy and repeated empty merchandising sections with a single localized catalog-empty state; omit unpopulated products, offers, and brands.
- Simplified product cards to one product link and added localized breadcrumbs to product details.
- Retained search queries in the header and when switching storefront locales; verified the mobile navigation by keyboard.
- Added responsive category grids and contextual, localized empty results for category and search pages.
- Documented the proposed quote request flow, privacy contract, entry points, launch blockers, and undecided delivery options in ADR-0005.
- Documented localized quote routes, the `/api/quote` contract, SEO gating, metadata-only notifier failure semantics, and test-only success verification.
- Documented the confirmed `email_required` business rule and approved UI-only quote scope; added localized noindex metadata and Arabic RTL screenshot coverage.
- Reclassified quote implementation into safe planning, approval-gated implementation, and documentation scopes; added revised roadmap, dashboard IA, lifecycle, permission proposal, and non-implemented API contracts.
- Added a bilingual, responsive, protected mock Quote Management admin prototype with overview, list, details, pricing, status, communication, temporary notes, and disabled conversion preview. No quote persistence, submission, delivery, API, or Sales Order behavior was added.
- Documented the approved quote-management workflow: public prices, multiple products and quantities, manual confirmed pricing, phone/WhatsApp/email communication, dashboard statuses, and explicit Sales Order conversion.

### Fixed

- Shortened a generated foreign-key identifier that exceeded MariaDB's 64-character limit and explicitly preserved NULL defaults for nullable TIMESTAMP columns on MariaDB 10.6.
- Corrected the hosting report: the earlier Drizzle Kit failure was an overlength foreign-key error during the initial migration, not a connection or migration-journal failure.
- Preserved the visible store-brand text in the brand link's accessible name in both locales.
