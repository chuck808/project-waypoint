# Project Waypoint

Project Waypoint is a digital trail companion that enriches walking by connecting walkers with trails, local businesses, trusted community knowledge, and a personal passport of remembered journeys.

[![Repo](https://img.shields.io/badge/repo-chuck808%2Fproject--waypoint-blue)](https://github.com/chuck808/project-waypoint)
[![License](https://img.shields.io/badge/license-TBD-lightgrey)](#license)

---

## Current Status

This repository is in active early development. Product foundation and blueprints are extensive and mature (see [`docs/`](./docs)); implementation is progressing surface-by-surface, starting with the Walker App.

Per **BP023 – Product Surface Architecture**, Waypoint is one platform expressed through four product surfaces, three of which now have real code:

- **`apps/mobile`** (Walker App, Expo / React Native) — the most developed surface. Has working auth (Supabase), a home screen, a discover flow for trails and places, a full QR check-in journey (scan → resolve → record → already-visited / not-recognised states), a live Passport timeline backed by Supabase, and a MapLibre map spike.
- **`web`** (Public Front Door, SvelteKit) — a small landing page plus `/visit/{token}` invitation resolution, per ADR-004 (QR codes are public invitations, not identifiers).
- **`business`** (Business Portal, SvelteKit) — sign-in and a dashboard that lists the signed-in user's business memberships, locations and current QR invitation codes, respecting RLS-scoped queries.
- **`admin`** (Admin Portal) — planned, not yet started.

Supporting the surfaces:

- **`packages/`** — shared workspace packages: `types` (domain types), `validation` (shared invitation/check-in validation, e.g. Crockford base32 normalisation), `database` (generated Supabase types), `config`, and `ui` (reserved, not yet populated — see BP022 on earning reuse before promoting shared code).
- **`database/`** — SQL migrations and seed data for the initial core schema (regions, trails, businesses, locations, QR codes, check-ins, etc.), supporting the register → browse trail → scan QR → earn passport stamp journey.
- **`supabase/`** — reserved for Supabase CLI project config; currently empty.

Known gaps / in-progress items:

- The `business` app is not yet listed in `pnpm-workspace.yaml`'s package globs — this should be verified before relying on `workspace:*` linking for it.
- `apps/admin` has not been scaffolded yet.
- CI (`.github/workflows/`) has not been set up.

---

## Tech Stack

| Layer                                                    | Choice                                                                            |
| -------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Monorepo tooling                                         | [Turborepo](https://turbo.build/) + [pnpm workspaces](https://pnpm.io/workspaces) |
| Language                                                 | TypeScript                                                                        |
| Walker App (`apps/mobile`)                               | [Expo](https://expo.dev/) / React Native, [MapLibre](https://maplibre.org/)       |
| Public Front Door (`web`) & Business Portal (`business`) | [SvelteKit](https://kit.svelte.dev/)                                              |
| Backend                                                  | [Supabase](https://supabase.com/) (Postgres, PostGIS, RLS, Auth)                  |
| Formatting                                               | Prettier                                                                          |

See [`docs/decisions/`](./docs/decisions) for the Architecture Decision Records explaining these choices.

---

## Repository Structure

```text
project-waypoint/
├── apps/
│   └── mobile/              # Walker App — Expo / React Native (auth, discover, check-in, passport, map)
├── web/                     # Public Front Door — SvelteKit (landing page, /visit/{token})
├── business/                # Business Portal — SvelteKit (sign-in, business/location/QR dashboard)
├── packages/
│   ├── types/                # Shared domain types
│   ├── validation/            # Shared validation (invitation tokens, etc.)
│   ├── database/              # Generated Supabase database types
│   ├── config/                 # Shared configuration
│   └── ui/                      # Shared UI primitives (reserved, not yet populated)
├── database/
│   ├── migrations/            # SQL migrations (initial core schema)
│   └── seeds/                  # Seed data
├── supabase/                # Reserved for Supabase CLI project config (empty)
└── docs/                    # Blueprints (BP001–BP023), ADRs, API & component docs
```

`apps/admin` (Admin Portal) is planned per BP023 but not yet scaffolded.

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
pnpm --filter mobile start      # Walker App (Expo)
pnpm --filter @waypoint/web dev       # Public Front Door
pnpm --filter @waypoint/business dev  # Business Portal
```

---

## Documentation Index

Full documentation lives in [`docs/`](./docs). Key blueprints:

| Blueprint | Title                                          | Status       |
| --------- | ---------------------------------------------- | ------------ |
| BP001     | The Waypoint Charter                           | Draft        |
| BP002     | Product Requirements Document                  | Draft        |
| BP003     | User Personas                                  | Draft        |
| BP004     | User Journeys                                  | Draft        |
| BP005     | Product Feature Catalogue                      | Draft        |
| BP006     | System Architecture                            | Draft        |
| BP007     | Domain Model                                   | Draft        |
| BP008     | Information Architecture                       | Draft        |
| BP009     | Conceptual ERD                                 | Draft        |
| BP010     | Logical Data Model                             | Draft        |
| BP011     | Physical Database Design                       | Draft        |
| BP012     | API Standard & Specification                   | Draft        |
| BP013     | Repository & Development Standards             | Draft        |
| BP014     | Security & Authorisation                       | Draft        |
| BP015     | Experience & Design System                     | Draft        |
| BP016     | Sprint 1 Implementation Plan                   | Draft        |
| BP017     | Sprint 1 Build Book                            | Draft        |
| BP018     | Defining the Waypoint Difference               | Draft        |
| BP019     | The Waypoint Ecosystem                         | Draft        |
| BP020     | Engineering Standards & Development Principles | Draft        |
| BP021     | The Waypoint Memory Graph                      | Draft        |
| BP022     | Evolution Rules                                | Draft        |
| BP023     | Product Surface Architecture                   | Draft        |
| WP000     | Engineering Principles                         | Foundational |

Also see:

- [`docs/decisions/`](./docs/decisions) – Architecture Decision Records (ADR-001 Turborepo, ADR-002 Supabase, ADR-003 Expo — all Accepted; ADR-004 QR Codes as Public Invitations — Proposed)
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
