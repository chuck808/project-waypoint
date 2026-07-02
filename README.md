# Project Waypoint

Project Waypoint is a digital trail companion that enriches walking by connecting walkers with trails, local businesses, trusted community knowledge, and a personal passport of remembered journeys.

[![Repo](https://img.shields.io/badge/repo-chuck808%2Fproject--waypoint-blue)](https://github.com/chuck808/project-waypoint)
[![License](https://img.shields.io/badge/license-TBD-lightgrey)](#license)

---

## Current Status

This repository is in active early development.

- Product foundation and blueprints are complete (see [`docs/`](./docs)).
- The monorepo scaffolding (Turborepo + pnpm workspaces) is in place.
- The mobile app (`apps/mobile`) has an initial Expo shell, theme and base components.
- `apps/admin-portal` and `apps/business-portal` are reserved but not yet started.
- Backend, database and infrastructure directories are scaffolded but largely unimplemented.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Monorepo tooling | [Turborepo](https://turbo.build/) + [pnpm workspaces](https://pnpm.io/workspaces) |
| Language | TypeScript |
| Mobile app | [Expo](https://expo.dev/) / React Native |
| Backend | Supabase (Postgres, Edge Functions, RLS) |
| Formatting | Prettier |

See [`docs/decisions/`](./docs/decisions) for the Architecture Decision Records explaining these choices.

---

## Repository Structure

```text
project-waypoint/
├── apps/
│   ├── mobile/            # Expo / React Native app
│   ├── business-portal/   # Web portal for participating businesses (planned)
│   └── admin-portal/      # Internal admin tooling (planned)
├── packages/
│   ├── ui/                # Shared UI components
│   ├── types/              # Shared TypeScript types
│   ├── validation/         # Shared validation schemas
│   └── config/              # Shared configuration
├── backend/
│   ├── functions/          # Edge functions
│   ├── services/            # Service layer
│   ├── jobs/                 # Scheduled jobs
│   └── webhooks/            # Webhook handlers
├── database/
│   ├── migrations/          # SQL migrations
│   ├── seeds/                # Seed data
│   ├── policies/             # Row Level Security policies
│   ├── functions/            # Database functions
│   └── views/                 # Database views
├── infrastructure/
│   ├── scripts/               # Operational scripts
│   ├── deployment/            # Deployment configuration
│   └── monitoring/            # Monitoring configuration
├── tests/
│   ├── integration/
│   ├── e2e/
│   └── fixtures/
├── docs/                       # Blueprints, ADRs, API & component docs
└── .github/workflows/          # CI (planned)
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [pnpm](https://pnpm.io/) `10.33.1` (see `packageManager` in [`package.json`](./package.json))

### Install

```bash
pnpm install
```

### Common Scripts

Run from the repository root, orchestrated via Turborepo across all workspaces:

```bash
pnpm dev            # run all apps in dev mode
pnpm build          # build all apps and packages
pnpm lint           # lint all apps and packages
pnpm format         # format the repo with Prettier
pnpm format:check   # check formatting without writing changes
```

To work on a single app, use pnpm's `--filter` flag, e.g.:

```bash
pnpm --filter mobile start
```

---

## Documentation Index

Full documentation lives in [`docs/`](./docs). Key blueprints:

| Blueprint | Title | Status |
|---|---|---|
| BP001 | The Waypoint Charter | Draft |
| BP002 | Product Requirements Document | Draft |
| BP003 | User Personas | Draft |
| BP004 | User Journeys | Draft |
| BP005 | Product Feature Catalogue | Draft |
| BP006 | System Architecture | Draft |
| BP007 | Domain Model | Draft |
| BP008 | Information Architecture | Draft |
| BP009 | Conceptual ERD | Draft |
| BP010 | Logical Data Model | Draft |
| BP011 | Physical Database Design | Draft |
| BP012 | API Standard & Specification | Draft |
| BP013 | Repository & Development Standards | Draft |
| BP014 | Security & Authorisation | Draft |
| BP015 | Experience & Design System | Draft |
| BP016 | Sprint 1 Implementation Plan | Draft |
| BP017 | Sprint 1 Build Book | Draft |
| BP018 | Defining the Waypoint Difference | Draft |
| BP019 | The Waypoint Ecosystem | Draft |
| WP000 | Engineering Principles | Foundational |

Also see:

- [`docs/decisions/`](./docs/decisions) – Architecture Decision Records (ADRs)
- [`docs/api/`](./docs/api) – OpenAPI contract and API documentation
- [`docs/components/`](./docs/components) – Reusable component documentation

---

## Contributing

Contribution standards (branch naming, commit style, PR expectations, testing strategy) are defined in **BP013 – Repository & Development Standards**.

In short:

- Use short-lived feature branches, e.g. `feature/passport-stamps`, `bugfix/check-in-validation`, `docs/api-standard`.
- Follow conventional commit-style messages, e.g. `feat: add passport stamp service`.
- Every pull request should explain what changed, why, how it was tested, and whether documentation needs updating.
- Formatting is automated via Prettier — please run `pnpm format` before committing.

---

## License

This project does not yet have a published license (currently marked `UNLICENSED` in [`package.json`](./package.json)). Do not reuse or redistribute code from this repository until a license is added.

---

## Project Principle

Waypoint exists to make the walking experience richer, not more complicated.
