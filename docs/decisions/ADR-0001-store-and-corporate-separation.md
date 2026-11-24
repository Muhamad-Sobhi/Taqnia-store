# ADR-0001: Keep the Store Separate from the Corporate Website

- **Purpose:** Record the application and deployment boundary between Taqnia Store and the corporate site.
- **Audience:** Taqnia stakeholders, developers, and operations staff.
- **Last updated:** 2026-11-24
- **Related docs:** [Project brief](../00-overview/project-brief.md), [Hosting and deployment](../architecture/hosting-and-deployment.md)
- **Status:** Accepted

## Context

`taqnia-eg.net` already hosts the corporate website on WordPress. The business requires a dedicated product-first store at `store.taqnia-eg.net`, and the hosting account has one Node.js application slot. Store deployment must not disrupt or modify WordPress.

## Options considered

1. Build another corporate/marketing website alongside the store.
2. Put store and corporate code in one new combined application.
3. Keep the existing WordPress site external and build only the store as an independent application.

## Decision

Build only the Taqnia Store in this repository. Treat WordPress at the root domain as an external system. Use the single Node.js slot for the store only, after validating subdomain mapping and cPanel behavior.

## Consequences

- No corporate marketing app, deployment, or WordPress changes are included.
- Product and commerce workflows can evolve independently from the corporate website.
- Deployment must target `store.taqnia-eg.net` and preserve the root site's files, document root, and database.
- Cross-site links may be used, but there are no shared imports or deployment artifacts.
