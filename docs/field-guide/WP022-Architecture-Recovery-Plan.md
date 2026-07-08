# WP022 -- Architecture Recovery Plan

> **Status:** Working Document\
> **Purpose:** Recover and document the architecture that already exists
> before adding new architectural concepts.

## Principle

Working, tested implementation has authority.

The purpose of architecture recovery is not to redesign the system. It
is to understand the system clearly enough that future work extends it
safely.

## Why This Exists

Waypoint already has multiple working surfaces:

-   Walker App
-   Public Front Door
-   Business Portal
-   Admin Portal
-   Shared packages
-   Database migrations and seed data

Before adding Field Notes, Living Map behaviour, Steward tools or
expanded commercial features, contributors must understand how the
current implementation actually works.

## Recovery Questions

For every surface, answer:

1.  What does this surface currently do?
2.  Which flows are complete?
3.  Which flows are partially implemented?
4.  Which domain objects does it own?
5.  Which shared packages does it consume?
6.  Which database tables does it rely on?
7.  What assumptions does it make?
8.  Where are the safe extension points?
9.  What should not be disturbed?

## Surfaces to Recover

### Walker App

Priority: Highest.

Recover:

-   Routing structure
-   Authentication flow
-   Home screen
-   Discover flow
-   Trail and place screens
-   QR scan/check-in flow
-   Passport timeline
-   Map implementation
-   Supabase access pattern
-   Error states
-   Loading states
-   Offline assumptions

### Public Front Door

Recover:

-   Landing page
-   Public invitation resolution
-   QR token handling
-   Relationship to ADR-004

### Business Portal

Recover:

-   Authentication
-   Business memberships
-   Location dashboard
-   QR invitation codes
-   RLS-scoped queries

### Admin Portal

Recover:

-   Admin gate
-   Business approval/suspension
-   Trail/region/check-in audit views

### Shared Packages

Recover:

-   `types`
-   `validation`
-   `database`
-   `config`
-   `ui`

The `ui` package should remain reserved unless reuse has genuinely been
earned.

## Output Format

Each recovered module should be documented as:

``` md
## Module Name

### Current Behaviour

### Entry Points

### Dependencies

### Data Used

### Tests

### Known Risks

### Safe Extension Points

### Do Not Change Without Review
```

## Decision Rule

If a future feature cannot be explained in terms of the recovered
architecture, the feature is not ready to build.

## Deliverables

-   Architecture recovery notes for each surface.
-   A dependency map.
-   A data-flow map for QR check-in and Passport.
-   A list of safe MVP extension points.
-   A list of "do not touch casually" areas.
