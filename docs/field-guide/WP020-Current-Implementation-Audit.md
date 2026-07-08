# WP020 -- Current Implementation Audit

> **Status:** Working Document **Purpose:** Understand the existing
> implementation before introducing significant new functionality.

## Guiding Principle

**We do not replace working code with imagination. We extend what
already exists.**

## Audit Objectives

-   Identify what already works.
-   Preserve stable architecture.
-   Avoid unnecessary rewrites.
-   Build on proven foundations.

## Scope

### Mobile (`apps/mobile`)

Review authentication, home, discover, maps, QR check-in, passport,
memories, offline behaviour, synchronisation, accessibility and test
coverage.

For every module record: - Current status - Strengths - Weaknesses -
Technical debt - Recommended action (Preserve / Improve / Refactor /
Replace)

### Business Portal

Dashboard, place management, welcome messages, QR posters, offers,
analytics, visitors and settings.

### Admin Portal

Moderation, stewardship, reporting, configuration and operations.

### Shared Packages

Domain model, shared UI, database, validation, design tokens and
mapping.

## Living Map Readiness

Identify where these fit naturally:

-   Field Notes
-   Official Steward Notes
-   Temporary Conditions
-   Place Timeline
-   Community Verification

## Deliverable

A complete inventory of the current implementation and a prioritised
list of work that extends---rather than replaces---the existing system.
