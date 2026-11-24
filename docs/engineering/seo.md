# SEO

- **Purpose:** Define search visibility requirements for bilingual product discovery.
- **Audience:** Product owners, developers, and content editors.
- **Last updated:** 2026-11-24
- **Related docs:** [Content guidelines](../design/content-guidelines.md), [Performance budget](performance-budget.md), [Security](security.md)

## Requirements

- Provide unique metadata, canonical URLs, Open Graph/Twitter metadata, and localized metadata per route.
- Add `hreflang`/locale relationships for English and Arabic pages when both translations exist.
- Public storefront routes use `/en` and `/ar` prefixes; `/` redirects to the default English storefront. Search result routes are not indexed.
- Quote pages use `/en/quote` and `/ar/quote`; bare `/quote` redirects to `/en/quote` using the same default-locale mechanism as `/` and preserves only validated, non-personal `sku` and `category` prefill parameters. Use self-referencing canonicals and English/Arabic alternates. The storefront does not currently use `x-default`; add it only if adopted consistently elsewhere.
- The current localized quote pages always render the unavailable state with `noindex`; no entry points or form are present. If a sitemap is added, exclude these routes. Only consider indexing after delivery is configured and the feature is enabled.
- Generate a sitemap and robots rules for public catalog/content while excluding account/admin/private routes.
- Add valid `Organization`, `WebSite`, `Product`, and `BreadcrumbList` structured data where appropriate. Product schema must use verified catalog values only.
- Use descriptive product URLs and meaningful image alternatives; do not fabricate rating, price, or stock schema.
- Keep corporate identity pages on the existing WordPress site. The store may link to it but should not imitate a corporate marketing home page.

The route strategy is recorded in [ADR 0001](../architecture/decisions/adr-0001-locale-prefixed-routing.md). Product price and product metadata must be published only from verified catalog records.

## Analytics

Version 1 has no external analytics or tracking scripts. Do not add Google Analytics, Plausible, marketing pixels, or a cookie banner by default. If analytics is approved later, gate it with one configuration flag and a small wrapper module so tracking can be added without refactoring storefront components. Use only after updating privacy/security documentation and obtaining required consent/legal review.
