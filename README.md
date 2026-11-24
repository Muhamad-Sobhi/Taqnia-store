# Taqnia Store

- **Purpose:** Introduce the Taqnia Store project and its documentation.
- **Audience:** Taqnia stakeholders, developers, and approved contributors.
- **Last updated:** 2026-11-24
- **Related docs:** [Project brief](docs/00-overview/project-brief.md), [Documentation index](docs/README.md), [AGENTS.md](AGENTS.md)

Taqnia Store is a bilingual e-commerce platform for IT equipment and networking products at `store.taqnia-eg.net`. The corporate website at `taqnia-eg.net` is a separate WordPress property and is not part of this repository's deployment.

## Project status

This repository is being bootstrapped incrementally. See [the roadmap](docs/00-overview/roadmap.md) for milestones and [the hosting report](docs/architecture/hosting-and-deployment.md) for current GoDaddy verification and open questions.

## Quick start

```bash
cd apps/store
npm ci
npm run dev
```

See [the store app README](apps/store/README.md) for available commands and environment setup.

## Documentation

Start with [the documentation index](docs/README.md) and [AGENTS.md](AGENTS.md).

## Hosting and privacy

The store is intended to run as the only Node.js application in the existing GoDaddy cPanel slot. Do not modify the corporate WordPress site. Keep this repository private and never commit secrets.
