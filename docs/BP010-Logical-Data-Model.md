# BP010 – Logical Data Model

**Project:** Project Waypoint  
**Blueprint:** BP010  
**Version:** 0.1  
**Status:** Draft  
**Author:** Project Waypoint Team  
**Depends On:** BP001–BP009

---

## 1. Purpose

This blueprint defines the logical data model for Project Waypoint.

It expands the conceptual ERD from BP009 into logical entities, attributes, relationships, constraints, and business rules.

This is not yet the physical PostgreSQL schema.

---

## 2. Design Principles

The logical data model should:

- preserve clear ownership
- avoid unnecessary duplication
- support the MVP without blocking future expansion
- separate definitions from user-earned records
- separate visits from purchases
- separate businesses from business locations
- protect trust-sensitive activity through audit records
- allow future offline sync
- allow future multi-region and multi-location expansion

---

## 3. Entity Summary

### Identity

- User
- User Profile
- User Role

### Walking

- Region
- Trail
- Trail Region
- Trail Route
- Active Walk
- Trail Completion

### Business

- Business
- Business Location
- Business Membership
- Business Facility
- Offer
- Offer Location
- QR Code
- Check-in
- Offer Redemption

### Passport

- Passport
- Stamp Definition
- Earned Stamp
- Achievement Definition
- Earned Achievement
- Collection
- Collection Progress

### Community

- Community Report
- Report Confirmation

### Moderation

- Moderation Action
- Audit Event

### Notifications

- Notification

### Analytics

- Aggregated Summary

---

## 4. Key Logical Constraints

### Identity

- Each User may have zero or one User Profile.
- Each User should have one Passport.
- Each User may have multiple Roles.

### Trails

- Each Trail must have at least one Region before publication.
- Each published Trail should have one Trail Route.
- A User may complete the same Trail multiple times.

### Businesses

- Each Business may have one or more Business Locations.
- Each Business Location may have many QR Codes.
- Each Business may have many Business Memberships.
- Each Business may have many Offers.

### Check-ins

- A Check-in belongs to one User.
- A Check-in belongs to one Business Location.
- A Check-in may reference one QR Code.
- A Check-in may create one Earned Stamp.

### Offers

- An Offer belongs to one Business.
- An Offer may apply to multiple Business Locations.
- Offer Redemption is separate from Check-in.

### Passport

- A Passport belongs to one User.
- An Earned Stamp belongs to one Passport.
- An Earned Stamp references one Stamp Definition.
- An Earned Achievement belongs to one Passport.

### Community

- A Community Report must have a Location.
- A Community Report may optionally reference a Trail.
- A Community Report may optionally reference a Business Location.
- A Community Report may have many Confirmations.

### Moderation

- Moderation Actions should reference a target.
- Audit Events should be append-only.

---

## 5. MVP Logical Entity List

The MVP should include:

- User
- User Profile
- User Role
- Region
- Trail
- Trail Region
- Trail Route
- Active Walk
- Trail Completion
- Business
- Business Location
- Business Membership
- Business Facility
- Offer
- Offer Location
- QR Code
- Check-in
- Offer Redemption
- Passport
- Stamp Definition
- Earned Stamp
- Achievement Definition
- Earned Achievement
- Community Report
- Report Confirmation
- Moderation Action
- Audit Event
- Notification
- Aggregated Summary

Deferred:

- Collection
- Collection Progress

---

## 6. Open Design Questions

### Q-BP010-001

Should every user automatically receive a Passport at account creation?

Initial recommendation: Yes.

### Q-BP010-002

Should Trail Completion require GPS verification in MVP?

Initial recommendation: No. Support verification status, but allow manual/admin completion for early testing.

### Q-BP010-003

Should QR Codes be static in MVP?

Initial recommendation: Yes. Design for future rotation but avoid complexity early.

### Q-BP010-004

Should Collections be included in MVP?

Initial recommendation: No, unless needed for early passport storytelling.

### Q-BP010-005

Should Business Facilities and Trail Facilities share a facility definition table?

Initial recommendation: Possibly in the physical model. Keep conceptually separate for clarity.

---

**End of BP010**
