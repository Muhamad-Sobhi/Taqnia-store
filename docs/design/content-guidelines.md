# Content Guidelines

- **Purpose:** Govern bilingual storefront copy, product information, and placeholders.
- **Audience:** Content editors, product owners, and developers.
- **Last updated:** 2026-11-24
- **Related docs:** [Project brief](../00-overview/project-brief.md), [Design system](design-system.md), [SEO](../engineering/seo.md)

## Content principles

- Keep all UI labels and messages in a centralized content/translation layer.
- English is the repository's instruction and source language. Arabic is supported as locale content with matching meaning and appropriate RTL typography.
- Keep the tone clear, trustworthy, and helpful. Prioritize product details and shopping actions over corporate biography.
- Use an explicit placeholder marker for unfinished store copy, banners, images, product descriptions, and policies.
- Keep interim home hero and catalog-empty copy flagged in the content layer with `status: "placeholder"`; track it in the [production launch checklist](../operations/launch-checklist.md) and replace or approve it before production.
- Keep quote consent/privacy text, quote availability/errors, and any response-time text as clearly marked draft placeholders in the content layer. Do not show response-time wording until approved; do not present draft privacy or consent wording as legal advice.
- Do not invent product specs, price, stock, warranty, manufacturer claims, or delivery promises.
- Mark development-only items as sample data in data records and visible development interfaces.

## Product content

Product specifications are category-dependent. Editors must provide source-verified values and units. Do not fabricate missing values; show an explicit “not provided”/equivalent localized state rather than a guessed value.

## Legal content

Privacy, terms, refund/return, shipping/delivery, and cookie-policy pages may begin as generic structural drafts only. Each must visibly display `DRAFT - PENDING LEGAL REVIEW`, include a source TODO marker, and block production release until owner-approved text replaces it.
