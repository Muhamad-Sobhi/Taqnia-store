# ADR 0001: Locale-prefixed storefront routes

- **Status:** Accepted
- **Date:** 2026-11-25
- **Decision owners:** Taqnia Store project

## Context

The storefront must support English/LTR and Arabic/RTL while remaining indexable and providing the correct `lang` and `dir` attributes for each response. A cookie-only locale would serve different language content at the same URL and make canonical and alternate-language metadata ambiguous.

## Decision

- Use `/en` and `/ar` prefixes for public storefront pages.
- Redirect `/` to the default `/en` storefront.
- Keep category and product slugs stable across locales; translate their visible names and page metadata.
- Build the HTML `lang` and `dir` attributes from the validated locale segment.

## Consequences

- Each locale has a distinct URL suitable for canonical and `hreflang` metadata.
- Locale switching can preserve the current route when a translation exists.
- New route handlers and pages must validate the locale before selecting localized content.
