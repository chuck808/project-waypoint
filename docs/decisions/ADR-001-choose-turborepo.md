# ADR-001 – Choose Turborepo for the Monorepo

**Project:** Project Waypoint  
**Status:** Accepted  
**Date:** 2026-07-02  
**Related:** BP013 – Repository & Development Standards

---

## Context

Project Waypoint contains multiple applications and shared packages:

- Mobile app
- Business portal
- Admin portal
- Shared types
- Shared validation
- Shared UI components
- Backend functions and services

These parts need to evolve together while remaining independently understandable.

---

## Decision

Project Waypoint will use **Turborepo** with **pnpm workspaces**.

---

## Reasons

Turborepo provides:

- fast task orchestration
- workspace-aware builds
- caching
- clear task pipelines
- good TypeScript monorepo support
- minimal configuration

pnpm provides:

- efficient dependency installation
- workspace linking
- predictable package management
- good monorepo ergonomics

---

## Alternatives Considered

### Separate repositories

Rejected because it would create unnecessary coordination overhead.

### Nx

Rejected for now because it introduces more structure and tooling than the project currently needs.

### npm/yarn workspaces only

Rejected because task orchestration and caching would need to be added separately.

---

## Consequences

Positive:

- shared packages can be reused cleanly
- applications can evolve together
- CI can run only affected tasks
- repository structure remains explicit

Trade-offs:

- contributors must understand workspace concepts
- root-level tooling requires care
- package boundaries must be maintained deliberately

---

## Review Trigger

Revisit this decision if build orchestration becomes difficult or another tool offers a compelling maintainability advantage.

---

**End of ADR-001**
