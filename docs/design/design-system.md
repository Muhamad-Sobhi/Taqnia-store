# Design System

- **Purpose:** Define the visual language and reusable interface rules for Taqnia Store.
- **Audience:** Designers, frontend developers, and content editors.
- **Last updated:** 2026-11-24
- **Related docs:** [Project brief](../00-overview/project-brief.md), [Accessibility](accessibility.md), [Content guidelines](content-guidelines.md)

## Brand source and palette

Use the existing `Taqnia-LOGO.png` / `Taqnia-LOGO.jpg` in the repository root as the approved brand source. Do not create a replacement logo. Sampling the PNG yields these representative gradient colors:

| Token        | Value     | Intended use                                                                     |
| ------------ | --------- | -------------------------------------------------------------------------------- |
| `brand-navy` | `#093067` | Primary text on light backgrounds, strong brand areas, and focus/active accents. |
| `brand-blue` | `#326795` | Primary actions and links.                                                       |
| `brand-sky`  | `#64ABD4` | Secondary accents and selected states.                                           |
| `brand-cyan` | `#8DCBE9` | Soft highlights and decorative surfaces.                                         |

The logo contains gradients and antialiasing; use the four colors as representative design tokens, not as the only colors present in the image. Semantic colors must be defined separately and checked for contrast.

## Typography and direction

- English: Inter.
- Arabic: Cairo.
- Set page `lang` and `dir` from the active locale. English is LTR; Arabic is RTL.
- Prefer logical CSS properties (`margin-inline`, `padding-inline`, `inset-inline`) over left/right-specific rules.
- Load fonts efficiently and avoid third-party tracking or font services unless explicitly approved.

## Theme and token scales

Version 1 uses a light theme. Define CSS variables for semantic background, surface, text, muted, primary, accent, success, warning, danger, border, focus, and overlay colors. Keep tokens structured so a dark theme can be added later without changing component APIs.

Tokens live in `apps/store/src/styles/tokens.css`. Use the 4px spacing base, documented type scale, consistent radii and shadows, layered z-index values, and motion durations. The global styles provide responsive page width, visible keyboard focus, a skip link, and reduced-motion handling. Prefer logical CSS properties for layout.

Inter and Cairo are self-hosted from the pinned Fontsource variable-font packages. The font packages are licensed under the SIL Open Font License; they are bundled with the app rather than requested from a third-party service at runtime.

## E-commerce layout principles

- Product categories, search, best sellers, featured products, new arrivals, and promotions take priority over company storytelling.
- The header includes store identity, search, navigation, account, wishlist, cart, and language control.
- Product cards show only verified catalog data. Development samples must be visibly marked and never appear as live inventory.
- Admin-managed homepage sections and content should use the same validated content model as other editable pages.

## Quote/support journey (entry points planned; page UI only)

The quote flow is separate from cart, checkout, and orders. Localized `/en/quote` and `/ar/quote` routes currently show an unavailable page with no form; bare `/quote` redirects to `/en/quote`. The placements below are future entry points. Add a shared locale-aware link helper when implementing them. Render them only after delivery is configured and an approved feature flag is enabled; keep them hidden otherwise:

- Header secondary “Request a quote” action; on mobile it may be icon-only only if its accessible name remains “Request a quote”.
- Secondary hero action beside “Explore categories”.
- Product detail action beside “Add to cart”, prefilled with a non-personal `sku` query parameter.
- Product cards with no verified price, using the quote action instead of an invented price.
- Empty search and category results, plus the home “Catalog coming soon” block.
- Footer “Contact sales” link under Customer service.

Use the content layer for all labels and localized variants. The Arabic labels, privacy notice, consent wording, and unavailable/error messages are draft placeholders requiring owner/legal review. Do not display a response-time promise until approved. Do not add a floating phone/WhatsApp action, `mailto:`/`tel:` link, popup, auto-opening modal, or marketing opt-in. Optional public phone, WhatsApp, and email values remain empty until approved; hide any dependent UI when empty.

When the feature flag is off or delivery is not configured, hide all entry points. A directly opened form must show the localized unavailable message, set noindex, and must not imply a submission succeeded. Do not show a success state unless the notifier confirms delivery or persistence.

## Component inventory

| Component   | Purpose                                                | Key behavior                                                     |
| ----------- | ------------------------------------------------------ | ---------------------------------------------------------------- |
| `Button`    | Primary and secondary button actions.                  | Native button semantics; visible focus; disabled state.          |
| `Container` | Constrain page content to the shared responsive width. | Uses logical inline margins and accepts standard div attributes. |
| `SkipLink`  | Bypass repeated layout to the main content.            | First focusable body element; visible on keyboard focus.         |

Add focused props, states (default, hover, focus, disabled, loading, error), accessibility behavior, and usage rules as feature components are introduced.
