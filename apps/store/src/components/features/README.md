# Feature Components

- **Purpose:** Define the home for product, search, cart, account, checkout, and admin feature UI.
- **Audience:** Frontend developers and AI agents.
- **Last updated:** 2026-11-24
- **Related docs:** [Design system](../../../../../docs/design/design-system.md), [Request flows](../../../../../docs/architecture/request-flows.md)

Feature components compose UI primitives and invoke validated server actions or APIs. Do not put database access, authorization decisions, or commerce rules in these components.

The storefront currently lists confirmed categories and provides `CategoryGrid`, `ProductGrid`, `ProductCard`, and `ProductDetails`. The product collection is intentionally empty until verified names, images, and prices are supplied; stock availability is not guessed. A product card has one link to its published detail page, and product details provide home/category breadcrumbs. Category and search product grids show localized, placeholder-flagged empty states rather than internal catalog-preparation copy.
