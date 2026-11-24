# ADR-0002: Use a Dynamic Next.js Store Application

- **Purpose:** Record the rendering and application architecture for commerce features.
- **Audience:** Taqnia stakeholders, developers, and deployment operators.
- **Last updated:** 2026-11-24
- **Related docs:** [Hosting and deployment](../architecture/hosting-and-deployment.md), [System overview](../architecture/system-overview.md)
- **Status:** Accepted, subject to hosting verification

## Context

The store requires server-side authentication, protected checkout, cart persistence, inventory validation, orders, manual payment status changes, shipping management, and admin operations. The existing GoDaddy cPanel account exposes one Node.js app slot.

## Options considered

1. Static export with external APIs: would not provide the requested integrated server features by itself.
2. Full dynamic Next.js on the cPanel Node.js app manager.
3. Move immediately to a VPS or managed platform.

## Decision

Use one full Next.js application with App Router, Server Components, and Route Handlers. Do not use static export for the store. Keep hosting configuration isolated and verify runtime, startup, subdomain routing, and database behavior before production deployment.

## Consequences

- The application requires an available Node.js runtime and correctly routed application port.
- Account-specific SSR compatibility is not yet certified; the test deployment must not touch WordPress.
- If the app manager cannot support the required Next.js server, stop and present a hosting trade-off before selecting a replacement platform.
- Keep business logic portable so moving to VPS or managed hosting does not require redesigning commerce services.
