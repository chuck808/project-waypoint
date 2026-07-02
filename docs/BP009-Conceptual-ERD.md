# BP009 – Conceptual ERD

**Project:** Project Waypoint  
**Blueprint:** BP009  
**Version:** 0.1  
**Status:** Draft  
**Author:** Project Waypoint Team  
**Depends On:** BP001–BP008

---

## 1. Purpose

This blueprint defines the conceptual entity relationship model for Project Waypoint.

It identifies the major data entities, their ownership, and their relationships.

This is not a database schema.

---

## 2. Conceptual ERD Overview

```text
User
├── User Profile
├── Passport
│   ├── Earned Stamp
│   ├── Earned Achievement
│   └── Collection Progress
├── Trail Completion
├── Active Walk
├── Community Report
├── Report Confirmation
└── Business Membership

Business
├── Business Location
│   ├── QR Code
│   ├── Business Facility
│   └── Business Check-in
├── Offer
│   └── Offer Redemption
└── Business Membership

Trail
├── Trail Route
├── Trail Completion
├── Trail Facility
├── Trail Point of Interest
├── Community Report
└── Trail Stamp Rule

Region
├── Trail
├── Business Location
└── Collection

Stamp Definition
├── Earned Stamp
├── Trail Stamp Rule
├── Business Stamp Rule
└── Achievement Reward

Community Report
├── Report Confirmation
├── Moderation Action
└── Audit Event
```

---

## 3. Primary Aggregate Roots

| Aggregate Root | Owns |
|---|---|
| User | Profile, Passport, activity, reports |
| Business | Locations, offers, memberships |
| Trail | Route, metadata, related reports |
| Region | Geographic organisation |
| Passport | Earned stamps and personal progress |
| Community Report | Confirmations and moderation state |
| Stamp Definition | Rules for awardable stamps |
| Admin / Moderation | Actions, audit records |

---

## 4. Key Relationship Rules

- A user may exist without a public profile.
- A user may have multiple roles.
- A user may manage multiple businesses.
- A trail may belong to multiple regions.
- A business may have one or more locations.
- A business may participate without offering discounts.
- QR codes usually belong to a business location.
- Check-ins and offer redemptions are separate.
- Stamp definitions and earned stamps are separate.
- A community report must have a location.
- Reports may optionally attach to trails or businesses.
- Audit events should be append-only where possible.

---

## 5. MVP Entity List

Identity:

- User
- User Profile
- User Role

Walking:

- Region
- Trail
- Trail Route
- Active Walk
- Trail Completion
- Trail Facility

Business:

- Business
- Business Location
- Business Membership
- Business Facility
- Offer
- Offer Redemption
- QR Code
- Check-in

Passport:

- Passport
- Stamp Definition
- Earned Stamp
- Achievement Definition
- Earned Achievement

Community:

- Community Report
- Report Confirmation

Moderation:

- Moderation Action
- Audit Event

Notifications:

- Notification

Analytics:

- Aggregated Summary

---

## 6. Deferred Entities

- Clubs
- Events
- Event Registrations
- Paid Subscriptions
- Billing Accounts
- Tourism Organisations
- Sponsored Campaigns
- Advanced Reputation Scores
- Wearable Device Links
- Public API Clients
- Accommodation Bookings
- Messaging Threads

---

## 7. Relationship Decisions

### D-BP009-001

A passport is treated as a first-class entity rather than simply a collection of user activity.

### D-BP009-002

Businesses and business locations are separate entities.

### D-BP009-003

Check-ins and offer redemptions are separate entities.

### D-BP009-004

Stamp definitions and earned stamps are separate entities.

### D-BP009-005

Community reports must have a location but may optionally attach to a trail or business.

---

## 8. Conceptual Diagram

```text
                         ┌──────────────┐
                         │    Region    │
                         └──────┬───────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
          ┌───▼───┐       ┌─────▼─────┐       ┌───▼────┐
          │ Trail │       │ Business  │       │Collection│
          └───┬───┘       └─────┬─────┘       └────┬────┘
              │                 │                  │
      ┌───────▼───────┐  ┌──────▼────────┐         │
      │ Trail Route   │  │BusinessLocation│         │
      └───────────────┘  └──────┬────────┘         │
              │                 │                  │
              │          ┌──────▼──────┐           │
              │          │   QR Code   │           │
              │          └──────┬──────┘           │
              │                 │                  │
┌────────┐    │          ┌──────▼──────┐           │
│  User  │────┼──────────►   Check-in  │           │
└───┬────┘    │          └──────┬──────┘           │
    │         │                 │                  │
    │  ┌──────▼────────┐        │                  │
    │  │TrailCompletion│        │                  │
    │  └──────┬────────┘        │                  │
    │         │                 │                  │
    │         └────────┬────────┘                  │
    │                  │                           │
┌───▼─────┐     ┌──────▼────────┐          ┌──────▼──────┐
│Passport │────►│ Earned Stamp  │◄─────────│StampDefinition│
└───┬─────┘     └───────────────┘          └─────────────┘
    │
    ├──────────► Earned Achievement
    │
    └──────────► Collection Progress


User ─────────► Community Report ─────────► Report Confirmation
                      │
                      ▼
               Moderation Action
                      │
                      ▼
                 Audit Event
```

---

**End of BP009**
