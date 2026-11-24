# Accessibility

- **Purpose:** Define accessible interaction requirements for the storefront and admin UI.
- **Audience:** Designers, developers, and QA.
- **Last updated:** 2026-11-24
- **Related docs:** [Design system](design-system.md), [Testing strategy](../engineering/testing-strategy.md)

## Requirements

Target WCAG 2.2 AA. Use semantic HTML, landmarks, heading order, visible focus, full keyboard access, sufficient contrast, descriptive image alternatives, properly labeled forms, and error messages associated with controls by ARIA.

Provide a skip-to-content link. Respect reduced motion. Do not use color alone to communicate stock, payment, shipping, or validation state.

## Localization and direction

Test English LTR and Arabic RTL, including mixed-direction SKUs, email addresses, phone numbers, EGP amounts, and technical specifications. Use logical CSS properties. Keep focus order aligned with visual order.

## Validation

Playwright runs axe-core against the English LTR and Arabic RTL home page at 360, 768, 1024, and 1440 pixels. Keep zero serious or critical WCAG 2.2 A/AA violations. The English/Arabic brand links must expose accessible names that include their visible text.

Playwright also verifies search query refinement, query retention during locale switching, minimum-width header fit, and keyboard operation of the mobile navigation. Test keyboard-only use and screen-reader labels in critical flows: browse/search, cart, login/registration, checkout, order history, and admin status changes. Include responsive viewports at 320, 360, 768, 1024, and 1440 pixels. Automated scans complement, but do not replace, keyboard and assistive-technology testing.
