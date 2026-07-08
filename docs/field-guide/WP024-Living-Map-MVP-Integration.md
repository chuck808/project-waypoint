# WP024 -- Living Map MVP Integration

> **Status:** Proposal\
> **Purpose:** Define the smallest buildable version of the Living Map
> concept.

## Definition

The Living Map is not a social feed.

It is a place-aware layer of current, useful observations contributed by
explorers and stewards.

## MVP Scope

Version 1 should include only three kinds of map intelligence:

1.  Places
2.  Field Notes
3.  Official Steward Notes

Everything else is deferred.

## Field Notes

A Field Note is a structured observation.

Examples:

-   Very boggy today
-   Bridge slippery
-   Tree down
-   Livestock in field
-   Water source dry
-   Café closed early
-   Toilets open
-   Dogs welcome
-   Great view in clear weather

## Field Note Properties

Minimum viable model:

``` ts
type FieldNote = {
  id: string
  placeId?: string
  trailId?: string
  locationId?: string
  category: FieldNoteCategory
  message?: string
  severity: "info" | "watch" | "hazard"
  observedAt: string
  expiresAt?: string
  createdBy: string
  visibility: "public" | "private"
  source: "explorer" | "steward" | "admin"
}
```

## Categories

Initial categories:

-   Mud / bog
-   Bridge / stile / gate
-   Fallen tree
-   Livestock
-   Water
-   Weather
-   Access
-   Facilities
-   Welcome
-   Viewpoint
-   Other

## Expiry

Field Notes must age naturally.

Suggested defaults:

  Category                            Default expiry
  ----------------------- --------------------------
  Mud / bog                                 48 hours
  Weather                                   12 hours
  Fallen tree                                 7 days
  Bridge / stile / gate     Until confirmed resolved
  Facilities                                24 hours
  Welcome                                    30 days
  Viewpoint                                   7 days

## Steward Notes

A Steward Note is an official update from a verified place manager or
organisation.

Examples:

-   South meadow closed today
-   Path repairs underway
-   Café open late for walking festival
-   Temporary diversion in place
-   Cattle grazing in upper field

Steward Notes should be visually distinct but not overpower explorer
observations.

## Anti-goals

Do not build in MVP:

-   Comments
-   Likes
-   Followers
-   Public user profiles
-   Rankings
-   Sponsored visibility
-   AI-generated observations
-   Complex moderation workflows

## Display Rules

The map should show the most relevant notes first.

Priority order:

1.  Safety hazards
2.  Access issues
3.  Official Steward Notes
4.  Recent conditions
5.  Facilities
6.  General observations

## MVP User Journey

``` text
Explorer sees place
↓
Explorer visits
↓
Explorer checks in
↓
Waypoint asks: "Anything useful for the next walker?"
↓
Explorer taps "Very boggy"
↓
Field Note appears on the place/map
↓
Another explorer sees it before arriving
```

## Steward Journey

``` text
Explorer reports issue
↓
Steward sees note in portal
↓
Steward publishes official update
↓
Explorers see trusted current information
```

## Build Rule

The first implementation should be boring.

No clever automation.

No complex reputation system.

No advanced AI.

Make it reliable, understandable and useful.
