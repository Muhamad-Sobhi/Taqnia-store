# Project Brief

- **Purpose:** Define the business and product scope for Taqnia Store.
- **Audience:** Taqnia owners, product contributors, developers, and AI agents.
- **Last updated:** 2026-11-24
- **Related docs:** [Assumptions](assumptions.md), [Roadmap](roadmap.md), [System overview](../architecture/system-overview.md)

## Product

Taqnia Store is a dedicated online store at `store.taqnia-eg.net` for physical IT equipment, networking hardware, and technology infrastructure. It is not the corporate website.

The corporate website at `taqnia-eg.net` already runs on WordPress and remains separate. This project must not build, replace, deploy over, or modify that site.

## Customer experience

The store prioritizes product discovery and purchase actions: categories, search and filtering, product details and technical specifications, offers, cart, checkout, customer accounts, order history, and customer support. Guests may browse and create a temporary cart; login or registration is required before checkout.

The interface supports English/LTR and Arabic/RTL, uses the existing Taqnia logo and logo-derived colors, uses Inter for English and Cairo for Arabic, and launches with a polished light theme. The initial currency is EGP.

## Commerce operations

- Products and content are managed through the store admin area.
- Customers have accounts, profiles, delivery addresses, and order history.
- Cash on Delivery, electronic wallets, and InstaPay use manual payment workflows.
- Electronic transfers require administrator verification; customer-provided screenshots never automatically mark an order paid.
- Shipping fees and delivery arrangements are agreed with the customer and entered by an authorized administrator.
- Payment and shipping abstractions should permit future integrations.

## Product data rules

The initial catalog is being prepared. Development/testing sample products must be visibly identified as samples. Never invent real inventory, prices, warranty terms, availability, or product specifications. Category-specific attributes must support technical specifications without hard-coding one global attribute list.

## Platform and ownership

- Next.js, TypeScript, React, Tailwind CSS, Drizzle ORM, MySQL, and Node.js on GoDaddy cPanel are the selected baseline, subject to the hosting verification recorded in [hosting and deployment](../architecture/hosting-and-deployment.md).
- The store is the only planned Node.js application in the account's single application slot.
- The project and repository are proprietary/private. Copyright: “Copyright © Taqnia. All Rights Reserved.”
- No external analytics or tracking scripts are enabled in version 1.

## Launch blockers

- Confirm this cPanel account supports the selected Node.js runtime, Next.js startup/port behavior, and `store.taqnia-eg.net` mapping without affecting WordPress.
- Confirm resource limits and test Node-to-MySQL connectivity and connection limits.
- Replace all legal placeholders with approved policies before production launch.
- Replace all content and catalog samples with owner-approved copy and verified product data before presenting them as real.
