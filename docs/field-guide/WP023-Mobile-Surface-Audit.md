# WP023 -- Mobile Surface Audit

> **Status:** Working Document\
> **Scope:** `apps/mobile`\
> **Purpose:** Establish the Walker App as the implementation baseline
> for Waypoint Version 1.

## Position

The mobile app is the most important product surface for MVP.

If Waypoint does not work well in the hands of a walker, every other
surface becomes secondary.

## Audit Priority

Audit in this order:

1.  QR check-in
2.  Passport timeline
3.  Discover
4.  Places
5.  Trails
6.  Map
7.  Authentication
8.  Offline/error behaviour
9.  Visual consistency
10. Accessibility

## Audit Template

For each feature:

``` md
## Feature

### Current User Journey

### Files / Routes

### Data Dependencies

### Current Status

- Working
- Partially working
- Spike
- Not implemented

### Test Status

### Preserve

### Improve

### Risks

### MVP Recommendation
```

## QR Check-in

This is a core Waypoint flow.

It should be preserved unless there is a strong reason to change it.

Audit:

-   Scan entry point
-   Token resolution
-   Recognised invitation state
-   Already visited state
-   Not recognised state
-   Check-in recording
-   Passport update
-   Error handling
-   Deep link handling
-   Camera permissions
-   Haptics/feedback

## Passport Timeline

The Passport is already central to the emotional promise of Waypoint.

Audit:

-   How check-ins appear
-   Whether entries are live-backed
-   Loading and empty states
-   Relationship to places/trails
-   Whether memories are separate or combined

## Discover

Audit:

-   Trails
-   Places
-   Search/filter assumptions
-   Location use
-   Whether the discovery model is route-first or place-first

## Map

Audit:

-   Current MapLibre spike
-   Native map dependencies
-   Location permission flow
-   Performance
-   Offline readiness
-   Layer model
-   Place markers
-   Trail geometry
-   Future Field Note markers

## Field Notes Fit

Do not build Field Notes until the audit identifies the safest insertion
point.

Potential insertion points:

-   Place detail screen
-   Trail detail screen
-   Map marker action
-   Post-check-in prompt
-   Quick action during active walk

Preferred MVP approach:

-   Add Field Notes as a small, structured contribution attached to a
    place, trail segment, or QR location.
-   Avoid free-form social comments in Version 1.
-   Keep submission under 15 seconds.

## MVP Recommendation

The mobile MVP should prove one loop:

``` text
Discover → Visit → Check in → Remember → Contribute
```

Anything that does not strengthen this loop should be deferred.
