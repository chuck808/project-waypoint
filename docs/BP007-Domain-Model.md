# BP007 – Domain Model

**Project:** Project Waypoint  
**Blueprint:** BP007  
**Version:** 0.1  
**Status:** Draft  
**Author:** Project Waypoint Team  
**Depends On:** BP001, BP002, BP003, BP004, BP005, BP006

---

## 1. Purpose

This blueprint defines the core product language of Project Waypoint.

It describes the main domains, entities and relationships that exist within the product.

This is not a database schema.

---

## 2. Domain Overview

Waypoint is organised around eight primary domains:

```text
Identity
Walking
Discovery
Business
Passport
Community
Moderation
Analytics
```

---

## 3. Identity Domain

### User

A person with an account in Waypoint.

A user may be a walker, business user, moderator, administrator, or have multiple roles.

### User Profile

The public or semi-public representation of a user.

Includes display name, avatar, home region, walking preferences, and passport summary.

### Role

Defines what a user is permitted to do.

Core roles:

- walker
- business_user
- moderator
- admin

---

## 4. Walking Domain

### Trail

A recognised walking experience.

A trail is more than a GPX file. It represents a walkable experience with context, description, difficulty and meaning.

### Region

A geographical grouping used to organise trails, businesses and collections.

### Trail Route

The route geometry associated with a trail.

### Active Walk

A walk currently being undertaken by a user.

### Trail Completion

Evidence that a user has completed a trail.

---

## 5. Discovery Domain

### Point of Interest

A place worth noticing, such as a viewpoint, waterfall, historical site, honesty box, picnic spot, or landmark.

### Facility

A practical resource useful to walkers, such as water, toilets, parking, shelter, charging point, or dog-friendly space.

### Location

A geographical position attached to trails, businesses, reports, facilities, points of interest, or QR codes.

---

## 6. Business Domain

### Business

An organisation or place that participates in Waypoint.

### Business Location

A physical place associated with a business.

### Business User

A user who can manage one or more businesses.

### Offer

A reward, benefit or invitation made available by a business.

### Offer Redemption

A record that a user has claimed or used an offer.

### QR Code

A scannable code used to verify a visit, claim a stamp or redeem an offer.

---

## 7. Passport Domain

### Passport

The user's long-term record of walking experiences.

### Stamp Definition

The reusable definition of a stamp.

### Earned Stamp

A stamp awarded to a specific user.

### Achievement

A milestone or accomplishment recognised by Waypoint.

### Collection

A themed group of trails, stamps, businesses or achievements.

---

## 8. Community Domain

### Community Report

A practical update submitted by a user.

### Report Confirmation

A contribution from another user indicating that a report is accurate, inaccurate or resolved.

### Community Contribution

A general record of useful information added by a user.

---

## 9. Moderation Domain

### Moderation Queue

A list of items requiring review.

### Moderation Action

A decision made by a moderator or administrator.

### Audit Event

A permanent record of significant system activity.

---

## 10. Analytics Domain

### User Activity Summary

Aggregated information about a user's walking history.

### Business Activity Summary

Aggregated information about business engagement.

### Platform Activity Summary

Aggregated information about the health of Waypoint.

---

## 11. Key Relationships

A user may have one profile, many roles, many trail completions, many earned stamps, many reports, many confirmations, and many business memberships.

A trail may belong to one or more regions, have one route, many completions, many reports, many nearby businesses, many points of interest, and award stamps.

A business may have many locations, users, offers, QR codes, check-ins, stamps, and analytics.

A passport belongs to one user and may contain many earned stamps, completed trails, achievements, and collections.

A report belongs to one user and one location, and may optionally reference a trail, business, or facility.

---

## 12. Entity Lifecycle Examples

### Trail Completion

```text
Not Started
        ↓
Active
        ↓
Completed
        ↓
Verified
        ↓
Stamp Awarded
        ↓
Achievement / Collection Progress Updated
```

### Business Onboarding

```text
Application Started
        ↓
Submitted
        ↓
Under Review
        ↓
Approved / Rejected
        ↓
Visible to Walkers
        ↓
Active Partner
```

### Community Report

```text
Submitted
        ↓
Visible / Pending Review
        ↓
Confirmed / Disputed
        ↓
Resolved / Expired / Removed
```

### Offer

```text
Draft
        ↓
Active
        ↓
Redeemed
        ↓
Paused / Expired
```

---

## 13. Domain Rules

- A user account should not imply a public profile.
- A business may exist before it is approved.
- A business may participate without offering a discount.
- A QR check-in does not always imply a purchase.
- A stamp should be awarded only after a meaningful event.
- Reports should not remain visible forever without confirmation.
- Analytics should be aggregated where possible.
- Admin actions should be auditable.
- Personal user data should be minimised.
- Community trust should be protected through verification and moderation.

---

**End of BP007**
