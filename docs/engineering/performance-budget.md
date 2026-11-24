# Performance Budget

- **Purpose:** Set measurable performance goals compatible with a product-heavy storefront and shared hosting.
- **Audience:** Designers, developers, and QA.
- **Last updated:** 2026-11-24
- **Related docs:** [Design system](../design/design-system.md), [Hosting and deployment](../architecture/hosting-and-deployment.md), [SEO](seo.md)

## Targets

- Lighthouse score of at least 90 for Performance, Accessibility, Best Practices, and SEO on key public pages, measured on representative production-like hosting.
- LCP below 2.5 seconds, CLS below 0.1, and INP below 200 ms at the 75th percentile where sufficient field data exists.
- Keep client JavaScript minimal; prefer Server Components.
- Use responsive, compressed product imagery. Do not depend on GoDaddy native `sharp` support unless verified; use pre-optimized assets and unoptimized Next image delivery as fallback.
- Test responsive layouts at 360, 768, 1024, and 1440 pixels.

## Shared-host safeguards

Use bounded database queries, pagination, conservative connection pooling, cache public catalog data where safe, and avoid long-running background processes. Reassess targets if verified hosting resource limits make a target unattainable, and document approved trade-offs.
