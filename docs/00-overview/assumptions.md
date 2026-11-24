# Assumptions

- **Purpose:** Record confirmed project scope and assumptions that remain until the owner supplies final business inputs.
- **Audience:** Project stakeholders, developers, and AI agents.
- **Last updated:** 2026-11-24
- **Related docs:** [Project brief](./project-brief.md), [Hosting and deployment](../architecture/hosting-and-deployment.md), [Roadmap](./roadmap.md)

## Confirmed scope

- This repository contains only the Taqnia Store at `store.taqnia-eg.net`. The corporate site at `taqnia-eg.net` is an existing WordPress site and must not be built, replaced, or modified by this project.
- The store is a bilingual (English and Arabic), product-first e-commerce application for physical IT and networking equipment. English uses Inter; Arabic uses Cairo. The initial theme is light, with tokens structured to allow a future dark theme.
- The existing Taqnia logo in the repository root is the brand source. Sampling its PNG yields a representative blue palette: dark navy `#093067`, medium blue `#326795`, sky blue `#64ABD4`, and light cyan `#8DCBE9`. The mark also contains gradients and antialiasing; these four values are representative design tokens, not a claim that the source artwork has only four exact colors.
- Version 1 uses EGP only. Money is stored as integer minor units and formatted consistently.
- Customers may browse as guests, but must authenticate before checkout. A guest cart must be preserved through registration or login. All orders belong to an authenticated customer.
- Cash on Delivery, electronic wallets, and InstaPay are supported through manual payment workflows. Transfer evidence is never treated as proof of payment without administrator verification.
- Shipping fees and delivery arrangements are negotiated with customers and recorded by authorized administrators. There is no initial carrier integration or automatic rate calculation.
- Product catalog content is still being prepared. Sample products may be used for development and tests only; sample data must be clearly labeled and must not imply real prices, specifications, availability, warranties, or inventory.
- Store copy and legal pages may begin as replaceable placeholders. Legal placeholders must visibly state that legal review is pending and must not be presented as approved policy.
- No external analytics or tracking scripts are used for version 1. Analytics, if added later, must be isolated behind a configuration flag and a wrapper module. Essential authentication and shopping cookies are permitted.
- The project is proprietary and the repository must remain private. Copyright notice: “Copyright © Taqnia. All Rights Reserved.”
- Store pages, banners, product descriptions, and informational content are intended to be editable through the administration dashboard.

## Hosting facts supplied by the owner

- The existing account is GoDaddy cPanel Web Hosting with a Node.js Apps interface, one Node.js application slot (currently unused), MySQL/phpMyAdmin, File Manager, FTP, and email.
- Dashboard storage figures: 25 GB total disk, approximately 1.04 GB currently used, 250,000 file limit, and 23.81 GB database disk.
- Exact GoDaddy plan name is **TBD (owner to confirm from Renewals & Billing)**.
- Node.js runtime, app resource limits, database connection details/limits, and Node app binding to `store.taqnia-eg.net` have not yet been confirmed.

## Open assumptions pending owner or host confirmation

- The runtime selected for deployment must be one actually offered to this hosting account; Node.js 22 is a target only if the cPanel selector and account support it.
- The Node application must use the one available app slot and must not interfere with the WordPress site or its document root.
- The database host and port are deployment configuration, not hard-coded assumptions. Connectivity, account permissions, and actual connection limits require confirmation from GoDaddy.
- Payment configuration details (wallet providers, payment instructions, and InstaPay account details) will be entered by an authorized administrator and will not be invented in sample data.
- Admin role assignments, real product content, final commercial copy, delivery coverage/pricing commitments, and approved legal language remain owner-supplied operational content.
- Production launch is blocked until hosting compatibility is verified and all legal policy placeholders are replaced with owner-approved text.
