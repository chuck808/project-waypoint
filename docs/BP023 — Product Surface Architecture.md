# BP023 — Product Surface Architecture

**Status:** Draft

**Version:** 1.0

**Author:** Damien & ChatGPT

**Last Updated:** 2026-07-04

---

## Purpose

This blueprint defines the primary product surfaces of Project Waypoint.

Waypoint is not a single application.

It is a platform with multiple surfaces, each serving a different actor while sharing one domain model, one database, and one architectural philosophy.

The purpose of this document is to prevent those surfaces from blurring together as the platform grows.

---

## Guiding Principle

> One platform. Multiple surfaces. Clear responsibilities.

Each surface should serve one audience well.

A walker should never encounter business administration.

A business owner should never need the walker app to manage their venue.

An administrator should never rely on business-facing tools to govern the platform.

---

## Product Surfaces

Waypoint consists of four primary product surfaces.

```text
apps/
  mobile/      # Walker App
  web/         # Public Front Door
  business/    # Business Portal
  admin/       # Admin Portal
```

These are separate applications because they serve different audiences, permission models, deployment concerns, and user journeys.

---

## Shared Core

Although the surfaces are separate, they share the same platform core.

```text
packages/
  database/     # Generated Supabase database types
  types/        # Shared domain types
  validation/   # Shared validation rules
  config/       # Shared configuration and environment helpers
  ui/           # Shared UI primitives when reuse is earned
```

The shared core should contain concepts that genuinely belong to the platform.

It should not become a dumping ground for code that merely appears in more than one application.

Promotion into a shared package should follow BP022: reuse should be earned by a second real consumer.

---

## Surface 1 — Walker App

**Application:** `apps/mobile`
**Technology:** Expo / React Native
**Audience:** Walkers

The Walker App is the primary experience surface.

Its purpose is to help walkers:

* discover trails
* discover nearby places
* check in at participating locations
* build a Passport
* preserve memories
* continue journeys outdoors

The Walker App is concerned with experience.

It should not contain business administration or platform moderation.

---

## Surface 2 — Public Front Door

**Application:** `apps/web`
**Technology:** SvelteKit
**Audience:** Public visitors, prospective walkers, QR scanners without the app

The Public Front Door owns the public domain.

It provides:

* the Waypoint landing page
* public explanation of the product
* `/visit/{publicToken}` invitation resolution
* app install pathways
* future Universal Link / App Link support

This surface exists because ADR-004 makes the visit URL part of Waypoint's permanent public contract.

A Waypoint sign in the physical world must lead somewhere meaningful even when scanned by someone without the mobile app.

The Public Front Door should remain deliberately small until real product needs justify expansion.

---

## Surface 3 — Business Portal

**Application:** `apps/business`
**Technology:** SvelteKit
**Audience:** Business owners, managers, staff

The Business Portal enables participating businesses to operate their Waypoint presence.

Initial responsibilities include:

* signing in
* viewing owned businesses
* managing business locations
* viewing invitation tokens
* printing QR visit invitations
* reviewing privacy-preserving footfall information

The Business Portal is operational, not exploratory.

It should help a café, shop, campsite or attraction understand and maintain its relationship with walkers.

It should not expose walker identity.

---

## Surface 4 — Admin Portal

**Application:** `apps/admin`
**Technology:** SvelteKit
**Audience:** Platform administrators and moderators

The Admin Portal governs the platform.

Initial responsibilities include:

* reviewing businesses
* approving or suspending businesses
* managing trails and regions
* reviewing reported or suspicious activity
* auditing check-in behaviour
* supporting moderation workflows

The Admin Portal has the broadest permissions and should be deployed, reviewed and protected separately from the Business Portal.

An admin mistake should not ship inside business-facing code.

A business portal bug should not expose admin capability.

---

## Domain Layout

The intended production domain structure is:

```text
<domain>                  Public Front Door
business.<domain>         Business Portal
admin.<domain>            Admin Portal
```

The production domain is intentionally left as a placeholder until formally adopted.

Once printed QR signs exist, the domain becomes part of the physical product and must be treated as a permanent public interface.

---

## Why SvelteKit for Web Surfaces

The Business Portal, Admin Portal and Public Front Door should use SvelteKit.

This decision is based on:

* existing production experience with SvelteKit and Supabase
* reduced cognitive overhead
* shared patterns across all web surfaces
* a lightweight full-stack model
* strong suitability for form-heavy portal applications

The objective is not to choose the largest ecosystem.

The objective is to choose the stack the project can operate confidently.

Using the same framework for all web surfaces also allows layout, form, authentication and service patterns to transfer naturally between them.

---

## Why Separate Applications

The portals are separated because they represent different actors.

```text
Walker
  uses mobile

Public visitor
  uses web

Business member
  uses business

Administrator
  uses admin
```

Each actor has distinct goals and permissions.

Combining these surfaces would create unnecessary coupling.

Separate applications allow:

* clearer deployment boundaries
* safer permission models
* simpler navigation
* actor-specific design
* independent release cadence
* better long-term maintainability

---

## Privacy Boundary

Business users should see **footfall, not people**.

Businesses may need to know:

* visits happened
* when visits happened
* which location was visited
* aggregate trends
* whether QR invitations are being used

Businesses should not see:

* walker user IDs
* walker profiles
* personal Passport history
* identity-linked visit trails

This boundary protects the spirit of Waypoint.

Businesses participate in journeys.

They do not own walkers' memories.

Future business visit reporting should therefore use privacy-preserving views or RPCs rather than direct access to raw `check_ins`.

---

## Relationship to the Memory Graph

The product surfaces all interact with the same Memory Graph.

The Walker App creates memories.

The Public Front Door introduces people to the invitation.

The Business Portal maintains places that participate in memories.

The Admin Portal governs the integrity of the graph.

None of these surfaces owns the graph alone.

They each view it from a different responsibility.

---

## Initial Build Order

The recommended build order is:

```text
1. apps/web
   Public landing page and /visit/{token}

2. apps/business
   Business sign-in and owned business view

3. apps/business
   Location and invitation management

4. apps/business
   Printable QR invitation

5. apps/admin
   Basic admin review and moderation
```

This order follows the current platform needs.

The QR invitation public contract should exist before real signs are printed.

Business operations should exist before onboarding real businesses at scale.

Admin tooling should follow once there is operational activity to govern.

---

## First Business Portal Slice

The first Business Portal slice should be deliberately small.

```text
Business Portal v0.1

1. Sign in
2. Read current user's business memberships
3. Display owned business
4. Display locations
5. Display current invitation token
```

No analytics.

No campaign tools.

No offers.

No advanced settings.

The goal is to prove the actor boundary and membership model.

---

## First Public Web Slice

The first Public Front Door slice should also be small.

```text
Public Web v0.1

1. Landing page
2. /visit/{publicToken}
3. Resolve token enough to explain the place
4. Link to mobile app / future app deep link
5. Manual fallback copy
```

This creates the external surface promised by ADR-004.

---

## Consequences

This architecture creates more applications.

That is intentional.

The complexity is real, but it is placed at the correct boundary: product surfaces rather than mixed permissions.

Positive consequences:

* clearer actor separation
* safer permissions
* cleaner deployment
* reusable shared domain
* easier future onboarding
* more coherent platform growth

Trade-offs:

* more app scaffolding
* more deployment targets
* more environment configuration
* stronger need for shared documentation and package discipline

These trade-offs are acceptable because the product actors are genuinely different.

---

## Rules

1. The Walker App remains walker-focused.
2. The Business Portal never exposes walker identity.
3. The Admin Portal is separate from business tooling.
4. The Public Front Door owns permanent invitation URLs.
5. Shared packages contain platform concepts, not convenience dumps.
6. New surfaces must justify their actor and responsibility.
7. Product boundaries should follow permission boundaries.

---

## Summary

Waypoint is one platform expressed through multiple surfaces.

The Walker App creates experiences.

The Public Front Door receives invitations.

The Business Portal supports participating places.

The Admin Portal protects the platform.

Keeping these surfaces separate allows Waypoint to grow without confusing its actors, permissions or purpose.
