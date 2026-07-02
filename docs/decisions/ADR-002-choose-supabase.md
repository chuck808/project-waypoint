# ADR-002 – Choose Supabase as the Backend Platform

**Project:** Project Waypoint  
**Status:** Accepted  
**Date:** 2026-07-02  
**Related:** BP006, BP011, BP014

---

## Context

Project Waypoint requires:

- authentication
- PostgreSQL database
- geospatial support
- row-level security
- file storage
- server-side functions
- rapid MVP development
- future scalability

The project should avoid building commodity backend infrastructure before the core product has been validated.

---

## Decision

Project Waypoint will use **Supabase** as the MVP backend platform.

---

## Reasons

Supabase provides:

- PostgreSQL
- PostGIS support
- Supabase Auth
- Row Level Security
- Storage buckets
- Edge Functions
- local development tooling
- strong TypeScript support
- rapid iteration

This aligns well with Waypoint's needs, especially geospatial trail/business discovery, secure access control, QR check-ins, and passport history.

---

## Alternatives Considered

### Custom Node/PostgreSQL backend

Rejected for MVP because it would increase infrastructure work before product validation.

### Firebase

Rejected because Waypoint's domain model is strongly relational and geospatial.

### Appwrite

Considered but rejected because Supabase provides a stronger PostgreSQL-first foundation.

### Hosted PostgreSQL only

Rejected because authentication, storage, RLS tooling and functions would need to be assembled separately.

---

## Consequences

Positive:

- faster MVP delivery
- robust relational model
- strong security primitives
- simpler operational setup

Trade-offs:

- some platform coupling
- Edge Function limitations must be understood
- local development setup must be documented carefully

---

## Architectural Boundary

Client applications should communicate through the Waypoint API/service layer wherever practical.

They should not depend directly upon table structure as a long-term contract.

Supabase is the backend platform, not the product API.

---

## Review Trigger

Revisit this decision if Supabase becomes a bottleneck, RLS policies become unmanageable, offline sync requires different infrastructure, or platform cost/limits become problematic.

---

**End of ADR-002**
