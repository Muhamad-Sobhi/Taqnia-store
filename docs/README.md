# Documentation Index

- **Purpose:** Help readers find project, architecture, design, engineering, API, operations, and AI-agent documentation.
- **Audience:** Taqnia stakeholders, developers, and AI agents.
- **Last updated:** 2026-11-24
- **Related docs:** [Project brief](00-overview/project-brief.md), [Roadmap](00-overview/roadmap.md), [AI context map](ai/context-map.md)

## Overview

| Document                                      | Description                                                    |
| --------------------------------------------- | -------------------------------------------------------------- |
| [Project brief](00-overview/project-brief.md) | Store scope, product focus, launch priorities, and exclusions. |
| [Assumptions](00-overview/assumptions.md)     | Confirmed requirements, owner-provided facts, and assumptions. |
| [Glossary](00-overview/glossary.md)           | Definitions for commerce and technical terms.                  |
| [Roadmap](00-overview/roadmap.md)             | Milestones, status, dependencies, and launch blockers.         |

## Architecture

| Document                                                         | Description                                                        |
| ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| [System overview](architecture/system-overview.md)               | Context and container diagrams for the store and external systems. |
| [Hosting and deployment](architecture/hosting-and-deployment.md) | GoDaddy cPanel facts, open questions, and deployment constraints.  |
| [Data model](architecture/data-model.md)                         | Initial normalized MySQL domain model.                             |
| [Request flows](architecture/request-flows.md)                   | Authentication, guest-cart merge, and manual checkout sequences.   |
| [Folder structure](architecture/folder-structure.md)             | Purpose of repository and application directories.                 |

## Decisions

| Document                                                         | Description                                                         |
| ---------------------------------------------------------------- | ------------------------------------------------------------------- |
| [ADR index](decisions/README.md)                                 | Architecture decision record list and status.                       |
| [ADR template](decisions/ADR-0000-template.md)                   | Reusable decision record structure.                                 |
| [ADR-0001](decisions/ADR-0001-store-and-corporate-separation.md) | Keep the store separate from the existing corporate WordPress site. |
| [ADR-0002](decisions/ADR-0002-dynamic-nextjs-store.md)           | Use dynamic Next.js rendering for store functionality.              |
| [ADR-0003](decisions/ADR-0003-mysql-with-drizzle.md)             | Use MySQL through Drizzle ORM.                                      |
| [ADR-0004](decisions/ADR-0004-manual-payment-and-shipping.md)    | Launch with manual payment verification and shipping agreements.    |

## Design and engineering

| Document                                                                | Description                                                          |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [Design system](design/design-system.md)                                | Logo-derived tokens, typography, layout, and component expectations. |
| [Content guidelines](design/content-guidelines.md)                      | Bilingual content, placeholder, and product-claim rules.             |
| [Accessibility](design/accessibility.md)                                | WCAG 2.2 AA and RTL/LTR accessibility requirements.                  |
| [Coding standards](engineering/coding-standards.md)                     | TypeScript, app-layering, naming, and database conventions.          |
| [Git workflow](engineering/git-workflow.md)                             | Branching, commits, and pull request expectations.                   |
| [Testing strategy](engineering/testing-strategy.md)                     | Unit, component, integration, and E2E expectations.                  |
| [Security](engineering/security.md)                                     | Threat model and security requirements.                              |
| [Performance budget](engineering/performance-budget.md)                 | Performance goals and shared-host constraints.                       |
| [SEO](engineering/seo.md)                                               | Store search visibility, product metadata, and analytics policy.     |
| [Error handling and logging](engineering/error-handling-and-logging.md) | API errors, server logging, and privacy protections.                 |

## API and operations

| Document                                                     | Description                                                   |
| ------------------------------------------------------------ | ------------------------------------------------------------- |
| [Store API](api/store-api.md)                                | Route Handler inventory and schema documentation status.      |
| [Deployment runbook](operations/deployment-runbook.md)       | cPanel release, verification, rollback, and launch checklist. |
| [Environment variables](operations/environment-variables.md) | Configuration inventory and secret-handling rules.            |
| [Backup and restore](operations/backup-and-restore.md)       | Database and deployment backup procedure.                     |
| [Troubleshooting](operations/troubleshooting.md)             | Common local, cPanel, database, and deployment issues.        |

## AI agent guidance

| Document                                               | Description                                         |
| ------------------------------------------------------ | --------------------------------------------------- |
| [Context map](ai/context-map.md)                       | Maps common tasks to the exact first files to read. |
| [Conventions cheatsheet](ai/conventions-cheatsheet.md) | Condensed implementation rules.                     |
| [Task recipes](ai/task-recipes.md)                     | Step-by-step recipes for common development tasks.  |
