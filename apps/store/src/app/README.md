# App Routes

- **Purpose:** Explain the responsibility and rules for route files and layouts.
- **Audience:** Developers and AI agents.
- **Last updated:** 2026-11-24
- **Related docs:** [Folder structure](../../../../docs/architecture/folder-structure.md), [Task recipes](../../../../docs/ai/task-recipes.md)

This folder contains Next.js layouts and pages under the `/[locale]` route segment, plus thin Route Handlers. Public pages use `/en` or `/ar`; `/` redirects to English. Keep commerce logic in server services, validate Route Handler input, and keep localized copy in `src/content/`.
